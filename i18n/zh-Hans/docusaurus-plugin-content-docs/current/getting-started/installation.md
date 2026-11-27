---
title: 安装
description: 三种方式安装 linux-cleanup——用 npx 免安装、用 npm 全局安装，或克隆仓库——并在执行任何删除之前验证安装。
sidebar_position: 2
---

# 安装

**linux-cleanup 有三种获取方式：免安装的 `npx`、全局 `npm` 安装，或 `git clone`。** 三种方式运行的都是同一个 Bash 脚本——npm 软件包只是一个很薄的 Node 启动器，负责找到 `cleanup.sh`，并把日志和报告指向一个持久目录。

:::info 检查已安装的版本
安装或升级后运行 `linux-cleanup --version`。[更新日志](../changelog.md)记录了试运行和版本通知的变化。
:::

## 方式 1——`npx`，免安装 {#option-1--npx-no-install}

这是试用它最快的方式。不会往您的 `PATH` 里放任何东西；如果您决定不用，也不会留下任何东西。

```bash
npx linux-cleanup --version
npx linux-cleanup --scan      # 只读检查
npx linux-cleanup             # 引导流程
```

`npx` 会把软件包下载到一个临时的 npm 缓存目录。您的日志和报告写入 `~/.linux-cleanup/`，**而不是**临时目录，因此即使 npm 缓存被清理，它们也会保留，下次仍然在。

## 方式 2——全局 `npm` 安装 {#option-2--global-npm-install}

```bash
npm install -g linux-cleanup
linux-cleanup --version
```

之后 `linux-cleanup` 在任何地方都在您的 `PATH` 上。日志和报告仍写入 `~/.linux-cleanup/`。

```bash
npm install -g linux-cleanup@latest   # 升级
npm uninstall -g linux-cleanup        # 移除
```

卸载软件包不会移除您安装的 shell 别名或 cron 条目——完整移除见[卸载](../guides/uninstall.md)。

## 方式 3——`git clone` {#option-3--git-clone}

用于阅读、审查或修改源代码。仓库内容就是 npm 发布的内容。

```bash
git clone https://github.com/aoneahsan/linux-cleanup ~/linux-cleanup
cd ~/linux-cleanup
chmod +x cleanup.sh
./cleanup.sh --self-test
./cleanup.sh
```

唯一的行为差异：**克隆版会把输出放在源代码旁边**，即 `<clone>/logs/`、`<clone>/reports/` 和 `<clone>/feedback/`，而不是 `~/.linux-cleanup/`。两者都可以用 `LINUX_CLEANUP_DATA_HOME` 覆盖。见[输出路径](../reference/output-paths.md)。

本项目采用 MIT 许可证，因此可以自由分叉和修改。

## 执行任何删除之前先验证 {#verify-before-you-run-anything-destructive}

```bash
linux-cleanup --version      # 确认您实际拥有的是哪个版本
linux-cleanup --self-test    # 依赖、语法和安全防护检查
```

自检通过时会以一条通过信息结束。它会断言[受保护路径防护](../safety/guards.md#guard-1--the-path-allowlist)确实拒绝 `/`、`$HOME`、`~/Documents`、`~/.ssh` 和 `/etc`，并且不会拒绝 `~/.cache/yarn`。任何一条断言失败都会以非零状态退出。

:::tip 每次升级后都运行 `--self-test`
它是唯一针对您实际拥有的代码、而不是针对文档运行的检查，只需一秒钟。
:::

## 选择哪种安装方式 {#which-install-path-to-choose}

| 如果您…… | 使用 |
|---|---|
| 想试用一次 | `npx` |
| 会经常运行，或从 cron 运行 | 全局 `npm` 安装 |
| 想阅读或修改源代码 | `git clone` |
| 所在机器没有 Node.js | `git clone` |
| 需要把输出放在源代码旁边 | `git clone` |

对于 cron，建议使用全局安装，并在 crontab 中使用**绝对路径**——cron 运行时的 `PATH` 极简，找不到 `~/.local/bin` 中的安装。这是最常见的 cron 问题；见[别名与 cron](../guides/alias-and-cron.md)。

## 安装不会做什么 {#what-installing-does-not-do}

- 不会创建系统服务、后台守护进程或计划任务（除非您要求）
- 没有遥测代理。启动时，命令行在联网时会获取一份公开的版本记录；离线时照常继续
- 除非您运行 `--install-alias` 或 `--doctor`，否则不会修改 shell 配置
- 不会在软件包和 `~/.linux-cleanup/` 之外创建文件，而后者也只在您真正运行它时才会创建

## 接下来 {#next}

- [快速开始](./quick-start.md)——您的第一次清理
- [会删除什么](../safety/what-it-deletes.md)——第一次执行删除前请阅读
- [卸载](../guides/uninstall.md)——完整移除，包括别名和 cron
