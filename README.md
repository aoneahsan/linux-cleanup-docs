# linux-cleanup-docs

Public documentation site for **[linux-cleanup](https://github.com/aoneahsan/linux-cleanup)** — a Bash CLI
that reclaims disk space on Linux by deleting regenerable caches behind allowlist, staleness and
confirmation guards.

**Live:** [linux-cleanup-docs.aoneahsan.com](https://linux-cleanup-docs.aoneahsan.com)

**Status checked 2026-10-14:** The package and npm release are at 1.6.0.
The site content was last audited against 1.4.0; its 1.6.0 safety review is
pending. GitHub Pages builds pass, but the custom domain did not resolve
in this check. The DNS and HTTPS tasks remain in `docs/MANUAL-TASKS.md`.

## Local development

```bash
yarn install
yarn start      # dev server on :5964
yarn build      # production build — also the link checker
yarn serve      # serve the built site on :5965
yarn typecheck
```

`onBrokenLinks` and `onBrokenMarkdownLinks` are both set to `throw`, so **a broken link fails the build**.
That is deliberate: the build is the link checker.

## Structure

| Path | Holds |
|---|---|
| `docs/` | All content. `MANUAL-TASKS.md` is excluded from the build |
| `src/css/custom.css` | Infima theme overrides |
| `static/` | `CNAME`, `robots.txt`, `llms.txt`, SVG assets |
| `sidebars.ts` | Navigation — update it in the same change that adds a page |
| `.github/workflows/deploy-pages.yml` | The only deploy path |

## Deployment

GitHub Pages, via Actions, on every push to `main`. There is no Firebase project and no `gh-pages` branch.
`static/CNAME` pins the custom domain and Docusaurus copies it into `build/`, so the artifact carries it
automatically.

DNS and the Pages custom-domain setting are owner-only — see `docs/MANUAL-TASKS.md`.

## 🔴 This repo is public

Never commit a secret. Only `.env.example`, with placeholder values.

Every analytics key is optional; an absent key skips that provider, so the build never depends on one. Real
values live in `~/.secrets/` and in the repository's Actions secrets.

Sweep before committing — this must return nothing:

```bash
git ls-files | grep -iE '(^|/)\.env$|secret|credential|serviceaccount|\.pem$|\.jks$|\.npmrc'
```

## Contributing

Corrections welcome. The documentation follows the source code rather than the source package's own `docs/`
tree, which contains several known inaccuracies — those are listed in `docs/MANUAL-TASKS.md`.

If you find a page contradicting what the tool actually does, that is a bug worth reporting.

## Licence

Documentation and site: MIT. `linux-cleanup` itself is MIT-licensed as of 1.4.0.

Built by [Ahsan Mahmood](https://aoneahsan.com).
