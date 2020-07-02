const fs = require('fs');
const path = require('path');

const JSON_FILE_PATH = path.join(__dirname, '../site/.vuepress/data/gameVersions.json');
const CODE_VERSIONS = ['GMSE01', 'GMSJ01', 'GMSP01', 'GMSJ0A'];
const INJECTION_TAG = '<!-- injectionpoint -->';

// Load the current json configuration
const codeJson = JSON.parse(fs.readFileSync(JSON_FILE_PATH));

codeJson.forEach((gameVersion) => {
  gameVersion.codes = [];
});

// Save the codeJSON with the cleared codes
fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(codeJson));

// Clear the code reference
for (let i = 0; i < CODE_VERSIONS.length; i++) {
  const filePath = path.join(
    __dirname,
    `../site/code-reference/${CODE_VERSIONS[i].toLowerCase()}.md`,
  );

  // Get the current reference
  const reference = fs.readFileSync(filePath).toString();

  if (!reference.includes(INJECTION_TAG)) {
    throw new Error(`No injection tag found in ${CODE_VERSIONS[i].toLowerCase()}.md`);
  }

  // Clear everything after the injection tag
  let fileContent = reference.split(INJECTION_TAG)[0] + INJECTION_TAG;

  // Save the reference file
  fs.writeFileSync(filePath, fileContent);
}
