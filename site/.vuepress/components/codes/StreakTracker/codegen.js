import { parseJSON } from '../codegen.js';
import { insts2hex, getDrawTextOpt } from '../asm';
export const lskey = 'config/StreakTracker';

export const defaultConfig = {
  x: 256,
  y: 432,
  fontSize: 25,
  fgRGB: 0xff0000,
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

export const getPreviewText = () => 'Avg: 1:23.456\nStreak: 4';

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
  code += '077F0124 00000010';
  code += insts2hex(getDrawTextOpt(config));

  return code.replace(/\s/g, '');
}
