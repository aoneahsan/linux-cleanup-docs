/** Helpers shared by the docs' ecosystem pages: the copy's {placeholders}, its CLDR plural keys and locale links. */
import { usePluginData } from '@docusaurus/useGlobalData';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { localeRow } from '@site/src/data/locales';

export interface BandData {
  band: Record<string, string>;
  footer: Record<string, string>;
  kind: Record<string, string>;
  products: { id: string; name: string; category: string; liveUrl: string; card: string }[];
}

/** Fills `{name}` placeholders (the website catalogue's single-brace form). */
export function fill(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

/** Picks `base_one` / `base_other` … for `count` in the page's language. */
export function pluralOf(table: Record<string, unknown>, base: string, count: number, lang: string): string {
  const rule = new Intl.PluralRules(lang).select(count);
  return String(table[`${base}_${rule}`] ?? table[`${base}_other`] ?? '');
}

export function useBand(): BandData {
  return usePluginData('ecosystem-pages') as BandData;
}

/** The current locale's row and the website origin in that locale (for "Details" links that live on the website). */
export function useLocaleRow() {
  const { i18n } = useDocusaurusContext();
  return localeRow(i18n.currentLocale);
}
