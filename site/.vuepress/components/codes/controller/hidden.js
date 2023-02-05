export const buttons = [
  { x: 138, y: 66, r: 18, id: 'A', c: 0x2ee5b8bf },
  { x: 113, y: 89, r: 9, id: 'B', c: 0xff1a1abf },
  { x: 164, y: 50, r: 8, id: 'X', c: 0xeeeeeebf },
  { x: 119, y: 41, r: 8, id: 'Y', c: 0xeeeeeebf },
  { x: 144, y: 34, r: 6, id: 'Z', c: 0x9494ffbf },
  { x: 91, y: 64, r: 5, id: 'S', c: 0xeeeeeebf },
];

export const sticks = [
  {
    id: 'M',
    x: 32,
    y: 52,
    rMove: 14,
    rS: 19,
    cS: 0xeeeeeeef,
    rF: 12,
    cF: 0xeeeeeeef,
  },
  {
    id: 'C',
    x: 64,
    y: 92,
    rMove: 14,
    rS: 19,
    cS: 0xffd300ef,
    rF: 12,
    cF: 0xffd300ef,
  },
];

export const triggers = [
  {
    id: 'L',
    x: 12,
    y0: 10,
    y1: 18,
    w: 64,
    wa: 56,
  },
  {
    id: 'R',
    x: 170,
    y0: 10,
    y1: 18,
    w: -64,
    wa: -56,
  },
];

export default {
  // background
  bgLeft: 0,
  bgRight: 182,
  bgTop: 0,
  bgBot: 120,
  // trigger fill
  cTF: 0xdfdfdfbf,
  // trigger stroke
  cTS: 0xeeeeeebf,
  // input
  buttons,
  triggers,
  sticks,
};
