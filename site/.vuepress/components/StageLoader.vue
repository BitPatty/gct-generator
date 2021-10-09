<template>
  <div>
    <div class="sub">
      <GroupSelectComponent
        :placeholder="getLabel('common.loadpresetplaceholder')"
        :optGroups="stageLoaderPresetOptions"
        :onChange="onStageLoaderPresetSelected"
        selectedValue="placeholder"
        :key="generation + 1"
      />
    </div>
    <div class="config">
      <span>{{ getLabel('stageloader.removedialogue.label') }}</span>
      <SelectComponent
        :options="removeDialogueOptions"
        :onChange="onRemoveDialogueSelectionChanged"
        :selectedValue="removeDialogSelection"
      />
    </div>
    <div class="config">
      <span>{{ getLabel('stageloader.skippablefmvs.label') }}</span>
      <SelectComponent
        :options="skippableFMVsOptions"
        :onChange="onSkippableFMVsSelectionChanged"
        :selectedValue="skippableFMVsSelection"
      />
    </div>
    <div class="config">
      <span>{{ getLabel('stageloader.levelorder.label') }}</span>
      <SelectComponent
        :options="levelOrderOptions"
        :onChange="onLevelOrderSelectionChanged"
        :selectedValue="levelOrderSelection"
      />
    </div>
    <div class="config">
      <span>{{ getLabel('stageloader.postgame.label') }}</span>
      <SelectComponent
        :disabled="levelOrderSelection === 'random'"
        :options="postGameOptions"
        :onChange="onPostGameSelectionChanged"
        :selectedValue="postGameSelection"
      />
    </div>
    <div class="config">
      <span>{{ getLabel('stageloader.route') }}</span>
      <ul class="level-select">
        <draggable
          v-model="selectedRoute"
          handle=".route-drag"
          ghost-class="ghost"
          @end="onDragEnd"
        >
          <li v-for="(level, idx) in selectedRoute" v-bind:key="idx">
            <div class="route-drag">&#8801;</div>

            <GroupSelectComponent
              :selectedValue="level.value"
              :optGroups="stageLoaderLevelOptions"
              :onChange="(e) => onStageLoaderLevelChanged(idx, e)"
              :key="idx"
            />
            <button @click="onLevelDeleted(idx)" type="button" class="route-remove">&#215;</button>
          </li>
        </draggable>
      </ul>
    </div>
    <div class="config">
      <div class="sub">
        <GroupSelectComponent
          :placeholder="getLabel('stageloader.levelselectplaceholder')"
          :optGroups="stageLoaderLevelOptions"
          :onChange="onStageLoaderLevelSelected"
          selectedValue="placeholder"
          :key="generation"
        />
      </div>
      <div class="sub">
        <ButtonComponent :label="getLabel('stageloader.clear')" :onClick="onClearList" />
      </div>
    </div>
  </div>
</template>

<script>
// Components
import SelectComponent from './SelectComponent';
import ButtonComponent from './ButtonComponent';
import GroupSelectComponent from './GroupSelectComponent';

// Data
import stageLoaderLevels from '../data/stageLoaderLevels.json';
import stageLoaderPresets from '../data/stageLoaderPresets.json';

// Util
import generateStageLoaderCode from './scripts/generateStageLoadercode';
import { translate } from '../i18n/localeHelper';

// Lib
import draggable from 'vuedraggable';

export default {
  props: {
    fastCodes: { type: Object },
    onChange: { type: Function },
  },
  components: {
    draggable,
  },
  watch: {
    fastCodes: function () {
      this.updateCode();
    },
  },
  data() {
    return {
      selectedRoute: [],
      stageLoaderLevelOptions: stageLoaderLevels,
      stageLoaderPresetOptions: stageLoaderPresets,
      removeDialogueOptions: [
        { value: 'pv5', label: 'stageloader.removedialogue.options.pv5' },
        { value: 'yes', label: 'stageloader.removedialogue.options.yes' },
        { value: 'no', label: 'stageloader.removedialogue.options.no' },
      ],
      skippableFMVsOptions: [
        { value: 'pp', label: 'stageloader.skippablefmvs.options.pp' },
        { value: 'yes', label: 'stageloader.skippablefmvs.options.yes' },
        { value: 'no', label: 'stageloader.skippablefmvs.options.no' },
      ],
      levelOrderOptions: [
        { value: 'list', label: 'stageloader.levelorder.options.list' },
        { value: 'shuffle', label: 'stageloader.levelorder.options.shuffle' },
        { value: 'random', label: 'stageloader.levelorder.options.random' },
      ],
      postGameOptions: [
        { value: '0F00', label: 'stageloader.postgame.options.0F00' },
        { value: '0109', label: 'stageloader.postgame.options.0109' },
        { value: '0102', label: 'stageloader.postgame.options.0102' },
        { value: '3400', label: 'stageloader.postgame.options.3400' },
        { value: '3C00', label: 'stageloader.postgame.options.3C00' },
      ],
      removeDialogSelection: 'pv5',
      skippableFMVsSelection: 'pp',
      levelOrderSelection: 'list',
      postGameSelection: '0F00',
      generation: 0,
    };
  },
  methods: {
    getLabel(key) {
      return translate(key, this.$lang);
    },
    onRemoveDialogueSelectionChanged(e) {
      this.removeDialogSelection = e;
      this.updateCode();
    },
    onSkippableFMVsSelectionChanged(e) {
      this.skippableFMVsSelection = e;
      this.updateCode();
    },
    onLevelOrderSelectionChanged(e) {
      this.levelOrderSelection = e;
      this.updateCode();
    },
    onPostGameSelectionChanged(e) {
      this.postGameSelection = e;
      this.updateCode();
    },
    onStageLoaderLevelSelected(e) {
      this.generation++;
      this.selectedRoute.push({
        value: e,
      });
      this.updateCode();
    },
    onStageLoaderLevelChanged(index, e) {
      this.selectedRoute[index] = {
        value: e,
      };
      this.updateCode();
    },
    onLevelDeleted(e) {
      this.selectedRoute.splice(e, 1);
      this.updateCode();
    },
    onStageLoaderPresetSelected(e) {
      this.generation++;

      if (
        this.selectedRoute?.length > 0 &&
        !confirm('Loading a preset will erase your current list. Continue?')
      ) {
        return;
      }

      const preset = e.split(';')[0];
      const ending = e.split(';')[1];

      this.selectedRoute = [];

      for (let i = 0; i <= preset.length - 4; i += 4)
        this.selectedRoute.push({ value: preset.substr(i, 4) });

      if (ending) {
        this.postGameSelection = ending;
      }

      this.updateCode();
    },
    onDragEnd() {
      this.updateCode();
    },
    onClearList() {
      if (this.selectedRoute?.length > 0 && !confirm('Do you really want to clear the list?'))
        return;

      this.preferredEnding = null;
      this.selectedRoute = [];
      this.updateCode();
    },
    updateCode() {
      if (
        this.selectedRoute.length === 0 ||
        this.levelOrderSelection == null ||
        this.postGameSelection == null ||
        this.skippableFMVsSelection == null ||
        this.removeDialogSelection == null
      ) {
        this.onChange(null);
        return;
      }

      console.log('Generating new Stageloader-Code');
      this.onChange(
        generateStageLoaderCode(
          this.fastCodes,
          this.selectedRoute.map((v) => v.value),
          this.levelOrderSelection,
          this.postGameSelection,
          this.skippableFMVsSelection,
          this.removeDialogSelection,
        ),
      );
    },
  },
};
</script>

<style scoped>
.config span {
  display: block;
  margin-bottom: 5px;
  padding-left: 2px;
  font-size: 0.9rem;
}

.config:not(:first-child) span {
  margin-top: 10px;
}

.config select {
  width: 100%;
}

ul {
  list-style: none;
  padding-left: 0;
}

ul li {
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 2px;
}

.route-drag {
  cursor: move;
  margin-right: 5px;
}

.sub {
  margin-bottom: 15px;
}

.route-remove {
  margin-left: 3px;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: red;
  cursor: pointer;
}

.level-select >>> .select-wrapper {
  background-color: #62809e;
}

.ghost >>> .select-wrapper {
  background-color: orange;
}
</style>
