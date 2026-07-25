---
title: Deletion is permanent
description: linux-cleanup has no undo, no trash, and no backup step. What that means in practice, why it was designed that way, and what your options actually are afterwards.
tags: [safety, irreversible, undo, data-loss, recovery]
sidebar_position: 4
---

# Deletion is permanent

**linux-cleanup calls `rm -rf`. There is no undo, no trash directory, no snapshot, and no backup step.**
Once a path is removed, this tool cannot bring it back, and neither can any flag you pass it.

:::danger Read this before your first destructive run
- Deleted files do **not** go to a trash or recycle bin.
- There is no `--undo`, no restore command, and no hidden copy kept anywhere.
- The session log and JSON report record **what was deleted**, not the data itself.
- If a file was irreplaceable and you had no backup, it is gone.

The tool's safety comes entirely from [refusing to delete the wrong thing](./guards.md) in the first place.
:::

## What "regenerable" actually promises

Most of what this tool removes is described as regenerable. That word is doing precise work, and it is worth
being exact about what it does and does not mean.

| It means | It does not mean |
|---|---|
| Some *other* program can recreate the data | linux-cleanup can recreate it |
| The next `yarn install` re-downloads the package | The bytes are still on your disk somewhere |
| The browser rebuilds its cache as you browse | The deletion is reversible |
| Recreation may need network, time, or both | Recreation is free or instant |

A Playwright browser bundle is regenerable — and re-downloading it takes several minutes and a few hundred
megabytes of bandwidth. An offline machine cannot regenerate it at all. Regenerable is a statement about
where the data can come from, not about how convenient it is to get back.

## The categories that are genuinely irreplaceable

Three targets are not regenerable in any sense. All three are
[interactive-only](./guards.md#guard-3--personal-data-is-interactive-only), and all three deserve real
attention when you are answering prompts.

| Target | Why nothing can bring it back |
|---|---|
| **Personal files** in `~/Downloads`, `~/Desktop` | No source to re-fetch from. If it was the only copy, that was the copy. |
| **Partial downloads** (`.crdownload`, `.part`, …) | Resumable only by the original browser session, which is usually long gone. |
| **Uncommitted work inside a stale `node_modules`** | Rare, but a patched dependency you edited in place is not in any registry. |

The first is the one that costs people data. `~/Downloads` is not a protected path — it *cannot* be, since
cleaning it is a core feature — so the only thing standing between a file there and deletion is you reading
the candidate list.

## Why there is no undo

The design rationale, stated plainly:

1. **An undo log is write amplification on the disk you are trying to free.** Preserving 20 GB in order to
   reclaim 20 GB accomplishes nothing.
2. **It would create false confidence.** A tool that appears reversible invites careless use, and the
   reversibility would be partial at best — an undo that restores 90% of cases is most dangerous in the
   other 10%.
3. **Prevention is a better investment than recovery.** The
   [allowlist](./guards.md#guard-1--the-path-allowlist),
   [staleness gate](./guards.md#guard-2--the-staleness-gate) and interactive confirmation stop the bad
   deletion from happening, which is strictly better than undoing it afterwards.

This is a reasonable trade for caches. It is a trade you should understand before pointing the tool at
`~/Downloads`.

## What you actually have afterwards

If a deletion surprises you, two artefacts exist. Both are records, not backups.

| Artefact | Location | Contains |
|---|---|---|
| Session log | `~/.linux-cleanup/logs/cleanup-<timestamp>.log` | Every path touched, its size, and the result of each removal |
| JSON report | `~/.linux-cleanup/reports/report-<timestamp>.json` | The same information, structured and schema-versioned |

They tell you exactly **what** was removed and **when** — which is what you need to decide whether to
restore from your own backup, re-download, or file a bug. They contain none of the deleted content.

Full procedure: [Recovery](../recovery.md).

## Reducing the risk before you run

```bash
# 1. Confirm the guards work on this install
npx linux-cleanup --self-test

# 2. See what would be reclaimed — deletes nothing
npx linux-cleanup --scan

# 3. Run guided, answering 'n' to anything you are unsure about
npx linux-cleanup
```

Beyond that:

- **Have a backup of anything irreplaceable.** This is true regardless of this tool; it is simply the only
  thing that makes any deletion recoverable.
- **Never point the personal-file modes at a machine you have not audited.** Run `--scan` first.
- **Keep `--all-safe -y` for caches on machines you already trust.** It cannot touch personal files, but it
  also shows you nothing until it finishes.
- **Treat `--purge-all` as a pre-reimage tool**, not a daily driver.

:::tip The one habit worth forming
Run `--scan` before `--all-safe`, every time. It costs a minute and it is the only step that shows you the
outcome while it is still hypothetical.
:::

## Next

- [Recovery](../recovery.md) — the procedure after an unwanted deletion
- [Safety guards](./guards.md) — what prevents the deletion in the first place
- [Preview before deleting](./preview-first.md) — the read-only modes
