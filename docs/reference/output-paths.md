---
title: Output paths
description: Where linux-cleanup writes its logs, JSON session records, debug bundles and crash bundles — the layout, per-install defaults, retention and permissions.
tags: [output, paths, logs, reports, feedback, retention, reference]
sidebar_position: 5
---

# Output paths

**All output lives under one data root.** Which root depends on how you installed the tool, and both can be
overridden.

## Layout

```text
$DATA_HOME/
├── logs/
│   ├── cleanup-<YYYY-MM-DD_HHMMSS>.log     # one per session
│   └── cron.log                             # appended by the weekly cron
├── reports/
│   ├── report-<YYYY-MM-DD_HHMMSS>.json     # canonical session record
│   ├── report-<YYYY-MM-DD_HHMMSS>.md       # created by --export md
│   └── report-<YYYY-MM-DD_HHMMSS>.html     # created by --export html
└── feedback/
    ├── debug-bundle-<YYYY-MM-DD_HHMMSS>.tar.gz   # created by --debug-bundle
    └── crash-<YYYY-MM-DD_HHMMSS>.tar.gz          # created automatically on a crash
```

## Per-install defaults

| Installed via | `$DATA_HOME` |
|---|---|
| `npx linux-cleanup` | `~/.linux-cleanup/` |
| `npm install -g linux-cleanup` | `~/.linux-cleanup/` |
| `git clone` | The clone directory itself |

The difference is deliberate. `npx` runs the package from a temporary npm cache directory that gets evicted,
so writing output there would lose it; `~/.linux-cleanup/` persists across runs. A clone is already a
permanent location, so output stays beside the source.

Override either with [`LINUX_CLEANUP_DATA_HOME`](./environment-variables.md), or the log and record
directories individually.

## Retention

| Path | Auto-cleaned | Notes |
|---|---|---|
| `logs/cleanup-*.log` | Only with `--cleanup-logs` | That flag deletes **this run's** log at finish. Past logs stay |
| `logs/cron.log` | Never | Never rotated. Rotate it yourself if it grows |
| `reports/*.json` | **Never** | The durable audit trail |
| `reports/*.md`, `*.html` | **Never** | Created on demand, removed on demand |
| `feedback/*.tar.gz` | **Never** | You decide when they are no longer needed |

`--cleanup-logs` is the only automatic deletion the tool performs on its own output, and it only ever touches
`.log` files.

## Size

| Artefact | Typical |
|---|---|
| Session log | 50–500 KB |
| JSON record | 5–50 KB |
| Feedback or crash bundle | 50–200 KB |

A year of weekly cron runs totals a few megabytes. To thin older files:

```bash
find ~/.linux-cleanup/logs/    -name 'cleanup-*.log' -mtime +90 -delete
find ~/.linux-cleanup/reports/ -name 'report-*'      -mtime +90 -delete
```

Rotating the cron log:

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## Permissions

| Artefact | Mode |
|---|---|
| Logs and records | `0644` |
| Feedback bundles | `0640` |
| `logs/`, `reports/` | `0755` |
| `feedback/` | `0750` |

All owned by the invoking user. The tool does not `chown` or `chmod` anything outside `$DATA_HOME`.

## What these files contain

:::caution Logs and bundles contain your paths
A session log names every path touched, which means it contains directory names from your machine — project
names, and sometimes filenames from `~/Downloads`.

That is local-only and never transmitted, but review a bundle before emailing it:

```bash
tar -tzf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz
```

See [Send a bug report](../guides/send-a-bug-report.md).
:::

Nothing here contains file **contents** — only paths, sizes and timestamps. These are records of what
happened, not copies of what was deleted. See [Recovery](../recovery.md).

## Next

- [Environment variables](./environment-variables.md) — overriding these locations
- [Report schema](./report-schema.md) — the JSON structure
