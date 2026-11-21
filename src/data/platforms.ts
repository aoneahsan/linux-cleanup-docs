/**
 * Every place linux-cleanup is released — the ONLY place a store or surface URL lives in this docs site
 * (standard aoneahsan-cccs-platform-links). Each surface passed its release proof on `verified`:
 * `npm view linux-cleanup` answers 2.0.1, the website and this site answered 200. The desktop app joins
 * this list the day its first build is published.
 */
export type PlatformId = 'npm' | 'web' | 'docs';

export interface Platform {
  id: PlatformId;
  /** Store or surface name (a proper name, not copy). */
  name: string;
  href: string;
  /** What this surface is for, in linux-cleanup's words. */
  title: string;
  text: string;
  cta: string;
  primary?: boolean;
  verified: string;
}

export const PLATFORMS: readonly Platform[] = [
  {id: 'npm', name: 'npm', href: 'https://www.npmjs.com/package/linux-cleanup', title: 'npx linux-cleanup', text: 'The cleaner itself: run it once with npx, or install it and let the alias and the weekly cron use it. Preview everything with --dry-run first.', cta: 'View on npm', primary: true, verified: '2026-11-21'},
  {id: 'web', name: 'linux-cleanup website', href: 'https://linux-cleanup.aoneahsan.com', title: 'The website', text: 'What it cleans on Ubuntu, Fedora and Arch, what it never touches, and how the update notices work.', cta: 'Open the website', verified: '2026-11-21'},
  {id: 'docs', name: 'Documentation', href: 'https://linux-cleanup-docs.aoneahsan.com', title: 'These docs', text: 'Every section it can clean, the protected paths, the flags and the report format.', cta: 'Read the docs', verified: '2026-11-21'},
];

export const APPS_PAGE = {
  title: 'Get linux-cleanup',
  description: 'Every place linux-cleanup is released: the npm package, the website and these docs.',
  lead: 'One command on npm, the website that explains it, and these docs a tab away.',
} as const;

/** This site is the docs surface. */
export const CURRENT_SURFACE: PlatformId = 'docs';
export const OTHER_PLATFORMS: readonly Platform[] = PLATFORMS.filter((platform) => platform.id !== CURRENT_SURFACE);
