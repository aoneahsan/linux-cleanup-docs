---
title: 受保护的路径
description: linux-cleanup 拒绝删除的路径的完整核实清单——系统根目录、个人目录、软件包管理器的安装根目录以及 shell 初始化文件名。
sidebar_position: 3
---

# 受保护的路径

**这些是 linux-cleanup 拒绝删除的路径。** 拒绝是无条件的——没有任何参数能覆盖它，包括 `--purge-all`。

每个候选路径在检查前都会用 `realpath` 解析，所以指向受保护目录的符号链接会按解析后的路径被拒绝，而不是按链接本身。

:::tip 以您自己的安装为准，而不是只信这个页面
清单在不同版本之间会变化，而且流传着一些二手介绍，把实际上**并不**受保护的目录也列了进去。

```bash
linux-cleanup --list-targets   # 您的版本看到的清单
linux-cleanup --self-test      # 断言保护对已知路径确实生效
```
:::

## 三份不同的清单 {#three-separate-lists}

这道保护由三份匹配规则不同的清单构成。区别很重要——正是它让 `~/.npm/_cacache` 可以被清理，而 `~/.npm` 本身不可触碰。

| 清单 | 匹配 | 用途 |
|---|---|---|
| 受保护路径 | 该路径**及其下的一切** | 个人数据、凭据、配置 |
| 精确保护 | **只匹配这个确切路径** | 软件包管理器的安装根目录 |
| 受保护文件名 | **任何位置上叫这个名字的文件** | shell 初始化和历史文件 |

## 系统根目录 {#system-roots}

作为路径本身或其下的任何子项都会被拒绝，另有说明的除外。

| 路径 | 子项也被拒绝 |
|---|---|
| `/` | ——（根目录本身） |
| `/home` | 否——只匹配这个确切路径 |
| `/root` | 否——只匹配这个确切路径 |
| `/etc` | **是** |
| `/boot` | **是** |
| `/usr` | **是** |
| `/var` | 否——只匹配这个确切路径 |
| `/lib` | 否——只匹配这个确切路径 |
| `/sbin` | 否——只匹配这个确切路径 |
| `/bin` | 否——只匹配这个确切路径 |
| `$HOME` | 否——主目录根本身，所以光秃秃的 `$HOME` 永远不会被清空 |

:::note `/proc` 和 `/sys` 不在这份清单上
没有任何清理目标会靠近它们，但白名单并没有明确列出它们。有些对这个工具的介绍声称列出了。并没有。
:::

## 个人目录 {#personal-directories}

连同其中的一切都会被拒绝。

| 路径 | 存放 |
|---|---|
| `~/Documents` | 文档 |
| `~/Pictures` | 图片 |
| `~/Music` | 音频 |
| `~/Videos` | 视频 |
| `~/Desktop` | 桌面内容 |
| `~/Public` | 共享文件 |
| `~/Templates` | 文档模板 |

:::caution `~/Downloads` 有意**不**受保护
它不能受保护——清理其中长期闲置的大文件正是一项功能（[长期未用的个人文件](../modes/personal-stale-files.md)）。保护它的是[关卡 3](../safety/guards.md#guard-3--personal-data-is-interactive-only)：只能交互式运行、逐个文件确认、忽略 `--yes`。

如果您在 `~/Downloads` 里放着无法替代的东西，请把它移到受保护的目录里。这才是长久之计。
:::

## 凭据、配置和代理状态 {#credentials-configuration-and-agent-state}

| 路径 | 存放 |
|---|---|
| `~/.ssh` | SSH 密钥和已知主机 |
| `~/.gnupg` | GPG 密钥环 |
| `~/.config` | 应用程序配置（范围很广） |
| `~/.gnome` | GNOME 设置 |
| `~/.mozilla` | Firefox 配置文件 |
| `~/.thunderbird` | Thunderbird 配置文件 |
| `~/.claude` | Claude Code 状态 |
| `~/.local/share/claude` | Claude Code 数据 |

:::danger 两个常被说成受保护的路径其实**不**受保护
**`~/.password-store`**（pass）和 **`~/.aws`**（AWS 凭据）在源码的受保护清单中**并不**存在。有些对这个工具的介绍说它们在。

实际上没有任何清理目标指向它们，所以正常使用时两者都没有风险——但不要依赖白名单来保护它们。如果您需要这个保证，请先在自己的安装上用 `--list-targets` 核实。
:::

注意，`~/.mozilla` 受保护并不妨碍清理 Firefox 缓存：缓存位于 `~/.cache/mozilla`，是另一棵目录树。

## 精确匹配的受保护路径 {#exact-match-protected-paths}

**精确**匹配——子项仍然可以清理。正是这一点保住了您全局安装的软件包，同时仍允许清理每个安装根目录里可再生的缓存。

| 生态 | 路径 |
|---|---|
| pnpm | `~/.local/share/pnpm` 及其 `global`, `bin`, `nodejs` |
| npm | `~/.npm`, `~/.npm-global`, `~/.npm-global/lib`, `~/.npm-global/lib/node_modules` |
| yarn | `~/.yarn`, `~/.config/yarn/global` |
| bun | `~/.bun`, `~/.bun/install`, `~/.bun/install/global` 及其 `node_modules`, `~/.bun/bin` |
| deno | `~/.deno`, `~/.deno/bin` |
| Node 版本管理器 | `~/.volta`, `~/.volta/bin`, `~/.nvm`, `~/.nvm/versions`, `~/.fnm` |
| Rust | `~/.cargo`, `~/.cargo/bin`, `~/.rustup` |
| Go | `~/go`, `~/go/bin` |

这份清单源于一个真实的缺陷：在 [1.1.0](../changelog.md#110--2026-05-10) 之前，pnpm 清理的目标是 `~/.local/share/pnpm`——安装根目录——结果连同 `pnpm` 二进制文件本身一起删掉了全局安装的包。修复把目标收窄到 `~/.local/share/pnpm/store`，并加入这份清单，让这个错误不会再犯。

[`--all-safe`](../modes/all-safe.md) 还会在启动时断言这些路径都不会出现在它的目标清单中，一旦出现就以 `BUG:` 信息中止。

## 受保护的文件名 {#protected-basenames}

**按文件名，在任何位置**拒绝，与通向它的路径无关：

`.bashrc` · `.bash_profile` · `.bash_login` · `.profile` · `.bash_logout` · `.zshrc` · `.zshenv` ·
`.zprofile` · `.zlogin` · `.zlogout` · `.bash_aliases` · `.bash_history` · `.zsh_history` · `.inputrc` ·
`.dircolors` · `.config` · `.local`

这是最后一道防线。它的存在，是为了让将来某个 bug 即使不知怎么把 shell 初始化文件放进了目标清单，也删不掉它。

## 拒绝时的样子 {#what-a-refusal-looks-like}

```text
✗ REFUSE: protected path: /home/you/Documents/notes
✗ REFUSE: unsafe path: '/home/you'
✗ REFUSE: shell-init / history file: /home/you/.bashrc
```

拒绝是正确的行为，不是需要绕过的错误。如果您想清理的缓存被拒绝，原因几乎总是有一个符号链接指向了受保护的地方——修好符号链接，而不是修改工具。见[故障排查](../troubleshooting.md#refuse-protected-path)。

## 接下来 {#next}

- [安全保护](../safety/guards.md) — 这份清单是如何应用的
- [它会删除什么](../safety/what-it-deletes.md) — 边界的另一侧
