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

// Constants
const JSON_FILE_PATH = path.join(__dirname, '../site/.vuepress/data/gameVersions.json');
const CODE_VERSIONS = ['GMSE01', 'GMSJ01', 'GMSP01', 'GMSJ0A'];
const INJECTION_TAG = '<!-- injectionpoint -->';

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

  if (!fallbackLang) throw new Error(`No localized ${identifier} found on ${node.textContent}`);
  const fallbackElement = node.querySelector(`${identifier}[lang='${fallbackLang}']`);
  if (fallbackElement) return fallbackElement.textContent;
  throw new Error(`No fallback ${identifier} found on ${node.textContent}`);
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
 * Converts the XML source files to a JSON object
 * @param {*} xmlString The xml string
 */
const parseXml = (xmlString) => {
  const codeCollection = new JSDOM(xmlString, {
    contentType: 'text/xml',
  }).window.document.getElementsByTagName('code');

  const codes = [...codeCollection];

  return codes.map((code) => ({
    author: readTextNode(code, 'author'),
    title: localizeNode(code, 'title'),
    description: localizeMarkdown(code, 'description'),
    version: readTextNode(code, 'version'),
    date: readTextNode(code, 'date'),
    source: readTextNode(code, 'source').replace(/[\s\n\r\t]+/gm, ''),
  }));
};

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
  const xml = fs.readFileSync(path.join(__dirname, `../codes/${CODE_VERSIONS[i]}.xml`));
  codeJson.find((c) => c.identifier === CODE_VERSIONS[i]).codes = parseXml(xml);
}

// Save the codeJSON with the updated codes
fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(codeJson));

Object.keys(locales).forEach((locale) => {
  const localeKey = locales[locale].lang;

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
      const author = `*${code.author.includes(',') ? 'Authors:' : 'Author:'} ${code.author}*`;
      const version = `*Version: ${code.version} (${code.date})*`;
      const description = code.description.find((d) => d.lang === localeKey).content;

      fileContent += `\n\n${title.trim()}\n\n${version.trim()}  \n${author.trim()}\n\n${description.trim()}\n\n`;
    });

    // Save the reference file
    fs.writeFileSync(filePath, fileContent);
  }
});
