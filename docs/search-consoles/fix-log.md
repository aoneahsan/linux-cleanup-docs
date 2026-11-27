# Search-console fix log — linux-cleanup-docs

Newest first. One section per issue. Never published (excluded in `docusaurus.config.ts`).

## linux-cleanup-docs#1 — indexing issues found in Google/Bing/Yandex audit 2026-11-26 · 2026-11-27 · docs 1.2.1

Status: deploying (live proof below once GitHub Pages serves the build).

| Box | SA | What was wrong (evidence) | Root fix (file) | Contract test | Live proof |
|---|---|---|---|---|---|
| Body 1: Yandex verification | SA-P19 | no `yandex-verification` meta in the head | `docusaurus.config.ts` themeConfig.metadata | — | pending |
| Body 3 / comment 2 item 1: 48 tag pages crawled, not indexed | SA-P32 | 150 generated tag pages (`/tags/*`, `/feed/tags/*`) in every locale, thin lists | `tags:` removed from all 520 front matters; `src/data/seo-removed-paths.json` (155 paths) through `@docusaurus/plugin-client-redirects` | `redirects every removed path in every locale` | pending |
| Comment 2 item 2: feeds, llms.txt, `.md` mirrors | SA-P29 | this host serves no `.md` mirror; feeds are expected in "crawled, not indexed" | no change needed on the docs host | — | `find build -name '*.md'` → none |
| Comment 1: FAQPage JSON-LD | AI-03 | FAQ page shows 17 questions with no FAQPage data | `src/plugins/faqJsonLd.ts` (postBuild, reads the rendered page, every locale) | `FAQPage data on every FAQ page` | pending |
| Owner decision: slash form | SA-P26/P27 | `trailingSlash: false` on GitHub Pages: canonicals without the slash, every URL a 301 hop | `trailingSlash: true`; absolute links slashed in `static/llms.txt`, the website, the CLI README, the dummy | `self-canonical in the slashed form` | pending |
| Found by the contract test | SA-P05 | `/search/` (local search results) listed in all ten sitemaps | `src/plugins/sitemapAlternates.ts` drops it | `lists exactly the canonical pages` | pending |

Overruled by owner law: comment 2 item 1 asked for `noindex,follow` on tag pages → the pages are switched off and
their URLs redirect to the page that carried the tag (owner, 2026-11-27: no `noindex` on public pages). GitHub Pages
cannot send an HTTP 301, so the plugin writes a canonical + `meta refresh` page, which Google treats as a permanent
redirect.

### Pending

| Box | Why not done | Who | Next action |
|---|---|---|---|
| Body 2: project page on aoneahsan.com | lives in the portfolio repo (`aoneahsan-portfolio-ahsan-mahmood-portfolio-app#1`) | that repo's session | link it from the docs and the website once it exists |
| Body 3 (2): cut or noindex boilerplate | overruled: white-label and compare pages stay indexable | — | made specific instead (website: verify-license, compare pages) |
| Indexing itself | Google decides | daily audit | Validate fix in Search Console |

### Retest

```bash
curl -s https://linux-cleanup-docs.aoneahsan.com/ | grep -o '<meta name="yandex-verification"[^>]*>'
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://linux-cleanup-docs.aoneahsan.com/faq   # 301 → /faq/
curl -s https://linux-cleanup-docs.aoneahsan.com/faq/ | grep -o '<link rel="canonical"[^>]*>'
curl -s https://linux-cleanup-docs.aoneahsan.com/faq/ | grep -c '"FAQPage"'
curl -s https://linux-cleanup-docs.aoneahsan.com/tags/bashrc/ | grep -o 'http-equiv="refresh"[^>]*>'
curl -s https://linux-cleanup-docs.aoneahsan.com/sitemap.xml | grep -c '/tags/\|/search/'    # 0
```
