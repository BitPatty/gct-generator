<template>
  <div>
    <section class="config">
      <div>
        <span>{{ getLabel('generatorconfig.gameversion.label') }}</span>
        <VersionSelect
          :onChange="onVersionChanged"
          :selectedValue="selectedVersion"
          :key="generation"
        />
      </div>
      <div>
        <span>{{ getLabel('generatorconfig.downloadformat.label') }}</span>
        <FormatSelect :onChange="onFormatChanged" :selectedValue="selectedFormat" />
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
    <section>
      <div v-if="codes && codes.length > 0">
        <h3>{{ getLabel('headers.codelist') }}</h3>
        <CodeList
          :version="selectedVersion"
          :onStageLoaderToggle="onStageLoaderToggle"
          :codes="codes"
          :onSelectionChanged="onCheatSelectionChanged"
          :onInspect="inspect"
          :onInspectStageLoader="displayStageLoaderHelp"
        />
      </div>
      <div class="prevent-shrink" v-if="codes && codes.length > 0 && useStageLoader">
        <h3>{{ getLabel('headers.stageloader') }}</h3>
        <StageLoader :fastCodes="stageLoaderCodes" :onChange="onStageLoaderCodeChanged" />
      </div>

      <div v-if="codes && codes.length > 0" class="help">
        <h3>{{ getLabel('headers.help') }}</h3>
        <CodeInfo v-if="!!inspectingCode" :code="inspectingCode" :version="selectedVersion" />
        <div v-else-if="showStageLoaderHelp">
          <h3>{{ getLabel('headers.stageloader') }}</h3>
          <div>
            {{ getLabel('stageloader.help') }}
          </div>
        </div>
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
                <a :href="getLabel('landingpage.links.discordlink')" target="_blank" rel="noopener">
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
              <a href="https://twitter.com/Qbe_Root" target="_blank" rel="noopener">Noki Doki</a>,
              <a href="https://twitter.com/sup39x1207" target="_blank" rel="noopener">sup39</a>
              &amp;
              <a href="https://twitter.com/srlMilk" target="_blank" rel="noopener">Milk</a>.
            </p>
          </div>
          <div class="centered">
            <a href="/">English</a> | <a href="/ja">日本語</a> | <a href="/de">Deutsch</a> |
            <a href="/fr">Français</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
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
      showStageLoaderHelp: false,
      generation: 0,
    };
  },
  methods: {
    getLabel(key) {
      return translate(key, this.$lang);
    },
    onVersionChanged(e) {
      if (
        this.selectedCheats.length > 0 &&
        !confirm(translate('common.selectionreset', this.$lang))
      ) {
        this.generation++;
        return;
      }

      this.selectedVersion = e;
      this.selectedCheats = [];
      this.codes = gameVersions.find((c) => c.identifier === e).codes;
      this.stageLoaderCodes = gameVersions.find((c) => c.identifier === e).fastCode;
      this.inspectingCode = null;
      this.showStageLoaderHelp = false;
      try {
        window._paq.push([
          'trackEvent',
          'GCT Generator',
          'Change Version',
          JSON.stringify({ version: e }),
        ]);
      } catch {}
    },
    onFormatChanged(e) {
      this.selectedFormat = e;
      try {
        window._paq.push([
          'trackEvent',
          'GCT Generator',
          'Change Format',
          JSON.stringify({ format: e }),
        ]);
      } catch {}
    },
    onStageLoaderToggle(enabled) {
      this.useStageLoader = enabled;
      if (!this.useStageLoader) this.selectedStageLoader = null;
      try {
        window._paq.push([
          'trackEvent',
          'GCT Generator',
          'Change StageLoader State',
          JSON.stringify({ enabled }),
        ]);
      } catch {}
    },
    onCheatSelectionChanged(e) {
      this.selectedCheats = e;
      try {
        window._paq.push(['trackEvent', 'GCT Generator', 'Change Cheat Selection', '']);
      } catch {}
    },
    onStageLoaderCodeChanged(e) {
      this.selectedStageLoader = e;
    },
    displayStageLoaderHelp() {
      this.inspectingCode = null;
      this.showStageLoaderHelp = true;
    },
    inspect(code) {
      this.showStageLoaderHelp = false;
      this.inspectingCode = code;
    },
  },
};
</script>
<style scoped>
section {
  display: flex;
  flex-wrap: nowrap;
  position: relative;
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
  position: sticky;
  top: 58px;
  z-index: 999;
  padding: 16px 0px;
  background: white;
  border-bottom: 1px solid #dfdfdf;
}

.config span {
  display: block;
  margin-bottom: 10px;
  padding-left: 2px;
}

.help {
  position: sticky;
  top: 90px;
  text-align: left;
  align-self: flex-start;
  width: 100%;
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
