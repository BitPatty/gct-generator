import { parseJSON } from '../codegen.js';
import { ASM, liDX, str2hex, insts2hex, getFillRectParams, getDrawTextOpt } from '../asm.js';
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
  x: 498,
  y: 462,
  fontSize: 14,
  fgRGB: 0xffffff,
  fgA: 0xff,
  fgRGB2: null,
  fgA2: null,
  bgRGB: 0,
  bgA: 128,
  bgLeft: 2,
  bgRight: 4,
  bgTop: 2,
  bgBot: 2,
};

/** @returns {typeof defaultConfig} */
export function getConfig() {
  const config =
    (typeof localStorage !== 'undefined' && parseJSON(localStorage.getItem(lskey))) || {};
  const o = { ...defaultConfig, ...config };
  return { ...o, text: getPreviewText() };
}

export const getPreviewText = () => '#0 0 0';

/**
 * @param {keyof typeof codes} version
 * @param {string} baseCode
 */
export default function codegen(version, baseCode) {
  const config = getConfig();
  let code = baseCode;
  code += '077F0410 00000066';
  // fillRectOpt
  code += insts2hex(getFillRectParams(config, measureText(getPreviewText(), version)));
  // drawTextOpt
  code += insts2hex(getDrawTextOpt(config));
  // fmt
  code += '25632558256325582563255800';
  // pattern data
  code += `452020 FF213200
FF621CFF 1D320050
25252526 3001FF45
20202130 01FFFF62
1C1D3001 510707FF
083102FF 3601FF02
31021E6E 20FF0000
`;

  return code.replace(/\s/g, '');
}
