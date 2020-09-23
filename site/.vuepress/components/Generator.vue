<template>
  <div>
    <section class="config">
      <div>
        <span>{{ getLabel('generatorconfig.gameversion.label') }}</span>
        <VersionSelect :onChange="onVersionChanged" :selectedValue="selectedVersion" />
      </div>
      <div>
        <span>{{ getLabel('generatorconfig.downloadformat.label') }}</span>
        <FormatSelect :onChange="onFormatChanged" :selectedValue="selectedFormat" />
      </div>
      <div>
        <span>{{ getLabel('generatorconfig.usestageloader') }}</span>
        <SelectComponent
          :options="useStageLoaderOptions"
          :onChange="onStageLoaderChanged"
          :value="useStageLoader"
        />
      </div>
      <div>
        <span>{{ getLabel('common.download') }}</span>
        <DownloadButton
          :codes="selectedCheats"
          :stageLoaderCode="selectedStageLoader"
          :versionIdentifier="selectedVersion"
          :format="selectedFormat"
        />
      </div>
    </section>
    <br />
    <hr />
    <section>
      <div v-if="codes && codes.length > 0">
        <h3>{{ getLabel('headers.codelist') }}</h3>
        <CodeList
          :codes="codes"
          :onSelectionChanged="onCheatSelectionChanged"
          :onInspect="inspect"
        />
      </div>
      <div class="prevent-shrink" v-if="codes && codes.length > 0 && useStageLoader">
        <h3>{{ getLabel('headers.stageloader') }}</h3>
        <StageLoader :fastCodes="stageLoaderCodes" :onChange="onStageLoaderCodeChanged" />
      </div>

      <div v-if="codes && codes.length > 0" class="help">
        <h3>{{ getLabel('headers.help') }}</h3>
        <CodeInfo v-if="!!inspectingCode" :code="inspectingCode" />
        <div v-else>{{ getLabel('misc.defaulthelpmessage') }}</div>
      </div>
      <div v-if="selectedVersion == null" class="help">
        <h1>{{ getLabel('landingpage.title') }}</h1>
        <div>
          <p v-html="getLabel('landingpage.summary')" />
          <div>
            <h3>{{ getLabel('landingpage.community') }}</h3>
            <ul>
              <li>
                <a href="https://discord.gg/9dGJWEc" target="_blank" rel="noopener">
                  {{ getLabel('landingpage.links.discord') }}
                </a>
              </li>
              <li>
                <a href="https://speedrun.com/sms" target="_blank" rel="noopener">
                  {{ getLabel('landingpage.links.src') }}
                </a>
              </li>
              <li>
                <a href="https://twitter.com/SMSCommunity" target="_blank" rel="noopener">
                  {{ getLabel('landingpage.links.twitter') }}
                </a>
              </li>
              <li>
                <a href="https://www.twitch.tv/SunshineCommunity" target="_blank" rel="noopener">
                  {{ getLabel('landingpage.links.twitch') }}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p>
              GCT Generator &copy; 2017 - {{ new Date().getFullYear() }}
              <a href="https://twitter.com/psychonauter" target="_blank" rel="noopener"
                >Psychonauter</a
              >,
              <a href="https://twitter.com/Qbe_Root" target="_blank" rel="noopener">Noki Doki</a>
              &amp;
              <a href="https://twitter.com/srlMilk" target="_blank" rel="noopener">Milk</a>.
            </p>
          </div>
          <div class="centered">
            <a href="/">English</a> | <a href="/ja">言語設定</a> | <a href="/de">Deutsch</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// Components
import VersionSelect from './VersionSelect';
import FormatSelect from './FormatSelect';
import SelectComponent from './SelectComponent';
import StageLoader from './StageLoader';
import CodeInfo from './CodeInfo';
import CodeList from './CodeList';
import DownloadButton from './DownloadButton';

// Data
import gameVersions from '../data/gameVersions.json';

// Util
import { translate } from '../i18n/localeHelper';

export default {
  data() {
    return {
      codes: [],
      selectedCheats: [],
      selectedStageLoader: null,
      inspectingCode: null,
      selectedVersion: null,
      selectedFormat: 'gct',
      useStageLoader: false,
      stageLoaderCodes: [],
      useStageLoaderOptions: [
        { value: false, label: 'common.no' },
        { value: true, label: 'common.yes' },
      ],
    };
  },
  methods: {
    getLabel(key) {
      return translate(key, this.$lang);
    },
    onVersionChanged(e) {
      this.selectedVersion = e;
      this.selectedCheats = [];
      this.codes = gameVersions.find((c) => c.identifier === e).codes;
      this.stageLoaderCodes = gameVersions.find((c) => c.identifier === e).fastCode;
      this.inspectingCode = null;
    },
    onFormatChanged(e) {
      this.selectedFormat = e;
    },
    onStageLoaderChanged(e) {
      this.useStageLoader = e === true || e === 'true';
      if (!this.useStageLoader) this.selectedStageLoader = null;
    },
    onCheatSelectionChanged(e) {
      this.selectedCheats = e;
    },
    onStageLoaderCodeChanged(e) {
      this.selectedStageLoader = e;
    },
    inspect(code) {
      this.inspectingCode = code;
    },
  },
};
</script>
<style scoped>
section {
  display: flex;
  flex-wrap: nowrap;
}

.prevent-shrink {
  flex-shrink: 0;
}

section > div {
  display: inline-block;
  vertical-align: top;
}

section > div:not(:first-child) {
  margin-left: 20px;
}

.config {
  position: relative;
}

.config span {
  display: block;
  margin-bottom: 10px;
  padding-left: 2px;
}

.help {
  text-align: left;
}

.centered {
  width: 100%;
  text-align: center;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
  .config .loading-overlay {
    -webkit-backdrop-filter: blur(1px);
    backdrop-filter: blur(1px);
  }
}

@media screen and (max-width: 1100px) {
  section {
    flex-wrap: wrap;
    display: block;
    margin-left: 0px;
    text-align: center;
  }

  section > div,
  section > div:not(:first-child) {
    margin-left: 0px;
    width: 100%;
  }
}
</style>

<style>
body {
  overflow-y: scroll;
}
</style>
