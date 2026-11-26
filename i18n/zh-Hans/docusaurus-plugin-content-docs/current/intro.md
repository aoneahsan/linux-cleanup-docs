---
title: linux-cleanup
description: 一个 Bash 命令行工具，在路径白名单、闲置阈值和交互确认的保护下，通过永久删除可再生成的缓存来回收 Linux 上的磁盘空间。
tags: [linux, cleanup, disk-space, cli, bash, overview]
slug: /
sidebar_label: 简介
sidebar_position: 1
---

# linux-cleanup

**linux-cleanup 在删除 Linux 上可再生成的缓存之前，先把路径给您看。** 它涵盖包管理器、浏览器和构建工具的缓存，系统维护和个人文件候选项各有独立的模式。在选择实际清理之前，先做一次只读扫描或试运行。

获取 linux-cleanup：[npm](https://www.npmjs.com/package/linux-cleanup) · [网站](https://linux-cleanup.aoneahsan.com) · [所有渠道](/apps)

这是一个**会删除数据的工具**。每次删除都是永久的，无法撤销。它的安全来自一开始就拒绝触碰不该碰的东西，而不是事后能把东西放回去。

:::danger 此工具会永久删除文件
没有撤销、回收站或备份步骤。实际清理会永久删除所选文件。确认之前，先用 `--dry-run` 预览所选模式。

在让它删除任何内容之前，请先阅读 **[会删除什么](./safety/what-it-deletes.md)** 并运行 **[只读预览](./safety/preview-first.md)**。
:::

| | |
|---|---|
| **软件包版本** | npm 上的 2.1.1（2026-11-22）；已安装的版本请用 `linux-cleanup --version` 查看 |
| **平台** | 仅限 Linux——`bash` ≥ 4 和 GNU coreutils |
| **许可证** | [MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)——自 1.4.0 起 |
| **网络访问** | 联网时启动会请求一次公开的版本记录；安装或更新时还会用到 npm 或 GitHub |
| **作者** | [Ahsan Mahmood](https://aoneahsan.com) · [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |

## 请按顺序阅读

这份文档是为一个会擦除数据的工具刻意排好顺序的。前三页能让您避开麻烦。

| 步骤 | 页面 | 原因 |
|---|---|---|
| 1 | [会删除什么](./safety/what-it-deletes.md) | 按类别列出的完整目标清单 |
| 2 | [删除前先预览](./safety/preview-first.md) | 先只读扫描，再对所选模式做试运行 |
| 3 | [安全防护](./safety/guards.md) | 路径被删除前必须通过的四道关卡 |
| 4 | [删除是永久的](./safety/irreversibility.md) | “无法撤销”在实际中意味着什么 |
| 5 | [安装](./getting-started/installation.md) | `npx`、全局 `npm` 或 `git clone` |
| 6 | [快速开始](./getting-started/quick-start.md) | 您的第一次实际清理 |

## 它擅长什么

- **展示候选项。** 扫描会列出缓存根目录及其当前大小。试运行会走完所选清理流程并列出拟执行的操作。
- **不删错东西。** [路径白名单](./reference/protected-paths.md)会在解析符号链接之后，硬性拒绝 `~/Documents`、`~/.ssh`、`~/.config`、`/etc` 等目录。
- **不碰最近用过的文件。** 自 1.2.0 起，默认是*修剪*而不是清空：在一个缓存中，只删除 100 天以上未被访问的文件。见[闲置阈值关卡](./safety/guards.md#guard-2--the-staleness-gate)。
- **记录每次运行。** 命令行会保留本地日志。引导式流程会写一份 [JSON 会话报告](./reference/report-schema.md)（除非被关闭）；试运行不会。
- **检查更新。** 启动时，命令行会在可用时通过 HTTPS 读取一份公开的版本记录。

## 它不是什么

说清边界比列功能更有用。

- **不是备份工具。** 它只删除，从不归档。它删除的东西无法在工具内恢复。
- **不是撤销工具。** [`--scan`](./modes/scan.md) 只读；`--dry-run` 预览所选清理；二者都无法在实际运行后恢复文件。
- **不是安全扫描器。** 它不会查找密钥、恶意软件或漏洞。
- **不跨平台。** 仅限 Linux。npm 软件包声明了 `"os": ["linux"]`。
- **并非支持所有发行版。** `$HOME` 内的缓存清理在任何发行版上都能用，但 [`--system` 模式仅支持 Debian/Ubuntu](./distro-support.md)——它会直接调用 `apt` 和 `dpkg`。
- **不能代替您的判断。** 确认之前，请先看清它打算做什么。

## 30 秒版本

```bash
# 1. 看看能回收多少空间。不删除任何内容。
npx linux-cleanup --scan

# 2. 预览所选清理，不删除任何内容。
npx linux-cleanup --all-safe --dry-run

# 3. 运行引导式流程。每项删除前都先确认。
npx linux-cleanup
```

第 3 步是默认模式。它会依次走过十个类别，每个类别前都会询问，显示已回收字节的累计数，并在最后写一份报告。见[引导流程](./modes/walkthrough.md)。

## 接下来去哪里

- 想尽快拿回空间？→ [回收最多的空间](./guides/reclaim-the-most-space.md)
- 出了问题？→ 先看[恢复](./recovery.md)，再看[故障排查](./troubleshooting.md)
- 想看所有参数？→ [命令行参数](./reference/cli-flags.md)
- 想知道改了什么？→ [更新日志](./changelog.md)
