---
sidebar_position: 1
title: 桌面应用
description: linux-cleanup 桌面应用是什么、它如何运行命令行，以及它会从您的电脑发出什么。
---

# 桌面应用

桌面应用就是放在窗口里的 linux-cleanup。它内置了本站所记录的同一个命令行，并通过它运行一种模式：[全安全清理](../modes/all-safe.md)，先是试运行，您确认后再进行实际运行。关于删除什么、拒绝什么的每一条规则都属于命令行；应用只展示这些决定，从不修改它们。

## 它如何运行命令行 {#how-it-runs-the-cli}

应用只会用两组参数中的一组启动内置的 `cleanup.sh`，并读取它的 [`--json-events`](../reference/json-events.md) 事件流：

| 您按下 | 应用运行 |
|---|---|
| **开始试运行** | `--all-safe --yes --dry-run --json-events` |
| **立即运行清理** | `--all-safe --yes --json-events` |

报告和日志写入 `~/.linux-cleanup/reports/` 和 `~/.linux-cleanup/logs/`，与 `npx linux-cleanup` 运行时使用的文件夹相同，所以应用和终端共享同一份历史。

内置的副本会跳过命令行自己的更新检查（`LINUX_CLEANUP_LAUNCHER=desktop`）。应用改为检查自身的更新；见[安装与更新](./install.md)。

## 什么会离开您的电脑 {#what-leaves-your-computer}

| 数据 | 会离开电脑吗？ |
|---|---|
| 文件和文件夹路径、文件名 | 从不 |
| 步骤结果、大小、运行前后的可用空间、发行版名称 | 仅在您登录后，以数字形式 |
| 打开了哪些界面、执行了哪些操作 | 用 Amplitude 计数，不含路径、名称或您的邮箱 |

登录是可选的。未登录时，试运行、实际运行、清理回执和计划都能在这台电脑上使用；每月的实际运行额度按电脑计算。

## 删除是永久的 {#removal-is-permanent}

实际运行会像命令行一样删除文件：永久删除，不保留副本。实际运行之前，应用要求有一次最近的试运行，确认界面会在执行任何操作前用直白的话说明这一点。
