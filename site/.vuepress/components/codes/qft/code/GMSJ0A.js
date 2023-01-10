export const r13off = -0x6188;
export const onChangeStatusAddr = 0x80233f18;

/**
 * @type {{[key: string]: number|{addr: number, orig: number}}}
 */
export const freezeCodeHooks = {
  yellowCoin: 0x8019eb98,
  redCoin: 0x8019e2ac,
  blueCoin: 0x8019e010,
  item: 0x8019f14c,
  talk: 0x80134e58,
  demo: 0x80279fc8,
  cleaned: 0x801f5b0c,
  bowser: 0x801db550,
  yoshi: 0x80250224,
  take: { addr: 0x8021f6f0, orig: 0x801f0384 },
  drop: { addr: 0x8022351c, orig: 0x38000000 },
};
