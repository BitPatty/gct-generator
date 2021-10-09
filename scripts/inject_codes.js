const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const vuepressContainerPlugin = require('vuepress-plugin-container');

// These plugins have to match the ones used as extensions in .vuepress/config.js
const md = require('@vuepress/markdown')({
  plugins: ['attrs'],
});

const themePlugins = require(path.join(__dirname, '../site/.vuepress/data/themePlugins.json'));
const locales = require(path.join(__dirname, '../site/.vuepress/i18n/locales.json'));
const codeCategories = require(path.join(__dirname, '../site/.vuepress/data/codeCategories.json'));
const presetCategories = require(path.join(
  __dirname,
  '../site/.vuepress/data/presetCategories.json',
));
const xml = fs.readFileSync(path.join(__dirname, `../Codes.xml`));

// Constants
const JSON_FILE_PATH = path.join(__dirname, '../site/.vuepress/data/gameVersions.json');
const CODE_VERSIONS = ['GMSE01', 'GMSJ01', 'GMSP01', 'GMSJ0A'];
const INJECTION_TAG = '<!-- injectionpoint -->';

/**
 * Validates the xml contains usable data
 * @param {*} xmlString The xml string
 */
const validateXML = (xmlString) => {
  console.log('Validating XML file');

  const codeCollection = new JSDOM(xmlString, {
    contentType: 'text/xml',
  }).window.document.getElementsByTagName('code');

  const codes = [...codeCollection];
  const localeIdentifiers = Object.keys(locales).map((l) => locales[l].lang);

  for (let i = 0; i < codes.length; i++) {
    // Fallback title exists
    const codeTitle = codes[i].querySelector("title[lang='en-US']");
    if (!codeTitle || !codeTitle.textContent)
      throw new Error(`Missing Fallback Title (en-US) in code nr ${i}`);

    // Code has a valid category
    const codeCategory = codes[i].querySelector('category');
    if (!codeCategory || !codeCategory.textContent)
      throw new Error(`Missing code category in ${codeTitle.textContent}`);

    if (!codeCategories.map((c) => c.identifier).includes(codeCategory.textContent))
      throw new Error(`Invalid code category for ${codeTitle.textContent}`);

    const codePresets = codes[i].querySelector('presets');
    if (codePresets && codePresets.textContent) {
      for (const preset of codePresets.textContent.split(',')) {
        if (!presetCategories.map((c) => c.identifier).includes(preset))
          throw new Error(`Invalid preset ${preset} for ${codeTitle.textContent}`);
      }
    }

    // All lang attributes on all titles are valid
    const codeTitles = codes[i].querySelectorAll('title');
    for (let j = 0; j < codeTitles.length; j++) {
      if (
        !codeTitles[j].getAttribute('lang') ||
        !localeIdentifiers.includes(codeTitles[j].getAttribute('lang'))
      )
        throw new Error(`Invalid lang attribute on title ${codeTitles[j].textContent}`);
    }

    // Fallback description exists
    const codeDescription = codes[i].querySelector("description[lang='en-US']");
    if (!codeDescription || !codeDescription.textContent)
      throw new Error(`Missing Fallback Description (en-US) in code nr ${i}`);

    // All lang attributes on all descriptions are valid
    const codeDescriptions = codes[i].querySelectorAll('title');
    for (let j = 0; j < codeDescriptions.length; j++) {
      if (
        !codeDescriptions[j].getAttribute('lang') ||
        !localeIdentifiers.includes(codeDescriptions[j].getAttribute('lang'))
      )
        throw new Error(`Invalid lang attribute on description ${codeDescriptions[j].textContent}`);
    }

    // Version tag exists
    if (codes[i].querySelectorAll('version').length !== 1)
      throw new Error(`Missing or duplicate version in code '${codeTitle.textContent}'`);

    // Author tag exists
    if (codes[i].querySelectorAll('author').length !== 1)
      throw new Error(`Missing author in code '${codeTitle.textContent}'`);

    // At least one source exists
    const codeSources = codes[i].querySelectorAll('source');
    if (codeSources.length === 0) throw new Error(`No codes for ${codeTitle.textContent}`);

    // All sources have a valid version attribute
    for (let j = 0; j < codeSources.length; j++) {
      if (
        !codeSources[j].getAttribute('version') ||
        !CODE_VERSIONS.includes(codeSources[j].getAttribute('version'))
      )
        throw new Error(`Invalid source version for code '${codeTitle.textContent}' at index ${j}`);
    }

    // Each source has a valid length
    for (let j = 0; j < codeSources.length; j++) {
      if (
        codeSources[j].textContent.replace(/[\s\n\r\t]+/gm, '').length % 16 != 0 ||
        codeSources[j].textContent.replace(/[\s\n\r\t]+/gm, '').length < 16
      )
        throw new Error(
          `Invalid source length for code '${codeTitle.textContent}' and version ${
            codeSources[j].getAttribute('version').textContent
          }`,
        );
    }

    // All titles and descriptions a unique valid lang attribute
    for (let j = 0; j < localeIdentifiers.length; j++) {
      if (codes[i].querySelectorAll(`title[lang='${localeIdentifiers[j]}']`).length === 0) {
        console.warn(
          `Missing title translation for code '${codeTitle.textContent}' and locale ${localeIdentifiers[j]}`,
        );
        console.log(
          `::warning file=inject_codes.js::Missing title translation for code '${codeTitle.textContent}' and locale ${localeIdentifiers[j]}`,
        );
      }

      if (codes[i].querySelectorAll(`title[lang='${localeIdentifiers[j]}']`).length > 1) {
        throw new Error(
          `Duplicate title translation for code '${codeTitle.textContent}' and locale ${localeIdentifiers[j]}`,
        );
      }

      if (codes[i].querySelectorAll(`description[lang='${localeIdentifiers[j]}']`).length === 0) {
        console.warn(
          `Missing description translation for code '${codeTitle.textContent}' and locale ${localeIdentifiers[j]}`,
        );
        console.log(
          `::warning file=inject_codes.js::Missing description translation for code '${codeTitle.textContent}' and locale ${localeIdentifiers[j]}`,
        );
      }

      if (codes[i].querySelectorAll(`description[lang='${localeIdentifiers[j]}']`).length > 1) {
        throw new Error(
          `Duplicate description translation for code '${codeTitle.textContent}' and locale ${localeIdentifiers[j]}`,
        );
      }
    }

    // All sources have a unique valid version attribute
    for (let j = 0; j < CODE_VERSIONS.length; j++) {
      if (codes[i].querySelectorAll(`source[version='${CODE_VERSIONS[j]}']`).length === 0) {
        console.warn(
          `Missing source on code '${codeTitle.textContent}' for version ${CODE_VERSIONS[j]}`,
        );
        console.log(
          `::warning file=inject_codes.js::Missing source on code '${codeTitle.textContent}' for version ${CODE_VERSIONS[j]}`,
        );
      }

      if (codes[i].querySelectorAll(`source[version='${CODE_VERSIONS[j]}']`).length > 1)
        throw new Error(
          `Duplicate source on code '${codeTitle.textContent}' for version ${CODE_VERSIONS[j]}`,
        );
    }
  }
};

/**
 * Reads the (localized) child node
 * @param {*} node The parent node
 * @param {*} identifier The childs tag name
 * @param {*} lang The target language
 * @param {*} fallbackLang The fallback language
 */
const readTextNode = (node, identifier, lang = null, fallbackLang = null) => {
  if (!lang) {
    const element = node.querySelector(identifier);
    if (!element) throw new Error(`${identifier} not found on ${node.textContent}`);
    return element.textContent;
  }

  const localizedElement = node.querySelector(`${identifier}[lang='${lang}']`);
  if (localizedElement) return localizedElement.textContent;

  const codeTitle = node.querySelector(`title[lang='en-US']`);
  console.warn(`No translation found for code '${codeTitle.textContent}' for locale ${lang}`);
  console.log(
    `::warning file=inject_codes.js::No translation found for code '${codeTitle.textContent}' for locale ${lang}`,
  );

  if (!fallbackLang) throw new Error(`No localized ${identifier} found on ${node.textContent}`);
  const fallbackElement = node.querySelector(`${identifier}[lang='${fallbackLang}']`);
  if (fallbackElement) return fallbackElement.textContent;
  throw new Error(`No fallback ${identifier} found on ${node.textContent}`);
};

/**
 * Reads the presets from the specified code
 * @param {*} node The parent node
 * @param {*} gameVersion The target game version
 * @returns The list of presets
 */
const readPresetList = (node, gameVersion) => {
  if (!node) throw new Error('No node provided');
  const presets = node.querySelector('presets');
  if (!presets || !presets.textContent) return [];
  const targetCode = node.querySelector(`source[version='${gameVersion}']`);
  if (!targetCode) return [];
  const exclusionAttribute = targetCode.getAttribute('exclude-from-presets');
  if (exclusionAttribute === 'true') return [];
  return presets.textContent.split(',');
};

/**
 * Creates an object of localized child nodes
 * @param {*} node The parent node
 * @param {*} identifier The childs tag name
 */
const localizeNode = (node, identifier) =>
  Object.keys(locales).map((locale) => ({
    lang: locales[locale].lang,
    content: readTextNode(node, identifier, locales[locale].lang, 'en-US'),
  }));

/**
 * Trims all lines in a multi-line string
 * @param {*} str The multiline string
 */
const trimLines = (str) => str.replace(/^ +/gm, '').replace(/ +$/gm, '');

/**
 * Localize a markdown text
 * @param {*} node  The parent node
 * @param {*} identifier The childs tag name
 */
const localizeMarkdown = (node, identifier) => {
  const markdowns = localizeNode(node, identifier).map((markdown) => ({
    ...markdown,
    content: trimLines(markdown.content),
  }));

  return markdowns.map((markdown) => ({
    ...markdown,
    html: md.render(markdown.content).html,
  }));
};

/**
 * Find a code by its version attribute (if specified)
 * @param {*} node The parent node
 * @param {*} identifier The childs tag name
 * @param {*} gameVersion The game version
 */
const readCode = (node, identifier, gameVersion = null) => {
  if (!gameVersion) {
    const codeNode = node.querySelector(identifier);
    return codeNode ? codeNode.textContent.replace(/[\s\n\r\t]+/gm, '') : null;
  }

  const codeNode = node.querySelector(`${identifier}[version='${gameVersion}']`);
  return codeNode ? codeNode.textContent.replace(/[\s\n\r\t]+/gm, '') : null;
};

/**
 * Converts the XML source files to a JSON object
 * @param {*} xmlString The xml string
 * @param {*} gameVersion The game version to filter the code on
 */
const parseXml = (xmlString, gameVersion = null) => {
  const codeCollection = new JSDOM(xmlString, {
    contentType: 'text/xml',
  }).window.document.getElementsByTagName('code');

  const codes = [...codeCollection];

  return codes
    .map((code) => ({
      author: readTextNode(code, 'author'),
      title: localizeNode(code, 'title'),
      description: localizeMarkdown(code, 'description'),
      version: readTextNode(code, 'version'),
      date: readTextNode(code, 'date'),
      source: readCode(code, 'source', gameVersion),
      presets: readPresetList(code, gameVersion),
      category: readTextNode(code, 'category'),
    }))
    .filter((code) => code.source != null);
};

// Run validation
validateXML(xml);

// Register themes containers such as tip/warning/danger
themePlugins.forEach((p) => {
  const container = Array.isArray(p) && p.length === 2 ? p[1] : null;
  if (!container) throw new Error();
  vuepressContainerPlugin(container).extendMarkdown(md);
});

// Read the current code list
const codeJson = require(JSON_FILE_PATH);

// Populate all code fields in the codeJSON
for (let i = 0; i < CODE_VERSIONS.length; i++) {
  codeJson.find((c) => c.identifier === CODE_VERSIONS[i]).codes = parseXml(xml, CODE_VERSIONS[i]);
}

// Save the codeJSON with the updated codes
fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(codeJson));

Object.keys(locales).forEach((locale) => {
  const localeKey = locales[locale].lang;
  const localeLabels = require(`../site/.vuepress/i18n/${localeKey}.json`);

  // Populate the code reference
  for (let i = 0; i < CODE_VERSIONS.length; i++) {
    // Load the target reference file
    const filePath = path.join(
      __dirname,
      `../site/${locale.trim('/')}/code-reference/${CODE_VERSIONS[i].toLowerCase()}.md`,
    );

    // Get the current reference
    const reference = fs.readFileSync(filePath).toString();

    if (!reference.includes(INJECTION_TAG)) {
      throw new Error(`No injection tag found in ${CODE_VERSIONS[i].toLowerCase()}.md`);
    }

    // Everything after the injection tag is deleted from the file
    let fileContent = reference.split(INJECTION_TAG)[0] + INJECTION_TAG;

    // Order codes by their localized title
    const codes = codeJson
      .find((c) => c.identifier === CODE_VERSIONS[i])
      .codes.sort((a, b) =>
        a.title.find((t) => t.lang === localeKey).content >
        b.title.find((t) => t.lang === localeKey).content
          ? 1
          : -1,
      );

    // Create a semi-markdown version for all codes
    codes.forEach((code) => {
      const title = `### ${code.title.find((t) => t.lang === localeKey).content}`;
      const author = `*${
        code.author.includes(',') ? localeLabels.codeinfo.authors : localeLabels.codeinfo.author
      } ${code.author}*`;
      const version = `*${localeLabels.codeinfo.version} ${code.version} (${code.date})*`;
      const description = code.description.find((d) => d.lang === localeKey).content;

      fileContent += `\n\n${title.trim()}\n\n${version.trim()}  \n${author.trim()}\n\n${description.trim()}\n\n`;
    });

    // Save the reference file
    fs.writeFileSync(filePath, fileContent);
  }
});
