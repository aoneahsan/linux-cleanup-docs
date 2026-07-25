---
title: Installation
description: Install linux-cleanup three ways — zero-install with npx, globally with npm, or by cloning the repository — and verify the install before running anything destructive.
tags: [installation, npx, npm, git, setup, upgrade]
sidebar_position: 2
---

# Installation

**linux-cleanup ships three ways: `npx` with no install, a global `npm` install, or a `git clone`.** All
three run the same Bash script — the npm package is a thin Node launcher that locates `cleanup.sh` and
points logs and reports at a persistent directory.

:::info Version note
npm's `latest` tag is currently **1.3.1**. Version **1.4.0** exists in the repository and relicensed the
project to MIT; it has not been published to npm yet. Installing from npm today gets you 1.3.1, whose
behaviour is identical — 1.4.0 changed only the licence. See the [changelog](../changelog.md).
:::

## Option 1 — `npx`, no install

The fastest way to evaluate it. Nothing lands on your `PATH` and nothing is left behind if you decide
against it.

```bash
npx linux-cleanup --version
npx linux-cleanup --scan      # read-only audit
npx linux-cleanup             # guided walkthrough
```

`npx` fetches the package into a temporary npm cache directory. Your logs and reports are written to
`~/.linux-cleanup/` — **not** the temp directory — so they survive npm cache eviction and are still there
next time.

## Option 2 — global `npm` install

```bash
npm install -g linux-cleanup
linux-cleanup --version
```

`linux-cleanup` is then on your `PATH` everywhere. Logs and reports still go to `~/.linux-cleanup/`.

```bash
npm install -g linux-cleanup@latest   # upgrade
npm uninstall -g linux-cleanup        # remove
```

Uninstalling the package does not remove a shell alias or cron entry you installed — see
[Uninstall](../guides/uninstall.md) for the complete removal.

## Option 3 — `git clone`

For reading the source, auditing it, or modifying it. The repository contents are what npm publishes.

```bash
git clone https://github.com/aoneahsan/linux-cleanup ~/linux-cleanup
cd ~/linux-cleanup
chmod +x cleanup.sh
./cleanup.sh --self-test
./cleanup.sh
```

The one behavioural difference: **a clone keeps its output alongside the source**, in `<clone>/logs/`,
`<clone>/reports/` and `<clone>/feedback/`, rather than in `~/.linux-cleanup/`. Both are overridable with
`LINUX_CLEANUP_DATA_HOME`. See [Output paths](../reference/output-paths.md).

The project is MIT licensed, so forks and modifications are fine.

## Verify before you run anything destructive

```bash
linux-cleanup --version      # confirms which build you actually have
linux-cleanup --self-test    # dependency, syntax and safety-guard checks
```

A clean self-test ends with a pass message. It asserts that the
[protected-path guard](../safety/guards.md#guard-1--the-path-allowlist) really does refuse `/`, `$HOME`,
`~/Documents`, `~/.ssh` and `/etc`, and that it does not refuse `~/.cache/yarn`. Any failed assertion exits
non-zero.

:::tip Run `--self-test` after every upgrade
It is the only check that runs against the code you actually have rather than against documentation. It
takes a second.
:::

## Which install path to choose

| If you… | Use |
|---|---|
| Want to try it once | `npx` |
| Will run it regularly, or from cron | Global `npm` install |
| Want to read or modify the source | `git clone` |
| Are on a machine without Node.js | `git clone` |
| Need output kept next to the source | `git clone` |

For cron specifically, prefer a global install and use an **absolute path** in the crontab — cron runs with
a minimal `PATH` and will not find a `~/.local/bin` install. This is the single most common cron problem;
see [Alias and cron](../guides/alias-and-cron.md).

## What installing does not do

- No system service, no background daemon, no scheduled task (until you ask for one)
- No telemetry agent, no update checker, no remote configuration fetch
- No shell configuration changes unless you run `--install-alias` or `--doctor`
- No files outside the package and `~/.linux-cleanup/`, and the latter only once you actually run it

## Next

- [Quick start](./quick-start.md) — your first cleanup
- [What it deletes](../safety/what-it-deletes.md) — read before the first destructive run
- [Uninstall](../guides/uninstall.md) — complete removal, including alias and cron
