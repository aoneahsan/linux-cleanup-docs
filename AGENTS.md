# linux-cleanup-docs — agent guide

**Mirror of `CLAUDE.md`** — byte-identical except the header names. Change one, change both.

**Last Updated:** 2026-07-25

## What this is

The public documentation site for **[linux-cleanup](https://github.com/aoneahsan/linux-cleanup)**, a Bash
CLI that deletes files to reclaim disk space on Linux.

| | |
|---|---|
| **Stack** | Docusaurus 3.10 · React 19 · TypeScript ~6.0.3 · yarn 4 |
| **Domain** | `linux-cleanup-docs.aoneahsan.com` (pinned in `static/CNAME`) |
| **Deploy** | GitHub Pages via Actions on push to `main`. **No Firebase** |
| **Repo visibility** | 🔴 **PUBLIC** |
| **Dev ports** | 5964 (start) · 5965 (serve) |
| **Source package** | `../linux-cleanup` — **read-only from here** |

## 🔴 The rules that matter most here

**1. This repo is PUBLIC — no secret ever enters it.** Only `.env.example`, placeholders only. Every
analytics key is optional and an absent key skips its provider, so the build never needs one. Sweep before
committing:

```bash
git ls-files | grep -iE '(^|/)\.env$|secret|credential|serviceaccount|\.pem$|\.jks$|\.npmrc'
```

**2. `docs/MANUAL-TASKS.md` must stay excluded from the build.** It sits in `docs/`, which is also the
published content directory, so without the `exclude` entry in `docusaurus.config.ts` it ships as a public
page. Note that `exclude` **replaces** the plugin defaults — the defaults are restated there deliberately.
Verify with `find build -iname '*MANUAL*'` returning nothing.

**3. Never add Firebase.** No `firebase.json`, no `.firebaserc`, no `firebase:deploy` script. A docs site is
not a Firebase app. GitHub Pages is the only deploy path
(`~/.claude/rules/docs-sites.md`).

**4. The documentation follows the CODE, not the source package's `docs/` tree.** That tree contains several
verified inaccuracies — a wrong JSON schema, invented multi-distro support, protected paths that are not
protected. They are listed in `docs/MANUAL-TASKS.md`. When they conflict, the shell source wins, and where a
reader could be misled the site says so explicitly.

**5. Never imply a deletion is reversible.** This documents a destructive tool with no undo. Say what is
permanent, plainly, every time it is relevant.

## Verifying a change

```bash
yarn build      # ALSO the link checker — onBrokenLinks is 'throw'
yarn typecheck
```

Zero warnings, zero errors. A broken internal link fails the build by design.

Never start a dev server to "check" something in an automated session — `yarn build` then `yarn serve` is the
sanctioned path.

## Content conventions

- **Every page carries `title` + `description` front matter.** Without them the page is unsearchable and
  ships an empty meta description. `tags` power discovery
- **Update `sidebars.ts` in the same change** that adds a page. A page not in the sidebar is unreachable
- **Docusaurus admonitions** (`:::danger`), not GitHub alerts (`> [!WARNING]`) — they are not interchangeable
- **Relative links between docs** (`../safety/guards.md`), so the build validates them
- **Redirect, never delete, a published URL**
- Fence every code block with a language

## Facts about the tool that are easy to get wrong

Verified against the source of 1.4.0. Do not "correct" these back:

| Fact | Detail |
|---|---|
| **No `--dry-run`** | Read-only preview is the separate `--scan` mode |
| **JSON schema** | `schema_version: 1` + `credits`/`meta`/`disk`/`memory`/`steps`/`totals`. The source's own `report-schema.md` describes a different, non-existent shape |
| **`--system` is Debian/Ubuntu only** | `apt`/`dpkg` with no distro detection and no guard. The source FAQ's dnf/pacman/zypper table is fiction |
| **`/tmp` aging is hardcoded to 7 days** | It does not follow `--days` |
| **Journal vacuum is hardcoded to 100 MB** | Same |
| **The kernel step only lists** | `apt autoremove` does the removing |
| **`~/.password-store` and `~/.aws` are NOT protected** | The source `safety.md` claims they are |
| **`~/Downloads` is NOT protected** | Deliberately — cleaning it is a feature. Guard 3 covers it instead |
| **Refusal string** | `✗ REFUSE: protected path: <path>` |
| **npm `latest` is 1.3.1** | 1.4.0 is in the repo, unpublished; it changed only the licence |

## Never

- Commit a secret, or a real `.env`
- Remove `MANUAL-TASKS.md` from the docs `exclude` list
- Add a Firebase config or deploy path
- Edit anything in `../linux-cleanup` from this repo
- Start a dev server in an automated session
- State or imply that a deletion can be undone

## Related

- Global docs-site law: `~/.claude/rules/docs-sites.md`
- Public repo governance: `~/.claude/rules/public-repo-governance.md`
- Manual-task spec: `~/.claude/rules/manual-tasks.md`
