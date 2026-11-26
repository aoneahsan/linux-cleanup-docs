---
sidebar_position: 10
title: linux-cleanup 与 Czkawka
description: "linux-cleanup 与 Czkawka 有何不同，依据各自的页面，核对于 2026-11-22。"
---

# linux-cleanup 与 Czkawka

*2026-11-22 对照<a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">Czkawka 的官方页面</a>核对。*

**是什么：**一款查找重复文件、空文件夹、相似媒体和其他杂物的工具。

**对方价格：**我们查看的页面中未说明。**本产品价格：**命令行按 MIT 许可证免费。桌面应用的套餐见[价格页面](https://linux-cleanup.aoneahsan.com/zh-Hans/pricing)。

| | linux-cleanup | Czkawka |
|---|---|---|
| 命令行界面 | 是 | 是（<a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 删除前预览 | 是 | 我们查看的页面中未说明 |
| 试运行 | 是 | 我们查看的页面中未说明 |
| 缓存清理 | 是 | 我们查看的页面中未说明 |
| 重复文件查找 | 部分 | 是（<a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |

## 谁更适合用 Czkawka {#who-is-better-served-by-czkawka}

要查找重复或相似的个人文件，选 Czkawka；linux-cleanup 不承担这项工作。

## linux-cleanup 领先的地方 {#where-linux-cleanup-is-ahead}

要清理超过闲置阈值的缓存、日志和临时文件，选 linux-cleanup；Czkawka 自己的页面介绍的是查找重复和相似文件。

## 在这里从哪儿开始 {#where-to-start-here}

两个工具之间没有导入功能：各自保留自己的规则。要看 linux-cleanup 会在您的电脑上做什么，请从[删除前先预览](../safety/preview-first.md)开始，并运行 `npx -y linux-cleanup --all-safe --yes --dry-run`，它不会删除任何东西。
