import { useMemo, useState, type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import type { MapData, MapPage } from '@site/src/plugins/sitemapPage';
import styles from './styles.module.css';

/** Lower case, accents and Arabic diacritics dropped, so a search matches what a reader types. */
function fold(s: string): string {
  return s.toLocaleLowerCase().normalize('NFKD').replace(/[̀-ًͯ-ٟ]/g, '');
}

/** Whether two words are at most one edit apart (one letter added, dropped or changed). */
function near(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

/** Every query word appears in the page, or is one typo away from one of its words (words of 4+ letters). */
function matches(page: MapPage, query: string): boolean {
  const text = fold(`${page.title} ${page.description}`);
  const words = text.split(/[^\p{L}\p{N}-]+/u).filter(Boolean);
  return fold(query).split(/\s+/).filter(Boolean).every((q) => text.includes(q) || (q.length >= 4 && words.some((w) => near(w, q))));
}

function Cards({ pages }: { readonly pages: readonly MapPage[] }): ReactNode {
  return (
    <ul className={styles.grid}>
      {pages.map((p) => (
        <li key={p.permalink} className={styles.card}>
          <Link to={p.permalink} className={styles.title}>{p.title}</Link>
          {p.description ? <p>{p.description}</p> : null}
        </li>
      ))}
    </ul>
  );
}

/** `/sitemap/`: every page of the manual and every release note, in this locale, with a search. */
export default function SitemapPage({ data }: { readonly data: MapData }): ReactNode {
  const [query, setQuery] = useState('');
  const title = translate({ id: 'sitemap.title', message: 'Site map' });
  const description = translate({ id: 'sitemap.description', message: 'Every page of the linux-cleanup manual and every release note, on one page.' });
  const groups = useMemo(
    () => data.groups.map((g) => ({ ...g, pages: query ? g.pages.filter((p) => matches(p, query)) : g.pages })).filter((g) => g.pages.length),
    [data, query],
  );
  const posts = useMemo(() => (query ? data.posts.filter((p) => matches(p, query)) : data.posts), [data, query]);
  return (
    <Layout title={title} description={description}>
      <main className="container margin-vert--xl">
        <Heading as="h1">{title}</Heading>
        <p className={styles.lead}>{description}</p>
        <label className={styles.search}>
          <span>{translate({ id: 'sitemap.searchLabel', message: 'Find a page' })}</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={translate({ id: 'sitemap.searchHint', message: 'dry run, node_modules, flags…' })} />
        </label>
        {groups.length === 0 && posts.length === 0 ? (
          <p role="status">{translate({ id: 'sitemap.none', message: 'No page matches that. Try a shorter word.' })}</p>
        ) : null}
        {groups.map((g) => (
          <section key={g.key} className={styles.group}>
            <Heading as="h2">{g.label ?? translate({ id: 'sitemap.start', message: 'Start here' })}</Heading>
            <Cards pages={g.pages} />
          </section>
        ))}
        {posts.length ? (
          <section className={styles.group}>
            <Heading as="h2">{translate({ id: 'sitemap.releases', message: 'Release notes' })}</Heading>
            <Cards pages={posts} />
          </section>
        ) : null}
      </main>
    </Layout>
  );
}
