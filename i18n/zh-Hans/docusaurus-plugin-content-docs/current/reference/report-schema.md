---
title: 报告结构
description: linux-cleanup 引导流程写入的 JSON 结构，包含 credits、meta、disk、memory、steps 和 totals。
tags: [json, schema, reports, parsing, jq, reference]
sidebar_position: 7
---

# 报告结构

**引导流程会写入一个带有 `"schema_version": 1` 的 JSON 记录**，除非设置了 `--no-report` 或 `--dry-run`。单独的 `--scan` 不会写这个报告。需要机器可读的扫描结果时，请使用 `--scan --json-events`；那个事件流的结构不同。

:::warning 较早的文档描述的是另一种结构
有些资料——包括源码仓库里的一个参考页——描述的是一种以 `schema`（类似 `linux-cleanup/report/v1` 的字符串）为中心、带有 `tool`、`session` 和 `categories` 对象的结构。

**工具并不输出那种结构。** 按它编写的解析器在每个真实文件上都会失败。下面的结构才是 `modules/walkthrough.sh` 实际写入的。请在您自己的机器上确认：

```bash
jq 'keys' "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```
:::

## 顶层 {#top-level}

```json
{
  "schema_version": 1,
  "credits": { },
  "meta":    { },
  "disk":    { "before": {}, "after": {} },
  "memory":  { "before": {}, "after": {} },
  "steps":   [ ],
  "totals":  { }
}
```

| 键 | 类型 | 内容 |
|---|---|---|
| `schema_version` | 数字 | 目前为 `1`。不认识的值一律拒绝 |
| `credits` | 对象 | 工具身份、许可证和作者 |
| `meta` | 对象 | 会话上下文——何时、何地、如何运行、用了什么设置 |
| `disk` | 对象 | 清理前后的文件系统用量 |
| `memory` | 对象 | 清理前后的内存用量 |
| `steps` | 数组 | 每个尝试过的步骤一项 |
| `totals` | 对象 | 会话汇总 |

## `credits` {#credits}

```json
{
  "tool": "linux-cleanup",
  "tool_version": "2.1.1",
  "tool_homepage": "https://linux-cleanup.aoneahsan.com",
  "tool_license": "MIT",
  "author": {
    "name": "Ahsan Mahmood",
    "email": "aoneahsan@gmail.com",
    "website": "https://aoneahsan.com",
    "linkedin": "https://linkedin.com/in/aoneahsan"
  }
}
```

放在这里，是为了让记录无论到哪里都能自带出处。这里没有任何内容反映您的机器。

## `meta` {#meta}

| 键 | 类型 | 内容 |
|---|---|---|
| `tool` | 字符串 | 始终为 `linux-cleanup` |
| `tool_version` | 字符串 | 写入该记录的版本。使用方的逻辑应以它为准 |
| `started_at` | 字符串 | 会话开始的时间戳 |
| `finished_at` | 字符串 | 会话结束的时间戳 |
| `duration_seconds` | 数字 | 实际耗时 |
| `host` | 字符串 | `hostname` 的输出 |
| `user` | 字符串 | `$USER` |
| `mode` | 字符串 | 运行的模式——`walkthrough`、`scan`、`allsafe`、`system` 等 |
| `stale_days` | 数字 | 生效的 `--days` 阈值 |
| `log_file` | 字符串 | 本次会话日志的绝对路径 |
| `launcher` | 字符串 | 调用方式——直接运行时为 `bash` |
| `via_npx` | 数字 | 通过 npm 启动器运行时为 `1`，否则为 `0` |

`stale_days` 值得记录：它区分了按 100 天清理的运行和用 `-d 30` 的运行，也解释了同一台机器上两次会话为什么回收的空间不同。

## `disk` 和 `memory` {#disk-and-memory}

两者都包含 `before` 和 `after` 两份快照，分别在会话开始和结束时采集。

`disk` 包含来自 `df` 的文件系统字段——文件系统、大小、已用、可用和使用百分比。`memory` 包含系统内存报告中对应的数据。

:::note `after` 减去 `before` 并不完全是清理的结果
这些是整台机器的测量值。会话期间运行的构建、软件包更新或浏览器也会改变它们，所以报告的回收量可能低于各步骤之和，甚至为负。见[故障排查](../troubleshooting.md#disk-usage-grew-during-the-session)。
:::

## `steps` {#steps}

一个数组，每个尝试过的步骤一项，按顺序排列：

```json
{ "n": 1, "title": "Package-manager caches", "status": "ran", "freed_bytes": 13315108864 }
```

| 键 | 类型 | 内容 |
|---|---|---|
| `n` | 数字 | 从 1 开始的步骤编号 |
| `title` | 字符串 | 人类可读的步骤名称 |
| `status` | 字符串 | `ran`、`skipped`、`skipped (quit)` 或 `skipped (jq missing)` |
| `freed_bytes` | 数字 | 这一步回收的字节数。跳过时为 `0` |

`skipped (quit)` 标记您按下 `q` 之后的步骤——可以用来区分有意停止和逐个拒绝的步骤。

## `totals` {#totals}

| 键 | 类型 | 内容 |
|---|---|---|
| `total_reclaimed_bytes` | 数字 | 各步骤之和 |
| `total_reclaimed_human` | 字符串 | 同一个数，格式化后的形式 |
| `steps_run` | 数字 | 状态为 `ran` 的步骤数 |
| `steps_skipped` | 数字 | 状态为 `skipped` 类的步骤数 |

## 解析 {#parsing}

```bash
LATEST="$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

jq '.totals.total_reclaimed_human' "$LATEST"
jq '.meta | {mode, stale_days, duration_seconds}' "$LATEST"
jq '.steps[] | select(.status == "ran") | "\(.title): \(.freed_bytes)"' "$LATEST"

# 所有已记录会话的回收总量
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## 校验 {#validating}

工具没有附带 JSON Schema 文件。可以做一个结构检查：

```bash
jq -e 'has("schema_version") and .schema_version == 1
       and has("meta") and has("steps") and has("totals")' \
  ~/.linux-cleanup/reports/report-*.json
```

每个有效文件打印一个 `true`。

## 兼容性建议 {#compatibility-guidance}

编写使用方时：

- **根据 `schema_version` 分支。** 遇到不认识的值，按无法解析处理，不要猜
- **把未知的键视为新增。** 第 1 版中已经新增过字段，以后也可能再加
- **用 `meta.tool_version`** 处理不同版本之间行为不同的地方
- **不要假定每个模式都会填满每个部分。** 只读模式产生的步骤更少
- **`total_reclaimed_bytes` 偶尔为负是正常的。** 它是 `df` 的差值，不是删除量之和

## 接下来 {#next}

- [报告](../modes/reports.md) — 查看和导出
- [输出路径](./output-paths.md) — 文件存放的位置
