import InstantRestart from './InstantRestart/codegen.js';
import qft from './qft/codegen.js';
import qfst from './qfst/codegen.js';
import CustomizedDisplay from './CustomizedDisplay/codegen.js';
import PatternSelector from './PatternSelector/codegen.js';
import AttemptCounter from './AttemptCounter/codegen.js';
import controller from './controller/codegen.js';

export default {
  InstantRestart,
  qft,
  qfst,
  CustomizedDisplay,
  PatternSelector,
  AttemptCounter,
  controller,
};

/**
 * @param {string|null} s -- raw input string
 */
export function parseJSON(s) {
  if (s == null) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
