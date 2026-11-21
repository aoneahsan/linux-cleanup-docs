---
title: Scan (read-only)
description: Inspect cache roots, partial downloads and other Linux cleanup candidates without deleting files.
tags: [scan, read-only, audit, preview, modes]
sidebar_position: 3
---

# Scan (read-only)

**`--scan` lists paths and their current sizes without deleting files.** It is a first look at the machine. Use a dry run of the selected cleanup mode to see proposed actions.

```bash
linux-cleanup --scan
```

## What does it inspect?

The scan prints a table of cache and build-tool roots: package managers, browsers, Gradle, test runners, Android tooling and other configured locations. It also lists partial downloads, likely duplicate downloads, large stale personal-file candidates and a few system observations. It does not run package-manager cleanup or ask for `sudo`.

A listed cache root's size covers everything currently in that root. It is **not** the amount the tool will remove. The chosen mode, staleness threshold, current use and refusal rules determine what stays.

The scan writes a local session log. It does not write the walkthrough's [JSON session report](../reference/report-schema.md).

## Read the paths before choosing a mode

Check a path you do not recognise. A symlink can point somewhere different from its visible name; inspect it with `realpath` before a cleanup. The protected-path guard also resolves symlinks before it deletes.

Personal-file candidates appear for review only. Routine `--all-safe` cleanup does not select them. To preview cache cleanup:

```bash
linux-cleanup --all-safe --dry-run
```

A dry run walks that mode without deleting. It may still write a local log and update-check state. A real deletion has no undo.

## Machine-readable scan

```bash
linux-cleanup --scan --json-events > scan.ndjson
```

The [version 1 event stream](../reference/json-events.md) goes to stdout; human text goes to stderr. It can contain full local paths. Keep it on this machine and use the exit code to distinguish a complete run from an interrupted stream.

## Other read-only views

| Command | Question it answers |
|---|---|
| `--list-targets` | Which configured paths can a mode target or refuse? |
| `--audit` | Which entries in `$HOME` are largest, whether or not a cleanup mode covers them? |
| `--globals` | Which global runtime packages are installed? |
| `--self-test` | Do required commands, syntax and safety-guard assertions pass? |

Read [Preview before deleting](../safety/preview-first.md) for the sequence, then [CLI flags](../reference/cli-flags.md) for mode options.
