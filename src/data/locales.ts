/**
 * The ten docs locales, in the fleet's fixed order (aoneahsan-cccs-translations). English keeps the root URL as
 * `en-GB`; every other locale is served under `/<code>/`. `site` is the same locale's prefix on the website, so a
 * link from the manual lands on the website page in the reader's language.
 */
export const LOCALES = [
  { code: 'en-GB', htmlLang: 'en-GB', label: 'English', direction: 'ltr', site: '', font: null },
  { code: 'zh-Hans', htmlLang: 'zh-Hans', label: '简体中文', direction: 'ltr', site: '/zh-Hans', font: 'noto-sans-sc' },
  { code: 'hi', htmlLang: 'hi', label: 'हिन्दी', direction: 'ltr', site: '/hi', font: 'noto-sans-devanagari' },
  { code: 'es', htmlLang: 'es', label: 'Español', direction: 'ltr', site: '/es', font: null },
  { code: 'ar', htmlLang: 'ar', label: 'العربية', direction: 'rtl', site: '/ar', font: 'noto-sans-arabic' },
  { code: 'fr', htmlLang: 'fr', label: 'Français', direction: 'ltr', site: '/fr', font: null },
  { code: 'pt-BR', htmlLang: 'pt-BR', label: 'Português (Brasil)', direction: 'ltr', site: '/pt-BR', font: null },
  { code: 'ru', htmlLang: 'ru', label: 'Русский', direction: 'ltr', site: '/ru', font: null },
  { code: 'ja', htmlLang: 'ja', label: '日本語', direction: 'ltr', site: '/ja', font: 'noto-sans-jp' },
  { code: 'ur', htmlLang: 'ur', label: 'اردو', direction: 'rtl', site: '/ur', font: 'noto-nastaliq-urdu' },
] as const;

export type DocsLocale = (typeof LOCALES)[number]['code'];

export function localeRow(code: string): (typeof LOCALES)[number] {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}
