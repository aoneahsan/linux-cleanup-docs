---
title: 诊断
description: 找出已安装在磁盘上、却没有写入 shell 初始化的运行时——nvm、pnpm、bun、deno、cargo——并在您确认后追加标准的初始化代码块。只追加。
tags: [doctor, repair, shell, bashrc, nvm, pnpm, bun, deno, cargo, modes]
sidebar_position: 14
---

# 诊断

**`--doctor` 会找出已在磁盘上、却没有接入 shell 配置的运行时，并提供添加缺失初始化代码块的选项。** 在 [1.1.0](../changelog.md#110--2026-05-10) 中新增。

```bash
linux-cleanup --doctor
```

当您明明装了 pnpm 却看到 `pnpm: command not found` 时，用的就是这个模式。

## 只追加 {#additive-only}

:::note Doctor 从不删除或编辑已有的行
它只会**追加**一个标准的初始化代码块，而且要在您确认之后。它不会修改、重新排序或删除 shell 配置中已有的任何内容。

shell 初始化文件在删除层面还受到额外保护：`safe_rm` 会拒绝文件名为 `.bashrc`、`.zshrc`、`.profile`、`.bash_aliases` 等的任何路径，无论它在哪里。见[受保护路径](../reference/protected-paths.md#protected-basenames)。
:::

## 它检查什么 {#what-it-checks}

| 运行时 | 检测条件 | 追加内容 |
|---|---|---|
| `nvm` | 存在 `~/.nvm`，但没有 `NVM_DIR` 初始化 | 标准的 nvm 加载代码块 |
| `pnpm` | 存在 `~/.local/share/pnpm`，但不在 `PATH` 中 | `PNPM_HOME` 导出和 `PATH` 添加 |
| `bun` | 存在 `~/.bun`，但不在 `PATH` 中 | Bun 的初始化代码块 |
| `deno` | 存在 `~/.deno`，但不在 `PATH` 中 | Deno 的 `PATH` 添加 |
| `cargo` | 存在 `~/.cargo`，但不在 `PATH` 中 | `. "$HOME/.cargo/env"` |

## 通常是怎么发生的 {#how-this-usually-happens}

安装程序把初始化代码块写进了一个您的 shell 不会读取的文件。`~/.profile` 只有登录 shell 会读；存在 `~/.bash_profile` 时会遮蔽它；对 `~/.bashrc` 的修改永远到不了 `zsh` 会话。运行时装好了，然后看起来像是消失了。

在机器之间迁移 dotfiles 仓库之后，或切换登录 shell 之后，也会发生这种情况。

## 之后 {#afterwards}

重新加载 shell，否则修改看起来像是没生效：

```bash
source ~/.bashrc     # 或 ~/.zshrc
```

然后确认：

```bash
command -v pnpm && pnpm --version
```

## 它与全局包检查的关系 {#its-relationship-to-the-globals-audit}

[`--globals`](./globals-audit.md) 即使在包管理器不在 `PATH` 中时也能工作，因为它会退回到检查文件系统。所以如果检查列出了 pnpm 的全局包，`pnpm` 本身却找不到，`--doctor` 就是解决办法。

## 接下来 {#next}

- [全局包检查](./globals-audit.md)
- [故障排查](../troubleshooting.md)
