import * as Encoding from 'encoding-japanese';

/**
 * @typedef {number[]} Inst
 *
 * @typedef {(
 *   rT: number,
 *   rA: number,
 *   D: number,
 * ) => Inst} InstD
 * @typedef {(
 *   rS: number,
 *   rA: number,
 *   D: number,
 * ) => Inst} InstDS
 *
 * @typedef {(
 *   rA: number,
 *   rS: number,
 *   SH: number,
 *   MB: number,
 *   ME: number,
 *   Rc: number|boolean,
 * ) => Inst} InstM
 *
 * @typedef {(
 *   rT: number,
 *   rA: number,
 *   rB: number,
 *   Rc: number|boolean,
 * ) => Inst} InstX
 * @typedef {(
 *   rS: number,
 *   rA: number,
 *   rB: number,
 *   Rc: number|boolean,
 * ) => Inst} InstXS
 *
 * @typedef {(
 *   LL: number,
 *   LK: number|boolean,
 *   AA?: number|boolean,
 * ) => Inst} InstI
 */

/** @param {number} inst */
export const makeInst = (inst) => {
  // const buf = Inst.alloc(4);
  // buf.writeUint32BE(inst >>> 0);
  // return buf;
  return [inst];
};
/**
 * @param {number} op
 * @param {number} rT
 * @param {number} rA
 * @param {number} D
 */
const InstD = (op, rT, rA, D) =>
  makeInst(((op & 0x3f) << 26) | ((rT & 0x1f) << 21) | ((rA & 0x1f) << 16) | (D & 0xffff));
/**
 * @param {number} op
 * @param {number} rT
 * @param {number} rA
 * @param {number} rB
 * @param {number} op2
 * @param {number} Rc
 */
const InstX = (op, rT, rA, rB, op2, Rc) =>
  makeInst(
    ((op & 0x3f) << 26) |
      ((rT & 0x1f) << 21) |
      ((rA & 0x1f) << 16) |
      ((rB & 0x1f) << 11) |
      ((op2 & 0x3ff) << 1) |
      Rc,
  );
/**
 * @param {number} op
 * @param {number} RS
 * @param {number} RA
 * @param {number} SH
 * @param {number} MB
 * @param {number} ME
 * @param {number} Rc
 */
const InstM = (op, RA, RS, SH, MB, ME, Rc) =>
  makeInst(
    ((op & 0x3f) << 26) |
      ((RS & 0x1f) << 21) |
      ((RA & 0x1f) << 16) |
      ((SH & 0x1f) << 11) |
      ((MB & 0x1f) << 6) |
      ((ME & 0x1f) << 1) |
      Rc,
  );
/**
 * @param {number} op
 * @param {number} LL
 * @param {number} AA
 * @param {number} LK
 */
const InstI = (op, LL, AA, LK) =>
  makeInst(((op & 0x3f) << 26) | ((LL & 0xffffff) << 2) | ((AA & 1) << 1) | (LK & 1));

/** @type {(op: number) => InstD} */
const makeInstD = (op) => (rT, rA, D) => InstD(op, rT, rA, D);
/** @type {(op: number) => InstDS} */
const makeInstDS = (op) => (rA, rS, D) => InstD(op, rA, rS, D);
/** @type {(op: number, op2: number) => InstX} */
const makeInstX = (op, op2) => (rT, rA, rB, Rc) => InstX(op, rT, rA, rB, op2, +Rc);
/** @type {(op: number, op2: number) => InstXS} */
const makeInstXS = (op, op2) => (rA, rS, rB, Rc) => InstX(op, rA, rS, rB, op2, +Rc);
/** @type {(op: number) => InstM} */
const makeInstM = (op) => (rA, rS, SH, MB, ME, Rc) => InstM(op, rA, rS, SH, MB, ME, +Rc);
/** @type {(op: number) => InstI} */
const makeInstI = (op) => (LL, LK, AA = 0) => InstI(op, LL >> 2, +AA, +LK);

export const ASM = {
  // store rT, rA, D
  stb: makeInstD(38),
  sth: makeInstD(44),
  stw: makeInstD(36),
  stfs: makeInstD(52),
  stfd: makeInstD(54),
  stwu: makeInstD(37),
  // load rS, rA, D
  lbz: makeInstD(34),
  lhz: makeInstD(40),
  lwz: makeInstD(32),
  lfs: makeInstD(48),
  // li rT, D
  addi: makeInstD(14),
  li: (/**@type{number}*/ rT, /**@type{number}*/ D) => InstD(14, rT, 0, D),
  addis: makeInstD(15),
  lis: (/**@type{number}*/ rT, /**@type{number}*/ D) => InstD(15, rT, 0, D),
  // ori rA, rS, D
  ori: makeInstDS(24),
  // or rA, rS, rB, flag
  or: makeInstXS(31, 444),
  mr: (/**@type{number}*/ rT, /**@type{number}*/ rA, flag = 0) => InstX(31, rA, rT, rA, 444, flag),
  // mask
  rlwinm: makeInstM(21),
  // b
  b: makeInstI(18),
  // mflr
  mflr: (/**@type{number}*/ rT) => InstX(31, rT, 8, 0, 339, 0),
  mfctr: (/**@type{number}*/ rT) => InstX(31, rT, 9, 0, 339, 0),
  // mtlr
  mtlr: (/**@type{number}*/ rS) => InstX(31, rS, 8, 0, 467, 0),
  mtctr: (/**@type{number}*/ rS) => InstX(31, rS, 9, 0, 467, 0),
  // cr
  crset: (/**@type{number}*/ B) => InstX(19, B, B, B, 289, 0),
  crclr: (/**@type{number}*/ B) => InstX(19, B, B, B, 193, 0),
};

/**
 * @param {number} rT
 * @param {number} D
 */
export function liDX(rT, D) {
  if (-0x8000 <= D && D < 0x8000) {
    return ASM.li(rT, D);
  } else if ((D & 0xffff) === 0) {
    return ASM.lis(rT, D >>> 16);
  } else {
    const h = D >>> 16;
    const l = D & 0xffff;
    return [...ASM.lis(rT, h), ...ASM.ori(rT, rT, l)];
  }
}

/** @param {string} s */
export function strlen(s) {
  const fmtbuf = Encoding.convert(Encoding.stringToCode(s), 'SJIS');
  return fmtbuf.length; // not NUL terminated
}

/** @param {string} s */
export function str2inst(s) {
  const fmtbuf = Encoding.convert(Encoding.stringToCode(s), 'SJIS');
  fmtbuf.push(0); // NUL terminated
  const fmtlen = fmtbuf.length;
  const fmtlen3 = fmtlen & 3;
  const pad = fmtlen3 ? 4 - fmtlen3 : 0;
  fmtbuf.push(...Array(pad).fill(0));
  const dv = new DataView(Uint8Array.from(fmtbuf).buffer);
  const insts = Array((fmtlen + pad) >> 2)
    .fill(0)
    .map((_, i) => dv.getUint32(i << 2, false));
  return insts;
}

/** @param {number} pc */
export function makeProgram(pc) {
  /** @type {Inst[]} */
  const bufs = [];
  return {
    pc,
    /**
     * @param {number} dst
     * @param {boolean} LL
     */
    b(dst, LL = false) {
      // TODO check overflow
      this.push(ASM.b(dst - this.pc, LL));
    },
    /** @param {number} dst */
    bl(dst) {
      this.b(dst, true);
    },
    /** @param {Inst[]} codes */
    push(...codes) {
      bufs.push(...codes);
      this.pc += codes.reduce((a, e) => a + e.length, 0) << 2;
    },
    dump: () => bufs.flatMap((e) => e),
  };
}

/** @param {number} x */
export const inst2gecko = (x) => (x >>> 0).toString(16).toUpperCase().padStart(8, '0');
