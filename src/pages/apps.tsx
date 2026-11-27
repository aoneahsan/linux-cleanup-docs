import type {ReactNode} from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {APPS_PAGE, CURRENT_SURFACE, PLATFORMS, type Platform} from '@site/src/data/platforms';
import styles from './apps.module.css';

/** One platform's words in the reader's locale; English (from `src/data/platforms.ts`) is the source. */
function words(p: Platform) {
  const t = (field: 'name' | 'title' | 'text' | 'cta') => translate({id: `apps.platform.${p.id}.${field}`, message: p[field]});
  return {name: t('name'), title: t('title'), text: t('text'), cta: t('cta')};
}

/** `/apps` — "Get linux-cleanup": every released surface, from `src/data/platforms.ts`, in every locale. */
export default function Apps(): ReactNode {
  const {siteConfig, i18n} = useDocusaurusContext();
  const title = translate({id: 'apps.title', message: APPS_PAGE.title});
  const description = translate({id: 'apps.description', message: APPS_PAGE.description});
  const prefix = i18n.currentLocale === i18n.defaultLocale ? '' : `/${i18n.currentLocale}`;
  const rows = PLATFORMS.map((p) => ({p, w: words(p)}));
  // The list of places, for search and answer engines: the same rows the page shows, in this locale.
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description,
    url: `${siteConfig.url}${prefix}/apps/`,
    itemListElement: rows.map(({p, w}, i) => ({'@type': 'ListItem', position: i + 1, name: w.name, url: p.href})),
  };
  return (
    <Layout title={title} description={description}>
      <Head>
        <script type="application/ld+json">{JSON.stringify(itemList)}</script>
      </Head>
      <main className="container margin-vert--xl">
        <Heading as="h1">{title}</Heading>
        <p className={styles.lead}>{translate({id: 'apps.lead', message: APPS_PAGE.lead})}</p>
        <div className={styles.grid}>
          {rows.map(({p, w}) => {
            const current = p.id === CURRENT_SURFACE;
            return (
              <article key={p.id} className={styles.card}>
                <span className={styles.kicker}>{w.name}</span>
                <Heading as="h2" className={styles.title}>{w.title}</Heading>
                <p>{w.text}</p>
                {current
                  ? <span className={styles.here}>{translate({id: 'apps.here', message: "You're reading it"})}</span>
                  : <Link className={p.primary ? 'button button--primary' : 'button button--secondary'} href={p.href}>{w.cta}</Link>}
              </article>
            );
          })}
        </div>
      </main>
    </Layout>
  );
}
