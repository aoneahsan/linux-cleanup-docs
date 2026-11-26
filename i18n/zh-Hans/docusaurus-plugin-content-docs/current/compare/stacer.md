---
sidebar_position: 3
title: linux-cleanup 与 Stacer
description: "linux-cleanup 与 Stacer 有何不同，依据各自的页面，核对于 2026-11-22。"
---

# linux-cleanup 与 Stacer

*2026-11-22 对照<a href="https://stacer.quentium.fr/" target="_blank" rel="noopener noreferrer nofollow">Stacer 的官方页面</a>核对。*

**是什么：**一款带系统清理功能的 Linux 系统监视与优化工具。

**对方价格：**我们查看的页面中未说明。**本产品价格：**命令行按 MIT 许可证免费。桌面应用的套餐见[价格页面](https://linux-cleanup.aoneahsan.com/zh-Hans/pricing)。

| | linux-cleanup | Stacer |
|---|---|---|
| 命令行界面 | 是 | 我们查看的页面中未说明 |
| 删除前预览 | 是 | 我们查看的页面中未说明 |
| 试运行 | 是 | 我们查看的页面中未说明 |
| 缓存清理 | 是 | 是（<a href="https://stacer.quentium.fr/" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 重复文件查找 | 部分 | 我们查看的页面中未说明 |

## 谁更适合用 Stacer {#who-is-better-served-by-stacer}

如果您还需要它的服务、进程和开机启动项管理，选 Stacer。

## linux-cleanup 领先的地方 {#where-linux-cleanup-is-ahead}

如果您想要以终端为主、可用 npx 或 cron 任务运行的清理，并在删除前用试运行列出每条路径，选 linux-cleanup。

## 在这里从哪儿开始 {#where-to-start-here}

两个工具之间没有导入功能：各自保留自己的规则。要看 linux-cleanup 会在您的电脑上做什么，请从[删除前先预览](../safety/preview-first.md)开始，并运行 `npx -y linux-cleanup --all-safe --yes --dry-run`，它不会删除任何东西。
