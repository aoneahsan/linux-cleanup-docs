---
title: 常见问题
description: 关于 linux-cleanup 的路径、版本检查、试运行、永久删除和发行版支持的解答。
sidebar_position: 93
---

# 常见问题

具体症状的问题请看[故障排查](./troubleshooting.md)；设计理由见[安全防护](./safety/guards.md)。

## 它会删掉我的代码吗？ {#will-it-delete-my-code}

**您的源文件，不会。** `~/Documents` 和其他个人目录都[直接受保护](./reference/protected-paths.md)，也没有任何清理目标指向项目的源代码。

最接近的是在您的项目根目录中查找长期未用的 `node_modules` 目录。这些[仅限交互式](./modes/node-modules-finder.md)，每个项目都要确认，而且 `yarn install` 可以重建它们。

有一点值得知道：如果您直接修改过 `node_modules` *里面*的文件，而不是通过补丁工具，那个修改在别处并不存在。

## 它会向外发送数据吗？ {#does-it-phone-home}

**联网时，命令行会在启动时通过 HTTPS 检查一份公开的版本记录。** 它不会发送扫描结果、清理路径或崩溃包。离线时，检查会放行，运行照常继续。

在克隆版上亲自验证：

```bash
grep -rE 'curl|wget|http://|https://' cleanup.sh lib/ modules/ bin/
```

版本检查位于 `modules/update_check.sh`；也请检查这个文件。安装或接受更新时会用到 npm 或 GitHub。反馈助手只会打开一份草稿，由您决定是否发送。

## 为什么没有撤销？ {#why-is-there-no-undo}

撤销日志会在您想腾出空间的磁盘上放大写入——为了回收 20 GB 而保留 20 GB，什么也没得到。它还会制造虚假的安心感，而且充其量只能部分恢复。

安全模型改为预防：白名单、闲置阈值和交互确认。完整理由：[删除是永久的](./safety/irreversibility.md)。

## 有 `--dry-run` 吗？ {#is-there-a---dry-run}

**有。** `--scan` 只读；`--dry-run` 会走完所选清理，但不删除文件，也不更改设置。试运行仍会保留本地日志，不会写 JSON 会话报告。见[删除前先预览](./safety/preview-first.md)。

## 最安全的试用方式是什么？ {#what-is-the-safest-way-to-try-it}

```bash
linux-cleanup --self-test      # 验证防护确实会触发
linux-cleanup --scan           # 只读；显示能回收多少
linux-cleanup --list-targets   # 它能触及的每一条路径
linux-cleanup --all-safe --dry-run  # 预览一次缓存清理
```

做完这些，您已经亲眼看到安全模型在起作用，而一个字节都没丢。然后运行 `linux-cleanup`，对任何让您意外的项回答 `n`。

## 它会让电脑变快吗？ {#will-it-speed-up-my-computer}

有时会快一点，而且应该坦白说，快得很有限：

- VS Code 的扩展目录从五十个变成十几个时，启动会快一些
- 精简的缓存比臃肿的缓存略微更容易浏览
- 浏览器冷启动不受影响——缓存是键值结构，查找是 O(1)
- 释放页面缓存腾出的是内存而不是磁盘，而且内核会立即重新填满

真正的好处是“磁盘已满”不再妨碍您工作——而不是某个跑分数字。

## 清理中途按 `Ctrl-C` 会怎样？ {#what-if-i-press-ctrl-c-mid-cleanup}

当前的删除会完成——通常远不到一秒——然后脚本以代码 `130` 退出。日志会保留到那一刻为止的所有内容。[崩溃陷阱有意忽略 `130`](./reference/exit-codes.md)，所以不会写入崩溃包。

## 可以用 root 运行吗？ {#can-i-run-it-as-root}

可以，但不应该。它是为普通用户运行而设计的；万一有 bug 绕过了防护，以 root 运行只会扩大影响范围。[`--system`](./modes/system-cleanup.md) 会在内部处理正当的 sudo 需求，一次一条经过审查的命令。

## 它在我的发行版上能用吗？ {#does-it-work-on-my-distro}

`$HOME` 内的缓存清理在**所有** Linux 发行版上都能用。

[`--system`](./modes/system-cleanup.md) **仅支持 Debian 和 Ubuntu**——它直接调用 `apt` 和 `dpkg`，不检测发行版。在 Fedora、Arch 或 openSUSE 上，它的软件包步骤会失败，而日志、`/tmp` 和页面缓存步骤仍然可用。见[发行版支持](./distro-support.md)。

## WSL 呢？ {#what-about-wsl}

命令行运行在 Linux 一侧。清理前，请检查 Linux 主目录中任何指向 `/mnt/c/` 的符号链接。白名单会解析符号链接，但 Windows 的 `Documents` 路径并不会自动被 Linux 主目录的规则覆盖。

## 为什么用 bash，而不是 Python、Go 或 Rust？ {#why-bash-rather-than-python-go-or-rust}

它面向的每个系统上都已经有 Bash。编译后的二进制意味着发布用户不容易审查的东西；用 Python 或 Node 实现，则会给一个本职就是从磁盘上删东西的工具增加运行时依赖。

这个脚本是几千行带注释的 bash，一位资深工程师一个下午就能读完。对一个在 `sudo` 可用的情况下运行 `rm -rf` 的工具来说，可审查性比易用性更有价值。

## 应该多久运行一次？ {#how-often-should-i-run-it}

| 模式 | 频率 |
|---|---|
| [`--scan`](./modes/scan.md) | 每月一次，作为基准 |
| [`--all-safe -y`](./modes/all-safe.md) | 每周——[将其自动化](./guides/alias-and-cron.md) |
| [`--system`](./modes/system-cleanup.md) | 每季度一次，手动 |
| [`--node-modules`](./modes/node-modules-finder.md) | 每年一次，等副项目堆积起来 |
| [`--editor-ext`](./modes/editor-extensions.md) | 编辑器变慢时——`--all-safe` 也会处理 |
| [`--stale`](./modes/personal-stale-files.md) | 每季度一次，有意识地进行 |
| [`--doctor`](./modes/doctor.md) | 出现 `command not found` 时 |
| [`--globals`](./modes/globals-audit.md) | 重装 Node 或迁移机器之前 |

## `--purge-all` 是做什么的？ {#what-is---purge-all-for}

它会关闭[闲置阈值关卡](./safety/guards.md#guard-2--the-staleness-gate)，把缓存完全清空，而不是修剪闲置文件。其中包括您可能仍然需要的 Gradle wrapper 发行版、Playwright 浏览器和 Cypress 二进制文件。

在重装机器之前，这是正确的选择；其他时候，这是糟糕的默认。绝不要把它放进 cron 任务。

## 我应该安装哪个版本？ {#which-version-should-i-install}

在 [npm 软件包页面](https://www.npmjs.com/package/linux-cleanup)查看当前发布的版本，运行 `linux-cleanup --version` 确认您已安装的版本。升级前请先看[更新日志](./changelog.md)。

## 它采用什么许可证？ {#what-licence-is-it-under}

自 1.4.0 起采用 **[MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)**——宽松且经 OSI 认证。可以个人或商业使用，可以修改、分叉、嵌入和再分发。唯一的条件是保留版权和许可声明。

按“原样”（AS IS）提供，不附带任何担保。1.4.0 之前发布的版本保留其发布时的许可证。

## 如何提功能需求或报告 bug？ {#how-do-i-request-a-feature-or-report-a-bug}

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

然后提交一个 [GitHub issue](https://github.com/aoneahsan/linux-cleanup/issues)，或发邮件到 [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com)。欢迎在 MIT 许可下提交 pull request；只有描述的功能需求同样欢迎。见[提交 bug 报告](./guides/send-a-bug-report.md)。

## 它永远不会做什么？ {#what-will-it-never-do}

- 删除[受保护路径列表](./reference/protected-paths.md)上的任何内容
- 在没有逐个文件确认的情况下触碰个人数据
- 自动上传扫描结果、清理路径或崩溃包
- 安装服务、守护进程或后台代理
- 修改或删除您 shell 配置中已有的行
- 恢复它删除的任何东西
