export default {
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
  // r1 offset of J2DGrafContext in TGCConsole2::perform()
  ctxSpOff: {
    GMSJ01: 0xe90,
    GMSJ0A: 0xbec,
    GMSE01: 0xbd0,
    GMSP01: 0xbe4,
  },
};
