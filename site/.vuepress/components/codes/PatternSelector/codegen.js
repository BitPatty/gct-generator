import { parseJSON } from '../codegen.js';
import { ASM, liDX, strlen, str2inst, inst2gecko } from '../asm.js';
export const lskey = 'config/PatternSelector';

import * as GMSJ01 from './code/GMSJ01.js';
import * as GMSJ0A from './code/GMSJ0A.js';
// import * as GMSE01 from './code/GMSE01.js';
// import * as GMSP01 from './code/GMSP01.js';
const codes = { GMSJ01, GMSJ0A };

export const defaultConfig = {
  x: 16,
  y: 320,
  fontSize: 20,
  fgRGB: 0xffffff,
  fgA: 0xff,
  fgRGB2: null,
  fgA2: null,
  label: 'Pattern ',
};
/** @returns {typeof defaultConfig} */
export function getConfig() {
  const config =
    (typeof localStorage !== 'undefined' && parseJSON(localStorage.getItem(lskey))) || {};
  return { ...defaultConfig, ...config };
}

const addrDrawText = 0x817f0238;
const addrCodeBase = 0x817f9000;
const addrPV1Data1 = 0x817f9167;
const addrFmt0 = 0x817f919d;

/** @param {keyof typeof codes} version */
export default function codegen(version) {
  const { x, y, fontSize, fgRGB, fgA, fgRGB2, fgA2, label } = getConfig();
  const colorTop = (fgRGB << 8) | fgA;
  const colorBot = fgRGB2 == null || fgA2 == null ? colorTop : (fgRGB2 << 8) | fgA;
  const text = label + '>%X>%X>%X';
  const fmtCS0 = strlen(label);
  const fmtCSD = 3;

  const { code04, addrDraw2D, codes: cs0 } = codes[version];
  const cs = cs0.map((e) => e.replace(/\s+/g, ''));
  const params = [
    liDX(3, x),
    liDX(4, y),
    liDX(5, fontSize),
    liDX(6, colorTop),
    colorTop === colorBot ? ASM.mr(7, 6) : liDX(7, colorBot),
  ].flatMap((e) => e);
  const extraOffset = (params.length - 5) << 2; // default: 5 inst
  let pc;
  // 07
  let code07 = '801F0000';
  /* li32 rEntry, .data.patterns.PV1-1 */
  code07 += liDX(8, addrPV1Data1 + extraOffset)
    .map(inst2gecko)
    .join('');
  code07 += cs[0];
  /* li r8 */
  code07 += liDX(8, addrFmt0 + extraOffset)
    .map(inst2gecko)
    .join('');
  code07 += cs[1];
  /* stb r0/12/12, fmtCS0+fmtCSD*i(r8) */
  code07 += [
    ASM.stb(0, 8, fmtCS0),
    0x540cc63e,
    ASM.stb(12, 8, fmtCS0 + fmtCSD),
    0x540c863e,
    ASM.stb(12, 8, fmtCS0 + fmtCSD * 2),
  ]
    .flatMap((e) => e)
    .map(inst2gecko)
    .join('');
  /* (code) */
  code07 += cs[2];
  /* r3~r7 */
  code07 += params.map(inst2gecko).join('');
  code07 += '4CC63182'; // crclr 6
  /* bl drawText */
  pc = addrCodeBase + (code07.length >> 1);
  code07 += ASM.b(addrDrawText - pc, true)
    .map(inst2gecko)
    .join('');
  /* addi */
  code07 += '38210010';
  /* b 4+$b$.draw2d */
  pc = addrCodeBase + (code07.length >> 1);
  code07 += ASM.b(4 + addrDraw2D - pc, false)
    .map(inst2gecko)
    .join('');
  /* (code) */
  code07 += cs[3];
  /* fmt */
  // prepend 1 dummy char as 'FF' in code
  code07 += str2inst('.' + text)
    .map(inst2gecko)
    .join('')
    .slice(2);

  const head07 = [0x06000000 | (addrCodeBase & 0x1ffffff), code07.length >> 1]
    .map(inst2gecko)
    .join('');
  // align code 07 (8 digit = 4 byte)
  if (code07.length & 8) code07 += '00000000';

  return (code04 + head07 + code07).replace(/\s+/g, '');
}
