---
title: System cleanup (sudo)
description: The only linux-cleanup mode that uses sudo — apt, journal vacuum, snap revisions, kernel listing, /tmp aging and page-cache drop. Debian and Ubuntu only.
tags: [system, sudo, apt, journal, snap, kernel, tmp, modes]
sidebar_position: 7
---

# System cleanup (sudo)

**`--system` is the only mode that calls `sudo`.** It runs six steps against system-managed storage, each
prompting separately.

```bash
linux-cleanup --system
```

:::warning This mode is Debian/Ubuntu only
The package steps call `apt` and `dpkg` directly. There is no distro detection and no `command -v` guard, so
on Fedora, Arch or openSUSE those steps fail with "command not found" rather than adapting.

The journal, `/tmp` and page-cache steps use `journalctl`, `find` and `sysctl` and work on any systemd
distro. Full breakdown: [Distro support](../distro-support.md).
:::

## The six steps

Each is a separate prompt. The default answer is shown — Enter accepts it.

| # | Step | Command | Default |
|---|---|---|---|
| 1 | apt cleanup | `apt autoremove --purge -y` then `apt clean` | **Yes** |
| 2 | Journal vacuum | `journalctl --vacuum-size=100M` | **Yes** |
| 3 | Snap revisions | Removes disabled snap revisions | **Yes** |
| 4 | Kernels | Lists installed kernels — **deletes nothing** | — |
| 5 | `/tmp` aging | Removes files with `atime` older than 7 days | **Yes** |
| 6 | Page cache | `sync` then `sysctl vm.drop_caches=3` | **No** |

If `sudo` is unavailable the mode aborts immediately rather than running in a degraded state.

### 1. apt cleanup

`apt autoremove --purge -y` removes packages nothing depends on any more, including superseded kernels.
`apt clean` empties the downloaded `.deb` archive cache.

This is the step that reclaims most of the space, typically 500 MB to 3 GB. The `--purge` means
configuration files of removed packages go too.

### 2. Journal vacuum

Trims the systemd journal to **100 MB**. This value is hardcoded and does **not** follow `--days`.

The step first prints current journal usage so you can see whether it is worth doing. On a machine that has
been up for a year the journal is often 1–4 GB.

### 3. Snap revisions

Snap keeps old revisions of each package so you can roll back. This removes the ones already marked
disabled, which are dead weight. The step is skipped cleanly when `snap` is not installed.

Typically reclaims 1–5 GB on a snap-heavy Ubuntu install.

### 4. Kernels — listing only

:::note This step deletes nothing
It prints the running kernel and lists installed `linux-image-*` packages for visibility. Removal of
superseded kernels is handled by `apt autoremove` in step 1.

Some third-party descriptions of this tool state that it removes old kernel packages directly. It does not —
it shows you what is installed and leaves the removal to apt.
:::

### 5. `/tmp` aging

Removes files under `/tmp` whose `atime` is older than **7 days**. Like the journal size, this threshold is
hardcoded and does not follow `--days`.

Most distros already clear `/tmp` on boot or via `systemd-tmpfiles`, so on a frequently-rebooted machine
this reclaims very little.

### 6. Page cache

`sync` followed by `sysctl vm.drop_caches=3`. This is the only step that defaults to **No**, and the only
one that does not free disk space at all — it releases cached memory.

It is harmless: the kernel repopulates the cache on demand. It is also close to pointless in normal
operation, since the kernel already evicts cache under memory pressure. Its real use is making a memory
measurement reproducible. Expect the machine to feel briefly slower afterwards as caches refill.

## What it does not do

- Does not hold a long-lived root session — each `sudo` call is separate and reviewable
- Does not edit `/etc/sudoers`
- Does not install, remove, enable or disable any service
- Does not touch `/home` or any user data
- Does not escalate silently — you will be prompted for your password by `sudo` itself

## Reclaim expectations

| Step | Typical reclaim |
|---|---|
| apt | 500 MB – 3 GB |
| Journal | 500 MB – 4 GB |
| Snap | 1 – 5 GB |
| `/tmp` | 0 – 500 MB |
| Kernels | 0 (listing only) |
| Page cache | 0 disk (frees RAM) |

Quarterly is a reasonable cadence. There is little point running it weekly — apt and journal growth is slow.

## Running it inside the walkthrough

`--system` is step 8 of the [guided walkthrough](./walkthrough.md), so a full walkthrough already offers it.
Skip it there with `s` if you would rather not enter a password mid-session, and run it separately later.

## Next

- [Distro support](../distro-support.md) — what works outside Debian/Ubuntu
- [Safety guards](../safety/guards.md#guard-4--sudo-confinement) — how sudo is confined
- [Reclaim the most space](../guides/reclaim-the-most-space.md)
