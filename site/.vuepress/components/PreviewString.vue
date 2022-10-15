<template>
  <div v-if="text" class="preview-str" :style="styles.root" >
    <div v-for="style, i in styles.chars" :key="i" class="char-ctn" :style="style.ctn">
      <div class="char-bg" :style="style.bg" />
      <div class="char-mask" :style="style.mask" />
    </div>
  </div>
</template>

<script>
import charInfo from '../data/font-jp.json';
export default {
  props: {
    x: {type: Number},
    y: {type: Number},
    size: {type: Number},
    color: {type: String},
    text: {type: String},
  },
  computed: {
    styles() {
      const {x: x0, y: y0, size: fontSize, color, text} = this;

      /** @type {{x: number, y: number, u: number, v: number}[]} */
      const chars = [];
      let x = 0;
      let y = 0;
      let useKerning = false;
      text.split('').forEach(c => {
        const {index, kerning, width} = charInfo[c] ?? charInfo[' '];
        if (c === '\n') {
          useKerning = false;
          x = 0;
          y += 20;
          return;
        }
        if (useKerning) x -= kerning;
        useKerning = true;
        // uv
        const [u, v] = [index%25*20, (index/25|0)*20];
        chars.push({x, y, u, v});
        // next
        x += width + kerning;
      });

      return {
        root: {
          transform: `translate(${x0}px, ${y0-fontSize}px) scale(${fontSize/20})`,
        },
        chars: chars.map(({x, y, u, v}) => {
          const offset = `${-u}px ${-v}px`;
          return {
            ctn: {
              left: x+'px',
              top: y+'px',
            },
            bg: {
              'background-position': offset,
            },
            mask: {
              'mask-position': offset,
              '-webkit-mask-position': offset,
              background: color,
            },
          };
        }),
      };
    },
  },
};
</script>

<style scoped>
.preview-str {
  position: relative;
}
.preview-str * {
  position: absolute;
}
div.char-ctn {
  isolation: isolate;
}
div.char-ctn > div {
  width: 20px;
  height: 20px;
}
div.char-bg {
  background: url(/img/preview/font-jp.png);
}
div.char-mask {
  mask-image: url(/img/preview/font-jp.png);
  -webkit-mask-image: url(/img/preview/font-jp.png);
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mix-blend-mode: multiply;
}
</style>
