---
title: System cleanup (sudo)
description: "The sudo system mode: apt, journal, Snap, kernel listing, aged files in /tmp and optional page-cache eviction."
tags: [system, sudo, apt, journal, snap, kernel, tmp, modes]
sidebar_position: 7
---

# System cleanup (sudo)

**`--system` requests sudo before it starts, then asks about each system step.** It uses `apt` and `dpkg` directly for package work, so the full mode is for Debian and Ubuntu. Other distributions may run the journal or `/tmp` parts but the package commands will fail; see [Distro support](../distro-support.md).

```bash
linux-cleanup --system --dry-run
linux-cleanup --system
```

A dry run prints proposed commands without removing cleanup targets or changing settings. It may still write a local log and update-check state. Review it before a real run, which has no undo.

## The six steps

| Step | What the source runs after confirmation | Default |
|---|---|---|
| apt | `sudo apt autoremove --purge -y`, then `sudo apt clean` | Yes |
| Journal | `sudo journalctl --vacuum-size=100M` | Yes |
| Snap | Eligible disabled revisions through `sudo snap remove` | Yes |
| Kernels | Lists installed `linux-image-*` packages through `dpkg` | No deletion |
| `/tmp` | `sudo find /tmp -mindepth 1 -atime +7 -delete` | Yes |
| Page cache | `sudo sync`, then `sudo sysctl -q -w vm.drop_caches=3` | No |

The journal target is 100 MB and the `/tmp` age is 7 days; neither follows `--days`. The Snap step keeps a disabled rollback revision until its replacement has met the configured age threshold, unless `--purge-all` is used. The kernel listing is informational; apt may remove superseded kernel packages in its earlier step.

The `/tmp` step relies on access times. If the filesystem does not record them reliably, the tool skips age-based deletion. Page-cache eviction frees RAM, not disk, and can make subsequent reads slower while cache fills again.

## Boundaries

The mode caches sudo credentials while it runs so it can issue its separate commands. Do not start a system cleanup unless you are prepared to review those commands. `--speed` has separate optional fixes that can also request sudo; system mode is not the only sudo-capable path in the CLI.

The size recovered depends on the machine. A disk-space change measured after the run may also include writes from other processes. Read the log for the commands the tool attempted.

## Read next

- [Preview before deleting](../safety/preview-first.md)
- [Safety guards](../safety/guards.md)
- [Distro support](../distro-support.md)
