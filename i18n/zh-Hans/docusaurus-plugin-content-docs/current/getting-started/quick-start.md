---
title: 快速开始
description: 大约十分钟完成第一次 linux-cleanup 会话——验证防护、只读检查，然后运行引导流程并阅读报告。
sidebar_position: 3
---

# 快速开始

**删除之前，先验证防护、查看扫描结果，并预览所选模式。** 能回收多少空间，取决于这台机器上的路径和文件。

:::caution 不要跳过第 1 步和第 2 步
它们只需两分钟，却决定了这次清理是您掌控的，还是事后才发现的。这个工具会[永久删除](../safety/irreversibility.md)。
:::

## 第 1 步——验证安装 {#step-1--verify-the-install}

```bash
npx linux-cleanup --version
npx linux-cleanup --self-test
```

`--version` 确认您拥有的是哪个版本。`--self-test` 检查依赖和 shell 语法，并断言安全防护确实会触发。通过时会以一条通过信息结束；任何断言失败都会以非零状态退出，此时您应该停下。

## 第 2 步——检查，不删除任何内容 {#step-2--audit-deleting-nothing}

```bash
npx linux-cleanup --scan
```

`--scan` 是只读的。它列出缓存根目录及其当前大小，以及其他候选项和系统观察结果。它不会删除，也不会写 JSON 会话报告。

继续之前请阅读这些路径。缓存根目录的大小并不表示整个目录都可以删除。请单独检查任何意外出现的路径和每个个人文件候选项。

## 第 3 步——预览清理 {#step-3--preview-the-cleanup}

```bash
npx linux-cleanup --all-safe --dry-run
```

它会走完全安全缓存模式，但不删除文件，也不更改设置。阅读拟执行的操作，再决定是否运行。实际删除无法撤销。

## 第 4 步——运行引导流程 {#step-4--run-the-guided-walkthrough}

```bash
npx linux-cleanup
```

不带参数就是[引导流程](../modes/walkthrough.md)：十个步骤，每一步执行前都会询问，并显示已回收字节的累计数。

每一步您都有三个选择：

| 按键 | 效果 |
|---|---|
| `a` | 执行这一步（默认——直接按 Enter 即选择它） |
| `s` | 跳过这一步 |
| `q` | 立即退出引导流程 |

在一个步骤内，每个目标还有各自的 `[Y/n]` 确认。所以有两个层级：跳过整个类别，或接受类别但拒绝其中的具体项目。

十个步骤依次为：

1. 包管理器缓存
2. 应用缓存
3. 开发工具数据
4. 编辑器旧扩展
5. 长期未用的 `node_modules`
6. 未完成 / 无主的下载
7. 长期未用的个人文件
8. 系统清理（sudo）
9. 最终大小检查
10. 生成可读报告

:::tip 第 6 步和第 7 步要放慢速度
它们之前的所有内容都可再生成。未完成的下载和长期未用的个人文件则不是——请逐个阅读候选项，而不是整批接受。如果您想之后再单独查看，第一次运行时可以用 `s` 跳过这两步。
:::

`Ctrl-C` 会以代码 `130` 停止引导流程。之前已执行的删除仍然是永久的。阅读日志可以了解中断前运行了哪些步骤。

## 第 5 步——阅读报告 {#step-5--read-the-report}

会话结束时会给出一份摘要，写明日志路径，以及生成报告时的报告路径。请以您这次运行给出的路径为准，不要假设每种安装方式的位置都相同。

除非您传入 `--no-report` 或 `--dry-run`，引导流程都会写一份 JSON 报告。要把已有报告转换成便于阅读或归档的格式，请安装 `jq` 并运行：

```bash
linux-cleanup --export both latest   # 在 JSON 旁边生成 Markdown 和 HTML
linux-cleanup --reports              # 交互式报告管理器
```

见[报告](../modes/reports.md)。

## 第 6 步——信任它之后再自动化 {#step-6--automate-it-once-you-trust-it}

只有在一次让您满意的手动运行之后：

```bash
linux-cleanup --install-alias   # 在任何地方输入 `cleanup`
linux-cleanup --install-cron    # 每周日 03:00 运行 --all-safe -y
```

cron 任务运行 `--all-safe -y`，它**只自动确认可再生成的缓存**。它碰不到个人文件——[这些模式会忽略 `--yes`](../safety/guards.md#guard-3--personal-data-is-interactive-only)。

各自写入了什么、如何移除，见[别名与 cron](../guides/alias-and-cron.md)。

## 您现在知道了 {#what-you-now-know}

| 概念 | 延伸阅读 |
|---|---|
| 只读模式从不删除 | [删除前先预览](../safety/preview-first.md) |
| 引导流程在每一步前都会询问 | [引导流程](../modes/walkthrough.md) |
| 白名单会拒绝 Documents、`.ssh`、`.config` | [安全防护](../safety/guards.md) |
| 默认只修剪闲置 100 天以上的文件 | [闲置阈值关卡](../safety/guards.md#guard-2--the-staleness-gate) |
| 个人数据模式仅限交互式 | [长期未用的个人文件](../modes/personal-stale-files.md) |
| 工具内无法恢复任何内容 | [删除是永久的](../safety/irreversibility.md) |

## 常见的后续问题 {#common-follow-ups}

- **“我想要更多空间。”** → [回收最多的空间](../guides/reclaim-the-most-space.md)
- **“出问题了。”** → [故障排查](../troubleshooting.md)
- **“它删了我想要的东西。”** → [恢复](../recovery.md)
- **“都有哪些参数？”** → [命令行参数](../reference/cli-flags.md)
