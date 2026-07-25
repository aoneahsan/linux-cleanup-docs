---
title: Doctor
description: Detect runtimes installed on disk but missing from your shell init — nvm, pnpm, bun, deno, cargo — and append the canonical init block with your confirmation. Additive only.
tags: [doctor, repair, shell, bashrc, nvm, pnpm, bun, deno, cargo, modes]
sidebar_position: 14
---

# Doctor

**`--doctor` finds runtimes that exist on disk but are not wired into your shell configuration, and offers
to add the missing init block.** Added in [1.1.0](../changelog.md#110--2026-05-10).

```bash
linux-cleanup --doctor
```

This is the mode for `pnpm: command not found` when you know perfectly well you installed pnpm.

## Additive only

:::note Doctor never deletes or edits an existing line
It **appends** a canonical init block, and only after you confirm. It does not modify, reorder, or remove
anything already in your shell configuration.

Shell-init files are additionally protected at the deletion layer: `safe_rm` refuses any path whose basename
is `.bashrc`, `.zshrc`, `.profile`, `.bash_aliases` or similar, wherever it lives. See
[Protected paths](../reference/protected-paths.md#protected-basenames).
:::

## What it checks

| Runtime | Detects | Appends |
|---|---|---|
| `nvm` | `~/.nvm` present, no `NVM_DIR` init | The standard nvm loader block |
| `pnpm` | `~/.local/share/pnpm` present, not on `PATH` | `PNPM_HOME` export and `PATH` addition |
| `bun` | `~/.bun` present, not on `PATH` | Bun's init block |
| `deno` | `~/.deno` present, not on `PATH` | Deno's `PATH` addition |
| `cargo` | `~/.cargo` present, not on `PATH` | `. "$HOME/.cargo/env"` |

## How this usually happens

An installer writes its init block to a file your shell does not read. `~/.profile` is only read by login
shells; `~/.bash_profile` shadows it when present; a change to `~/.bashrc` never reaches a `zsh` session.
The runtime installs fine and then appears to vanish.

It also happens after migrating a dotfiles repository between machines, or after switching login shells.

## Afterwards

Reload your shell, or the change will not appear to have worked:

```bash
source ~/.bashrc     # or ~/.zshrc
```

Then confirm:

```bash
command -v pnpm && pnpm --version
```

## Its relationship to the globals audit

[`--globals`](./globals-audit.md) works even when a package manager is missing from `PATH`, by falling back
to filesystem inspection. So if the audit lists pnpm globals but `pnpm` itself is not found, `--doctor` is
the fix.

## Next

- [Globals audit](./globals-audit.md)
- [Troubleshooting](../troubleshooting.md)
