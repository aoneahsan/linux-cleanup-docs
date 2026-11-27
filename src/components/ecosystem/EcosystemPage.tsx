import React, { useEffect, useState } from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { EcosystemCard } from './EcosystemShowcase';
import { pluralOf, useBand, useLocaleRow } from './shared';

type View = 'grid' | 'list' | 'table';
const VIEWS: View[] = ['grid', 'list', 'table'];

interface Copy { ecosystem: { page: Record<string, string>; view: Record<string, string>; table: Record<string, string>; band: Record<string, string> } }

/** /ecosystem: every other product from the team, as cards, a list or a table (the view lives in the URL). */
export default function EcosystemPage({ copy }: { copy: Copy }): React.JSX.Element {
  const { products } = useBand();
  const row = useLocaleRow();
  const e = copy.ecosystem;
  const [view, setView] = useState<View>('grid');
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('view');
    if (v && (VIEWS as string[]).includes(v)) setView(v as View);
  }, []);
  const choose = (v: View) => {
    setView(v);
    const url = new URL(window.location.href);
    url.searchParams.set('view', v);
    window.history.replaceState(null, '', url);
  };
  const intro = pluralOf(e.page, 'intro', products.length, row.htmlLang).replace('{count}', String(products.length));
  const site = 'https://linux-cleanup-docs.aoneahsan.com';
  return (
    <Layout title={e.band.title} description={intro}>
      <Head>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'ItemList', name: e.band.title, url: `${site}${row.code === 'en-GB' ? '' : `/${row.code}`}/ecosystem/`,
          itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: p.liveUrl })),
        })}</script>
      </Head>
      <main className="container margin-vert--lg eco-page">
        <p className="eco-eyebrow">{e.page.eyebrow}</p>
        <h1>{e.page.h1}</h1>
        <p className="eco-lead">{intro}</p>
        <nav className="eco-views" aria-label={e.view.label}>
          {VIEWS.map((v) => (
            <a key={v} href={`?view=${v}`} aria-current={v === view ? 'page' : undefined} onClick={(ev) => { ev.preventDefault(); choose(v); }}>{e.view[v]}</a>
          ))}
        </nav>
        {view === 'grid' ? <ul className="eco-grid">{products.map((p) => <li key={p.id}><EcosystemCard p={p} /></li>)}</ul> : null}
        {view === 'list' ? (
          <ul className="eco-list">
            {products.map((p) => (
              <li key={p.id}>
                <img src={`/ecosystem/${p.id}.svg`} alt="" width={40} height={40} loading="lazy" />
                <strong><bdi>{p.name}</bdi></strong>
                <p>{p.card}</p>
                <Link to={`/ecosystem/${p.id}`}>{e.band.details}</Link>
              </li>
            ))}
          </ul>
        ) : null}
        {view === 'table' ? (
          <table>
            <thead><tr><th scope="col">{e.table.product}</th><th scope="col">{e.table.what}</th><th scope="col">{e.table.link}</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td><Link to={`/ecosystem/${p.id}`}><bdi>{p.name}</bdi></Link></td>
                  <td>{p.card}</td>
                  <td><a href={p.liveUrl} target="_blank" rel="noopener">{e.band.visit.replace('{product}', p.name)} ↗</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </main>
    </Layout>
  );
}
