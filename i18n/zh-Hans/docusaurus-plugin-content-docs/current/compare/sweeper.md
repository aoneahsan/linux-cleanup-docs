---
sidebar_position: 4
title: linux-cleanup 与 Sweeper
description: "linux-cleanup 与 Sweeper 有何不同，依据各自的页面，核对于 2026-11-22。"
---

# linux-cleanup 与 Sweeper

*2026-11-22 对照<a href="https://apps.kde.org/en-gb/sweeper/" target="_blank" rel="noopener noreferrer nofollow">Sweeper 的官方页面</a>核对。*

**是什么：**一款用于清除 Cookie、缓存和其他使用痕迹的 KDE 工具。

**对方价格：**我们查看的页面中未说明。**本产品价格：**命令行按 MIT 许可证免费。桌面应用的套餐见[价格页面](https://linux-cleanup.aoneahsan.com/zh-Hans/pricing)。

| | linux-cleanup | Sweeper |
|---|---|---|
| 命令行界面 | 是 | 我们查看的页面中未说明 |
| 删除前预览 | 是 | 我们查看的页面中未说明 |
| 试运行 | 是 | 我们查看的页面中未说明 |
| 缓存清理 | 是 | 是（<a href="https://apps.kde.org/en-gb/sweeper/" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 重复文件查找 | 部分 | 我们查看的页面中未说明 |

## 谁更适合用 Sweeper {#who-is-better-served-by-sweeper}

如果您需要专注于使用痕迹的 KDE 桌面工具，选 Sweeper。

## linux-cleanup 领先的地方 {#where-linux-cleanup-is-ahead}

如果您要清理超过闲置阈值的软件包管理器和开发者缓存——这不是痕迹清理工具的目标——选 linux-cleanup。

## 在这里从哪儿开始 {#where-to-start-here}

两个工具之间没有导入功能：各自保留自己的规则。要看 linux-cleanup 会在您的电脑上做什么，请从[删除前先预览](../safety/preview-first.md)开始，并运行 `npx -y linux-cleanup --all-safe --yes --dry-run`，它不会删除任何东西。
