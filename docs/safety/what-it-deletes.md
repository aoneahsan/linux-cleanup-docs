---
title: What it deletes
description: The Linux cleanup modes and their target paths, with the difference between routine caches, system work and personal files.
tags: [safety, deletion, targets, caches, disk-space]
sidebar_position: 1
---

# What it deletes

**linux-cleanup removes selected caches and leftovers permanently.** The target depends on the mode. A scan lists paths and current sizes; a dry run walks the chosen cleanup and shows proposed actions. Neither is a backup.

```bash
linux-cleanup --list-targets
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

The [protected-path guard](../reference/protected-paths.md) refuses configured personal and system locations after resolving symlinks. Read every proposed path before a real run.

## Package-manager caches

Routine all-safe cleanup can prune these cache roots. Reinstalling a package may need a network download afterwards.

| Cache | Target root |
|---|---|
| Yarn Berry | `~/.yarn/berry/cache` |
| npm | `~/.npm/_cacache` |
| npx installs | `~/.npm/_npx` |
| pnpm store | `~/.local/share/pnpm/store` |
| pnpm cache | `~/.cache/pnpm` |
| bun | `~/.bun/install/cache` |
| deno | `~/.cache/deno` |
| Composer | `~/.cache/composer` |
| pip | `~/.cache/pip` |

Yarn v1 extracted packages are pruned as whole entries in `~/.cache/yarn`. Globally installed packages and the package-manager install roots are separate from these caches.

## Browser and application caches

Routine targets include the configured browser caches, Gradle version units, Cypress and Playwright binaries, and TypeScript watcher cache. A browser or build tool may need to rebuild or download removed material on its next use. The current Gradle distribution and current Android Studio version are kept by their own rules; an eligible old unit is removed whole so a half-deleted installation is not left behind.

The mode checks last access and modification before file-level pruning. An unreliable access-time filesystem prevents age-based pruning. `--purge-all` removes that age guard and requires a separate decision.

## Developer-tool data

The scan can show Android AVDs, Flutter pub cache, Flatpak user data and other large roots. **A path appearing in the scan is not a promise that `--all-safe` will remove it.** Read the mode-specific page and the dry-run output to see what a selected mode actually targets. Android emulators and installed Flatpak apps are not routine cache material.

## Editor extensions

`--editor-ext` considers superseded VS Code and Cursor extension versions. It requires a newer version and an idle old version; the current version is kept. See [Editor extensions](../modes/editor-extensions.md).

## Project and personal files — interactive only

Stale project `node_modules`, partial downloads and large stale personal-file candidates use separate interactive modes. `--yes` does not approve these modes. A partial download or a file in `~/Downloads` may be the only copy you have. Read each path and its consequence before confirming.

## System cleanup (requires sudo)

`--system` asks before its apt, journal, Snap, `/tmp` and page-cache steps. Its package-manager commands use `apt` and `dpkg`; they do not adapt to Fedora, Arch or openSUSE. The kernel step lists installed versions; it does not remove one directly. Journal vacuum uses a 100 MB target, and `/tmp` aging uses 7 days regardless of `--days`. Dropping page cache affects RAM, not disk space. See [System cleanup](../modes/system-cleanup.md) and [Distro support](../distro-support.md).

## What it refuses to delete

The guard refuses root and protected home paths such as `~/Documents`, `~/Pictures`, `~/.ssh`, `~/.config` and `~/.claude`. The exact list and its exceptions are in [Protected paths](../reference/protected-paths.md). `--self-test` checks selected refusal cases in the installed copy.

A real deletion has no undo. [Preview before deleting](./preview-first.md) explains the order to use before a cleanup.
