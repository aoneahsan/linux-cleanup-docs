---
sidebar_position: 6
title: 应用故障排查
description: AppImage 无法启动、登录无法完成、账户服务器无法访问，或计划没有运行。
---

# 应用故障排查

应用的 **帮助 › 错误与离线** 界面涵盖了同样的情况，每种情况都有一个按钮。本页是详细版本。

## AppImage 打不开 {#the-appimage-does-not-open}

- **双击没有反应。** 文件需要可执行权限：`chmod +x linux-cleanup_*_amd64.AppImage`。
- **错误提到 FUSE。** AppImage 用 FUSE 2 挂载自己。Ubuntu 22.04 及更新版本默认不安装它：`sudo apt install libfuse2`（Ubuntu 24.04 上是 `libfuse2t64`）。没有它时，AppImage 也可以用 `./linux-cleanup_*_amd64.AppImage --appimage-extract-and-run` 运行。
- **错误提到 WebKitGTK 或 `libwebkit2gtk-4.1`。** 窗口需要您的发行版提供的 WebKitGTK 4.1。在 Debian 和 Ubuntu 上，`.deb` 会自动带上它；使用 AppImage 时，请安装 `libwebkit2gtk-4.1-0`。

## 应用提示缺少内置的命令行 {#the-app-says-the-bundled-cli-is-missing}

应用启动时会检查自己的 `cleanup.sh` 副本。如果检查失败，说明安装已损坏：请从[下载页面](https://linux-cleanup.aoneahsan.com/download)重新下载该版本。重新安装不会影响您的清理回执、报告和日志。

## 登录无法完成 {#sign-in-does-not-finish}

登录在浏览器中进行，并通过 `127.0.0.1` 回到应用。如果浏览器显示了结果，应用却没有继续，可能是防火墙或浏览器扩展拦截了本地地址。登录失败不会改变任何东西；可以再次按 **用 Google 登录**。

## 账户服务器没有响应 {#the-account-server-does-not-answer}

试运行、实际运行、清理回执和计划都从不需要联网。离线时，应用会继续按这台电脑的每月额度计算实际运行次数，并在服务器恢复响应时同步。只有套餐变更和同步的历史会等待。

## 计划没有运行 {#a-schedule-did-not-run}

```bash
systemctl --user list-timers 'linux-cleanup-schedule-*'
journalctl --user -u 'linux-cleanup-schedule-*' --since today
```

定时器只在您登录时触发；电脑关机期间错过的运行会在下次登录时进行。每次确实开始的运行都会在 `~/.linux-cleanup/schedule-runs/` 中留下事件流，应用会在您下次打开它时把它变成清理回执。
