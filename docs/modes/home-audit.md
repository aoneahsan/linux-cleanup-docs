---
title: Home audit
description: A read-only listing of the 20 largest entries in your home directory, whether or not linux-cleanup can clean them — the fastest way to find out what is actually using your disk.
tags: [audit, disk-usage, read-only, home, modes]
sidebar_position: 13
---

# Home audit

**`--audit` lists the 20 largest entries in `$HOME`, sorted by size.** It deletes nothing and it does not
care whether the tool can clean what it finds.

```bash
linux-cleanup --audit
```

## Why this is different from `--scan`

[`--scan`](./scan.md) measures the categories linux-cleanup knows how to clean. `--audit` measures your home
directory, full stop.

That difference is the point. If a 60 GB VM image, a downloaded dataset, or a Steam library is what actually
filled your disk, `--scan` will never mention it and `--audit` will put it at the top of the list.

| | `--audit` | `--scan` |
|---|---|---|
| Scope | Everything in `$HOME` | Only cleanable categories |
| Answers | What is using my disk? | What can this tool reclaim? |
| Writes a report | No | Yes |
| Deletes | Never | Never |

## The usual workflow

```bash
linux-cleanup --audit    # what is big?
linux-cleanup --scan     # what can this tool reclaim?
```

If the audit's top entries appear in the scan, the tool can help. If they do not, you have learned something
more useful — the space is somewhere this tool does not go, and you can deal with it directly.

Common large things linux-cleanup will **not** clean:

- VM images and container storage (`~/.local/share/libvirt`, `~/.local/share/docker`)
- Game libraries (Steam, Lutris)
- Datasets, model weights, media libraries
- Anything in `~/Documents`, `~/Pictures`, `~/Music`, `~/Videos` — all
  [protected](../reference/protected-paths.md)

## Following up on a finding

```bash
du -sh ~/.local/share/*      | sort -rh | head -20
du -sh ~/*                   | sort -rh | head -20
```

`--audit` is the fast first pass; `du` narrows it down once you know where to look.

## Next

- [Scan](./scan.md) — what the tool can reclaim
- [Reclaim the most space](../guides/reclaim-the-most-space.md)
