---
title: Distro support
description: What linux-cleanup does on each Linux distribution — cache cleanup works everywhere, but the sudo --system mode targets Debian and Ubuntu only.
tags: [distro, ubuntu, debian, fedora, arch, opensuse, wsl, compatibility]
sidebar_position: 90
---

# Distro support

**Home cache cleanup is designed for Linux distributions with the required GNU utilities.**
[`--system`](./modes/system-cleanup.md) uses Debian and Ubuntu package commands. Check the installed tools with `--self-test` before cleanup.

## The summary

| Distro family | `$HOME` cache cleanup | `--system` |
|---|---|---|
| Debian, Ubuntu, Mint, Pop!\_OS | Full | **Full** |
| Fedora, RHEL, Rocky, Alma | With required utilities | Do not use: apt steps fail |
| Arch, Manjaro, EndeavourOS | With required utilities | Do not use: apt steps fail |
| openSUSE | With required utilities | Do not use: apt steps fail |
| Alpine, minimal containers | Needs Bash and GNU utilities | Do not use: apt steps fail |
| WSL | With required utilities | Debian/Ubuntu only; inspect mounted paths first |

:::warning `--system` has no distro detection
The apt steps call `apt` and `dpkg` directly, with no `command -v` guard and no fallback to `dnf`, `pacman`
or `zypper`. On a non-Debian system they fail with "command not found" per step.

The mode does not abort after an apt failure: later steps can still run. Avoid it on other distributions.

Some descriptions of this tool claim graded multi-distro support for `--system`, with `dnf` substituting for
`apt` and `paccache` on Arch. **No such code exists.** Verify with
`grep -rn 'dnf\|pacman\|zypper' modules/system_sudo.sh` on a clone — it returns nothing.
:::

## Step by step

| `--system` step | Debian/Ubuntu | Fedora/RHEL | Arch | openSUSE |
|---|---|---|---|---|
| `apt autoremove` + `apt clean` | Works | **Fails** | **Fails** | **Fails** |
| `journalctl --vacuum-size=100M` | Works | Works | Works | Works |
| Disabled snap revisions | Works | If snap installed | If snap installed | If snap installed |
| Kernel listing (`dpkg --list`) | Works | Silent — prints nothing | Silent | Silent |
| `/tmp` files older than 7 days | Works | Works | Works | Works |
| Page-cache drop | Works | Works | Works | Works |

The journal, `/tmp` and page-cache steps rely on `journalctl`, `find` and `sysctl`, which behave the same
everywhere systemd is present. The kernel step is listing-only regardless, so its failure on non-dpkg systems
costs nothing.

## Doing the package part yourself

On a non-Debian system, use its package manager's own maintenance guidance. The commands below are examples to review before running:

```bash
# Fedora / RHEL / Rocky
sudo dnf autoremove
sudo dnf clean all

# Arch / Manjaro  (paccache is in pacman-contrib)
sudo pacman -Rns "$(pacman -Qtdq)"    # orphans, if any
sudo paccache -r                       # keep the last 3 versions
sudo pacman -Scc                       # clear the whole package cache

# openSUSE
sudo zypper clean --all
sudo zypper packages --orphaned
```

For home caches, preview what linux-cleanup finds:

```bash
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

## Home cache targets

Home paths come from the installed tools rather than the distribution. Availability varies by machine:

- Package-manager caches — yarn, npm, pnpm, pip, composer, bun, deno
- Browser caches — Chrome, Firefox, Brave, Chromium, Edge, Vivaldi
- Build-tool caches — Gradle, Cypress, Playwright, TypeScript
- Developer-tool data — Android AVDs, Flutter pub-cache, Dart, flatpak
- Editor extensions — VS Code, Cursor
- `node_modules`, partial downloads, personal stale files
- Scan, audit, safety checks and local logs

## Minimal containers

Alpine and other minimal images typically ship BusyBox rather than GNU coreutils. The tool needs GNU `find`,
`du`, `stat` and especially `realpath` — the last is what resolves symlinks before the
[protected-path check](./reference/protected-paths.md).

```bash
apk add coreutils findutils bash
linux-cleanup --self-test
```

`--self-test` names the first missing dependency. Do not run destructive modes until it passes.

## WSL

The tool runs in the Linux environment. Its path guard resolves symlinks, but it does not identify Windows personal folders as protected Linux folders. Inspect the scan and dry run carefully if your home directories or caches point into `/mnt/`.

## macOS

Not supported. The npm package declares `"os": ["linux"]` and will refuse to install. Paths, `find` flags and
package managers all differ.

## Next

- [System cleanup](./modes/system-cleanup.md) — the mode this page qualifies
- [Requirements](./getting-started/requirements.md)
