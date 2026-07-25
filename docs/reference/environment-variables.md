---
title: Environment variables
description: Every environment variable linux-cleanup reads, with its default and effect — output directory overrides, colour control, and XDG config discovery.
tags: [environment, variables, configuration, no-color, xdg, reference]
sidebar_position: 4
---

# Environment variables

**Every environment variable linux-cleanup reads.** All are optional.

| Variable | Default | Effect |
|---|---|---|
| `NO_COLOR` | unset | Any non-empty value disables ANSI colour. The cross-tool standard from [no-color.org](https://no-color.org). Same as `--no-color` |
| `CLEANUP_NO_COLOR` | `0` | linux-cleanup-specific colour switch. Set to `1` to disable colour here only |
| `LINUX_CLEANUP_LOG_DIR` | `~/.linux-cleanup/logs/` (npx / npm) or `<repo>/logs/` (clone) | Where session logs go. Created if missing |
| `LINUX_CLEANUP_REPORTS_DIR` | `~/.linux-cleanup/reports/` or `<repo>/reports/` | Where JSON session records go. Created if missing |
| `LINUX_CLEANUP_DATA_HOME` | unset — falls back to the parent of the log dir | Parent for `logs/`, `reports/` and `feedback/` together |
| `LINUX_CLEANUP_NPX` | unset | **Internal.** Set to `1` by the Node launcher. Do not set it yourself |
| `XDG_CONFIG_HOME` | `~/.config` | Where `personal-roots.txt` and `project-roots.txt` are looked up |

## Redirecting all output

`LINUX_CLEANUP_DATA_HOME` is the single lever that moves everything — logs, records and feedback bundles:

```bash
export LINUX_CLEANUP_DATA_HOME="/mnt/secure/linux-cleanup"
linux-cleanup --scan
```

:::caution The directory is created, the mount is not
The tool creates `logs/`, `reports/` and `feedback/` beneath the path you give it. It does **not** create or
verify the underlying mount point. Point this at an unmounted path and output lands on the underlying
filesystem instead — quietly.

Verify the target is mounted and writable before relying on it.
:::

For finer control, `LINUX_CLEANUP_LOG_DIR` and `LINUX_CLEANUP_REPORTS_DIR` override individually and take
precedence over the data home.

## Colour control

```bash
export NO_COLOR=1          # everything on this machine, all tools
export CLEANUP_NO_COLOR=1  # only linux-cleanup
linux-cleanup --no-color   # only this invocation
```

`CLEANUP_NO_COLOR` exists for the case where you want colour from every other tool and plain output from
this one — typically when piping its output somewhere that mangles escape sequences.

## Configuring the scanned roots

Two files under `$XDG_CONFIG_HOME` (default `~/.config`) control which directories the personal and project
scanners walk:

| File | Used by | Default roots |
|---|---|---|
| `personal-roots.txt` | [`--stale`](../modes/personal-stale-files.md) | `~/Downloads`, `~/Desktop` |
| `project-roots.txt` | [`--node-modules`](../modes/node-modules-finder.md) | Your project directories |

One path per line. This follows the
[XDG Base Directory specification](https://specifications.freedesktop.org/basedir-spec/), so setting
`XDG_CONFIG_HOME` relocates both.

:::danger Adding a root to `personal-roots.txt` widens what can be deleted
The personal scanner is [interactive-only](../safety/guards.md#guard-3--personal-data-is-interactive-only),
so nothing is removed without your per-file confirmation — but a root you add is a directory whose contents
will start appearing in candidate lists.

The [path allowlist](./protected-paths.md) still applies and still wins: adding `~/Documents` here does not
make it deletable.
:::

## For CI and scripts

```bash
NO_COLOR=1 linux-cleanup --scan --no-report > /tmp/scan.log
```

`--no-report` skips JSON generation when only the log matters. Check the
[exit code](./exit-codes.md) rather than parsing output.

## What it does not read

- `PATH`, except to detect which optional tools are installed
- `USER` and `LOGNAME`, except to annotate the log header
- Your shell history, aliases or configuration — [`--doctor`](../modes/doctor.md) is the only mode that
  reads shell-init files, and only to check whether a runtime is wired in
- Any remote or network-provided configuration. There is none

If `$HOME` is unset the script aborts immediately rather than guessing. See
[Troubleshooting](../troubleshooting.md#home-is-not-set).

## Next

- [Output paths](./output-paths.md) — where files actually land
- [CLI flags](./cli-flags.md)
