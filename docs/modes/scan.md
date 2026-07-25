---
title: Scan (read-only)
description: The read-only linux-cleanup mode that measures every cleanup category and reports what could be reclaimed, without deleting anything.
tags: [scan, read-only, audit, preview, modes]
sidebar_position: 3
---

# Scan (read-only)

**`--scan` walks every cleanup category, measures what is there, and prints what could be reclaimed. It
deletes nothing.** This is the closest thing the tool has to a dry run, and it is the command to reach for
first.

```bash
linux-cleanup --scan     # or: -s
```

## What it does

For each category — package-manager caches, application caches, developer-tool data, editor extensions,
`node_modules`, partial downloads, personal candidates — it stats the paths, sums the sizes, and prints a
per-category breakdown with a total.

It also writes a [JSON report](../reference/report-schema.md) to `~/.linux-cleanup/reports/`, so you have a
timestamped record of what the disk looked like before you changed anything.

`--scan` is safe to run:

- On a machine you have never run the tool on
- On someone else's machine
- From a cron job, purely to record a baseline
- While other work is in progress

The only side effects are the log and the report.

## Reading the output

Three things deserve attention.

**Unexpected paths.** If a cache appears somewhere you did not expect, investigate before cleaning. The
usual cause is a symlink. Resolve it yourself:

```bash
realpath ~/.cache/yarn
```

The [allowlist](../safety/guards.md#guard-1--the-path-allowlist) resolves symlinks too and will refuse a
target that lands inside a protected directory — but knowing about it beforehand is better than being
surprised by a refusal message.

**Expensive categories.** Gradle wrapper distributions, Cypress and Playwright binaries, and Android AVDs
cost minutes and hundreds of megabytes to re-fetch. See
[What it deletes](../safety/what-it-deletes.md#browser-and-application-caches).

**Personal-file candidates.** The only entries that can be irreplaceable. Read every one.

## Scan numbers are an upper bound

The reclaim figure is what exists at scan time, before the
[staleness gate](../safety/guards.md#guard-2--the-staleness-gate) is applied at deletion time.

So the actual cleanup usually frees **less** than the scan suggested, because files touched within the
threshold are kept. The gap between the two numbers is the gate protecting recently-used data — it is the
tool working correctly, not an inconsistency.

To see how much the gate is holding back, compare:

```bash
linux-cleanup --scan             # everything present
linux-cleanup --scan -d 1        # what a 1-day threshold would consider stale
```

## Speed

The first scan on a large `$HOME` can take one to three minutes, dominated by `find` walking thousands of
`node_modules` directories. Subsequent runs are faster because the kernel caches directory metadata.

If it seems stuck, watch the log rather than the terminal:

```bash
tail -f ~/.linux-cleanup/logs/cleanup-*.log
```

New lines every five to ten seconds means it is working. See
[Troubleshooting](../troubleshooting.md#scan-or---node-modules-seems-to-hang).

## Scripting a scan

```bash
NO_COLOR=1 linux-cleanup --scan --no-report > /tmp/scan.log
```

`--no-report` skips JSON generation when you only want the log. Exit code `0` means the scan completed; see
[Exit codes](../reference/exit-codes.md).

To query a report programmatically, use the JSON rather than parsing terminal output:

```bash
jq '.totals' ~/.linux-cleanup/reports/report-*.json | tail -20
```

## The other read-only modes

| Mode | Answers |
|---|---|
| `--scan` | What could be reclaimed here, right now |
| [`--list-targets`](../safety/preview-first.md#2---list-targets--what-it-could-ever-touch) | What paths could ever be touched |
| [`--audit`](./home-audit.md) | What is largest in `$HOME`, cleanable or not |
| [`--globals`](./globals-audit.md) | Which global packages are unused |
| `--self-test` | Whether the safety guards work |

`--audit` is worth pairing with `--scan`: the scan only knows about categories the tool cleans, while the
audit shows the largest things in your home directory whether or not this tool can help with them. A 60 GB
VM image will show in the audit and never in the scan.

## Next

- [Preview before deleting](../safety/preview-first.md) — the full preview workflow
- [Walkthrough](./walkthrough.md) — the guided cleanup after scanning
- [Home audit](./home-audit.md) — what is big, regardless of cleanability
