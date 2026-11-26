---
sidebar_position: 9
title: linux-cleanup 与 Disk Cleaner
description: "linux-cleanup 与 Disk Cleaner 有何不同，依据各自的页面，核对于 2026-11-22。"
---

# linux-cleanup 与 Disk Cleaner

*2026-11-22 对照<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">Disk Cleaner 的官方页面</a>核对。*

**是什么：**一款带磁盘可视化和清理建议的 Linux GTK 清理工具。

**对方价格：**我们查看的页面中未说明。**本产品价格：**命令行按 MIT 许可证免费。桌面应用的套餐见[价格页面](https://linux-cleanup.aoneahsan.com/zh-Hans/pricing)。

| | linux-cleanup | Disk Cleaner |
|---|---|---|
| 命令行界面 | 是 | 是（<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 删除前预览 | 是 | 我们查看的页面中未说明 |
| 试运行 | 是 | 是（<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 缓存清理 | 是 | 是（<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 重复文件查找 | 部分 | 我们查看的页面中未说明 |

## 谁更适合用 Disk Cleaner {#who-is-better-served-by-disk-cleaner}

如果您需要交互式的矩形树图或旭日图，选 Disk Cleaner。

## linux-cleanup 领先的地方 {#where-linux-cleanup-is-ahead}

如果您希望由工具按规则判断哪些缓存已超过闲置阈值，而不是看图表手动挑选，选 linux-cleanup。

## 在这里从哪儿开始 {#where-to-start-here}

两个工具之间没有导入功能：各自保留自己的规则。要看 linux-cleanup 会在您的电脑上做什么，请从[删除前先预览](../safety/preview-first.md)开始，并运行 `npx -y linux-cleanup --all-safe --yes --dry-run`，它不会删除任何东西。
