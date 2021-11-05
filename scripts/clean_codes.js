const fs = require('fs');
const path = require('path');

const JSON_FILE_PATH = path.join(__dirname, '../site/.vuepress/data/gameVersions.json');
const INJECTION_TAG = '<!-- injectionpoint -->';

const locales = require(path.join(__dirname, '../site/.vuepress/i18n/locales.json'));

// Load the current json configuration
const codeJson = JSON.parse(fs.readFileSync(JSON_FILE_PATH));

codeJson.forEach((gameVersion) => {
  gameVersion.codes = [];
});

// Save the codeJSON with the cleared codes
fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(codeJson));

Object.keys(locales).forEach((locale) => {
  // Clear the code reference
  const filePath = path.join(__dirname, `../site/${locale.trim()}/code-reference/index.md`);

  // Get the current reference
  const reference = fs.readFileSync(filePath).toString();

  if (!reference.includes(INJECTION_TAG)) {
    throw new Error(`No injection tag found in ${locale.trim()}/code-reference/index.md`);
  }

  // Clear everything after the injection tag
  let fileContent = reference.split(INJECTION_TAG)[0] + INJECTION_TAG;

  // Save the reference file
  fs.writeFileSync(filePath, fileContent);
});
