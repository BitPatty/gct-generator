const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');

const jsonFilePath = path.join(__dirname, '../site/.vuepress/data/gameVersions.json');
const codeVersions = ['GMSE01', 'GMSJ01', 'GMSP01', 'GMSJ0A'];
const injectionTag = '<!-- injectionpoint -->';

const parseXml = (xmlString) => {
  const codeCollection = new jsdom.JSDOM(xmlString).window.document.getElementsByTagName('code');

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

const parseTextNode = (node, identifier) => node.getElementsByTagName(identifier)[0].textContent;

const codeJson = JSON.parse(fs.readFileSync(jsonFilePath));

for (let i = 0; i < codeVersions.length; i++) {
  const xml = fs.readFileSync(path.join(__dirname, `../codes/${codeVersions[i]}.xml`));
  codeJson.find((c) => c.identifier === codeVersions[i]).codes = parseXml(xml);
}

fs.writeFileSync(jsonFilePath, JSON.stringify(codeJson));

for (let i = 0; i < codeVersions.length; i++) {
  const reference = fs.readFileSync(
    path.join(__dirname, `../site/code-references/${codeVersions[i].toLowerCase()}.md`),
  );

  if (!reference.includes(injectionTag)) {
    throw new Error(`No injection tag found in ${codeVersions[i].toLowerCase()}.md`);
  }

  const fileContent = reference.split(injectionTag)[0] + injectionTag;
  const codes = codeJson.find((c) => c.identifier === codeVersions[i]).codes;

  codes.forEach((code) => {
    const title = `#${code.title}`;
    const author = `*${code.author.includes(',') ? 'Authors' : 'Author'} ${code.author}`;
    const version = `*${code.version} (${code.date})`;
    const description = code.description;

    fileContent += `\n\n${title}\n\n${version}\n\n${author}\n\n${description}`;
  });

  fs.writeFileSync(`../site/code-references/${codeVersions[i].toLowerCase()}.md`, fileContent);
}
