---
title: 菜单
description: 带编号的跳转菜单，让您一次只运行 linux-cleanup 的一个类别，而不是完整的引导流程。
tags: [menu, interactive, modes]
sidebar_position: 4
---

# 菜单

**`--menu` 会打印所有类别的编号列表，并运行您选中的那一个。** 当您清楚自己要做什么、不需要十步导览时使用它。

```bash
linux-cleanup --menu     # 或： -m, -i, --interactive
```

## 它和引导流程有什么不同 {#how-it-differs-from-the-walkthrough}

| | 菜单 | [引导流程](./walkthrough.md) |
|---|---|---|
| 顺序 | 由您选择 | 固定的十个步骤 |
| 范围 | 每次选择一个类别 | 全部，依次进行 |
| 循环 | 完成后回到菜单 | 一直运行到结束 |
| 报告 | 每个操作各一份 | 整个会话一份 |
| 适合 | 有针对性的清理 | 第一次运行、全面清理 |

安全模型完全相同。每个类别的行为都和在引导流程中一样——[白名单](../safety/guards.md#guard-1--the-path-allowlist)、[闲置阈值关卡](../safety/guards.md#guard-2--the-staleness-gate)和逐个目标的确认全部适用。从菜单中选择个人数据类别时，仍会逐项提示，`--yes` 对它仍然无效。

## 选项依然适用 {#options-still-apply}

```bash
linux-cleanup --menu -d 30        # 所选内容使用 30 天阈值
linux-cleanup --menu --purge-all  # 关闭闲置阈值关卡
linux-cleanup --menu --no-color   # 纯文本输出
```

## 什么时候改用 TUI {#when-to-use-the-tui-instead}

[`--tui`](./tui.md) 是同一个菜单，以 whiptail 或 dialog 对话框呈现。它需要安装其中之一；`--menu` 除了 bash 什么都不需要，在任何连接下都能用，包括简陋终端或全屏对话框会出问题的 `ssh -T` 会话。

## 接下来 {#next}

- [TUI](./tui.md)——可视化版本
- [模式概览](./overview.md)——菜单列出的每个类别
