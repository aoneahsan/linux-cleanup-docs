import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config, LoadContext, Plugin } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { OTHER_PLATFORMS } from './src/data/platforms';
import rehypeLinkLaw from './src/data/linkLaw';
import OWNER from './src/data/owner-profile.json';
import { LOCALES } from './src/data/locales';
import ecosystemPages from './src/plugins/ecosystem';
import { robotsSitemaps, withAlternates } from './src/plugins/sitemapAlternates';
import { missingPages } from './src/data/localeReady';
import faqJsonLd from './src/plugins/faqJsonLd';
import REMOVED_PATHS from './src/data/seo-removed-paths.json';

// ---------------------------------------------------------------------------
// linux-cleanup — Documentation site config
// Author: Ahsan Mahmood (https://aoneahsan.com)
// Source package: https://github.com/aoneahsan/linux-cleanup
//                 (npm: https://www.npmjs.com/package/linux-cleanup)
//
// Domain derivation (see ~/.claude/rules/docs-sites.md): linux-cleanup is an
// npm package with no separate marketing site, so its docs domain is
// <npm-package-name>-docs.aoneahsan.com. Pinned in static/CNAME.
//
// Deployment: locally built output is pushed to the GitHub Pages branch by hand.
// This repo is PUBLIC and contains no Firebase config and no secrets.
// ---------------------------------------------------------------------------

const SITE_URL = 'https://linux-cleanup-docs.aoneahsan.com';
/** The published CLI version, read from npm at build time; the build stops rather than print a guessed one. */
const CLI_VERSION = execFileSync('npm', ['view', 'linux-cleanup', 'version'], { encoding: 'utf8' }).trim();
if (!/^\d+\.\d+\.\d+$/.test(CLI_VERSION)) throw new Error(`npm answered "${CLI_VERSION}" for the linux-cleanup version`);

// Build values come from a local, git-ignored `.env` (see `.env.example`); a clone with none still builds. Analytics
// and the release gate are skipped when their keys are absent. Never inline a real key: this repository is public.
try {
  process.loadEnvFile('.env');
} catch {
  // no .env: every optional provider is skipped
}
const gaMeasurementId = process.env.GA_MEASUREMENT_ID?.trim();
const DOCS_VERSION = (require('./package.json') as { version: string }).version;

/**
 * Docusaurus ships this config and every route module path to the browser, so a require.resolve() entry or any
 * other absolute path would publish this machine's folders in main.js. This plugin fails the build when one appears.
 */
function noLocalPaths({ siteDir }: LoadContext): Plugin {
  return {
    name: 'no-local-paths',
    postBuild({ outDir }) {
      const jsDir = path.join(outDir, 'assets', 'js');
      const forms = [siteDir.split(path.sep).join('/'), siteDir.split(path.sep).join('\\\\')];
      for (const file of readdirSync(jsDir).filter((name) => name.endsWith('.js'))) {
        const text = readFileSync(path.join(jsDir, file), 'utf8');
        const found = forms.find((form) => text.includes(form));
        if (found) throw new Error(`${file} carries the local path ${found}: name plugins by package and client modules by relative path`);
      }
    },
  };
}

/** The locales that ship: English, plus every locale whose pages are all translated. */
const READY = LOCALES.filter((l) => {
  if (l.code === 'en-GB') return true;
  const missing = missingPages(__dirname, l.code);
  if (missing.length) process.stdout.write(`i18n: ${l.code} not built yet, ${missing.length} page(s) untranslated (first: ${missing[0]})\n`);
  return missing.length === 0;
});

const config: Config = {
  // Update flow layer 2 and the legal notice (src/clientModules/siteChrome.ts) read these at runtime.
  customFields: {
    docsVersion: DOCS_VERSION,
    releaseUrl: process.env.SUPABASE_URL?.trim() ?? '',
    releaseKey: process.env.SUPABASE_PUBLISHABLE_KEY?.trim() ?? '',
    releaseChannel: process.env.RELEASE_CHANNEL?.trim() === 'test' ? 'test' : 'production',
  },
  // Relative to the site folder, never require.resolve(): a resolved path would ship this machine's folders.
  clientModules: ['./src/clientModules/siteChrome.ts', './src/clientModules/scriptFont.ts'],
  plugins: [
    noLocalPaths,
    ecosystemPages,
    robotsSitemaps(READY.map((l) => l.code)),
    faqJsonLd,
    // Tag pages are switched off (owner, 2026-11-27: thin lists Google crawled and left out). Each old tag URL, in
    // every locale, redirects to the page that carried the tag; GitHub Pages cannot send a 301, so the plugin writes
    // a canonical + meta-refresh page, which search engines treat as a permanent redirect.
    ['@docusaurus/plugin-client-redirects', { redirects: REMOVED_PATHS }],
  ],
  title: 'linux-cleanup',
  tagline:
    'Preview Linux cleanup paths before permanent removal.',
  favicon: 'img/favicon.svg',

  url: SITE_URL,
  baseUrl: '/',

  organizationName: 'aoneahsan',
  projectName: 'linux-cleanup-docs',

  // The local build checks links and anchors before the manual Pages deploy.
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',

  // SEO + AI-citability head tags. The JSON-LD payloads let Google Rich
  // Results, Perplexity, ChatGPT and Claude extract structured entity data
  // when citing this documentation.
  headTags: [
    {
      tagName: 'meta',
      attributes: { name: 'application-name', content: 'linux-cleanup Docs' },
    },
    {
      tagName: 'meta',
      attributes: { name: 'apple-mobile-web-app-title', content: 'linux-cleanup' },
    },
    {
      tagName: 'meta',
      attributes: { name: 'theme-color', content: '#13120d' },
    },
    { tagName: 'meta', attributes: { name: 'author', content: `${OWNER.person.name} (aoneahsan)` } },
    { tagName: 'meta', attributes: { name: 'keywords', content: `linux cleanup, linux cache cleaner, disk space, dry run, ${OWNER.keywords}` } },
    // The owner and Zaions as one entity on every surface (aoneahsan-cccs-seo-aeo-standard): the same @id values the
    // website uses, so search engines join the two sites to one Person and one Organization.
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Person',
            '@id': 'https://aoneahsan.com/#person',
            name: OWNER.person.name,
            alternateName: OWNER.person.alternateName,
            url: OWNER.person.url,
            sameAs: OWNER.person.sameAs,
            jobTitle: OWNER.person.jobTitle,
            worksFor: { '@id': 'https://zaions.com/#organization' },
          },
          {
            '@type': 'Organization',
            '@id': 'https://zaions.com/#organization',
            name: OWNER.organization.name,
            alternateName: OWNER.organization.alternateName,
            url: OWNER.organization.url,
            founder: { '@id': 'https://aoneahsan.com/#person' },
            sameAs: OWNER.organization.sameAs,
          },
          {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            name: 'linux-cleanup Documentation',
            url: `${SITE_URL}/`,
            inLanguage: LOCALES.map((l) => l.htmlLang),
            creator: { '@id': 'https://aoneahsan.com/#person' },
            publisher: { '@id': 'https://zaions.com/#organization' },
          },
          {
            '@type': 'SoftwareApplication',
            name: 'linux-cleanup',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Linux',
            softwareVersion: CLI_VERSION,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            url: 'https://linux-cleanup.aoneahsan.com/',
            downloadUrl: 'https://www.npmjs.com/package/linux-cleanup',
            license: 'https://opensource.org/license/mit',
            creator: { '@id': 'https://aoneahsan.com/#person' },
            author: { '@id': 'https://aoneahsan.com/#person' },
            publisher: { '@id': 'https://zaions.com/#organization' },
          },
          {
            '@type': 'SoftwareSourceCode',
            name: 'linux-cleanup',
            codeRepository: 'https://github.com/aoneahsan/linux-cleanup',
            programmingLanguage: 'Shell',
            runtimePlatform: 'Bash 4+ on Linux',
            license: 'https://opensource.org/license/mit',
            author: { '@id': 'https://aoneahsan.com/#person' },
          },
        ],
      }),
    },
  ],

  // Ten locales; English stays at the root. Each locale is built only when every page of it is translated
  // (the build fails on a missing page, see src/plugins/localeComplete.ts).
  i18n: {
    defaultLocale: 'en-GB',
    locales: READY.map((l) => l.code),
    localeConfigs: Object.fromEntries(READY.map((l) => [l.code, { label: l.label, direction: l.direction, htmlLang: l.htmlLang }])),
  },

  // GitHub Pages serves every route as `<route>/index.html` and 301s the slashless URL, so the slashed form is
  // the one canonical, sitemap and link use (owner, 2026-11-27).
  trailingSlash: true,
  // The banner script embeds an unfollowable third-party link in every page; the site has one fixed baseUrl.
  baseUrlIssueBanner: false,

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      // Offline/local search — no third-party service, no API key, nothing to
      // leak from a public repo. Named by package, never require.resolve().
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // `docs/` is BOTH the published content dir and the home of the
          // fixed-path internal file docs/MANUAL-TASKS.md. Keep the path (the
          // global rule fixes it) but never publish it — this repo is public.
          // NOTE: `exclude` REPLACES the plugin defaults, so they are restated.
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
            'MANUAL-TASKS.md',
            // Internal record of search-console fixes (docs/search-consoles/fix-log.md), never a public page.
            'search-consoles/**',
            'PACKAGES.md',
            'story/**',
          ],
          routeBasePath: '/',
          editUrl: 'https://github.com/aoneahsan/linux-cleanup-docs/edit/main/',
          showLastUpdateTime: true,
          breadcrumbs: true,
          rehypePlugins: [rehypeLinkLaw],
        },
        // Release notes: the docs site's /feed page and its RSS (copied to /feed.xml by the plugin below).
        blog: {
          routeBasePath: 'feed',
          path: 'blog',
          blogTitle: 'Release notes',
          rehypePlugins: [rehypeLinkLaw],
          blogDescription: 'Every linux-cleanup release, command line and desktop app, newest first.',
          blogSidebarTitle: 'Releases',
          blogSidebarCount: 'ALL',
          postsPerPage: 'ALL',
          showReadingTime: false,
          authorsMapPath: undefined,
          onInlineAuthors: 'ignore',
          onUntruncatedBlogPosts: 'ignore',
          feedOptions: {
            type: 'rss',
            title: 'linux-cleanup release notes',
            description: 'Every linux-cleanup release, command line and desktop app.',
            copyright: `© ${new Date().getFullYear()} Ahsan Mahmood`,
            language: 'en-GB',
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: 'date',
          createSitemapItems: withAlternates(
            READY.map((l) => l.code),
            (code) => LOCALES.find((l) => l.code === code)?.htmlLang ?? code,
          ),
        },
        ...(gaMeasurementId ? { gtag: { trackingID: gaMeasurementId, anonymizeIP: true } } : {}),
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    metadata: [
      {
        name: 'description',
        content:
          'Documentation for linux-cleanup — a Bash CLI that reclaims disk space on Linux by pruning regenerable caches (yarn, npm, pnpm, browsers, Gradle, Cypress, Playwright, Android AVDs, stale node_modules) behind allowlist and staleness guards. By Ahsan Mahmood.',
      },
      {
        name: 'keywords',
        content:
          'linux cleanup, free disk space linux, clear yarn cache, clear npm cache, delete node_modules, gradle cache cleanup, linux disk full, ubuntu clean disk space, bash cleanup script, safe disk cleanup, linux cache cleaner cli',
      },
      { name: 'author', content: 'Ahsan Mahmood' },
      // Yandex Webmaster ownership (search audit 2026-11-26, linux-cleanup-docs#1).
      { name: 'yandex-verification', content: 'bfb02722189028cf' },
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', content: '@aoneahsan' },
      { name: 'twitter:site', content: '@aoneahsan' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'linux-cleanup Docs' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'article:author', content: 'Ahsan Mahmood' },
    ],
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'linux-cleanup',
      logo: {
        alt: 'linux-cleanup logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Docs',
        },
        { to: '/safety/what-it-deletes', label: 'What it deletes', position: 'left' },
        { to: '/getting-started/quick-start', label: 'Quick start', position: 'left' },
        { to: '/reference/cli-flags', label: 'CLI', position: 'left' },
        { to: '/changelog', label: 'Changelog', position: 'right' },
        {
          type: 'dropdown',
          label: 'Get linux-cleanup',
          position: 'right',
          items: [
            ...OTHER_PLATFORMS.map((platform) => ({ label: platform.name, href: platform.href })),
            { label: 'All places', to: '/apps' },
          ],
        },
        {
          href: 'https://github.com/aoneahsan/linux-cleanup',
          label: 'GitHub',
          position: 'right',
        },
        { type: 'localeDropdown', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Start here',
          items: [
            { label: 'Introduction', to: '/' },
            { label: 'What it deletes', to: '/safety/what-it-deletes' },
            { label: 'Preview before deleting', to: '/safety/preview-first' },
            { label: 'Installation', to: '/getting-started/installation' },
          ],
        },
        {
          title: 'Reference',
          items: [
            { label: 'CLI flags', to: '/reference/cli-flags' },
            { label: 'Protected paths', to: '/reference/protected-paths' },
            { label: 'Report schema', to: '/reference/report-schema' },
            { label: 'Changelog', to: '/changelog' },
            { label: 'Release notes', to: '/feed' },
          ],
        },
        {
          title: 'Project',
          items: [
            { label: 'Source (GitHub)', href: 'https://github.com/aoneahsan/linux-cleanup' },
            { label: 'npm package', href: 'https://www.npmjs.com/package/linux-cleanup' },
            { label: 'Report an issue', href: 'https://github.com/aoneahsan/linux-cleanup/issues' },
          ],
        },
        {
          title: 'Get linux-cleanup',
          items: [
            ...OTHER_PLATFORMS.map((platform) => ({ label: platform.name, href: platform.href })),
            { label: 'All places', to: '/apps' },
          ],
        },
        {
          title: 'Built by Ahsan Mahmood',
          items: [
            { label: 'About the developer', to: '/about-developer' },
            { label: 'More from Zaions', to: '/ecosystem' },
            { label: 'aoneahsan.com', href: 'https://aoneahsan.com' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/aoneahsan' },
            { label: 'GitHub', href: 'https://github.com/aoneahsan' },
            { label: 'npm packages', href: 'https://www.npmjs.com/~aoneahsan' },
          ],
        },
      ],
      copyright: `linux-cleanup — developed with love by the Zaions team · © ${new Date().getFullYear()} linux-cleanup · MIT-licensed and provided without warranty: it deletes files.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'diff'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
