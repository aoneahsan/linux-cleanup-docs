import React from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import { fill } from './shared';

interface ProductCopy { card: string; title: string; intro: string; sections: { heading: string; body: string }[]; facts: string[] }
interface Copy { ecosystem: { band: Record<string, string>; detail: Record<string, string>; kind: Record<string, string>; products: Record<string, ProductCopy> } }
interface Product { id: string; name: string; category: string; liveUrl: string; facts: { id: string; checked: string }[] }

/** /ecosystem/<id>: one product, written from this site's own angle (four answer-first questions). */
export default function EcosystemProductPage({ copy, product }: { copy: Copy; product: Product }): React.JSX.Element {
  const e = copy.ecosystem;
  const c = e.products[product.id];
  const checked = product.facts.filter((f) => c.facts.includes(f.id)).reduce((d, f) => (f.checked > d ? f.checked : d), '');
  return (
    <Layout title={c.title} description={c.intro}>
      <Head>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: product.name, url: product.liveUrl, description: c.intro,
          applicationCategory: 'UtilitiesApplication', publisher: { '@id': 'https://zaions.com/#organization' }, creator: { '@id': 'https://aoneahsan.com/#person' },
        })}</script>
      </Head>
      <main className="container margin-vert--lg eco-page">
        <p className="eco-eyebrow"><Link to="/ecosystem">{e.detail.back}</Link></p>
        <div className="eco-card-top">
          <img src={`/ecosystem/${product.id}.svg`} alt="" width={56} height={56} />
          <small>{e.kind[product.category] ?? product.category}</small>
        </div>
        <h1>{c.title}</h1>
        <p className="eco-lead">{c.intro}</p>
        <p><a className="button button--primary" href={product.liveUrl} target="_blank" rel="noopener">{fill(e.band.visit, { product: product.name })} ↗</a></p>
        {c.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            <p>{s.body}</p>
          </section>
        ))}
        <p className="eco-note">{fill(e.detail.facts, { date: checked })}</p>
      </main>
    </Layout>
  );
}
