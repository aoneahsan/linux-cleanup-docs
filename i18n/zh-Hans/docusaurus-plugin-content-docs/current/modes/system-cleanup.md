---
title: 系统清理（sudo）
description: sudo 系统模式：apt、日志、Snap、内核列表、/tmp 中的旧文件，以及可选的页面缓存释放。
sidebar_position: 7
---

# 系统清理（sudo）

**`--system` 在开始前请求 sudo，然后逐个询问每个系统步骤。** 它直接使用 `apt` 和 `dpkg` 处理软件包，所以完整模式只适用于 Debian 和 Ubuntu。其他发行版也许能运行日志或 `/tmp` 部分，但软件包命令会失败；见[发行版支持](../distro-support.md)。

```bash
linux-cleanup --system --dry-run
linux-cleanup --system
```

试运行会打印拟执行的命令，但不会删除清理目标或更改设置，仍可能写入本地日志和更新检查状态。实际运行无法撤销，请先查看试运行结果。

## 六个步骤 {#the-six-steps}

| 步骤 | 确认后源代码执行的命令 | 默认 |
|---|---|---|
| apt | `sudo apt autoremove --purge -y`, `sudo apt clean` | 是 |
| 日志 | `sudo journalctl --vacuum-size=100M` | 是 |
| Snap | 通过 `sudo snap remove` 删除符合条件的已停用修订版 | 是 |
| 内核 | 通过 `dpkg` 列出已安装的 `linux-image-*` 软件包 | 不删除 |
| `/tmp` | `sudo find /tmp -mindepth 1 -atime +7 -delete` | 是 |
| 页面缓存 | `sudo sync`, `sudo sysctl -q -w vm.drop_caches=3` | 否 |

日志目标是 100 MB，`/tmp` 的时间阈值是 7 天；两者都不受 `--days` 影响。Snap 步骤会保留已停用的回滚修订版，直到替代它的版本达到配置的时间阈值，除非使用了 `--purge-all`。内核列表仅供参考；apt 可能在它之前的步骤中删除被取代的内核软件包。

`/tmp` 步骤依赖访问时间。如果文件系统不能可靠地记录访问时间，工具会跳过按时间删除。释放页面缓存腾出的是内存而不是磁盘，而且在缓存重新填满之前，后续的读取可能会变慢。

## 边界 {#boundaries}

该模式运行期间会缓存 sudo 凭据，以便发出各条独立的命令。如果您不打算审查这些命令，就不要开始系统清理。`--speed` 有另外一些可选修复，也可能请求 sudo；系统模式并不是命令行中唯一能使用 sudo 的途径。

回收的大小取决于机器。运行后测得的磁盘空间变化也可能包含其他进程的写入。请阅读日志，查看工具尝试执行了哪些命令。

## 接下来阅读 {#read-next}

- [删除前先预览](../safety/preview-first.md)
- [安全防护](../safety/guards.md)
- [发行版支持](../distro-support.md)
