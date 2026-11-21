---
title: Quick start
description: Run your first linux-cleanup session in about ten minutes — verify the guards, audit read-only, then run the guided walkthrough and read the report.
tags: [quick-start, tutorial, walkthrough, first-run, scan]
sidebar_position: 3
---

# Quick start

**Verify the guards, inspect the scan, and preview the selected mode before deleting.** Space recovered depends
on the paths and files on this machine.

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

`--scan` is read-only. It lists cache roots and their current sizes, along with other candidates and system
observations. It does not delete or write a JSON session report.

Read the paths before continuing. A cache root's size is not a claim that the whole directory is eligible
for removal. Check any unexpected path and each personal-file candidate separately.

## Step 3 — Preview the cleanup

```bash
npx linux-cleanup --all-safe --dry-run
```

This walks the all-safe cache mode without deleting files or changing settings. Read the proposed actions,
then choose whether to run it. A real deletion has no undo.

## Step 4 — Run the guided walkthrough

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

`Ctrl-C` stops the walkthrough with code `130`. Any earlier deletion remains permanent. Read the log to see
which steps ran before the interruption.

## Step 5 — Read the report

The session ends with a summary naming its log and, when generated, its report. Read the named paths from
your own run rather than assuming a fixed location for every install method.

The guided walkthrough writes a JSON report unless you pass `--no-report` or `--dry-run`. To convert an
existing report for reading or archiving, install `jq` and run:

```bash
linux-cleanup --export both latest   # Markdown + HTML beside the JSON
linux-cleanup --reports              # interactive reports manager
```

See [Reports](../modes/reports.md).

## Step 6 — Automate it, once you trust it

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
