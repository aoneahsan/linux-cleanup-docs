---
title: Stale personal files
description: The interactive-only mode that finds large, long-unused files in ~/Downloads and ~/Desktop. The only linux-cleanup mode that can delete something irreplaceable.
tags: [personal, downloads, desktop, interactive, stale, modes]
sidebar_position: 9
---

# Stale personal files

**`--stale` finds files over about 10 MB in `~/Downloads` and `~/Desktop` that have been unused for `--days`
or more, and offers them for deletion one at a time.**

```bash
linux-cleanup --stale         # or: -p
linux-cleanup --stale -d 180  # only files idle 180+ days
```

:::danger This is the only mode that can delete something irreplaceable
Every other category holds data some program can rebuild. `~/Downloads` and `~/Desktop` hold whatever you
put there — including, sometimes, the only copy of something that matters.

The tool cannot tell an installer you will never open again from a document you have not needed yet. It
does not try. **Read every candidate.**
:::

## Interactive by policy

Per-file or per-range confirmation is mandatory. `--yes` is ignored here and always will be, and this mode
is not part of [`--all-safe`](./all-safe.md). See
[Guard 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

The candidate list is printed in full before anything is asked, so running the mode and declining everything
is a legitimate way to audit those directories.

## What makes a file a candidate

Three conditions together:

1. It lives in a configured personal root — by default `~/Downloads` and `~/Desktop`
2. It is larger than roughly 10 MB
3. Both `atime` and `mtime` are older than `--days` (default 100)

Personal roots are configurable through `personal-roots.txt` under `$XDG_CONFIG_HOME` (default `~/.config`).
See [Environment variables](../reference/environment-variables.md).

:::note Why `~/Downloads` is not on the protected list
It cannot be — cleaning it is the entire point of this mode. The
[allowlist](../safety/guards.md#guard-1--the-path-allowlist) protects `~/Documents`, `~/Pictures`, `~/Music`
and `~/Videos` precisely so that the one directory it does reach is the one you expect.

If you keep things you care about in `~/Downloads`, move them somewhere protected — that is the durable fix,
and it protects them from more than this tool.
:::

## Reading the candidate list

Each entry shows path, size and idle days. Worth pausing on:

| Pattern | Consider |
|---|---|
| Installers, ISOs, `.deb`/`.AppImage` | Usually safe — re-downloadable |
| Anything you produced rather than downloaded | Keep, or move somewhere protected |
| Client or work deliverables | Keep. Downloads is a bad home for them |
| Media with no obvious source | Investigate before accepting |
| Archives you never extracted | Check the contents first |

## A safer sequence

```bash
linux-cleanup --audit            # what is actually large in $HOME
linux-cleanup --stale -d 365     # only genuinely ancient files
```

Starting at 365 days and working down gives you a short, obvious list first. Once that is clear, lower the
threshold.

## In the walkthrough

Step 7 of the [guided walkthrough](./walkthrough.md). Skipping it there with `s` and running it separately
later — when you have time to read carefully — is a reasonable habit.

## Next

- [Deletion is permanent](../safety/irreversibility.md)
- [Partial downloads](./partial-downloads.md) — the related interactive mode
- [Home audit](./home-audit.md) — find what is large first
