---
title: Modes matrix
description: Every linux-cleanup mode side by side — whether it deletes, whether it is interactive, whether it uses sudo, and whether it writes a session record.
tags: [modes, matrix, reference, comparison]
sidebar_position: 2
---

# Modes matrix

Every mode at a glance. Use this to answer "will this delete anything?" without reading a whole page.

## The matrix

| Mode | Flag | Deletes | Interactive | sudo | Writes record |
|---|---|---|---|---|---|
| [Walkthrough](../modes/walkthrough.md) | _(none)_ `-w` | Yes | Yes | Step 8 only | Yes |
| [Menu](../modes/menu.md) | `-m` | Yes | Yes | If chosen | No |
| [TUI](../modes/tui.md) | `-t` | Yes | Yes | If chosen | No |
| [All-safe](../modes/all-safe.md) | `-a` | Yes | Unless `-y` | No | No |
| [Scan](../modes/scan.md) | `-s` | **No** | No | No | No |
| [Stale personal](../modes/personal-stale-files.md) | `-p` | Yes | **Always** | No | No |
| [System](../modes/system-cleanup.md) | `--system` | Yes | Yes | **Yes** | No |
| [Partials](../modes/partial-downloads.md) | `--partials` | Yes | **Always** | No | No |
| [Home audit](../modes/home-audit.md) | `--audit` | **No** | No | No | No |
| [node_modules](../modes/node-modules-finder.md) | `--node-modules` | Yes | **Always** | No | No |
| [Globals audit](../modes/globals-audit.md) | `--globals` | **No** | No | No | No |
| [Doctor](../modes/doctor.md) | `--doctor` | **No** — appends only | Yes | No | No |
| [Editor extensions](../modes/editor-extensions.md) | `--editor-ext` | Yes | Yes | No | No |
| [Speed](../modes/speed.md) | `--speed` | No file deletion; optional settings | Yes | No | No |
| [Reports](../modes/reports.md) | `--reports` | Records only | Yes | No | No |
| Export | `--export` | **No** | No | No | No |
| Feedback | `--feedback` | **No** | Yes | No | No |
| Debug bundle | `--debug-bundle` | **No** | No | No | No |
| List targets | `--list-targets` | **No** | No | No | No |
| Self-test | `--self-test` | **No** | No | No | No |
| Version | `-V` | **No** | No | No | No |
| Install alias | `--install-alias` | **No** | Yes | No | No |
| Install cron | `--install-cron` | **No** | Yes | No | No |
| Refresh desktop app | `--refresh-app` | Updates app from release | Yes | No | No |
| Uninstall alias | `--uninstall-alias` | Alias line | Yes | No | No |
| Uninstall cron | `--uninstall-cron` | Cron line | Yes | No | No |

## Modes that never delete anything

These commands do not delete cleanup targets. Some write local logs, reports, exports, or diagnostic bundles:

`--scan` · `--audit` · `--globals` · `--list-targets` · `--self-test` · `--version` · `--export` ·
`--feedback` · `--debug-bundle`

`--doctor` belongs here too with a caveat: it modifies your shell configuration, but only by **appending**
after confirmation. It never removes or rewrites an existing line.

## Modes `--yes` affects

Exactly one: [`--all-safe`](../modes/all-safe.md).

The interactive-data modes — `--stale`, `--partials`, `--node-modules` — require their own confirmations.
See [Guard 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

## Modes the staleness gate applies to

| Applies | Does not apply |
|---|---|
| Cache pruning in walkthrough, menu, TUI, all-safe | `--system` (uses its own hardcoded 7-day `/tmp` rule) |
| `--editor-ext` supersession | `--partials` (age is not the criterion) |
| `--node-modules` | Read-only modes (nothing is deleted) |
| `--stale` | |
| Developer-tool data (AVDs, flatpak, pub-cache) | |

`--purge-all` disables the gate wherever it would otherwise apply.

## Which modes need optional dependencies

| Mode | Needs | Without it |
|---|---|---|
| `--tui` | `whiptail` or `dialog` | Falls back to `--menu` with an install hint |
| `--export`, `--reports` conversion | `jq` | JSON still written; conversion unavailable |
| `--install-cron` | `crontab` | Cannot run |
| `--system` snap step | `snap` | Step skipped cleanly |
| `--system` apt steps | `apt`, `dpkg` | **Fails** — [Debian/Ubuntu only](../distro-support.md) |

## Next

- [CLI flags](./cli-flags.md) — every flag in detail
- [Modes overview](../modes/overview.md) — grouped by purpose
