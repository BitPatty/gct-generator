import { fieldDB } from './fields.js';

/**
 * @typedef {Parameters<import('./loader.js').Loader['asm']>[0]} GameVersion
 */

const dtype2fmtinfo = {
  8: { prefix: 'hh', mask: 0xff },
  16: { prefix: 'h', mask: 0xffff },
  32: { prefix: '', mask: 0xffffffff },
};

/**
 * @param {string} input
 * @param {GameVersion} version
 */
export function parseFormat(input, version) {
  const regex = /<(.*?)>/g;
  let preview = '';
  let format = '';
  /** @type {(typeof fieldDB)[string][]} */
  const fields = [];
  /** @type {RegExpExecArray|null} */
  let m = null;
  let i0 = 0;
  while ((m = regex.exec(input))) {
    const { index: i } = m;
    // text
    const text = input.slice(i0, i);
    preview += text;
    format += text.replace(/%/g, '%%');
    // arg
    const [fieldId, fmt0, pvw0] = m[1].split('|');
    const field = fieldDB[fieldId.toLowerCase()];
    if (field) {
      const { dtype } = field;
      let fmt;
      let pvw;
      if (typeof field.preview === 'function') {
        // TODO preview of %s field
        fmt = field.fmt;
        pvw = field.preview(version);
      } else {
        const fmt2 = fmt0 || field.fmt;
        let ipvw = +pvw0;
        if (!pvw0 || !isFinite(ipvw)) ipvw = field.preview;
        let padfmt = '';
        if (dtype === 'float') {
          const m = fmt2.trim().match(/^(?:%?(\d*)\.)?(\d+)([eEf]?)$/);
          padfmt = m?.[1] || '';
          const digit = +(m?.[2] || 0);
          const suffix = m?.[3] || 'f';
          fmt = `%${padfmt}.${digit}${suffix}`;
          pvw = ipvw[suffix === 'f' ? 'toFixed' : 'toExponential'](digit);
          if (suffix === 'E') pvw = pvw.toUpperCase();
        } else {
          const { prefix, mask } = dtype2fmtinfo[dtype];
          ipvw &= mask;
          const m = fmt2.trim().match(/^%?(\d*)h{,2}([dioxXu])$/);
          padfmt = m?.[1] || '';
          const t = m?.[2] || 'u';
          fmt = `%${padfmt}${prefix}${t}`;
          if ('di'.includes(t)) {
            if (ipvw > mask >>> 1) ipvw -= mask;
            pvw = ipvw.toString(10);
          } else if (t === 'o') {
            pvw = (ipvw >>> 0).toString(8);
          } else if ('xX'.includes(t)) {
            pvw = (ipvw >>> 0).toString(16);
          } else {
            pvw = (ipvw >>> 0).toString(10);
          }
        }
        pvw = pvw.padStart(+padfmt, padfmt[0] === '0' ? '0' : ' ');
      }
      preview += pvw;
      format += fmt;
      fields.push(field);
    } else {
      // fail to parse
      preview += m[0];
      format += m[0].replace(/%/g, '%%');
    }
    // next
    i0 = i + m[0].length;
  }
  const text = input.slice(i0);
  preview += text;
  format += text.replace(/%/g, '%%');
  // DONE
  return { preview, format, fields };
}
