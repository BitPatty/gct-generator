import { parseJSON } from '../codegen.js';
import { insts2hex, getDrawTextOpt, getFillRectParams } from '../asm';
import { measureText } from '../text.js';
import { int2hex } from '../utils.js';
export const lskey = 'config/AttemptCounter';

export const defaultConfig = {
  x: 152,
  y: 125,
  fontSize: 32,
  fgRGB: 0xffff99,
  fgA: 0xff,
  fgRGB2: null,
  fgA2: null,
  bgRGB: 0x000000,
  bgA: 0x40,
  bgLeft: 4,
  bgRight: 6,
  bgTop: 4,
  bgBot: 3,
  duration: 60,
};

export const getPreviewText = () => '88\n99';

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
  code += '077F0479 0000002B';
  code += int2hex(config.duration, 1);
  code += '25640A256400'; // fmt = "%d\n%d"
  code += insts2hex(getDrawTextOpt(config));
  code += insts2hex(getFillRectParams(config, measureText(getPreviewText(), version)));
  code += '0000000000'; // padding

  return code.replace(/\s/g, '');
}
