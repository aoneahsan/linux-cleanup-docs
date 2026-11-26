---
sidebar_position: 5
title: linux-cleanup 与 Cross Cleaner
description: "linux-cleanup 与 Cross Cleaner 有何不同，依据各自的页面，核对于 2026-11-22。"
---

# linux-cleanup 与 Cross Cleaner

*2026-11-22 对照<a href="https://cross-cleaner.github.io/" target="_blank" rel="noopener noreferrer nofollow">Cross Cleaner 的官方页面</a>核对。*

**是什么：**一款跨平台清理工具，有窗口版、终端版和命令行版。

**对方价格：**免费（<a href="https://cross-cleaner.github.io/" target="_blank" rel="noopener noreferrer nofollow">来源</a>、核实于 2026-11-22）。**本产品价格：**命令行按 MIT 许可证免费。桌面应用的套餐见[价格页面](https://linux-cleanup.aoneahsan.com/zh-Hans/pricing)。

| | linux-cleanup | Cross Cleaner |
|---|---|---|
| 命令行界面 | 是 | 是（<a href="https://cross-cleaner.github.io/" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 删除前预览 | 是 | 我们查看的页面中未说明 |
| 试运行 | 是 | 是（<a href="https://cross-cleaner.github.io/" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 缓存清理 | 是 | 是（<a href="https://cross-cleaner.github.io/" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 重复文件查找 | 部分 | 我们查看的页面中未说明 |

## 谁更适合用 Cross Cleaner {#who-is-better-served-by-cross-cleaner}

如果您需要一款覆盖 Linux、Windows、macOS 和 Android 的清理工具，选 Cross Cleaner。

## linux-cleanup 领先的地方 {#where-linux-cleanup-is-ahead}

如果您想要一款只为 Linux 打造的工具，其受保护列表按名称拒绝 ~/Documents、~/.ssh 和 ~/.config，无论缓存规则怎么说，选 linux-cleanup。

## 在这里从哪儿开始 {#where-to-start-here}

两个工具之间没有导入功能：各自保留自己的规则。要看 linux-cleanup 会在您的电脑上做什么，请从[删除前先预览](../safety/preview-first.md)开始，并运行 `npx -y linux-cleanup --all-safe --yes --dry-run`，它不会删除任何东西。
