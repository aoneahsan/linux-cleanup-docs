import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import { fill, useBand } from './shared';

const SLIDE_MS = 10_000;

/** One card: the product's own logo, its kind, this site's line about it, Visit (new tab, followed) and Details. */
export function EcosystemCard({ p }: { p: { id: string; name: string; category: string; liveUrl: string; card: string } }): React.JSX.Element {
  const { band, kind } = useBand();
  return (
    <article className="eco-card">
      <div className="eco-card-top">
        <img src={`/ecosystem/${p.id}.svg`} alt="" width={44} height={44} loading="lazy" />
        <div>
          <small>{kind[p.category] ?? p.category}</small>
          <strong><bdi>{p.name}</bdi></strong>
        </div>
      </div>
      <p>{p.card}</p>
      <div className="eco-actions">
        <a href={p.liveUrl} target="_blank" rel="noopener">{fill(band.visit, { product: p.name })} <span aria-hidden="true">↗</span></a>
        <Link to={`/ecosystem/${p.id}`}>{band.details}</Link>
      </div>
    </article>
  );
}

/**
 * "More from Zaions" before the footer on every docs page: one card each 10 s; hover, keyboard focus and the pause
 * button hold it; with reduced motion it never moves on its own. The track scrolls in reading direction.
 */
export default function EcosystemShowcase(): React.JSX.Element | null {
  const { band, products } = useBand();
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [still, setStill] = useState(true);

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setStill(q.matches);
    sync();
    q.addEventListener('change', sync);
    return () => q.removeEventListener('change', sync);
  }, []);

  const go = useCallback((next: number) => {
    const box = track.current;
    if (!box || products.length === 0) return;
    const i = (next + products.length) % products.length;
    const card = box.children[i]?.getBoundingClientRect();
    const frame = box.getBoundingClientRect();
    if (card) {
      const rtl = getComputedStyle(box).direction === 'rtl';
      box.scrollBy({ left: rtl ? card.right - frame.right : card.left - frame.left, behavior: still ? 'auto' : 'smooth' });
    }
    setIndex(i);
  }, [products.length, still]);

  useEffect(() => {
    if (paused || held || still) return undefined;
    const timer = window.setTimeout(() => go(index + 1), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [go, held, index, paused, still]);

  if (!band || products.length === 0) return null;
  return (
    <section className="eco-band" aria-labelledby="eco-title"
      onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false); }}>
      <div className="container">
        <div className="eco-head">
          <div>
            <p className="eco-eyebrow"><bdi>{band.eyebrow}</bdi></p>
            <h2 id="eco-title">{band.title}</h2>
          </div>
          <p>{band.lead}</p>
          <div className="eco-controls">
            <button type="button" aria-label={band.prev} onClick={() => go(index - 1)}><span className="eco-dir" aria-hidden="true">←</span></button>
            <button type="button" aria-label={paused || still ? band.play : band.pause} onClick={() => setPaused((p) => !p)} disabled={still}>
              <span aria-hidden="true">{paused || still ? '▶' : '❚❚'}</span>
            </button>
            <button type="button" aria-label={band.next} onClick={() => go(index + 1)}><span className="eco-dir" aria-hidden="true">→</span></button>
            <span className="eco-count" aria-live="polite">{fill(band.slide, { index: index + 1, count: products.length })}</span>
          </div>
        </div>
        <ul ref={track} className="eco-track" tabIndex={0} aria-label={band.title}>
          {products.map((p) => <li key={p.id}><EcosystemCard p={p} /></li>)}
        </ul>
        <div className="eco-band-foot">
          <Link className="button button--primary" to="/ecosystem">{band.seeAll} <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
