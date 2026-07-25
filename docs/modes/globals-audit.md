---
title: Globals audit
description: A read-only audit of globally installed npm, pnpm, yarn, bun and deno packages, marking each as recently used, depended upon, or stale — and printing uninstall commands you run yourself.
tags: [globals, npm, pnpm, yarn, bun, deno, read-only, modes]
sidebar_position: 12
---

# Globals audit

**`--globals` lists your globally installed packages across npm, pnpm, yarn, bun and deno, and marks each
one.** Added in [1.1.0](../changelog.md#110--2026-05-10).

```bash
linux-cleanup --globals
linux-cleanup --globals -d 180
```

:::note This mode never deletes anything
It prints copy-pasteable uninstall commands and stops. You decide what to run. Global packages are exactly
the kind of thing that breaks a workflow when removed by surprise, so the tool refuses to remove them for
you.
:::

## The verdicts

| Verdict | Meaning |
|---|---|
| **recently used** | Modified or accessed within `--days`. Leave it |
| **needed by: `<pkg>`** | Another global declares it as a dependency. Removing it breaks that one |
| **STALE — safe to uninstall** | Idle past the threshold and nothing else depends on it |

"Safe to uninstall" means safe from the perspective of the other globals on your machine. It cannot know
about a shell script, a CI job, or a habit of yours that calls the binary. Read the list before acting.

## Why global packages matter here

Globally installed packages are **never** deleted by any cleanup mode. `~/.local/share/pnpm`, `~/.npm`,
`~/.yarn`, `~/.bun/install/global` and `~/.deno/bin` are on the
[exact-match protected list](../reference/protected-paths.md#exact-match-protected-paths) specifically to
keep them safe — a lesson from a real bug where the pnpm cleanup targeted the install root and wiped global
packages. See [1.1.0](../changelog.md#110--2026-05-10).

This audit is the deliberate counterpart: visibility without automation.

## Works without the package managers on PATH

Each manager is queried through its CLI when available, and through filesystem inspection when not. So the
audit still works on a machine where `pnpm` was installed but is not currently on `PATH` — which is often
exactly the situation you are trying to diagnose.

If a runtime is on disk but not wired into your shell, [`--doctor`](./doctor.md) is the mode that fixes that.

## Good moments to run it

- Before reinstalling Node or switching version managers
- Before migrating to a new machine — it is a portable inventory of your tooling
- When `npm ls -g` output has become unrecognisable
- Once or twice a year, as hygiene

## Next

- [Doctor](./doctor.md) — repair a runtime that is installed but not on `PATH`
- [Protected paths](../reference/protected-paths.md) — why globals are never touched
