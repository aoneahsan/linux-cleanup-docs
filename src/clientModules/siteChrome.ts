/**
 * Two things every page of the manual carries, in plain DOM so they work on any doc page:
 *
 * 1. The legal notice (rules/legal-notice.md): one quiet bar, once per browser, marked seen when shown, gone after 10 s
 *    (held while hovered or focused), Okay or Escape closes it. Same sentence as the website.
 * 2. Update flow layer 2 (aoneahsan-cccs-update-flow): the newest `docs` release record is read on start, when the
 *    page comes back into view, and when a release is published (Realtime broadcast `app-releases`, never a timer).
 *    The decision is the shared pure `decide()`. This site has no service worker, so Update is a reload; the HTML is
 *    served fresh by GitHub Pages.
 *
 * Release-record values come from the build environment (`siteConfig.customFields`); a build without them skips the
 * gate, and the deploy check refuses such a build.
 */
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import siteConfig from '@generated/docusaurus.config';
import { defineStorage } from 'strata-storage';

import { decide, type ReleaseRecord, type StoredNotice } from './releaseGate';

interface Fields {
  docsVersion?: string;
  releaseUrl?: string;
  releaseKey?: string;
  releaseChannel?: string;
}

const FIELDS = (siteConfig.customFields ?? {}) as Fields;
const VERSION = FIELDS.docsVersion ?? '';
const CHANNEL = FIELDS.releaseChannel === 'test' ? 'test' : 'production';
const START_ID = `${String(Date.now())}-${Math.random().toString(36).slice(2, 8)}`;

const storage = defineStorage({ namespace: 'linux-cleanup-docs', keyPrefix: false, defaultStorages: ['localStorage', 'memory'] });
const LOCAL = { storage: 'localStorage' } as const;
const read = <T>(key: string): T | null => { try { return storage.getSync<T>(key, LOCAL) ?? null; } catch { return null; } };
const write = <T>(key: string, value: T): void => { try { storage.setSync(key, value, LOCAL); } catch { /* this visit only */ } };

const COPY = {
  legal: ['By using the linux-cleanup manual, you agree to our ', 'Privacy Policy', ' and ', 'Terms of Service', '. This site counts page views, never anything about you, to improve linux-cleanup.'],
  ok: 'Okay',
  headUrgent: 'UPDATE NEEDED NOW',
  headRequired: 'UPDATE NEEDED',
  title: 'This page is out of date.',
  noReason: 'A newer version of the linux-cleanup manual is out, and this page needs it before you carry on.',
  versions: (running: string, latest: string) => `This page: ${running} · current: ${latest}`,
  update: 'Update',
  noticeTitle: (latest: string) => `A newer version of the manual is out (${latest}).`,
  noticeNext: 'Update now, or it is required from your next visit.',
  later: 'Later',
} as const;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text) node.textContent = text;
  return node;
}

function legalBar(): void {
  if (read<boolean>('legal-notice-seen') === true) return;
  write('legal-notice-seen', true);
  const bar = el('div', 'lc-legal-bar');
  bar.setAttribute('role', 'status');
  const p = el('p', '');
  const [before, privacy, and, terms, after] = COPY.legal;
  const link = (href: string, text: string): HTMLAnchorElement => { const a = el('a', '', text); a.href = href; return a; };
  p.append(before, link('https://linux-cleanup.aoneahsan.com/privacy', privacy), and, link('https://linux-cleanup.aoneahsan.com/terms', terms), after);
  const ok = el('button', '', COPY.ok);
  ok.type = 'button';
  bar.append(p, ok);
  document.body.append(bar);
  let timer = window.setTimeout(close, 10_000);
  const hold = (): void => window.clearTimeout(timer);
  const release = (): void => { window.clearTimeout(timer); timer = window.setTimeout(close, 4000); };
  function close(): void { window.clearTimeout(timer); bar.remove(); document.removeEventListener('keydown', onKey); }
  function onKey(e: KeyboardEvent): void { if (e.key === 'Escape') close(); }
  bar.addEventListener('mouseenter', hold);
  bar.addEventListener('focusin', hold);
  bar.addEventListener('mouseleave', release);
  ok.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
}

async function readRecord(): Promise<{ ok: boolean; record: ReleaseRecord | null }> {
  if (!FIELDS.releaseUrl || !FIELDS.releaseKey) return { ok: false, record: null };
  try {
    const res = await fetch(
      `${FIELDS.releaseUrl}/rest/v1/latest_app_releases?platform=eq.docs&channel=eq.${CHANNEL}&select=version,severity,reason&limit=1`,
      { headers: { apikey: FIELDS.releaseKey, Accept: 'application/json' }, cache: 'no-store' },
    );
    if (!res.ok) return { ok: false, record: null };
    const rows = (await res.json()) as ReleaseRecord[];
    return { ok: true, record: rows[0] ?? null };
  } catch {
    return { ok: false, record: null };
  }
}

let shown: HTMLElement | null = null;
let dismissedFor = '';

function draw(kind: 'block' | 'notice' | 'none', version = '', reason = '', urgent = false): void {
  shown?.remove();
  shown = null;
  const page = document.getElementById('__docusaurus');
  if (page) page.inert = kind === 'block';
  if (kind === 'none' || (kind === 'notice' && dismissedFor === version)) return;
  if (kind === 'block') {
    const gate = el('section', 'lc-release-gate');
    gate.setAttribute('role', 'alertdialog');
    gate.setAttribute('aria-modal', 'true');
    gate.setAttribute('aria-labelledby', 'lc-release-title');
    const card = el('div', 'lc-release-card');
    const head = el('div', 'lc-release-head', urgent ? COPY.headUrgent : COPY.headRequired);
    const title = el('h2', '', COPY.title);
    title.id = 'lc-release-title';
    const button = el('button', 'lc-release-go', COPY.update);
    button.type = 'button';
    button.addEventListener('click', () => window.location.reload());
    card.append(head, title, el('p', '', reason || COPY.noReason), el('p', 'lc-release-fine', COPY.versions(VERSION, version)), button);
    gate.append(card);
    document.body.append(gate);
    button.focus();
    shown = gate;
    return;
  }
  const note = el('div', 'lc-release-note');
  note.setAttribute('role', 'status');
  const p = el('p', '');
  p.append(el('strong', '', COPY.noticeTitle(version)), ` ${reason} ${COPY.noticeNext}`);
  const go = el('button', 'lc-release-go', COPY.update);
  go.type = 'button';
  go.addEventListener('click', () => window.location.reload());
  const later = el('button', '', COPY.later);
  later.type = 'button';
  later.addEventListener('click', () => { dismissedFor = version; draw('none'); });
  const actions = el('div', '');
  actions.append(go, later);
  note.append(p, actions);
  document.body.append(note);
  shown = note;
}

async function check(): Promise<void> {
  const { ok, record } = await readRecord();
  const decision = decide({ running: VERSION, record, readOk: ok, stored: read<StoredNotice>('release-notice'), startId: START_ID, now: Date.now() });
  if (decision.action === 'notice') { write('release-notice', decision.store); draw('notice', decision.version, decision.reason); }
  else if (decision.action === 'block') draw('block', decision.version, decision.reason, decision.severity === 'urgent');
  else { if (decision.clearStored) write<StoredNotice | null>('release-notice', null); draw('none'); }
}

function watch(): void {
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') void check(); });
  if (!FIELDS.releaseUrl || !FIELDS.releaseKey) return;
  const url = FIELDS.releaseUrl;
  const key = FIELDS.releaseKey;
  void import('@supabase/realtime-js').then(({ RealtimeClient, REALTIME_SUBSCRIBE_STATES }) => {
    const client = new RealtimeClient(`${url.replace(/^http/, 'ws')}/realtime/v1`, { params: { apikey: key } });
    let joined = false;
    client
      .channel('app-releases')
      .on('broadcast', { event: 'release_published' }, ({ payload }) => {
        const p = payload as { platform?: string; channel?: string } | undefined;
        if (p?.platform === 'docs' && p.channel === CHANNEL) void check();
      })
      .subscribe((status) => {
        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          if (joined) void check();
          joined = true;
        }
      });
  }).catch(() => undefined);
}

if (ExecutionEnvironment.canUseDOM) {
  const start = (): void => { legalBar(); void check(); watch(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}
