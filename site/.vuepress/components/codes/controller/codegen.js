import { parseJSON } from '../codegen.js';
import { float2hex, int2hex } from '../utils.js';
import hiddenConfig from './hidden.js';
import { SHIFTS, makeRect, makeNgon, makeTriggerInfo } from './utils.js';
export const lskey = 'config/controller';

export const defaultConfig = {
  x: 16,
  y: 314,
  lw: 20,
  height: 120,
  bgRGB: 0,
  bgA: 0x7f,
};

/** @returns {typeof defaultConfig & typeof hiddenConfig} */
export function getConfig() {
  const config =
    (typeof localStorage !== 'undefined' && parseJSON(localStorage.getItem(lskey))) || {};
  return {
    ...defaultConfig,
    ...config,
    ...hiddenConfig,
  };
}

/**
 * @param {keyof typeof import('../addrs.js').ctxSpOff} version
 * @param {string=} baseCode
 */
export default function codegen(version, baseCode) {
  if (!baseCode) return '';

  const {
    x,
    y,
    lw,
    height,
    bgRGB,
    bgA,
    bgLeft,
    bgRight,
    bgTop,
    bgBot,
    buttons,
    cTF,
    cTS,
    triggers,
    sticks,
  } = getConfig();
  const logQ = 6;

  let code = baseCode;
  code += '077F04C3 0000007D';

  // basic config
  code += [
    // lw
    int2hex(lw, 1),
    // mtx.scale
    float2hex((2 ** -logQ * height) / 120),
    // mtx.x
    int2hex(x, 2),
    // mtx.y
    int2hex(y - 16, 2),
    // .conf.bg.color
    int2hex((bgRGB << 8) | bgA, 4),
    // .conf.trigger.fill
    int2hex(cTF, 4),
    // .conf.trigger.stroke
    int2hex(cTS, 4),
  ].join('');

  // background
  code += makeRect(bgLeft, bgTop, bgRight, bgBot);

  // buttons
  code += buttons.map((c) => makeNgon(c.x, c.y, c.r, SHIFTS[c.id], c.c)).join('');

  // triggers
  code += triggers
    .flatMap((c) => [
      // fill
      makeRect(c.x, c.y0, c.x + c.w, c.y1),
      // info
      makeTriggerInfo(SHIFTS[c.id], c.wa),
      // stroke
      makeRect(c.x, c.y0, c.x + c.w, c.y1),
    ])
    .join('');

  // sticks
  code += sticks
    .flatMap((c) => [
      // fill
      makeNgon(-1, -1, c.rF, c.rMove, c.cF),
      // stroke
      makeNgon(c.x, c.y, c.rS, -1, c.cS),
    ])
    .join('');

  // padding
  code += '000000';

  return code.replace(/\s/g, '');
}
