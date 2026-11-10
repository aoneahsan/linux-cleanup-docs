# linux-cleanup-docs — agent guide

**Production project since 2026-11-10.** TASK-001 in `../PENDING-TASKS.md` owns the current CLI rewrite.
Source 2.1.0 is in `../linux-cleanup/`; the last published npm version was 2.0.0 when this rewrite began.
Do not publish changed docs until the CLI release and story publication gate are complete.

**Mirror of `AGENTS.md`** — byte-identical except the header names. Change one, change both.

**Last Updated:** 2026-11-10

| Context Budget Last Verified | 2026-10-14; next routine pass 2026-11-13. See the workspace context tracker for coverage and byte counts. |
|---|---|

The old docs were fact-checked against 1.4.0, then published with false claims about dry runs and network
use. Verify every current claim against `../linux-cleanup/`, especially destructive modes. The custom docs
domain is configured in GitHub Pages but does not yet resolve in DNS.

## What this is

The public documentation site for **[linux-cleanup](https://github.com/aoneahsan/linux-cleanup)**, a Bash
CLI that deletes files to reclaim disk space on Linux.

| | |
|---|---|
| **Stack** | Docusaurus 3.10 · React 19 · TypeScript ~6.0.3 · yarn 4 |
| **Domain** | `linux-cleanup-docs.aoneahsan.com` (pinned in `static/CNAME`) |
| **Deploy** | Local build, manually push `build/` to `gh-pages`, request a Pages build. **No Actions or Firebase** |
| **Repo visibility** | 🔴 **PUBLIC** |
| **Dev ports** | 5964 (start) · 5965 (serve) |
| **Source package** | `../linux-cleanup` — separate repository, edited only through its own guidance |

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
yarn typecheck
yarn build      # ALSO the link checker — onBrokenLinks is 'throw'
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

## Prior safety findings to revalidate

These were checked against source 2.1.0 during TASK-001. Re-check before changing or reusing a claim:

| Fact | Detail |
|---|---|
| **`--dry-run` exists** | It walks a selected mode without deletion; a local log and update-check state may still be written. `--scan` only reads current paths and sizes |
| **JSON schema** | `schema_version: 1` + `credits`/`meta`/`disk`/`memory`/`steps`/`totals`. The source's own `report-schema.md` describes a different, non-existent shape |
| **`--system` is Debian/Ubuntu only** | `apt`/`dpkg` with no distro detection and no guard. The source FAQ's dnf/pacman/zypper table is fiction |
| **`/tmp` aging is hardcoded to 7 days** | It does not follow `--days` |
| **Journal vacuum is hardcoded to 100 MB** | Same |
| **The kernel step only lists** | `apt autoremove` does the removing |
| **`~/.password-store` and `~/.aws` are NOT protected** | The source `safety.md` claims they are |
| **`~/Downloads` is NOT protected** | Deliberately — cleaning it is a feature. Guard 3 covers it instead |
| **Refusal string** | `✗ REFUSE: protected path: <path>` |
| **Release check** | The CLI fetches a public release record on start when online. It does not upload paths or reports. |
| **Current npm release** | Re-query before a release claim; source 2.1.0 is not evidence that npm has published it. |

## Never

- Commit a secret, or a real `.env`
- Remove `MANUAL-TASKS.md` from the docs `exclude` list
- Add a Firebase config, Actions workflow or deploy path
- Edit anything in `../linux-cleanup` from this repo
- Start a dev server in an automated session
- State or imply that a deletion can be undone

## Related

- Global docs-site law: `~/.claude/rules/docs-sites.md`
- Public repo governance: `~/.claude/rules/public-repo-governance.md`
- Manual-task spec: `~/.claude/rules/manual-tasks.md`

## Stop-work Git gate

<!-- RULE:stop-work-git-gate v2026-10-20 -->

Before stopping, commit every legitimate change and work-progress checkpoint in this repository and each independent nested repository, fetch and merge the designated upstream, push the documented working branch, then verify an empty worktree and `0 0` ahead/behind. Never stash, discard, reset, rebase, or force-push. If synchronization is blocked, report the exact repository, branch, blocker, and next action instead of calling the work complete. The full workflow remains authoritative in `~/.claude/rules/git-workflow.md`.
