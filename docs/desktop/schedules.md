---
sidebar_position: 3
title: Schedules
description: Scheduled dry runs and all-safe cleanups as systemd user timers.
---

# Schedules

Schedules are part of the Pro and Team plans. A schedule is a pair of **systemd user units** in
`~/.config/systemd/user/`, named `linux-cleanup-schedule-<id>.timer` and `.service`. It runs either a dry
run or the all-safe cleanup, daily, weekly or on a day of the month (1 to 28).

The timer uses `Persistent=true`: if the computer was off at the set time, the run happens at the next
login. Each scheduled run writes its event stream to `~/.linux-cleanup/schedule-runs/`, and the app turns
it into a receipt the next time you open it.

Because an AppImage's files disappear when the app closes, a schedule runs a copy of the bundled CLI in
`~/.linux-cleanup/desktop-engine/`. The app refreshes that copy whenever it starts, so a timer always
runs the version the app ships.

To see or stop a timer from a terminal:

```bash
systemctl --user list-timers 'linux-cleanup-schedule-*'
systemctl --user disable --now linux-cleanup-schedule-<id>.timer
```
