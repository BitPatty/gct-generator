<template>
  <div class="select-wrapper">
    <select @change="(e) => this.onChange(e.target.value)" autocomplete="off">
      <option v-if="placeholder != null" selected disabled>{{
        placeholder
      }}</option>
      <option
        v-for="option in options"
        :value="option.value"
        :selected="selectedValue && option.value === selectedValue"
        >{{ option.label }}</option
      >
    </select>
  </div>
</template>

<script>
export default {
  props: {
    selectedValue: { type: String },
    placeholder: { type: String },
    options: { type: Array },
    onChange: { type: Function },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.select-wrapper {
  position: relative;
  display: inline-block;
  max-width: 400px;
  min-width: 180px;
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
  right: 2px;
  top: 2px;
  width: 50px;
  height: 100%;
  content: "\25BC";
  text-align: center;
  color: white;
  font-size: 18px;
  z-index: -1;
}
</style>
