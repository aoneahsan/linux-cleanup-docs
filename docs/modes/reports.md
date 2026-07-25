---
title: Reports
description: Every linux-cleanup session writes a canonical JSON session record. List, view, convert to Markdown or HTML, and export non-interactively.
tags: [reports, json, export, markdown, html, jq, modes]
sidebar_position: 15
---

# Reports

**Every session writes a canonical JSON session record** to
`~/.linux-cleanup/reports/report-<timestamp>.json`. It is the durable account of what happened, and it is
never auto-deleted.

Markdown and HTML are optional conversions produced on demand.

```bash
linux-cleanup --reports              # interactive manager
linux-cleanup --export both latest   # non-interactive conversion
```

## What a session record contains

| Section | Holds |
|---|---|
| `schema_version` | Currently `1` |
| `credits` | Tool name, version, homepage, licence, author details |
| `meta` | Timestamps, duration, host, user, mode, staleness threshold, log path, launcher |
| `disk` | Filesystem usage before and after |
| `memory` | Memory usage before and after |
| `steps` | One entry per step: number, title, status, bytes freed |
| `totals` | Total bytes reclaimed, human-readable total, steps run and skipped |

Full field-by-field reference: [Report schema](../reference/report-schema.md).

## The interactive manager

```bash
linux-cleanup --reports
```

Lists past sessions and lets you view one, convert it to Markdown or HTML, open the HTML in a browser, or
delete it.

Conversion options are hidden when `jq` is not installed — see [below](#jq-is-required-for-conversion).

## Exporting

Non-interactive, for scripts and habits:

```bash
linux-cleanup --export both latest   # Markdown + HTML from the newest record
linux-cleanup --export html all      # every record to HTML
linux-cleanup --export md 3          # record #3 to Markdown
```

| Argument | Accepts |
|---|---|
| Format | `md`, `html`, `both` |
| Identifier | a record number, `latest`, or `all` |

Output lands beside the JSON with the same timestamp in the filename. The HTML is self-contained — embedded
CSS, dark-mode aware, no external assets — so it can be emailed or archived as a single file.

## `jq` is required for conversion

:::note JSON is always written; conversion is the optional part
Without `jq`, the canonical JSON is still produced on every run. Only Markdown and HTML export are
unavailable, and step 10 of the walkthrough records itself as `skipped (jq missing)`.

```bash
sudo apt install jq      # Debian / Ubuntu
sudo dnf install jq      # Fedora / RHEL
sudo pacman -S jq        # Arch
```
:::

The generated HTML escapes every JSON-derived value through `jq`'s `@html` filter, so a malformed input
cannot inject markup into the rendered page.

## Querying the JSON directly

The JSON is meant to be read by tools:

```bash
# Total reclaimed by the most recent session
jq '.totals.total_reclaimed_human' ~/.linux-cleanup/reports/report-*.json | tail -1

# Every step that actually ran, most recent session
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

# Reclaim across every recorded session
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## Retention

These records are **never** deleted automatically — not even by `--cleanup-logs`, which only removes the
current run's log file. They are small, 5–50 KB each, so a year of weekly runs stays under a megabyte.

To thin them yourself:

```bash
find ~/.linux-cleanup/reports/ -name 'report-*' -mtime +90 -delete
```

Skip generation entirely for a single run with `--no-report`; the log is still written.

## These are records, not backups

:::danger A session record names what was deleted, not the data
It holds paths and sizes. It contains none of the removed content, and nothing in it can restore anything.
Its value after an unwanted deletion is telling you exactly what to restore from your own backup, or
re-download. See [Recovery](../recovery.md).
:::

## Next

- [Report schema](../reference/report-schema.md) — every field
- [Output paths](../reference/output-paths.md) — where files land
- [Recovery](../recovery.md) — using a session record after a surprise
