---
sidebar_position: 7
title: 卸载
description: 移除桌面应用、它的计划以及它保存在您电脑上的内容。
---

# 卸载

## 先移除计划 {#remove-the-schedules-first}

计划是 systemd 用户定时器，它们在应用之外运行命令行的一份副本。移除应用**不会**移除它们。卸载前，请在 **计划** 界面删除每一个计划，或在终端中执行：

```bash
systemctl --user disable --now 'linux-cleanup-schedule-*.timer'
rm -f ~/.config/systemd/user/linux-cleanup-schedule-*.{timer,service}
systemctl --user daemon-reload
```

## 移除应用 {#remove-the-app}

| 安装方式 | 移除方法 |
|---|---|
| AppImage | 删除 `.AppImage` 文件，再删除它的菜单项: `rm ~/.local/share/applications/linux-cleanup-desktop.desktop ~/.local/share/icons/hicolor/*/apps/linux-cleanup-desktop.png` |
| `.deb` | `sudo apt remove linux-cleanup` |

## 会留下什么 {#what-stays-behind}

| 文件夹 | 内容 | 何时删除 |
|---|---|---|
| `~/.linux-cleanup/` | 报告、日志、计划运行的事件流和计划使用的命令行副本。终端里的命令行也使用同一个文件夹 | 您也不再使用命令行时 |
| `~/.local/share/com.aoneahsan.linuxcleanup/` | 应用的设置、清理回执，以及这台电脑的随机设备 ID | 卸载后随时可以安全删除 |

应用卸载后，已登录的账户仍然存在。请在卸载前到 **账户** 中删除它；删除会从服务器上移除账户及其同步的数字。
