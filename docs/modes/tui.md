---
title: TUI (visual menu)
description: The whiptail or dialog driven visual menu added in linux-cleanup 1.3.0, with graceful fallback to the CLI menu when neither tool is installed.
tags: [tui, whiptail, dialog, visual, menu, modes]
sidebar_position: 5
---

# TUI (visual menu)

**`--tui` renders the category menu as a full-screen whiptail or dialog box.** Added in
[1.3.0](../changelog.md#130--2026-05-10). Same behaviour as [`--menu`](./menu.md), different presentation.

```bash
linux-cleanup --tui      # or: -t, -g, --gui
```

## How it behaves

Selecting an entry drops out of the dialog, runs that category with the normal CLI output and prompts, then
returns to the menu. So the dialog is a launcher — the actual confirmations are still the standard
text prompts, and every safety guard is unchanged.

The TUI also carries an **About** dialog showing version, contact details, licence and the privacy
guarantee.

## Requirements and fallback

Needs `whiptail` or `dialog`. If neither is present, the tool prints a per-distro install hint and falls back
to the regular CLI menu — it does not fail.

```bash
sudo apt install whiptail     # Debian / Ubuntu
sudo dnf install newt         # Fedora / RHEL
sudo pacman -S libnewt        # Arch
```

`whiptail` ships inside the `newt` / `libnewt` packages on RPM and Arch systems, which is why the package
name does not match the command name.

:::note This is the only place the tool detects your distro
The install hint above is distro-aware. Nothing else in linux-cleanup is — notably
[`--system` assumes Debian/Ubuntu](../distro-support.md).
:::

## When to use the plain menu

`--tui` needs a terminal that can render a full-screen dialog. Over a constrained connection, inside a CI
log, or in a `ssh -T` session without a TTY, use [`--menu`](./menu.md) instead — it needs nothing beyond
bash.

## Next

- [Menu](./menu.md) — the text equivalent
- [Modes overview](./overview.md)
