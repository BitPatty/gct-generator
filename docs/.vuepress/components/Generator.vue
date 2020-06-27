<template>
  <div>
    <div>
      <p v-if="isLoading">Loading...</p>
    </div>
    <section class="config">
      <div>
        <span>Game Version:</span>
        <VersionSelect :onChange="onVersionChanged" />
      </div>
      <div>
        <span>Download Format:</span>
        <FormatSelect :onChange="onFormatChanged" />
      </div>
      <div>
        <span>Use Stage Loader:</span>
        <SelectComponent :options="useStageLoaderOptions" :onChange="onStageLoaderChanged" />
      </div>
      <div>
        <span>Download:</span>
        <DownloadButton
          :codes="selectedCheats"
          :versionIdentifier="selectedVersion"
          :format="selectedFormat"
        />
      </div>
    </section>
    <section>
      <div v-if="codes && codes.length > 0">
        <h3>Available Codes</h3>
        <CodeList
          :codes="codes"
          :onSelectionChanged="onCheatSelectionChanged"
          :onInspect="inspect"
        />
      </div>
      <div v-if="codes && codes.length > 0 && useStageLoader">
        <h3>Stage Loader</h3>
        <StageLoader />
      </div>

      <div v-if="codes && codes.length > 0" class="help">
        <h3>Help</h3>
        <CodeInfo v-if="!!inspectingCode" :code="inspectingCode" />
        <div v-else>Select your codes from the list on the left.</div>
      </div>
      <div v-if="selectedVersion == null" class="help">
        <h3>Super Mario Sunshine Cheatfile Generator</h3>
        <div>
          <p>
            This is a cheatfile generator for Super Mario Sunshine speedrun
            practice. If this is your first time using the generator we highly
            recommend to check out the
            <a
              href="/guide.html"
              target="_blank"
            >guide</a> first. Visit the
            <a
              href="/guide.html#troubleshooting"
              target="_blank"
            >the troubleshooting section</a>
            if you encounter any issues.
          </p>
          <div>
            <h4>The SMS Speedrunning Community</h4>
            <ul>
              <li>
                Discord:
                <a
                  href="https://discord.gg/9dGJWEc"
                  target="_blank"
                >https://discord.gg/9dGJWEc</a>
              </li>
              <li>
                Speedrun.com:
                <a
                  href="https://speedrun.com/sms"
                  target="_blank"
                >https://speedrun.com/sms</a>
              </li>
              <li>
                Twitter:
                <a
                  href="https://twitter.com/SMSCommunity"
                  target="_blank"
                >https://twitter.com/SMSCommunity</a>
              </li>
              <li>
                Twitch:
                <a
                  href="https://www.twitch.tv/SunshineCommunity"
                  target="_blank"
                >https://www.twitch.tv/SunshineCommunity</a>
              </li>
            </ul>
          </div>
          <div>
            <p>
              The generator is brought to you by
              <a
                href="https://twitter.com/psychonauter"
                target="_blank"
              >Psychonauter</a>,
              <a href="https://twitter.com/Qbe_Root" target="_blank">Noki Doki</a>
              and
              <a href="https://twitter.com/srlMilk" target="_blank">Milk</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// Components
import VersionSelect from "./VersionSelect";
import FormatSelect from "./FormatSelect";
import SelectComponent from "./SelectComponent";
import StageLoader from "./StageLoader";
import CodeInfo from "./CodeInfo";
import CodeList from "./CodeList";
import DownloadButton from "./DownloadButton";

// Data
import gameVersions from "../data/gameVersions.json";

// Helpers
import parseXml from "./scripts/parseXml";

// Libs
import axios from "axios";

export default {
  mounted() {
    Promise.all(
      gameVersions.map(async v => ({
        identifier: v.identifier,
        cheats: parseXml((await axios.get(`/codes/${v.identifier}.xml`)).data),
        fastCodes: (await axios.get(`/codes/fast/${v.identifier}.json`)).data
      }))
    )
      .then(codes => {
        localStorage.setItem("codes", JSON.stringify(codes));
        this.isLoading = false;
      })
      .catch(err => {
        if (localStorage.getItem("codes") != null) this.isLoading = false;
      });
  },
  data() {
    return {
      isLoading: true,
      codes: [],
      selectedCheats: [],
      inspectingCode: null,
      selectedVersion: null,
      selectedFormat: null,
      useStageLoader: false,
      useStageLoaderOptions: [
        { value: false, label: "No" },
        { value: true, label: "Yes" }
      ]
    };
  },
  methods: {
    onVersionChanged(e) {
      this.selectedVersion = e;
      this.selectedCheats = [];
      const storedCodes = JSON.parse(localStorage.getItem("codes"));
      this.codes = storedCodes.find(c => c.identifier === e).cheats;
      this.inspectingCode = null;
    },
    onFormatChanged(e) {
      this.selectedFormat = e;
    },
    onStageLoaderChanged(e) {
      this.useStageLoader = e;
    },
    onCheatSelectionChanged(e) {
      this.selectedCheats = e;
    },
    inspect(code) {
      this.inspectingCode = code;
    }
  }
};
</script>
<style scoped>
section {
  display: flex;
  flex-wrap: nowrap;
}

section > div {
  display: inline-block;
  vertical-align: top;
}

section > div:not(:first-child) {
  margin-left: 20px;
}

.config span {
  display: block;
  margin-bottom: 10px;
  padding-left: 2px;
}
</style>

<style>
body {
  overflow: scroll;
}
</style>
