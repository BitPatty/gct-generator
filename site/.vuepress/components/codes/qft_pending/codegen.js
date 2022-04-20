import { parseJSON } from '../codegen.js';
export const lskey = 'config/qft';

export const defaultConfig = {
  x: 16,
  y: 456,
  width: 112,
  fontSize: 20,
  fgRGB: 0xffffff,
  fgA: 0xff,
  fgRGB2: null,
  fgA2: null,
  bgRGB: 0x000000,
  bgA: 0x80,
  freeze: {
    yellowCoin: 0,
    redCoin: 30,
    blueCoin: 30,
    item: 30,
    talk: 30,
    demo: 30,
    cleaned: 30,
    bowser: 30, // onBathhubGripDestroyed
  },
};

export function getConfig() {
  const config = parseJSON(localStorage.getItem(lskey)) ?? {};
  return {
    ...defaultConfig,
    ...config,
    freeze: {
      ...defaultConfig.freeze,
      ...config.freeze,
    },
  };
}

const int16 = (x) => (x < 0 ? x + 0x10000 : x).toString(16).padStart(4, '0').slice(-4);
const int32 = (x) => (x < 0 ? x + 0x100000000 : x).toString(16).padStart(8, '0').slice(-8);

import * as GMSJ01 from './code/GMSJ01.js';
import * as GMSE01 from './code/GMSE01.js';
import * as GMSP01 from './code/GMSP01.js';
import * as GMSJ0A from './code/GMSJ0A.js';
export const codes = { GMSJ01, GMSE01, GMSP01, GMSJ0A };

export default function codegen(version) {
  const config = getConfig();
  const { freezeCodegen, baseCode } = codes[version] ?? {};
  if (baseCode == null) return '';

  let code = baseCode;

  // freeze code
  Object.entries(config.freeze).forEach(
    ([key, frame]) => (code += frame > 0 ? freezeCodegen[key]?.(int16(frame)) ?? '' : ''),
  );

  // ui (GMSJ01 only)
  if (['GMSJ01'].includes(version)) {
    /* bounds */
    const { x, y, fontSize, width } = config;
    const scale = fontSize / 20;
    code += '077F0094 0000001D';
    code += [
      x, // x1
      y - fontSize - 2, // y1
      x + width * scale, // x2
      y, // y2
    ]
      .map(int32)
      .join('');
    code += '25753a253032752e2530337500000000'; // fmt
    /* fontSize, fgColor, bgColor */
    code += '077F0110 00000010';
    const bgColor = (config.bgRGB & 0xffffff) * 256 + (config.bgA & 0xff);
    const fgColor = (config.fgRGB & 0xffffff) * 256 + (config.fgA & 0xff);
    const fgColor2 =
      ((config.fgRGB2 ?? config.fgRGB) & 0xffffff) * 256 + ((config.fgA2 ?? config.fgA) & 0xff);
    code += [fontSize, fgColor, fgColor2, bgColor].map(int32).join('');
  }

  return code.replace(/\s/g, '');
}
