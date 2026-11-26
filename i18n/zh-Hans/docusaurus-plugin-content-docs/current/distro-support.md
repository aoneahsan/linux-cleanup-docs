---
title: 发行版支持
description: linux-cleanup 在各个 Linux 发行版上会做什么——缓存清理到处都能用，但需要 sudo 的 --system 模式只针对 Debian 和 Ubuntu。
tags: [distro, ubuntu, debian, fedora, arch, opensuse, wsl, compatibility]
sidebar_position: 90
---

# 发行版支持

**主目录缓存清理面向装有所需 GNU 工具的 Linux 发行版。**
[`--system`](./modes/system-cleanup.md) 使用 Debian 和 Ubuntu 的软件包命令。清理前请用 `--self-test` 检查已安装的工具。

## 概览 {#the-summary}

| 发行版系列 | `$HOME` 缓存清理 | `--system` |
|---|---|---|
| Debian, Ubuntu, Mint, Pop!\_OS | 完整支持 | **完整支持** |
| Fedora, RHEL, Rocky, Alma | 需要所需工具 | 请勿使用：apt 步骤会失败 |
| Arch, Manjaro, EndeavourOS | 需要所需工具 | 请勿使用：apt 步骤会失败 |
| openSUSE | 需要所需工具 | 请勿使用：apt 步骤会失败 |
| Alpine、精简容器 | 需要 Bash 和 GNU 工具 | 请勿使用：apt 步骤会失败 |
| WSL | 需要所需工具 | 仅限 Debian/Ubuntu；先检查挂载的路径 |

:::warning `--system` 不检测发行版
apt 步骤直接调用 `apt` 和 `dpkg`，没有 `command -v` 检查，也不会退回到 `dnf`、`pacman` 或 `zypper`。在非 Debian 系统上，每一步都会以 "command not found" 失败。

apt 失败后模式不会中止：后面的步骤仍可能运行。在其他发行版上请避免使用。

有些对这个工具的介绍声称 `--system` 有分级的多发行版支持，用 `dnf` 代替 `apt`，在 Arch 上用 `paccache`。**根本没有这样的代码。** 在克隆上运行 `grep -rn 'dnf\|pacman\|zypper' modules/system_sudo.sh` 即可验证——它什么都不会返回。
:::

## 逐步说明 {#step-by-step}

| `--system` 步骤 | Debian/Ubuntu | Fedora/RHEL | Arch | openSUSE |
|---|---|---|---|---|
| `apt autoremove` + `apt clean` | 可用 | **失败** | **失败** | **失败** |
| `journalctl --vacuum-size=100M` | 可用 | 可用 | 可用 | 可用 |
| 已禁用的 snap 修订版 | 可用 | 装有 snap 时可用 | 装有 snap 时可用 | 装有 snap 时可用 |
| 内核列表（`dpkg --list`） | 可用 | 无输出——什么都不打印 | 无输出 | 无输出 |
| 超过 7 天的 `/tmp` 文件 | 可用 | 可用 | 可用 | 可用 |
| 释放页面缓存 | 可用 | 可用 | 可用 | 可用 |

日志、`/tmp` 和页面缓存这几步依赖 `journalctl`、`find` 和 `sysctl`，在有 systemd 的地方表现都一样。内核那一步无论如何都只是列出，所以它在非 dpkg 系统上失败也没有任何损失。

## 自己处理软件包部分 {#doing-the-package-part-yourself}

在非 Debian 系统上，请遵循该系统软件包管理器自己的维护建议。下面的命令只是示例，运行前请先看清楚：

```bash
# Fedora / RHEL / Rocky
sudo dnf autoremove
sudo dnf clean all

# Arch / Manjaro  (paccache 在 pacman-contrib 中)
sudo pacman -Rns "$(pacman -Qtdq)"    # 孤立的包（如果有）
sudo paccache -r                       # 保留最近 3 个版本
sudo pacman -Scc                       # 清空整个软件包缓存

# openSUSE
sudo zypper clean --all
sudo zypper packages --orphaned
```

对于主目录缓存，先预览 linux-cleanup 找到了什么：

```bash
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

## 主目录缓存目标 {#home-cache-targets}

主目录下的路径取决于已安装的工具，而不是发行版。具体每台机器都不同：

- 软件包管理器缓存——yarn、npm、pnpm、pip、composer、bun、deno
- 浏览器缓存——Chrome、Firefox、Brave、Chromium、Edge、Vivaldi
- 构建工具缓存——Gradle、Cypress、Playwright、TypeScript
- 开发工具数据——Android AVD、Flutter pub-cache、Dart、flatpak
- 编辑器扩展——VS Code、Cursor
- `node_modules`、未完成的下载、长期未用的个人文件
- 扫描、检查、安全检查和本地日志

## 精简容器 {#minimal-containers}

Alpine 和其他精简镜像通常带的是 BusyBox 而不是 GNU coreutils。工具需要 GNU 的 `find`、`du`、`stat`，尤其是 `realpath`——它负责在[受保护路径检查](./reference/protected-paths.md)之前解析符号链接。

```bash
apk add coreutils findutils bash
linux-cleanup --self-test
```

`--self-test` 会指出第一个缺少的依赖。在它通过之前，不要运行会删除文件的模式。

## WSL {#wsl}

工具运行在 Linux 环境中。它的路径保护会解析符号链接，但不会把 Windows 的个人文件夹识别为受保护的 Linux 文件夹。如果您的主目录或缓存指向 `/mnt/`，请仔细检查扫描和试运行的结果。

## macOS {#macos}

不支持。npm 软件包声明了 `"os": ["linux"]`，会拒绝安装。路径、`find` 参数和软件包管理器都不一样。

## 接下来 {#next}

- [系统清理](./modes/system-cleanup.md) — 本页所说明的模式
- [系统要求](./getting-started/requirements.md)
