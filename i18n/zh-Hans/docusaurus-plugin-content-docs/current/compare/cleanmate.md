---
sidebar_position: 6
title: linux-cleanup 与 CleanMate
description: "linux-cleanup 与 CleanMate 有何不同，依据各自的页面，核对于 2026-11-22。"
---

# linux-cleanup 与 CleanMate

*2026-11-22 对照<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">CleanMate 的官方页面</a>核对。*

**是什么：**一款 macOS 和 Ubuntu 清理工具，有桌面应用、终端应用和“删除前先审核”流程。

**对方价格：**免费（<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">来源</a>、核实于 2026-11-22）。**本产品价格：**命令行按 MIT 许可证免费。桌面应用的套餐见[价格页面](https://linux-cleanup.aoneahsan.com/zh-Hans/pricing)。

| | linux-cleanup | CleanMate |
|---|---|---|
| 命令行界面 | 是 | 是（<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 删除前预览 | 是 | 是（<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 试运行 | 是 | 我们查看的页面中未说明 |
| 缓存清理 | 是 | 是（<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |
| 重复文件查找 | 部分 | 是（<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">来源</a>） |

## 谁更适合用 CleanMate {#who-is-better-served-by-cleanmate}

如果您想要它的 Ubuntu 桌面应用、Space Lens，或针对个人文件的废纸篓与撤销流程，选 CleanMate。

## linux-cleanup 领先的地方 {#where-linux-cleanup-is-ahead}

如果您想要可编写脚本、带 JSON 事件流的命令行，并且每次实际运行都写入本地 JSON 报告，选 linux-cleanup。

## 在这里从哪儿开始 {#where-to-start-here}

两个工具之间没有导入功能：各自保留自己的规则。要看 linux-cleanup 会在您的电脑上做什么，请从[删除前先预览](../safety/preview-first.md)开始，并运行 `npx -y linux-cleanup --all-safe --yes --dry-run`，它不会删除任何东西。
