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
  freezeDuration: 30,
  freeze: {
    yellowCoin: false,
    redCoin: true,
    blueCoin: true,
    item: true,
    talk: true,
    demo: true,
    cleaned: true,
    bowser: true, // onBathhubGripDestroyed
    yoshi: true,
  },
};

export function getConfig() {
  const config =
    (typeof localStorage !== 'undefined' && parseJSON(localStorage.getItem(lskey))) || {};
  return {
    ...defaultConfig,
    ...config,
    freeze: {
      ...defaultConfig.freeze,
      ...config.freeze,
    },
  };
}

/** @param {number} x */
const int2gecko = (x) => (x >>> 0).toString(16).toUpperCase().padStart(8, '0');

import * as GMSJ01 from './code/GMSJ01.js';
import * as GMSE01 from './code/GMSE01.js';
import * as GMSP01 from './code/GMSP01.js';
import * as GMSJ0A from './code/GMSJ0A.js';
export const codes = { GMSJ01, GMSE01, GMSP01, GMSJ0A };

/****
## save freeze frame, load and save QF
## this function destroys r11 and r12
077F0348:
  lwz r11, gpMarDirector-_SDA_BASE_(r13)
  lis r12, 0x817F
  lwz r11, 0x5C(r11)
  stw r11, 0xB8(r12)
  li r11, freezeDuration
  stw r11, 0xBC(r12)
  blr

## for each hook (over a blr): b 817f0348
****/
const freezeCodeAddr = 0x817f0348;
/**
 * @param {keyof typeof codes} version
 * @param {string=} baseCode
 */
export default function codegen(version, baseCode) {
  if (!baseCode) return '';

  const config = getConfig();
  const { freezeCodeHooks, r13off } = codes[version] ?? {};

  let code = baseCode;
  const { freezeDuration: frame } = config;

  // freezing code
  const enabledFreezes = [];
  if (frame > 0) {
    for (const [key, enabled] of Object.entries(config.freeze)) {
      const addr = freezeCodeHooks[key];
      if (enabled && addr) {
        if (key === 'blueCoin') {
          // special: needs to adjust QF -> use separate C2 instead
          code += [
            0xc2000000 + (addr & 0x1ffffff),
            0x00000004,
            0x7c030378,
            0x80a3005c,
            0x38a50003,
            0x54a0003a,
            0x3ca0817f,
            0x900500b8,
            0x38000000 | (frame & 0xffff),
            0x900500bc,
            0x60000000,
            0x00000000,
          ]
            .map(int2gecko)
            .join('');
        } else {
          // handle regular freezing code later
          enabledFreezes.push(addr);
        }
      }
    }
  }
  // handle regular freezing code
  if (enabledFreezes.length <= 1) {
    // use C2 directly
    code += enabledFreezes
      .flatMap((addr) => [
        0xc2000000 + (addr & 0x1ffffff),
        0x00000004,
        0x816d0000 | (r13off & 0xffff), // lwz r11, r13off(r13)
        0x3d80817f, // lis r12, 0x817F
        0x816b005c, // lwz r11, 0x5C(r11)
        0x916c00b8, // stw r11, 0xB8(r12)
        0x39600000 | (frame & 0xffff), // li r11, frame
        0x916c00bc, // stw r11, 0xBC(r12)
        0x60000000, // nop
        0x00000000,
      ])
      .map(int2gecko)
      .join('');
  } else {
    // could be shorter to turn this into a Gecko loop if enough freezes are enabled
    const hooks = enabledFreezes.flatMap((addr) => [
      0xc6000000 | (addr & 0x1ffffff),
      freezeCodeAddr,
    ]);

    const freezer = [
      0x06000000 | (freezeCodeAddr & 0x1ffffff),
      0x0000001c,
      0x816d0000 | (r13off & 0xffff), // lwz r11, r13off(r13)
      0x3d80817f, // lis r12, 0x817F
      0x816b005c, // lwz r11, 0x5C(r11)
      0x916c00b8, // stw r11, 0xB8(r12)
      0x39600000 | (frame & 0xffff), // li r11, frame
      0x916c00bc, // stw r11, 0xBC(r12)
      0x4e800020, // blr
      0x00000000,
    ];

    // apply code
    code += [...hooks, ...freezer].map(int2gecko).join('');
  }

  // ui
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
    .map(int2gecko)
    .join('');
  code += '25753a253032752e2530337500000000'; // fmt
  /* fontSize, fgColor, bgColor */
  code += '077F0110 00000010';
  const bgColor = (config.bgRGB & 0xffffff) * 256 + (config.bgA & 0xff);
  const fgColor = (config.fgRGB & 0xffffff) * 256 + (config.fgA & 0xff);
  const fgColor2 =
    ((config.fgRGB2 ?? config.fgRGB) & 0xffffff) * 256 + ((config.fgA2 ?? config.fgA) & 0xff);
  code += [fontSize, fgColor, fgColor2, bgColor].map(int2gecko).join('');

  return code.replace(/\s/g, '');
}
