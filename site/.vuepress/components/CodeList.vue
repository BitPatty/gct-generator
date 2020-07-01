<template>
  <ul>
    <li
      v-for="code in availableCodes"
      :class="code.selected ? 'checked' : ''"
      @click="toggle(code)"
      @mouseover="inspect(code)"
    >
      {{ code.title }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    codes: { type: Array },
    onSelectionChanged: { type: Function },
    onInspect: { type: Function },
  },
  mounted() {
    this.populate();
  },
  watch: {
    codes: function() {
      this.populate();
    },
  },
  data() {
    return {
      availableCodes: [],
    };
  },
  methods: {
    toggle(code) {
      code.selected = !code.selected;
      this.onSelectionChanged(this.availableCodes.filter(c => c.selected));
    },
    populate() {
      this.availableCodes = this.codes.map(c => ({ ...c, selected: false }));
    },
    inspect(code) {
      this.onInspect(code);
    },
  },
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 0;
}

ul li {
  cursor: pointer;
  color: #262626;
  transition: 0.1s;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  outline: none;
  display: block;
  min-width: 280px;
  padding-right: 15px;
  text-align: left;
}

ul li:nth-child(odd) {
  background: #e7e7e7;
}

ul li:hover {
  background: #3eaf7c;
  color: #fff;
}

ul li.checked:hover {
  background: #3eaf7c;
  color: #fff;
}

ul li.checked {
  background: #434343;
  color: #fff;
}

li {
  position: relative;
  padding-left: 26px;
}

li::before {
  content: '';
  position: absolute;
  border-color: #a6a6a6;
  border-style: solid;
  border-width: 2px;
  border-radius: 50%;
  left: 6px;
  top: 6px;
  height: 10px;
  width: 10px;
}

li:hover::before {
  border-color: #fff;
  background-color: #1fa76e;
}

li.checked::before {
  border-color: #fff;
  background-color: #d85e55;
}

@media screen and (max-width: 400px) {
  ul li {
    min-width: 180px;
  }
}
</style>
