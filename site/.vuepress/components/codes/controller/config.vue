<template>
  <div>
    <section class="appearance">
      <h3>{{ l('h3.appearance') }}</h3>
      <div>
        <div>
          <span>{{l('location')}}(</span><input type="number" min="0" max="600" v-model.number="x"><span>, </span><input type="number" min="16" max="464" v-model.number="y"><span>)</span>
        </div>
        <div>
          <span>{{l('size')}}</span><input type="number" min="0" v-model.number="height">
        </div>
        <div>
          <span>{{ l('bgColor') }}</span
          ><input type="color" :value="rgbI2S(bgRGB)" @change="bgRGB = rgbS2I($event.target.value)" />
          <span>{{ l('alpha') }}</span
          ><input type="number" min="0" max="255" v-model.number="bgA" /><span
            >/255={{ (bgA / 2.55).toFixed(1) }}%</span
          >
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { defaultConfig, lskey, getConfig } from './codegen.js';
import hiddenConfig from './hidden.js';
import { makeUpdateConfig, makeGetLabel, rgbI2S, rgbS2I } from '../utils';
import labels from '../labels.json';

const updateConfig = makeUpdateConfig(lskey, defaultConfig, null, hiddenConfig);
export default {
  props: {
    version: { type: String },
  },
  methods: {
    updateConfig,
    rgbI2S,
    rgbS2I,
  },
  data() {
    const config = getConfig();
    return {...config};
  },
  computed: {
    l() {
      return makeGetLabel(labels, this.$lang);
    },
  },
  watch: {
    x: updateConfig,
    y: updateConfig,
    lw: updateConfig,
    height: updateConfig,
    bgRGB: updateConfig,
    bgA: updateConfig,
  },
};
</script>

<style scoped>
input[type='number'],
td.right {
  text-align: right;
}
input[type='number'] {
  width: 3em;
  margin: 0 2px;
}
.appearance > div {
  padding: 0 0 4px;
}

input[type='number'] {
  -moz-appearance: textfield;
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
