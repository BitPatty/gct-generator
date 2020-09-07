<template>
  <div class="select-wrapper">
    <select @change="onValueChanged" autocomplete="off">
      <option v-if="placeholder != null" value="placeholder" selected disabled>
        {{ placeholder }}
      </option>
      <optgroup v-for="optGroup in optGroups" :label="getLabel(optGroup.label)">
        <option
          v-for="option in optGroup.options"
          :value="option.value"
          :selected="selectedValue && option.value === selectedValue"
        >
          {{ getLabel(option.label) }}
        </option>
      </optgroup>
    </select>
  </div>
</template>

<script>
import { translate } from '../i18n/localeHelper';

export default {
  props: {
    selectedValue: { type: String },
    placeholder: { type: String },
    optGroups: { type: Array },
    onChange: { type: Function },
  },
  computed: {},
  data() {
    return {
      generation: 2,
    };
  },
  methods: {
    getLabel(key) {
      return translate(key, this.$lang);
    },
    onValueChanged(e) {
      this.onChange(e.target.value);
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

select option,
select optgroup {
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
