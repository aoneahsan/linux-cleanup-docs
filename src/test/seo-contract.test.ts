/**
 * Build-output SEO contract (search audit 2026-11-27, linux-cleanup-docs#1). Runs over `build/` after `yarn build`,
 * so it checks what GitHub Pages will serve, in every locale:
 *
 * - no public page is `noindex`; each has one title, one description and one self-canonical in the slashed form;
 * - every sitemap URL is a canonical page that exists in the output, and every canonical page is in a sitemap;
 * - every JSON-LD block parses, and the FAQ page carries FAQPage data;
 * - every removed path (the old tag pages) is a redirect page in every locale;
 * - the config keeps `trailingSlash: true` and throws on broken links.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import REMOVED from '../data/seo-removed-paths.json';

const ROOT = path.resolve(__dirname, '../..');
const BUILD = path.join(ROOT, 'build');
const ORIGIN = 'https://linux-cleanup-docs.aoneahsan.com';
/** Pages that are not content: the 404 page and the local search results page. */
const NOT_CONTENT = new Set(['404.html', 'search/index.html']);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : name.endsWith('.html') ? [full] : [];
  });
}

const LOCALES = readdirSync(BUILD).filter((d) => existsSync(path.join(BUILD, d, 'sitemap.xml')));
const html = walk(BUILD).map((file) => ({ rel: path.relative(BUILD, file), text: readFileSync(file, 'utf8') }));
const isRedirect = (text: string): boolean => /http-equiv="refresh"/i.test(text);
const pages = html.filter((p) => !isRedirect(p.text) && !NOT_CONTENT.has(p.rel.replace(/^[a-zA-Z-]+\/(?=(404\.html|search\/))/, '')));

/** The URL a built file is served at, in the slashed form. */
function urlOf(rel: string): string {
  return `${ORIGIN}/${rel.replace(/index\.html$/, '').replace(/\.html$/, '/')}`;
}

describe('docs build output', () => {
  it('is a full build', () => {
    expect(pages.length).toBeGreaterThan(200);
  });

  it('keeps every public page indexable, with one title, description and self-canonical', () => {
    const bad: string[] = [];
    for (const p of pages) {
      const robots = p.text.match(/<meta[^>]+name="robots"[^>]*>/gi) ?? [];
      const canon = [...p.text.matchAll(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/gi)].map((m) => m[1]);
      const titles = p.text.match(/<title[^>]*>/gi) ?? [];
      const descs = p.text.match(/<meta[^>]+name="description"[^>]*>/gi) ?? [];
      if (robots.some((r) => /noindex/i.test(r))) bad.push(`${p.rel}: noindex`);
      if (titles.length !== 1) bad.push(`${p.rel}: ${titles.length} titles`);
      if (descs.length !== 1) bad.push(`${p.rel}: ${descs.length} descriptions`);
      if (canon.length !== 1 || canon[0] !== urlOf(p.rel)) bad.push(`${p.rel}: canonical ${canon.join(' ')}`);
    }
    expect(bad).toEqual([]);
  });

  it('lists exactly the canonical pages in the sitemaps', () => {
    const listed = new Set(
      ['', ...LOCALES.filter((l) => l !== 'sitemap.xml')].flatMap((l) => {
        const file = path.join(BUILD, l, 'sitemap.xml');
        return existsSync(file) ? [...readFileSync(file, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] ?? '') : [];
      }),
    );
    const canonical = new Set(pages.map((p) => urlOf(p.rel)));
    expect([...listed].filter((u) => !canonical.has(u))).toEqual([]);
    expect([...canonical].filter((u) => !listed.has(u))).toEqual([]);
  });

  it('ships JSON-LD that parses, and FAQPage data on every FAQ page', () => {
    const broken: string[] = [];
    for (const p of pages) {
      for (const m of p.text.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
        try {
          JSON.parse(m[1] ?? '');
        } catch {
          broken.push(p.rel);
        }
      }
      if (/SearchAction/.test(p.text)) broken.push(`${p.rel}: SearchAction with no search route contract`);
    }
    expect(broken).toEqual([]);
    const faqs = pages.filter((p) => /(^|\/)faq\/index\.html$/.test(p.rel));
    expect(faqs.length).toBeGreaterThanOrEqual(10);
    for (const f of faqs) expect(f.text, f.rel).toContain('"FAQPage"');
  });

  it('redirects every removed path in every locale', () => {
    const prefixes = ['', ...LOCALES.map((l) => `${l}/`)];
    const missing: string[] = [];
    for (const { from, to } of REMOVED) {
      for (const prefix of prefixes) {
        const file = path.join(BUILD, prefix, from.replace(/^\//, ''), 'index.html');
        if (!existsSync(file) || !readFileSync(file, 'utf8').includes(`/${prefix}${to.replace(/^\//, '')}`)) missing.push(`/${prefix}${from.replace(/^\//, '')}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('keeps the slashed URL form and the link checker in the config', () => {
    const config = readFileSync(path.join(ROOT, 'docusaurus.config.ts'), 'utf8');
    expect(config).toMatch(/^\s*trailingSlash: true,/m);
    expect(config).toMatch(/onBrokenLinks: 'throw'/);
  });
});
