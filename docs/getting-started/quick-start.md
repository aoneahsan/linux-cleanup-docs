---
title: Quick start
description: Run your first linux-cleanup session in about ten minutes — verify the guards, audit read-only, then run the guided walkthrough and read the report.
tags: [quick-start, tutorial, walkthrough, first-run, scan]
sidebar_position: 3
---

# Quick start

**A first session takes about ten minutes and typically reclaims 5–30 GB on a developer machine.** This page
walks it end to end: verify, preview, run guided, read the report.

:::caution Do not skip steps 1 and 2
They take two minutes and they are the difference between a cleanup you controlled and one you discovered
afterwards. This tool [deletes permanently](../safety/irreversibility.md).
:::

## Step 1 — Verify the install

```bash
npx linux-cleanup --version
npx linux-cleanup --self-test
```

`--version` confirms which build you have. `--self-test` checks dependencies, shell syntax, and asserts the
safety guards actually fire. A clean run ends with a pass message; any failed assertion exits non-zero and
you should stop there.

## Step 2 — Audit, deleting nothing

```bash
npx linux-cleanup --scan
```

`--scan` is read-only. It walks every category, measures real sizes, prints what could be reclaimed, and
writes a [JSON report](../reference/report-schema.md). Nothing is deleted.

Read the output before continuing. Common findings on a developer laptop:

| Category | Typical size |
|---|---|
| `~/.cache/yarn` + `~/.npm` + pnpm store | 5–25 GB |
| Chrome / Brave / Firefox profile caches | 2–8 GB |
| `~/.gradle/caches` | 3–10 GB |
| Cypress + Playwright browser binaries | 1–4 GB |
| `~/.android/avd` (emulator images) | 6–30 GB |
| Stale `node_modules` in old projects | 5–50 GB |

Two things to look for specifically: any path you did not expect (a symlinked cache, for instance), and any
personal-file candidate — those are the only entries that can be irreplaceable.

## Step 3 — Run the guided walkthrough

```bash
npx linux-cleanup
```

No flags means the [guided walkthrough](../modes/walkthrough.md): ten steps, each asking before it does
anything, with a running total of bytes reclaimed.

At each step you get three choices:

| Key | Effect |
|---|---|
| `a` | Run this step (the default — pressing Enter chooses it) |
| `s` | Skip this step |
| `q` | Quit the walkthrough now |

Inside a step, individual targets get their own `[Y/n]` confirmation. So there are two levels: skip a whole
category, or accept the category and decline specific items.

The ten steps, in order:

1. Package-manager caches
2. Application caches
3. Developer-tool data
4. Editor old extensions
5. Stale `node_modules`
6. Partial / orphan downloads
7. Personal stale files
8. System cleanup (sudo)
9. Final size audit
10. Generate readable report

:::tip Steps 6 and 7 are the ones to slow down on
Everything before them is regenerable. Partial downloads and personal stale files are not — read each
candidate rather than accepting the batch. Skip both with `s` on a first run if you would rather review them
separately later.
:::

Aborting with `Ctrl-C` is safe at any point. The current removal finishes, the script exits with code `130`,
and partial progress is preserved in the log.

## Step 4 — Read the report

The session ends with a summary naming the log and report files:

```text
✓ Recovered: 18.7 GB
ℹ Log saved: ~/.linux-cleanup/logs/cleanup-2026-05-10_140312.log
ℹ Report:    ~/.linux-cleanup/reports/report-2026-05-10_140312.json
```

The JSON report is canonical and always written. To convert it for reading or archiving — this needs `jq`:

```bash
linux-cleanup --export both latest   # Markdown + HTML beside the JSON
linux-cleanup --reports              # interactive reports manager
```

See [Reports](../modes/reports.md).

## Step 5 — Automate it, once you trust it

Only after a manual run you were happy with:

```bash
linux-cleanup --install-alias   # type `cleanup` from anywhere
linux-cleanup --install-cron    # weekly --all-safe -y, Sundays at 03:00
```

The cron job runs `--all-safe -y`, which auto-confirms **regenerable caches only**. It cannot touch personal
files — [`--yes` is ignored by those modes](../safety/guards.md#guard-3--personal-data-is-interactive-only).

See [Alias and cron](../guides/alias-and-cron.md) for exactly what each writes and how to remove it.

## What you now know

| Concept | Read more |
|---|---|
| Read-only modes never delete | [Preview before deleting](../safety/preview-first.md) |
| The walkthrough asks before every step | [Walkthrough](../modes/walkthrough.md) |
| The allowlist refuses Documents, `.ssh`, `.config` | [Safety guards](../safety/guards.md) |
| Only files idle 100+ days are pruned by default | [The staleness gate](../safety/guards.md#guard-2--the-staleness-gate) |
| Personal-data modes are interactive only | [Stale personal files](../modes/personal-stale-files.md) |
| Nothing is recoverable from the tool | [Deletion is permanent](../safety/irreversibility.md) |

## Common follow-ups

- **"I want more space."** → [Reclaim the most space](../guides/reclaim-the-most-space.md)
- **"Something broke."** → [Troubleshooting](../troubleshooting.md)
- **"It deleted something I wanted."** → [Recovery](../recovery.md)
- **"What are all the flags?"** → [CLI flags](../reference/cli-flags.md)
