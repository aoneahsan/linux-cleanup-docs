---
sidebar_position: 6
title: Troubleshooting the app
description: The AppImage will not start, sign-in does not finish, the account server is unreachable, or a schedule did not run.
---

# Troubleshooting the app

The app's **Help › Errors & offline** screen covers the same cases with a button for each. This page is the
long form.

## The AppImage does not open

- **Nothing happens on double-click.** The file needs to be executable: `chmod +x linux-cleanup_*_amd64.AppImage`.
- **An error mentions FUSE.** AppImages mount themselves with FUSE 2. Ubuntu 22.04 and later do not install it
  by default: `sudo apt install libfuse2` (on Ubuntu 24.04, `libfuse2t64`). Without it, the AppImage can also
  run as `./linux-cleanup_*_amd64.AppImage --appimage-extract-and-run`.
- **An error mentions WebKitGTK or `libwebkit2gtk-4.1`.** The window needs WebKitGTK 4.1 from your
  distribution. On Debian and Ubuntu, the `.deb` pulls it in; with the AppImage, install `libwebkit2gtk-4.1-0`.

## The app says the bundled CLI is missing

The app checks its own copy of `cleanup.sh` at start. If that check fails, the installation is damaged:
download the release again from the [download page](https://linux-cleanup.aoneahsan.com/download). Your
receipts, reports and logs are not touched by a reinstall.

## Sign-in does not finish

Sign-in runs in your browser and returns to the app through `127.0.0.1`. If the browser shows the result but
the app does not move on, a firewall or a browser extension may be blocking local addresses. Nothing changes on
a failed sign-in; **Sign in with Google** can be pressed again.

## The account server does not answer

Dry runs, real runs, receipts and schedules never need the internet. Offline, the app keeps counting real runs
against this computer's monthly pool and syncs when the server answers again. Only plan changes and synced
history wait.

## A schedule did not run

```bash
systemctl --user list-timers 'linux-cleanup-schedule-*'
journalctl --user -u 'linux-cleanup-schedule-*' --since today
```

A timer fires only while you are logged in; one missed while the computer was off runs at the next login.
Each run that did start leaves its stream in `~/.linux-cleanup/schedule-runs/`, and the app turns it into a
receipt when you next open it.
