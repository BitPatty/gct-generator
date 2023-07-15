import { ASM, liDX, makeProgram, insts2hex } from '../asm.js';
import { splitArray } from '../utils.js';

/**
 * @typedef {number} Inst
 * @typedef {{type: 'call', addr: number, prep?: Inst[]}} CallInst -- function call instruction
 * @typedef {{type: 'struct', reg: number, hex: string}} LoadStructInst -- struct pointer load instruction
 * @typedef {Inst|CallInst|LoadStructInst} ASMInst
 */

/**
 * @param {ASMInst[]} insts
 * @param {number} stackFrameSize
 */
export function assemble(insts, stackFrameSize) {
  const rAddr = 12;
  const rData = 31;

  /**
   * [0]: data
   * [.]: body
   */
  const p = makeProgram(0);

  /** @type {Map<number, Map<string, number>>} */
  const callCounts = new Map(); // [addr][prep] = count
  /** @type {Set<string>} */
  const structDB = new Set();

  // summarize data
  let hasRepeatCall = false;
  let loadStructCount = 0;
  let sizeWithoutBLTrick = 0; // # of instruction
  for (const inst of insts) {
    if (typeof inst === 'number') continue;
    const { type } = inst;
    if (type === 'call') {
      const { addr, prep = [] } = inst;
      const prepKey = insts2hex(prep);
      const prepCounts = callCounts.get(addr);
      if (prepCounts == null) {
        callCounts.set(addr, new Map([[prepKey, 1]]));
      } else {
        prepCounts.set(prepKey, (prepCounts.get(prepKey) ?? 0) + 1);
        hasRepeatCall = true;
      }
    } else if (type === 'struct') {
      const { hex } = inst;
      structDB.add(hex);
      loadStructCount++;
      sizeWithoutBLTrick += ((hex.length + 7) >>> 3) + 2; // bl L; mflr
    }
  }

  const useSharedCall = hasRepeatCall || callCounts.size > 2;
  const sizeWithBLTrick =
    ((Array.from(structDB.entries()).reduce((a, [hex]) => a + hex.length, 0) + 7) >>> 3) +
    loadStructCount + // addi rReg, rData, off
    (stackFrameSize > 0 ? 0 : 2) +
    (useSharedCall ? 0 : 1) +
    3; // stw, mflr, lwz
  const useBLTrick = sizeWithBLTrick < sizeWithoutBLTrick;

  /** @type {Map<number, {fallback: number, preps: Map<string, number>}>} */
  const offFuncs = new Map();
  /** @type {number|null} */
  let offCall = null;
  /** @type {Map<string, number>} */
  const offStructs = new Map();

  if (useSharedCall) {
    let off = 0;
    /** @type {string[]} */
    const funcHexs = [];
    for (const [addr, prepCounts] of callCounts.entries()) {
      // put repeated call only
      if (Array.from(prepCounts).reduce((a, [k, c]) => a + c, 0) <= 1) continue;
      /** @type {Map<string, number>} */
      const preps = new Map();
      const prepKeys = Array.from(prepCounts.keys()).filter((k) => k !== '');
      let hex = '';
      // TODO optimize only when one prep (excluding '') is used
      if (prepKeys.length === 1) {
        const [prep] = prepKeys;
        preps.set(prep, off);
        hex += prep;
      }
      offFuncs.set(addr, { fallback: off + hex.length / 2, preps });
      // liDX addr
      hex += insts2hex(liDX(rAddr, addr));
      // b call
      off += 4 + hex.length / 2;
      // push
      funcHexs.push(hex);
    }
    const offDst = Math.max(0, off - 4);
    offCall = offDst;

    // make data
    /** callX: */
    funcHexs.forEach((hex, i, arr) => {
      p.pushHex(hex);
      // b call # except the last 1
      if (i < arr.length - 1) {
        p.b(offDst);
      }
    });
    /** call: */
    p.push(ASM.mtctr(rAddr), ASM.bctr());
  }

  // add struct data
  if (useBLTrick) {
    // [4-byte aligned data, chars data]
    const [aligned, chars] = splitArray(structDB, (hex) => hex.length % 8 === 0);
    for (const data of [aligned, chars]) {
      for (const hex of data) {
        offStructs.set(hex, p.pc);
        p.pushHex(hex);
      }
    }
    // make 4-byte alignment
    p.align();
  }

  // make body
  const dataSize = p.pc;
  /** mflr rData */
  if (useBLTrick) p.push(ASM.mflr(rData));
  /** for each ASM instructions */
  for (const inst of insts) {
    if (typeof inst === 'number') {
      p.push(inst);
    } else if (inst.type === 'call') {
      const { prep = [], addr } = inst;
      const prepKey = insts2hex(prep);
      const off = offFuncs.get(addr);
      if (off == null) {
        // fallback to prepare and load addr manually
        p.push(...prep, ...liDX(rAddr, addr));
        // call
        if (offCall == null) {
          p.push(
            // mtctr rAddr
            ASM.mtctr(rAddr),
            // bctrl
            ASM.bctr(true),
          );
        } else {
          p.bl(offCall);
        }
      } else {
        // bl to callX directly
        const { fallback, preps } = off;
        const dst = preps.get(prepKey);
        if (dst == null) {
          // fallback to prepare manually
          p.pushHex(prepKey);
          p.bl(fallback);
        } else {
          // bl to dst directly
          p.bl(dst);
        }
      }
    } else if (inst.type === 'struct') {
      const { reg, hex } = inst;
      const off = offStructs.get(hex);
      if (off == null) {
        // fallback to use BL trick here
        /** bl L */
        const d = ((hex.length + 7) >> 3) << 2;
        p.push(ASM.b(4 + d, true));
        /** (data) */
        p.pushHex(hex);
        p.align();
        /** L: mflr rReg */
        p.push(ASM.mflr(reg));
      } else {
        // use addi directly
        p.push(ASM.addi(reg, rData, off));
      }
    }
  }

  /** @type {Inst[]} */
  const prologue = [];
  if (useBLTrick) stackFrameSize += 4; // for r31
  if (stackFrameSize > 0) {
    // stack frame size: 16-byte align
    stackFrameSize = ((stackFrameSize + 0xf) >> 4) << 4;
    // stwu r1
    prologue.push(ASM.stwu(1, 1, -stackFrameSize));
    if (useBLTrick) {
      // stw r31
      prologue.push(ASM.stw(31, 1, stackFrameSize - 4));
    }
  }
  if (useSharedCall || useBLTrick) {
    prologue.push(ASM.b(4 + dataSize, true));
  }

  /** @type {Inst[]} */
  const epilogue = [];
  if (stackFrameSize > 0) {
    if (useBLTrick) {
      // lwz r31
      epilogue.push(ASM.lwz(31, 1, stackFrameSize - 4));
    }
    // addi r1
    epilogue.push(ASM.addi(1, 1, stackFrameSize));
  }

  return insts2hex(prologue) + p.hex + insts2hex(epilogue);
}
