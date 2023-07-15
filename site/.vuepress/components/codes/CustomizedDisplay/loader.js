import { ASM, $load, $store } from '../asm.js';
import { assemble } from './assembler.js';

export const rTmp = 12;
export const fTmp = 12;

/**
 * @typedef {Parameters<import('./assembler.js').assemble>[0] extends (infer U)[] ? U : never} ASMInst
 * @typedef {'GMSJ01'|'GMSJ0A'|'GMSE01'|'GMSP01'} GameVersion
 * @typedef {{type: 'reg', num: number}} LoadDstReg
 * @typedef {{type: 'stack', off: number}} LoadDstStack
 * @typedef {LoadDstReg|LoadDstStack} LoadDst
 * @typedef {{
 *   asm(version: GameVersion, dst: LoadDst): ASMInst[]
 *   dtype: 8|16|-16|32|-32|'float'
 *   calling: boolean
 * }} Loader
 */

/**
 * @param {Loader['dtype']} dtype
 * @param {(reg: number, version: GameVersion)=>ASMInst[]} load
 * @param {(rD: number, version: GameVersion)=>ASMInst[]} [postprocess]
 * @returns {Loader['asm']}
 */
export const makeDirectLoaderASM = (dtype, load, postprocess) => (version, dst) => {
  const { type } = dst;
  if (type == 'reg') {
    const { num } = dst;
    return [...load(num, version), ...(postprocess?.(num, version) ?? [])];
  } else {
    const { num, st } =
      dtype === 'float' ? { num: fTmp, st: ASM.stfd } : { num: rTmp, st: ASM.stw };
    return [...load(num, version), ...(postprocess?.(num, version) ?? []), st(num, 1, dst.off)];
  }
};

/**
 * @param {Loader['dtype']} dtype
 * @param {(version: GameVersion)=>ASMInst[]} load
 * @returns {Loader['asm']}
 */
export const makeFunctionLoaderASM = (dtype, load) => (version, dst) => {
  const { type } = dst;
  const base = load(version);
  if (type == 'reg') {
    const { num } = dst;
    if (dtype === 'float') {
      return num === 1 ? base : [...base, ASM.fmr(num, 1)];
    } else {
      return num === 3 ? base : [...base, ASM.mr(num, 3)];
    }
  } else {
    const { off } = dst;
    return [...base, dtype === 'float' ? ASM.stfd(1, 1, off) : ASM.stw(3, 1, off)];
  }
};

/**
 * @param {Loader['dtype']} dtype
 * @param {(version: GameVersion)=>ASMInst[]} load
 * @returns {Loader}
 */
export const makeFunctionLoader = (dtype, load) => ({
  dtype,
  asm: makeFunctionLoaderASM(dtype, load),
  calling: true,
});
