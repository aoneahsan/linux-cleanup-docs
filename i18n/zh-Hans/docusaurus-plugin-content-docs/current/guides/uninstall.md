---
title: 卸载
description: 完全移除 linux-cleanup——软件包、shell 别名、cron 条目，以及它的日志和会话记录。
tags: [guide, uninstall, remove, cleanup, cron, alias]
sidebar_position: 4
---

# 卸载

**先移除自动化，再移除软件包，最后移除数据。** 卸载软件包不会移除您安装的 shell 别名或 cron 条目——它们是分开的。

## 1. 移除自动化 {#1-remove-the-automation}

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

请在移除软件包**之前**做这一步，趁命令还在。如果您已经把它移除了，见下文的[手动移除](#if-you-removed-the-package-first)。

验证：

```bash
crontab -l | grep -i cleanup     # 应当没有输出
grep -rn 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

## 2. 移除软件包 {#2-remove-the-package}

```bash
npm uninstall -g linux-cleanup
```

如果用的是 `npx`，什么都没有安装——npm 缓存会自己清掉它。想立即清除：

```bash
npm cache clean --force
```

如果是 git 克隆，删除那个目录：

```bash
rm -rf ~/linux-cleanup
```

:::caution 克隆版保存着自己的日志和记录
与 npm 安装方式不同，克隆版把输出保存在 `<clone>/logs/` 和 `<clone>/reports/` 中。删除克隆也会删除它们。想保留的请先复制出来。见[输出路径](../reference/output-paths.md)。
:::

## 3. 移除数据 {#3-remove-the-data}

日志、会话记录和反馈包位于 `~/.linux-cleanup/`，卸载**永远不会**删除它们。

```bash
ls -la ~/.linux-cleanup/           # 删除前先看一看
rm -rf ~/.linux-cleanup/
```

它们很小——通常只有几 MB——而且是过去的运行删除了什么的唯一记录。保留它们没有任何代价；删除它们和其他任何删除一样无法撤销。

如果您设置过 `LINUX_CLEANUP_DATA_HOME`，请改为删除那个目录，并从 shell 配置中去掉这条导出。

## 4. 移除配置（如果您创建过） {#4-remove-configuration-if-you-created-any}

```bash
rm -f ~/.config/personal-roots.txt ~/.config/project-roots.txt
```

只有您自己创建过才会存在。见[环境变量](../reference/environment-variables.md#configuring-the-scanned-roots)。

## 如果您先移除了软件包 {#if-you-removed-the-package-first}

手动撤销这两个辅助设置。

**Cron：**

```bash
crontab -e
# 删除包含 linux-cleanup 或 cleanup.sh 的那一行
```

**别名：**

```bash
grep -n 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

用编辑器删除匹配的别名行，然后 `source` 该文件或打开一个新终端。

## 会留下什么 {#what-is-left-behind}

完成以上步骤后，什么都不会留下。这个工具不会安装系统服务、守护进程、systemd 单元、`/etc` 条目或属于 root 的文件。它创建的一切都在您的主目录中。

它不会撤销的对系统的影响——因为这些不是它拥有的文件：

- **被删除的缓存保持删除状态。** 各个工具需要时会重新生成
- **[`--doctor`](../modes/doctor.md) 添加的 shell 初始化代码块**会保留。对您已安装的运行时来说，它们是正确的配置；如果不想要，请手动删除

## 验证 {#verify}

```bash
command -v linux-cleanup      # 应当没有输出
crontab -l | grep -i cleanup  # 应当没有输出
ls ~/.linux-cleanup 2>&1      # 应当显示：No such file or directory
```

## 接下来 {#next}

- [安装](../getting-started/installation.md)——如果您要重新安装
