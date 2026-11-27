---
title: 长期未用的个人文件
description: 仅限交互式的模式，在 ~/Downloads 和已配置的未受保护根目录中查找体积大、长期未用的文件。
sidebar_position: 9
---

# 长期未用的个人文件

**`--stale` 会在 `~/Downloads` 和已配置的未受保护根目录中，找出大于约 10 MB、已有 `--days` 天或更久未用的文件，并逐个提供删除选项。**

```bash
linux-cleanup --stale         # 或： -p
linux-cleanup --stale -d 180  # 只针对闲置 180 天以上的文件
```

:::danger 个人文件可能无可替代
`~/Downloads` 和您配置的未受保护根目录里，放的是您放进去的任何东西——有时包括某个重要东西的唯一副本。

工具分不清一个您再也不会打开的安装包和一份您只是暂时还没用到的文档，它也不去尝试。**请阅读每一个候选项。**
:::

## 按规定必须交互 {#interactive-by-policy}

必须逐个文件或逐个范围确认。这里会忽略 `--yes`，将来也一直如此，而且这个模式不属于 [`--all-safe`](./all-safe.md)。见[关卡 3](../safety/guards.md#guard-3--personal-data-is-interactive-only)。

在询问任何问题之前，会先完整打印候选列表，所以运行这个模式然后全部拒绝，也是检查这些目录的一种正当方式。

## 什么样的文件会成为候选项 {#what-makes-a-file-a-candidate}

同时满足三个条件：

1. 位于已配置的个人根目录中——默认是 `~/Downloads`；`~/Desktop` 等受保护的根目录会被忽略
2. 大于大约 10 MB
3. `atime` 和 `mtime` 都早于 `--days`（默认 100）

个人根目录可以通过 `$XDG_CONFIG_HOME`（默认 `~/.config`）下的 `personal-roots.txt` 配置。见[环境变量](../reference/environment-variables.md)。

:::note 为什么 `~/Downloads` 不在受保护列表上
它不可能在——清理它正是这个模式的全部意义。[白名单](../safety/guards.md#guard-1--the-path-allowlist)保护 `~/Documents`、`~/Pictures`、`~/Music` 和 `~/Videos`，正是为了让它唯一会触及的目录就是您预期的那个。

如果您在 `~/Downloads` 里放了在乎的东西，请把它们移到受保护的地方——这是长久之计，而且不只是防着这个工具。
:::

## 阅读候选列表 {#reading-the-candidate-list}

每一项会显示路径、大小和闲置天数。值得停下来想一想的：

| 类型 | 考虑 |
|---|---|
| 安装包、ISO、`.deb`/`.AppImage` | 通常安全——可以重新下载 |
| 任何您自己做出来而不是下载的东西 | 保留，或移到受保护的地方 |
| 客户或工作的交付物 | 保留。下载目录不适合放它们 |
| 来源不明的媒体文件 | 接受前先调查 |
| 从未解压过的压缩包 | 先查看内容 |

## 更安全的顺序 {#a-safer-sequence}

```bash
linux-cleanup --audit            # $HOME 中实际占用大的是什么
linux-cleanup --stale -d 365     # 只针对真正很旧的文件
```

从 365 天开始逐步降低，先得到一份简短、明显的列表。那份清理完之后，再降低阈值。

## 在引导流程中 {#in-the-walkthrough}

[引导流程](./walkthrough.md)的第 7 步。在那里用 `s` 跳过，等以后有时间仔细阅读时再单独运行，是个合理的习惯。

## 接下来 {#next}

- [删除是永久的](../safety/irreversibility.md)
- [未完成的下载](./partial-downloads.md)——相关的交互式模式
- [主目录检查](./home-audit.md)——先找出占用大的东西
