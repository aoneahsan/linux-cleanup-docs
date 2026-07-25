---
title: Editor extensions
description: Remove superseded VS Code and Cursor extension versions — the older copies left behind when an extension updates — subject to a supersession check and the staleness gate.
tags: [vscode, cursor, extensions, editor, modes]
sidebar_position: 11
---

# Editor extensions

**`--editor-ext` removes superseded VS Code and Cursor extension versions.** When an extension updates, the
old version directory often stays on disk. On a machine with many extensions and a few years of updates this
accumulates to hundreds of megabytes.

```bash
linux-cleanup --editor-ext
```

## The two conditions

A version directory is a candidate only when **both** hold:

1. **A newer version of the same extension exists** — the current version is never a candidate
2. **That older version has been idle for `--days` or more** (default 100)

The second condition was added in [1.2.1](../changelog.md#121--2026-05-10). Before that, supersession alone
was enough, which removed old versions you had loaded recently. Output shows per-version idle days, so you
can see why something was kept.

## What it does not touch

- The current version of any extension
- Extension settings, keybindings, or workspace state
- Anything in `~/.config` — that whole tree is
  [protected](../reference/protected-paths.md)
- Extensions in an editor other than VS Code and Cursor

## After running it

If VS Code shows a missing-extension banner, reload the window: `Ctrl+Shift+P` → **Developer: Reload
Window**. The editor is holding a reference to a directory that no longer exists.

If an extension is genuinely gone — which would mean the "highest version" detection mis-identified the
current one — reinstall it and please [report the bug](../guides/send-a-bug-report.md):

```bash
code --install-extension <publisher>.<name>
```

## Expected reclaim

Typically 100 MB to 1 GB. Modest next to caches, but it also trims editor startup: VS Code scans the
extensions directory at launch, so fewer directories means a marginally faster start.

## In the walkthrough and all-safe

Runs as step 4 of the [guided walkthrough](./walkthrough.md), and is included in
[`--all-safe`](./all-safe.md) since it only ever removes regenerable, superseded copies.

## Next

- [The staleness gate](../safety/guards.md#guard-2--the-staleness-gate)
- [Modes overview](./overview.md)
