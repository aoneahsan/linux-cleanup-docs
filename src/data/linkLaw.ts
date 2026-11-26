/**
 * The fleet link law for every Markdown link on this site (rules/seo-aeo-ranking.md): our own products, profiles and
 * listings stay followed; every other external link gets `rel="nofollow noopener"`. Applied at build time as a rehype
 * step, so a new page can never ship a followed third-party link.
 */

/** Hosts and path prefixes we own (ecosystem/owner-profile.json `ownedHosts`). */
const OWNED: readonly RegExp[] = [
  /^(?:[a-z0-9-]+\.)*aoneahsan\.com$/,
  /^(?:[a-z0-9-]+\.)*zaions\.com$/,
  /^(?:www\.)?trizlink\.com$/,
];
const OWNED_PREFIXES: readonly string[] = [
  'github.com/aoneahsan',
  'www.linkedin.com/in/aoneahsan',
  'linkedin.com/in/aoneahsan',
  'www.npmjs.com/~aoneahsan',
  'www.npmjs.com/package/linux-cleanup',
  'play.google.com/store/apps/details?id=com.aoneahsan.',
];

/** True when `href` points at a site we own. Relative and non-http links are internal. */
export function isOwnedLink(href: string): boolean {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return true;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return true;
  const host = url.hostname.toLowerCase();
  if (OWNED.some((re) => re.test(host))) return true;
  const hostPath = `${host}${url.pathname}${url.search}`;
  return OWNED_PREFIXES.some((p) => hostPath.startsWith(p));
}

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

function walk(node: HastNode): void {
  if (node.type === 'element' && node.tagName === 'a') {
    const href = node.properties?.['href'];
    if (typeof href === 'string' && !isOwnedLink(href)) {
      node.properties = { ...node.properties, rel: ['nofollow', 'noopener'] };
    }
  }
  node.children?.forEach(walk);
}

/** Rehype plugin: adds `nofollow noopener` to every external link outside the owned list. */
export default function rehypeLinkLaw(): (tree: HastNode) => void {
  return (tree) => walk(tree);
}
