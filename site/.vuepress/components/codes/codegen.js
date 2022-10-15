import InstantRestart from './InstantRestart/codegen.js';
import qft from './qft/codegen.js';
import CustomizedDisplay from './CustomizedDisplay/codegen.js';

export default {
  InstantRestart,
  qft,
  CustomizedDisplay,
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
