---
title: 报告
description: 引导流程可以写一份 JSON 会话记录。可以列出、查看、转换为 Markdown 或 HTML，并导出这些记录。
tags: [reports, json, export, markdown, html, jq, modes]
sidebar_position: 15
---

# 报告

**引导流程会写一份 JSON 会话记录**到 `~/.linux-cleanup/reports/report-<timestamp>.json`，除非设置了 `--no-report` 或 `--dry-run`。其他模式不会创建这份记录。已有的记录不会被自动删除。

Markdown 和 HTML 是按需生成的可选转换。

```bash
linux-cleanup --reports              # 交互式管理器
linux-cleanup --export both latest   # 非交互式转换
```

## 会话记录包含什么 {#what-a-session-record-contains}

| 部分 | 内容 |
|---|---|
| `schema_version` | 当前为 `1` |
| `credits` | 工具名、版本、主页、许可证、作者信息 |
| `meta` | 时间戳、耗时、主机、用户、模式、闲置阈值、日志路径、启动器 |
| `disk` | 运行前后的文件系统用量 |
| `memory` | 运行前后的内存用量 |
| `steps` | 每个步骤一项：编号、标题、状态、释放的字节 |
| `totals` | 回收的总字节数、易读的总量、运行和跳过的步骤数 |

逐字段的完整参考：[报告结构](../reference/report-schema.md)。

## 交互式管理器 {#the-interactive-manager}

```bash
linux-cleanup --reports
```

列出过去的会话，可以查看某一个、把它转换成 Markdown 或 HTML、在浏览器中打开 HTML，或删除它。

未安装 `jq` 时，转换选项会被隐藏——见[下文](#jq-is-required-for-conversion)。

## 导出 {#exporting}

非交互式，适合脚本和日常习惯：

```bash
linux-cleanup --export both latest   # 从最新记录生成 Markdown + HTML
linux-cleanup --export html all      # 把所有记录转成 HTML
linux-cleanup --export md 3          # 把第 3 条记录转成 Markdown
```

| 参数 | 可接受的值 |
|---|---|
| 格式 | `md`, `html`, `both` |
| 标识 | 记录编号、`latest` 或 `all` |

输出放在 JSON 旁边，文件名带有相同的时间戳。HTML 是自包含的——内嵌 CSS、支持深色模式、不引用外部资源——所以可以作为单个文件通过邮件发送或归档。

## 转换需要 `jq` {#jq-is-required-for-conversion}

:::note JSON 总会写入；转换才是可选的部分
没有 `jq`，引导流程仍能生成 JSON 记录。只是无法导出 Markdown 和 HTML，引导流程的第 10 步会把自己记录为 `skipped (jq missing)`。

```bash
sudo apt install jq      # Debian / Ubuntu
sudo dnf install jq      # Fedora / RHEL
sudo pacman -S jq        # Arch
```
:::

生成的 HTML 会通过 `jq` 的 `@html` 过滤器转义每一个来自 JSON 的值，所以格式错误的输入无法向渲染出的页面注入标记。

## 直接查询 JSON {#querying-the-json-directly}

JSON 本来就是给工具读的：

```bash
# 最近一次会话回收的总量
jq '.totals.total_reclaimed_human' ~/.linux-cleanup/reports/report-*.json | tail -1

# 最近一次会话中实际运行的每个步骤
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

# 所有已记录会话的回收总量
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## 保留 {#retention}

这些记录**永远不会**被自动删除——连 `--cleanup-logs` 也不会，它只删除本次运行的日志文件。

要自己清理旧记录：

```bash
find ~/.linux-cleanup/reports/ -name 'report-*' -mtime +90 -delete
```

用 `--no-report` 可以让单次运行完全不生成报告；日志仍会写入。

## 这些是记录，不是备份 {#these-are-records-not-backups}

:::danger 会话记录是步骤摘要，不是备份
它记录的是步骤和磁盘观察结果，而不是每个被删除文件的完整列表。它不包含任何被删除的内容，其中也没有任何东西能恢复什么。误删之后，它的价值在于帮您判断要从自己的备份中恢复什么，或者重新下载什么。见[恢复](../recovery.md)。
:::

## 接下来 {#next}

- [报告结构](../reference/report-schema.md)——每个字段
- [输出路径](../reference/output-paths.md)——文件放在哪里
- [恢复](../recovery.md)——意外发生后如何使用会话记录
