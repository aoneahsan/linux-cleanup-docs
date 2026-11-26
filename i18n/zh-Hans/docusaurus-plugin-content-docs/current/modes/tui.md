---
title: TUI（可视化菜单）
description: linux-cleanup 1.3.0 新增的由 whiptail 或 dialog 驱动的可视化菜单，两者都未安装时会平稳退回到命令行菜单。
tags: [tui, whiptail, dialog, visual, menu, modes]
sidebar_position: 5
---

# TUI（可视化菜单）

**`--tui` 会把类别菜单渲染成全屏的 whiptail 或 dialog 对话框。** 在 [1.3.0](../changelog.md#130--2026-05-10) 中新增。行为与 [`--menu`](./menu.md) 相同，只是呈现方式不同。

```bash
linux-cleanup --tui      # 或： -t, -g, --gui
```

## 它如何工作 {#how-it-behaves}

选中一项后，会退出对话框，以正常的命令行输出和提示运行该类别，然后回到菜单。所以对话框只是一个启动器——真正的确认仍是标准的文本提示，每道安全防护都不变。

TUI 还带有一个**关于**对话框，显示版本、联系方式、许可证和隐私承诺。

## 依赖与备选 {#requirements-and-fallback}

需要 `whiptail` 或 `dialog`。两者都没有时，工具会打印针对各发行版的安装提示，并退回到普通的命令行菜单——不会失败。

```bash
sudo apt install whiptail     # Debian / Ubuntu
sudo dnf install newt         # Fedora / RHEL
sudo pacman -S libnewt        # Arch
```

在 RPM 和 Arch 系统上，`whiptail` 包含在 `newt` / `libnewt` 软件包中，所以软件包名和命令名对不上。

:::note 这是工具唯一会检测发行版的地方
上面的安装提示会识别发行版。linux-cleanup 的其他部分都不会——尤其是 [`--system` 默认是 Debian/Ubuntu](../distro-support.md)。
:::

## 什么时候用纯文本菜单 {#when-to-use-the-plain-menu}

`--tui` 需要能渲染全屏对话框的终端。在受限的连接上、在 CI 日志中，或在没有 TTY 的 `ssh -T` 会话里，请改用 [`--menu`](./menu.md)——它除了 bash 什么都不需要。

## 接下来 {#next}

- [菜单](./menu.md)——文本版本
- [模式概览](./overview.md)
