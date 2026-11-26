---
title: 引导流程（默认）
description: linux-cleanup 的默认模式——十个引导步骤走遍每个清理类别，每步前都会询问，显示累计结果并生成 JSON 会话报告。
tags: [walkthrough, default, interactive, guided, modes]
sidebar_position: 2
---

# 引导流程（默认）

**不带参数运行 `linux-cleanup` 就会启动引导流程：十个步骤走遍每个清理类别，每一步在做任何事之前都会询问。** 这是以交互方式使用该工具的推荐方法。

```bash
linux-cleanup          # 或： linux-cleanup -w / --walkthrough
```

## 十个步骤 {#the-ten-steps}

| # | 步骤 | 删除 | 说明 |
|---|---|---|---|
| 1 | 包管理器缓存 | 可再生成 | yarn、npm、npx、pnpm、pip、composer、bun、deno |
| 2 | 应用缓存 | 可再生成 | 浏览器、Gradle、Cypress、Playwright、Zoom、编辑器 VSIX |
| 3 | 开发工具数据 | 仅长期未用 | Android AVD、pub-cache、Dart 分析、flatpak |
| 4 | 编辑器旧扩展 | 长期未用 + 已被取代 | VS Code / Cursor |
| 5 | 长期未用的 `node_modules` | **交互式** | 闲置超过阈值的项目 |
| 6 | 未完成 / 无主的下载 | **交互式** | `.crdownload`、`.part`、`.fdmdownload` |
| 7 | 长期未用的个人文件 | **交互式** | `~/Downloads`、`~/Desktop` 中体积大的闲置文件 |
| 8 | 系统清理（sudo） | 系统 | apt、日志、snap、`/tmp`、页面缓存 |
| 9 | 最终大小检查 | 无 | 只读摘要 |
| 10 | 生成可读报告 | 无 | Markdown / HTML 导出——需要 `jq` |

第 5、6、7 步是[仅限交互式](../safety/guards.md#guard-3--personal-data-is-interactive-only)的步骤。它们不能被自动确认，而且第 7 步是整个工具中唯一可能删除真正无可替代之物的步骤。

## 提示如何工作 {#how-the-prompts-work}

确认分两个层级。

**每个步骤**，您决定如何处理整个类别：

| 按键 | 效果 |
|---|---|
| `a` | 运行这一步。这是默认值——按 Enter 即选择它 |
| `s` | 完全跳过这一步 |
| `q` | 立即退出引导流程，保留目前的进度 |

**每个目标**，在您选择运行的步骤内，每一项都有自己的 `[Y/n]` 或 `[y/N]` 确认。大写的字母是默认值。

所以在步骤层级按 `a`，并不代表您同意删除其中的一切——您仍会看到并回答每个目标。

## 累计结果 {#running-totals}

每个运行过的步骤之后，工具会打印测得的变化和目前为止的会话总量。

最后的摘要会报告运行前后的可用磁盘空间。这个数字是由 `df` 测得的，所以反映的是机器上发生的一切——如果在您的会话期间有构建在运行，报告的回收量可能低于各步骤之和，甚至为负。这不是 bug；见[故障排查](../troubleshooting.md#disk-usage-grew-during-the-session)。

## 提前退出 {#quitting-early}

在任何步骤提示处按 `q`，或随时按 `Ctrl-C`，都会干净地结束会话：

- 之前执行的删除仍是永久的；查看日志可以知道中断前尝试了哪些步骤
- `Ctrl-C` 以代码 `130` 退出，[崩溃陷阱有意忽略它](../reference/exit-codes.md#how-the-crash-trap-decides)，所以不会写入崩溃包
- 尚未到达的步骤会在报告中记为已跳过

## 会话报告 {#the-session-report}

除非设置了 `--no-report` 或 `--dry-run`，引导流程会把 JSON 报告写到 `~/.linux-cleanup/reports/report-<timestamp>.json`。其中包含每个步骤的状态和释放的字节数、运行前后的磁盘和内存，以及会话总量。完整字段列表：[报告结构](../reference/report-schema.md)。

第 10 步可选地把它转换为 Markdown 和 HTML。这一步需要 `jq`；没有它时，该步骤会记为 `skipped (jq missing)`，JSON 仍会写入。

```bash
linux-cleanup --no-report    # 跳过 JSON 生成；日志仍会写入
```

## 值得组合使用的选项 {#options-worth-combining}

```bash
linux-cleanup -d 30          # 使用 30 天闲置阈值而不是 100 天
linux-cleanup --purge-all    # 完全关闭闲置阈值关卡
linux-cleanup --no-color     # 纯文本输出
linux-cleanup --cleanup-logs # 结束时删除本次运行的日志
```

:::danger `--purge-all` 会改变第 1–4 步删除的内容
[闲置阈值关卡](../safety/guards.md#guard-2--the-staleness-gate)关闭后，缓存步骤会把目标完全清空，而不是修剪闲置文件。其中包括您可能仍然需要的 Gradle wrapper 发行版、Playwright 浏览器和 Cypress 二进制文件。运行前的横幅会说明当前启用的策略。
:::

## 什么时候该用别的 {#when-to-use-something-else}

| 情况 | 更合适的模式 |
|---|---|
| 只想处理一个类别 | [菜单](./menu.md)或 [TUI](./tui.md) |
| 无人值守或 cron | 带 `-y` 的[全安全](./all-safe.md) |
| 只想看看，不想删除 | [扫描](./scan.md) |
| 想要这个流程的可视化版本 | [TUI](./tui.md) |

## 接下来 {#next}

- [扫描](./scan.md)——先运行这个
- [全安全](./all-safe.md)——无人值守的对应模式
- [报告](./reports.md)——阅读输出
