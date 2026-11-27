/**
 * Locale alternates for search engines (aoneahsan-cccs-seo-aeo-standard, contract line 5). Docusaurus writes one
 * sitemap per locale with no hreflang alternates, and robots.txt names only the English one.
 *
 * - `withAlternates` is the preset's `sitemap.createSitemapItems`: each item gets a `links` entry per shipped locale
 *   plus `x-default` (English), which the `sitemap` library writes as `xhtml:link` alternates.
 * - `robotsSitemaps` is a plugin: the English build lists every locale sitemap in robots.txt.
 *
 * Every locale ships the same routes (the build refuses an incomplete locale, src/data/localeReady.ts), so an
 * alternate is the same path under the other locale's prefix.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { LoadContext, Plugin } from '@docusaurus/types';
import type { PluginOptions } from '@docusaurus/plugin-sitemap';

type CreateItems = NonNullable<PluginOptions['createSitemapItems']>;

/** `ready`: shipped locale codes, the default (root URL) first. `lang`: a code's hreflang value. */
export function withAlternates(ready: readonly string[], lang: (code: string) => string): CreateItems {
  const [root, ...others] = ready;
  return async (params) => {
    const items = await params.defaultCreateSitemapItems(params);
    return items.map((item) => {
      const url = new URL(item.url);
      const first = url.pathname.split('/')[1] ?? '';
      const rest = others.includes(first) ? url.pathname.slice(first.length + 1) || '/' : url.pathname;
      const at = (code: string): string =>
        url.origin + (code === root ? rest : rest === '/' ? `/${code}/` : `/${code}${rest}`);
      const links = ready.map((code) => ({ lang: lang(code), url: at(code) }));
      links.push({ lang: 'x-default', url: at(root) });
      return { ...item, links };
    });
  };
}

/** Lists every non-default locale's sitemap in the root robots.txt, after the English build. */
export function robotsSitemaps(ready: readonly string[]) {
  return function plugin(context: LoadContext): Plugin {
    return {
      name: 'robots-sitemaps',
      postBuild({ outDir }) {
        const { siteConfig, i18n } = context;
        if (i18n.currentLocale !== i18n.defaultLocale) return;
        const robots = path.join(outDir, 'robots.txt');
        if (!existsSync(robots)) return;
        const origin = siteConfig.url.replace(/\/$/, '');
        const text = readFileSync(robots, 'utf8').trimEnd();
        const lines = ready
          .filter((c) => c !== i18n.defaultLocale)
          .map((c) => `Sitemap: ${origin}/${c}/sitemap.xml`)
          .filter((l) => !text.includes(l));
        if (lines.length) writeFileSync(robots, `${text}\n${lines.join('\n')}\n`);
      },
    };
  };
}
