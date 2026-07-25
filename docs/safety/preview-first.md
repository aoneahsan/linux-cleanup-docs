---
title: Preview before deleting
description: linux-cleanup has no --dry-run flag. Use --scan, --list-targets and --self-test to see exactly what would be removed before anything is deleted.
tags: [safety, dry-run, scan, preview, read-only]
sidebar_position: 2
---

# Preview before deleting

**linux-cleanup has no `--dry-run` flag.** Previewing is done with three separate read-only modes. None of
them deletes anything, and running all three takes about a minute.

:::info Why there is no `--dry-run`
A `--dry-run` flag usually pairs with a destructive command that runs the same code path either way. Here
the read-only work is a genuinely different mode — [`--scan`](../modes/scan.md) walks and measures,
[`--list-targets`](#2---list-targets--what-it-could-ever-touch) enumerates configuration, neither shares a
code path with deletion.

The practical consequence: **adding `--dry-run` to a cleanup command does nothing and will not protect
you.** Unknown flags exit with code `2`, so the command simply fails — but do not rely on that as a
safety net. Use `--scan`.
:::

## The three preview commands

Run them in this order. Each answers a different question.

```bash
npx linux-cleanup --self-test      # Are the safety guards actually working?
npx linux-cleanup --list-targets   # What paths could this ever touch?
npx linux-cleanup --scan           # What would it reclaim on THIS machine, right now?
```

### 1. `--self-test` — are the guards working?

Verifies required dependencies, checks the syntax of every shell file, and asserts that the protection
logic returns the right answer for known paths: `/`, `$HOME`, `~/Documents`, `~/.ssh` and `/etc` must be
protected, while `~/.cache/yarn` must not be.

A single failed assertion aborts with a non-zero exit code. A clean run ends with a pass message.

This is the cheapest possible way to confirm the copy you downloaded behaves as documented. Run it after
every install or upgrade.

### 2. `--list-targets` — what it could ever touch

Prints every path the script is capable of targeting, grouped by category, plus the protected paths it
refuses. This is *configuration*, not a measurement — it does not stat your disk and does not care what
actually exists.

Use it to answer "is my `X` in scope?" without running anything.

### 3. `--scan` — what would be reclaimed here

The one that matters most. `--scan` walks every category, measures real sizes on your machine, and prints
what each would reclaim. It writes a [JSON report](../reference/report-schema.md) and deletes nothing.

```bash
npx linux-cleanup --scan
```

Typical output on a developer laptop:

| Category | Typical range |
|---|---|
| Yarn + npm + pnpm caches | 5–25 GB |
| Browser profile caches | 2–8 GB |
| `~/.gradle/caches` | 3–10 GB |
| Cypress + Playwright binaries | 1–4 GB |
| Android emulator images | 6–30 GB |
| Stale `node_modules` | 5–50 GB |

:::warning A scan is a snapshot, not a promise
The numbers are what exists at scan time. By the time you run the real cleanup, the staleness gate may
exclude files that a running build has just touched — so the amount actually reclaimed is often **lower**
than the scan suggested. That is the gate doing its job.
:::

## Reading a scan before acting on it

Three things are worth checking in the output:

1. **Anything under a path you did not expect.** If a cache lives behind a symlink into a directory you
   care about, this is where you see it. Investigate with `realpath` before proceeding.
2. **Anything in the Expensive column.** Gradle wrapper distributions, Cypress and Playwright binaries,
   and Android AVDs cost real time to re-download. See
   [What it deletes](./what-it-deletes.md#browser-and-application-caches).
3. **The personal-file candidates.** These are the only entries that can be irreplaceable. Read every one.

## Previewing a single category

Several modes are read-only in their own right and can be run individually:

| Command | Shows | Deletes |
|---|---|---|
| [`--scan`](../modes/scan.md) | Every cache category with sizes | Never |
| [`--audit`](../modes/home-audit.md) | The 20 largest entries in `$HOME` | Never |
| [`--globals`](../modes/globals-audit.md) | Global npm/pnpm/yarn/bun/deno packages | Never |
| [`--list-targets`](#2---list-targets--what-it-could-ever-touch) | Every targetable path | Never |
| [`--self-test`](#1---self-test--are-the-guards-working) | Dependency and guard checks | Never |

The interactive modes — [`--node-modules`](../modes/node-modules-finder.md),
[`--stale`](../modes/personal-stale-files.md), [`--partials`](../modes/partial-downloads.md) — print their
full candidate list *before* asking for confirmation, so they double as a preview if you answer no to
everything. Nothing is removed until you say yes.

## Then run the real thing, carefully

When the scan looks right, the safest first run is the guided walkthrough with no flags:

```bash
npx linux-cleanup
```

It asks before every step and before every target. Answer `n` to anything that surprises you, `s` to skip
a whole step, or `q` to quit — partial progress is kept in the log and report.

:::danger Do not start with `--all-safe -y`
`--all-safe -y` skips every confirmation for regenerable caches. It is the right tool for a weekly cron job
on a machine you already trust. It is the wrong way to meet this tool for the first time, because you will
not see what it decided until it is finished.
:::

## Next

- [Safety guards](./guards.md) — what stops a bad deletion
- [Scan mode](../modes/scan.md) — the full read-only reference
- [Quick start](../getting-started/quick-start.md) — the guided first run
