---
title: shell 别名与每周 cron
description: 安装 shell 别名 cleanup 和每周自动运行的全安全清理，各自写入了什么，以及如何再移除它们。
sidebar_position: 2
---

# shell 别名与每周 cron

**两个一次性设置的辅助工具：shell 别名 `cleanup`，以及每周一次的自动运行。** 两者都可以用对应的卸载参数撤销。

```bash
linux-cleanup --install-alias
linux-cleanup --install-cron
```

## shell 别名 {#the-shell-alias}

```bash
linux-cleanup --install-alias
```

根据您的 shell，向 `~/.bash_aliases` 或 `~/.zshrc` 追加一个 `cleanup` 别名。之后，在任何地方输入 `cleanup` 都会运行这个工具。

重新加载 shell，否则别名看起来像是不存在：

```bash
source ~/.bashrc     # 或 ~/.zshrc
```

用 `linux-cleanup --uninstall-alias` 移除它。

:::note shell 初始化文件在删除层面受保护
`.bashrc`、`.zshrc`、`.bash_aliases` 等都在[受保护的文件名列表](../reference/protected-paths.md#protected-basenames)上，所以任何清理模式都永远删不掉它们——无论它们出现在哪个路径。别名安装器只追加；卸载器只删除它自己的那一行。
:::

## 每周 cron 任务 {#the-weekly-cron-job}

```bash
linux-cleanup --install-cron
```

把 `--all-safe -y` 安排在**每周日 03:00** 运行，并把输出追加到 `~/.linux-cleanup/logs/cron.log`。需要 `crontab`。

用 `linux-cleanup --uninstall-cron` 移除它。

### 为什么 `--all-safe` 是适合这个任务的模式 {#why---all-safe-is-the-right-mode-for-this}

它是 `--yes` 唯一适用的模式，而且**碰不到个人数据**——仅限交互式的模式不属于它，并按设计忽略 `--yes`。所以无人值守的运行可以清理缓存，却永远不会删除 `~/Downloads` 中的文件。见[关卡 3](../safety/guards.md#guard-3--personal-data-is-interactive-only)。

[闲置阈值关卡](../safety/guards.md#guard-2--the-staleness-gate)仍然适用，所以最近用过的文件在每周的清理中都会保留。

## 自己编写 crontab 条目 {#writing-the-crontab-entry-yourself}

如果想要不同的时间或参数：

```bash
crontab -e
```

```bash
0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1
```

:::danger 使用绝对路径
cron 运行时的 `PATH` 极简——通常只有 `/usr/bin:/bin`。如果 `linux-cleanup` 位于 `~/.local/bin` 或 Node 版本管理器的目录中，不带路径的 `linux-cleanup` 就找不到，任务每周都会无声地失败。

这是定时运行最常见的问题。用下面的命令找到您的路径：

```bash
command -v linux-cleanup
```

或者在 crontab 顶部明确设置 `PATH=`。
:::

| 参数 | 在 cron 中的作用 |
|---|---|
| `--all-safe -y` | 无人值守，只处理缓存 |
| `--no-report` | 阻止 JSON 记录不断累积——它们**永远不会**被自动删除 |
| `--cleanup-logs` | 在结束时删除那次运行的日志 |
| `-d 30` | 可选：每周更激进地修剪 |

单靠 `--cleanup-logs` 不足以让目录保持小巧：它从不触碰记录。`--no-report` 才是起作用的参数。

:::caution 不要在定时任务中加入 `--purge-all`
无人值守再加上没有闲置阈值，意味着某个代价高昂的资源可能在您需要它的前一周消失，而且没有人在看。把 `--purge-all` 留给有意为之、有人看着的运行。见[回收最多的空间](./reclaim-the-most-space.md)。
:::

## 确认它运行过 {#checking-that-it-ran}

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

如果日志显示 `command not found`，就是上面说的 `PATH` 问题。如果日志是空的，说明任务从未触发——检查 cron 守护进程是否在运行（`systemctl status cron` 或 `crond`）。

cron 日志**永远不会轮转**。它变大时请自己轮转：

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## 改用 systemd 定时器 {#a-systemd-timer-instead}

如果您更喜欢定时器而不是 cron，这与工具本身无关——安排同一条命令即可。工具既不知道也不在乎是哪个调度器调用了它，`--install-cron` 只是为了方便，而不是必需。

## 两者都移除 {#removing-both}

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

包括软件包本身在内的完整移除：[卸载](./uninstall.md)。
