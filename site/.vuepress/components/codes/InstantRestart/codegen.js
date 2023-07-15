import { parseJSON } from '../codegen.js';
export const lskey = 'config/InstantRestart';
export const buttonValues = {
  START: 0x1000,
  Y: 0x0800,
  X: 0x0400,
  B: 0x0200,
  A: 0x0100,
  L: 0x0040,
  R: 0x0020,
  Z: 0x0010,
  DU: 0x0008,
  DD: 0x0004,
  DR: 0x0002,
  DL: 0x0001,
};
const zCodes = {
  GMSJ01: '040EB02460000000',
  GMSE01: '04297A6860000000',
  GMSP01: '0428F90060000000',
  GMSJ0A: '0427771060000000',
};

export const defaultConfig = {
  button: buttonValues.B | buttonValues.DU,
};
export function getConfig() {
  return {
    ...defaultConfig,
    ...(parseJSON(localStorage.getItem(lskey)) ?? {}),
  };
}
export default function codegen(version, src) {
  const { button } = getConfig();
  let code = src.slice(0, 36) + button.toString(16).padStart(4, '0') + src.slice(40);
  if (button & buttonValues.Z) {
    code += zCodes[version];
  }
  return code;
}
