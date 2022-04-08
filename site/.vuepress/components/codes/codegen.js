import InstantRestart from './InstantRestart/codegen.js';

export default {
  InstantRestart,
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
