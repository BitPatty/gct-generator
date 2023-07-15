import { ASM, $load, insts2hex, str2hex, getDrawTextOpt, getFillRectParams } from '../asm.js';
import { addrs } from '../addrs.js';
import { rTmp, fTmp } from './loader.js';
import { bases } from './fields.js';

/**
 * @typedef {import('./loader.js').Loader} Loader
 * @typedef {Parameters<Loader['asm']>[0]} GameVersion
 * @typedef {ReturnType<Loader['asm']>[number]} ASMInst
 * @typedef {(typeof import('./fields.js').fieldDB)[string]} Field
 *
 * @typedef {{type: 'reg', num: number}} LoadDstReg
 * @typedef {{type: 'stack', off: number}} LoadDstStack
 * @typedef {LoadDstReg|LoadDstStack} LoadDst
 * @typedef {{
 *   dtype: Loader['dtype'],
 *   base: keyof typeof import('./fields').bases,
 *   offset: number,
 *   postprocess?: (rT: number)=>ASMInst[]
 * }} DirectLoader
 */

/**
 * @param {GameVersion} version
 * @param {Parameters<getDrawTextOpt>[0]} opt
 * @param {string} fmt
 * @param {Field[]} fields
 */
export function drawText(version, opt, fmt, fields) {
  /** @type {ASMInst[]} */
  const insts = [];

  let gpr = 5;
  let fpr = 1;
  let sp = 8;
  /** @type {Map<DirectLoader['base'], ({dst: LoadDst} & Pick<DirectLoader, 'dtype'|'offset'|'postprocess'>)[]>} */
  const simples = new Map();
  /** @type {{asm: Loader['asm'], dst: LoadDstStack, dtype: Loader['dtype']}[]} */
  const callingStacks = [];
  /** @type {{asm: Loader['asm'], dst: LoadDstReg, dtype: Loader['dtype']}[]} */
  const callingRegs = [];
  /** @type {{asm: Loader['asm'], dst: LoadDst, dtype: Loader['dtype']}[]} */
  const directs = [];
  for (const entry of fields) {
    const { dtype } = entry;
    const isFloat = dtype === 'float';
    /** @type {LoadDst} */
    let dst;
    if (isFloat && fpr <= 8) {
      dst = { type: 'reg', num: fpr++ };
    } else if (!isFloat && gpr <= 10) {
      dst = { type: 'reg', num: gpr++ };
    } else {
      if (isFloat) sp = ((sp + 7) >> 3) << 3;
      dst = { type: 'stack', off: sp };
      sp += isFloat ? 8 : 4;
    }
    // push
    if ('asm' in entry) {
      const { asm, calling } = entry;
      (calling ? (dst.type === 'stack' ? callingStacks : callingRegs) : directs).push({
        dtype,
        asm,
        dst,
      });
    } else {
      const { base, offset, postprocess } = entry;
      const item = { dst, dtype, offset, postprocess };
      const arr = simples.get(base);
      if (arr == null) {
        simples.set(base, [item]);
      } else {
        arr.push(item);
      }
    }
  }

  insts.push(...callingStacks.flatMap((inst) => inst.asm(version, inst.dst)));

  const callingRegLast = callingRegs.pop();
  /** @type {ASMInst[]} */
  const instsLoadFromStack = [];
  callingRegs.forEach((inst) => {
    const isFloat = inst.dtype === 'float';
    if (isFloat) sp = ((sp + 7) >> 3) << 3;
    insts.push(...inst.asm(version, { type: 'stack', off: sp }));
    instsLoadFromStack.push((isFloat ? ASM.lfd : ASM.lwz)(inst.dst.num, 1, sp));
    sp += isFloat ? 8 : 4;
  });
  // last
  if (callingRegLast) {
    insts.push(...callingRegLast.asm(version, callingRegLast.dst));
  }
  // load from stack
  insts.push(...instsLoadFromStack);

  // directs
  insts.push(...directs.flatMap((inst) => inst.asm(version, inst.dst)));

  // simples
  const rBase = 3;
  for (const [base, items] of simples.entries()) {
    // load base
    insts.push(...bases[base](rBase, version));
    // load all var
    for (const { dtype, offset, dst, postprocess } of items) {
      if (dst.type === 'stack') {
        insts.push(
          $load[dtype](rTmp, rBase, offset),
          ...(postprocess?.(rTmp) ?? []),
          (dtype === 'float' ? ASM.stfd : ASM.stw)(rTmp, 1, dst.off),
        );
      } else {
        insts.push($load[dtype](dst.num, rBase, offset), ...(postprocess?.(dst.num) ?? []));
      }
    }
  }

  // r3 = drawTextOpt
  insts.push({ type: 'struct', reg: 3, hex: insts2hex(getDrawTextOpt(opt)) });
  // r4 = fmt
  insts.push({ type: 'struct', reg: 4, hex: str2hex(fmt, version) });

  // call
  insts.push({ type: 'call', addr: addrs.drawText });
  return { insts, sp };
}

/**
 * @param {GameVersion} version
 * @param {Parameters<getFillRectParams>[0]} config
 * @param {Parameters<getFillRectParams>[1]} size
 * @returns {ASMInst[]}
 */
export const fillRect = (version, config, size) => [
  // r3, r4 = opt
  { type: 'struct', reg: 3, hex: insts2hex(getFillRectParams(config, size)) },
  // call
  { type: 'call', addr: addrs.fillRect[version], prep: [ASM.addi(4, 3, 0x10)] },
];
