<template>
  <div>
    <div class="config">
      <span>Remove Dialogue:</span>
      <SelectComponent
        :options="removeDialogueOptions"
        :onChange="onRemoveDialogueSelectionChanged"
        :selectedValue="removeDialogSelection"
      />
    </div>
    <div class="config">
      <span>Skippable FMVs:</span>
      <SelectComponent
        :options="skippableFMVsOptions"
        :onChange="onSkippableFMVsSelectionChanged"
        :selectedValue="skippableFMVsSelection"
      />
    </div>
    <div class="config">
      <span>Level Order:</span>
      <SelectComponent
        :options="levelOrderOptions"
        :onChange="onLevelOrderSelectionChanged"
        :selectedValue="levelOrderSelection"
      />
    </div>
    <div class="config">
      <span>Post Game:</span>
      <SelectComponent
        :options="postGameOptions"
        :onChange="onPostGameSelectionChanged"
        :selectedValue="postGameSelection"
      />
    </div>
    <div class="config">
      <span>Route:</span>
      <ul class="level-select">
        <draggable
          v-model="selectedRoute"
          handle=".route-drag"
          ghost-class="ghost"
          @end="onDragEnd"
        >
          <li v-for="(level, index) in selectedRoute">
            <div class="route-drag">&#8801;</div>

            <GroupSelectComponent
              :selectedValue="level.value"
              :optGroups="stageLoaderLevelOptions"
              :onChange="e => onStageLoaderLevelChanged(index, e)"
              :key="index"
            />
            <button @click="onLevelDeleted(index)" type="button" class="route-remove">&#215;</button>
          </li>
        </draggable>
      </ul>
    </div>
    <div class="config">
      <div class="sub">
        <GroupSelectComponent
          placeholder="Choose a level.."
          :optGroups="stageLoaderLevelOptions"
          :onChange="onStageLoaderLevelSelected"
          selectedValue="placeholder"
          :key="generation"
        />
      </div>
      <div class="sub">
        <ButtonComponent label="Clear List" :onClick="onClearList" />
      </div>
      <div class="sub">
        <GroupSelectComponent
          placeholder="Load a preset.."
          :optGroups="stageLoaderPresetOptions"
          :onChange="onStageLoaderPresetSelected"
          selectedValue="placeholder"
          :key="generation + 1"
        />
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
  data() {
    return {
      selectedRoute: [],
      stageLoaderLevelOptions: stageLoaderLevels,
      stageLoaderPresetOptions: stageLoaderPresets,
      removeDialogueOptions: [
        { value: 'yes', label: 'Always' },
        { value: 'pv5', label: 'Not in Pinna 5' },
        { value: 'no', label: "Don't include" },
      ],
      skippableFMVsOptions: [
        { value: 'yes', label: 'Always' },
        { value: 'pp', label: 'Not in Pinna' },
        { value: 'no', label: "Don't include" },
      ],
      levelOrderOptions: [
        { value: 'list', label: 'As specified' },
        { value: 'shuffle', label: 'Random, no duplicates' },
        { value: 'random', label: 'Fully random' },
      ],
      postGameOptions: [
        { value: '0F00', label: 'Return to title screen' },
        { value: '0109', label: 'Load the flooded plaza' },
        { value: '3400', label: 'Load post-Corona plaza' },
        { value: '3C00', label: 'Load the Bowser fight' },
      ],
      removeDialogSelection: 'yes',
      skippableFMVsSelection: 'yes',
      levelOrderSelection: 'list',
      postGameSelection: '0F00',
      generation: 0,
    };
  },
  methods: {
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

      const newRoute = [];

      for (let i = 0; i <= preset.length - 4; i += 4) newRoute.push({ value: preset.substr(i, 4) });

      this.selectedRoute = newRoute;

      if (ending) this.postGameSelection;
      this.updateCode();
    },
    onDragEnd() {
      this.updateCode();
    },
    onClearList() {
      if (this.selectedRoute?.length > 0 && !confirm('Do you really want to clear the list?'))
        return;

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
          this.selectedRoute.map(v => v.value),
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
