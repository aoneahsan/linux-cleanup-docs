---
sidebar_position: 3
title: 计划
description: 以 systemd 用户定时器运行的计划试运行和全安全清理。
---

# 计划

计划属于 Pro 和 Team 套餐。一个计划就是 `~/.config/systemd/user/` 中的一对 **systemd 用户单元**，名为 `linux-cleanup-schedule-<id>.timer` 和 `.service`。它会按每天、每周或每月某一天（1 到 28 日）运行一次试运行或全安全清理。

定时器使用 `Persistent=true`：如果到了设定时间电脑没开，运行会在下次登录时进行。每次计划运行都会把事件流写入 `~/.linux-cleanup/schedule-runs/`，应用会在您下次打开它时把它变成一份清理回执。

由于 AppImage 的文件会在应用关闭时消失，计划运行的是 `~/.linux-cleanup/desktop-engine/` 中内置命令行的一份副本。应用每次启动都会刷新这份副本，所以定时器运行的始终是应用自带的版本。

在终端中查看或停止定时器：

```bash
systemctl --user list-timers 'linux-cleanup-schedule-*'
systemctl --user disable --now linux-cleanup-schedule-<id>.timer
```
