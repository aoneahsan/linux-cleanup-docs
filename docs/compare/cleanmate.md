---
sidebar_position: 6
title: linux-cleanup and CleanMate
description: How linux-cleanup and CleanMate differ, from their own pages, checked 2026-11-10.
---

# linux-cleanup and CleanMate

*Last checked 2026-11-10 against <a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">CleanMate’s own page</a>.*

**What it is:** A macOS and Ubuntu cleaner with a desktop app, terminal app and review-before-removal flow.

**Price there:** Free: free (<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">source</a>, checked 2026-11-10). **Here:** the CLI is free under the MIT License; the desktop app's plans are on the [pricing page](https://linux-cleanup.aoneahsan.com/pricing).

| | linux-cleanup | CleanMate |
|---|---|---|
| Command-line interface | Yes | Not stated on the pages we checked |
| Preview before deletion | Yes | Yes (<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">source</a>) |
| Dry run | Yes | Not stated on the pages we checked |
| Cache cleanup | Yes | Not stated on the pages we checked |
| Duplicate-file finding | Partly | Not stated on the pages we checked |

## Who is better served by CleanMate

Choose CleanMate if you want its Ubuntu desktop app, Space Lens or Trash and undo flow for personal files.

## Where linux-cleanup is ahead

Choose linux-cleanup if you want a scriptable command line with a JSON event stream, and every real run written to a local JSON report.

## Where to start here

There is no import from one tool to the other: each keeps its own rules. To see what linux-cleanup would do on your computer, start with [Preview first](../safety/preview-first.md) and run `npx -y linux-cleanup --all-safe --yes --dry-run`, which removes nothing.
