export const r13off = -0x6120;
export const onChangeStatusAddr = 0x8024bf54;

/**
 * @type {{[key: string]: number|{addr: number, orig: number}}}
 */
export const freezeCodeHooks = {
  yellowCoin: 0x801b6cc8,
  redCoin: 0x801b63dc,
  blueCoin: 0x801b6140,
  item: 0x801b727c,
  talk: 0x801489b4,
  demo: 0x802921b0,
  cleaned: 0x8020db50,
  bowser: 0x801f3690,
  yoshi: 0x80268260,
  take: { addr: 0x80237734, orig: 0x801f0384 },
  drop: { addr: 0x8023b560, orig: 0x38000000 },
};
