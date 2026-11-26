---
title: 模式对照表
description: 所有 linux-cleanup 模式并列对照：是否删除、是否交互、是否使用 sudo、是否写入会话记录。
tags: [modes, matrix, reference, comparison]
sidebar_position: 2
---

# 模式对照表

一眼看清所有模式。用它回答“这会删除东西吗？”，不必读完整个页面。

## 对照表 {#the-matrix}

| 模式 | 参数 | 删除 | 交互式 | sudo | 写入记录 |
|---|---|---|---|---|---|
| [引导流程](../modes/walkthrough.md) | _（无）_ `-w` | 是 | 是 | 仅第 8 步 | 是 |
| [菜单](../modes/menu.md) | `-m` | 是 | 是 | 选中时 | 否 |
| [TUI](../modes/tui.md) | `-t` | 是 | 是 | 选中时 | 否 |
| [全安全](../modes/all-safe.md) | `-a` | 是 | 除非用 `-y` | 否 | 否 |
| [扫描](../modes/scan.md) | `-s` | **否** | 否 | 否 | 否 |
| [长期未用的个人文件](../modes/personal-stale-files.md) | `-p` | 是 | **始终** | 否 | 否 |
| [系统](../modes/system-cleanup.md) | `--system` | 是 | 是 | **是** | 否 |
| [未完成的下载](../modes/partial-downloads.md) | `--partials` | 是 | **始终** | 否 | 否 |
| [主目录检查](../modes/home-audit.md) | `--audit` | **否** | 否 | 否 | 否 |
| [node_modules](../modes/node-modules-finder.md) | `--node-modules` | 是 | **始终** | 否 | 否 |
| [全局包检查](../modes/globals-audit.md) | `--globals` | **否** | 否 | 否 | 否 |
| [诊断](../modes/doctor.md) | `--doctor` | **否**——只追加 | 是 | 否 | 否 |
| [编辑器扩展](../modes/editor-extensions.md) | `--editor-ext` | 是 | 是 | 否 | 否 |
| [速度](../modes/speed.md) | `--speed` | 不删除文件；可选设置 | 是 | 否 | 否 |
| [报告](../modes/reports.md) | `--reports` | 仅记录 | 是 | 否 | 否 |
| 导出 | `--export` | **否** | 否 | 否 | 否 |
| 反馈 | `--feedback` | **否** | 是 | 否 | 否 |
| 调试包 | `--debug-bundle` | **否** | 否 | 否 | 否 |
| 列出目标 | `--list-targets` | **否** | 否 | 否 | 否 |
| 自检 | `--self-test` | **否** | 否 | 否 | 否 |
| 版本 | `-V` | **否** | 否 | 否 | 否 |
| 安装别名 | `--install-alias` | **否** | 是 | 否 | 否 |
| 安装 cron | `--install-cron` | **否** | 是 | 否 | 否 |
| 刷新桌面应用 | `--refresh-app` | 从发布版本更新应用 | 是 | 否 | 否 |
| 卸载别名 | `--uninstall-alias` | 别名那一行 | 是 | 否 | 否 |
| 卸载 cron | `--uninstall-cron` | cron 那一行 | 是 | 否 | 否 |

## 从不删除任何东西的模式 {#modes-that-never-delete-anything}

这些命令不会删除清理目标。有些会写入本地日志、报告、导出文件或诊断包：

`--scan` · `--audit` · `--globals` · `--list-targets` · `--self-test` · `--version` · `--export` ·
`--feedback` · `--debug-bundle`

`--doctor` 也属于这里，但有一点要说明：它会修改您的 shell 配置，不过只会在确认后**追加**内容，从不删除或改写已有的行。

## 受 `--yes` 影响的模式 {#modes---yes-affects}

只有一个：[`--all-safe`](../modes/all-safe.md)。

涉及个人数据的交互式模式——`--stale`、`--partials`、`--node-modules`——需要各自的确认。见[关卡 3](../safety/guards.md#guard-3--personal-data-is-interactive-only)。

## 适用闲置关卡的模式 {#modes-the-staleness-gate-applies-to}

| 适用 | 不适用 |
|---|---|
| 引导流程、菜单、TUI、全安全中的缓存清理 | `--system`（使用它自己写死的 7 天 `/tmp` 规则） |
| `--editor-ext` 的旧版本替换 | `--partials`（判断依据不是存在时间） |
| `--node-modules` | 只读模式（不删除任何东西） |
| `--stale` |  |
| 开发工具数据（AVD、flatpak、pub-cache） |  |

`--purge-all` 会在原本适用闲置关卡的地方关闭它。

## 哪些模式需要可选依赖 {#which-modes-need-optional-dependencies}

| 模式 | 需要 | 没有时 |
|---|---|---|
| `--tui` | `whiptail` 或 `dialog` | 退回到 `--menu`，并给出安装提示 |
| `--export`、`--reports` 转换 | `jq` | 仍会写入 JSON；无法转换 |
| `--install-cron` | `crontab` | 无法运行 |
| `--system` 的 snap 步骤 | `snap` | 干净地跳过该步骤 |
| `--system` 的 apt 步骤 | `apt`、`dpkg` | **失败**——[仅限 Debian/Ubuntu](../distro-support.md) |

## 接下来 {#next}

- [命令行参数](./cli-flags.md) — 每个参数的详细说明
- [模式概览](../modes/overview.md) — 按用途分组
