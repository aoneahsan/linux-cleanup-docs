---
title: Changelog
description: Release history for linux-cleanup from 1.0.0 through 1.6.0, including the newer cache-safety fixes and speed check.
tags: [changelog, releases, versions, history]
sidebar_position: 94
---

# Changelog

Release history for `linux-cleanup`. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project uses [semantic versioning](https://semver.org/spec/v2.0.0.html).

:::info Current release
The npm registry reported **1.6.0** on 2026-10-14. The safety and feature
changes since 1.4.0 are summarised below; the [source changelog](https://github.com/aoneahsan/linux-cleanup/blob/main/CHANGELOG.md)
has the complete release record. The rest of this site still needs its 1.6.0 fact-check.
:::

## 1.6.0 — 2026-09-18

Added the read-only `--speed` diagnosis and configurable project/personal
search roots. Fixed idle detection on `noatime` filesystems: older releases
could delete a cache still in use because access times were not recorded.
Alias and cron installs now point to a persistent copy, and log cleanup
removes only the current run's log.

## 1.5.2 — 2026-09-18

Preserved recent disabled Snap revisions as rollback copies and stopped
`--node-modules` from listing Yarn PnP internals.

## 1.5.1 — 2026-09-18

Changed extracted package and browser caches to whole-entry pruning so a
rarely used file cannot be removed from an otherwise active installation.

## 1.5.0 — 2026-09-18

Made Gradle and Android Studio cache pruning operate on complete version
units, and repaired stale `node_modules` detection and its dedicated
deletion guard. Earlier 1.4.0/1.5.0 cleanup can leave an extracted cache
incomplete; see the source changelog for recovery steps.

## 1.4.0 — 2026-07-11

### Changed

- **Relicensed to the [MIT License](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE).**
  Previously distributed under a custom "Source-Available · No-Derivatives · Non-Commercial v1.0" licence.
  It is now permissive, OSI-approved open source: free to use, modify, fork, redistribute and use
  commercially, with attribution.

  The MIT "AS IS / no liability" disclaimer replaces the prior warranty, liability and indemnification
  terms. `package.json` now declares `"license": "MIT"`.

  This applies going forward — **previously published releases keep the licence they shipped under.**

No code, safety-guard or CLI changes.

## 1.3.1 — 2026-05-10

Documentation-only release. No behaviour changes.

### Added

- A comprehensive `docs/` tree structured on the [Diátaxis framework](https://diataxis.fr/) — tutorials,
  how-to guides, reference and explanation. Every mode, flag, output path and exit code documented.
- Per-feature pages for all sixteen modes, reference pages for flags, modes, environment variables, output
  paths, exit codes and the JSON schema, plus how-to recipes and a FAQ.
- A "Full documentation" section in the README linking the most-used pages.

Code, safety guards and the CLI surface are unchanged from 1.3.0.

## 1.3.0 — 2026-05-10

Final-polish release: a visual menu and automatic crash capture. No new cleanup logic; existing safety
guards and staleness gates unchanged.

### Added

- **[TUI mode](./modes/tui.md)** (`-t` / `--tui` / `-g` / `--gui`) — a whiptail or dialog driven menu. Each
  selection drops back to normal CLI output for the run, then returns to the menu. Falls back gracefully to
  the CLI menu when neither tool is installed, with a per-distro install hint.
- **Automatic crash-bundle capture** — an EXIT trap that, on an unexpected non-zero exit, writes a
  self-contained `crash-<stamp>.tar.gz` to `~/.linux-cleanup/feedback/` holding the session log, the most
  recent record and a system manifest, then prints a one-liner you can email.

  Suppressed on clean exit, `Ctrl-C` (130), `SIGTERM` (143) and argument-parse exits (2). **No network
  calls** — the bundle stays on your machine until you choose to share it.
- A TUI **About** dialog carrying version, contact details, licence and the privacy guarantee.

### Changed

- Banner and session-summary suppression now includes `tui` mode, so the dialog is not fighting log output.

## 1.2.2 — 2026-05-10

### Fixed

- Minor bug fixes and internal stability improvements.

## 1.2.1 — 2026-05-10

Extends the 1.2.0 staleness gate to anything that is a *tool* rather than a regenerable cache. Such
deletions now require **both** that no active software depends on the asset **and** that you have not
touched it in `--days` days.

### Changed

- **Android AVDs** — previously wiped `~/.android/avd` wholesale on confirm. Now each `*.avd` directory is
  inspected as a unit, paired with its sibling `*.ini`, and pruned only when every file in the profile is
  idle past the threshold. Recently-used emulator profiles survive intact.
- **[VS Code / Cursor superseded extensions](./modes/editor-extensions.md)** — the "a newer version exists"
  check covered the first condition; the superseded directory must now *also* be idle past the threshold.
  Recently-loaded older versions are listed but kept, with per-version idle days shown.
- **Flatpak user data** — `~/.local/share/flatpak` holds installed user-scope apps, not just caches. The
  module now refuses to touch the tree if any user-scope app is installed, and additionally requires the
  tree to be idle past the threshold. Points at `flatpak uninstall --user --unused` for the safer path.

### Added

- `newest_access_age_days <path>` — returns days since the freshest `atime`/`mtime` anywhere under a path.
- `prune_stale_units <root> <days> [glob]` — treats each top-level child as indivisible, so a partial prune
  cannot corrupt state.

### Why

A user pointed out that 1.2.0 still wiped Android AVDs wholesale, and that the same reasoning should apply
to anything that is a tool rather than a cache: do not remove software another tool depends on, and do not
remove software the user themselves used recently.

## 1.2.0 — 2026-05-10

**The default delete strategy became stale-only.** Nothing inside a target cache is removed unless its files
have been untouched — both `atime` and `mtime` — for `--days` days, default 100.

### Changed

- **`clean_target`, the shared cleaner behind every cache module, now prunes rather than full-wipes.** It
  deletes only files past the threshold, then sweeps empty directories. Recently-used files survive and the
  directory shell stays so tools still find their layout.
- **[`--all-safe`](./modes/all-safe.md) prunes per target** the same way, and its summary reports bytes freed
  **and** bytes kept per target.
- **npm cache cleanup honours the staleness gate** instead of always running `npm cache clean --force`,
  which ignored age entirely.
- The pre-run banner states the active strategy — "prune ≥Nd" or "FULL PURGE".

### Added

- **`--purge-all`** restores pre-1.2.0 wipe-everything behaviour, documented with the trade-off spelled out.
- **`prune_stale <root> <days>`** — a public helper for modules that refuses protected paths, deletes only
  where both timestamps exceed the threshold, sweeps empty directories, and reports bytes freed.

### Why

The 1.1.0 default deleted whole cache trees on confirm. That was right for `~/.cache/yarn`, which regenerates
quickly, and wrong for `~/.gradle/wrapper/dists/` — a 230 MB download you might genuinely need next month.

A 100-day threshold cleanly separates "I touched this recently and would miss it" from "I have not opened this
in three months". Power users can still force the old behaviour or sharpen the gate with `-d 30`.

## 1.1.0 — 2026-05-10

Safety-hardening release. Closes the door on globally installed packages and shell-init files ever being
touched.

### Fixed

- **pnpm globals were being wiped.** Cleanup of the pnpm content store targeted `~/.local/share/pnpm`
  (`PNPM_HOME`) — which holds globally installed packages, bin shims, and the `pnpm` binary itself from
  `pnpm setup`. It now targets only `~/.local/share/pnpm/store`, the regenerable content-addressable cache.

  Affected `--all-safe`, menu option 3, scan, walkthrough and `--list-targets`.

### Added — safety guards

- **[`PROTECTED_EXACT`](./reference/protected-paths.md#exact-match-protected-paths)** — an exact-match block
  on package-manager install directories and runtime homes: pnpm, npm, yarn, bun, deno, volta, nvm, fnm,
  cargo, rustup and Go.
- **[`PROTECTED_BASENAMES`](./reference/protected-paths.md#protected-basenames)** — refuses any path whose
  basename is a shell-init or history file, regardless of its location.
- **An `--all-safe` startup assertion** that aborts with a `BUG:` message if any protected runtime directory
  ever leaks into the target list, preventing a silent regression.

### Added — bun and deno coverage

- bun: cache cleanup at `~/.bun/install/cache`; `~/.bun/install/global` protected.
- deno: cache cleanup at `~/.cache/deno`; `~/.deno/bin` protected.
- Both wired into `--all-safe`, `--scan` and the new globals audit.

### Added — modes

- **[`--globals`](./modes/globals-audit.md)** — a read-only audit listing directly-installed global packages
  from npm, pnpm, yarn, bun and deno, marking each `recently used`, `needed by: <pkg>`, or `STALE — safe to
  uninstall`, and printing copy-pasteable uninstall commands. **Never deletes anything.** Works even when the
  package manager CLI is not on `PATH`.
- **[`--doctor`](./modes/doctor.md)** — detects a runtime present on disk but not wired into shell init
  (nvm, pnpm, bun, deno, cargo) and offers to append the canonical block. **Appends only, with confirmation.
  Never deletes or modifies existing lines.**

### Changed

- `--all-safe` prints explicit "globals are PRESERVED" and "shell-init files are NEVER touched" notices.

## 1.0.0 — 2026-05-09

Initial public release.

### Distribution

- Published to npm — runnable via `npx linux-cleanup` or `npm install -g linux-cleanup`. The package ships a
  thin Node launcher that locates the bash entry point and routes logs and records to `~/.linux-cleanup/` so
  they survive npx temp eviction.
- Direct `git clone` also supported, keeping output inside the clone.

### Features

- **Guided ten-step walkthrough** as the default mode, with progress headers, `a` / `s` / `q` prompts,
  per-step bytes-freed display and a running total.
- **Allowlist-based safety** — refuses any path inside a curated protected list, plus bare `$HOME` and `/`.
- **Personal data interactive-only** — never batched, never `--yes`-able.
- **Cleanup categories** — package-manager caches (yarn, npm, pnpm, pip, composer); application caches
  (Chrome, Firefox, Brave, Chromium, Edge, Vivaldi, Gradle, Cypress, Playwright, TypeScript, Zoom);
  developer tools (Android AVDs, pub-cache, Dart, flatpak); editor extensions; stale `node_modules`;
  partial downloads and stale personal files; system cleanup under sudo.
- **Session records** — canonical JSON written every run, with on-demand Markdown and HTML export. HTML uses
  dark-mode-aware embedded CSS.
- **[Reports manager](./modes/reports.md)** (`--reports`) and non-interactive `--export FMT ID`.
- **Self-test** (`--self-test`) verifying dependencies, the syntax of every shell file, and safety-guard
  sanity — asserting protection returns true for `/`, `$HOME`, `~/Documents` and `/etc`.
- **`--feedback`** and **`--debug-bundle`** for structured bug reporting.
- **Privacy** — zero network calls. No telemetry, analytics or crash reporting. The only data that leaves
  your machine is what you choose to email.
- **Credits in every artefact** — logs open with a self-attributing header, records carry a top-level
  `credits` block, HTML output is footer-credited.
- **Setup helpers** — `--install-alias`, `--install-cron` and their uninstall counterparts.
- `NO_COLOR` support and `--no-color`.

### Security and safety hardening

- HTML output escapes all JSON-derived values through `jq`'s `@html` filter, preventing injection from a
  malformed record.
- `command -v` guards on every optional dependency (`snap`, `crontab`, `xdg-open`, `jq`).
- `realpath -m` resolves symlinks before any protected-path check, so a symlink cannot evade the allowlist.

## Upstream

The authoritative changelog lives in the
[source repository](https://github.com/aoneahsan/linux-cleanup/blob/main/CHANGELOG.md).
