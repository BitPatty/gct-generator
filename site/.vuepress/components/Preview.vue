<template>
  <div class="preview-root">
    <div class="preview-ctn">
      <div v-if="qft">
        <div :style="qft.bgStyle" />
        <PreviewString :x="qft.x" :y="qft.y" :size="qft.fontSize" :color="qft.color" text="0:00:00" />
      </div>
      <div v-if="mdps">
        <PreviewString v-for="mdp,i in mdps" :key="i"
          :x="mdp.x" :y="mdp.y" :size="mdp.fontSize" :color="mdp.color" :text="mdp.text" />
      </div>
      <PreviewString v-if="config.PatternSelector" :x="16" :y="320" :size="20" :color="'#fff'" text="Pattern #0 0 0" />
    </div>
  </div>
</template>

<script>
import { rgbaI2S, fg2Style } from './codes/utils.js';
export default {
  props: {
    config: {type: Object},
  },
  computed: {
    mdps() {
      const {config} = this;
      if (config.PASDisplay) return [{
        x: 16,
        y: 200,
        fontSize: 20,
        color: '#fff',
        text: 'X Pos -39\nY Pos 1207\nZ Pos -4193\nAngle 65535\nH Spd 15.15\nV Spd -31.17',
      }];
      if (config.SpeedDisplay) return [{
        x: 16,
        y: 240,
        fontSize: 20,
        color: '#fff',
        text: 'H Spd 15.15\nV Spd -31.17',
      }];
      if (config.CustomizedDisplay) {
        return config.CustomizedDisplay.map(({fgRGB, fgA, fgRGB2, fgA2, ...o}) => ({
          ...o,
          color: fg2Style(fgRGB, fgA, fgRGB2, fgA2),
        }));
      }
    },
    qft() {
      const {config: {qft}} = this;
      if (qft == null) return;
      const {x, y, fontSize, fgRGB, fgA, fgRGB2, fgA2, bgRGB, bgA, width} = qft;
      const bg = rgbaI2S(bgRGB, bgA);
      return {
        x, y, fontSize,
        color: fg2Style(fgRGB, fgA, fgRGB2, fgA2),
        bgStyle: {
          left: x+'px',
          top: (y-fontSize)+'px',
          width: (width*fontSize/20)+'px',
          height: fontSize+'px',
          background: bg,
        },
      };
    },
  },
}
</script>

<style scoped>
div.preview-root {
  position: relative;
  width: 600px;
  height: 448px;
  background: url(/img/preview/background.png);
  padding: 0;
  overflow: hidden;
}
div.preview-ctn {
  position: absolute;
  top: -16px;
}
div.preview-ctn * {
  position: absolute;
}
</style>
