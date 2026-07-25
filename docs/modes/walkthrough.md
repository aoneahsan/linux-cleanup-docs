---
title: Walkthrough (default)
description: The default linux-cleanup mode — ten guided steps through every cleanup category, prompting before each, with a running total and a JSON session report.
tags: [walkthrough, default, interactive, guided, modes]
sidebar_position: 2
---

# Walkthrough (default)

**Running `linux-cleanup` with no flags starts the guided walkthrough: ten steps through every cleanup
category, each asking before it does anything.** It is the recommended way to use the tool interactively.

```bash
linux-cleanup          # or: linux-cleanup -w / --walkthrough
```

## The ten steps

| # | Step | Deletes | Notes |
|---|---|---|---|
| 1 | Package-manager caches | Regenerable | yarn, npm, npx, pnpm, pip, composer, bun, deno |
| 2 | Application caches | Regenerable | Browsers, Gradle, Cypress, Playwright, Zoom, editor VSIX |
| 3 | Developer-tool data | Stale only | Android AVDs, pub-cache, Dart analysis, flatpak |
| 4 | Editor old extensions | Stale + superseded | VS Code / Cursor |
| 5 | Stale `node_modules` | **Interactive** | Projects idle past the threshold |
| 6 | Partial / orphan downloads | **Interactive** | `.crdownload`, `.part`, `.fdmdownload` |
| 7 | Personal stale files | **Interactive** | Large idle files in `~/Downloads`, `~/Desktop` |
| 8 | System cleanup (sudo) | System | apt, journal, snap, `/tmp`, page cache |
| 9 | Final size audit | Nothing | Read-only summary |
| 10 | Generate readable report | Nothing | Markdown / HTML export — needs `jq` |

Steps 5, 6 and 7 are the [interactive-only](../safety/guards.md#guard-3--personal-data-is-interactive-only)
ones. They cannot be auto-confirmed, and step 7 is the only step in the whole tool that can remove something
genuinely irreplaceable.

## How the prompts work

Two levels of confirmation.

**Per step**, you choose what to do with the whole category:

| Key | Effect |
|---|---|
| `a` | Run this step. This is the default — Enter selects it |
| `s` | Skip this step entirely |
| `q` | Quit the walkthrough now, keeping progress so far |

**Per target**, inside a step that you chose to run, each individual item gets a `[Y/n]` or `[y/N]`
confirmation. The capitalised letter is the default.

So `a` at the step level does not commit you to deleting everything in it — you still see and answer each
target.

## Running totals

After each step that ran, the tool prints what that step freed and the session total so far:

```text
  ✓ this step freed: 12.4 GB   running total: 18.7 GB
```

The final summary reports disk free before and after. That figure is measured from `df`, so it reflects
everything happening on the machine — if a build ran during your session, the reported recovery can be lower
than the sum of the steps, or even negative. That is not a bug; see
[Troubleshooting](../troubleshooting.md#disk-usage-grew-during-the-session).

## Quitting early

`q` at any step prompt, or `Ctrl-C` at any point, ends the session cleanly:

- The current removal finishes first — usually well under a second
- The log keeps everything up to that moment
- `Ctrl-C` exits with code `130`, which the
  [crash trap deliberately ignores](../reference/exit-codes.md#how-the-crash-trap-decides), so no crash
  bundle is written
- Steps not reached are recorded as skipped in the report

## The session report

Every walkthrough writes a canonical JSON report to `~/.linux-cleanup/reports/report-<timestamp>.json`,
containing per-step status and bytes freed, disk and memory before/after, and session totals. Full field
list: [Report schema](../reference/report-schema.md).

Step 10 optionally converts it to Markdown and HTML. That step needs `jq`; without it the step is recorded
as `skipped (jq missing)` and the JSON is still written.

```bash
linux-cleanup --no-report    # skip JSON generation; logs still written
```

## Options worth combining

```bash
linux-cleanup -d 30          # 30-day staleness threshold instead of 100
linux-cleanup --purge-all    # disable the staleness gate entirely
linux-cleanup --no-color     # plain output
linux-cleanup --cleanup-logs # delete this run's log at the end
```

:::danger `--purge-all` changes what step 1–4 delete
With the [staleness gate](../safety/guards.md#guard-2--the-staleness-gate) off, cache steps wipe their
targets in full rather than pruning idle files. That includes Gradle wrapper distributions, Playwright
browsers and Cypress binaries you may still want. The pre-run banner states which strategy is active.
:::

## When to use something else

| Situation | Better mode |
|---|---|
| You only want one category | [Menu](./menu.md) or [TUI](./tui.md) |
| Unattended or cron | [All-safe](./all-safe.md) with `-y` |
| You want to look, not delete | [Scan](./scan.md) |
| You want the visual version of this | [TUI](./tui.md) |

## Next

- [Scan](./scan.md) — run this first
- [All-safe](./all-safe.md) — the unattended equivalent
- [Reports](./reports.md) — reading the output
