---
title: 有意识地回收空间
description: 检查 Linux 磁盘用量，预览每种清理模式，然后逐一选择缓存、项目或系统路径。
sidebar_position: 1
---

# 有意识地回收空间

**先测量。选择能解决您所发现路径的最小清理范围。** 报告中的缓存根目录大小，并不代表清理能够或应该把它全部删除。

## 1. 找出占用大的路径 {#1-find-the-large-paths}

```bash
linux-cleanup --audit
linux-cleanup --scan
```

`--audit` 会列出 `$HOME` 中体积大的条目，包括这个工具无法清理的东西。`--scan` 会列出已配置的缓存根目录和其他候选项，不删除任何内容。如果磁盘主要被虚拟机镜像、数据集或游戏库占用，请直接查看它们，而不是运行不相关的清理模式。

## 2. 预览日常缓存 {#2-preview-routine-caches}

```bash
linux-cleanup --all-safe --dry-run
```

默认的全安全模式会在超过 100 天闲置阈值后，修剪符合条件的可再生成缓存。预览会按这些规则走一遍而不删除，仍可能写入本地日志和更新检查状态。

如果拟删除的每条路径都是您能重建或重新下载的，就运行 `linux-cleanup --all-safe` 并查看它的确认。`--yes` 用于您已经检查过这台机器之后的无人值守运行。

## 3. 单独检查项目依赖 {#3-review-project-dependencies-separately}

```bash
linux-cleanup --node-modules --dry-run
```

项目依赖模式是交互式的。实际删除前，请检查项目路径和它的锁文件。直接在 `node_modules` 中做的本地修改，重新安装依赖后不会恢复。

## 4. 单独检查系统存储 {#4-review-system-storage-separately}

```bash
linux-cleanup --system --dry-run
```

完整的系统模式使用 apt 和 dpkg，所以适用于 Debian 和 Ubuntu。它会请求 sudo，包括日志清理、`/tmp` 中的旧文件，以及一个可选的页面缓存步骤。页面缓存步骤影响的是内存，而不是磁盘。见[系统清理](../modes/system-cleanup.md)。

## 5. 只有再预览一次之后才调整时间阈值 {#5-change-the-age-threshold-only-after-another-preview}

`--days N` 会改变哪些闲置文件或整个缓存单元符合条件。把它从 100 降到 30，可能会删掉您最近用过的东西，所以请先用选定的值看一次试运行。`--purge-all` 会关闭时间防护；它可能删掉您之后还得重新下载的 Gradle 发行版或测试浏览器。

## 6. 把个人文件作为单独的决定 {#6-keep-personal-files-as-a-separate-decision}

`--stale` 会显示体积大的闲置个人文件候选项，并逐个询问是否删除。一个旧的下载可能是您唯一的副本。`--yes` 不会批准这个模式。见[长期未用的个人文件](../modes/personal-stale-files.md)和[删除是永久的](../safety/irreversibility.md)。

回收的空间因机器而异，也受运行期间其他进程写入的影响。决定是否需要另一个模式之前，请查看最终日志和被保留的路径。
