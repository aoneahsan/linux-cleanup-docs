---
sidebar_position: 7
title: linux-cleanup 与 TuxCleaner
description: "linux-cleanup 与 TuxCleaner 有何不同，依据各自的页面，核对于 2026-11-22。"
---

# linux-cleanup 与 TuxCleaner

*2026-11-22 对照<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">TuxCleaner 的官方页面</a>核对。*

**是什么：**一款用于清理、卸载应用、磁盘分析和状态查看的 Linux 命令行工具。

**对方价格：**我们查看的页面中未说明。**本产品价格：**命令行按 MIT 许可证免费。桌面应用的套餐见[价格页面](https://linux-cleanup.aoneahsan.com/zh-Hans/pricing)。

| | linux-cleanup | TuxCleaner |
|---|---|---|
| 命令行界面 | 是 | 是（<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 删除前预览 | 是 | 是（<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 试运行 | 是 | 是（<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 缓存清理 | 是 | 是（<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 重复文件查找 | 部分 | 我们查看的页面中未说明 |

## 谁更适合用 TuxCleaner {#who-is-better-served-by-tuxcleaner}

如果您需要它针对各发行版的软件包适配器和应用卸载功能，选 TuxCleaner。

## linux-cleanup 领先的地方 {#where-linux-cleanup-is-ahead}

如果您更想通过 npx 运行一个无需构建的 Bash 脚本，并对完整的 Gradle 和 Android Studio 单元保留“仅在闲置时清理”的规则，选 linux-cleanup。

## 在这里从哪儿开始 {#where-to-start-here}

两个工具之间没有导入功能：各自保留自己的规则。要看 linux-cleanup 会在您的电脑上做什么，请从[删除前先预览](../safety/preview-first.md)开始，并运行 `npx -y linux-cleanup --all-safe --yes --dry-run`，它不会删除任何东西。
