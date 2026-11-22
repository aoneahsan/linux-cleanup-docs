---
sidebar_position: 2
title: Install and update
description: Install the linux-cleanup desktop app as an AppImage or a .deb, and how it updates itself.
---

# Install and update

Download the current release from the [download page](https://linux-cleanup.aoneahsan.com/download); every
release is also on [GitHub Releases](https://github.com/aoneahsan/linux-cleanup/releases) under a
`desktop-v<version>` tag. Each release carries two installers:

| File | For |
|---|---|
| `linux-cleanup_<version>_amd64.AppImage` | Any distribution with a desktop session. Make it executable, then run it |
| `linux-cleanup_<version>_amd64.deb` | Debian, Ubuntu and their derivatives (`sudo apt install ./linux-cleanup_<version>_amd64.deb`) |

```bash
chmod +x linux-cleanup_*_amd64.AppImage
./linux-cleanup_*_amd64.AppImage
```

From version 1.0.4, the AppImage adds itself to your applications menu the first time it runs: it writes
`~/.local/share/applications/linux-cleanup-desktop.desktop` and its icon under `~/.local/share/icons/hicolor/`,
and points the entry at wherever the file is. If you move the AppImage, run it once from the new place and the
entry follows. The `.deb` installs its own menu entry.

The desktop app needs WebKitGTK 4.1 and GTK 3, which current desktop distributions ship. The `.deb`
declares them as dependencies.

## How it updates

The app updates itself. It checks for a signed update when it starts, when its window comes back into
view, and the moment a new release is published. With **Install updates automatically** on (the
default), it downloads the update, checks its signature, and relaunches at a quiet moment: never while a
run is in progress.

An **AppImage** is replaced in place. A **`.deb`** install updates through `dpkg`, so your desktop asks for an
administrator password first (the usual graphical prompt); cancelling it leaves the current version running.

A release can also be marked **required**:

- an **urgent** release stops the app at once, says why, and offers one **Update** button;
- a **normal** release says that a new version is out, and from the next start it is required.

If the app is offline when it checks, it carries on; a check that fails never blocks a run.
