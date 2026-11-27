/**
 * The human site map at `/sitemap/` (every docs site ships `/sitemap`, `/sitemap.xml`, `/feed` and `/feed.xml`;
 * aoneahsan-cccs-docusaurus, pattern from rentparty-docs `plugins/site-pages.ts`).
 *
 * `allContentLoaded` reads what the docs and blog plugins loaded in this locale (each page's title and description,
 * the sidebar's order and its translated category labels, the release posts), writes it once as JSON and adds the
 * route, so Docusaurus prerenders every card into the HTML before any script runs.
 */
import type { BlogContent } from '@docusaurus/plugin-content-blog';
import type { LoadedContent as DocsContent } from '@docusaurus/plugin-content-docs';
import type { LoadContext, Plugin } from '@docusaurus/types';
import { aliasedSitePath } from '@docusaurus/utils';

/** One page as its card shows it. */
export interface MapPage {
  readonly permalink: string;
  readonly title: string;
  readonly description: string;
}

/** A sidebar group: the top-level pages together (`label: null`), each top-level category apart. */
export interface MapGroup {
  readonly key: string;
  readonly label: string | null;
  readonly pages: readonly MapPage[];
}

/** What `/sitemap/` draws. */
export interface MapData {
  readonly groups: readonly MapGroup[];
  readonly posts: readonly MapPage[];
}

type Version = DocsContent['loadedVersions'][number];
type Item = Version['sidebars'][string][number];
type Category = Extract<Item, { type: 'category' }>;

/** Reads the sidebar into groups in reading order; a listed doc no sidebar shows joins the top-level group. */
function groupsOf(version: Version): MapGroup[] {
  const byId = new Map(version.docs.filter((d) => !d.unlisted).map((d) => [d.id, d]));
  const seen = new Set<string>();
  const top: MapPage[] = [];
  const groups: MapGroup[] = [{ key: 'top', label: null, pages: top }];
  const addDoc = (id: string, into: MapPage[]): void => {
    const d = byId.get(id);
    if (!d || seen.has(d.permalink)) return;
    seen.add(d.permalink);
    into.push({ permalink: d.permalink, title: d.title, description: d.description });
  };
  const addCategory = (c: Category, into: MapPage[]): void => {
    if (c.link?.type === 'doc') addDoc(c.link.id, into);
    for (const item of c.items) {
      if (item.type === 'doc') addDoc(item.id, into);
      else if (item.type === 'category') addCategory(item, into);
    }
  };
  for (const sidebar of Object.values(version.sidebars)) {
    for (const item of sidebar) {
      if (item.type === 'doc') addDoc(item.id, top);
      else if (item.type === 'category') {
        const pages: MapPage[] = [];
        addCategory(item, pages);
        if (pages[0]) groups.push({ key: pages[0].permalink, label: item.label, pages });
      }
    }
  }
  for (const d of byId.values()) if (!seen.has(d.permalink)) addDoc(d.id, top);
  return groups.filter((g) => g.pages.length > 0);
}

export default function sitemapPage(context: LoadContext): Plugin {
  return {
    name: 'sitemap-page',
    async allContentLoaded({ allContent, actions }) {
      const docs = allContent['docusaurus-plugin-content-docs']?.default as DocsContent | undefined;
      const blog = allContent['docusaurus-plugin-content-blog']?.default as BlogContent | undefined;
      const version = docs?.loadedVersions[0];
      if (!version || !blog) throw new Error('sitemapPage: the docs and blog plugins must both be on');
      const data: MapData = {
        groups: groupsOf(version),
        posts: blog.blogPosts.map((p) => ({ permalink: p.metadata.permalink, title: p.metadata.title, description: p.metadata.description })),
      };
      // `@generated/…`, never the absolute path: an absolute path would ship this machine's folders in the bundle.
      const file = aliasedSitePath(await actions.createData('sitemap-page.json', JSON.stringify(data)), context.siteDir);
      actions.addRoute({ path: `${context.baseUrl}sitemap`, component: '@site/src/components/SitemapPage', modules: { data: file }, exact: true });
    },
  };
}
