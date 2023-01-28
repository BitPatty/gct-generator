<template>
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
    <div>
      <div>
        <span>{{ l.bgColor }}</span
        ><input type="color" :value="rgbI2S(bgRGB)" @change="bgRGB = rgbS2I($event.target.value)" />
        <span>{{ l.alpha }}</span
        ><input type="number" min="0" max="254" v-model.number="bgA" /><span
          >/255={{ (bgA / 2.55).toFixed(1) }}%</span
        >
      </div>
      <div>
        <span>{{ l.bgOffset }}</span>
        <span>{{ l.left }}</span><input type="number" v-model.number="bgLeft" />
        <span>{{ l.right }}</span><input type="number" v-model.number="bgRight" />
        <span>{{ l.top }}</span><input type="number" v-model.number="bgTop" />
        <span>{{ l.bottom }}</span><input type="number" v-model.number="bgBot" />
      </div>
    </div>
  </div>
</template>

<script>
import labels from './labels.json';
import {rgbI2S, rgbS2I, rgbaI2S} from './utils';

const makeField = key => ({
  get() {
    return this.$props.value[key];
  },
  set(value) {
    this.update({[key]: value});
  },
});

export default {
  props: {
    value: {type: Object},
  },
  computed: {
    l() {
      return labels[this.$lang] ?? labels['en-US'];
    },
    ...Object.fromEntries([
      'x', 'y', 'fontSize', 'fgRGB', 'fgA', 'fgRGB2', 'fgA2',
      'bgRGB', 'bgA', 'bgLeft', 'bgRight', 'bgTop', 'bgBot',
    ].map(k => [k, makeField(k)])),
  },
  methods: {
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
}
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
