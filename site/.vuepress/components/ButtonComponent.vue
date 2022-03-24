<template>
  <div
    :class="
      disabled
        ? `button-wrapper disabled ${className ? className : ''}`
        : `button-wrapper ${className ? className : ''}`
    "
  >
    <button :class="small ? 'small' : ''" @click="handleClick" :disabled="disabled">
      {{ label }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    small: { type: Boolean, required: false },
    className: { type: String, required: false },
    disabled: { type: Boolean },
    onClick: { type: Function },
    label: { type: String },
  },
  methods: {
    handleClick(e) {
      e.stopPropagation();
      this.onClick();
    },
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

.small {
  padding: 3px 7px;
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
