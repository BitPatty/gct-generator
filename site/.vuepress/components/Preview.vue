<template>
  <div class="preview-root">
    <div class="preview-ctn">
      <div :style="qft.bgStyle" />
      <PreviewString v-if="qft" :x="qft.x" :y="qft.y" :size="qft.fontSize" :color="qft.color" text="0:00:00" />
      <PreviewString v-if="mdp" :x="mdp.x" :y="mdp.y" :size="mdp.fontSize" :color="mdp.color" :text="mdp.text" />
      <PreviewString :x="16" :y="320" :size="20" :color="'#fff'" text="Pattern #0 0 0" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: {type: Object},
  },
  computed: {
    mdp() {
      return {
        x: 16,
        y: 200,
        fontSize: 20,
        color: '#fff',
        text: 'X Pos -4\nY Pos 27\nZ Pos -1515\nAngle 3117\nH Spd 4.26\nV Spd 4.28',
      };
    },
    qft() {
      const {config: {qft}} = this;
      if (qft == null) return;
      const {x, y, fontSize, fgRGB, fgA, fgRGB2, fgA2, bgRGB, bgA, width} = qft;
      const i2s = (rgb, a) => '#'+rgb.toString(16).padStart('0', 6)+a.toString(16).padStart('0', 2);
      const bg = i2s(bgRGB, bgA);
      const fg1 = i2s(fgRGB, fgA);
      return {
        x, y, fontSize,
        color: fgRGB2==null || fgA2==null ? fg1 : `linear-gradient(180deg, ${fg1}, ${i2s(fgRGB2, fgA2)})`,
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
