---
title: Reclaim the most space
description: An ordered recipe for getting the largest amount of disk back with linux-cleanup, from the safest wins to the aggressive options and their trade-offs.
tags: [guide, disk-space, reclaim, purge-all, recipe]
sidebar_position: 1
---

# Reclaim the most space

**An ordered recipe, safest first.** Each stage reclaims more than the last and carries slightly more
trade-off. Stop wherever you have enough space.

## Stage 0 — Find out what is actually using the disk

```bash
linux-cleanup --audit    # 20 largest entries in $HOME
linux-cleanup --scan     # what this tool can reclaim
```

Do this first. If a 60 GB VM image or a Steam library is the real problem, no amount of cache cleaning will
help and you will have spent an hour finding that out the slow way. `--audit` shows everything;
`--scan` shows only what the tool can address. See [Home audit](../modes/home-audit.md).

## Stage 1 — The safe batch

```bash
linux-cleanup --all-safe -y
```

Every regenerable cache, pruned at the 100-day default. Typically **5–25 GB**. Cannot touch personal files.

This is the stage that reclaims the most per unit of risk, and the one to schedule
[weekly](./alias-and-cron.md).

## Stage 2 — Old project dependencies

```bash
linux-cleanup --node-modules -d 90
```

Frequently the biggest single win on a developer machine: **5–50 GB**. Interactive, so you confirm each
project.

Anything you have not opened in three months is a safe candidate — `yarn install` rebuilds it. Two things to
watch for: a dependency you patched in place, and a project with no committed lockfile. See
[node_modules finder](../modes/node-modules-finder.md).

## Stage 3 — System storage

```bash
linux-cleanup --system
```

apt cache, journal, snap revisions, `/tmp`. Typically **2–8 GB** on a machine that has been running a year.

:::warning Debian and Ubuntu only
On other distros the apt steps fail and you should run your package manager's equivalent by hand. See
[Distro support](../distro-support.md#doing-the-package-part-yourself).
:::

## Stage 4 — Lower the threshold

```bash
linux-cleanup --all-safe -y -d 30
```

Drops the staleness gate from 100 days to 30, so more of each cache qualifies. Adds maybe **2–10 GB** on top
of stage 1.

The trade-off is real but modest: something you used six weeks ago gets re-fetched next time you need it.

## Stage 5 — Personal files

```bash
linux-cleanup --stale -d 365     # start here
linux-cleanup --stale -d 180     # then, if you need more
```

Large idle files in `~/Downloads` and `~/Desktop`. Can be **1–50 GB**, entirely depending on your habits.

:::danger This is the only stage that can destroy something irreplaceable
Read every candidate. Starting at 365 days gives a short, obvious list; work down from there rather than
starting aggressive.

See [Stale personal files](../modes/personal-stale-files.md) and
[Deletion is permanent](../safety/irreversibility.md).
:::

## Stage 6 — Full purge

```bash
linux-cleanup --all-safe -y --purge-all
```

Disables the [staleness gate](../safety/guards.md#guard-2--the-staleness-gate) entirely. Every cache target
is wiped whole. Adds **3–15 GB** beyond stage 4.

:::danger What this specifically costs you
The gate exists to protect assets that look like cache but are expensive to replace:

- Gradle wrapper distributions — ~230 MB each, re-downloaded on the next build with that wrapper
- Playwright and Cypress browser binaries — re-downloaded on the next test run
- Yarn-cached tarballs of pinned dependencies

None is irreplaceable; all cost bandwidth and a slow first run afterwards. This is a reasonable choice
before reimaging a machine, and a poor default.
:::

## Realistic totals

Cumulative, on a developer laptop with a year of accumulation:

| Through stage | Typical reclaim |
|---|---|
| 1 — safe batch | 5–25 GB |
| 2 — node_modules | 10–75 GB |
| 3 — system | 12–83 GB |
| 4 — 30-day threshold | 14–93 GB |
| 5 — personal files | 15–140 GB |
| 6 — full purge | 18–155 GB |

Ranges are wide because machines differ enormously. Your `--scan` output is the honest estimate; these are
only a shape.

## What none of this touches

If you still need space, the tool cannot help with these — but knowing that is progress:

- VM images and container storage
- Game libraries
- Datasets and model weights
- Anything in `~/Documents`, `~/Pictures`, `~/Music`, `~/Videos` — all
  [protected](../reference/protected-paths.md) and never candidates

`--audit` from stage 0 shows them, and `du -sh ~/* | sort -rh | head` narrows further.

## Keeping it from coming back

```bash
linux-cleanup --install-cron    # weekly --all-safe -y, Sundays 03:00
```

Stage 1 running automatically stops most of the accumulation. Stages 2, 3 and 5 stay manual — they need your
judgement. See [Alias and cron](./alias-and-cron.md).
