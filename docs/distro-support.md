---
title: Distro support
description: What linux-cleanup does on each Linux distribution — cache cleanup works everywhere, but the sudo --system mode targets Debian and Ubuntu only.
tags: [distro, ubuntu, debian, fedora, arch, opensuse, wsl, compatibility]
sidebar_position: 90
---

# Distro support

**Cache cleanup inside `$HOME` works on every Linux distribution.** That is the large majority of what the
tool reclaims. The exception is [`--system`](./modes/system-cleanup.md), which is Debian and Ubuntu only.

## The summary

| Distro family | `$HOME` cache cleanup | `--system` |
|---|---|---|
| Debian, Ubuntu, Mint, Pop!\_OS | Full | **Full** |
| Fedora, RHEL, Rocky, Alma | Full | Partial — apt steps fail |
| Arch, Manjaro, EndeavourOS | Full | Partial — apt steps fail |
| openSUSE | Full | Partial — apt steps fail |
| Alpine, minimal containers | Needs GNU coreutils | Partial — apt steps fail |
| WSL (any distro) | Full | As the underlying distro |

:::warning `--system` has no distro detection
The apt steps call `apt` and `dpkg` directly, with no `command -v` guard and no fallback to `dnf`, `pacman`
or `zypper`. On a non-Debian system they fail with "command not found" per step.

The mode does not abort — it moves to the next step — so on Fedora or Arch you get the journal, `/tmp` and
page-cache steps working and the package steps failing noisily. Nothing is damaged; the reclaim is simply
smaller than advertised.

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

On a non-Debian system, run `--system` for the steps that work and handle packages natively:

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

Then let linux-cleanup do the rest, which is where most of the space is anyway:

```bash
linux-cleanup --all-safe -y
```

## What works identically everywhere

Every `$HOME` cache category is distro-independent, because the paths come from the tools themselves rather
than the distribution:

- Package-manager caches — yarn, npm, pnpm, pip, composer, bun, deno
- Browser caches — Chrome, Firefox, Brave, Chromium, Edge, Vivaldi
- Build-tool caches — Gradle, Cypress, Playwright, TypeScript
- Developer-tool data — Android AVDs, Flutter pub-cache, Dart, flatpak
- Editor extensions — VS Code, Cursor
- `node_modules`, partial downloads, personal stale files
- All read-only modes, every safety guard, session records and logs

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

Works normally. linux-cleanup runs on the Linux side and behaves exactly as it would on bare metal. It does
not walk into `/mnt/c/`.

If you have symlinked `~/Downloads` to a Windows directory, the allowlist resolves the symlink before
deciding, so Windows-side `Documents` and `Pictures` are refused the same as native ones.

## macOS

Not supported. The npm package declares `"os": ["linux"]` and will refuse to install. Paths, `find` flags and
package managers all differ.

## Next

- [System cleanup](./modes/system-cleanup.md) — the mode this page qualifies
- [Requirements](./getting-started/requirements.md)
