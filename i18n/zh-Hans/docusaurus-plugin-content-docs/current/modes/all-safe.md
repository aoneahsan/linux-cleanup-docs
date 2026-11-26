---
title: 全安全（批量）
description: 一次清理所有可再生成的缓存。这是为 cron 和无人值守维护打造的模式，也是 --yes 唯一适用的模式。
tags: [all-safe, batch, cron, unattended, yes, modes]
sidebar_position: 6
---

# 全安全（批量）

**`--all-safe` 会一次清理所有可再生成的缓存。** 它是用于无人值守维护的模式，也是 `--yes` 唯一适用的模式。

```bash
linux-cleanup --all-safe        # 整批只确认一次
linux-cleanup --all-safe -y     # 无提示——cron 用法
```

## 这里的“安全”指什么 {#what-safe-means-here}

安全的意思是**可再生成**：包管理器缓存、浏览器和应用缓存，以及长期未用的开发工具数据。它**并不**意味着没有风险，也不意味着可逆——删除仍然是[永久的](../safety/irreversibility.md)。

无论是否使用 `--yes`，`--all-safe` 永远不会触碰：

- `~/Downloads`、`~/Desktop` 或其他任何地方的个人文件
- 未完成的下载
- `node_modules` 目录
- [受保护路径列表](../reference/protected-paths.md)上的任何内容
- 全局安装的软件包或 shell 初始化文件

这些类别[按设计仅限交互式](../safety/guards.md#guard-3--personal-data-is-interactive-only)，根本不属于这个模式。正因如此，把 `--all-safe -y` 放进 cron 任务才是可以接受的。

自 1.1.0 起，该模式还会运行一个**启动断言**：一旦有任何受保护的运行时目录混进了目标列表，就会以 `BUG:` 信息中止。这样将来出现回归时会大声失败，而不是删掉不该删的东西。

## `--yes` 及其限制 {#--yes-and-its-limits}

`-y` / `--yes` 会自动确认缓存删除。它只对 `--all-safe` 有效；交互式模式按规定会忽略它。

```bash
linux-cleanup --all-safe -y
```

:::caution `-y` 意味着您要到事后才能看到决定
白名单和闲置阈值仍然适用，但您只能在运行结束后查看日志。单独运行的全安全模式不会写引导流程的 JSON 会话报告。第一次运行前，请先查看一次 [`--scan`](./scan.md) 和一次 `--all-safe --dry-run`。
:::

## 修剪，以及哪些会保留 {#pruning-and-what-survives}

默认情况下，`--all-safe` 会修剪 `atime` 和 `mtime` 都早于 `--days`（默认 100）的符合条件的缓存文件。解压出的软件包和带版本的工具按各自的闲置规则作为整体处理。可读输出会报告部分结果；删除之前，请用试运行查看拟删除的路径。

```bash
linux-cleanup --all-safe -y            # 100 天阈值
linux-cleanup --all-safe -y -d 30      # 更激进
linux-cleanup --all-safe -y --purge-all # 关闭关卡——完全清空
```

:::danger 在 cron 任务中使用 `--purge-all` 是糟糕的组合
无人值守再加上没有闲置阈值，意味着 Gradle wrapper 发行版或 Playwright 浏览器包可能会在您需要它的前一周消失，而且没有人在看。把 `--purge-all` 留给有意为之的、重装系统前的运行。
:::

## 每周运行 {#running-it-weekly}

```bash
linux-cleanup --install-cron
```

这会把 `--all-safe -y` 安排在每周日 03:00 运行，并把输出追加到 `~/.linux-cleanup/logs/cron.log`。具体条目和移除方法见[别名与 cron](../guides/alias-and-cron.md)。

如果您自己写 crontab 条目，请使用**绝对路径**——cron 极简的 `PATH` 找不到 `~/.local/bin` 中的安装：

```bash
0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1
```

`--cleanup-logs` 会删除那次运行的日志。单独运行的全安全模式不会写引导流程的 JSON 会话记录，所以 `--no-report` 在这里没有额外作用。

## 查看 cron 运行做了什么 {#checking-what-a-cron-run-did}

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
```

如果 cron 日志显示 `command not found`，说明 crontab 用的是不带路径的命令名——见[故障排查](../troubleshooting.md#cron-entry-runs-but-does-nothing)。

## 什么时候该用别的 {#when-to-use-something-else}

| 情况 | 更合适的模式 |
|---|---|
| 第一次在这台机器上用 | [`--scan`](./scan.md)，然后 `--all-safe --dry-run` |
| 想看到每个决定 | [引导流程](./walkthrough.md) |
| 只有一个类别需要清理 | [菜单](./menu.md)或 [TUI](./tui.md) |
| 也想回收个人文件 | [长期未用的个人文件](./personal-stale-files.md)，以交互方式 |

## 接下来 {#next}

- [别名与 cron](../guides/alias-and-cron.md)——安排定时运行
- [回收最多的空间](../guides/reclaim-the-most-space.md)——激进的做法
- [安全防护](../safety/guards.md)——使用 `-y` 时仍然适用的防护
