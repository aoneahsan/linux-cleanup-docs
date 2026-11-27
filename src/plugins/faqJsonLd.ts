/**
 * FAQPage structured data for the FAQ page, in every locale (search audit 2026-11-27, AEO item).
 *
 * The questions and answers are read from the page Docusaurus has just rendered, after the build, so the JSON-LD
 * carries exactly the words a reader sees in that locale: one `Question` per `##` heading, its `acceptedAnswer`
 * the text of everything up to the next heading. The script goes into `<head>` of the static HTML, so crawlers
 * that never run JavaScript still get it. The build fails when the page or its questions are missing, rather than
 * ship a page whose markup and text disagree.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';
import type { LoadContext, Plugin } from '@docusaurus/types';

/** The FAQ page's route, relative to each locale's root. */
const FAQ_ROUTE = 'faq';
/** Below this the page has lost its questions, which is a bug, not a short FAQ. */
const MIN_QUESTIONS = 10;

/** Collapses the whitespace HTML layout adds, so the answer reads as one plain paragraph run. */
function plain(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/** Builds the FAQPage object from one rendered FAQ page. */
export function faqFromHtml(html: string, pageUrl: string, lang: string): object {
  const $ = load(html);
  const body = $('.theme-doc-markdown').first();
  body.find('.hash-link, button, .sr-only').remove();
  const items: { '@type': 'Question'; name: string; acceptedAnswer: { '@type': 'Answer'; text: string } }[] = [];
  body.children('h2').each((_, h) => {
    const name = plain($(h).text());
    const answer = plain(
      $(h)
        .nextUntil('h2')
        .map((__, el) => $(el).text())
        .get()
        .join(' '),
    );
    if (name && answer) items.push({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text: answer } });
  });
  if (items.length < MIN_QUESTIONS) throw new Error(`faqJsonLd: ${pageUrl} has ${items.length} questions`);
  return { '@context': 'https://schema.org', '@type': 'FAQPage', '@id': `${pageUrl}#faq`, url: pageUrl, inLanguage: lang, mainEntity: items };
}

/** The plugin: rewrites `<locale out>/faq/index.html` once per locale build. */
export default function faqJsonLd(context: LoadContext): Plugin {
  return {
    name: 'faq-json-ld',
    postBuild({ outDir }) {
      const { siteConfig, i18n } = context;
      const file = path.join(outDir, FAQ_ROUTE, 'index.html');
      if (!existsSync(file)) throw new Error(`faqJsonLd: no FAQ page at ${file}`);
      const lang = i18n.localeConfigs[i18n.currentLocale]?.htmlLang ?? i18n.currentLocale;
      const prefix = i18n.currentLocale === i18n.defaultLocale ? '' : `/${i18n.currentLocale}`;
      const pageUrl = `${siteConfig.url.replace(/\/$/, '')}${prefix}/${FAQ_ROUTE}/`;
      const html = readFileSync(file, 'utf8');
      if (html.includes('"FAQPage"')) return;
      const json = JSON.stringify(faqFromHtml(html, pageUrl, lang)).replace(/</g, '\\u003c');
      writeFileSync(file, html.replace('</head>', `<script type="application/ld+json">${json}</script></head>`));
    },
  };
}
