---
title: Preview before deleting
description: Use a read-only scan and a dry run to inspect linux-cleanup paths before permanent deletion.
tags: [safety, dry-run, scan, preview, read-only]
sidebar_position: 2
---

# Preview before deleting

**Start with `--scan`, then run the cleanup mode with `--dry-run`.** The scan shows paths and sizes without deleting. A dry run walks the selected cleanup and prints the actions it would take, without removing files or changing settings. Both still create a local session log.

```bash
linux-cleanup --self-test
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

`--self-test` checks dependencies, Bash syntax and the protected-path guard. Stop if it fails.

## What does the scan show?

`--scan` lists cache roots, partial downloads, likely duplicate downloads, large stale personal-file candidates and system observations. Its size for a cache root is **everything currently there**, not the amount that a later cleanup will remove. The 100-day default staleness threshold, current use and mode-specific rules may keep most of it.

The scan does not create a JSON session report. If you need a machine-readable scan, use `linux-cleanup --scan --json-events`. The event stream can include full local paths; keep it on your machine.

## What does a dry run show?

`--dry-run` walks the selected cleanup path and prints proposed actions. For example:

```bash
linux-cleanup --all-safe --dry-run
linux-cleanup --all-safe --yes --dry-run --json-events > preview.ndjson
```

The first command still asks for confirmation, just as a real run would. The second is non-interactive and writes versioned JSON events to stdout; human text goes to stderr. Neither deletes files. A dry run writes no JSON session report.

A preview is a snapshot of the current machine, not a promise about a later run. Files may be used, modified or removed between preview and confirmation. The tool has no undo or backup.

## Check the boundary before a real run

`--list-targets` prints configured target roots and protected paths without measuring the disk. It helps answer whether a directory is in scope. The [protected-path reference](../reference/protected-paths.md) describes the refusal rules.

Personal-file and project-adjacent modes are separate from routine cache cleanup. Review their candidates individually. `--yes` applies to `--all-safe` only; it does not approve personal-file deletion.

When the preview matches your intent, choose the mode you want and read its confirmation. A real deletion is permanent.

## Read next

- [What it deletes](./what-it-deletes.md)
- [Safety guards](./guards.md)
- [CLI flags](../reference/cli-flags.md)
