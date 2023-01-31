import { parseJSON } from '../codegen.js';
import { ASM, liDX, str2hex, inst2gecko, getFillRectParams } from '../asm.js';
import { measureText } from '../text.js';
import { int2hex } from '../utils.js';
import { addrs } from '../addrs.js';
export const lskey = 'config/PatternSelector';

import * as GMSJ01 from './code/GMSJ01.js';
import * as GMSJ0A from './code/GMSJ0A.js';
// import * as GMSE01 from './code/GMSE01.js';
import * as GMSP01 from './code/GMSP01.js';
const codes = { GMSJ01, GMSJ0A, GMSP01 };

export const defaultConfig = {
  x: 16,
  y: 320,
  fontSize: 20,
  fgRGB: 0xffffff,
  fgA: 0xff,
  fgRGB2: null,
  fgA2: null,
  bgRGB: 0,
  bgA: 0,
  bgLeft: 0,
  bgRight: 0,
  bgTop: 0,
  bgBot: 0,
  label: 'Pattern ',
};

/** @returns {typeof defaultConfig} */
export function getConfig() {
  const config =
    (typeof localStorage !== 'undefined' && parseJSON(localStorage.getItem(lskey))) || {};
  const o = { ...defaultConfig, ...config };
  return { ...o, text: getPreviewText(o) };
}

/** @param {typeof defaultConfig} config */
export const getPreviewText = ({ label }) => label + '#0 0 0';

const codePattern = `
452020FF 213200FF
621CFF1D 32005025
25252630 01FF4520
20213001 FFFF621C
1D300151 0707FF08
3102FF36 01FF0231
021E6E20 FF
`;

/** @param {keyof typeof codes} version */
export default function codegen(version) {
  const config = getConfig();
  const { x, y, fontSize, fgRGB, fgA, fgRGB2, fgA2, bgA, label } = config;
  const colorTop = (fgRGB << 8) | fgA;
  const colorBot = fgRGB2 == null || fgA2 == null ? colorTop : (fgRGB2 << 8) | fgA;
  const text = label + '%c%X%c%X%c%X';

  const { code04, codeBase } = codes[version];
  const code07 = [
    codeBase,
    // drawTextOpt
    int2hex(x, 2),
    int2hex(y, 2),
    int2hex(fontSize, 4),
    int2hex(colorTop, 4),
    int2hex(colorBot, 4),
    // pattern.s
    codePattern,
    // fmt
    str2hex(text, version),
  ]
    .map((s) => s.replace(/\s+/g, ''))
    .join('');

  const head07 = [
    '077F9000',
    // byte count = hex length >> 1
    int2hex(code07.length >> 1, 4),
  ].join('');

  // align code 07 (1 line = 16 hex digits)
  const tail07 = ''.padEnd(code07.length % 16 ? 16 - (code07.length % 16) : 0, '0');

  // background
  const addrFillRect = addrs.fillRect[version];
  const codeBg = bgA
    ? [
        0xc2000000 + ((addrs.drawWater[version] - 0x28) & 0x01ffffff),
        0x00000007,
        0x48000019, // bl trick
        // rect, color
        ...getFillRectParams(config, measureText(label + '#0 0 0', version)),
        0x7c6802a6, // mtlr r3
        0x38830010, // addi r4, r3, 0x10
        0x3d800000 | (addrFillRect >>> 16), // lis r12, fill_rect@h
        0x618c0000 | (addrFillRect & 0xffff), // ori r12, r12, fill_rect@l
        0x7d8803a6, // mtlr r12
        0x4e800021, // blrl
        0x60000000, // nop
        0x00000000, // End of C2
      ]
        .map(inst2gecko)
        .join('')
    : '';

  return (code04 + head07 + code07 + tail07 + codeBg).replace(/\s+/g, '');
}
