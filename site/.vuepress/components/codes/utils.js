/**
 * @template T extends {Record<string, any>|Record<string, any>[]}
 * @param {string} lskey
 * @param {T} defaultConfig
 * @param {((config: T)=>string)|null} [makeText]
 * @param {any} [hiddenConfig]
 */
export function makeUpdateConfig(lskey, defaultConfig, makeText, hiddenConfig = {}) {
  const configKeys = Object.keys(defaultConfig);
  /** @type {(o: any)=>T} */
  const makeConfig =
    defaultConfig instanceof Array
      ? (o) => o.config
      : (o) => Object.fromEntries(configKeys.map((k) => [k, o[k]]));

  /** @this {any} */
  return function updateConfig() {
    // save config to localStorage
    const config = makeConfig(this);
    localStorage.setItem(lskey, JSON.stringify(config));
    // emit `config` event to parent
    const configEmit = { ...hiddenConfig, ...config };
    this.$emit('config', makeText ? { ...configEmit, text: makeText(config) } : configEmit);
  };
}

/**
 * @param {number} x -- number to convert
 * @param {number} size -- byte count
 */
export const int2hex = (x, size) =>
  (x >>> 0)
    .toString(16)
    .toUpperCase()
    .padStart(size << 1, '0')
    .slice(-(size << 1));

/**
 * @param {number} x -- number to convert
 */
export function float2hex(x) {
  const dv = new DataView(new ArrayBuffer(4));
  dv.setFloat32(0, x);
  return int2hex(dv.getUint32(0), 4);
}

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
/** @param {number} rgba */
export const cI2S = (rgba) => '#' + (rgba >>> 0).toString(16).padStart(8, '0');

/** @type {(labels: Record<string, any>, locale: string, fallbackLocale?: string) => (key: string) => string} */
export const makeGetLabel =
  (labels, locale, fallbackLocale = 'en-US') =>
  (key) => {
    const segs = key.split('.');
    for (const localeTry of [locale, fallbackLocale]) {
      let o = labels[localeTry];
      for (const seg of segs) {
        if (o == null) break;
        o = o[seg];
      }
      if (o != null) return o;
    }
    return null;
  };

/**
 * @template T
 * @param {Iterable<T>} arr
 * @param {(val: T) => boolean} tester
 * @returns {[positive: T[], negative: T[]]}
 */
export function splitArray(arr, tester) {
  /** @type {T[]} */
  const positive = [];
  /** @type {T[]} */
  const negative = [];
  for (const val of arr) {
    (tester(val) ? positive : negative).push(val);
  }
  return [positive, negative];
}
