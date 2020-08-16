const path = require('path');
const locales = require(path.join(__dirname, '../site/.vuepress/i18n/locales.json'));

/**
 * Gets all leaf nodes from the specified object
 * @param {*} node The root node
 * @param {*} path The already visited path
 */
const getLeaves = (node, path = null) => {
  if (typeof node === 'string') return leavePaths.push(path);
  if (typeof node != 'object') throw new Error(typeof node);
  const currentPath = path ? `${path}.` : '';
  Object.keys(node).forEach((key) => getLeaves(node[key], `${currentPath}${key}`));
};

/**
 * Gets a nested property of the specified node
 * @param {*} node The root node
 * @param {*} path The property path
 */
const getNestedProperty = (node, path) => {
  const props = path.split('.');
  let currentValue = node;

  while (currentValue && props.length > 0) {
    currentValue = currentValue[props.shift()];
  }

  return currentValue;
};

// Load the translation files
const translations = Object.keys(locales).map((locale) => ({
  lang: locales[locale].lang,
  values: require(path.join(__dirname, `../site/.vuepress/i18n/${locales[locale].lang}.json`)),
}));

// Set the default translation
const defaultTranslation = translations.find((t) => t.lang === locales['/'].lang);
console.log(`Default translation set to ${defaultTranslation.lang}`);

// Holds the paths to all leaf nodes of the default translation
const leavePaths = [];
getLeaves(defaultTranslation.values);
console.log('Detected translations: ', leavePaths);

// Compare all translations to the default translation
translations.forEach((t) => {
  console.log(`Comparing ${t.lang} to ${defaultTranslation.lang}`);

  leavePaths.forEach((p) => {
    const value = getNestedProperty(t.values, p);
    if (value == null || typeof value !== 'string') {
      console.warn(`${t.lang} is missing a translation at '${p}'`);
      console.log(
        `::warning file=compare_translations.js::${t.lang} is missing a translation at '${p}'`,
      );
    }
  });
});
