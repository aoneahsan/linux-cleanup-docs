---
title: Menu
description: The numbered jump-to menu that lets you run a single linux-cleanup category at a time instead of the full walkthrough.
tags: [menu, interactive, modes]
sidebar_position: 4
---

# Menu

**`--menu` prints a numbered list of every category and runs the one you pick.** Use it when you know what
you want and do not need the ten-step tour.

```bash
linux-cleanup --menu     # or: -m, -i, --interactive
```

## How it differs from the walkthrough

| | Menu | [Walkthrough](./walkthrough.md) |
|---|---|---|
| Order | You choose | Fixed, ten steps |
| Scope | One category per selection | Everything, in sequence |
| Loops | Returns to the menu afterwards | Runs to the end |
| Report | Per action | One session report |
| Best for | Targeted cleanup | First runs, full sweeps |

The safety model is identical. Every category behaves exactly as it does in the walkthrough — the
[allowlist](../safety/guards.md#guard-1--the-path-allowlist), the
[staleness gate](../safety/guards.md#guard-2--the-staleness-gate) and per-target confirmation all apply.
Picking a personal-data category from the menu still gives you per-entry prompts, and `--yes` still has no
effect on it.

## Options still apply

```bash
linux-cleanup --menu -d 30        # 30-day threshold for whatever you pick
linux-cleanup --menu --purge-all  # staleness gate off
linux-cleanup --menu --no-color   # plain output
```

## When to use the TUI instead

[`--tui`](./tui.md) is the same menu rendered as a whiptail or dialog box. It needs one of those installed;
`--menu` needs nothing beyond bash and works over any connection, including a dumb terminal or a
`ssh -T` session where a full-screen dialog would misbehave.

## Next

- [TUI](./tui.md) — the visual version
- [Modes overview](./overview.md) — every category the menu lists
