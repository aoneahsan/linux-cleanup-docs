---
title: 全局包检查
description: 只读检查 npm、pnpm、yarn、bun 和 deno 全局安装的软件包，把每个标记为最近使用、被依赖或长期未用——并打印由您自己运行的卸载命令。
sidebar_position: 12
---

# 全局包检查

**`--globals` 会列出您在 npm、pnpm、yarn、bun 和 deno 中全局安装的软件包，并为每一个做标记。** 在 [1.1.0](../changelog.md#110--2026-05-10) 中新增。

```bash
linux-cleanup --globals
linux-cleanup --globals -d 180
```

:::note 这个模式从不删除任何东西
它打印可以直接复制粘贴的卸载命令，然后停下。运行什么由您决定。全局软件包被意外删除时最容易打断工作流程，所以工具拒绝替您删除它们。
:::

## 判定结果 {#the-verdicts}

| 判定 | 含义 |
|---|---|
| **recently used** | 在 `--days` 天内被修改或访问过。保留它 |
| **needed by: `<pkg>`** | 另一个全局包把它声明为依赖。删除它会弄坏那一个 |
| **STALE — safe to uninstall** | 闲置超过阈值，且没有其他包依赖它 |

“可以安全卸载”是从您机器上其他全局包的角度来说的。它无法知道有哪个 shell 脚本、CI 任务或您的哪个习惯会调用这个可执行文件。行动之前请阅读这份列表。

## 为什么全局包在这里很重要 {#why-global-packages-matter-here}

任何清理模式都**绝不**删除全局安装的软件包。`~/.local/share/pnpm`、`~/.npm`、`~/.yarn`、`~/.bun/install/global` 和 `~/.deno/bin` 都在[精确匹配的受保护列表](../reference/protected-paths.md#exact-match-protected-paths)上，就是为了保护它们——这来自一个真实的 bug：pnpm 清理曾针对安装根目录，抹掉了全局软件包。见 [1.1.0](../changelog.md#110--2026-05-10)。

这项检查是有意为之的对应措施：给您可见性，而不做自动化。

## 包管理器不在 PATH 中也能用 {#works-without-the-package-managers-on-path}

可用时，通过各包管理器的命令行查询；不可用时，通过检查文件系统。所以在装了 `pnpm` 但它当前不在 `PATH` 中的机器上，这项检查仍然有效——而这往往正是您要诊断的情况。

如果某个运行时在磁盘上，却没有接入您的 shell，[`--doctor`](./doctor.md) 就是修复它的模式。

## 适合运行的时机 {#good-moments-to-run-it}

- 重装 Node 或切换版本管理器之前
- 迁移到新机器之前——它是一份可以带走的工具清单
- 当 `npm ls -g` 的输出已经认不出来时
- 每年一两次，作为日常维护

## 接下来 {#next}

- [诊断](./doctor.md)——修复已安装但不在 `PATH` 中的运行时
- [受保护路径](../reference/protected-paths.md)——为什么全局包永远不会被触碰
