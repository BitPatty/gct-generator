<template>
  <div :class="disabled ? 'button-wrapper disabled' : 'button-wrapper'">
    <button @click="onClick" :disabled="disabled">{{ label }}</button>
  </div>
</template>

<script>
import CodeFormatter from './scripts/codeFormatter';

export default {
  props: {
    disabled: { type: Boolean },
    onClick: { type: Function },
    label: { type: String },
  },
};
</script>

<style scoped>
.button-wrapper {
  position: relative;
  display: inline-block;
  max-width: 400px;
  min-width: 180px;
  width: 100%;
}

.button-wrapper.disabled button {
  background-color: rgb(165, 165, 165);
  cursor: not-allowed;
}

button {
  border: none;
  outline: none;
  background-color: #2eb9e2;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0;
  margin: 0;
  display: block;
  width: 100%;
  padding: 6px 15px;
  font-size: 14px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
}

button:hover {
  background-color: #3fc1e9;
}
</style>
