---
title: 删除前先预览
description: 在永久删除之前，用只读扫描和试运行检查 linux-cleanup 的路径。
tags: [safety, dry-run, scan, preview, read-only]
sidebar_position: 2
---

# 删除前先预览

**先运行 `--scan`，再用 `--dry-run` 运行清理模式。** 扫描只显示路径和大小，不删除任何内容。试运行会走完所选清理并列出它将执行的操作，但不删除文件，也不更改设置。两者仍会创建一份本地会话日志。

```bash
linux-cleanup --self-test
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

`--self-test` 会检查依赖、Bash 语法和受保护路径的防护。如果它失败，请停下。

## 扫描会显示什么？

`--scan` 列出缓存根目录、未完成的下载、可能重复的下载、体积大且长期未用的个人文件候选项，以及系统观察结果。它给出的缓存根目录大小是**当前存在的全部内容**，而不是之后清理会删除的量。默认 100 天的闲置阈值、正在使用的文件以及各模式的规则，可能会保留其中的大部分。

扫描不会生成 JSON 会话报告。如果需要机器可读的扫描结果，请使用 `linux-cleanup --scan --json-events`。事件流可能包含完整的本地路径，请把它留在本机。

## 试运行会显示什么？

`--dry-run` 走完所选的清理流程并列出拟执行的操作。例如：

```bash
linux-cleanup --all-safe --dry-run
linux-cleanup --all-safe --yes --dry-run --json-events > preview.ndjson
```

第一条命令仍会像实际运行一样请求确认。第二条是非交互式的，把带版本号的 JSON 事件写到 stdout，人类可读的文本写到 stderr。两条都不会删除文件。试运行不会生成 JSON 会话报告。

预览只是当前机器的一份快照，并不保证之后的运行结果。在预览和确认之间，文件可能被使用、修改或删除。该工具没有撤销，也没有备份。

## 实际运行前先确认边界

`--list-targets` 会列出已配置的目标根目录和受保护路径，不测量磁盘。它可以帮您判断某个目录是否在范围内。[受保护路径参考](../reference/protected-paths.md)说明了拒绝规则。

个人文件和项目相关的模式与日常缓存清理是分开的。请逐个查看它们的候选项。`--yes` 只适用于 `--all-safe`，不会批准删除个人文件。

当预览与您的意图一致时，选择需要的模式并阅读它的确认提示。实际删除是永久的。

## 接下来阅读

- [会删除什么](./what-it-deletes.md)
- [安全防护](./guards.md)
- [命令行参数](../reference/cli-flags.md)
