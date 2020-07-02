const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const vuepressContainerPlugin = require('vuepress-plugin-container');

// These plugins have to match the ones used as extensions in .vuepress/config.js
const md = require('@vuepress/markdown')({
  plugins: ['attrs'],
});

const customContainers = require('../site/.vuepress/data/customContainers.json');

// Constants
const JSON_FILE_PATH = path.join(__dirname, '../site/.vuepress/data/gameVersions.json');
const CODE_VERSIONS = ['GMSE01', 'GMSJ01', 'GMSP01', 'GMSJ0A'];
const INJECTION_TAG = '<!-- injectionpoint -->';

// Register theme container such as tip/warning/danger
customContainers.forEach((p) => {
  const container = Array.isArray(p) && p.length === 2 ? p[1] : null;
  if (!container) throw new Error();
  vuepressContainerPlugin(container).extendMarkdown(md);
});

// Converts the XML source to a JSON object
const parseXml = (xmlString) => {
  const codeCollection = new JSDOM(xmlString, {
    contentType: 'text/xml',
  }).window.document.getElementsByTagName('code');

  const parseTextNode = (node, identifier) => node.getElementsByTagName(identifier)[0].textContent;
  const trimLines = (str) => str.replace(/^ +/gm, '').replace(/ +$/gm, '');

  const codes = [...codeCollection];

  return codes.map((code) => {
    const descriptionMarkdown = trimLines(parseTextNode(code, 'description'));

    return {
      author: parseTextNode(code, 'author'),
      title: parseTextNode(code, 'title'),
      description: md.render(descriptionMarkdown).html,
      descriptionMarkdown,
      version: parseTextNode(code, 'version'),
      date: parseTextNode(code, 'date'),
      source: parseTextNode(code, 'source').replace(/[\s\n\r\t]+/gm, ''),
    };
  });
};

// Read the current code list
const codeJson = JSON.parse(fs.readFileSync(JSON_FILE_PATH));

// Populate all code fields in the codeJSON
for (let i = 0; i < CODE_VERSIONS.length; i++) {
  const xml = fs.readFileSync(path.join(__dirname, `../codes/${CODE_VERSIONS[i]}.xml`));
  codeJson.find((c) => c.identifier === CODE_VERSIONS[i]).codes = parseXml(xml);
}

// Save the codeJSON with the updated codes
fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(codeJson));

// Populate the code reference
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

  // Everything afte rthe injection tag is deleted from the file
  let fileContent = reference.split(INJECTION_TAG)[0] + INJECTION_TAG;
  const codes = codeJson
    .find((c) => c.identifier === CODE_VERSIONS[i])
    .codes.sort((a, b) => (a.title > b.title ? 1 : -1));

  // Create a semi-markdown version for all codes
  codes.forEach((code) => {
    const title = `### ${code.title}`;
    const author = `*${code.author.includes(',') ? 'Authors:' : 'Author:'} ${code.author}*`;
    const version = `*Version: ${code.version} (${code.date})*`;
    const description = code.descriptionMarkdown;

    fileContent += `\n\n${title.trim()}\n\n${version.trim()}  \n${author.trim()}\n\n${description.trim()}\n\n`;
  });

  // Save the reference file
  fs.writeFileSync(filePath, fileContent);
}
