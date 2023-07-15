export const addrs = {
  drawText: 0x817f0238,
  drawWater: {
    GMSJ01: 0x80206a00,
    GMSJ0A: 0x8012556c,
    GMSE01: 0x801441e0,
    GMSP01: 0x80138e1c,
  },
  fillRect: {
    GMSJ01: 0x80201ea8,
    GMSJ0A: 0x80121660,
    GMSE01: 0x80140390,
    GMSP01: 0x80134f0c,
  },
  setup2D: {
    GMSJ01: 0x80035228,
    GMSJ0A: 0x802caecc,
    GMSE01: 0x802eb6bc,
    GMSP01: 0x802e3864,
  },
  getPollutionDegree: {
    GMSJ01: 0x801ef6b8,
    GMSE01: 0x8019db20,
    GMSP01: 0x801963a8,
    GMSJ0A: 0x8017e26c,
  },
  checkStickRotate: {
    GMSJ01: 0x80130758,
    GMSE01: 0x80251304,
    GMSP01: 0x80249090,
    GMSJ0A: 0x80231054,
  },
};

export const r13offs = {
  gpMarioOriginal: {
    GMSJ01: -0x6748,
    GMSE01: -0x60d8,
    GMSP01: -0x61b0,
    GMSJ0A: -0x6218,
  },
  gpMarDirector: {
    GMSJ01: -0x6818,
    GMSE01: -0x6048,
    GMSP01: -0x6120,
    GMSJ0A: -0x6188,
  },
  gpCamera: {
    GMSJ01: -0x5750,
    GMSE01: -0x7118,
    GMSP01: -0x7158,
    GMSJ0A: -0x5768,
  },
  gpPollution: {
    GMSJ01: -0x6518,
    GMSE01: -0x62f0,
    GMSP01: -0x63c8,
    GMSJ0A: -0x6430,
  },
};

// r1 offset of J2DGrafContext in TGCConsole2::perform()
export const ctxSpOff = {
  GMSJ01: 0xe90,
  GMSJ0A: 0xbec,
  GMSE01: 0xbd0,
  GMSP01: 0xbe4,
};
