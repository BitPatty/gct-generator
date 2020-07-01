const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const jsonFilePath = path.join(__dirname, '../site/.vuepress/data/gameVersions.json');
const codeVersions = ['GMSE01', 'GMSJ01', 'GMSP01', 'GMSJ0A'];
const injectionTag = '<!-- injectionpoint -->';

// Converts the XML source to a JSON object
const parseXml = (xmlString) => {
  const codeCollection = new JSDOM(xmlString, {
    contentType: 'text/xml',
  }).window.document.getElementsByTagName('code');

  const parseTextNode = (node, identifier) => node.getElementsByTagName(identifier)[0].textContent;

  const codes = [...codeCollection];

  return codes.map((code) => ({
    author: parseTextNode(code, 'author'),
    title: parseTextNode(code, 'title'),
    description: parseTextNode(code, 'description'),
    version: parseTextNode(code, 'version'),
    date: parseTextNode(code, 'date'),
    source: parseTextNode(code, 'source').replace(/[\s\n\r\t]+/gm, ''),
  }));
};

// Read the current code list
const codeJson = JSON.parse(fs.readFileSync(jsonFilePath));

// Populate all code fields in the codeJSON
for (let i = 0; i < codeVersions.length; i++) {
  const xml = fs.readFileSync(path.join(__dirname, `../codes/${codeVersions[i]}.xml`));
  codeJson.find((c) => c.identifier === codeVersions[i]).codes = parseXml(xml);
}

// Save the codeJSON with the updated codes
fs.writeFileSync(jsonFilePath, JSON.stringify(codeJson));

// Populate the code reference
for (let i = 0; i < codeVersions.length; i++) {
  const filePath = path.join(
    __dirname,
    `../site/code-reference/${codeVersions[i].toLowerCase()}.md`,
  );

  // Get the current reference
  const reference = fs.readFileSync(filePath).toString();

  if (!reference.includes(injectionTag)) {
    throw new Error(`No injection tag found in ${codeVersions[i].toLowerCase()}.md`);
  }

  // Everything afte rthe injection tag is deleted from the file
  let fileContent = reference.split(injectionTag)[0] + injectionTag;
  const codes = codeJson
    .find((c) => c.identifier === codeVersions[i])
    .codes.sort((a, b) => (a.title > b.title ? 1 : -1));

  // Create a semi-markdown version for all codes
  codes.forEach((code) => {
    const title = `### ${code.title}`;
    const author = `*${code.author.includes(',') ? 'Authors:' : 'Author:'} ${code.author}*`;
    const version = `*Version: ${code.version} (${code.date})*`;
    const description = code.description;

    fileContent += `\n\n${title.trim()}\n\n${version.trim()}  \n${author.trim()}\n\n${description.trim()}`;
  });

  // Save the reference file
  fs.writeFileSync(filePath, fileContent);
}
