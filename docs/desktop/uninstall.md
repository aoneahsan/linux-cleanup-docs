---
sidebar_position: 7
title: Uninstall
description: Remove the desktop app, its schedules and what it keeps on your computer.
---

# Uninstall

## Remove the schedules first

Schedules are systemd user timers, and they run a copy of the CLI outside the app. Removing the app does
**not** remove them. Delete each one on the **Schedules** screen before you uninstall, or from a terminal:

```bash
systemctl --user disable --now 'linux-cleanup-schedule-*.timer'
rm -f ~/.config/systemd/user/linux-cleanup-schedule-*.{timer,service}
systemctl --user daemon-reload
```

## Remove the app

| Installed as | Remove with |
|---|---|
| AppImage | Delete the `.AppImage` file |
| `.deb` | `sudo apt remove linux-cleanup` |

## What stays behind

| Folder | Holds | Remove it if |
|---|---|---|
| `~/.linux-cleanup/` | Reports, logs, scheduled-run streams and the schedules' CLI copy. The terminal CLI uses the same folder | You no longer use the CLI either |
| `~/.local/share/com.aoneahsan.linuxcleanup/` | The app's settings, receipts and this computer's random device id | Always safe to remove after uninstalling |

A signed-in account lives on after the app is gone. Delete it from **Account** before uninstalling; deletion
removes the account and its synced numbers from the server.
