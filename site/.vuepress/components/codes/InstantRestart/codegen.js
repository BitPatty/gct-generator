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

const baseCodes = {
  GMSJ01: (b) => `
C20EAFA0 00000009
3C608040 A0A30D50
2805${b} 40A20030
3C60817F 38A00001
98A300B3 98A30100
3C60803E 84A3600E
90A30004 3C60800E
6063B3F8 7C6803A6
4E800020 2C000002
60000000 00000000
`,
  GMSJ0A: (b) => `
C227768C 00000009
3C60803F A0A35428
2805${b} 40A20030
3C60817F 38A00001
98A300B3 98A30100
3C60803E 84A3A8EE
90A30004 3C608027
60637AE4 7C6803A6
4E800020 2C000002
60000000 00000000
`,
};
const zCodes = {
  GMSJ01: '040eb024 60000000',
  GMSJ0A: '04277710 60000000',
};

export const defaultConfig = {
  button: buttonValues.Y | buttonValues.DU,
};
export function getConfig() {
  return {
    ...defaultConfig,
    ...(parseJSON(localStorage.getItem(lskey)) ?? {}),
  };
}
export default function codegen(version) {
  const { button } = getConfig();
  const g = baseCodes[version];
  if (g == null) return '';
  let code = g(button.toString(16).padStart(4, '0'));
  if (button & buttonValues.Z) {
    code += zCodes[version];
  }
  return code.replace(/\s/g, '');
}
