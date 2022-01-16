<template>
  <div>
    <div class="preset-select">
      <SelectComponent
        :options="getPresetOptions()"
        :onChange="(v) => loadPreset(v)"
        :placeholder="getPresetPlaceholder()"
        :key="generation"
      />
    </div>
    <div v-for="category in codeCategories" v-bind:key="category.identifier" class="code-group">
      <div class="category-title">{{ getCategoryTitle(category) }}</div>
      <ul>
        <li
          v-for="(code, idx) in availableCodes.filter((c) => c.category === category.identifier)"
          v-bind:key="idx"
          :class="code.selected ? 'checked' : code.disabled ? 'disabled' : ''"
          @click="toggle(code)"
          @mouseover="inspect(code)"
        >
          {{ getCodeTitle(code) }}
        </li>
        <li
          v-if="category.identifier === 'loader'"
          :class="stageLoaderSelected ? 'checked' : ''"
          @click="toggleStageLoader()"
          @mouseover="showStageLoaderHelp()"
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
    onInspectStageLoader: { type: Function },
  },
  mounted() {
    this.populate();
  },
  watch: {
    codes: function () {
      this.populate();
      this.unselectStageLoader();
    },
  },
  data() {
    return {
      availableCodes: [],
      codeCategories,
      presetCategories,
      stageLoaderSelected: false,
      generation: 0,
    };
  },
  methods: {
    getPresetOptions() {
      return presetCategories.map((c) => ({
        label: c.i18nKey,
        value: c.identifier,
      }));
    },
    loadPreset(identifier) {
      if (
        (this.stageLoaderSelected || this.availableCodes.find((c) => c.selected)) &&
        !confirm(translate('common.selectionreset', this.$lang))
      ) {
        this.generation++;
        return;
      }

      for (const code of this.availableCodes) {
        code.selected = code.presets.includes(identifier);
      }

      this.unselectStageLoader();
      this.refreshDisabledCodes();
      this.onSelectionChanged(this.availableCodes.filter((c) => c.selected));
      this.generation++;
    },
    getPresetPlaceholder() {
      return translate('common.loadpresetplaceholder', this.$lang);
    },
    unselectStageLoader() {
      if (this.stageLoaderSelected) {
        this.stageLoaderSelected = false;
        this.onStageLoaderToggle(false);
      }
    },
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
      this.refreshDisabledCodes();
      this.onSelectionChanged(this.availableCodes.filter((c) => c.selected));
    },
    refreshDisabledCodes() {
      for (const code of this.availableCodes) {
        if (code.dependsOn) {
          if (code.dependsOn === 'loader' && this.stageLoaderSelected) {
            code.disabled = false;
          } else if (
            !this.availableCodes.some((c) => c.selected && c.category === code.dependsOn)
          ) {
            code.disabled = true;
            code.selected = false;
          } else {
            code.disabled = false;
          }
        }
      }
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

      code.selected = code.disabled ? false : !code.selected;
      this.refreshDisabledCodes();
      this.onSelectionChanged(this.availableCodes.filter((c) => c.selected));
    },
    populate() {
      this.availableCodes = this.codes.map((c) => ({ ...c, selected: false }));
      this.refreshDisabledCodes();
    },
    inspect(code) {
      this.onInspect(code);
    },
    showStageLoaderHelp() {
      this.onInspectStageLoader();
    },
  },
};
</script>

<style scoped>
.category-title {
  color: white;
  font-weight: 500;
  text-align: center;
  background: #383838b5;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-bottom: 0;
}

.category-title ~ ul {
  margin-top: 0;
}

.preset-select {
  margin-bottom: 20px;
}

.code-group {
  border: 1px solid #d7d7d7;
  margin-bottom: 20px;
}

.code-group ul {
  margin-bottom: 0;
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
  background: #f3f3f3;
}

ul li:not(.disabled):hover {
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

ul li.disabled {
  background: #c7c7c7;
  color: #767676;
}

ul li.disabled:hover {
  cursor: not-allowed;
}

li {
  position: relative;
  padding-left: 26px;
}

li::before {
  content: '';
  position: absolute;
  border-color: #e7e7e7;
  border-style: solid;
  border-width: 2px;
  border-radius: 50%;
  left: 6px;
  top: 6px;
  height: 10px;
  width: 10px;
}

li:not(.disabled):not(.checked):hover::before {
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
