---
title: Reclaim space deliberately
description: Inspect Linux disk use, preview each cleanup mode, then choose cache, project or system paths one at a time.
tags: [guide, disk-space, reclaim, purge-all, recipe]
sidebar_position: 1
---

# Reclaim space deliberately

**Measure first. Choose the smallest cleanup scope that addresses the paths you found.** A reported cache-root size is not a promise that a cleanup can or should remove all of it.

## 1. Find the large paths

```bash
linux-cleanup --audit
linux-cleanup --scan
```

`--audit` lists large entries in `$HOME`, including things this tool cannot clean. `--scan` lists configured cache roots and other candidates without deleting. If a VM image, dataset or game library is the main use of disk, inspect it directly instead of running unrelated cleanup modes.

## 2. Preview routine caches

```bash
linux-cleanup --all-safe --dry-run
```

The default all-safe mode prunes eligible regenerable caches after the 100-day idle threshold. The preview walks those rules without deleting. A local log and update-check state may still be written.

If every proposed path is one you can rebuild or download again, run `linux-cleanup --all-safe` and review its confirmation. `--yes` is for an unattended run after you have already reviewed this machine.

## 3. Review project dependencies separately

```bash
linux-cleanup --node-modules --dry-run
```

The project dependency mode is interactive. Check the project path and its lockfile before a real deletion. A local change made inside `node_modules` is not restored by reinstalling dependencies.

## 4. Review system storage separately

```bash
linux-cleanup --system --dry-run
```

The full system mode uses apt and dpkg, so it is for Debian and Ubuntu. It requests sudo and includes a journal vacuum, aged `/tmp` files and an optional page-cache step. The page-cache step affects RAM, not disk. See [System cleanup](../modes/system-cleanup.md).

## 5. Change the age threshold only after another preview

`--days N` changes which idle files or whole cache units qualify. Lowering it from 100 to 30 can remove material you used recently, so inspect a dry run with the chosen value first. `--purge-all` disables the age guard; it can remove a Gradle distribution or test browser you will need to download again.

## 6. Keep personal files as a separate decision

`--stale` shows large idle personal-file candidates and asks for each deletion. An old download may be your only copy. `--yes` does not approve this mode. See [Stale personal files](../modes/personal-stale-files.md) and [Deletion is permanent](../safety/irreversibility.md).

The space recovered varies by machine and by other processes writing during the run. Inspect the final log and the paths kept before deciding whether another mode is needed.
