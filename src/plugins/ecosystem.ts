/**
 * "More from Zaions" and "About the developer" on the docs site (aoneahsan-cccs-ecosystem-showcase,
 * aoneahsan-cccs-about-developer). For the locale being built it reads that locale's copy (vendored from the website's
 * catalogues), publishes the carousel's small data as global data, and adds /ecosystem, one page per product and
 * /about-developer as real routes, so each is prerendered, in the sitemap and in every locale. This product never
 * lists itself: the vendored roster leaves it out, and the filter below drops it again.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { LoadContext, Plugin } from '@docusaurus/types';
import { aliasedSitePath } from '@docusaurus/utils';

export const CURRENT_PRODUCT_ID = 'linux-cleanup';

export interface RosterProduct {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly liveUrl: string;
  readonly facts: readonly { readonly id: string; readonly checked: string }[];
}

export default function ecosystemPages(context: LoadContext): Plugin {
  return {
    name: 'ecosystem-pages',
    async contentLoaded({ actions }) {
      const read = (p: string) => JSON.parse(readFileSync(path.join(context.siteDir, p), 'utf8')) as Record<string, unknown>;
      const roster = (read('src/data/ecosystem.json').products as RosterProduct[]).filter((p) => p.id !== CURRENT_PRODUCT_ID);
      const copy = read(`src/data/ecosystem/${context.i18n.currentLocale}.json`) as {
        ecosystem: { band: Record<string, string>; footer: Record<string, string>; kind: Record<string, string>; products: Record<string, { card: string }> };
      };
      const e = copy.ecosystem;
      actions.setGlobalData({
        band: e.band,
        footer: e.footer,
        kind: e.kind,
        products: roster.map((p) => ({ id: p.id, name: p.name, category: p.category, liveUrl: p.liveUrl, card: e.products[p.id]?.card ?? '' })),
      });
      // Generated data is referenced as @site/… (never an absolute path, which would ship this machine's folders).
      const data = async (name: string, value: unknown) => aliasedSitePath(await actions.createData(name, JSON.stringify(value)), context.siteDir);
      const copyModule = await data('ecosystem-copy.json', copy);
      const rosterModule = await data('ecosystem-roster.json', roster);
      const modules = { copy: copyModule, roster: rosterModule };
      actions.addRoute({ path: `${context.baseUrl}ecosystem`, component: '@site/src/components/ecosystem/EcosystemPage', exact: true, modules });
      for (const p of roster) {
        const product = await data(`ecosystem-${p.id}.json`, p);
        actions.addRoute({ path: `${context.baseUrl}ecosystem/${p.id}`, component: '@site/src/components/ecosystem/EcosystemProductPage', exact: true, modules: { ...modules, product } });
      }
      actions.addRoute({ path: `${context.baseUrl}about-developer`, component: '@site/src/components/ecosystem/AboutDeveloperPage', exact: true, modules });
    },
  };
}
