---
title: 环境变量
description: linux-cleanup 读取的每个环境变量及其默认值和作用——输出目录覆盖、颜色控制以及 XDG 配置查找。
tags: [environment, variables, configuration, no-color, xdg, reference]
sidebar_position: 4
---

# 环境变量

**linux-cleanup 读取的每个环境变量。** 全部都是可选的。

| 变量 | 默认值 | 作用 |
|---|---|---|
| `NO_COLOR` | 未设置 | 任何非空值都会关闭 ANSI 颜色。这是来自 [no-color.org](https://no-color.org) 的跨工具标准。与 `--no-color` 相同 |
| `CLEANUP_NO_COLOR` | `0` | linux-cleanup 专用的颜色开关。设为 `1` 只在这里关闭颜色 |
| `LINUX_CLEANUP_LOG_DIR` | `~/.linux-cleanup/logs/`（npx / npm）或 `<repo>/logs/`（克隆） | 会话日志存放的位置。不存在时会创建 |
| `LINUX_CLEANUP_REPORTS_DIR` | `~/.linux-cleanup/reports/` 或 `<repo>/reports/` | JSON 会话记录存放的位置。不存在时会创建 |
| `LINUX_CLEANUP_DATA_HOME` | 未设置——回退到日志目录的上级目录 | `logs/`、`reports/` 和 `feedback/` 共同的上级目录 |
| `LINUX_CLEANUP_NPX` | 未设置 | **内部使用。** 由 Node 启动器设为 `1`。请勿自行设置 |
| `LINUX_CLEANUP_LAUNCHER` | 未设置 | **内部使用。** Node 启动器设为 `node`；桌面应用设为 `desktop`，这会跳过命令行自身的更新检查，因为应用有自己的检查（自 2.1.0 起）。请勿自行设置 |
| `XDG_CONFIG_HOME` | `~/.config` | 查找 `personal-roots.txt` 和 `project-roots.txt` 的位置 |

## 重定向所有输出 {#redirecting-all-output}

`LINUX_CLEANUP_DATA_HOME` 是移动所有内容的唯一开关——日志、记录和反馈包：

```bash
export LINUX_CLEANUP_DATA_HOME="/mnt/secure/linux-cleanup"
linux-cleanup --scan
```

:::caution 会创建目录，但不会创建挂载点
工具会在您给出的路径下创建 `logs/`、`reports/` 和 `feedback/`。它**不会**创建或检查底层的挂载点。如果指向一个未挂载的路径，输出会悄悄落到底层的文件系统上。

依赖它之前，请确认目标已挂载且可写。
:::

需要更细的控制时，`LINUX_CLEANUP_LOG_DIR` 和 `LINUX_CLEANUP_REPORTS_DIR` 可以分别覆盖，且优先于数据根目录。

## 颜色控制 {#colour-control}

```bash
export NO_COLOR=1          # 这台机器上的所有工具
export CLEANUP_NO_COLOR=1  # 只针对 linux-cleanup
linux-cleanup --no-color   # 只针对这一次调用
```

`CLEANUP_NO_COLOR` 适用于这种情况：您希望其他工具都有颜色，而这个工具输出纯文本——通常是在把输出管道到会搞乱转义序列的地方时。

## 配置要扫描的根目录 {#configuring-the-scanned-roots}

`$XDG_CONFIG_HOME`（默认 `~/.config`）下的两个文件决定个人文件扫描和项目扫描会遍历哪些目录：

| 文件 | 使用者 | 默认根目录 |
|---|---|---|
| `personal-roots.txt` | [`--stale`](../modes/personal-stale-files.md) | `~/Downloads`；`~/Desktop` 等受保护的根目录会被忽略 |
| `project-roots.txt` | [`--node-modules`](../modes/node-modules-finder.md) | 您的项目目录 |

每行一个路径。这遵循 [XDG 基础目录规范](https://specifications.freedesktop.org/basedir-spec/)，所以设置 `XDG_CONFIG_HOME` 会同时改变两个文件的位置。

:::danger 在 `personal-roots.txt` 中加一个根目录会扩大可删除的范围
个人文件扫描[只能交互式运行](../safety/guards.md#guard-3--personal-data-is-interactive-only)，所以不经您逐个文件确认就不会删除任何东西——但您加入的根目录，其中的内容会开始出现在候选列表里。

[路径白名单](./protected-paths.md)依然适用，并且优先：在这里加入 `~/Documents` 并不会让它变得可删除。
:::

## 用于 CI 和脚本 {#for-ci-and-scripts}

```bash
NO_COLOR=1 linux-cleanup --scan > /tmp/scan.log
```

单独的扫描不会生成引导流程的 JSON 会话报告。在脚本中请检查[退出码](./exit-codes.md)，或使用 [`--json-events`](./json-events.md) 获取结构化输出。

## 它不会读取的内容 {#what-it-does-not-read}

- `PATH`，除了用来检测安装了哪些可选工具
- `USER` 和 `LOGNAME`，除了用来标注日志开头
- 您的 shell 历史、别名或配置——[`--doctor`](../modes/doctor.md) 是唯一读取 shell 初始化文件的模式，而且只用来检查运行时是否已接入
- 任何远程或通过网络提供的配置。根本没有

如果 `$HOME` 未设置，脚本会立即中止，而不是去猜。见[故障排查](../troubleshooting.md#home-is-not-set)。

## 接下来 {#next}

- [输出路径](./output-paths.md) — 文件实际存放的位置
- [命令行参数](./cli-flags.md)
