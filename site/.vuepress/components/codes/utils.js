/**
 * @template T extends {Record<string, any>|Record<string, any>[]}
 * @param {string} lskey
 * @param {T} defaultConfig
 * @param {(config: T)=>string} [makeText]
 */
export function makeUpdateConfig(lskey, defaultConfig, makeText) {
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
    this.$emit('config', makeText ? { ...config, text: makeText(config) } : config);
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
