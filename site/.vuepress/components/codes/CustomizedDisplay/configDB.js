const base = {
  fontSize: 20,
  fgRGB: 0xffffff,
  fgA: 0xff,
  fgRGB2: null,
  fgA2: null,
  bgRGB: 0,
  bgA: 0,
  bgLeft: 0,
  bgRight: 0,
  bgTop: 0,
  bgBot: 0,
};

export default {
  PAS: {
    ...base,
    x: 16,
    y: 200,
    fmt: `X Pos <x|.0|39.39>
Y Pos <y|.0|1207.39>
Z Pos <z|.0|-4193.6>
Angle <angle||65535>
H Spd <HSpd|.2|15.15>
V Spd <VSpd|.2|-31.17>`,
  },
  speed: {
    ...base,
    x: 16,
    y: 240,
    fmt: `H Spd <HSpd|.2|15.15>
V Spd <VSpd|.2|-31.17>`,
  },
  detailed: {
    ...base,
    x: 16,
    y: 192,
    fontSize: 18,
    fmt: `X <x|.0|39.39>
Y <y|.0|1207.39>
Z <z|.0|-4193.6>
A <angle||65535>
C <CAngle||9>
H <HSpd|.2|15.15>
V <VSpd|.2|-31.17>
QF <QF||0>`,
  },
  rect: {
    ...base,
    x: 32,
    y: 48,
    fontSize: 0,
    fmt: '',
    bgRight: 536,
    bgBot: 384,
    bgA: 0x7f,
  },
};
