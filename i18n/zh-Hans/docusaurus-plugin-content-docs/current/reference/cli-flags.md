---
title: 命令行参数
description: linux-cleanup 的每个命令行参数——模式、选项、别名和默认值——以及每个参数的作用和完整说明所在的页面。
sidebar_position: 1
---

# 命令行参数

**linux-cleanup 接受的每个参数。** 模式互斥——只传一个。选项可以和任何模式组合。

```bash
linux-cleanup --help    # 同样的列表，并填入您机器上的真实路径
```

无法识别的参数会打印帮助文本，并以代码 `2` 退出。

## 模式 {#modes}

最多传一个。不传时进入[引导流程](../modes/walkthrough.md)。

| 参数 | 别名 | 作用 | 完整页面 |
|---|---|---|---|
| _（无）_ | `-w` `--walkthrough` | 十个引导步骤，每步之前都会询问 | [引导流程](../modes/walkthrough.md) |
| `-m` | `--menu` `-i` `--interactive` | 带编号、可直接跳转的菜单 | [菜单](../modes/menu.md) |
| `-t` | `--tui` `-g` `--gui` | 可视化的 whiptail / dialog 菜单 | [TUI](../modes/tui.md) |
| `-a` | `--all-safe` | 批量清理所有可再生的缓存 | [全安全](../modes/all-safe.md) |
| `-s` | `--scan` | 只读地检查每个类别 | [扫描](../modes/scan.md) |
| `-p` | `--stale` | 长期未用的大型个人文件（交互式） | [长期未用的个人文件](../modes/personal-stale-files.md) |
| | `--system` | apt、日志、snap、`/tmp`、页面缓存（sudo） | [系统清理](../modes/system-cleanup.md) |
| | `--partials` | 遗留的未完成下载（交互式） | [未完成 / 无主的下载](../modes/partial-downloads.md) |
| | `--audit` | `$HOME` 中最大的 20 项 | [主目录检查](../modes/home-audit.md) |
| | `--node-modules` | 长期未用的 `node_modules`（交互式） | [长期未用的 node_modules 查找](../modes/node-modules-finder.md) |
| | `--globals` | 只读的全局包检查 | [全局包检查](../modes/globals-audit.md) |
| | `--doctor` | 修复运行时缺失的 shell 初始化 | [诊断](../modes/doctor.md) |
| | `--speed` | 检查资源压力和启动项；改动前会询问 | [速度诊断](../modes/speed.md) |
| | `--editor-ext` | 已被取代的 VS Code / Cursor 版本 | [编辑器扩展](../modes/editor-extensions.md) |
| | `--reports` | 交互式的会话记录管理器 | [报告](../modes/reports.md) |
| | `--export FMT ID` | 非交互式的记录转换 | [报告](../modes/reports.md#exporting) |
| | `--feedback` | bug 报告说明，可选的 mailto 草稿 | [提交 bug 报告](../guides/send-a-bug-report.md) |
| | `--debug-bundle` | 把最新的日志和记录打包成 tar.gz | [提交 bug 报告](../guides/send-a-bug-report.md) |
| | `--list-targets` | 打印所有可清理和受保护的路径 | [删除前先预览](../safety/preview-first.md) |
| | `--self-test` | 依赖、语法和安全保护检查 | [删除前先预览](../safety/preview-first.md) |
| `-V` | `--version` | 版本和作者 | — |
| | `--install-alias` | 添加 shell 别名 `cleanup` | [shell 别名与每周 cron](../guides/alias-and-cron.md) |
| | `--install-cron` | 每周的 `--all-safe -y`，周日 03:00 | [shell 别名与每周 cron](../guides/alias-and-cron.md) |
| | `--uninstall-alias` | 删除别名 | [卸载](../guides/uninstall.md) |
| | `--uninstall-cron` | 删除 cron 条目 | [卸载](../guides/uninstall.md) |
| | `--refresh-app` | 刷新别名和 cron 使用的持久副本 | [安装](../getting-started/installation.md) |

## 选项 {#options}

| 参数 | 默认值 | 作用 |
|---|---|---|
| `-d N` `--days N` | `100` | 闲置阈值。只有当 `atime` 和 `mtime` **都**超过它时，文件才符合条件。数值越小越激进 |
| `--purge-all` | 关闭 | **关闭闲置关卡。** 缓存目标会被整个清空——即 1.2.0 之前的行为 |
| `-y` `--yes` | 关闭 | 自动确认可再生的缓存。只在 `--all-safe` 下有效。**个人数据模式会忽略它** |
| `--no-report` | 关闭 | 不生成 JSON。仍会写日志 |
| `--cleanup-logs` | 关闭 | 在结束时删除本次运行的日志。**记录始终保留** |
| `-n` `--dry-run` | 关闭 | 走完所选模式，但不删除文件、不改设置。会留下本地日志；不写 JSON 会话报告 |
| `--json-events` | 关闭 | 为 `--scan` 或 `--all-safe --yes` 在 stdout 上输出[机器可读的事件](./json-events.md)；人类可读的文本写到 stderr |
| `--no-color` | 关闭 | 关闭 ANSI 颜色。也遵循 `NO_COLOR` |
| `-h` `--help` | — | 打印帮助并退出 |

:::danger `--purge-all` 会去掉一道安全保护
它会关闭[闲置关卡](../safety/guards.md#guard-2--the-staleness-gate)，所以无论缓存上次何时使用，都会被整个清空。代价高的资源——Gradle wrapper 发行包、Playwright 浏览器、Cypress 二进制文件——也会一起删掉。运行前的提示横幅会说明当前采用哪种策略。
:::

:::note 扫描和试运行回答的是不同的问题
[`--scan`](../modes/scan.md) 读取当前的路径和大小。`--dry-run` 会走完所选的清理流程，展示拟执行的操作而不删除。见[删除前先预览](../safety/preview-first.md)。
:::

## 常用组合 {#recipes}

| 目的 | 命令 |
|---|---|
| 验证安装 | `linux-cleanup --self-test` |
| 看看能回收多少 | `linux-cleanup --scan` |
| 预览所选的缓存清理 | `linux-cleanup --all-safe --dry-run` |
| 把只读扫描以 JSON 事件流输出 | `linux-cleanup --scan --json-events` |
| 查看它可能触及的每个路径 | `linux-cleanup --list-targets` |
| 引导式清理 | `linux-cleanup` |
| 一次性批量清理，不询问 | `linux-cleanup --all-safe -y` |
| 更激进的清理 | `linux-cleanup --all-safe -y -d 30` |
| 重装系统前最大限度回收 | `linux-cleanup --all-safe -y --purge-all` |
| 可视化菜单 | `linux-cleanup --tui` |
| 旧项目的依赖目录 | `linux-cleanup --node-modules -d 90` |
| 系统维护 | `linux-cleanup --system` |
| 每周自动运行 | `linux-cleanup --install-cron` |
| 把最新的记录转换成 HTML | `linux-cleanup --export html latest` |
| 提交 bug | `linux-cleanup --debug-bundle && linux-cleanup --feedback` |

## 环境变量 {#environment-variables}

最常用的几个，[完整列表](./environment-variables.md)另见：

| 变量 | 作用 |
|---|---|
| `NO_COLOR` | 任何非空值都会关闭颜色 |
| `LINUX_CLEANUP_LOG_DIR` | 覆盖日志目录 |
| `LINUX_CLEANUP_REPORTS_DIR` | 覆盖会话记录目录 |
| `LINUX_CLEANUP_DATA_HOME` | 日志、记录和反馈包的上级目录 |

## 退出码 {#exit-codes}

| 代码 | 含义 |
|---|---|
| `0` | 运行正常 |
| `2` | 参数解析错误，或事件流不支持的模式 |
| `3` | 被版本记录阻止的旧版本 |
| `130` | 被 `Ctrl-C` 中止 |
| `143` | 被 `SIGTERM` 终止 |
| 其他 | 意外情况——会写入崩溃包 |

完整的表格和崩溃陷阱的逻辑：[退出码](./exit-codes.md)。
