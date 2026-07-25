---
title: All-safe (batch)
description: Clean every regenerable cache in one pass. The mode built for cron and unattended maintenance, and the only mode --yes applies to.
tags: [all-safe, batch, cron, unattended, yes, modes]
sidebar_position: 6
---

# All-safe (batch)

**`--all-safe` cleans every regenerable cache in a single pass.** It is the mode for unattended maintenance
and the only mode `--yes` applies to.

```bash
linux-cleanup --all-safe        # prompts per target
linux-cleanup --all-safe -y     # no prompts — the cron form
```

## What "safe" means here

Safe means **regenerable**: package-manager caches, browser and application caches, and stale developer-tool
data. It does **not** mean risk-free, and it does not mean reversible — deletions are still
[permanent](../safety/irreversibility.md).

What `--all-safe` will never touch, regardless of `--yes`:

- Personal files in `~/Downloads`, `~/Desktop` or anywhere else
- Partial downloads
- `node_modules` directories
- Anything on the [protected-path list](../reference/protected-paths.md)
- Globally installed packages or shell-init files

Those categories are [interactive-only by design](../safety/guards.md#guard-3--personal-data-is-interactive-only)
and are simply not part of this mode. This is what makes `--all-safe -y` acceptable in a cron job.

Since 1.1.0 the mode also runs a **startup assertion** that aborts with a `BUG:` message if any protected
runtime directory ever leaks into its target list, so a future regression fails loudly rather than deleting
something it should not.

## `--yes` and its limits

`-y` / `--yes` auto-confirms cache deletions. It is only valid with `--all-safe`; the interactive modes
ignore it by policy.

```bash
linux-cleanup --all-safe -y
```

:::caution `-y` means you will not see the decisions until afterwards
Everything is still gated by the allowlist and the staleness gate, and the log and report record every path
touched — but you read them after the fact. For a first run, drop the `-y` and answer the prompts, or run
[`--scan`](./scan.md) first.
:::

## Pruning, and what survives

By default `--all-safe` prunes each target rather than wiping it: only files whose `atime` and `mtime` are
both older than `--days` (default 100) are removed. The summary reports bytes freed **and** bytes kept per
target, so you can see what survived.

```bash
linux-cleanup --all-safe -y            # 100-day threshold
linux-cleanup --all-safe -y -d 30      # more aggressive
linux-cleanup --all-safe -y --purge-all # gate off — full wipe
```

:::danger `--purge-all` in a cron job is a poor combination
Unattended plus no staleness gate means a Gradle wrapper distribution or Playwright browser bundle can
disappear the week before you need it, with nobody watching. Keep `--purge-all` for deliberate,
before-reimaging runs.
:::

## Running it weekly

```bash
linux-cleanup --install-cron
```

This schedules `--all-safe -y` for Sundays at 03:00 and appends output to `~/.linux-cleanup/logs/cron.log`.
See [Alias and cron](../guides/alias-and-cron.md) for the exact entry and how to remove it.

If you write the crontab entry yourself, use an **absolute path** — cron's minimal `PATH` will not find a
`~/.local/bin` install:

```bash
0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1
```

`--no-report` and `--cleanup-logs` keep an unattended job from accumulating files. Note that
`--cleanup-logs` only removes that run's log; **reports are never auto-deleted**, which is why `--no-report`
is the flag that actually keeps the directory small.

## Checking what a cron run did

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
jq '.totals' ~/.linux-cleanup/reports/report-*.json | tail -20
```

If the cron log shows `command not found`, the crontab is using a bare command name — see
[Troubleshooting](../troubleshooting.md#cron-entry-runs-but-does-nothing).

## When to use something else

| Situation | Better mode |
|---|---|
| First time on this machine | [`--scan`](./scan.md), then the [walkthrough](./walkthrough.md) |
| You want to see each decision | [Walkthrough](./walkthrough.md) |
| Only one category needs cleaning | [Menu](./menu.md) or [TUI](./tui.md) |
| You want to reclaim personal files too | [Stale personal files](./personal-stale-files.md), interactively |

## Next

- [Alias and cron](../guides/alias-and-cron.md) — scheduling it
- [Reclaim the most space](../guides/reclaim-the-most-space.md) — the aggressive path
- [Safety guards](../safety/guards.md) — what still applies under `-y`
