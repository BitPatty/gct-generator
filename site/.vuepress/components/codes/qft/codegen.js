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

const int16 = (x) =>
  (x < 0 ? x + 0x10000 : x).toString(16).padStart(4, '0').slice(-4).toUpperCase();
const int32 = (x) =>
  (x < 0 ? x + 0x100000000 : x).toString(16).padStart(8, '0').slice(-8).toUpperCase();

import * as GMSJ01 from './code/GMSJ01.js';
import * as GMSE01 from './code/GMSE01.js';
import * as GMSP01 from './code/GMSP01.js';
import * as GMSJ0A from './code/GMSJ0A.js';
export const codes = { GMSJ01, GMSE01, GMSP01, GMSJ0A };

/****
## save freeze frame, load and save QF
## this function destroys r11(freeze frame), r12
077F0348:
  lis r12, 0x817F
  stw r11, 0xBC(r12)
  lwz r11, -0x6818(r13)
  lwz r11, 0x5C(r11)
  stw r11, 0xB8(r12)
  blr

## for each code
  ORIG
  li r11, xxxx
  b 817f0348

04xxxxxx:
  bl 817fxxxx
****/
const freezeCodeAddr = 0x817f0348;
export default function codegen(version) {
  const config = getConfig();
  const { freezeCodeInfo, baseCode, r13off } = codes[version] ?? {};
  if (baseCode == null) return '';

  let code = baseCode;
  const { freezeDuration: frame } = config;

  // freezing code
  const freezeEnableds = [];
  if (frame > 0) {
    for (const [key, enabled] of Object.entries(config.freeze)) {
      const info = freezeCodeInfo[key];
      if (enabled && info) {
        const { addr, orig } = info;
        if (key === 'blueCoin') {
          // special: needs to adjust QF -> use separate C2 instead
          code += [
            0xc2000000 + (addr & 0x1ffffff),
            0x00000005,
            orig,
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
            .map(int32)
            .join('');
        } else {
          // handle regular freezing code later
          freezeEnableds.push(info);
        }
      }
    }
  }
  // handle regular freezing code
  if (freezeEnableds.length <= 1) {
    // use C2 directly
    code += freezeEnableds
      .flatMap(({ addr, orig }) => [
        0xc2000000 + (addr & 0x1ffffff),
        0x00000004,
        orig,
        0x816d0000 | (r13off & 0xffff), // lwz r11, r13off(r13)
        0x3d80817f, // lis r12, 0x817F
        0x816b005c, // lwz r11, 0x5C(r11)
        0x916c00b8, // stw r11, 0xB8(r12)
        0x39600000 | (frame & 0xffff), // li r11, frame
        0x916c00bc, // stw r11, 0xBC(r12)
        0x00000000,
      ])
      .map(int32)
      .join('');
  } else {
    const code04 = [];
    const code07 = [
      0x816d0000 | (r13off & 0xffff), // lwz r11, r13off(r13)
      0x3d80817f, // lis r12, 0x817F
      0x816b005c, // lwz r11, 0x5C(r11)
      0x916c00b8, // stw r11, 0xB8(r12)
      0x39600000 | (frame & 0xffff), // li r11, frame
      0x916c00bc, // stw r11, 0xBC(r12)
      0x4e800020, // blr
    ];
    let dst = freezeCodeAddr + code07.length * 4;
    // put code together
    for (const { addr, orig } of freezeEnableds) {
      code07.push(
        orig, // [dst] original instruction
        0x4c000000 + (freezeCodeAddr - dst - 4), // b freezeCode
      );
      code04.push(
        0x04000000 | (addr & 0x1ffffff), // 04 addr
        0x48000001 | (dst - addr), // bl dst
      );
      dst += 8;
    }
    // make 07 code
    code07.unshift(
      0x06000000 | (freezeCodeAddr & 0x1ffffff), // 07 freezeCodeAddr
      code07.length * 4,
    );
    if (code07.length & 1) {
      // odd => pad with 0
      code07.push(0);
    }
    // apply code
    code += [...code04, ...code07].map(int32).join('');
  }

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
