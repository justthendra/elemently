import enUS from './en-US.json';
import trTR from './tr-TR.json';

export type LocaleCode = 'en-US' | 'tr-TR' | 'de-DE' | 'fr-FR' | 'es-ES' | 'ja-JP' | 'zh-CN' | 'ar-SA';

export interface LocaleInfo {
  code: LocaleCode;
  label: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  available: boolean;
}

export const SUPPORTED_LOCALES: LocaleInfo[] = [
  { code: 'en-US', label: 'English (US)', nativeName: 'English (US)', dir: 'ltr', available: true },
  { code: 'tr-TR', label: 'Turkish', nativeName: 'Türkçe', dir: 'ltr', available: true },
  { code: 'de-DE', label: 'German', nativeName: 'Deutsch', dir: 'ltr', available: false },
  { code: 'fr-FR', label: 'French', nativeName: 'Français', dir: 'ltr', available: false },
  { code: 'es-ES', label: 'Spanish', nativeName: 'Español', dir: 'ltr', available: false },
  { code: 'ja-JP', label: 'Japanese', nativeName: '日本語', dir: 'ltr', available: false },
  { code: 'zh-CN', label: 'Chinese (Simplified)', nativeName: '简体中文', dir: 'ltr', available: false },
  { code: 'ar-SA', label: 'Arabic', nativeName: 'العربية', dir: 'rtl', available: false },
];

const dictionaries: Record<string, any> = {
  'en-US': enUS,
  'tr-TR': trTR,
};

export function getInitialLocale(): LocaleCode {
  try {
    const navLang = navigator.language || 'en-US';
    if (navLang.startsWith('tr')) return 'tr-TR';
    if (navLang.startsWith('de')) return 'de-DE';
    if (navLang.startsWith('fr')) return 'fr-FR';
    if (navLang.startsWith('es')) return 'es-ES';
    if (navLang.startsWith('ja')) return 'ja-JP';
    if (navLang.startsWith('zh')) return 'zh-CN';
    if (navLang.startsWith('ar')) return 'ar-SA';
  } catch (e) {
    // ignore
  }
  return 'en-US';
}

export function translate(
  locale: LocaleCode,
  key: string,
  params?: Record<string, string | number>
): string {
  const dict = dictionaries[locale] || dictionaries['en-US'];
  const fallbackDict = dictionaries['en-US'];

  // Handle pluralization if count is provided
  let lookupKey = key;
  if (params && typeof params.count === 'number' && params.count !== 1) {
    const pluralCandidate = `${key}_plural`;
    if (getNestedValue(dict, pluralCandidate) !== undefined) {
      lookupKey = pluralCandidate;
    }
  }

  let value = getNestedValue(dict, lookupKey);
  if (value === undefined && dict !== fallbackDict) {
    value = getNestedValue(fallbackDict, lookupKey);
  }

  if (value === undefined) {
    return key;
  }

  if (typeof value !== 'string') {
    return String(value);
  }

  // Parameter interpolation: {{name}}
  if (params) {
    return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, p1) => {
      return params[p1] !== undefined ? String(params[p1]) : `{{${p1}}}`;
    });
  }

  return value;
}

function getNestedValue(obj: any, path: string): any {
  if (!obj) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

export function formatNumber(locale: LocaleCode, num: number, options?: Intl.NumberFormatOptions): string {
  try {
    return new Intl.NumberFormat(locale, options).format(num);
  } catch {
    return num.toLocaleString();
  }
}

export function formatDate(locale: LocaleCode, date: Date | number, options?: Intl.DateTimeFormatOptions): string {
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return new Date(date).toLocaleDateString();
  }
}

