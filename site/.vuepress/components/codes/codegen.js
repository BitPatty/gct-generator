import InstantRestart from './InstantRestart/codegen.js';
import qft from './qft/codegen.js';

export default {
  InstantRestart,
  qft,
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
