import { parseJSON } from '../codegen.js';
import { ASM, makeInst, liDX, str2inst, makeProgram, inst2gecko } from '../asm.js';
export const lskey = 'config/CustomizedDisplay';

export const defaultConfig = [
  {
    x: 16,
    y: 192,
    fontSize: 18,
    fgRGB: 0xffffff,
    fgA: 0xff,
    fgRGB2: null,
    fgA2: null,
    fmt: `X <x|.0|39.39>
Y <y|.0|1207.39>
Z <z|.0|-4193.6>
A <angle||65535>
H <HSpd|.2|15.15>
V <VSpd|.2|-31.17>
QF <QF||0>`,
  },
];

/** @param {GameVersion} version */
export function getConfig(version) {
  /** @type {typeof defaultConfig} */
  const config = typeof localStorage !== 'undefined' && parseJSON(localStorage.getItem(lskey));
  return (config instanceof Array ? config : defaultConfig).map(({ fmt, ...o }) => ({
    ...o,
    fmt,
    text: format2previewText(fmt, version),
  }));
}

/**
 * @typedef {number[]} Inst
 * @typedef {8|16|32|'float'} DataType
 * @typedef {(gpr: number)=>Inst} GPRHandler -- (src=gpr, dst=gpr)
 * @typedef {{type: 'gpr'|'fpr'|'sp', index: number}} Dst
 * @typedef {'GMSJ01'|'GMSJ0A'|'GMSE01'|'GMSP01'} GameVersion
 *
 * @typedef {{
 *   offset: number
 *   dtype: DataType
 *   post?: GPRHandler
 * }} FieldInfo
 *
 * @typedef {{
 *   id: string
 *   pre: GPRHandler
 * }} Base
 *
 * @typedef {{
 *   pre: GPRHandler
 *   fields: {info: FieldInfo, dst: Dst}[]
 * }} Entry
 */

/** @typedef {{[ver in GameVersion]: GPRHandler}} VBase */
const bases = {
  gpMarioOriginal: /**@type{VBase}*/ ({
    GMSJ01: (rT) => ASM.lwz(rT, 13, -0x6748),
    GMSE01: (rT) => ASM.lwz(rT, 13, -0x60d8),
    GMSP01: (rT) => ASM.lwz(rT, 13, -0x61b0),
    GMSJ0A: (rT) => ASM.lwz(rT, 13, -0x6218),
  }),
  gpMarDirector: /**@type{VBase}*/ ({
    GMSJ01: (rT) => ASM.lwz(rT, 13, -0x6818),
    GMSE01: (rT) => ASM.lwz(rT, 13, -0x6048),
    GMSP01: (rT) => ASM.lwz(rT, 13, -0x6120),
    GMSJ0A: (rT) => ASM.lwz(rT, 13, -0x6188),
  }),
};
/** @typedef {keyof typeof bases} BaseId */

/** @type {({id: string, base: BaseId, fmt: string, preview: number} & FieldInfo)[]} */
const fields = [
  { id: 'x', base: 'gpMarioOriginal', dtype: 'float', offset: 0x10, fmt: '%.0f', preview: 426.39 },
  { id: 'y', base: 'gpMarioOriginal', dtype: 'float', offset: 0x14, fmt: '%.0f', preview: -427.39 },
  { id: 'z', base: 'gpMarioOriginal', dtype: 'float', offset: 0x18, fmt: '%.0f', preview: 428.39 },
  { id: 'angle', base: 'gpMarioOriginal', dtype: 16, offset: 0x96, fmt: '%hu', preview: 1207 },
  {
    id: 'HSpd',
    base: 'gpMarioOriginal',
    dtype: 'float',
    offset: 0xb0,
    fmt: '%.2f',
    preview: 15.15,
  },
  {
    id: 'VSpd',
    base: 'gpMarioOriginal',
    dtype: 'float',
    offset: 0xa8,
    fmt: '%.2f',
    preview: -31.17,
  },
  {
    id: 'QF',
    base: 'gpMarDirector',
    dtype: 32,
    offset: 0x58,
    fmt: '%u',
    preview: 0,
    post: (rT) => ASM.rlwinm(rT, rT, 0, 30, 31, false),
  },
];
const fieldDB = Object.fromEntries(
  fields.map(({ id, base, fmt, preview, ...info }) => [
    id.toLowerCase(),
    { base, info, fmt, preview },
  ]),
);

const store = {
  8: ASM.stb,
  16: ASM.sth,
  32: ASM.stw,
  float: ASM.stfs,
  double: ASM.stfd,
};
const load = {
  8: ASM.lbz,
  16: ASM.lhz,
  32: ASM.lwz,
  float: ASM.lfs,
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} fontSize
 * @param {number} colorTop
 * @param {number} colorBot
 */
export function prepareDrawText(x, y, fontSize, colorTop, colorBot) {
  let gpr = 9;
  let fpr = 1;
  let sp = 8;
  let fmt = '';
  let hasFloat = false;
  /** @type {{[id: string]: Entry}} */
  const entries = {};

  /** @returns {Dst} */
  function allocInt() {
    if (gpr <= 10) {
      return { type: 'gpr', index: gpr++ };
    } else {
      /** @type {Dst} */
      const dst = { type: 'sp', index: sp };
      sp += 4;
      return dst;
    }
  }
  /** @returns {Dst} */
  function allocFloat() {
    hasFloat = true;
    if (fpr <= 8) {
      return { type: 'fpr', index: fpr++ };
    } else {
      sp += sp & 4; // align 8
      /** @type {Dst} */
      const dst = { type: 'sp', index: sp };
      sp += 8;
      return dst;
    }
  }
  /** @param {Base} base */
  const getEntry = (base) =>
    entries[base.id] ??
    (entries[base.id] = {
      pre: base.pre,
      fields: [],
    });

  return {
    /**
     * @param {string} format
     * @param {Base} base
     * @param {FieldInfo} field
     */
    pushValue(format, base, field) {
      fmt += format;
      getEntry(base).fields.push({
        info: field,
        dst: (field.dtype === 'float' ? allocFloat : allocInt)(),
      });
    },
    /**
     * @param {string} text
     */
    pushText(text) {
      fmt += text.replace(/%/g, '%%');
    },
    makeCode() {
      /** @type {Inst[]} */
      const insts = [];
      // sp
      const spAdd = sp === 8 ? 0 : ((sp >> 4) + (sp & 0xf ? 1 : 0)) << 4;
      // params
      for (const { pre, fields: params } of Object.values(entries)) {
        // load base to gpr
        const rBase = 3;
        insts.push(pre(rBase));
        // load all params
        const rField = 5;
        const fField = 9;
        for (const {
          info: { offset: srcoff, dtype, post },
          dst,
        } of params) {
          if (dst.type === 'sp') {
            const dstoff = dst.index;
            if (dtype === 'float') {
              insts.push(
                // lfs fField, offset(rBase)
                load.float(fField, rBase, srcoff),
                // post
                post?.(fField) ?? [],
                // stfd fField, dst.index(r1)
                store.double(fField, 1, dstoff),
              );
            } else {
              insts.push(
                // load rField, offset(rBase)
                load[dtype](rField, rBase, srcoff),
                // post
                post?.(rField) ?? [],
                // stw rField, dst.index(r1)
                store[32](rField, 1, dstoff),
              );
            }
          } else {
            // load to register
            const { index: rDst } = dst;
            insts.push(
              // load rDst
              load[dtype](rDst, rBase, srcoff),
              // post
              post?.(rDst) ?? [],
            );
          }
        }
      }
      // r8 = fmt
      const fmtbuf = str2inst(fmt);
      insts.push(
        // bl 4+len4(fmt)
        ASM.b(4 + (fmtbuf.length << 2), true),
        // .string fmt
        fmtbuf,
        // mflr r8
        ASM.mflr(8),
      );
      /*
       * r3 = x
       * r4 = y
       * r5 = fontSize
       * r6 = colorTop
       * r7 = colorBot
       */
      insts.push(
        liDX(3, x),
        liDX(4, y),
        liDX(5, fontSize),
        liDX(6, colorTop),
        colorTop === colorBot ? ASM.mr(7, 6) : liDX(7, colorBot),
      );
      // cr{set|clr} 6
      insts.push((hasFloat ? ASM.crset : ASM.crclr)(6));
      // DONE
      return { code: insts.flatMap((e) => e), spNeed: spAdd };
    },
  };
}

const dtype2fmtinfo = {
  8: { prefix: 'hh', mask: 0xff },
  16: { prefix: 'h', mask: 0xffff },
  32: { prefix: '', mask: 0xffffffff },
};

/**
 * @param {string} input
 * @param {GameVersion} version
 * @param {ReturnType<typeof prepareDrawText>|null} f
 */
export function format2previewText(input, version, f = null) {
  const regex = /<(.*?)>/g;
  let preview = '';
  /** @type {RegExpExecArray|null} */
  let m = null;
  let i0 = 0;
  while ((m = regex.exec(input))) {
    const { index: i } = m;
    // text
    const text = input.slice(i0, i);
    f?.pushText(text);
    preview += text;
    // arg
    const [fieldId, fmt0, pvw0] = m[1].split('|');
    const field = fieldDB[fieldId.toLowerCase()];
    if (field) {
      const { base: baseId, info, fmt: fmt1, preview: pvw1 } = field;
      const { dtype } = info;
      const fmt2 = fmt0 || fmt1;
      let ipvw = +pvw0;
      if (!pvw0 || !isFinite(ipvw)) ipvw = pvw1;
      let fmt;
      let pvw;
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
      f?.pushValue(fmt, { id: baseId, pre: bases[baseId][version] }, info);
      preview += pvw;
    } else {
      // fail to parse
      f?.pushText(m[0]);
      preview += m[0];
    }
    // next
    i0 = i + m[0].length;
  }
  const text = input.slice(i0);
  f?.pushText(text);
  preview += text;
  // DONE
  return preview;
}

const addrsOrig = {
  GMSJ01: 0x80206a00 - 0x2c,
  GMSJ0A: 0x8012556c - 0x2c,
  GMSE01: 0x801441e0 - 0x2c,
  GMSP01: 0x80138e1c - 0x2c,
};
const addrsSetup2D = {
  GMSJ01: 0x80035228,
  GMSJ0A: 0x802caecc,
  GMSE01: 0x802eb6bc,
  GMSP01: 0x802e3864,
};
const addrDrawText = 0x817f0238;
const addrDst = 0x817fa000;

/**
 * @param {GameVersion} version
 */
export default function codegen(version) {
  const config = getConfig(version);

  let spOff = 0;
  const fcodes = /** @type {Inst[]} */ ([]);

  for (const { x, y, fontSize, fgRGB, fgA, fgRGB2, fgA2, fmt } of config) {
    // color
    const colorTop = (fgRGB << 8) | fgA;
    const colorBot = fgRGB2 == null || fgA2 == null ? colorTop : (fgRGB2 << 8) | fgA;
    // prepare drawText
    const f = prepareDrawText(x, y, fontSize, colorTop, colorBot);
    format2previewText(fmt, version, f);
    // update code and sp
    const { code, spNeed } = f.makeCode();
    spOff = Math.max(spOff, spNeed);
    fcodes.push(code);
  }

  const addrOrig = addrsOrig[version];
  const addrSetup2D = addrsSetup2D[version];

  // program
  const program = makeProgram(addrDst);
  // addi r3, r1, 0xE90
  program.push(ASM.addi(3, 1, 0xe90));
  // addi r1, r1, -spOff
  if (spOff) program.push(ASM.addi(1, 1, -spOff));
  // bl setup
  program.bl(addrSetup2D);
  // (drawText)
  for (const code of fcodes) {
    program.push(code);
    program.bl(addrDrawText);
  }
  // addi r1, r1, spOff
  if (spOff) program.push(ASM.addi(1, 1, spOff));
  // b orig+4
  program.b(addrOrig + 4);

  // dump code
  const pcode = program.dump();
  const psize = pcode.length;
  return [
    makeInst((0xc6 << 24) | (addrOrig & 0x1ffffff)),
    makeInst(addrDst),
    makeInst((0x06 << 24) | (addrDst & 0x1fffffff)),
    makeInst(psize << 2),
    pcode,
    psize & 1 ? [0] : [],
  ]
    .flatMap((e) => e)
    .map(inst2gecko)
    .join('');
}
