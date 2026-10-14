# Manual / User-Only Tasks — linux-cleanup-docs

> The ONE place for everything only you (the human) can do. Fixed path: `docs/MANUAL-TASKS.md`.
> Global spec: `~/.claude/rules/manual-tasks.md`.  **Last updated:** 2026-10-14

> 🔴 **This file is EXCLUDED from the published site** via the docs plugin `exclude` list in
> `docusaurus.config.ts`. It is internal. Do not link it from any published page, and do not remove it from
> that exclude list — this repo is public.

## ⏳ Pending manual tasks

| # | Task | Why only you | Detail | Status |
|---|------|--------------|--------|--------|
| 2 | Set the DNS record for `linux-cleanup-docs.aoneahsan.com` | Registrar access | GitHub Pages already names this domain, but DNS did not resolve on 2026-10-14. Configure the record shown by the registrar/Pages and recheck. | ☐ Open |
| 3 | Enable and verify HTTPS after DNS resolves | GitHub Pages setting | Pages uses GitHub Actions and has the custom domain set; the API reported `https_enforced: false` on 2026-10-14. | ☐ Open |

### Optional, not blocking

| # | Task | Why only you |
|---|------|--------------|
| 7 | Add Actions secrets `GA_MEASUREMENT_ID` / `CLARITY_PROJECT_ID` / `AMPLITUDE_API_KEY` / `SENTRY_DSN` | Each is optional; an absent secret skips that provider and the build still succeeds. **Never commit a value** — this repo is public |
| 8 | Submit the site to Google Search Console and Bing Webmaster Tools | Requires domain verification |

## ✅ Completed manual tasks

| Task | Evidence |
|---|---|
| Public `aoneahsan/linux-cleanup-docs` repository exists on `main` | GitHub visibility and branch verified 2026-10-14 |
| GitHub Pages workflow deployed successfully | Run 30163241032 succeeded for the prior `main` head; custom-domain DNS remains open |
| Public `main` ruleset enabled | Active `Protect main (PR + approval; owner bypass)` ruleset verified 2026-10-14 |
| Package published beyond 1.4.0 | npm registry returned `linux-cleanup@1.6.0` as latest on 2026-10-14; the old 1.3.1 claim was retired |

---

## Source-package findings needing an owner decision

Found while writing these docs. **The source package `linux-cleanup` was read-only for this task, so nothing
there was changed.** Each item is a contradiction between its shipped documentation and its actual code.

| # | Finding | Where | Impact |
|---|---------|-------|--------|
| A | `docs/reference/report-schema.md` documents a schema the code never emits (`schema`/`tool`/`session`/`categories`). The real one is `schema_version: 1` with `credits`/`meta`/`disk`/`memory`/`steps`/`totals` — see `modules/walkthrough.sh:91` | source `docs/` | Any consumer written against that page fails on every real file |
| B | `docs/faq.md` claims graded `--system` support for Fedora (dnf), Arch (pacman/paccache) and openSUSE (zypper). **No such code exists** — `modules/system_sudo.sh` calls `apt`/`dpkg` only, with no distro detection and no `command -v` guard | source `docs/` | A Fedora/Arch user expects `--system` to work; it fails per step |
| C | `docs/safety.md` lists `~/.password-store` and `~/.aws` as protected. They are **not** in `PROTECTED_PATHS` | source `docs/` | Claims a protection that does not exist, for credential directories |
| D | `docs/safety.md` says `/tmp` aging honours `--days`, and that `--system` removes old kernels. Actually `/tmp` is hardcoded to `-atime +7`, and the kernel step only **lists** — `apt autoremove` does the removing | source `docs/` | Minor, but both overstate what runs |
| E | `docs/troubleshooting.md` quotes the refusal string as `✗ refusing to delete inside protected path`. The real string is `✗ REFUSE: protected path: <path>` | source `docs/` | Users grepping for the documented string find nothing |
| F | `CHANGELOG.md` link reference at the bottom points at `https://example.invalid/...` | source `CHANGELOG.md` | Placeholder left in a published file |

**This docs site documents the code, not those pages**, and calls out C and B explicitly where a reader could
be misled. Fixing the source package is a separate task on the `linux-cleanup` repo.
