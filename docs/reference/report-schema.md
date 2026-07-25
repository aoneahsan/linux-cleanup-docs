---
title: Report schema
description: The JSON structure linux-cleanup writes for every session — schema_version 1, with credits, meta, disk, memory, steps and totals — plus how to parse and validate it.
tags: [json, schema, reports, parsing, jq, reference]
sidebar_position: 7
---

# Report schema

**Every session writes a JSON record with `"schema_version": 1`.** This page documents the structure the
tool actually emits, verified against the source of 1.4.0.

:::warning Older documentation describes a different structure
Some material — including a reference page inside the source repository — describes a shape built around
`schema` (a string like `linux-cleanup/report/v1`) with `tool`, `session` and `categories` objects.

**The tool does not emit that.** A parser written against it will fail on every real file. The structure
below is what `modules/walkthrough.sh` writes. Confirm on your own machine:

```bash
jq 'keys' "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```
:::

## Top level

```json
{
  "schema_version": 1,
  "credits": { },
  "meta":    { },
  "disk":    { "before": {}, "after": {} },
  "memory":  { "before": {}, "after": {} },
  "steps":   [ ],
  "totals":  { }
}
```

| Key | Type | Holds |
|---|---|---|
| `schema_version` | number | Currently `1`. Reject anything you do not recognise |
| `credits` | object | Tool identity, licence and author |
| `meta` | object | Session context — when, where, how, with what settings |
| `disk` | object | Filesystem usage before and after |
| `memory` | object | Memory usage before and after |
| `steps` | array | One entry per step attempted |
| `totals` | object | Session summary |

## `credits`

```json
{
  "tool": "linux-cleanup",
  "tool_version": "1.4.0",
  "tool_homepage": "https://aoneahsan.com",
  "tool_license": "MIT",
  "author": {
    "name": "Ahsan Mahmood",
    "email": "aoneahsan@gmail.com",
    "website": "https://aoneahsan.com",
    "linkedin": "https://linkedin.com/in/aoneahsan"
  }
}
```

Present so a record is self-attributing wherever it ends up. Nothing here reflects your machine.

## `meta`

| Key | Type | Holds |
|---|---|---|
| `tool` | string | Always `linux-cleanup` |
| `tool_version` | string | The version that wrote the record. Gate consumer logic on this |
| `started_at` | string | Session start timestamp |
| `finished_at` | string | Session end timestamp |
| `duration_seconds` | number | Wall-clock duration |
| `host` | string | `hostname` output |
| `user` | string | `$USER` |
| `mode` | string | The mode that ran — `walkthrough`, `scan`, `allsafe`, `system`, and so on |
| `stale_days` | number | The `--days` threshold in force |
| `log_file` | string | Absolute path to this session's log |
| `launcher` | string | How it was invoked — `bash` for a direct run |
| `via_npx` | number | `1` when run through the npm launcher, `0` otherwise |

`stale_days` is worth capturing: it is the difference between a run that pruned at 100 days and one that ran
with `-d 30`, and it explains why two sessions on the same machine reclaimed different amounts.

## `disk` and `memory`

Both hold a `before` and an `after` snapshot, taken at session start and end.

`disk` carries filesystem fields — filesystem, size, used, available and use percentage — derived from `df`.
`memory` carries the equivalent from the system's memory report.

:::note `after` minus `before` is not purely your cleanup
These are whole-machine measurements. A build, a package update or a browser running during the session
moves them too, which is why a reported recovery can be lower than the sum of the steps — or negative. See
[Troubleshooting](../troubleshooting.md#disk-usage-grew-during-the-session).
:::

## `steps`

An array, one entry per step attempted, in order:

```json
{ "n": 1, "title": "Package-manager caches", "status": "ran", "freed_bytes": 13315108864 }
```

| Key | Type | Holds |
|---|---|---|
| `n` | number | 1-based step number |
| `title` | string | Human-readable step name |
| `status` | string | `ran`, `skipped`, `skipped (quit)`, or `skipped (jq missing)` |
| `freed_bytes` | number | Bytes reclaimed by this step. `0` when skipped |

`skipped (quit)` marks the steps after you pressed `q` — useful for telling a deliberate stop from a step
you declined individually.

## `totals`

| Key | Type | Holds |
|---|---|---|
| `total_reclaimed_bytes` | number | Sum across steps |
| `total_reclaimed_human` | string | The same, formatted |
| `steps_run` | number | Steps with status `ran` |
| `steps_skipped` | number | Steps with a `skipped` status |

## Parsing

```bash
LATEST="$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

jq '.totals.total_reclaimed_human' "$LATEST"
jq '.meta | {mode, stale_days, duration_seconds}' "$LATEST"
jq '.steps[] | select(.status == "ran") | "\(.title): \(.freed_bytes)"' "$LATEST"

# Reclaim across every session on record
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## Validating

No JSON Schema file ships with the tool. A structural check:

```bash
jq -e 'has("schema_version") and .schema_version == 1
       and has("meta") and has("steps") and has("totals")' \
  ~/.linux-cleanup/reports/report-*.json
```

Prints `true` per valid file.

## Compatibility guidance

Writing a consumer:

- **Branch on `schema_version`.** Treat an unfamiliar value as unparseable rather than guessing
- **Treat unknown keys as additive.** Fields have been added within version 1 and may be again
- **Use `meta.tool_version`** for behaviour that differs between releases
- **Do not assume every mode fills every section.** Read-only modes produce fewer steps
- **Expect `total_reclaimed_bytes` to be negative occasionally.** It is a `df` delta, not a sum of deletions

## Next

- [Reports](../modes/reports.md) — viewing and exporting
- [Output paths](./output-paths.md) — where the files live
