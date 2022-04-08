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

export const defaultConfig = {
  button: buttonValues.Y | buttonValues.DL,
};
export function getConfig() {
  return {
    ...defaultConfig,
    ...(parseJSON(localStorage.getItem(lskey)) ?? {}),
  };
}
export default function codegen(version) {
  const { button } = getConfig();
  let code;
  switch (version) {
    case 'GMSJ01':
      code = `
c20eafa0 00000009
3c608040 a0a30d50
2805${button.toString(16).padStart(4, '0')} 40a20030
3c60817f 38a00001
98a300b3 98a30100
3c60803e 80a3600e
90a36012 3c60800e
6063b3f8 7c6803a6
4e800020 2c000002
60000000 00000000
`;
      if (button & buttonValues.Z) {
        code += '\n040eb024 60000000';
      }
      break;
    default:
      return '';
  }
  return code.replace(/\s/g, '');
}
