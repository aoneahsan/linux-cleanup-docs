---
title: Stale node_modules finder
description: Find node_modules directories in projects untouched for N or more days and delete them interactively. Often the single largest reclaim on a developer machine.
tags: [node-modules, projects, interactive, disk-space, modes]
sidebar_position: 8
---

# Stale node_modules finder

**`--node-modules` finds `node_modules` directories in projects you have not touched for `--days` or more,
and offers each for deletion.** On a machine with years of side projects this is frequently the biggest
single reclaim available — 5 to 50 GB.

```bash
linux-cleanup --node-modules          # 100-day default
linux-cleanup --node-modules -d 90
```

## Interactive only

This mode requires per-project confirmation and **ignores `--yes`**. It is not part of
[`--all-safe`](./all-safe.md) and cannot be run unattended. See
[Guard 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

## What it looks for

It scans your project roots for `node_modules` directories whose containing project has been idle past the
threshold, and reports each with its size and idle days. Nested `node_modules` inside an already-listed
directory are not counted separately.

Project roots are configurable via `project-roots.txt` under `$XDG_CONFIG_HOME` (default `~/.config`). See
[Environment variables](../reference/environment-variables.md).

## Why this is usually safe

`node_modules` is the most reliably regenerable thing on a developer machine — `yarn install` or
`npm install` rebuilds it from the lockfile.

Two caveats worth knowing before you accept everything:

:::caution Two ways this can still cost you
**A patched dependency.** If you edited a file inside `node_modules` directly rather than through
`patch-package` or a yarn patch, that edit exists nowhere else. It is not in any registry and not in your
lockfile.

**No lockfile, no network.** Reinstalling needs the registry to be reachable and the lockfile to be
present. A project with no committed lockfile may not resolve to the same dependency tree — and an
air-gapped machine may not resolve at all.
:::

Neither is common, and neither is detectable by the tool. If either applies to a project in the list,
decline that one.

## What it does not touch

- The project source — only the `node_modules` directory inside it
- Lockfiles, `package.json`, or anything else in the project
- Projects touched within the threshold
- Anything on the [protected-path list](../reference/protected-paths.md)

## Reclaiming aggressively

```bash
linux-cleanup --node-modules -d 30
```

Lowering the threshold widens the candidate list. At 30 days you will start seeing projects you are still
occasionally working on, so read the list rather than accepting in bulk — the cost of a mistake is a
reinstall, which is minor but not free.

## In the walkthrough

This runs as step 5 of the [guided walkthrough](./walkthrough.md), with the same per-project prompts.

## Next

- [Reclaim the most space](../guides/reclaim-the-most-space.md)
- [Safety guards](../safety/guards.md)
