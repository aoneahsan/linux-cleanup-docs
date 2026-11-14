import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Sidebar order is deliberate and mirrors how someone should approach a
 * destructive tool: understand what it removes, learn to preview it, only then
 * install and run it. Reference material and recovery come after.
 *
 * Categories are updated in the SAME change that adds a page — a page that is
 * not in the sidebar is effectively unreachable.
 */
const sidebars: SidebarsConfig = {
  mainSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Before you delete anything',
      collapsed: false,
      items: [
        'safety/what-it-deletes',
        'safety/preview-first',
        'safety/guards',
        'safety/irreversibility',
      ],
    },
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: [
        'getting-started/requirements',
        'getting-started/installation',
        'getting-started/quick-start',
      ],
    },
    {
      type: 'category',
      label: 'Desktop app',
      collapsed: true,
      items: [
        'desktop/overview',
        'desktop/install',
        'desktop/schedules',
        'desktop/accounts-and-plans',
      ],
    },
    {
      type: 'category',
      label: 'Modes',
      collapsed: true,
      items: [
        'modes/overview',
        'modes/walkthrough',
        'modes/scan',
        'modes/menu',
        'modes/tui',
        'modes/all-safe',
        'modes/system-cleanup',
        'modes/node-modules-finder',
        'modes/personal-stale-files',
        'modes/partial-downloads',
        'modes/editor-extensions',
        'modes/globals-audit',
        'modes/home-audit',
        'modes/doctor',
        'modes/speed',
        'modes/reports',
      ],
    },
    {
      type: 'category',
      label: 'Compare',
      collapsed: true,
      items: [
        'compare/index',
        'compare/bleachbit',
        'compare/stacer',
        'compare/sweeper',
        'compare/cross-cleaner',
        'compare/cleanmate',
        'compare/tuxcleaner',
        'compare/ubuntu-cleaner',
        'compare/disk-cleaner',
        'compare/czkawka',
        'compare/safe-disk-cleaner',
      ],
    },
    'white-label',
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        'reference/cli-flags',
        'reference/modes-matrix',
        'reference/protected-paths',
        'reference/environment-variables',
        'reference/output-paths',
        'reference/exit-codes',
        'reference/report-schema',
        'reference/json-events',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: true,
      items: [
        'guides/reclaim-the-most-space',
        'guides/alias-and-cron',
        'guides/send-a-bug-report',
        'guides/uninstall',
      ],
    },
    'distro-support',
    'recovery',
    'troubleshooting',
    'faq',
    'changelog',
    'about',
  ],
};

export default sidebars;
