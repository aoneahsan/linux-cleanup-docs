---
title: Partial / orphan downloads
description: Find and remove abandoned partial download files — .crdownload, .part and .fdmdownload — left behind by interrupted browser and download-manager transfers.
tags: [partials, downloads, orphan, interactive, modes]
sidebar_position: 10
---

# Partial / orphan downloads

**`--partials` finds abandoned partial-download files and offers them for deletion.** These are the
placeholder files a browser or download manager writes while transferring, and forgets to clean up when the
transfer is interrupted.

```bash
linux-cleanup --partials
```

## What it looks for

| Extension | Written by |
|---|---|
| `.crdownload` | Chrome, Chromium, Brave, Edge, Vivaldi |
| `.part` | Firefox, wget, aria2 |
| `.fdmdownload` | Free Download Manager |

A partial file holds however many bytes arrived before the transfer died — sometimes a few kilobytes,
sometimes most of a multi-gigabyte ISO.

## Interactive only

Per-file confirmation, `--yes` ignored, not part of [`--all-safe`](./all-safe.md). See
[Guard 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

## What deleting one costs you

:::caution A partial file may still be resumable — but usually is not
Resuming needs the original download session: the browser's download-manager entry, the source URL, and a
server that supports range requests. If the browser has been restarted or the download entry cleared, the
partial is unresumable and is pure waste.

The file itself is never independently useful — a half-downloaded archive does not open. So the practical
question is only whether you still intend to resume it.
:::

Check before accepting a large one:

- Open your browser's downloads page and look for a paused or failed entry matching the filename
- If there is one, resume it there rather than deleting the partial
- If there is not, the partial is orphaned and safe to remove

## An active download will show up here

A download running *right now* also has a `.crdownload` or `.part` file. The tool has no way to distinguish
an in-progress transfer from an abandoned one. Deleting an active partial breaks the transfer in progress —
so check your downloads page if you are unsure, or run this mode when nothing is downloading.

## In the walkthrough

Step 6 of the [guided walkthrough](./walkthrough.md).

## Next

- [Stale personal files](./personal-stale-files.md) — the related interactive mode
- [Deletion is permanent](../safety/irreversibility.md)
