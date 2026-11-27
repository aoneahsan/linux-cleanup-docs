---
title: 输出路径
description: linux-cleanup 把日志、JSON 会话记录、调试包和崩溃包写在哪里——目录结构、各安装方式的默认位置、保留期限和权限。
sidebar_position: 5
---

# 输出路径

**所有输出都放在同一个数据根目录下。** 具体是哪个目录取决于您的安装方式，两者都可以覆盖。

## 目录结构 {#layout}

```text
$DATA_HOME/
├── logs/
│   ├── cleanup-<YYYY-MM-DD_HHMMSS>.log     # 每个会话一个
│   └── cron.log                             # 由每周的 cron 追加
├── reports/
│   ├── report-<YYYY-MM-DD_HHMMSS>.json     # 引导流程的记录，除非已关闭
│   ├── report-<YYYY-MM-DD_HHMMSS>.md       # 由 --export md 创建
│   └── report-<YYYY-MM-DD_HHMMSS>.html     # 由 --export html 创建
└── feedback/
    ├── debug-bundle-<YYYY-MM-DD_HHMMSS>.tar.gz   # 由 --debug-bundle 创建
    └── crash-<YYYY-MM-DD_HHMMSS>.tar.gz          # 崩溃时自动创建
```

## 各安装方式的默认位置 {#per-install-defaults}

| 安装方式 | `$DATA_HOME` |
|---|---|
| `npx linux-cleanup` | `~/.linux-cleanup/` |
| `npm install -g linux-cleanup` | `~/.linux-cleanup/` |
| `git clone` | 克隆目录本身 |

这种差异是有意的。`npx` 从一个会被清除的临时 npm 缓存目录运行软件包，把输出写在那里就会丢失；`~/.linux-cleanup/` 在多次运行之间保留。克隆本来就是一个永久位置，所以输出就放在源码旁边。

可以用 [`LINUX_CLEANUP_DATA_HOME`](./environment-variables.md) 覆盖这两者，也可以单独覆盖日志和记录目录。

## 保留期限 {#retention}

| 路径 | 自动清理 | 说明 |
|---|---|---|
| `logs/cleanup-*.log` | 仅在使用 `--cleanup-logs` 时 | 该参数会在结束时删除**本次运行**的日志，以前的日志保留 |
| `logs/cron.log` | 从不 | 从不轮转。变大时请自己轮转 |
| `reports/*.json` | **从不** | 长期保存的审计记录 |
| `reports/*.md`, `*.html` | **从不** | 按需创建，按需删除 |
| `feedback/*.tar.gz` | **从不** | 由您决定何时不再需要 |

`--cleanup-logs` 是工具对自身输出唯一的自动删除，而且只会碰 `.log` 文件。

## 大小与保留 {#size-and-retention}

日志和包的大小取决于一次运行涉及的路径和事件。删除旧记录前，先看看积累了什么。要有意地精简较旧的文件：

```bash
find ~/.linux-cleanup/logs/    -name 'cleanup-*.log' -mtime +90 -delete
find ~/.linux-cleanup/reports/ -name 'report-*'      -mtime +90 -delete
```

轮转 cron 日志：

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## 权限 {#permissions}

文件归调用它的用户所有。请在您的机器上用 `stat` 查看实际权限；工具配置的目录权限和进程的 umask 都有影响。不要在没读过的情况下分享日志或包。

## 这些文件包含什么 {#what-these-files-contain}

:::caution 日志和包中含有您的路径
会话日志会写出每一个触及的路径，也就是说它包含您机器上的目录名——项目名，有时还有 `~/Downloads` 中的文件名。

这些只在本地，从不发送，但在通过邮件发送包之前请先检查：

```bash
tar -tzf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz
```

见[提交 bug 报告](../guides/send-a-bug-report.md)。
:::

这里没有任何东西包含文件**内容**——只有路径、大小和时间戳。它们记录发生了什么，而不是被删除内容的副本。见[恢复](../recovery.md)。

## 接下来 {#next}

- [环境变量](./environment-variables.md) — 覆盖这些位置
- [报告结构](./report-schema.md) — JSON 结构
