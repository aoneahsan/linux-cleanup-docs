# Manual / User-Only Tasks — linux-cleanup-docs

> The ONE place for everything only you (the human) can do. Fixed path: `docs/MANUAL-TASKS.md`.
> Global spec: `~/.claude/rules/manual-tasks.md`.  **Last updated:** 2026-07-25

> 🔴 **This file is EXCLUDED from the published site** via the docs plugin `exclude` list in
> `docusaurus.config.ts`. It is internal. Do not link it from any published page, and do not remove it from
> that exclude list — this repo is public.

## ⏳ Pending manual tasks

| # | Task | Why only you | Detail | Status |
|---|------|--------------|--------|--------|
| 1 | Create the GitHub repo `aoneahsan/linux-cleanup-docs` (**public**) and push `main` | Repo creation + visibility is an owner decision | Remote must be `git@github.com:aoneahsan/linux-cleanup-docs.git` | ☐ Not started |
| 2 | Add the Hostinger DNS record for `linux-cleanup-docs.aoneahsan.com` | DNS registrar access | `CNAME  linux-cleanup-docs  →  aoneahsan.github.io` | ☐ Not started |
| 3 | Repo **Settings → Pages**: source = GitHub Actions; custom domain = `linux-cleanup-docs.aoneahsan.com`; tick **Enforce HTTPS** | GitHub repo settings | `static/CNAME` already pins the domain in the build artifact | ☐ Not started |
| 4 | Verify the first Actions deploy went green | Requires the repo to exist | Workflow: `.github/workflows/deploy-pages.yml` | ☐ Not started |
| 5 | Apply the public-repo ruleset to `main` | Owner-only admin action | Per `~/.claude/rules/public-repo-governance.md`: PR + 1 approval + CI, no force-push/delete, bypass = Repository admin only | ☐ Not started |
| 6 | Decide whether to publish `linux-cleanup@1.4.0` to npm | Release decision | npm `latest` is 1.3.1; 1.4.0 (MIT relicence) is unpublished. The docs currently state this discrepancy honestly — revisit the wording after publishing | ☐ Not started |

### Optional, not blocking

| # | Task | Why only you |
|---|------|--------------|
| 7 | Add Actions secrets `GA_MEASUREMENT_ID` / `CLARITY_PROJECT_ID` / `AMPLITUDE_API_KEY` / `SENTRY_DSN` | Each is optional; an absent secret skips that provider and the build still succeeds. **Never commit a value** — this repo is public |
| 8 | Submit the site to Google Search Console and Bing Webmaster Tools | Requires domain verification |

## ✅ Completed manual tasks

(move rows here with the date once done)

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
