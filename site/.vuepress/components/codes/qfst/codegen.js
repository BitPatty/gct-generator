import { parseJSON } from '../codegen.js';
import { insts2hex, getDrawTextOpt, getFillRectParams } from '../asm';
import { measureText } from '../text.js';
export const lskey = 'config/qfst';

export const defaultConfig = {
  x: 533,
  y: 150,
  fontSize: 13,
  fgRGB: 0xffffff,
  fgA: 0xff,
  fgRGB2: null,
  fgA2: null,
  bgRGB: 0x000000,
  bgA: 0x40,
  bgLeft: 4,
  bgRight: 3,
  bgTop: 4,
  bgBot: 2,
};

export const getPreviewText = () => ` 0.426
 0.427
 0.428
 1.515
 3.117
39.000
 9.999
11.111
22.222
33.333
44.444
55.555
66.666
77.777
88.888
99.999`;

/** @returns {typeof defaultConfig} */
export function getConfig() {
  const config =
    (typeof localStorage !== 'undefined' && parseJSON(localStorage.getItem(lskey))) || {};
  return {
    ...defaultConfig,
    ...config,
    text: getPreviewText(),
  };
}

/**
 * @param {keyof typeof import('../addrs.js').ctxSpOff} version
 * @param {string=} baseCode
 */
export default function codegen(version, baseCode) {
  if (!baseCode) return '';

  const config = getConfig();

  let code = baseCode;
  code += '077F039C 0000002C';
  code += insts2hex(getFillRectParams(config, measureText(getPreviewText(), version)));
  code += insts2hex(getDrawTextOpt(config));
  code += '2532642E 25303364 00000000'; // fmt = "%2d.%03d"

  return code.replace(/\s/g, '');
}
