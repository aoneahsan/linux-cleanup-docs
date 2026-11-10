---
title: linux-cleanup
description: A Bash command-line utility that reclaims disk space on Linux by permanently deleting regenerable caches, behind a path allowlist, a staleness gate, and interactive confirmation.
tags: [linux, cleanup, disk-space, cli, bash, overview]
slug: /
sidebar_label: Introduction
sidebar_position: 1
---

# linux-cleanup

**linux-cleanup shows the paths before it removes regenerable caches on Linux.** It covers package-manager,
browser and build-tool caches, with separate modes for system work and personal-file candidates. Start with
a read-only scan or a dry run before choosing a real cleanup.

It is a **destructive tool**. Every deletion is permanent, and there is no undo. Its safety comes from
refusing to touch the wrong things in the first place, not from being able to put them back.

:::danger This tool deletes files permanently
There is no undo, Trash or backup step. A real cleanup permanently removes the selected files. Use
`--dry-run` to preview the chosen mode before you confirm it.

Read **[What it deletes](./safety/what-it-deletes.md)** and run
**[the read-only preview](./safety/preview-first.md)** before you let it remove anything.
:::

| | |
|---|---|
| **Package version** | 2.1.0 in the current source; check `linux-cleanup --version` for the installed copy |
| **Platform** | Linux only — `bash` ≥ 4 and GNU coreutils |
| **License** | [MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE) — since 1.4.0 |
| **Network access** | One public release-record request on start when online; installing or updating also uses npm or GitHub |
| **Author** | [Ahsan Mahmood](https://aoneahsan.com) · [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |

## Read this in order

This documentation is deliberately sequenced for a tool that erases data. The first three pages are the ones
that keep you out of trouble.

| Step | Page | Why |
|---|---|---|
| 1 | [What it deletes](./safety/what-it-deletes.md) | The complete target list, by category |
| 2 | [Preview before deleting](./safety/preview-first.md) | Read-only scan, then a dry run of the selected mode |
| 3 | [Safety guards](./safety/guards.md) | The four gates a path must clear before deletion |
| 4 | [Deletion is permanent](./safety/irreversibility.md) | What "no undo" means in practice |
| 5 | [Installation](./getting-started/installation.md) | `npx`, global `npm`, or `git clone` |
| 6 | [Quick start](./getting-started/quick-start.md) | Your first real cleanup |

## What it is good at

- **Showing the candidates.** A scan names cache roots and their current size. A dry run walks the selected
  cleanup and names proposed actions.
- **Not deleting the wrong thing.** A [path allowlist](./reference/protected-paths.md) hard-refuses
  `~/Documents`, `~/.ssh`, `~/.config`, `/etc` and friends, after symlink resolution.
- **Leaving recently-used files alone.** Since 1.2.0 the default is to *prune*, not wipe: within a cache,
  only files untouched for 100+ days are removed. See [the staleness gate](./safety/guards.md#guard-2--the-staleness-gate).
- **Recording the run.** The CLI keeps a local log. Guided walkthroughs write a
  [JSON session report](./reference/report-schema.md) unless disabled; dry runs do not.
- **Checking updates.** On start, the CLI reads a public release record over HTTPS when available.

## What it is not

Being clear about the boundaries is more useful than a feature list.

- **Not a backup tool.** It deletes; it never archives. Nothing it removes is recoverable from within the tool.
- **Not an undo tool.** [`--scan`](./modes/scan.md) reads only; `--dry-run` previews the selected cleanup;
  neither can recover files after a real run.
- **Not a security scanner.** It will not find secrets, malware, or vulnerabilities.
- **Not cross-platform.** Linux only. The npm package declares `"os": ["linux"]`.
- **Not fully cross-distro.** Cache cleanup inside `$HOME` works anywhere, but the
  [`--system` mode is Debian/Ubuntu only](./distro-support.md) — it calls `apt` and `dpkg` directly.
- **Not a substitute for your judgement.** Read what it proposes before you confirm it.

## The 30-second version

```bash
# 1. See what could be reclaimed. Deletes nothing.
npx linux-cleanup --scan

# 2. Preview the selected cleanup without deleting.
npx linux-cleanup --all-safe --dry-run

# 3. Run the guided walkthrough. Review each choice before deletion.
npx linux-cleanup
```

Step 3 is the default mode. It walks ten categories, asks before each one, shows a running total of bytes
reclaimed, and writes a report at the end. See [Walkthrough](./modes/walkthrough.md).

## Where to go next

- Want the space back fastest? → [Reclaim the most space](./guides/reclaim-the-most-space.md)
- Something went wrong? → [Recovery](./recovery.md) then [Troubleshooting](./troubleshooting.md)
- Want every flag? → [CLI flags](./reference/cli-flags.md)
- Wondering what changed? → [Changelog](./changelog.md)
