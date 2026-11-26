---
sidebar_position: 8
title: linux-cleanup 与 Ubuntu Cleaner
description: "linux-cleanup 与 Ubuntu Cleaner 有何不同，依据各自的页面，核对于 2026-11-22。"
---

# linux-cleanup 与 Ubuntu Cleaner

*2026-11-22 对照<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">Ubuntu Cleaner 的官方页面</a>核对。*

**是什么：**一款面向 Ubuntu、Debian 和 Linux Mint 的 Bash 清理工具，可维护软件包和开发者缓存。

**对方价格：**我们查看的页面中未说明。**本产品价格：**命令行按 MIT 许可证免费。桌面应用的套餐见[价格页面](https://linux-cleanup.aoneahsan.com/zh-Hans/pricing)。

| | linux-cleanup | Ubuntu Cleaner |
|---|---|---|
| 命令行界面 | 是 | 是（<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 删除前预览 | 是 | 是（<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 试运行 | 是 | 是（<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 缓存清理 | 是 | 是（<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 重复文件查找 | 部分 | 我们查看的页面中未说明 |

## 谁更适合用 Ubuntu Cleaner {#who-is-better-served-by-ubuntu-cleaner}

如果您看重它对 Debian 系发行版的专注和 Docker 维护，选 Ubuntu Cleaner。

## linux-cleanup 领先的地方 {#where-linux-cleanup-is-ahead}

如果您希望清理以普通用户身份运行，并把系统软件包交给单独、明确的 --system 模式处理，选 linux-cleanup。

## 在这里从哪儿开始 {#where-to-start-here}

两个工具之间没有导入功能：各自保留自己的规则。要看 linux-cleanup 会在您的电脑上做什么，请从[删除前先预览](../safety/preview-first.md)开始，并运行 `npx -y linux-cleanup --all-safe --yes --dry-run`，它不会删除任何东西。
