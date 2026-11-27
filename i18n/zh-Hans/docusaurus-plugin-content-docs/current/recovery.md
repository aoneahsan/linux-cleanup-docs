---
title: 恢复
description: linux-cleanup 误删之后该怎么做——查看可用的日志，从备份或来源恢复，在恢复要紧时避免继续写盘。
sidebar_position: 91
---

# 恢复

**linux-cleanup 没有撤销。** 本页讲的是如何弄清删除了什么，以及您真正有哪些选择。

:::danger 先停止向磁盘写入
如果删掉了无可替代的东西，而您打算尝试用文件雕刻（file carving）的方式恢复，**请立即停止使用该文件系统**。每一次写入都会降低恢复已解除链接数据的可能。

这只适用于[真正无可替代的类别](#3-decide-what-is-actually-recoverable)。如果是缓存，就不必了——让工具重新获取即可。
:::

## 1. 查看可用的记录 {#1-inspect-the-available-record}

一次运行可能留下本地日志。引导流程还可能留下一份 JSON 会话记录，除非关闭了报告。两者都不是完整的逐文件删除记录，也不是备份。

```bash
# 最近一次的会话日志
less "$(ls -t ~/.linux-cleanup/logs/cleanup-*.log | head -1)"

# 最新的引导流程记录（如果有）
jq '.' "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

在保留的日志中搜索某个具体路径：

```bash
grep -rn 'the-filename-you-are-missing' ~/.linux-cleanup/logs/
```

找不到匹配并不能证明工具没碰过那个文件。辅助程序可能只报告整个缓存目录或一条命令，而不是每个文件；`--cleanup-logs` 也可能删掉某次运行的日志。请同时检查所选的模式和目标根目录。

缩小到单次会话的步骤：

```bash
jq '.steps[] | select(.status == "ran")' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

## 2. 确认它是否只是被拒绝了 {#2-confirm-it-was-not-simply-refused}

拒绝也会写入日志。如果找到这样一行，说明什么都没删：

```text
✗ REFUSE: protected path: /home/you/Documents/notes
```

见[受保护路径](./reference/protected-paths.md)。

## 3. 判断哪些真正能恢复 {#3-decide-what-is-actually-recoverable}

| 删除了什么 | 恢复方式 |
|---|---|
| 包管理器缓存 | **自动。**下次安装会重新下载 |
| 浏览器缓存 | **自动。**浏览时会重建 |
| Gradle 缓存或 wrapper 发行版 | **自动。**下次构建会重新获取——第一次构建会比较慢 |
| Cypress / Playwright 二进制文件 | 重新执行该工具的安装步骤 |
| `node_modules` | 在项目中运行 `yarn install` 或 `npm install` |
| Android AVD | 在 Android Studio 中重新创建。**配置文件已经没有了**；系统镜像会重新下载 |
| 编辑器扩展版本 | 重新加载编辑器窗口；如果确实缺失就重新安装 |
| apt 缓存、日志、snap 修订版 | 会自行重新生成，无需处理 |
| **来自 `~/Downloads` 的个人文件** | **只能从您自己的备份恢复**，或从来源重新下载 |
| **未完成的下载** | 无法恢复。重新开始下载 |

### 重新生成常见的几类 {#regenerating-the-common-ones}

```bash
# 在受影响的项目中
yarn install            # 或：npm install / pnpm install

# 测试运行器的二进制文件
npx cypress install
npx playwright install

# Flutter
flutter pub get
```

这里都不需要本工具参与——您只是让每个工具在缓存为空时做它本来会做的事。

## 4. 如果确实无可替代 {#4-if-it-was-genuinely-irreplaceable}

按现实情况，依次为：

1. **您自己的备份。** Timeshift、Borg、restic、rsync 快照、云同步——用什么都行。这是唯一可靠的答案。
2. **原始来源。** 下载的文件可以再下载一次。到浏览器历史记录里找 URL。
3. **同步服务的回收站。** Dropbox、Nextcloud、Google Drive 等会在服务器端把删除的文件保留一段时间。如果该目录做过同步，去那里找。
4. **文件雕刻工具**——`extundelete`、`testdisk`、`photorec`。它们针对已解除链接的 inode，在繁忙的文件系统上希望渺茫，尤其是启用了 TRIM 的 SSD。请先卸载文件系统或从 live USB 操作，且绝不要把恢复的数据写回同一设备。

:::caution 对第 4 步要坦诚
在已挂载、正在使用且启用了 TRIM 的 SSD 上，雕刻通常什么也恢复不了。只有对真正重要的东西才值得一试，而且要在停止写盘之后。
:::

## 5. 避免再次发生 {#5-stop-it-happening-again}

| 改变 | 效果 |
|---|---|
| 每次清理前运行 [`--scan`](./modes/scan.md) | 在结果还只是假设时就能看到 |
| 把重要文件移出 `~/Downloads` | `~/Documents` 和 `~/Desktop` [受保护](./reference/protected-paths.md) |
| 在引导流程中跳过第 7 步 | 个人文件就需要另外有意识地单独运行 |
| 提高阈值：`-d 365` | 只有真正很旧的文件才会成为候选项 |
| 除了在可信机器上配合 `--all-safe`，绝不使用 `-y` | `-y` 碰不到个人数据，但您只能事后才看到决定 |
| 建立真正的备份 | 这是唯一能让删除变得可恢复的东西 |

## 6. 如果工具做了不该做的事 {#6-if-the-tool-did-something-it-should-not-have}

如果删除发生在[受保护路径](./reference/protected-paths.md)内部，或删掉了*当前*的编辑器扩展版本，或有任何其他与文档所述防护不符的情况——那就是值得报告的 bug。

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

请附上日志，以及引导流程记录（如果有）。见[提交 bug 报告](./guides/send-a-bug-report.md)。

## 接下来 {#next}

- [删除是永久的](./safety/irreversibility.md)——没有撤销背后的设计
- [删除前先预览](./safety/preview-first.md)——避免陷入这种情况
- [故障排查](./troubleshooting.md)——针对不涉及数据丢失的问题
