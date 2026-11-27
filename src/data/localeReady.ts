/**
 * A locale is built only when it is complete (aoneahsan-cccs-translations: never ship a half-translated locale):
 * every published doc under docs/ and every post under blog/ must exist in that locale's i18n folder. English is the
 * source and always ships. The build prints which locales it left out and why, so a gap is never silent.
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const SKIP = new Set(['MANUAL-TASKS.md', 'PACKAGES.md']);

function files(dir: string, base = dir): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return name === 'story' || name === 'search-consoles' || name.startsWith('_') ? [] : files(full, base);
    return /\.mdx?$/.test(name) && !name.startsWith('_') && !SKIP.has(name) ? [path.relative(base, full)] : [];
  });
}

/** Pages a locale still lacks (empty when complete). */
export function missingPages(siteDir: string, code: string): string[] {
  const docs = files(path.join(siteDir, 'docs'));
  const blog = files(path.join(siteDir, 'blog'));
  const tDocs = path.join(siteDir, 'i18n', code, 'docusaurus-plugin-content-docs', 'current');
  const tBlog = path.join(siteDir, 'i18n', code, 'docusaurus-plugin-content-blog');
  return [...docs.filter((f) => !existsSync(path.join(tDocs, f))).map((f) => `docs/${f}`), ...blog.filter((f) => !existsSync(path.join(tBlog, f))).map((f) => `blog/${f}`)];
}
