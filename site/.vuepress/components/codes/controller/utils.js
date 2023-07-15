import { int2hex } from '../utils.js';

/** @type {Record<string, number>} */
export const SHIFTS = {
  Z: 32 - 4,
  R: 32 - 5,
  L: 32 - 6,
  A: 32 - 8,
  B: 32 - 9,
  X: 32 - 10,
  Y: 32 - 11,
  S: 32 - 12,
};

/**
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 */
export const makeRect = (x0, y0, x1, y1) => [x0, y0, x1, y1].map((x) => int2hex(x, 1)).join('');

/**
 * @param {number} x
 * @param {number} y
 * @param {number} r
 * @param {number} s
 * @param {number} color
 */
export const makeNgon = (x, y, r, s, color) =>
  [x, y, r, s].map((x) => int2hex(x, 1)).join('') + int2hex(color, 4);

/**
 * @param {number} shift
 * @param {number} WA
 */
export const makeTriggerInfo = (shift, WA) => [shift, WA].map((x) => int2hex(x, 1)).join('');
