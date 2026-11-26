---
title: 主目录检查
description: 只读列出主目录中最大的 20 个条目，无论 linux-cleanup 能否清理它们——这是弄清磁盘到底被谁占用的最快方法。
tags: [audit, disk-usage, read-only, home, modes]
sidebar_position: 13
---

# 主目录检查

**`--audit` 会按大小列出 `$HOME` 中最大的 20 个条目。** 它什么都不删除，也不管工具能否清理找到的东西。

```bash
linux-cleanup --audit
```

## 它和 `--scan` 有什么不同 {#why-this-is-different-from---scan}

[`--scan`](./scan.md) 测量的是 linux-cleanup 知道如何清理的类别。`--audit` 测量的就是您的主目录，仅此而已。

这个差别正是关键。如果真正占满磁盘的是一个 60 GB 的虚拟机镜像、一个下载的数据集或一个 Steam 游戏库，`--scan` 永远不会提到它，而 `--audit` 会把它排在最前面。

| | `--audit` | `--scan` |
|---|---|---|
| 范围 | `$HOME` 中的一切 | 只有可清理的类别 |
| 回答的问题 | 是什么占用了我的磁盘？ | 这个工具能回收什么？ |
| 写入 JSON 会话报告 | 否 | 否 |
| 删除 | 从不 | 从不 |

## 常用流程 {#the-usual-workflow}

```bash
linux-cleanup --audit    # 什么占用大？
linux-cleanup --scan     # 这个工具能回收什么？
```

如果检查结果中靠前的条目出现在扫描里，这个工具就能帮上忙。如果没有，您得到的信息更有用——空间在这个工具不涉及的地方，可以直接去处理。

linux-cleanup **不会**清理的常见大文件：

- 虚拟机镜像和容器存储（`~/.local/share/libvirt`、`~/.local/share/docker`）
- 游戏库（Steam、Lutris）
- 数据集、模型权重、媒体库
- `~/Documents`、`~/Pictures`、`~/Music`、`~/Videos` 中的任何内容——都[受保护](../reference/protected-paths.md)

## 跟进某个发现 {#following-up-on-a-finding}

```bash
du -sh ~/.local/share/*      | sort -rh | head -20
du -sh ~/*                   | sort -rh | head -20
```

`--audit` 是快速的第一轮；知道该看哪里之后，再用 `du` 缩小范围。

## 接下来 {#next}

- [扫描](./scan.md)——工具能回收什么
- [回收最多的空间](../guides/reclaim-the-most-space.md)
