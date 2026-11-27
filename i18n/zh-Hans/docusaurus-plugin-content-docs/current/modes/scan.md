---
title: 扫描（只读）
description: 检查缓存根目录、未完成的下载和其他 Linux 清理候选项，不删除任何文件。
sidebar_position: 3
---

# 扫描（只读）

**`--scan` 会列出路径及其当前大小，不删除任何文件。** 这是对这台机器的第一眼。要查看拟执行的操作，请对所选清理模式进行试运行。

```bash
linux-cleanup --scan
```

## 它检查什么？ {#what-does-it-inspect}

扫描会打印一张缓存和构建工具根目录的表格：包管理器、浏览器、Gradle、测试运行器、Android 工具和其他已配置的位置。它还会列出未完成的下载、可能重复的下载、体积大且长期未用的个人文件候选项，以及一些系统观察结果。它不会执行包管理器清理，也不会请求 `sudo`。

列出的缓存根目录大小涵盖该目录中当前的一切，**并不是**工具会删除的量。所选模式、闲置阈值、当前使用情况和拒绝规则决定了哪些会保留。

扫描会写一份本地会话日志，但不会写引导流程的 [JSON 会话报告](../reference/report-schema.md)。

## 选择模式前先阅读路径 {#read-the-paths-before-choosing-a-mode}

检查您不认识的路径。符号链接指向的位置可能与它显示的名字不同；清理前用 `realpath` 查看。受保护路径防护在删除前也会解析符号链接。

个人文件候选项只供查看。日常的 `--all-safe` 清理不会选中它们。要预览缓存清理：

```bash
linux-cleanup --all-safe --dry-run
```

试运行会走完该模式而不删除任何内容，但仍可能写入本地日志和更新检查状态。实际删除无法撤销。

## 机器可读的扫描 {#machine-readable-scan}

```bash
linux-cleanup --scan --json-events > scan.ndjson
```

[第 1 版事件流](../reference/json-events.md)写到 stdout，人类可读的文本写到 stderr。它可能包含完整的本地路径。请把它留在本机，并用退出码区分完整的运行和被中断的流。

## 其他只读视图 {#other-read-only-views}

| 命令 | 回答的问题 |
|---|---|
| `--list-targets` | 某个模式能针对或会拒绝哪些已配置的路径？ |
| `--audit` | `$HOME` 中哪些条目最大，无论清理模式是否覆盖它们？ |
| `--globals` | 安装了哪些全局运行时软件包？ |
| `--self-test` | 必需命令、语法和安全防护断言是否通过？ |

步骤顺序见[删除前先预览](../safety/preview-first.md)，模式选项见[命令行参数](../reference/cli-flags.md)。
