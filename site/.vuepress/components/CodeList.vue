<template>
  <div>
    <CustomCodeModal
      v-if="customCodeInEditMode"
      :onCancel="closeCustomClodeModal"
      :onSave="saveCustomCode"
      :identifier="customCodeInEditMode.identifier"
      :initialValue="customCodeInEditMode.value"
      :initialTitle="customCodeInEditMode.title"
    />
    <div class="preset-select">
      <SelectComponent
        :options="getPresetOptions()"
        :onChange="(v) => loadPreset(v)"
        :placeholder="getPresetPlaceholder()"
        :key="generation"
      />
    </div>
    <div v-for="category in codeCategories" v-bind:key="category.identifier" class="code-group">
      <div class="category-title">
        <span>{{ getCategoryTitle(category) }}</span>
        <ButtonComponent
          :small="true"
          v-if="category.identifier === 'custom'"
          className="btn-add-custom-code"
          label="+"
          :onClick="initCustomCodeModal"
        />
      </div>
      <ul>
        <li
          v-for="(code, idx) in availableCodes.filter((c) => c.category === category.identifier)"
          v-bind:key="code.identifier ? code.identifier : idx"
          :class="code.selected ? 'checked' : code.disabled ? 'disabled' : ''"
          @click="toggle(code)"
          @mouseover="inspect(code)"
        >
          <span>
            {{ getCodeTitle(code) }}
          </span>
          <div class="code-menu">
            <button
              v-if="code.identifier != null && code.category === 'custom'"
              type="button"
              class="btn-edit-custom-code"
              @click="(e) => deleteCustomCode(e, code.identifier)"
            >
              &#215;
            </button>
          </div>
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
    version: { type: String },
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
      customCodes: [],
      customCodeInEditMode: null,
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
    emitChangeEvent() {
      const selectedCodes = this.availableCodes.filter((c) => c.selected);
      this.onSelectionChanged(selectedCodes);
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
      this.emitChangeEvent();
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
      this.emitChangeEvent();
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
    initCustomCodeModal() {
      this.customCodeInEditMode = {
        identifier: btoa(new Date().toISOString()),
        title: undefined,
        value: undefined,
      };
    },
    closeCustomClodeModal() {
      this.customCodeInEditMode = null;
    },
    deleteCustomCode(e, identifier) {
      e.stopPropagation();
      this.customCodes = this.customCodes.filter((c) => c.identifier !== identifier);
      localStorage.setItem('custom-codes', JSON.stringify(this.customCodes));
      this.availableCodes = this.availableCodes.filter((c) => c.identifier !== identifier);
      this.emitChangeEvent();
    },
    saveCustomCode(identifier, title, value) {
      const updatedCode = {
        identifier,
        author: '-',
        title: [
          {
            lang: 'en-US',
            content: title,
          },
        ],
        description: [
          {
            lang: 'en-US',
            content: '-',
            html: '<p>-</p>',
          },
        ],
        version: '-',
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
        source: value,
        presets: [],
        category: 'custom',
        dependsOn: null,
        createdOnVersion: this.version,
      };
      this.customCodes = [
        ...this.customCodes.filter((c) => c.identifier !== identifier),
        updatedCode,
      ];

      localStorage.setItem('custom-codes', JSON.stringify(this.customCodes));
      this.availableCodes = [
        ...this.availableCodes.filter((c) => c.identifier !== identifier),
        { ...updatedCode, selected: false },
      ];
      this.closeCustomClodeModal();
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
      this.emitChangeEvent();
    },
    populate() {
      const storedCustomCodes = localStorage.getItem('custom-codes');

      if (storedCustomCodes) {
        try {
          const parsedCodes = JSON.parse(storedCustomCodes);
          this.customCodes = parsedCodes;
        } catch (err) {
          this.customCodes = [];
        }
      } else {
        this.customCodes = [];
      }

      this.availableCodes = [
        ...this.codes.map((c) => ({ ...c, selected: false })),
        ...this.customCodes.map((c) => ({ ...c, selected: false })),
      ];

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
  position: relative;
  color: white;
  font-weight: 500;
  text-align: center;
  background: #383838b5;
  padding: 2px;
  margin-bottom: 0;
  display: grid;
  grid-template-columns: auto min-content;
}

.btn-add-custom-code {
  min-width: unset;
  width: auto;
}

.btn-edit-custom-code {
  background: transparent;
  border: none;
  font-size: 1.2em;
  font-weight: bold;
  color: red;
  cursor: pointer;
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
  overflow: hidden;
  padding-right: 5px;
  min-width: 260px;
  max-width: 260px;
  text-align: left;
  position: relative;
  display: grid;
  grid-template-columns: auto min-content min-content;
}

ul li > span {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
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

@media screen and (max-width: 1100px) {
  ul li {
    max-width: 100%;
  }
}
</style>
