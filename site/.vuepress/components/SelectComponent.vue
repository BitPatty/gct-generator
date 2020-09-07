<template>
  <div :class="disabled ? 'select-wrapper disabled' : 'select-wrapper'">
    <select @change="(e) => this.onChange(e.target.value)" autocomplete="off" :disabled="disabled">
      <option v-if="placeholder != null" selected disabled>
        {{ placeholder }}
      </option>
      <option
        v-for="option in options"
        :value="option.value"
        :selected="selectedValue && option.value === selectedValue"
      >
        {{ getLabel(option.label) }}
      </option>
    </select>
  </div>
</template>

<script>
import { translate } from '../i18n/localeHelper';

export default {
  props: {
    disabled: { type: Boolean },
    selectedValue: { type: String },
    placeholder: { type: String },
    options: { type: Array },
    onChange: { type: Function },
  },
  data() {
    return {};
  },
  methods: {
    getLabel(key) {
      return translate(key, this.$lang);
    },
  },
};
</script>

<style scoped>
.select-wrapper {
  position: relative;
  display: inline-block;
  max-width: 400px;
  min-width: 180px;
  width: 100%;
  margin: 0 auto;
  background-color: #3eaf7c;
  z-index: 10;
}

.select-wrapper.disabled,
.select-wrapper.disabled select {
  background-color: rgb(165, 165, 165);
  cursor: not-allowed;
}

select {
  border: none;
  outline: none;
  background: transparent;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0;
  margin: 0;
  display: block;
  width: 100%;
  padding: 6px 55px 6px 15px;
  font-size: 14px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

select::-ms-expand {
  display: none;
}

.select-wrapper:hover {
  background-color: #47c38b;
}

select option {
  color: black;
  font-weight: normal;
}

.select-wrapper:after {
  position: absolute;
  right: 0px;
  top: 3px;
  width: 40px;
  height: 100%;
  content: '\25BC';
  text-align: center;
  color: white;
  font-size: 14px;
  z-index: -1;
}
</style>
