---
title: 故障排查
description: linux-cleanup 用户实际遇到的问题的症状、原因和修复方法——拒绝、缺少依赖、cron 失败、扫描缓慢以及版本混乱。
tags: [troubleshooting, errors, fixes, cron, jq, whiptail]
sidebar_position: 92
---

# 故障排查

症状 → 原因 → 修复。先运行验证命令；如果对得上，再应用修复。

如果您遇到的是数据丢失而不是报错，请改看[恢复](./recovery.md)。

## REFUSE: protected path {#refuse-protected-path}

```text
✗ REFUSE: protected path: /home/you/Documents/something
```

**原因。** 该路径在展开符号链接后，解析到了[受保护列表](./reference/protected-paths.md)中的某个位置，被白名单拦下了。

**这是正确的行为，不是故障。** 什么都没有删除。

**修复。** 查清楚是什么解析到了哪里：

```bash
linux-cleanup --list-targets
realpath <the path that was rejected>
```

几乎总是某个缓存被符号链接到了受保护目录。**修好符号链接，而不是修改工具**——工具正在做它该做的事。按设计，没有任何覆盖参数。

两条相关的信息：

```text
✗ REFUSE: unsafe path: '/home/you'            # 单独的 $HOME 或 /
✗ REFUSE: shell-init / history file: …        # .bashrc、.zshrc 等
```

## TUI mode needs whiptail or dialog {#tui-mode-needs-whiptail-or-dialog}

**原因。** 在两者都未安装的情况下运行了 `--tui`。

**修复。** 安装其中一个，或接受退回到命令行菜单。

```bash
sudo apt install whiptail     # Debian / Ubuntu
sudo dnf install newt         # Fedora / RHEL
sudo pacman -S libnewt        # Arch
```

**验证。** 先运行 `command -v whiptail`，再重新运行。见 [TUI](./modes/tui.md)。

## export requires jq {#export-requires-jq}

**原因。** 在没有安装 `jq` 的情况下使用了 `--export md`、`--export html` 或报告管理器中的转换。

**修复。**

```bash
sudo apt install jq
```

只有转换才需要 `jq`。没有它，每次运行仍会写入 JSON 记录。见[报告](./modes/reports.md)。

## command not found {#command-not-found}

**原因。** 缺少某个必需的依赖，或被不兼容的别名遮蔽。在用 BusyBox 代替 GNU coreutils 的精简容器中很常见。

**验证。**

```bash
linux-cleanup --self-test
```

它会探测每个必需的命令，并指出第一个缺失的。

**修复。** 安装您发行版的 coreutils、findutils 和 gawk 软件包。在 Alpine 上：

```bash
apk add coreutils findutils bash
```

`realpath` 最重要——正是它让[受保护路径检查](./reference/protected-paths.md)不受符号链接影响。见[发行版支持](./distro-support.md#minimal-containers)。

## cron 条目在运行，却什么都没做 {#cron-entry-runs-but-does-nothing}

**验证。**

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

**原因。** cron 日志中出现 `command not found`，说明 cron 极简的 `PATH`（`/usr/bin:/bin`）找不到您的安装。这是最常见的 cron 问题。

**修复。** 在 crontab 中使用绝对路径：

```bash
crontab -e
# 改前：  0 3 * * 0 linux-cleanup --all-safe -y …
# 改后：  0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y …
```

用 `command -v linux-cleanup` 找到正确的路径。或者在 crontab 顶部加一行 `PATH=`。见[别名与 cron](./guides/alias-and-cron.md)。

## $HOME is not set {#home-is-not-set}

```text
✗ $HOME is not set
```

**原因。** 在没有设置 `$HOME` 的环境中运行——某些 Docker 镜像、某些 CI 运行器。

**修复。**

```bash
HOME=/root linux-cleanup --scan
```

或在会话中导出一次。脚本会直接中止而不是猜测，这是有意为之：错误的 `$HOME` 意味着每一次路径检查都是针对错误的目录树进行的。

## 扫描或 --node-modules 看起来卡住了 {#scan-or---node-modules-seems-to-hang}

**原因。** `find` 正在遍历 `$HOME` 下成千上万个目录。在机械硬盘上，第一次运行需要一到三分钟。

**验证。** 看日志而不是终端：

```bash
tail -f ~/.linux-cleanup/logs/cleanup-*.log
```

每五到十秒有新的一行，说明它在工作。

**修复。** 第一次运行请耐心等待；之后的运行会因为目录元数据已被缓存而更快。如果同一路径总是卡住超过五分钟，可能是符号链接循环，或者无响应的网络挂载或 FUSE 挂载——请[报告它](./guides/send-a-bug-report.md)。

## 会话期间磁盘用量反而增加了 {#disk-usage-grew-during-the-session}

**原因。** 报告的回收量是整台机器的 `df` 差值。在您的会话期间，另一个进程——构建、软件包更新、日志轮转、IDE 重新索引——写入的量超过了清理回收的量。

**这不是 bug**，也不代表清理失败。看看各步骤自己报告了什么：

```bash
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

**修复。** 等机器空闲时重新运行 `--scan`，看到真实情况。

## --system 之后 apt update 失败 {#apt-update-fails-after---system}

**原因。** 很少见。`apt clean` 不会弄坏 `apt update`，但清理可能和另一个持有锁的 apt 操作发生了冲突。

**验证。**

```bash
sudo apt update 2>&1 | tail -20
```

**修复。**

```bash
sudo rm -f /var/lib/apt/lists/lock /var/cache/apt/archives/lock /var/lib/dpkg/lock-frontend
sudo apt update
```

只有在确实没有 apt 进程运行时才这样做——先运行 `ps aux | grep -i apt`。

## VS Code 报告缺少扩展 {#vs-code-reports-a-missing-extension}

**原因。** 通常是正确的行为：编辑器仍引用着一个已被删除的旧版本。

**修复。** 重新加载窗口——`Ctrl+Shift+P` → **Developer: Reload Window**。

**验证**当前版本仍然存在：

```bash
ls ~/.vscode/extensions/ | grep <extension-name>
```

如果*当前*版本确实没了，说明最高版本检测有 bug。请重新安装并[报告它](./guides/send-a-bug-report.md)：

```bash
code --install-extension <publisher>.<name>
```

## 出现了崩溃包，但我没看到崩溃 {#a-crash-bundle-appeared-but-i-saw-no-crash}

**原因。** 脚本在某个意外的地方以非零状态退出——后台的 `find` 被 OOM killer 杀掉，或者管道断开。

**修复。** 在崩溃包的清单中读取退出码：

```bash
tar -xzOf ~/.linux-cleanup/feedback/crash-*.tar.gz --wildcards '*MANIFEST*'
```

`137` 是 OOM killer，`141` 是 SIGPIPE，`139` 是段错误。见[退出码](./reference/exit-codes.md)。这些都值得报告。

## --install-alias 之后找不到别名 cleanup {#alias-cleanup-not-found-after---install-alias}

**原因。** shell 的 rc 文件还没有被重新读取。

**修复。**

```bash
source ~/.bashrc      # 或 ~/.zshrc
```

或者打开一个新终端。

## 运行的版本不对 {#wrong-version-running}

**验证。**

```bash
command -v linux-cleanup
linux-cleanup --version
```

**原因。** 旧的全局安装遮蔽了更新的 `npx` 缓存，或者 shell 的命令哈希过期了。

**修复。**

```bash
npm uninstall -g linux-cleanup
npm install -g linux-cleanup@latest
hash -r
linux-cleanup --version
```

在 [npm 软件包页面](https://www.npmjs.com/package/linux-cleanup)上查看当前发布的版本。查看[更新日志](./changelog.md)了解自您安装的版本以来的变化。

## 还是解决不了 {#still-stuck}

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

检查一下调试包，然后附上一段简短说明（期望的结果和实际结果）通过邮件发送。见[提交 bug 报告](./guides/send-a-bug-report.md)。
