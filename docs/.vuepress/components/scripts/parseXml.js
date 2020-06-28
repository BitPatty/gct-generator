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

export default parseXml;
