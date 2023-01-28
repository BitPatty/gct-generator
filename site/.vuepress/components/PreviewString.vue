<template>
  <div v-if="config">
    <div :style="styles.bg" />
    <div :class="previewCssClass" :style="styles.root" >
      <div v-for="style, i in styles.chars" :key="i" class="char-ctn" :style="style.ctn">
        <div class="char-bg" :style="style.bg" />
        <div class="char-mask" :style="style.mask" />
      </div>
    </div>
  </div>
</template>

<script>
import {rgbaI2S} from './codes/utils.js';
import {measureText} from './codes/text.js';

export default {
  props: {
    config: {type: Object},
    version: {type: String},
  },
  computed: {
    previewCssClass() {
      // TODO US
      return `preview-str preview-${['GMSJ01', 'GMSJ0A'].includes(this.version) ? 'JP' : 'EU'}`;
    },
    styles() {
      const {config, version} = this;
      const {x: x0, y: y0, fontSize, fgRGB, fgA, fgRGB2, fgA2, bgRGB, bgA, bgLeft, bgRight, bgTop, bgBot, text} = config;
      const fgColor = rgbaI2S(fgRGB, fgA);
      const {width, height, chars} = measureText(text, version);

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
              background: fgRGB2 == null || fgA2 == null ? fgColor :
                `linear-gradient(180deg, ${fgColor}, ${rgbaI2S(fgRGB2, fgA2)})`,
            },
          };
        }),
        bg: {
          left: x0 - bgLeft + 'px',
          top: y0 - fontSize - bgTop + 'px',
          width: (width * fontSize) / 20 + bgLeft + bgRight + 'px',
          height: (height * fontSize) / 20 + bgTop + bgBot + 'px',
          background: rgbaI2S(bgRGB, bgA),
        },
      };
    },
  },
};
</script>

<style scoped>
* {
  position: absolute;
}

.preview-str {
  position: relative;
}
.preview-str * {
  position: absolute;
}
.char-ctn {
  isolation: isolate;
}
.char-ctn > div {
  width: 20px;
  height: 20px;
}
.char-mask {
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mix-blend-mode: multiply;
}

.preview-JP .char-bg {
  background: url(/img/preview/font-JP.png);
}
.preview-JP .char-mask {
  mask-image: url(/img/preview/font-JP.png);
  -webkit-mask-image: url(/img/preview/font-JP.png);
}
.preview-EU .char-bg {
  background: url(/img/preview/font-EU.png);
}
.preview-EU .char-mask {
  mask-image: url(/img/preview/font-EU.png);
  -webkit-mask-image: url(/img/preview/font-EU.png);
}
/* TODO US */
</style>
