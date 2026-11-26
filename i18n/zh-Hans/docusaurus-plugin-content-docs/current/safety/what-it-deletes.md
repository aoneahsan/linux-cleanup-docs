---
title: 会删除什么
description: Linux 清理模式及其目标路径，以及日常缓存、系统操作和个人文件之间的区别。
tags: [safety, deletion, targets, caches, disk-space]
sidebar_position: 1
---

# 会删除什么

**linux-cleanup 会永久删除所选的缓存和残留文件。** 目标取决于模式。扫描会列出路径和当前大小；试运行会走完所选清理并显示拟执行的操作。两者都不是备份。

```bash
linux-cleanup --list-targets
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

[受保护路径防护](../reference/protected-paths.md)会在解析符号链接之后，拒绝已配置的个人和系统位置。实际运行前，请阅读每一条拟删除的路径。

## 包管理器缓存

日常的全安全清理可以修剪以下缓存根目录。之后重新安装软件包可能需要联网下载。

| 缓存 | 目标根目录 |
|---|---|
| Yarn Berry | `~/.yarn/berry/cache` |
| npm | `~/.npm/_cacache` |
| npx | `~/.npm/_npx` |
| pnpm store | `~/.local/share/pnpm/store` |
| pnpm cache | `~/.cache/pnpm` |
| bun | `~/.bun/install/cache` |
| deno | `~/.cache/deno` |
| Composer | `~/.cache/composer` |
| pip | `~/.cache/pip` |

Yarn v1 解压出的软件包会在 `~/.cache/yarn` 中按整个条目修剪。全局安装的软件包和包管理器的安装根目录与这些缓存是分开的。

## 浏览器和应用缓存

日常目标包括已配置的浏览器缓存、Gradle 版本单元、Cypress 和 Playwright 二进制文件，以及 TypeScript 监视器缓存。浏览器或构建工具下次使用时，可能需要重建或重新下载被删除的内容。当前的 Gradle 发行版和当前的 Android Studio 版本由各自的规则保留；符合条件的旧单元会被整体删除，不会留下删了一半的安装。

在按文件修剪之前，该模式会检查最后访问和修改时间。访问时间不可靠的文件系统会阻止按时间修剪。`--purge-all` 会去掉这道时间关卡，需要单独决定。

## 开发工具数据

扫描可能显示 Android AVD、Flutter pub 缓存、Flatpak 用户数据和其他体积大的根目录。**某条路径出现在扫描中，并不代表 `--all-safe` 会删除它。** 请阅读对应模式的页面和试运行输出，了解所选模式实际针对什么。Android 模拟器和已安装的 Flatpak 应用不属于日常缓存。

## 编辑器扩展

`--editor-ext` 会处理 VS Code 和 Cursor 中已被取代的扩展版本。它要求存在更新的版本，并且旧版本处于闲置状态；当前版本会保留。见[编辑器扩展](../modes/editor-extensions.md)。

## 项目文件和个人文件——仅限交互式

长期未用的项目 `node_modules`、未完成的下载和体积大的长期未用个人文件候选项，使用各自独立的交互式模式。`--yes` 不会批准这些模式。一个未完成的下载或 `~/Downloads` 中的文件，可能是您仅有的副本。确认前请阅读每条路径及其后果。

## 系统清理（需要 sudo）

`--system` 会在执行 apt、日志、Snap、`/tmp` 和页面缓存这些步骤前逐一询问。它的包管理命令使用 `apt` 和 `dpkg`，不会适配 Fedora、Arch 或 openSUSE。内核步骤只列出已安装的版本，不会直接删除任何一个。日志清理的目标是 100 MB，`/tmp` 的老化时间固定为 7 天，不受 `--days` 影响。释放页面缓存影响的是内存，而不是磁盘空间。见[系统清理](../modes/system-cleanup.md)和[发行版支持](../distro-support.md)。

## 它拒绝删除什么

防护会拒绝根目录和受保护的主目录路径，例如 `~/Documents`、`~/Pictures`、`~/.ssh`、`~/.config` 和 `~/.claude`。完整列表及其例外见[受保护路径](../reference/protected-paths.md)。`--self-test` 会在已安装的副本中检查部分拒绝情形。

实际删除无法撤销。[删除前先预览](./preview-first.md)说明了清理前应遵循的顺序。
