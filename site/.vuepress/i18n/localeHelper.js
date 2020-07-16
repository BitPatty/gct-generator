import enUS from './en-US.json';
import deCH from './de-CH.json';

const translations = {
  enUS,
  deCH,
};

const getNestedProp = (obj, path) => {
  const props = path.split('.');

  try {
    let currentProp = obj[props.shift()];
    while (props.length > 0) currentProp = currentProp[props.shift()];
    return currentProp;
  } catch {
    return null;
  }
};

const translateCodeProp = (code, prop, locale, fallbackLocale, html = false) => {
  const targetProp = html ? 'html' : 'content';
  const title = code[prop].find((t) => t.lang === locale);
  const fallbackTitle = code[prop].find((t) => t.lang === fallbackLocale);

  if (title && title[targetProp]) code[prop] = title[targetProp];
  else if (fallbackTitle && fallbackTitle[targetProp]) code[prop] = fallbackTitle[targetProp];
  else code[prop] = null;
};

const translateInternal = (identifier, locale) => {
  if (locale) {
    const localeId = locale.replace('-', '');
    if (translations[localeId] != null) {
      const translatedAttribute = getNestedProp(translations[localeId], identifier);
      if (translatedAttribute) return translatedAttribute;
    }
  }
  return null;
};

export const translate = (identifier, locale, fallbackLocale = 'en-US') => {
  const translatedAttribute = translateInternal(identifier, locale);
  if (translatedAttribute) return translatedAttribute;
  return translateInternal(identifier, fallbackLocale);
};

export const translateCode = (code, locale, fallbackLocale = 'en-US') => {
  const cpy = {};
  Object.assign(cpy, code);

  translateCodeProp(cpy, 'title', locale, fallbackLocale);
  translateCodeProp(cpy, 'description', locale, fallbackLocale, true);
  return cpy;
};
