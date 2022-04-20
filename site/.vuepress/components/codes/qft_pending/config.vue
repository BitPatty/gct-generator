<template>
  <div id="config">
    <section v-if="version=='GMSJ01'" class="appearance">
      <h3>{{l.h3}}</h3>
      <div>
        <span>{{l.location}}(</span><input type="number" min="0" max="600" v-model.number="x"><span>, </span><input type="number" min="16" max="464" v-model.number="y"><span>)</span>
      </div>
      <div>
        <span>{{l.fontSize}}</span><input type="number" min="0" v-model.number="fontSize">
      </div>
      <div>
        <span>{{fgRGB2==null ? l.fgColor : l.fgColor1}}</span><input type="color" :value="rgbI2S(fgRGB)" @change="fgRGB = rgbS2I($event.target.value)">
        <span>{{l.alpha}}</span><input type="number" min="0" max="255" v-model.number="fgA"><span>/255={{(fgA/2.55).toFixed(1)}}%</span>
        <input type="checkbox" :checked="fgRGB2!=null" @change="toggleGradient"><span>{{l.fgColorGrad}}</span>
      </div>
      <div v-if="fgRGB2 != null">
        <span>{{l.fgColor2}}</span><input type="color" :value="rgbI2S(fgRGB2)" @change="fgRGB2 = rgbS2I($event.target.value)">
        <span>{{l.alpha}}</span><input type="number" min="0" max="255" v-model.number="fgA2"><span>/255={{(fgA2/2.55).toFixed(1)}}%</span>
      </div>
      <div>
        <span>{{l.bgColor}}</span><input type="color" :value="rgbI2S(bgRGB)" @change="bgRGB = rgbS2I($event.target.value)">
        <span>{{l.alpha}}</span><input type="number" min="0" max="255" v-model.number="bgA"><span>/255={{(bgA/2.55).toFixed(1)}}%</span>
      </div>
      <h4>{{l.preview}}</h4>
      <svg viewBox="0 16 600 448">
        <defs>
          <linearGradient id="fgColor" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" :style="{stopColor: rgbI2S(fgRGB), stopOpacity: fgA/255}" />
            <stop offset="100%" :style="{
              stopColor: rgbI2S(fgRGB2 == null ? fgRGB : fgRGB2),
              stopOpacity: (fgA2 == null ? fgA : fgA2)/255,
            }" />
          </linearGradient>
        </defs>
        <image href="/img/qft/preview-base.jpg" y="16" width="600" height="448" />
        <rect :x="x" :y="y-fontSize" :width="width*fontSize/20" :height="fontSize" :fill="rgbaI2S(bgRGB, bgA)" />
        <text :x="x+fontSize/10" :y="y-fontSize/10" fill="url(#fgColor)"
          :style="{fontSize: fontSize+'px', fontFamily: 'auto'}">0:00.000</text>
      </svg>
      <div style="white-space: pre">{{l.previewNote}}</div>
    </section>
    <section class="freeze">
      <h3>{{l.freeze.h3}}</h3>
      <table>
        <thead>
          <th v-for="s in l.freeze.th" :key="s">{{s}}</th>
        </thead>
        <tbody>
          <tr v-for="key in freezeKeys" :key="key">
            <td>{{l.freeze.rows[key]}}</td>
            <td><input type="number" :value="freeze[key]" @change="onChangeFreeze($event, key)"></td>
            <td class="right">{{(freeze[key]*1001/30000).toFixed(2)}}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import {getConfig, lskey, buttonValues, codes} from './codegen.js';
import labels from './labels.json';
import {getLabels} from '../codegen.js';

function updateConfig() {
  const {x, y, fontSize, width, fgRGB, fgA, fgRGB2, fgA2, bgRGB, bgA, freeze} = this;
  localStorage.setItem(lskey, JSON.stringify({
    x, y, fontSize, width, fgRGB, fgA, fgRGB2, fgA2, bgRGB, bgA, freeze,
  }));
}

export default {
  props: {
    version: {type: String},
  },
  methods: {
    updateConfig,
    onChangeFreeze($event, key) {
      this.freeze[key] = parseInt($event.target.value);
      this.updateConfig();
    },
    toggleGradient($event) {
      if ($event.target.checked) {
        this.fgRGB2 = this.fgRGB;
        this.fgA2 = this.fgA;
      } else {
        this.fgRGB2 = null;
        this.fgA2 = null;
      }
    },
    rgbI2S: (x) => '#'+x.toString(16).padStart(6, '0'),
    rgbS2I: (s) => parseInt(s.slice(1), 16),
    rgbaI2S: (rgb, a) => '#'+rgb.toString(16).padStart(6, '0')+a.toString(16).padStart(2, '0'),
  },
  data() {
    const {x, y, fontSize, width, fgRGB, fgA, fgRGB2, fgA2, bgRGB, bgA, freeze} = getConfig();
    return {
      x, y, fontSize, width,
      fgRGB, fgA, fgRGB2, fgA2, bgRGB, bgA,
      freeze,
      // const
      freezeKeys: Object.keys(codes[this.version]?.freezeCodegen ?? {}),
    };
  },
  computed: {
    l() {
      return labels[this.$lang] ?? labels['en-US'];
    },
  },
  watch: {
    x: updateConfig,
    y: updateConfig,
    fontSize: updateConfig,
    width: updateConfig,
    fgRGB: updateConfig,
    fgA: updateConfig,
    fgRGB2: updateConfig,
    fgA2: updateConfig,
    bgRGB: updateConfig,
    bgA: updateConfig,
  },
}
</script>

<style scoped>
input[type=number], td.right {
  text-align: right;
}
.appearance input[type="number"] {
  width: 3em;
  margin: 0 2px;
}
.appearance > div {
  padding: 0 0 4px;
}

th {
  text-align: center;
}
td > input[type=number] {
  width: 8em;
  max-width: 100%;
  box-sizing: border-box;
}

input[type=number] {
  -moz-appearance: textfield;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
