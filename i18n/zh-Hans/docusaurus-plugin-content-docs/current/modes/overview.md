---
title: 模式概览
description: 按用途分组的所有 linux-cleanup 模式——只读检查、引导和批量清理、交互式个人数据模式，以及输出和修复辅助工具。
tags: [modes, overview, cli, reference]
sidebar_position: 1
---

# 模式概览

**linux-cleanup 只有一个入口，由单个参数决定模式。** 不带参数运行，就是[引导流程](./walkthrough.md)。

模式之间互斥——只传一个。`--days` 和 `--yes` 等选项可以与它们组合。

## 只读——从不删除任何东西 {#read-only--never-deletes-anything}

这些模式不会删除清理目标。它们仍可能写一份本地日志，联网时版本检查可能会读取一份公开记录。

| 模式 | 参数 | 显示 |
|---|---|---|
| [扫描](./scan.md) | `-s` `--scan` | 所有缓存类别及当前大小 |
| [主目录检查](./home-audit.md) | `--audit` | `$HOME` 中最大的 20 个条目 |
| [全局包检查](./globals-audit.md) | `--globals` | npm/pnpm/yarn/bun/deno 的全局包 |
| 列出目标 | `--list-targets` | 工具能触及的每条路径，以及受保护列表 |
| 自检 | `--self-test` | 依赖、语法和安全防护检查 |
| 版本 | `-V` `--version` | 版本和作者 |

## 清理——可再生成的数据 {#cleanup--regenerable-data}

这些模式可以删除清理目标。`--yes` 只在 `--all-safe` 中跳过整批确认；其他模式保留各自的提示。

| 模式 | 参数 | 行为 |
|---|---|---|
| [引导流程](./walkthrough.md) | _(默认)_ `-w` | 十个引导步骤，每步前都询问 |
| [菜单](./menu.md) | `-m` `--menu` | 编号菜单——选一个类别 |
| [TUI](./tui.md) | `-t` `--tui` | 同上，以 whiptail/dialog 对话框呈现 |
| [全安全](./all-safe.md) | `-a` `--all-safe` | 一次处理所有可再生成的缓存 |
| [编辑器扩展](./editor-extensions.md) | `--editor-ext` | 已被取代的 VS Code / Cursor 版本 |
| [系统清理](./system-cleanup.md) | `--system` | apt、日志、snap、`/tmp`、页面缓存——需要 `sudo` |

## 清理——仅限交互式 {#cleanup--interactive-only}

个人或项目数据。这些模式**忽略 `--yes`**，需要逐项确认。见[关卡 3](../safety/guards.md#guard-3--personal-data-is-interactive-only)。

| 模式 | 参数 | 查找 |
|---|---|---|
| [长期未用的个人文件](./personal-stale-files.md) | `-p` `--stale` | `~/Downloads` 和已配置的未受保护根目录中体积大的闲置文件 |
| [未完成的下载](./partial-downloads.md) | `--partials` | `.fdmdownload`、`.crdownload`、`.part` |
| [node_modules 查找](./node-modules-finder.md) | `--node-modules` | 闲置 N 天以上的项目依赖目录 |

## 输出、修复与设置 {#output-repair-and-setup}

| 模式 | 参数 | 用途 |
|---|---|---|
| [报告](./reports.md) | `--reports` | 列出、转换、查看过去的会话报告 |
| [导出](./reports.md#exporting) | `--export FMT ID` | 非交互式转换 |
| [诊断](./doctor.md) | `--doctor` | 修复 nvm、pnpm、bun、deno、cargo 损坏的 shell 初始化 |
| [速度诊断](./speed.md) | `--speed` | 测量压力和开机启动项；可选修复会单独询问 |
| 反馈 | `--feedback` | bug 报告说明，可选的 mailto 草稿 |
| 调试包 | `--debug-bundle` | 把最新的日志和报告打包成 tar.gz |
| 安装别名 | `--install-alias` | 添加 shell 别名 `cleanup` |
| 安装 cron | `--install-cron` | 每周日 03:00 运行 `--all-safe -y` |
| 卸载别名 / cron | `--uninstall-alias` `--uninstall-cron` | 移除其中任一项 |

## 选择模式 {#choosing-a-mode}

| 目标 | 模式 |
|---|---|
| 第一次使用这个工具 | `--self-test`, `--scan`, `--all-safe --dry-run` |
| 现在就腾出空间，并保持掌控 | _(默认的引导流程)_ |
| 现在就腾出空间，不要提示 | `--all-safe -y` |
| 某一个特定类别 | `--menu` / `--tui` |
| 每周无人值守维护 | `--all-safe -y` + `--install-cron` |
| 重装系统前最大限度回收 | `--all-safe -y --purge-all` |
| 找出是什么在吃磁盘 | `--audit`, `--scan` |
| 旧的副项目越堆越多 | `--node-modules` |
| 安装后出现 `command not found` | `--doctor` |

## 可与模式组合的选项 {#options-that-combine-with-modes}

| 选项 | 默认值 | 效果 |
|---|---|---|
| `-d N` `--days N` | 100 | 闲置阈值。越小越激进 |
| `--purge-all` | 关 | 关闭闲置阈值关卡——完全清空 |
| `-y` `--yes` | 关 | 自动确认可再生成的缓存。仅适用于 `--all-safe` |
| `--no-report` | 关 | 跳过 JSON 报告。日志仍会写入 |
| `--cleanup-logs` | 关 | 结束时删除本次运行的日志。报告始终保留 |
| `--no-color` | 关 | 关闭 ANSI 颜色。也会遵守 `NO_COLOR` |
| `-n` `--dry-run` | 关 | 走完所选清理而不删除；仍可能写入本地日志和更新检查状态 |
| `--json-events` | 关 | 为 `--scan` 或非交互式 `--all-safe --yes` 输出 NDJSON |

完整说明：[命令行参数](../reference/cli-flags.md)和[模式对照表](../reference/modes-matrix.md)。
