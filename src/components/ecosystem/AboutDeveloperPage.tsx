import React from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import OWNER from '@site/src/data/owner-profile.json';
import { useLocaleRow } from './shared';

interface Section { id: string; h2: string; p?: string[]; timeline?: [string, string][]; links?: [string, string][]; link?: [string, string] }
interface Copy { about: { title: string; description: string; eyebrow: string; h1: string; lead: string; portfolio: string; zaions: string; sections: Section[] } }

/** One link of the "more" list: the docs' own /ecosystem page, or another of the team's sites (followed). */
function More({ href, label }: { href: string; label: string }): React.JSX.Element {
  return href.startsWith('/') ? <Link to={href}>{label}</Link> : <a href={href} target="_blank" rel="noopener">{label}</a>;
}

/** /about-developer: who builds linux-cleanup, why, and the dated path it took (aoneahsan-cccs-about-developer). */
export default function AboutDeveloperPage({ copy }: { copy: Copy }): React.JSX.Element {
  const a = copy.about;
  const row = useLocaleRow();
  const date = (iso: string) => new Intl.DateTimeFormat(`${row.htmlLang}-u-nu-latn`, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
  return (
    <Layout title={a.title.replace(/ · linux-cleanup$/, '')} description={a.description}>
      <Head>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org', '@type': 'AboutPage', name: a.title,
          mainEntity: { '@id': 'https://aoneahsan.com/#person', '@type': 'Person', name: OWNER.person.name, alternateName: OWNER.person.alternateName, url: OWNER.person.url, sameAs: OWNER.person.sameAs },
        })}</script>
      </Head>
      <main className="container margin-vert--lg eco-page">
        <p className="eco-eyebrow">{a.eyebrow}</p>
        <h1>{a.h1}</h1>
        <p className="eco-lead">{a.lead}</p>
        <p className="eco-actions">
          <a className="button button--primary" href={OWNER.person.url} target="_blank" rel="noopener">{a.portfolio} ↗</a>{' '}
          <a className="button button--secondary" href={OWNER.organization.url} target="_blank" rel="noopener">{a.zaions}</a>
        </p>
        {a.sections.map((s) => (
          <section key={s.id}>
            <h2>{s.h2}</h2>
            {s.p?.map((t) => <p key={t}>{t}</p>)}
            {s.timeline ? <ol className="eco-timeline">{s.timeline.map(([d, t]) => <li key={d + t}><time dateTime={d}>{date(d)}</time> {t}</li>)}</ol> : null}
            {s.links ? <ul>{s.links.map(([href, label]) => <li key={href}><More href={href} label={label} /></li>)}</ul> : null}
            {s.link ? <p><More href={s.link[0]} label={s.link[1]} /></p> : null}
          </section>
        ))}
      </main>
    </Layout>
  );
}
