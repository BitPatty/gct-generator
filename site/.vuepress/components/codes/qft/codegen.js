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
    take: true,
    drop: true,
    put: true,
    tripleJump: true,
    spinJump: true,
    ledgeGrab: true,
    wallKick: true,
    ropeJump: true,
    bounce: true,
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

import statusDB from './code/status.js';
export const statusKeys = Object.keys(statusDB);

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
  const { freezeCodeHooks, r13off, onChangeStatusAddr } = codes[version] ?? {};

  let code = baseCode;
  const { freezeDuration: frame } = config;

  // freezing code
  const enabledFreezes = [];
  const statuses = [];
  if (frame > 0) {
    for (const [key, enabled] of Object.entries(config.freeze)) {
      if (!enabled) continue;
      // add status
      statuses.push(...(statusDB[key] ?? []));
      // add hook
      const hook = freezeCodeHooks[key];
      if (hook) {
        if (key === 'blueCoin') {
          const addr = hook;
          // special: needs to adjust QF -> use separate C2 instead
          code += [
            0xc2000000 + (addr & 0x1ffffff),
            0x00000005,
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
        } else if (typeof hook === 'number') {
          // handle regular freezing code later
          const addr = hook;
          enabledFreezes.push(addr);
        } else {
          // {addr: number, orig: number}
          // separate C2 code to handle orig
          const { addr, orig } = hook;
          code += [
            0xc2000000 + (addr & 0x1ffffff),
            0x00000003,
            0x3d800000 + (freezeCodeAddr >>> 16), // lis r12, freezeCodeAddr@h
            0x618c0000 + (freezeCodeAddr & 0xffff), // ori r12, r12, freezeCodeAddr@l
            0x7d8803a6, // mtlr r12
            0x4e800021, // blrl
            orig,
            0x00000000,
          ]
            .map(int2gecko)
            .join('');
        }
      }
    }
  }
  // handle regular freezing code
  if (enabledFreezes.length <= 1 && statuses.length === 0) {
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

  // onChangeStatus hook
  if (statuses.length) {
    const c = [
      // check each status
      ...statuses.flatMap((x, i) => {
        const cr = i > 0 ? 0x800000 : 0; // i>0 ? cr1 : cr0
        const c =
          x < 0x10000
            ? [
                0x281d0000 + cr + x, // cmplwi crX, r29, $x
              ]
            : [
                0x3c000000 + (x >>> 16), // lis r0, $x@h
                0x60000000 + (x & 0xffff), // ori r0, r0, $x@l
                0x7c1d0040 + cr, // cmplw crX, r29, r0
              ];
        if (i > 0) {
          // cror 4*cr0+eq, 4*cr0+eq, 4*cr1+eq
          c.push(0x4c423382);
        }
        return c;
      }),
      // freeze
      0x3d800000 + (freezeCodeAddr >>> 16), // lis r12, freezeCodeAddr@h
      0x618c0000 + (freezeCodeAddr & 0xffff), // ori r12, r12, freezeCodeAddr@l
      0x7d8803a6, // mtlr r12
      0x4d820021, // beqlrl
      // orig
      0x38000000, // li r0, 0
    ];

    // pad nop
    if (c.length % 2 === 0) {
      c.push(0x60000000);
    }
    // end of C2
    c.push(0x00000000);

    // apply code
    code += [
      0xc2000000 + (onChangeStatusAddr & 0x1ffffff),
      c.length >> 1, // line count
      ...c,
    ]
      .map(int2gecko)
      .join('');
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
