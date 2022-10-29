import InstantRestart from './InstantRestart/codegen.js';
import qft from './qft/codegen.js';
import CustomizedDisplay from './CustomizedDisplay/codegen.js';
import PatternSelector from './PatternSelector/codegen.js';

export default {
  InstantRestart,
  qft,
  CustomizedDisplay,
  PatternSelector,
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
