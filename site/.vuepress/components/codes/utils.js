/** @param {number} rgb */
export const rgbI2S = (rgb) => '#' + rgb.toString(16).padStart(6, '0');
/** @param {string} s */
export const rgbS2I = (s) => parseInt(s.slice(1), 16);
/**
 * @param {number} rgb
 * @param {number} a
 */
export const rgbaI2S = (rgb, a) =>
  '#' + rgb.toString(16).padStart(6, '0') + a.toString(16).padStart(2, '0');

export const fg2Style = (rgb, a, rgb2, a2) => {
  const c = rgbaI2S(rgb, a);
  return rgb2 == null || a2 == null ? c : `linear-gradient(180deg, ${c}, ${rgbaI2S(rgb2, a2)})`;
};
