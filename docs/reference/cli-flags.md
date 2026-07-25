---
title: CLI flags
description: Every linux-cleanup command-line flag — modes, options, aliases and defaults — with what each one does and where it is documented in full.
tags: [cli, flags, reference, options, commands]
sidebar_position: 1
---

# CLI flags

**Every flag linux-cleanup accepts.** Modes are mutually exclusive — pass one. Options combine with any
mode.

```bash
linux-cleanup --help    # the same list, with your machine's real paths inlined
```

An unrecognised flag prints the help text and exits with code `2`.

## Modes

Pass at most one. With none, you get the [walkthrough](../modes/walkthrough.md).

| Flag | Aliases | Does | Full page |
|---|---|---|---|
| _(none)_ | `-w` `--walkthrough` | Ten guided steps, prompting before each | [Walkthrough](../modes/walkthrough.md) |
| `-m` | `--menu` `-i` `--interactive` | Numbered jump-to menu | [Menu](../modes/menu.md) |
| `-t` | `--tui` `-g` `--gui` | Visual whiptail / dialog menu | [TUI](../modes/tui.md) |
| `-a` | `--all-safe` | Batch clean every regenerable cache | [All-safe](../modes/all-safe.md) |
| `-s` | `--scan` | Read-only audit of every category | [Scan](../modes/scan.md) |
| `-p` | `--stale` | Large idle personal files (interactive) | [Stale personal files](../modes/personal-stale-files.md) |
| | `--system` | apt, journal, snap, `/tmp`, page cache (sudo) | [System cleanup](../modes/system-cleanup.md) |
| | `--partials` | Orphaned partial downloads (interactive) | [Partial downloads](../modes/partial-downloads.md) |
| | `--audit` | 20 largest entries in `$HOME` | [Home audit](../modes/home-audit.md) |
| | `--node-modules` | Stale `node_modules` (interactive) | [node_modules finder](../modes/node-modules-finder.md) |
| | `--globals` | Read-only global-package audit | [Globals audit](../modes/globals-audit.md) |
| | `--doctor` | Repair missing shell-init for runtimes | [Doctor](../modes/doctor.md) |
| | `--editor-ext` | Superseded VS Code / Cursor versions | [Editor extensions](../modes/editor-extensions.md) |
| | `--reports` | Interactive session-record manager | [Reports](../modes/reports.md) |
| | `--export FMT ID` | Non-interactive record conversion | [Reports](../modes/reports.md#exporting) |
| | `--feedback` | Bug-report instructions, optional mailto draft | [Send a bug report](../guides/send-a-bug-report.md) |
| | `--debug-bundle` | Package latest log + record into a tar.gz | [Send a bug report](../guides/send-a-bug-report.md) |
| | `--list-targets` | Print every targetable and protected path | [Preview first](../safety/preview-first.md) |
| | `--self-test` | Dependency, syntax and safety-guard checks | [Preview first](../safety/preview-first.md) |
| `-V` | `--version` | Version and author | — |
| | `--install-alias` | Add a `cleanup` shell alias | [Alias and cron](../guides/alias-and-cron.md) |
| | `--install-cron` | Weekly `--all-safe -y`, Sundays 03:00 | [Alias and cron](../guides/alias-and-cron.md) |
| | `--uninstall-alias` | Remove the alias | [Uninstall](../guides/uninstall.md) |
| | `--uninstall-cron` | Remove the cron entry | [Uninstall](../guides/uninstall.md) |

## Options

| Flag | Default | Effect |
|---|---|---|
| `-d N` `--days N` | `100` | Staleness threshold. A file is eligible only when **both** `atime` and `mtime` exceed it. Lower is more aggressive |
| `--purge-all` | off | **Disables the staleness gate.** Cache targets are wiped in full — pre-1.2.0 behaviour |
| `-y` `--yes` | off | Auto-confirm regenerable caches. Valid only with `--all-safe`. **Personal modes ignore it** |
| `--no-report` | off | Skip JSON generation. Logs are still written |
| `--cleanup-logs` | off | Delete this run's log at the end. **Records are always kept** |
| `--no-color` | off | Disable ANSI colour. `NO_COLOR` is honoured too |
| `-h` `--help` | — | Print help and exit |

:::danger `--purge-all` removes a safety guard
It turns off the [staleness gate](../safety/guards.md#guard-2--the-staleness-gate), so caches are wiped
whole regardless of when they were last used. Expensive assets — Gradle wrapper distributions, Playwright
browsers, Cypress binaries — go with them. The pre-run banner states which strategy is active.
:::

:::note There is no `--dry-run`
Read-only inspection is a separate mode: [`--scan`](../modes/scan.md). Adding `--dry-run` to a destructive
command does not make it safe — it exits with code `2` for an unknown flag. See
[Preview before deleting](../safety/preview-first.md).
:::

## Recipes

| Goal | Command |
|---|---|
| Verify the install | `linux-cleanup --self-test` |
| See what is reclaimable | `linux-cleanup --scan` |
| See every path it can touch | `linux-cleanup --list-targets` |
| Guided cleanup | `linux-cleanup` |
| One-shot batch, no prompts | `linux-cleanup --all-safe -y` |
| Aggressive sweep | `linux-cleanup --all-safe -y -d 30` |
| Maximum reclaim before reimaging | `linux-cleanup --all-safe -y --purge-all` |
| Visual menu | `linux-cleanup --tui` |
| Old project dependency dirs | `linux-cleanup --node-modules -d 90` |
| System maintenance | `linux-cleanup --system` |
| Weekly automation | `linux-cleanup --install-cron` |
| Convert the newest record to HTML | `linux-cleanup --export html latest` |
| File a bug | `linux-cleanup --debug-bundle && linux-cleanup --feedback` |

## Environment variables

Most-used, with the [full list](./environment-variables.md) separately:

| Variable | Effect |
|---|---|
| `NO_COLOR` | Any non-empty value disables colour |
| `LINUX_CLEANUP_LOG_DIR` | Override the log directory |
| `LINUX_CLEANUP_REPORTS_DIR` | Override the session-record directory |
| `LINUX_CLEANUP_DATA_HOME` | Parent for logs, records and feedback bundles |

## Exit codes

| Code | Meaning |
|---|---|
| `0` | Clean run |
| `2` | Argument parse error |
| `130` | Aborted with `Ctrl-C` |
| `143` | Terminated by `SIGTERM` |
| other | Unexpected — writes a crash bundle |

Full table and the crash-trap logic: [Exit codes](./exit-codes.md).
