---
title: 未完成 / 无主的下载
description: 查找并删除被放弃的未完成下载文件——.crdownload、.part 和 .fdmdownload——它们是浏览器和下载管理器传输中断后留下的。
sidebar_position: 10
---

# 未完成 / 无主的下载

**`--partials` 会找出被放弃的未完成下载文件，并提供删除选项。** 这些是浏览器或下载管理器在传输时写入的占位文件，传输中断后忘了清理。

```bash
linux-cleanup --partials
```

## 它查找什么 {#what-it-looks-for}

| 扩展名 | 由谁写入 |
|---|---|
| `.crdownload` | Chrome、Chromium、Brave、Edge、Vivaldi |
| `.part` | Firefox、wget、aria2 |
| `.fdmdownload` | Free Download Manager |

未完成的文件保存着传输中断前收到的字节——有时只有几 KB，有时是一个几 GB 的 ISO 的大部分。

## 仅限交互式 {#interactive-only}

逐个文件确认，忽略 `--yes`，不属于 [`--all-safe`](./all-safe.md)。见[关卡 3](../safety/guards.md#guard-3--personal-data-is-interactive-only)。

## 删掉一个会让您损失什么 {#what-deleting-one-costs-you}

:::caution 未完成的文件也许还能续传——但通常不能
续传需要原来的下载会话：浏览器下载管理器中的条目、来源 URL，以及支持范围请求的服务器。如果浏览器已经重启过，或者下载条目已被清除，这个未完成的文件就无法续传，纯属浪费。

文件本身从来不能单独使用——下载了一半的压缩包打不开。所以实际的问题只是：您是否还打算续传它。
:::

接受删除一个大文件之前请检查：

- 打开浏览器的下载页面，查找与文件名匹配的已暂停或失败的条目
- 如果有，就在那里续传，而不是删除未完成的文件
- 如果没有，这个未完成的文件已经无主，可以安全删除

## 正在进行的下载也会出现在这里 {#an-active-download-will-show-up-here}

一个*此刻*正在进行的下载同样有 `.crdownload` 或 `.part` 文件。工具无法区分正在传输的和被放弃的。删除一个正在进行的未完成文件会中断传输——所以不确定时请查看下载页面，或在没有任何下载时运行这个模式。

## 在引导流程中 {#in-the-walkthrough}

[引导流程](./walkthrough.md)的第 6 步。

## 接下来 {#next}

- [长期未用的个人文件](./personal-stale-files.md)——相关的交互式模式
- [删除是永久的](../safety/irreversibility.md)
