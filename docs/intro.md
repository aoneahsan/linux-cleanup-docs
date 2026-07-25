---
title: linux-cleanup
description: A Bash command-line utility that reclaims disk space on Linux by permanently deleting regenerable caches, behind a path allowlist, a staleness gate, and interactive confirmation.
tags: [linux, cleanup, disk-space, cli, bash, overview]
slug: /
sidebar_label: Introduction
sidebar_position: 1
---

# linux-cleanup

**linux-cleanup is a Bash command-line utility that reclaims disk space on Linux by deleting regenerable
caches** — package-manager caches, browser caches, build-tool caches, unused Android emulator images, stale
`node_modules` directories, and system journals. It is aimed at developer machines, where tens of gigabytes
of this material accumulates without anyone noticing.

It is a **destructive tool**. Every deletion is permanent, and there is no undo. Its safety comes from
refusing to touch the wrong things in the first place, not from being able to put them back.

:::danger This tool deletes files permanently
There is no undo, no trash, no backup step, and no `--dry-run` flag. Deleted data is gone unless you have
your own backup.

Read **[What it deletes](./safety/what-it-deletes.md)** and run
**[the read-only preview](./safety/preview-first.md)** before you let it remove anything.
:::

| | |
|---|---|
| **Documented version** | 1.4.0 (source) · **1.3.1** is the current npm `latest` |
| **Platform** | Linux only — `bash` ≥ 4 and GNU coreutils |
| **License** | [MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE) — since 1.4.0 |
| **Network access** | None. Zero calls, no telemetry, no update check |
| **Author** | [Ahsan Mahmood](https://aoneahsan.com) · [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |

## Read this in order

This documentation is deliberately sequenced for a tool that erases data. The first three pages are the ones
that keep you out of trouble.

| Step | Page | Why |
|---|---|---|
| 1 | [What it deletes](./safety/what-it-deletes.md) | The complete target list, by category |
| 2 | [Preview before deleting](./safety/preview-first.md) | Three read-only commands that show you the outcome first |
| 3 | [Safety guards](./safety/guards.md) | The four gates a path must clear before deletion |
| 4 | [Deletion is permanent](./safety/irreversibility.md) | What "no undo" means in practice |
| 5 | [Installation](./getting-started/installation.md) | `npx`, global `npm`, or `git clone` |
| 6 | [Quick start](./getting-started/quick-start.md) | Your first real cleanup |

## What it is good at

- **Finding the big, boring wins.** Yarn, npm and pnpm caches routinely hold 10–30 GB on a machine that
  has been building projects for a year.
- **Not deleting the wrong thing.** A [path allowlist](./reference/protected-paths.md) hard-refuses
  `~/Documents`, `~/.ssh`, `~/.config`, `/etc` and friends, after symlink resolution.
- **Leaving recently-used files alone.** Since 1.2.0 the default is to *prune*, not wipe: within a cache,
  only files untouched for 100+ days are removed. See [the staleness gate](./safety/guards.md#guard-2--the-staleness-gate).
- **Telling you what it did.** Every session writes a [JSON report](./reference/report-schema.md) and a
  log naming every path it touched.
- **Staying offline.** No network code path exists. Nothing leaves your machine unless you email it.

## What it is not

Being clear about the boundaries is more useful than a feature list.

- **Not a backup tool.** It deletes; it never archives. Nothing it removes is recoverable from within the tool.
- **Not a dry-run-first tool.** There is no `--dry-run` flag. The read-only mode is a separate command,
  [`--scan`](./modes/scan.md), and it is on you to run it.
- **Not a security scanner.** It will not find secrets, malware, or vulnerabilities.
- **Not cross-platform.** Linux only. The npm package declares `"os": ["linux"]`.
- **Not fully cross-distro.** Cache cleanup inside `$HOME` works anywhere, but the
  [`--system` mode is Debian/Ubuntu only](./distro-support.md) — it calls `apt` and `dpkg` directly.
- **Not a substitute for your judgement.** Read what it proposes before you confirm it.

## The 30-second version

```bash
# 1. See what could be reclaimed. Deletes nothing.
npx linux-cleanup --scan

# 2. See exactly which paths are eligible, and which are refused outright.
npx linux-cleanup --list-targets

# 3. Run the guided walkthrough. Every step asks before it deletes.
npx linux-cleanup
```

Step 3 is the default mode. It walks ten categories, asks before each one, shows a running total of bytes
reclaimed, and writes a report at the end. See [Walkthrough](./modes/walkthrough.md).

## Where to go next

- Want the space back fastest? → [Reclaim the most space](./guides/reclaim-the-most-space.md)
- Something went wrong? → [Recovery](./recovery.md) then [Troubleshooting](./troubleshooting.md)
- Want every flag? → [CLI flags](./reference/cli-flags.md)
- Wondering what changed? → [Changelog](./changelog.md)
