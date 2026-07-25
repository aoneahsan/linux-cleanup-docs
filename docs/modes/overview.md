---
title: Modes overview
description: All linux-cleanup modes grouped by what they do — read-only inspection, guided and batch cleanup, interactive personal-data modes, and output and repair helpers.
tags: [modes, overview, cli, reference]
sidebar_position: 1
---

# Modes overview

**linux-cleanup has one entry point and picks its mode from a single flag.** Running it with no flag gives
you the [guided walkthrough](./walkthrough.md).

Modes are mutually exclusive — pass one. Options like `--days` and `--yes` combine with them.

## Read-only — never deletes anything

Safe to run at any time, on any machine, without thinking about it.

| Mode | Flag | Shows |
|---|---|---|
| [Scan](./scan.md) | `-s` `--scan` | Every cache category with current sizes |
| [Home audit](./home-audit.md) | `--audit` | The 20 largest entries in `$HOME` |
| [Globals audit](./globals-audit.md) | `--globals` | Global npm/pnpm/yarn/bun/deno packages |
| List targets | `--list-targets` | Every path the tool can touch, plus the protected list |
| Self-test | `--self-test` | Dependency, syntax and safety-guard checks |
| Version | `-V` `--version` | Version and author |

## Cleanup — regenerable data

These delete, and every one of them asks first unless you pass `--yes`.

| Mode | Flag | Behaviour |
|---|---|---|
| [Walkthrough](./walkthrough.md) | _(default)_ `-w` | Ten guided steps, prompt before each |
| [Menu](./menu.md) | `-m` `--menu` | Numbered menu — pick one category |
| [TUI](./tui.md) | `-t` `--tui` | The same, as a whiptail/dialog dialog |
| [All-safe](./all-safe.md) | `-a` `--all-safe` | Every regenerable cache in one pass |
| [Editor extensions](./editor-extensions.md) | `--editor-ext` | Superseded VS Code / Cursor versions |
| [System cleanup](./system-cleanup.md) | `--system` | apt, journal, snap, `/tmp`, page cache — needs `sudo` |

## Cleanup — interactive only

Personal or project data. These **ignore `--yes`** and require per-entry confirmation. See
[Guard 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

| Mode | Flag | Finds |
|---|---|---|
| [Stale personal files](./personal-stale-files.md) | `-p` `--stale` | Large idle files in `~/Downloads`, `~/Desktop` |
| [Partial downloads](./partial-downloads.md) | `--partials` | `.fdmdownload`, `.crdownload`, `.part` |
| [node_modules finder](./node-modules-finder.md) | `--node-modules` | Project dependency dirs idle N+ days |

## Output, repair and setup

| Mode | Flag | Purpose |
|---|---|---|
| [Reports](./reports.md) | `--reports` | List, convert, view past session reports |
| [Export](./reports.md#exporting) | `--export FMT ID` | Non-interactive conversion |
| [Doctor](./doctor.md) | `--doctor` | Repair broken shell-init for nvm, pnpm, bun, deno, cargo |
| Feedback | `--feedback` | Bug-report instructions, optional mailto draft |
| Debug bundle | `--debug-bundle` | Package latest log + report into a tar.gz |
| Install alias | `--install-alias` | Add a `cleanup` shell alias |
| Install cron | `--install-cron` | Weekly `--all-safe -y`, Sundays 03:00 |
| Uninstall alias / cron | `--uninstall-alias` `--uninstall-cron` | Remove either |

## Choosing a mode

| Goal | Mode |
|---|---|
| First time using the tool | `--self-test`, then `--scan`, then no flag |
| Free space now, with control | _(default walkthrough)_ |
| Free space now, no prompts | `--all-safe -y` |
| One specific category | `--menu` or `--tui` |
| Weekly unattended maintenance | `--all-safe -y` via `--install-cron` |
| Maximum reclaim before reimaging | `--all-safe -y --purge-all` |
| Find what is eating the disk | `--audit` then `--scan` |
| Old side projects piling up | `--node-modules` |
| `command not found` after install | `--doctor` |

## Options that combine with modes

| Option | Default | Effect |
|---|---|---|
| `-d N` `--days N` | 100 | Staleness threshold. Lower is more aggressive |
| `--purge-all` | off | Disables the staleness gate — full wipe |
| `-y` `--yes` | off | Auto-confirm regenerable caches. Only with `--all-safe` |
| `--no-report` | off | Skip the JSON report. Logs still written |
| `--cleanup-logs` | off | Delete this run's log at the end. Reports always kept |
| `--no-color` | off | Disable ANSI colour. `NO_COLOR` also honoured |

Full detail: [CLI flags](../reference/cli-flags.md) and the
[modes matrix](../reference/modes-matrix.md).
