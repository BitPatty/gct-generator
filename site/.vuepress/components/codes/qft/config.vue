<template>
  <div id="config">
    <section class="appearance">
      <h3>{{ l.h3 }}</h3>
      <div>
        <TextConfig v-model="textConfig" />
      </div>
      <div>
        <span>{{ l.bgColor }}</span
        ><input type="color" :value="rgbI2S(bgRGB)" @change="bgRGB = rgbS2I($event.target.value)" />
        <span>{{ l.alpha }}</span
        ><input type="number" min="0" max="255" v-model.number="bgA" /><span
          >/255={{ (bgA / 2.55).toFixed(1) }}%</span
        >
      </div>
    </section>
    <section class="freeze">
      <h3>{{ l.freeze.h3 }}</h3>
      <div>
        {{ l.freeze.duration }}<input type="number" min="0" max="32767" v-model="freezeDuration" />
        {{ l.freeze.frame }} = {{ ((freezeDuration * 1001) / 30000).toFixed(2) }} {{ l.freeze.sec }}
      </div>
      <table>
        <tbody>
          <tr v-for="key in freezeKeys" :key="key">
            <td>{{ l.freeze.rows[key] }}</td>
            <td>
              <input type="checkbox" :checked="freeze[key]" @change="onChangeFreeze($event, key)" />
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import { getConfig, lskey, codes, statusKeys } from './codegen.js';
import { rgbI2S, rgbS2I, rgbaI2S } from '../utils';
import labels from './labels.json';
import TextConfig from '../TextConfig.vue';

function updateConfig() {
  const { x, y, fontSize, width, fgRGB, fgA, fgRGB2, fgA2, bgRGB, bgA, freeze, freezeDuration } = this;
  const config = {
    x,
    y,
    fontSize,
    width,
    fgRGB,
    fgA,
    fgRGB2,
    fgA2,
    bgRGB,
    bgA,
    freeze,
    freezeDuration,
  };
  localStorage.setItem(lskey, JSON.stringify(config));
  this.$emit('config', config);
}

export default {
  components: {
    TextConfig,
  },
  props: {
    version: { type: String },
  },
  methods: {
    onChangeFreeze($event, key) {
      this.freeze[key] = $event.target.checked;
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
    updateConfig,
    rgbI2S,
    rgbS2I,
    rgbaI2S,
  },
  data() {
    const { x, y, fontSize, width, fgRGB, fgA, fgRGB2, fgA2, bgRGB, bgA, freeze, freezeDuration } =
      getConfig();
    return {
      x,
      y,
      fontSize,
      fgRGB,
      fgA,
      fgRGB2,
      fgA2,
      width,
      bgRGB,
      bgA,
      freeze,
      freezeDuration,
      // const
      freezeKeys: [
        ...Object.keys(codes[this.version]?.freezeCodeHooks ?? {}),
        ...statusKeys,
      ],
    };
  },
  computed: {
    l() {
      return labels[this.$lang] ?? labels['en-US'];
    },
    textConfig: {
      get() {
        const { x, y, fontSize, fgRGB, fgA, fgRGB2, fgA2 } = this;
        return { x, y, fontSize, fgRGB, fgA, fgRGB2, fgA2 };
      },
      set(value) {
        Object.assign(this, value);
        this.updateConfig();
      },
    },
  },
  watch: {
    width: updateConfig,
    bgRGB: updateConfig,
    bgA: updateConfig,
    freezeDuration: updateConfig,
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
