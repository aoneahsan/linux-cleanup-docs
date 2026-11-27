---
title: 编辑器扩展
description: 删除 VS Code 和 Cursor 中已被取代的扩展版本——即扩展更新后留下的旧副本——前提是通过取代检查和闲置阈值。
sidebar_position: 11
---

# 编辑器扩展

**`--editor-ext` 会删除 VS Code 和 Cursor 中已被取代的扩展版本。** 扩展更新后，旧版本目录常常还留在磁盘上。在装有很多扩展、更新了好几年的机器上，这些会累积到几百兆字节。

```bash
linux-cleanup --editor-ext
```

## 两个条件 {#the-two-conditions}

只有**同时**满足以下两点，一个版本目录才会成为候选项：

1. **同一扩展存在更新的版本**——当前版本永远不会成为候选项
2. **该旧版本已闲置 `--days` 天或更久**（默认 100）

第二个条件是在 [1.2.1](../changelog.md#121--2026-05-10) 中加入的。在那之前，只要被取代就足够，这会删掉您最近还加载过的旧版本。输出会显示每个版本的闲置天数，所以您能看到某个版本为什么被保留。

## 它不会触碰什么 {#what-it-does-not-touch}

- 任何扩展的当前版本
- 扩展的设置、快捷键或工作区状态
- `~/.config` 中的任何内容——整个目录树都[受保护](../reference/protected-paths.md)
- VS Code 和 Cursor 之外的编辑器中的扩展

## 运行之后 {#after-running-it}

如果 VS Code 显示缺少扩展的提示条，请重新加载窗口：`Ctrl+Shift+P` → **Developer: Reload Window**。编辑器还引用着一个已不存在的目录。

如果某个扩展确实没了——这意味着“最高版本”检测认错了当前版本——请重新安装并[报告这个 bug](../guides/send-a-bug-report.md)：

```bash
code --install-extension <publisher>.<name>
```

## 预期回收量 {#expected-reclaim}

大小取决于这台机器上安装的旧版本。决定是否清理之前，先用扫描查看当前目录。

## 在引导流程和全安全模式中 {#in-the-walkthrough-and-all-safe}

作为[引导流程](./walkthrough.md)的第 4 步运行，并包含在 [`--all-safe`](./all-safe.md) 中，因为它只删除可再生成的、已被取代的副本。

## 接下来 {#next}

- [闲置阈值关卡](../safety/guards.md#guard-2--the-staleness-gate)
- [模式概览](./overview.md)
