---
title: What it deletes
description: The complete list of what linux-cleanup removes, grouped by category, with typical sizes, regeneration cost, and which paths it refuses to touch at all.
tags: [safety, deletion, targets, caches, disk-space]
sidebar_position: 1
---

# What it deletes

**linux-cleanup removes regenerable data: files a tool will rebuild or re-download the next time it needs
them.** This page is the complete inventory, grouped by how expensive each category is to get back.

Every deletion on this page is **permanent**. "Regenerable" means a program can recreate it, not that
linux-cleanup can.

:::tip Get this list from your own machine
The authoritative list for *your* system, with real paths and real sizes, comes from the tool itself:

```bash
npx linux-cleanup --list-targets   # every path it can touch
npx linux-cleanup --scan           # those paths, with current sizes, deleting nothing
```
:::

## How to read the cost column

| Regeneration cost | Meaning |
|---|---|
| **Free** | Rebuilt automatically, in seconds, without you noticing |
| **Cheap** | Re-downloaded on next use; costs bandwidth and a short wait |
| **Expensive** | Large re-download or long rebuild — minutes to hours |
| **Manual** | Nothing regenerates it. Gone means gone |

## Package-manager caches

Downloaded archives kept so a reinstall skips the network. Deleting them slows the *next* install and
nothing else.

| Target | Path | Typical size | Cost |
|---|---|---|---|
| Yarn v1 | `~/.cache/yarn` | 2–20 GB | Cheap |
| Yarn Berry | `~/.yarn/berry/cache` | 1–8 GB | Cheap |
| npm | `~/.npm/_cacache` | 1–10 GB | Cheap |
| npx | `~/.npm/_npx` | 100 MB–2 GB | Cheap |
| pnpm store | `~/.local/share/pnpm/store` | 2–15 GB | Cheap |
| pip | `~/.cache/pip` | 200 MB–3 GB | Cheap |
| Composer | `~/.composer/cache` | 100 MB–2 GB | Cheap |
| bun | `~/.bun/install/cache` | 100 MB–2 GB | Cheap |
| deno | `~/.cache/deno` | 100 MB–2 GB | Cheap |

:::note The install directories are protected, only the caches are cleaned
`~/.local/share/pnpm` (which holds your globally installed packages and the `pnpm` binary itself),
`~/.npm`, `~/.yarn`, `~/.bun/install/global` and `~/.deno/bin` are on the
[exact-match protected list](../reference/protected-paths.md#exact-match-protected-paths). Only the
regenerable store or cache *inside* them is targeted.

This distinction was a real bug: before 1.1.0 the pnpm cleanup targeted `~/.local/share/pnpm` and wiped
globally installed packages. See the [changelog](../changelog.md#110--2026-05-10).
:::

## Browser and application caches

| Target | Path | Typical size | Cost |
|---|---|---|---|
| Chrome / Chromium / Brave / Edge / Vivaldi | profile `Cache/` dirs | 500 MB–8 GB | Free |
| Firefox / Mozilla | `cache2/` | 500 MB–4 GB | Free |
| Gradle build cache | `~/.gradle/caches` | 3–10 GB | Cheap |
| Gradle wrapper distributions | `~/.gradle/wrapper/dists` | 200 MB–3 GB | **Expensive** |
| Cypress binaries | `~/.cache/Cypress` | 500 MB–3 GB | **Expensive** |
| Playwright browsers | `~/.cache/ms-playwright` | 500 MB–3 GB | **Expensive** |
| TypeScript watcher cache | project-local | small | Free |
| Zoom data | `~/.zoom/Cache` | 100 MB–2 GB | Free |
| VS Code / Cursor cached VSIX | `~/.config/Code/CachedExtensionVSIXs` | 100 MB–1 GB | Cheap |

Browser caches are the safest thing on this page — your history, bookmarks, passwords and sessions live in
different files that are never targeted. Expect slightly slower first page loads afterwards.

The three **Expensive** rows are exactly why the [staleness gate](./guards.md#guard-2--the-staleness-gate)
exists. A Gradle wrapper distribution is a 230 MB download you might need again next month, so by default
it survives unless it has been idle for 100+ days.

## Developer-tool data

Not caches — actual installed tooling. These clear the highest bar: a dependency check *and* the staleness
gate.

| Target | Path | Typical size | Cost |
|---|---|---|---|
| Android emulator images (AVDs) | `~/.android/avd` | 6–30 GB | **Expensive** |
| Flutter pub cache | `~/.pub-cache` | 1–5 GB | Cheap |
| Dart analysis server cache | `~/.dartServer` | 100 MB–1 GB | Free |
| Flatpak user data | `~/.local/share/flatpak` | 1–10 GB | **Expensive** |

Each AVD is treated as an indivisible unit: its `.avd` directory and sibling `.ini` are examined together
and pruned only when *every* file in the profile is idle past the threshold. An emulator you booted last
month survives.

Flatpak is stricter still — the module refuses to touch the tree at all if any user-scope app is installed,
and points you at `flatpak uninstall --user --unused` instead.

## Editor extensions

Superseded VS Code and Cursor extension versions: the older copies left behind when an extension updates.
Removal requires both that a newer version exists **and** that the old version has been idle past the
threshold.

The current version of an extension is never a candidate. See [Editor extensions](../modes/editor-extensions.md).

## Project and personal files — interactive only

These are never batched and never auto-confirmed. `--yes` has no effect on them, by design.

| Target | What it finds | Cost |
|---|---|---|
| Stale `node_modules` | Project directories untouched for N+ days | Cheap (`yarn install`) |
| Partial downloads | `*.fdmdownload`, `*.crdownload`, `*.part` | **Manual** |
| Stale personal files | Files in `~/Downloads`, `~/Desktop` over 10 MB and idle N+ days | **Manual** |

:::danger The personal-file modes are the only ones that can delete something irreplaceable
`node_modules` and partial downloads are throwaway by nature. Files in `~/Downloads` and `~/Desktop` are
not — the tool has no way to tell an installer you will never open again from the only copy of a document.

That is precisely why these modes require you to confirm each entry by hand, and why `--yes` is ignored
here. Read each candidate. See [Stale personal files](../modes/personal-stale-files.md).
:::

## System cleanup (requires sudo)

Only runs under [`--system`](../modes/system-cleanup.md), and each step asks first.

| Step | What it does | Default answer |
|---|---|---|
| apt | `apt autoremove --purge -y` then `apt clean` | Yes |
| Journal | `journalctl --vacuum-size=100M` — hardcoded, not `--days` | Yes |
| Snap | Removes disabled snap revisions | Yes |
| Kernels | **Lists** installed kernels only. Deletes nothing | — |
| `/tmp` | Removes files with `atime` older than **7 days** — hardcoded, not `--days` | Yes |
| Page cache | `sync` then `vm.drop_caches=3` — frees RAM, not disk | **No** |

:::warning `--system` is Debian/Ubuntu only
The apt steps call `apt` and `dpkg` directly with no distro detection and no `command -v` guard. On Fedora,
Arch or openSUSE they fail with "command not found" rather than adapting. Everything else on this page works
on any distro. Details: [Distro support](../distro-support.md).
:::

## What it refuses to delete

The allowlist is a hard refusal with no override flag. Any path resolving inside these is rejected, after
`realpath` resolution so a symlink cannot smuggle a path past the check.

| Category | Paths |
|---|---|
| System roots | `/`, `/home`, `/root`, `/etc`, `/boot`, `/usr`, `/var`, `/lib`, `/sbin`, `/bin` |
| Home root | `$HOME` itself |
| Personal data | `~/Documents`, `~/Pictures`, `~/Music`, `~/Videos`, `~/Desktop`, `~/Public`, `~/Templates` |
| Credentials | `~/.ssh`, `~/.gnupg` |
| Configuration | `~/.config`, `~/.gnome`, `~/.mozilla`, `~/.thunderbird` |
| Agent state | `~/.claude`, `~/.local/share/claude` |
| Shell init | Any file named `.bashrc`, `.zshrc`, `.profile`, `.bash_aliases`, `.bash_history`, and similar |

:::caution Verify this list against your own install
Protected-path lists drift between versions, and some third-party write-ups of this tool list directories
that are **not** actually protected — `~/.password-store` and `~/.aws` among them.

Do not trust any document, including this one, over your own machine:

```bash
npx linux-cleanup --list-targets
npx linux-cleanup --self-test    # asserts the guards actually fire
```

The complete verified list is at [Protected paths](../reference/protected-paths.md).
:::

## Next

- [Preview before deleting](./preview-first.md) — see the outcome before committing to it
- [Safety guards](./guards.md) — the four gates, and what each one is for
- [Deletion is permanent](./irreversibility.md) — what to do when something surprises you
