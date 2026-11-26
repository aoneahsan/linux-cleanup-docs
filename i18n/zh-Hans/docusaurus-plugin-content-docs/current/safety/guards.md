---
title: 安全防护
description: linux-cleanup 删除路径前必须通过的四道独立关卡：路径白名单、闲置阈值、仅限交互的个人模式，以及 sudo 限制。
tags: [safety, allowlist, staleness, guards, design]
sidebar_position: 3
---

# 安全防护

**linux-cleanup 在任何删除之前最多会施加四道独立关卡。一条路径必须通过所有适用于它的关卡。** 本页说明每道关卡是什么、为什么存在，以及它不覆盖什么。

这些防护就是全部的安全模型。它们背后没有备份，也[没有撤销](./irreversibility.md)。

## 关卡 1——路径白名单 {#guard-1--the-path-allowlist}

始终开启。无法关闭，也没有参数能绕过它。

任何删除之前，目标都会先用 `realpath` 解析；如果它落在受保护路径上或其内部，就会被拒绝。因为先解析，符号链接无法夹带路径：如果 `~/.cache/yarn` 是指向 `~/Documents` 的符号链接，解析后的路径就在 `~/Documents` 内，防护触发，删除被拒绝。

有三份独立的列表作为支撑：

| 列表 | 匹配方式 | 用途 |
|---|---|---|
| 系统根目录和个人目录 | 路径本身或任意子路径 | `/etc`, `~/Documents`, `~/.ssh`, `~/.config`, … |
| 包管理器安装根目录 | **仅精确路径** | `~/.local/share/pnpm`, `~/.npm`, `~/.cargo`, … |
| Shell 初始化和历史文件 | **文件名，任意位置** | `.bashrc`, `.zshrc`, `.bash_history`, … |

防护触发时，您会在 stderr 上看到拒绝信息：

```text
✗ REFUSE: protected path: /home/you/Documents/notes
```

精确匹配列表值得说明一下。`~/.npm` 是被*精确*保护的，所以它的子目录 `~/.npm/_cacache` 才能被清理。这是有意为之：安装根目录被保留，而其中可再生成的缓存可以清理。完整列表见[受保护路径](../reference/protected-paths.md)。

:::note 这道防护不做什么
它保护的是*位置*，而不是*价值*。放在 `~/Downloads` 中的一个 40 GB、无可替代的视频不受白名单保护——`~/Downloads` 不是受保护路径。它由[关卡 3](#guard-3--personal-data-is-interactive-only)来覆盖。
:::

清理模式会选择具名的目标路径，然后由受保护路径检查拒绝危险的目的地。不在受保护列表中的路径并不自动意味着可以安全删除：请查看每个模式的目标和它的试运行。

## 关卡 2——闲置阈值 {#guard-2--the-staleness-gate}

默认：100 天。在 [1.2.0](../changelog.md#120--2026-05-10) 中引入，在 [1.2.1](../changelog.md#121--2026-05-10) 中扩展。

自 1.2.0 起，默认策略是**修剪，而不是清空**。在目标目录中，只有当文件的 `atime` 和 `mtime` **都**早于 `--days` 时才会被删除。留下的空目录会被清掉；目录本身的外壳保留，以便所属工具仍能找到它的布局。

要求两个时间戳都满足很重要。只看 `mtime`，会删掉一年前下载、昨天还读过的文件；只看 `atime`，在以 `noatime` 或 `relatime` 挂载的文件系统上并不可靠。要求两者同时满足是保守的做法。

对于本身是*工具*而非缓存的东西——Android AVD、编辑器扩展版本、flatpak 用户数据——1.2.1 又加了一个条件。这类资源只有在**没有正在使用的软件依赖它，并且闲置超过阈值**时才会被删除。每个资源被当作不可分割的整体评估，因此部分修剪不会留下一个删了一半的模拟器配置。

```bash
linux-cleanup --all-safe -y -d 30    # 更激进：30 天阈值
linux-cleanup --all-safe -y          # 默认：100 天
linux-cleanup --all-safe --purge-all # 关卡关闭——完全清空，1.2.0 之前的行为
```

:::danger `--purge-all` 会完全关闭这道防护
使用 `--purge-all` 时，每个目标缓存都会被完全清空，不论文件新旧。正是这种行为促成了这道关卡：它会删除 Gradle wrapper 发行版、旧发布分支用的 Playwright 浏览器，以及锁定版本依赖的 yarn 缓存压缩包——每一样重新下载都代价不菲。

在重装机器之前，这是正当的选择；作为日常默认，它并不合适。
:::

运行前的横幅会说明当前启用的策略，因此对于即将发生的事永远不会有歧义。

## 关卡 3——个人数据仅限交互式 {#guard-3--personal-data-is-interactive-only}

能触及个人文件的模式按规定都是交互式的：

- [`--stale`](../modes/personal-stale-files.md)——`~/Downloads` 和已配置的未受保护根目录中体积大、长期闲置的文件
- [`--partials`](../modes/partial-downloads.md)——无主的未完成下载
- [`--node-modules`](../modes/node-modules-finder.md)——长期未用的项目依赖目录

**`--yes` 不适用于这些模式，将来也不会。** `--yes` 只自动确认可再生成的缓存。该工具会打印候选列表，等待逐项确认，在您回答之前什么都不删除。

原因在于个人文件没有程序可读的信号。磁盘上没有任何东西能区分一个您再也不会打开的安装包和一份您只是暂时还没用到的文档的唯一副本。只有用户能判断，所以工具拒绝猜测。

## 关卡 4——sudo 限制 {#guard-4--sudo-confinement}

[`--system`](../modes/system-cleanup.md) 是唯一会调用 `sudo` 的模式，而且只用于一组固定、列明的操作——每一项都是单独、可审查的调用，并分别询问：

| 操作 | 提示默认值 |
|---|---|
| `apt autoremove --purge -y` + `apt clean` | 是 |
| `journalctl --vacuum-size=100M` | 是 |
| 删除已停用的 snap 修订版 | 是 |
| 列出已安装的内核——**不删除** | — |
| 删除 `atime` 超过 7 天的 `/tmp` 文件 | 是 |
| `sync` + `sysctl vm.drop_caches=3` | **否** |

脚本不会编辑 `/etc/sudoers`，`--system` 会逐项询问。如果 `sudo` 不可用，该模式会直接中止，而不是在降级状态下继续。

这里有两个值是**写死的，不受 `--days` 影响**：日志清理目标（100 MB）和 `/tmp` 的时间阈值（7 天）。

## 没有任何关卡覆盖的部分 {#what-no-guard-covers}

把缺口说清楚，比安慰更有用。

| 缺口 | 含义 |
|---|---|
| **没有撤销** | 这里没有任何东西能让删除可逆。见[删除是永久的](./irreversibility.md)。 |
| **`~/Downloads` 不受保护** | 可以通过交互式的个人文件模式触及它——请阅读候选项。`~/Desktop` 是受保护的。 |
| **`--purge-all` 会去掉关卡 2** | 关卡 1、3、4 仍然适用；闲置阈值不再适用。 |
| **以 root 运行会扩大影响范围** | 这个工具是为普通用户运行而设计的。`--system` 会在内部处理正当的 sudo 需求。 |
| **防护保护的是路径，不是内容** | 受保护的目录无论在哪里都是安全的；不在其中的重要文件则不是。 |
| **`/proc` 和 `/sys` 不在受保护列表中** | 没有任何东西以它们为目标，但白名单也没有点名它们。 |

## 亲自验证防护 {#verifying-the-guards-yourself}

```bash
npx linux-cleanup --self-test      # 断言防护在已知路径上会触发
npx linux-cleanup --list-targets   # 打印目标列表和受保护列表
```

`--self-test` 是诚实的检查。它断言 `/`、`$HOME`、`~/Documents`、`~/.ssh` 和 `/etc` 受保护，而 `~/.cache/yarn` 不受保护；只要有一条断言失败就以非零状态退出。文档可能会过时，断言则针对您实际拥有的代码运行。

## 接下来 {#next}

- [受保护路径](../reference/protected-paths.md)——经过核实的完整列表
- [删除是永久的](./irreversibility.md)——“没有撤销”背后的考量
- [会删除什么](./what-it-deletes.md)——目标清单
