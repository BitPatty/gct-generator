import { ASM } from '../asm.js';
import { makeDirectLoaderASM, makeFunctionLoader, rTmp, fTmp } from './loader.js';
import { addrs, r13offs } from '../addrs.js';

/**
 * @typedef {ReturnType<import('./loader.js').makeFunctionLoader>} Loader
 * @typedef {ReturnType<Loader['asm']>[number]} ASMInst
 * @typedef {Parameters<Loader['asm']>[0]} GameVersion
 *
 * @typedef {Parameters<makeDirectLoaderASM>[1]} DirectLoadFunc
 * @typedef {{
 *   dtype: Loader['dtype'],
 *   base: keyof typeof bases,
 *   offset: number,
 *   postprocess?: (rT: number)=>ASMInst[]
 * }} DirectLoader
 */

const r13bases = /**@type{{[k in keyof typeof r13offs]: DirectLoadFunc}}*/ (
  Object.fromEntries(
    Object.entries(r13offs).map(([k, ver2off]) => [
      k,
      /** @type {DirectLoadFunc} */
      (rT, ver) => [ASM.lwz(rT, 13, ver2off[ver])],
    ]),
  )
);
export const bases = {
  ...r13bases,
};

/** @type {Array<(Loader|DirectLoader) & {id:string} & (
 *    {fmt: string, preview: number} |
 *    {fmt: '%s', preview: (ver: GameVersion) => string}
 *  )>}
 */
export const fields = [
  { id: 'x', base: 'gpMarioOriginal', dtype: 'float', offset: 0x10, fmt: '%.0f', preview: 426.39 },
  { id: 'y', base: 'gpMarioOriginal', dtype: 'float', offset: 0x14, fmt: '%.0f', preview: -427.39 },
  { id: 'z', base: 'gpMarioOriginal', dtype: 'float', offset: 0x18, fmt: '%.0f', preview: 428.39 },
  { id: 'angle', base: 'gpMarioOriginal', dtype: 16, offset: 0x96, fmt: '%hu', preview: 1207 },
  {
    id: 'HSpd',
    base: 'gpMarioOriginal',
    dtype: 'float',
    offset: 0xb0,
    fmt: '%.2f',
    preview: 15.15,
  },
  {
    id: 'VSpd',
    base: 'gpMarioOriginal',
    dtype: 'float',
    offset: 0xa8,
    fmt: '%.2f',
    preview: -31.17,
  },
  {
    id: 'QF',
    base: 'gpMarDirector',
    dtype: 32,
    offset: 0x58,
    fmt: '%u',
    preview: 0,
    postprocess: (rT) => [ASM.rlwinm(rT, rT, 0, 30, 31, false)],
  },
  {
    id: 'CAngle',
    base: 'gpCamera',
    dtype: 16,
    offset: 0xa6,
    fmt: '%hu',
    preview: 9,
    postprocess: (rT) => [ASM.addi(rT, rT, -0x8000)], // offset by 0x8000
  },
  {
    id: 'invinc',
    base: 'gpMarioOriginal',
    dtype: 16,
    offset: 0x14c,
    fmt: '%hd',
    preview: 30,
    postprocess: (rT) => [ASM.rlwinm(rT, rT, 30, 2, 31, false)], // QF to frame (>>2)
  },
  {
    id: 'goop',
    fmt: '%d',
    preview: 600,
    ...makeFunctionLoader(32, (ver) => [
      {
        type: 'call',
        addr: addrs.getPollutionDegree[ver],
        prep: [ASM.lwz(3, 13, r13offs.gpPollution[ver])],
      },
    ]),
  },
  {
    id: 'spin',
    fmt: '%s',
    // TODO better char mapping
    preview: (ver) => String.fromCharCode(ver.startsWith('GMSJ') ? 0xff20 : 0x40),
    dtype: 32,
    calling: true,
    asm: (ver, dst) => [
      {
        type: 'call',
        addr: addrs.checkStickRotate[ver],
        prep: [
          ASM.lwz(3, 13, r13offs.gpMarioOriginal[ver]),
          ASM.stwu(1, 1, -0x10),
          ASM.addi(4, 1, 8),
        ],
      },
      // 0 (A) 0
      { type: 'struct', reg: rTmp, hex: ver.startsWith('GMSJ') ? '00819700' : '004000' },
      ...(dst.type === 'stack'
        ? [ASM.add(3, rTmp, 3), ASM.stw(3, 1, dst.off)]
        : [ASM.add(dst.num, rTmp, 3)]),
      // finalize
      ASM.addi(1, 1, 0x10),
    ],
  },
];

export const fieldDB = Object.fromEntries(fields.map((o) => [o.id.toLowerCase(), o]));
