export const r13off = -0x6188;

/**
 * @type {{[key: string]: {addr: number, orig: number}}}
 */
export const freezeCodeInfo = {
  yellowCoin: { addr: 0x8019ea3c, orig: 0x8805000e },
  redCoin: { addr: 0x8019e1fc, orig: 0x38a00000 },
  blueCoin: { addr: 0x8019e010, orig: 0x7c030378 },
  item: { addr: 0x8019f13c, orig: 0x8001001c },
  talk: { addr: 0x80277dd0, orig: 0x807f00b0 },
  demo: { addr: 0x80277e4c, orig: 0x88e7013c },
  cleaned: { addr: 0x801f5af8, orig: 0x80010044 },
  bowser: { addr: 0x801dbe48, orig: 0x2c1d0003 },
};

export const baseCode = `
C2279570 00000005
981A0260 3CE0817F
880700B3 2C000000
38000000 900700BC
4182000C B00700B2
900700B4 00000000
C21252A4 0000001F
3C60817F 6064011C
38630094 3D808012
398C1660 7D8803A6
4E800021 3C60817F
888300B2 810300B4
2C040000 40820030
808300BC 2C040000
40820010 810D9E78
8108005C 48000010
3884FFFF 908300BC
810300B8 800300B4
7D080214 3CE0000A
60E7F9B0 7C074000
40800010 7CE83B78
98E300B2 90E300B4
3C60817F 1D0803E9
38000078 7D080396
9421FFF0 380003E8
7CE80396 7C0701D6
7D004050 91010008
3800003C 7D270396
7C0901D6 7D403850
80E30118 390300A4
80C30114 3D80817F
80A30110 618C0238
808300A0 7D8803A6
80630094 4E800021
38210010 38610E90
3D80802D 398CAECC
7D8803A6 4E800021
881F0046 00000000
C227C214 00000005
3CA0817F A00500B2
2C000000 40820014
800500B4 80C3005C
7C003214 900500B4
7C0802A6 00000000
C227A298 00000005
3CA0817F 80C500B4
8003005C 7CC60214
38C60004 54C6003A
90C500B4 38C0FFFF
B0C500B2 00000000
C21DA0FC 00000005
3D00817F 80C800B4
8003005C 7CC60214
38C60004 54C6003A
90C800B4 38C0FFFF
B0C800B2 00000000
C2145EBC 00000002
2C030001 3C60817F
98A300B3 00000000
C22784B4 00000002
389C0001 3CA0817F
988500B3 00000000
C2278E58 00000005
3CA0817F 38600001
986500B3 807F005C
38630003 5463003A
906500B8 3860FFFF
906500BC 00000000
C227A01C 00000005
3CA0817F 980500B3
801E005C 30000004
5400003A 900500B8
3800FFFF 900500BC
60000000 00000000
`;