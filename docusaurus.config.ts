import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

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
// Deployment: GitHub Pages ONLY (.github/workflows/deploy-pages.yml).
// This repo is PUBLIC and contains no Firebase config and no secrets.
// ---------------------------------------------------------------------------

const SITE_URL = 'https://linux-cleanup-docs.aoneahsan.com';
const TOOL_VERSION = '1.4.0';

// Analytics are env-gated: an absent key means the provider is skipped
// entirely, so a clone with no secrets still builds. Never inline a real key.
const gaMeasurementId = process.env.GA_MEASUREMENT_ID?.trim();

const config: Config = {
  title: 'linux-cleanup',
  tagline:
    'Safe, modular disk and cache cleanup for Linux — allowlist-guarded, interactive by default, and it never phones home.',
  favicon: 'img/favicon.svg',

  url: SITE_URL,
  baseUrl: '/',

  organizationName: 'aoneahsan',
  projectName: 'linux-cleanup-docs',

  // The build IS the link checker. Anything broken fails CI rather than
  // shipping a dead link to a page about deleting files.
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',

  // SEO + AI-citability head tags. The JSON-LD payloads let Google Rich
  // Results, Perplexity, ChatGPT and Claude extract structured entity data
  // when citing this documentation.
  headTags: [
    {
      tagName: 'link',
      attributes: { rel: 'canonical', href: `${SITE_URL}/` },
    },
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
      attributes: { name: 'theme-color', content: '#0f766e' },
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'linux-cleanup Documentation',
        url: SITE_URL,
        description:
          'Documentation for linux-cleanup, a Bash command-line utility that reclaims disk space on Linux by deleting regenerable package-manager, browser and build caches behind allowlist, staleness and confirmation guards. Author: Ahsan Mahmood.',
        inLanguage: 'en',
        publisher: {
          '@type': 'Person',
          name: 'Ahsan Mahmood',
          url: 'https://aoneahsan.com',
          email: 'aoneahsan@gmail.com',
          sameAs: [
            'https://linkedin.com/in/aoneahsan',
            'https://github.com/aoneahsan',
            'https://www.npmjs.com/~aoneahsan',
          ],
        },
        license: 'https://opensource.org/licenses/MIT',
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: 'linux-cleanup',
        codeRepository: 'https://github.com/aoneahsan/linux-cleanup',
        programmingLanguage: 'Shell',
        runtimePlatform: 'Bash 4+ on Linux',
        license: 'https://opensource.org/licenses/MIT',
        author: {
          '@type': 'Person',
          name: 'Ahsan Mahmood',
          url: 'https://aoneahsan.com',
        },
        description:
          'Modular Bash cleanup utility for Linux. Prunes yarn/npm/pnpm/pip/composer caches, browser and Gradle caches, Cypress and Playwright binaries, Android emulator images, stale node_modules, partial downloads, and system journals — each behind a path allowlist, a staleness gate, and an interactive confirmation.',
        keywords:
          'linux, cleanup, disk-cleanup, cache-cleanup, disk-space, yarn-cache, npm-cache, node-modules, gradle, cypress, playwright, bash, cli',
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'linux-cleanup',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Linux (bash 4+)',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        url: 'https://www.npmjs.com/package/linux-cleanup',
        author: {
          '@type': 'Person',
          name: 'Ahsan Mahmood',
          url: 'https://aoneahsan.com',
        },
        description:
          'Command-line disk and cache cleanup for Linux developers, with a guided walkthrough, read-only scan mode, JSON session reports, and a safety model built on path allowlists and staleness gates.',
        softwareVersion: TOOL_VERSION,
        license: 'https://opensource.org/licenses/MIT',
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Ahsan Mahmood',
        alternateName: 'aoneahsan',
        url: 'https://aoneahsan.com',
        email: 'aoneahsan@gmail.com',
        sameAs: [
          'https://linkedin.com/in/aoneahsan',
          'https://github.com/aoneahsan',
          'https://www.npmjs.com/~aoneahsan',
        ],
        founder: { '@type': 'Person', name: 'Ahsan Mahmood' },
      }),
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  trailingSlash: false,

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
      // leak from a public repo.
      require.resolve('@easyops-cn/docusaurus-search-local'),
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
          ],
          routeBasePath: '/',
          editUrl: 'https://github.com/aoneahsan/linux-cleanup-docs/edit/main/',
          showLastUpdateTime: true,
          breadcrumbs: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.7,
          lastmod: 'date',
        },
        ...(gaMeasurementId ? { gtag: { trackingID: gaMeasurementId, anonymizeIP: true } } : {}),
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.svg',
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
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', content: '@aoneahsan' },
      { name: 'twitter:site', content: '@aoneahsan' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'linux-cleanup Docs' },
      { property: 'og:locale', content: 'en_US' },
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
          href: 'https://github.com/aoneahsan/linux-cleanup',
          label: 'GitHub',
          position: 'right',
        },
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
          title: 'Built by Ahsan Mahmood',
          items: [
            { label: 'aoneahsan.com', href: 'https://aoneahsan.com' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/aoneahsan' },
            { label: 'GitHub', href: 'https://github.com/aoneahsan' },
            { label: 'npm packages', href: 'https://www.npmjs.com/~aoneahsan' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ahsan Mahmood. Built with Docusaurus. linux-cleanup is MIT-licensed and provided without warranty — it deletes files.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'diff'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
