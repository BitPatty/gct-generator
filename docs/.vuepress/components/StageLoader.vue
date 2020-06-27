<template>
  <div>
    <div class="config">
      <span>Remove Dialogue:</span>
      <SelectComponent :options="removeDialogueOptions" :onChange="onRemoveDialogueChanged" />
    </div>
    <div class="config">
      <span>Skippable FMVs:</span>
      <SelectComponent :options="skippableFMVsOptions" :onChange="onSkippableFMVsChanged" />
    </div>
    <div class="config">
      <span>Level Order:</span>
      <SelectComponent :options="levelOrderOptions" :onChange="onLevelOrderChanged" />
    </div>
    <div class="config">
      <span>Post Game:</span>
      <SelectComponent :options="postGameOptions" :onChange="onPostGameSelectionChanged" />
    </div>
    <div>
      <ul id="route_levels">
        <li draggable="false">
          <!-- <div class="route_drag">&#8801;</div> -->
          <GroupSelectComponent
            placeholder="Choose a level.."
            :optGroups="stageLoaderLevelOptions"
            :onClick="onStageLoaderLevelSelected"
          />
          <!-- <button type="button" class="route_remove">&#215;</button> -->
        </li>
      </ul>
    </div>
    <div class="config">
      <ButtonComponent label="Clear List" :onClick="onClearList" />
    </div>
    <div>
      <GroupSelectComponent
        placeholder="Load a preset.."
        :optGroups="stageLoaderPresetOptions"
        :onChange="onStageLoaderPresetSelected"
      />
    </div>
  </div>
</template>

<script>
// Components
import SelectComponent from "./SelectComponent";
import ButtonComponent from "./ButtonComponent";
import GroupSelectComponent from "./GroupSelectComponent";

// Data
import stageLoaderLevels from "../data/stageLoaderLevels.json";
import stageLoaderPresets from "../data/stageLoaderPresets.json";

export default {
  data() {
    return {
      stageLoaderLevelOptions: stageLoaderLevels,
      stageLoaderPresetOptions: stageLoaderPresets,
      removeDialogueOptions: [
        { value: "yes", label: "Always" },
        { value: "pv5", label: "Not in Pinna 5" },
        { value: "no", label: "Don't include" }
      ],
      skippableFMVsOptions: [
        { value: "yes", label: "Always" },
        { value: "pp", label: "Not in Pinna" },
        { value: "no", label: "Don't include" }
      ],
      levelOrderOptions: [
        { value: "list", label: "As specified" },
        { value: "shuffle", label: "Random, no duplicates" },
        { value: "random", label: "Fully random" }
      ],
      postGameOptions: [
        { value: "0F00", label: "Return to title screen" },
        { value: "0109", label: "Load the flooded plaza" },
        { value: "3400", label: "Load post-Corona plaza" },
        { value: "3C00", label: "Load the Bowser fight" }
      ],
      removeDialogSelection: null,
      skippableFMVsSelection: null,
      levelOrderSelection: null,
      postGameSelection: null
    };
  },
  methods: {
    onRemoveDialogueChanged(e) {
      this.removeDialogSelection = e;
    },
    onSkippableFMVsChanged(e) {
      this.skippableFMVsSelection = e;
    },
    onLevelOrderChanged(e) {
      this.levelOrderSelection = e;
    },
    onPostGameSelectionChanged(e) {
      this.postGameSelection = e;
    },
    onStageLoaderLevelSelected(e) {
      return;
    },
    onStageLoaderPresetSelected(e) {
      return;
    },
    onClearList() {
      return;
    }
  }
};
</script>

<style scoped>
.config span {
  display: block;
  margin-bottom: 10px;
  padding-left: 2px;
}

.config select {
  width: 100%;
}
</style>