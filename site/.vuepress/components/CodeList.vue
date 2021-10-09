<template>
  <div>
    <div v-for="category in codeCategories" v-bind:key="category.identifier">
      <div class="category-title">{{ getCategoryTitle(category) }}</div>
      <ul>
        <li
          v-for="(code, idx) in availableCodes.filter((c) => c.category === category.identifier)"
          v-bind:key="idx"
          :class="code.selected ? 'checked' : ''"
          @click="toggle(code)"
          @mouseover="inspect(code)"
        >
          {{ getCodeTitle(code) }}
        </li>
        <li
          v-if="category.identifier === 'loader'"
          :class="stageLoaderSelected ? 'checked' : ''"
          @click="toggleStageLoader()"
        >
          {{ getStageLoaderLabel() }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { translateCode, translate } from '../i18n/localeHelper';
import codeCategories from '../data/codeCategories.json';
import presetCategories from '../data/presetCategories.json';

export default {
  props: {
    codes: { type: Array },
    onSelectionChanged: { type: Function },
    onInspect: { type: Function },
    onStageLoaderToggle: { type: Function },
  },
  mounted() {
    this.populate();
  },
  watch: {
    codes: function () {
      this.populate();
    },
  },
  data() {
    return {
      availableCodes: [],
      codeCategories,
      presetCategories,
      stageLoaderSelected: false,
    };
  },
  methods: {
    getCodeTitle(code) {
      return translateCode(code, this.$lang).title;
    },
    getCategoryTitle(category) {
      return translate(category.i18nKey, this.$lang);
    },
    getStageLoaderLabel() {
      return translate('headers.stageloader', this.$lang);
    },
    toggleStageLoader() {
      for (const c of this.availableCodes.filter((c) => c.category === 'loader' && c.selected)) {
        c.selected = false;
      }

      const newState = !this.stageLoaderSelected;
      this.stageLoaderSelected = newState;
      this.onStageLoaderToggle(newState);
      this.onSelectionChanged(this.availableCodes.filter((c) => c.selected));
    },
    toggle(code) {
      if (!code.selected && codeCategories.find((c) => c.identifier === code.category).exclusive) {
        for (const availableCode of this.availableCodes.filter(
          (c) => c.category === code.category && c.selected,
        )) {
          availableCode.selected = false;
        }
      }

      if (!code.selected && code.category === 'loader' && this.stageLoaderSelected) {
        this.stageLoaderSelected = false;
        this.onStageLoaderToggle(false);
      }

      code.selected = !code.selected;
      this.onSelectionChanged(this.availableCodes.filter((c) => c.selected));
    },
    populate() {
      this.availableCodes = this.codes.map((c) => ({ ...c, selected: false }));
    },
    inspect(code) {
      this.onInspect(code);
    },
  },
};
</script>

<style scoped>
.category-title {
  color: white;
  font-weight: 500;
  text-align: center;
  background: #00522db5;
  padding-top: 2px;
  padding-bottom: 2px;
}

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
  white-space: nowrap;
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
