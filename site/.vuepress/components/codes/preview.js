import * as qft from './qft/codegen.js';
import * as qfst from './qfst/codegen.js';
import * as CustomizedDisplay from './CustomizedDisplay/codegen.js';
import * as PatternSelector from './PatternSelector/codegen.js';
import * as AttemptCounter from './AttemptCounter/codegen.js';

export const previewIds = ['CustomizedDisplay', 'AttemptCounter', 'PatternSelector', 'qft', 'qfst'];

/**
 * Get code configs for preview
 * @param {keyof typeof import('./addrs.js').ctxSpOff} version
 */
export const getConfigs = (version) =>
  Object.fromEntries(
    Object.entries({
      qft,
      qfst,
      CustomizedDisplay,
      PatternSelector,
      AttemptCounter,
    }).map(([k, v]) => [k, v.getConfig(version)]),
  );
