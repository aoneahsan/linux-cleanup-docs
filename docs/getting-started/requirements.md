---
title: Requirements
description: What linux-cleanup needs to run — bash 4+, GNU coreutils, Linux only — plus the optional dependencies that unlock report export and the visual menu.
tags: [requirements, dependencies, installation, jq, whiptail]
sidebar_position: 1
---

# Requirements

**linux-cleanup runs on Linux with `bash` 4 or newer and GNU coreutils.** Everything else is optional and
degrades gracefully when missing.

## Platform

| | |
|---|---|
| **Operating system** | Linux only. The npm package declares `"os": ["linux"]` and will refuse to install elsewhere |
| **Shell** | `bash` ≥ 4.0 |
| **Node.js** | ≥ 14 — **only** for the `npx` and `npm install -g` paths. Not needed for a git clone |
| **Privileges** | Runs as a normal user. Only [`--system`](../modes/system-cleanup.md) requests `sudo` |

macOS and WSL are worth separating:

- **macOS is not supported.** The paths, `find` flags and package managers differ. A sibling tool exists for
  it; do not point this one at a Mac.
- **WSL works.** linux-cleanup runs on the Linux side and behaves identically to a native install. It does
  not go looking inside `/mnt/c/`. If you have symlinked `~/Downloads` to a Windows directory, the
  [allowlist](../reference/protected-paths.md) resolves the symlink before deciding, so Windows-side
  `Documents` and `Pictures` are still refused.

## Required commands

These are present on essentially every mainstream distro. `bash`, `find`, `du`, `df`, `rm`, `awk`, `sort`,
`grep`, `sed`, `stat`, `realpath`.

`realpath` matters more than the others: it is what resolves symlinks before the protected-path check. On a
minimal container image without GNU coreutils, install them before running.

```bash
npx linux-cleanup --self-test
```

`--self-test` probes every required command and names the first one missing, with a fix hint. Run it before
anything destructive.

## Optional dependencies

Each unlocks one feature. Without it, that feature is unavailable and the rest of the tool is unaffected.

| Dependency | Unlocks | Without it |
|---|---|---|
| `jq` | Markdown / HTML [report export](../modes/reports.md) | JSON reports still written; conversion unavailable |
| `whiptail` | The visual [TUI menu](../modes/tui.md) | `--tui` falls back to the CLI menu with an install hint |
| `dialog` | TUI fallback when `whiptail` is absent | As above |
| `snap` | Disabled snap-revision cleanup in `--system` | That step is skipped cleanly |
| `crontab` | The [weekly cron installer](../guides/alias-and-cron.md) | `--install-cron` cannot run |
| `numfmt` | Human-readable byte sizes | Falls back to raw byte counts |
| `xdg-open` | Opening HTML reports in a browser | Open the file manually |
| `less` | Paged JSON view in the reports manager | Read the file directly |
| `lsb_release` | Better distro detection in feedback bundles | Bundle still generated |

### Installing the two that matter

`jq` (report export) and `whiptail` (visual menu) are the two most people want.

```bash
# Debian / Ubuntu / Mint
sudo apt install jq whiptail

# Fedora / RHEL / Rocky
sudo dnf install jq newt

# Arch / Manjaro
sudo pacman -S jq libnewt

# openSUSE
sudo zypper install jq newt
```

The `whiptail` binary ships in the `newt` package on RPM-based distros and `libnewt` on Arch.

## Distro coverage

Cache cleanup inside `$HOME` — which is the large majority of what this tool reclaims — works identically on
every Linux distribution.

:::warning `--system` is Debian/Ubuntu only
The sudo mode calls `apt` and `dpkg` directly, with no distro detection and no guard. On Fedora, Arch or
openSUSE its package steps fail with "command not found".

Full breakdown of which steps work where: [Distro support](../distro-support.md).
:::

## Disk footprint

The tool's own output is negligible: a session log is 50–500 KB, a JSON report 5–50 KB, a feedback bundle
50–200 KB. A year of weekly cron runs totals a few megabytes. See
[Output paths](../reference/output-paths.md) for the layout and how to thin old files.

## Next

- [Installation](./installation.md) — the three install paths
- [Quick start](./quick-start.md) — your first cleanup
