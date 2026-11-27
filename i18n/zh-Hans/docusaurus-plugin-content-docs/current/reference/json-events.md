---
title: 机器可读的事件
description: 用于本地扫描和非交互式全安全运行的第 1 版 NDJSON 事件。
sidebar_position: 8
---

# 机器可读的事件

`--json-events` 把以换行分隔的 JSON 写到 stdout。人类可读的文本和提示写到 stderr，并在会话日志中保留一份本地副本。事件流留在这台机器上；它可能包含完整的本地路径。使用方不应把这些路径作为账户或分析数据的一部分上传。

该参数支持 `--scan` 和 `--all-safe --yes`。全安全运行需要 `--yes`，这样机器客户端就不会停在某个提示上。加上 `--dry-run` 可以预览全安全操作而不删除文件，但仍可能写入本地日志和更新检查状态。其他模式会返回退出码 2。

```bash
linux-cleanup --scan --json-events > scan.ndjson
linux-cleanup --all-safe --yes --dry-run --json-events > preview.ndjson
```

每个完整的事件都有 `v: 1`、一个 `type` 和 `ts`（Unix 毫秒）。使用方应拒绝更高的 `v`，并在第 1 版中忽略不认识的字段。模式 ID 是字符串：`scan` 或 `allsafe`。

| 事件 | 字段 | 含义 |
|---|---|---|
| `plan` | `version`, `dry_run`, `profile`, `sections[]` | 第一个事件；所选模式对应一个 section。section 包含 `id`、`title`、`stamp`、`sudo`、`deep`。 |
| `disk` | `phase`, `total_kb`, `free_kb`, `purgeable_kb`, `snapshots`, `snapshot_note` | 模式运行前后的磁盘采样。不支持的估算值为 `null`。 |
| `section_start` | `id`, `title`, `stamp` | 所选模式已开始。 |
| `item` | `id`, `path`, `kb`, `action`, `unique`, `age_days`, `reason` | 只读扫描的结果，或清理辅助程序选中的路径。`report` 只读；`delete` 在试运行中是拟执行的操作，在实际运行中是已完成的辅助操作；`skip` 表示拒绝。`kb` 截断为整数 KiB。 |
| `progress` | `id`, `done`, `total` | 唯一选中的模式处于 0/1 或 1/1。它是模式的边界，而不是逐文件的百分比。 |
| `error` | `id`, `message` | 命令行报告的失败或拒绝。 |
| `section_result` | `id`, `status`, `freed_kb`, `items`, `reason` | 状态为 `completed` 或 `failed`。在命令行能把自己的写入与其他磁盘活动区分开之前，字节和项目总数保持为 `null`。 |
| `summary` | `attempted`, `completed`, `skipped`, `failed`, `freed_kb`, `disk_free_before_kb`, `disk_free_after_kb`, `elapsed_s`, `reports`, `log`, `dry_run` | 模式完成后的最后一个事件。两个可用空间采样只是观察值，并不表示这个进程回收了多少字节。 |

完整的运行以 `plan` 开始、以 `summary` 结束。被中断的进程或未满足的更新要求可能不会留下 summary；请把它视为不完整的运行，并参考退出码和 stderr。被拒绝的参数可能在 plan 之前发出一个 `error` 事件并以 2 退出。不带该参数时，现有的文本输出和退出码保持不变。

事件流是对本地 JSON 会话报告的补充。试运行不会写会话报告。使用方可以用 `item.path` 来说明一个本地决定，然后把它丢弃，而不是同步到服务器。当 `--cleanup-logs` 删除会话日志时，`summary.log` 为 `null`。
