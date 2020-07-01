import fs from 'fs';

const jsonFilePath = '../site/.vuepress/data/gameVersions.json';
const codeVersions = ['GMSE01', 'GMSJ01', 'GMSP01', 'GMSJ0A'];

const parseXml = xmlString => {
  const codeCollection = new DOMParser()
    .parseFromString(xmlString, 'text/xml')
    .getElementsByTagName('code');

  const codes = [...codeCollection];

  return codes.map(code => ({
    author: parseTextNode(code, 'author'),
    title: parseTextNode(code, 'title'),
    description: parseTextNode(code, 'description'),
    version: parseTextNode(code, 'version'),
    date: parseTextNode(code, 'date'),
    source: parseTextNode(code, 'source').replace(/[\s\n\r\t]+/gm, ''),
  }));
};

const parseTextNode = (node, identifier) => node.getElementsByTagName(identifier)[0].textContent;

const codes = JSON.parse(fs.readFileSync(jsonFilePath));

for (let i = 0; i < codeVersions.length; i++) {
  const xml = fs.readFileSync(`../${codeVersions[i]}.xml`);
  codes.find(c => c.identifier === codeVersions[i]).codes = parseXml(xml);
}

fs.writeFileSync(jsonFilePath, JSON.stringify(codes));
