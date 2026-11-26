---
title: 提交 bug 报告
description: 如何报告 linux-cleanup 的 bug——生成调试包、崩溃包包含什么、发送前要检查什么，以及发送到哪里。
tags: [guide, bug-report, feedback, debug-bundle, crash, privacy]
sidebar_position: 3
---

# 提交 bug 报告

**两条命令就能产出维护者需要的一切。** 不会自动发送任何东西——由您检查包的内容并亲自发送。

```bash
linux-cleanup --debug-bundle    # 打包最新的日志和会话记录
linux-cleanup --feedback        # 说明，以及可选的 mailto 草稿
```

## 快捷方式 {#the-quick-path}

```bash
linux-cleanup --debug-bundle
```

写入 `~/.linux-cleanup/feedback/debug-bundle-<timestamp>.tar.gz`，其中包含：

- 最新的会话日志
- 最新的 JSON 会话记录（如果有）
- 一个 `MANIFEST.txt`，内含发行版、内核、bash 版本和自检输出

然后：

```bash
linux-cleanup --feedback
```

它会说明需要包含哪些内容，并提供打开一份已预填系统信息的 `mailto:` 草稿。

## 发送前先检查包的内容 {#review-the-bundle-before-sending-it}

:::caution 包中含有您机器上的路径
不含文件内容——但日志会列出每一条被触及的路径，也就是目录名、项目名，有时还有 `~/Downloads` 中的文件名。

先检查一下：

```bash
tar -tzf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz     # 列出内容
tar -xzOf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz    # 完整阅读
```

如果其中有敏感内容，请解压这个包，删除或涂掉那个文件，再重新打包——或者只发送清单和真正相关的那几行。
:::

## 崩溃包 {#crash-bundles}

自 [1.3.0](../changelog.md#130--2026-05-10) 起，意外的非零退出会自动在同一目录写入 `crash-<timestamp>.tar.gz`，并打印其路径。

它包含当前的日志、最近的记录，以及一份含退出码的系统清单。

**这个包不会被上传。** 版本检查读取的是一个公开的文本文件，但不会发送任何包或本地路径。这个包会一直留在您的磁盘上，直到您决定是否分享它。

正常的退出**不会**写入崩溃包：`0`、`130`（`Ctrl-C`）、`143`（SIGTERM）和 `2`（参数错误）都被排除在外。见[退出码](../reference/exit-codes.md#how-the-crash-trap-decides)。

## 需要包含什么 {#what-to-include}

好的报告简短而具体：

| 包含 | 示例 |
|---|---|
| 发行版和版本 | `lsb_release -d` |
| Bash 版本 | `bash --version \| head -1` |
| 工具版本 | `linux-cleanup --version` |
| 确切的命令 | `linux-cleanup --all-safe -y -d 30` |
| 期望结果与实际结果 | “本应保留 Gradle wrapper，它却被删除了” |
| 调试包 | 附上 tar.gz |

最有价值的一行是**期望结果与实际结果**。单看日志只能知道发生了什么，却看不出您为什么认为它不对。

## 发送到哪里 {#where-to-send-it}

| 渠道 | 适用于 |
|---|---|
| [GitHub issues](https://github.com/aoneahsan/linux-cleanup/issues) | bug、功能需求——首选，公开 |
| [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) | 任何您不想公开发布的内容 |
| pull request | 您已经有修复。MIT 许可，欢迎分叉 |

只有描述的功能需求与代码同样受欢迎。说明您希望清理什么，以及现有模式为什么覆盖不到它。

## 应该立即报告的 bug {#bugs-worth-reporting-immediately}

任何与文档所述安全模型相矛盾的情况：

- 在[受保护路径](../reference/protected-paths.md)内部发生了删除
- 删除了*当前*的编辑器扩展版本，而不只是被取代的版本
- 没有使用 `--purge-all`，却删除了比 `--days` 更新的文件
- 个人数据模式在没有确认的情况下执行了操作
- 有网络请求发送了本地清理路径或报告

这些都是违反安全模型的问题，而不只是不方便。

## 隐私：什么会离开您的机器 {#privacy-what-leaves-your-machine}

:::note 版本检查与本地报告
启动时，linux-cleanup 在联网时会通过 HTTPS 读取一份公开的版本记录。它不会上传扫描结果、日志或崩溃包。安装或更新副本时会用到 npm 或 GitHub。

在克隆版上验证：

```bash
grep -rE 'curl|wget|http://|https://' cleanup.sh lib/ modules/ bin/
```

阅读 `modules/update_check.sh`，了解版本请求以及为较新副本提供的命令。
:::

日志、记录和包都是本地文件。维护者看不到它们，也无法把修复推送到您的机器上——新版本只有在您重新运行 `npx` 或升级时才会到达。

## 接下来 {#next}

- [故障排查](../troubleshooting.md)——先看这里
- [恢复](../recovery.md)——如果数据丢失了
- [退出码](../reference/exit-codes.md)
