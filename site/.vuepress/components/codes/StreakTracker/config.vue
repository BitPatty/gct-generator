<template>
  <div>
    <section class="appearance">
      <h3>{{ l('h3.appearance') }}</h3>
      <div>
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
      </div>
    </section>
  </div>
</template>

<script>
import { defaultConfig, lskey, getConfig, getPreviewText } from './codegen.js';
import { makeUpdateConfig, makeGetLabel, rgbI2S, rgbS2I, rgbaI2S } from '../utils';
import labels from '../labels.json';

const updateConfig = makeUpdateConfig(lskey, defaultConfig, getPreviewText);
export default {
  props: {
    version: { type: String },
    value: {type: Object},
  },
  methods: {
    updateConfig,
    update(o) {
      this.$emit('input', {...this.value, ...o});
    },
    toggleGradient($event) {
      if ($event.target.checked) {
        this.update({
          fgRGB2: this.fgRGB,
          fgA2: this.fgA,
        });
      } else {
        this.update({
          fgRGB2: null,
          fgA2: null,
        });
      }
    },
    rgbI2S,
    rgbS2I,
    rgbaI2S,
  },
  data() {
    const config = getConfig();
    return {...config};
  },
  computed: {
    l() {
      return makeGetLabel(labels, this.$lang);
    },
    textConfig: {
      get() {
        return this;
      },
      set(value) {
        Object.assign(this, value);
        this.updateConfig();
      },
    },
    ...Object.fromEntries([
      'x', 'y', 'fontSize', 'fgRGB', 'fgA', 'fgRGB2', 'fgA2',
    ].map(k => [k, makeField(k)])),
  },
  watch: {
    duration: updateConfig,
  },
};
</script>

<style scoped>
input[type=number], td.right {
  text-align: right;
}
input[type="number"] {
  width: 2em;
  margin: 0 2px;
}
.appearance > div {
  padding: 0 0 4px;
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
