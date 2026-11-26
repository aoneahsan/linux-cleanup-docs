---
title: 退出码
description: linux-cleanup 每个退出码的含义、哪些会自动触发崩溃包，以及如何在脚本或 cron 任务中据此分支。
tags: [exit-codes, scripting, cron, crash-bundle, reference]
sidebar_position: 6
---

# 退出码

**linux-cleanup 遵循 Unix 惯例：`0` 表示成功，其他任何值都表示有问题。** 有些非零退出码是预期内的，被有意不当作崩溃处理。

## 退出码列表 {#codes}

| 代码 | 含义 | 崩溃包 |
|---|---|---|
| `0` | 运行正常。每个请求的操作都已完成或被拒绝 | 否 |
| `1` | 一般性失败——违反了某个不变条件。很少见 | 是 |
| `2` | 参数解析错误。会打印帮助 | 否 |
| `3` | 公开的版本记录要求更新 | 否 |
| `127` | 找不到命令——缺少必需的依赖 | 是 |
| `130` | 被 `Ctrl-C`（SIGINT）中止 | 否 |
| `137` | 被 SIGKILL 杀死——通常是 OOM killer 或 `kill -9` | 是 |
| `139` | 段错误。在纯 bash 中不应发生 | 是 |
| `143` | 被 SIGTERM 终止 | 否 |
| 其他任何非零值 | 意外的内部失败 | 是 |

未知参数会在清理之前以 `2` 退出。支持 `--dry-run`；它会走完所选模式而不删除文件。见[删除前先预览](../safety/preview-first.md)。

## 崩溃陷阱如何判断 {#how-the-crash-trap-decides}

[1.3.0](../changelog.md#130--2026-05-10) 中加入的 EXIT 陷阱按以下顺序判断：

1. 退出码为 `0`，**或**脚本设置了内部的完成标记 → 不生成崩溃包
2. 退出码为 `130`（`Ctrl-C`）或 `143`（SIGTERM）→ 不生成。用户主动停止不算崩溃
3. 退出码为 `2`（参数解析）→ 不生成。脚本打印了帮助并有意停止
4. 其他情况 → 把 `crash-<timestamp>.tar.gz` 写入 `~/.linux-cleanup/feedback/`

崩溃包包含当前的会话日志、最近的 JSON 记录和一份简短的系统清单。它留在您的机器上——**不会发送任何东西**。工具会打印路径，方便您检查并决定是否通过邮件发送。

见[提交 bug 报告](../guides/send-a-bug-report.md)。

## 根据退出码分支 {#branching-on-the-code}

```bash
if linux-cleanup --scan; then
  echo "扫描成功"
else
  case $? in
    2)   echo "参数错误" ;;
    127) echo "缺少依赖——运行 --self-test" ;;
    130) echo "用户中止" ;;
    *)   echo "意外失败——查看 ~/.linux-cleanup/feedback/" ;;
  esac
fi
```

## 在 cron 中 {#in-cron}

```bash
linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1 || \
  echo "linux-cleanup exited $?" | mail -s "cleanup failed on $(hostname)" you@example.com
```

cron 任务返回的退出码 `127` 几乎总是表示 crontab 用的是不带路径的命令名，而 cron 极简的 `PATH` 找不到它。请使用绝对路径——见[故障排查](../troubleshooting.md#cron-entry-runs-but-does-nothing)。

## 从崩溃包诊断意外的退出码 {#diagnosing-an-unexpected-code-from-a-crash-bundle}

崩溃包的清单记录了退出码。常见的有：

| 代码 | 常见原因 |
|---|---|
| `137` | 内存不足（OOM）killer。通常是在一个巨大的目录树上运行 `find` |
| `141` | SIGPIPE——管道提前关闭，常见于 `tee` 或分页器退出 |
| `139` | 段错误——这里绝不应该出现；请报告 |
| `127` | 缺少依赖。运行 `--self-test` 找出是哪一个 |

## 接下来 {#next}

- [提交 bug 报告](../guides/send-a-bug-report.md)
- [故障排查](../troubleshooting.md)
