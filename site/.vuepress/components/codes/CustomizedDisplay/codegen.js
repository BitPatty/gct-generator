import { parseJSON } from '../codegen.js';
import { ASM, liDX, str2inst, makeProgram, inst2gecko, getFillRectParams } from '../asm.js';
import { measureText } from '../text.js';
import { addrs } from '../addrs.js';
import { parseFormat } from './format.js';
import { assemble } from './assembler.js';
import { drawText, fillRect } from './functions.js';
export const lskey = 'config/CustomizedDisplay';

import configDB from './configDB.js';
export const defaultConfig = [configDB.PAS];

/** @type {(...args: Parameters<typeof parseFormat>) => string} */
export const format2previewText = (input, version) => parseFormat(input, version).preview;

/** @typedef {'GMSJ01'|'GMSJ0A'|'GMSE01'|'GMSP01'} GameVersion */
/** @param {GameVersion} version */
export function getConfig(version) {
  /** @type {typeof defaultConfig} */
  const config = typeof localStorage !== 'undefined' && parseJSON(localStorage.getItem(lskey));
  return (config instanceof Array ? config : defaultConfig).map(({ fmt, ...o }) => ({
    ...defaultConfig[0],
    ...o,
    fmt,
    text: format2previewText(fmt, version),
  }));
}

/**
 * @typedef {Parameters<assemble>[0][number]} ASMInst
 * @param {GameVersion} version
 */
export default function codegen(version) {
  const configs = getConfig(version);

  let stackFrameSize = 0;

  /** @type {ASMInst[]} */
  const asm = [];

  for (const config of configs) {
    const { fmt: fmtRaw, bgA } = config;
    const { preview, format, fields } = parseFormat(fmtRaw, version);

    // fill_rect
    if (bgA) {
      asm.push(...fillRect(version, config, measureText(preview, version)));
    }

    // drawText
    if (format.trim()) {
      const { insts, sp } = drawText(version, config, format, fields);
      stackFrameSize = Math.max(stackFrameSize, sp);
      asm.push(...insts);
    }
  }

  let body = assemble(asm, stackFrameSize);
  // align code
  if (body.length % 16 === 0) body += '60000000';
  body += '00000000';

  const addrDst = addrs.drawWater[version] - 0x2c; // [-0x30, -0x18]
  return (
    [
      0xc2000000 | (addrDst & 0x1fffffff),
      body.length >>> 4, // 16 hex-digits per line
    ]
      .flatMap((e) => e)
      .map(inst2gecko)
      .join('') + body
  );
}
