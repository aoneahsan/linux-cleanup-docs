---
title: 运行要求
description: linux-cleanup 运行所需的条件——bash 4+、GNU coreutils、仅限 Linux——以及可解锁报告导出和可视化菜单的可选依赖。
tags: [requirements, dependencies, installation, jq, whiptail]
sidebar_position: 1
---

# 运行要求

**linux-cleanup 在装有 `bash` 4 或更新版本和 GNU coreutils 的 Linux 上运行。** 其余都是可选的，缺少时会平稳降级。

## 平台 {#platform}

| | |
|---|---|
| **操作系统** | 仅限 Linux。npm 软件包声明了 `"os": ["linux"]`，在其他系统上会拒绝安装 |
| **Shell** | `bash` ≥ 4.0 |
| **Node.js** | ≥ 14——**仅**用于 `npx` 和 `npm install -g` 两种方式。git clone 不需要 |
| **权限** | 以普通用户运行。只有 [`--system`](../modes/system-cleanup.md) 会请求 `sudo` |

macOS 和 WSL 值得分开说：

- **不支持 macOS。** 路径、`find` 参数和包管理器都不同。有一个面向它的姊妹工具；不要把这个工具用在 Mac 上。
- **WSL 运行在 Linux 一侧。** 清理前，请检查 `$HOME` 中任何指向 `/mnt/c/` 的符号链接。[白名单](../reference/protected-paths.md)会解析符号链接，但受保护的 Linux 主目录路径并不意味着每个 Windows 目录都受保护。

## 必需的命令 {#required-commands}

几乎所有主流发行版都自带这些命令：`bash`, `find`, `du`, `df`, `rm`, `awk`, `sort`, `grep`, `sed`, `stat`, `realpath`。

`realpath` 比其他命令更重要：受保护路径检查之前，正是它负责解析符号链接。在没有 GNU coreutils 的精简容器镜像上，请先安装它们再运行。

```bash
npx linux-cleanup --self-test
```

`--self-test` 会探测每个必需的命令，并指出第一个缺失的命令和修复提示。执行任何删除之前请先运行它。

## 可选依赖 {#optional-dependencies}

每一项解锁一个功能。缺少时，该功能不可用，工具的其余部分不受影响。

| 依赖 | 解锁 | 缺少时 |
|---|---|---|
| `jq` | Markdown / HTML [报告导出](../modes/reports.md) | 仍会写入 JSON 报告；无法转换 |
| `whiptail` | 可视化 [TUI 菜单](../modes/tui.md) | `--tui` 退回到命令行菜单，并给出安装提示 |
| `dialog` | 没有 `whiptail` 时的 TUI 备选 | 同上 |
| `snap` | `--system` 中清理已停用的 snap 修订版 | 该步骤会被干净地跳过 |
| `crontab` | [每周 cron 安装器](../guides/alias-and-cron.md) | `--install-cron` 无法运行 |
| `numfmt` | 易读的字节大小 | 退回到原始字节数 |
| `xdg-open` | 在浏览器中打开 HTML 报告 | 手动打开文件 |
| `less` | 报告管理器中的分页 JSON 视图 | 直接阅读文件 |
| `lsb_release` | 反馈包中更准确的发行版识别 | 反馈包仍会生成 |

### 安装最重要的两个 {#installing-the-two-that-matter}

`jq`（报告导出）和 `whiptail`（可视化菜单）是大多数人需要的两个。

```bash
# Debian / Ubuntu / Mint
sudo apt install jq whiptail

# Fedora / RHEL / Rocky
sudo dnf install jq newt

# Arch / Manjaro
sudo pacman -S jq libnewt

# openSUSE
sudo zypper install jq newt
```

在基于 RPM 的发行版上，`whiptail` 可执行文件在 `newt` 软件包中；在 Arch 上则在 `libnewt` 中。

## 发行版覆盖 {#distro-coverage}

`$HOME` 内的缓存清理——也就是这个工具回收空间的绝大部分——在所有 Linux 发行版上表现完全一致。

:::warning `--system` 仅限 Debian/Ubuntu
sudo 模式直接调用 `apt` 和 `dpkg`，不检测发行版，也没有防护。在 Fedora、Arch 或 openSUSE 上，它的软件包步骤会以 “command not found” 失败。

各步骤在哪里可用的完整说明：[发行版支持](../distro-support.md)。
:::

## 磁盘上的输出 {#output-on-disk}

每次运行都可能写一份本地日志。引导流程还可能写一份 JSON 报告；在您请求时或出现意外失败后，会生成调试包。它们的大小取决于运行情况。目录结构见[输出路径](../reference/output-paths.md)。

## 接下来 {#next}

- [安装](./installation.md)——三种安装方式
- [快速开始](./quick-start.md)——您的第一次清理
