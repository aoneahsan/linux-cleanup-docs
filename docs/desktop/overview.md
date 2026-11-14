---
sidebar_position: 1
title: The desktop app
description: What the linux-cleanup desktop app is, how it runs the CLI, and what it sends off your computer.
---

# The desktop app

The desktop app is linux-cleanup in a window. It bundles the same CLI this site documents and runs
one mode through it: the [all-safe cleanup](../modes/all-safe.md), first as a dry run, then as a real
run when you confirm. Every rule about what is removed and what is refused belongs to the CLI; the app
shows those decisions and never edits them.

## How it runs the CLI

The app starts the bundled `cleanup.sh` with one of exactly two argument lists and reads its
[`--json-events`](../reference/json-events.md) stream:

| You press | The app runs |
|---|---|
| Start a dry run | `--all-safe --yes --dry-run --json-events` |
| Run the cleanup now | `--all-safe --yes --json-events` |

Reports and logs go to `~/.linux-cleanup/reports/` and `~/.linux-cleanup/logs/`, the same folders an
`npx linux-cleanup` run uses, so the app and the terminal share one history.

The bundled copy skips the CLI's own update check (`LINUX_CLEANUP_LAUNCHER=desktop`). The app checks
for its own updates instead; see [Install and update](./install.md).

## What leaves your computer

| Data | Leaves the computer? |
|---|---|
| File and folder paths, file names | Never |
| Step results, sizes, free space before and after, the distribution name | Only when you sign in, as numbers |
| Which screens open and which actions run | Counted with Google Analytics and Amplitude, without paths, names or your email |

Signing in is optional. Signed out, dry runs, real runs, receipts and schedules all work on this
computer; the monthly real-run allowance is counted per computer.

## Removal is permanent

A real run removes files the way the CLI does: permanently, with no copy kept. The app asks for a
recent dry run before a real run, and the confirm screen says this in plain words before anything runs.
