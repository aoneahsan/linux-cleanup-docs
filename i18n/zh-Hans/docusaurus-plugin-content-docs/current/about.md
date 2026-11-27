---
title: 关于
description: 谁开发了 linux-cleanup、它背后的设计原则、它的许可证，以及如何联系或参与贡献。
sidebar_position: 95
---

# 关于

**linux-cleanup 由 [Ahsan Mahmood](https://aoneahsan.com) 开发和维护**，他是一名独立软件工程师，从事开发者工具和应用开发。

| | |
|---|---|
| **作者** | Ahsan Mahmood |
| **邮箱** | [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |
| **网站** | [aoneahsan.com](https://aoneahsan.com) |
| **LinkedIn** | [linkedin.com/in/aoneahsan](https://linkedin.com/in/aoneahsan) |
| **GitHub** | [github.com/aoneahsan](https://github.com/aoneahsan) |
| **npm** | [npmjs.com/~aoneahsan](https://www.npmjs.com/~aoneahsan) |

## 为什么会有它 {#why-it-exists}

开发者的电脑会积累大量可再生的垃圾——动辄几十 GB 的软件包管理器缓存、浏览器缓存、构建工具缓存、模拟器镜像，以及两年前就放弃的项目里的 `node_modules`。

已有的清理工具大多是两种样子之一：要么根本不认识现代开发者缓存，要么是一键清空的工具，把看起来像垃圾的东西都删掉，然后祈祷没出事。

linux-cleanup 的立场正好相反：**可脚本化、透明、有白名单保护、默认交互式。** 在它碰任何东西之前，您都能确切看到它会碰什么。

## 设计原则 {#design-principles}

**出错时选择拒绝。** 用[白名单，而不是黑名单](./safety/guards.md#guard-1--the-path-allowlist)。工具不认识的路径一律拒绝。用黑名单的话，清理缓存和清空主目录之间只隔着一个拼写错误。

**区分缓存和工具。** `~/.cache/yarn` 几秒钟就能重新生成；而 Gradle wrapper 发行包是一个 230 MB 的下载，下个月可能还要用。[闲置关卡](./safety/guards.md#guard-2--the-staleness-gate)之所以存在，是因为把两者同等对待是错的，1.2.0 改正了这一点。

**个人数据由用户来判断。** 磁盘上没有任何东西能区分一个再也不会打开的安装包和一份文档的唯一副本。工具拒绝去猜，这就是这些模式[忽略 `--yes`](./safety/guards.md#guard-3--personal-data-is-interactive-only) 的原因。

**预防胜于恢复。** [没有撤销](./safety/irreversibility.md)，这是有意的选择——撤销日志会在您正要腾出空间的磁盘上放大写入，还会让人变得粗心。

**可审计胜于方便。** 用 Bash，因为它本来就装着，而且可以读懂。编译好的二进制文件用起来更顺手，但难以信任得多。

**版本检查范围很窄。** 启动时，如果在线，命令行会读取一份公开的版本记录。它不会上传清理路径、报告或崩溃包；是否发送报告始终由您决定。

## 来自纠正的改进 {#corrections-shape-the-tool}

有两项安全功能，是因为有人指出了真实的问题才有的。

[受保护的安装根目录列表](./reference/protected-paths.md#exact-match-protected-paths)来自一个真实的缺陷：pnpm 清理的目标是 `~/.local/share/pnpm`——也就是安装根目录——结果删掉了全局安装的包。[1.1.0](./changelog.md#110--2026-05-10) 修复了它，并加了一个断言，保证不会再发生。

[闲置关卡](./safety/guards.md#guard-2--the-staleness-gate)来自一位用户的观察：1.2.0 仍会把 Android AVD 整个清掉，而同样的道理应该适用于所有属于工具而非缓存的东西。这就成了 [1.2.1](./changelog.md#121--2026-05-10)。

如果您发现有什么不对，[请告诉我们](./guides/send-a-bug-report.md)。

## 许可证 {#licence}

自 [1.4.0](./changelog.md#140--2026-07-11) 起采用 **[MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)**。

个人或商业使用、修改、分叉、嵌入、再分发都可以。唯一的条件是在副本或主要部分中保留版权声明和 MIT 许可声明。

:::danger 按“原样”提供，不作任何担保
这是一个会删除文件的工具。作者对因使用它而产生的任何索赔或损失（包括数据丢失）不承担责任。请备份您的数据，并在确认之前检查每一个操作。

以[完整的许可证文本](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)为准。
:::

1.4.0 之前发布的版本保留其发布时的许可证。

## 参与贡献 {#contributing}

欢迎在 MIT 许可下贡献。

- **分叉并发起 pull request**——不需要特殊权限
- **报告 bug 或提出功能请求**，可以通过 [GitHub issues](https://github.com/aoneahsan/linux-cleanup/issues) 或邮件
- **`main` 分支受保护**——改动通过经过审查的 PR 合并

编码标准是安全第一、仅离线运行、通过 ShellCheck。见 [CONTRIBUTING.md](https://github.com/aoneahsan/linux-cleanup/blob/main/CONTRIBUTING.md)。

只有描述的功能请求和代码一样受欢迎。请说明您希望清理什么，以及现有模式为什么覆盖不到。

## 关于这份文档 {#this-documentation}

使用 [Docusaurus](https://docusaurus.io/) 构建，部署在 GitHub Pages 上。源码：[github.com/aoneahsan/linux-cleanup-docs](https://github.com/aoneahsan/linux-cleanup-docs)——也欢迎在那里提出更正。

给 AI 助手的机器可读摘要：[`/llms.txt`](https://linux-cleanup-docs.aoneahsan.com/llms.txt)。

## 相关链接 {#related-links}

| | |
|---|---|
| **源码** | [github.com/aoneahsan/linux-cleanup](https://github.com/aoneahsan/linux-cleanup) |
| **npm** | [npmjs.com/package/linux-cleanup](https://www.npmjs.com/package/linux-cleanup) |
| **问题** | [github.com/aoneahsan/linux-cleanup/issues](https://github.com/aoneahsan/linux-cleanup/issues) |
| **支持这项工作** | [aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=linux-cleanup&project-identifier=linux-cleanup) |
