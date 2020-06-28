const generateStageLoaderCode = (
  gameConfig,
  selectedLevels,
  routeOrder,
  routeEnding,
  fmvSkips,
  dialgueSkips,
) => {
  const loadStageLength = {
    list: 0x20,
    random: 0x2c,
    shuffle: 0x40,
  }[routeOrder];

  let codes = '';

  // Reset counter on file select
  codes +=
    '0' +
    (0x04000000 + (gameConfig.fileSelect & 0x01ffffff)).toString(16) +
    (0x48000001 + ((gameConfig.system + 0x52c - gameConfig.fileSelect) & 0x03fffffc)).toString(16);

  // Load next stage on Shine get
  codes +=
    '0' +
    (0x04000000 + (gameConfig.shineGet & 0x01ffffff)).toString(16) +
    (0x48000001 + ((gameConfig.system + 0x53c - gameConfig.shineGet) & 0x03fffffc)).toString(16);

  // Reload stage on exit area
  codes += '0' + (0x04000000 + (gameConfig.system & 0x01ffffff)).toString(16) + '48000511';

  // Set next stage on game over
  codes +=
    '0' +
    (0x06000000 + ((gameConfig.system + 0xb4) & 0x01ffffff)).toString(16) +
    '000000084800048948000044';

  // Reset timer on secret death
  codes +=
    (0xc2000000 + ((gameConfig.system + 0x208) & 0x01ffffff)).toString(16) +
    '000000033C60817F38000001980300FF881C00006000000000000000';

  // Reset coin count on loading main world
  codes +=
    (0xc2000000 + ((gameConfig.shineGet - 0x674) & 0x01ffffff)).toString(16) +
    '00000005887D00002C030002418000142C0300074182000C2C03000A418000087C0400406000000000000000';

  // Overwrite decideNextStage(void) with useful routines
  codes +=
    '0' +
    (0x06000000 + ((gameConfig.system + 0x510) & 0x01ffffff)).toString(16) +
    ('0000000' + (loadStageLength + 0x5c).toString(16)).slice(-8) +
    '3C60817F38000001980300FFA00300023C60' +
    gameConfig.gpAppHi +
    'B003' +
    gameConfig.gpAppLo +
    '4E800020' + // reload current level
    '3C60817F' +
    (0x38800000 + ((selectedLevels.length * 2) & 0x0000ffff)).toString(16) +
    'B08300004E800020' + // reset counter
    '3C60817F38000001980300FFA00300002C00000038E0' +
    routeEnding + // load next stage - the fun begins
    (0x40810000 + (loadStageLength & 0x0000fffc)).toString(16) +
    '7C8802A6600000007CC802A67C8803A6';

  switch (routeOrder) {
    case 'list':
      codes += '3400FFFEB00300007CE6022E';
      break;
    case 'random':
      codes += '7C8C42E67CA403967CA501D67C8520505484003C7CE6222E';
      break;
    case 'shuffle':
      codes +=
        '7C8C42E67CA403967CA501D67C8520505484003C3400FFFEB00300007CE6222E7CA6022E7CA6232E7CE6032E';
  }

  codes +=
    'B0E300023C60' +
    gameConfig.gpAppHi +
    'B0E3' +
    gameConfig.gpAppLo +
    '806D' +
    gameConfig.fmOffset +
    '98E300DF4E800020' +
    (routeOrder === 'random' ? '' : '00000000');

  selectedLevels.reverse();

  while (selectedLevels.length % 4) selectedLevels.push('0000');

  // Insert the list of levels into the loader
  codes +=
    (0xc2000000 + ((gameConfig.system + 0x55c) & 0x01ffffff)).toString(16) +
    ('0000000' + (selectedLevels.length / 4 + 1).toString(16)).slice(-8) +
    (0x48000001 + ((selectedLevels.length * 2 + 4) & 0x03fffffc)).toString(16) +
    selectedLevels.join('') +
    '00000000';

  // Load next stage on setNextStage into main level
  codes +=
    '0' +
    (0x06000000 + ((gameConfig.system + 0x118c) & 0x01ffffff)).toString(16) +
    '00000028B07D00143C80817F38000000B00400FFA0010038B01D00122C1C00094181000C4BFFF391B0E10038';

  // Setup timer
  codes +=
    (0xc2000000 + (gameConfig.proc & 0x01ffffff)).toString(16) +
    '000000053CA0817F388000009085010C880500FF98050100988500FF38800001988501016000000000000000';

  codes = codes.toUpperCase();

  codes += gameConfig.notext[dialgueSkips] + gameConfig.nofmvs[fmvSkips];

  return codes;
};

export default generateStageLoaderCode;
