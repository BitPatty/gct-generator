/** @typedef {{index: number, kerning: number, width: number, code: number}} CharInfo */
import charInfoJP from '../../data/charInfo-JP.json';
import charInfoEU from '../../data/charInfo-EU.json';
import charInfoUS from '../../data/charInfo-US.json';

/**
 * @param {string} version
 */
const getFontInfo = (version) =>
  version.startsWith('GMSJ')
    ? {
        // JP
        charInfo: /**@type{Record<string, CharInfo>}*/ (charInfoJP),
        rowSize: 24, // how many char in a row of the img
      }
    : {
        // US, EU
        charInfo: /**@type{Record<string, CharInfo>}*/ (
          version === 'GMSE01' ? charInfoUS : charInfoEU
        ),
        rowSize: 16, // how many char in a row of the img
      };

/**
 * @param {string} text
 * @param {string} version
 */
export function measureText(text, version) {
  const { charInfo, rowSize } = getFontInfo(version);

  /** @type {{x: number, y: number, u: number, v: number}[]} */
  const chars = [];
  let x = 0;
  let y = 0;
  let w = 0;
  let useKerning = false;
  text.split('').forEach((c) => {
    const { index, kerning, width } = charInfo[c] ?? charInfo['?'];
    if (c === '\n') {
      useKerning = false;
      x = 0;
      y += 20;
      return;
    }
    if (useKerning) x -= kerning;
    useKerning = true;
    // uv
    const [u, v] = [(index % rowSize) * 20, ((index / rowSize) | 0) * 20];
    chars.push({ x, y, u, v });
    // next
    x += width + kerning;
    // update width
    if (x > w) w = x;
  });

  return { chars, width: w, height: y + 20 };
}
