---
title: 更新日志
description: linux-cleanup 的发布历史，包括试运行、版本通知和本地 JSON 事件。
tags: [changelog, releases, versions, history]
sidebar_position: 94
---

# 更新日志

`linux-cleanup` 的发布历史。格式遵循 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)，项目采用[语义化版本](https://semver.org/spec/v2.0.0.html)。

当前已发布的版本请查看 [npm 软件包](https://www.npmjs.com/package/linux-cleanup)。[源码中的更新日志](https://github.com/aoneahsan/linux-cleanup/blob/main/CHANGELOG.md)是完整的记录。下面的条目解释那些会影响清理决定的变化。

## 2.1.1 — 2026-11-22 {#211--2026-11-22}

`--help`、`--version`、菜单的“关于”框和反馈界面会列出网站、本手册和桌面应用的下载页面。运行报告中的 `credits.tool_homepage` 现在指向产品网站。“关于”框不再声称脚本不发起任何网络请求：它会在启动时读取一次公开的版本记录。任何模式删除的内容都没有变化。

## 2.1.0 — 2026-11-21 {#210--2026-11-21}

`--json-events` 会为 `--scan` 和非交互式的 `--all-safe --yes` 输出本地的、带版本号的 JSON 事件流。在全安全模式下加上 `--dry-run`，会报告拟删除的路径而不删除它们。事件流可能包含完整的本地路径，所以请把它留在本机上。

## 2.0.1 — 2026-11-21 {#201--2026-11-21}

README 列出了 linux-cleanup 发布的每一个地方。脚本的行为没有变化。

## 2.0.0 — 2026-11-10 {#200--2026-11-10}

新增 `--dry-run`、启动时的公开版本记录检查，以及用于持久命令行副本的 `--refresh-app`。普通的版本通知允许本次运行，从下一次启动起阻止；紧急通知会立即阻止旧副本。离线时照常运行。试运行不会删除清理目标或改变设置，但可能会写入本地日志和更新检查状态。

## 1.6.0 — 2026-09-18 {#160--2026-09-18}

新增只读的 `--speed` 诊断，以及可配置的项目和个人文件搜索根目录。修复了在 `noatime` 文件系统上的闲置检测：旧版本因为没有记录访问时间，可能会删除仍在使用的缓存。别名和 cron 的安装现在指向一个持久副本，日志清理只删除本次运行的日志。

## 1.5.2 — 2026-09-18 {#152--2026-09-18}

保留最近被禁用的 Snap 修订版作为回滚副本，并让 `--node-modules` 不再列出 Yarn PnP 的内部文件。

## 1.5.1 — 2026-09-18 {#151--2026-09-18}

把已解压的软件包缓存和浏览器缓存改为按整个条目清理，这样一个仍在使用的安装里，不会因为某个很少用的文件而被删掉一部分。

## 1.5.0 — 2026-09-18 {#150--2026-09-18}

Gradle 和 Android Studio 缓存的清理改为以完整的版本单元为单位进行，并修复了长期未用 `node_modules` 的检测及其专用的删除保护。早先 1.4.0/1.5.0 的清理可能会让某个已解压的缓存不完整；恢复步骤见源码中的更新日志。

## 1.4.0 — 2026-07-11 {#140--2026-07-11}

### 变更 {#changed}

- **改用 [MIT 许可证](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)。** 之前采用自定义的“Source-Available · No-Derivatives · Non-Commercial v1.0”许可证。现在是宽松的、经 OSI 认可的开源许可：可以自由使用、修改、分叉、再分发和商业使用，只需保留署名。

  MIT 的“按原样提供 / 不承担责任”免责声明取代了之前的担保、责任和赔偿条款。`package.json` 现在声明 `"license": "MIT"`。

  这只对今后生效——**之前已发布的版本保留其发布时的许可证。**

代码、安全保护和命令行都没有变化。

## 1.3.1 — 2026-05-10 {#131--2026-05-10}

仅文档的发布。行为没有变化。

### 新增 {#added}

- 按 [Diátaxis 框架](https://diataxis.fr/)组织的完整 `docs/` 目录——教程、操作指南、参考和说明。每个模式、参数、输出路径和退出码都有文档。
- 全部十六个模式各自的功能页面，参数、模式、环境变量、输出路径、退出码和 JSON 结构的参考页面，以及操作示例和常见问题。
- README 中新增“完整文档”一节，链接最常用的页面。

代码、安全保护和命令行界面与 1.3.0 相同。

## 1.3.0 — 2026-05-10 {#130--2026-05-10}

最后打磨的版本：一个可视化菜单和自动崩溃捕获。没有新的清理逻辑；现有的安全保护和闲置关卡保持不变。

### 新增 {#added}

- **[TUI 模式](./modes/tui.md)**（`-t` / `--tui` / `-g` / `--gui`）——由 whiptail 或 dialog 驱动的菜单。每次选择后都会回到普通的命令行输出来运行，然后再回到菜单。两个工具都没装时，会平滑地退回到命令行菜单，并给出针对发行版的安装提示。
- **自动捕获崩溃包**——一个 EXIT 陷阱，在意外的非零退出时，把一个自包含的 `crash-<stamp>.tar.gz` 写入 `~/.linux-cleanup/feedback/`，其中包含会话日志、最近的记录和系统清单，然后打印一行可以通过邮件发送的提示。

  在正常退出、`Ctrl-C`（130）、`SIGTERM`（143）和参数解析退出（2）时不会生成。**不发起任何网络请求**——在您决定分享之前，包一直留在您的机器上。
- TUI 中的**关于**对话框，包含版本、联系方式、许可证和隐私承诺。

### 变更 {#changed}

- 横幅和会话摘要的抑制现在也包括 `tui` 模式，这样对话框不会和日志输出互相干扰。

## 1.2.2 — 2026-05-10 {#122--2026-05-10}

### 修复 {#fixed}

- 一些小的 bug 修复和内部稳定性改进。

## 1.2.1 — 2026-05-10 {#121--2026-05-10}

把 1.2.0 的闲置关卡扩展到所有属于*工具*而不是可再生缓存的东西。删除这类东西现在需要**同时**满足：没有正在使用的软件依赖它，**并且**您在 `--days` 天内没有碰过它。

### 变更 {#changed}

- **Android AVD**——以前确认后会把 `~/.android/avd` 整个清空。现在每个 `*.avd` 目录作为一个整体检查，与同级的 `*.ini` 配对，只有当配置中的每个文件都闲置超过阈值时才会清理。最近使用过的模拟器配置会完整保留。
- **[VS Code / Cursor 已被取代的扩展](./modes/editor-extensions.md)**——“存在更新版本”的检查满足了第一个条件；现在被取代的目录*还*必须闲置超过阈值。最近加载过的旧版本会被列出但保留，并显示每个版本的闲置天数。
- **Flatpak 用户数据**——`~/.local/share/flatpak` 存放的是已安装的用户级应用，而不只是缓存。只要装有任何用户级应用，该模块现在就拒绝触碰这棵目录树，并且还要求整棵树闲置超过阈值。它会提示更安全的做法：`flatpak uninstall --user --unused`。

### 新增 {#added}

- `newest_access_age_days <path>`——返回某个路径下任何位置最新的 `atime`/`mtime` 距今的天数。
- `prune_stale_units <root> <days> [glob]`——把每个顶层子项视为不可分割的整体，这样部分清理不会破坏状态。

### 原因 {#why}

一位用户指出，1.2.0 仍会把 Android AVD 整个清空，而同样的道理应该适用于所有属于工具而非缓存的东西：不要删除其他工具依赖的软件，也不要删除用户自己最近用过的软件。

## 1.2.0 — 2026-05-10 {#120--2026-05-10}

**默认的删除策略变成了只删长期未用的。** 目标缓存中的内容，只有当其文件在 `--days` 天内（默认 100 天）都没被碰过——`atime` 和 `mtime` 都算——才会被删除。

### 变更 {#changed}

- **`clean_target`，也就是所有缓存模块共用的清理函数，现在是修剪而不是整个清空。** 它只删除超过阈值的文件，然后清掉空目录。最近使用的文件会保留，目录外壳也保留，这样工具仍能找到它们的目录结构。
- **[`--all-safe`](./modes/all-safe.md) 也按目标同样地修剪**，其摘要会按目标报告释放的字节**和**保留的字节。
- **npm 缓存清理遵循闲置关卡**，而不是总是运行完全不看时间的 `npm cache clean --force`。
- 运行前的横幅会说明当前的策略——“prune ≥Nd”或“FULL PURGE”。

### 新增 {#added}

- **`--purge-all`** 恢复 1.2.0 之前清空一切的行为，文档中写明了其中的取舍。
- **`prune_stale <root> <days>`**——一个供模块使用的公共辅助函数：拒绝受保护的路径，只删除两个时间戳都超过阈值的文件，清掉空目录，并报告释放的字节数。

### 原因 {#why}

1.1.0 的默认行为是确认后删除整个缓存目录树。这对很快就能重新生成的 `~/.cache/yarn` 是对的，对 `~/.gradle/wrapper/dists/` 就错了——那是一个您下个月可能真的需要的 230 MB 下载。

100 天的阈值干净地区分了“我最近碰过、删了会想念”和“我三个月都没打开过”。高级用户仍然可以强制使用旧行为，或用 `-d 30` 让关卡更严。

## 1.1.0 — 2026-05-10 {#110--2026-05-10}

安全加固版本。彻底杜绝全局安装的包和 shell 初始化文件被触碰的可能。

### 修复 {#fixed}

- **pnpm 全局包曾被清空。** 对 pnpm 内容存储的清理以 `~/.local/share/pnpm`（`PNPM_HOME`）为目标——而那里存放着全局安装的包、bin 垫片，以及 `pnpm setup` 安装的 `pnpm` 二进制文件本身。现在它只以 `~/.local/share/pnpm/store` 为目标，也就是可再生的内容寻址缓存。

  受影响的有 `--all-safe`、菜单选项 3、扫描、引导流程和 `--list-targets`。

### 新增——安全保护 {#added--safety-guards}

- **[`PROTECTED_EXACT`](./reference/protected-paths.md#exact-match-protected-paths)**——对软件包管理器安装目录和运行时主目录的精确匹配保护：pnpm、npm、yarn、bun、deno、volta、nvm、fnm、cargo、rustup 和 Go。
- **[`PROTECTED_BASENAMES`](./reference/protected-paths.md#protected-basenames)**——拒绝任何文件名是 shell 初始化或历史文件的路径，无论它在哪里。
- **`--all-safe` 启动时的断言**：一旦有受保护的运行时目录混进目标清单，就以 `BUG:` 信息中止，防止悄无声息的倒退。

### 新增——bun 和 deno 支持 {#added--bun-and-deno-coverage}

- bun：清理 `~/.bun/install/cache` 中的缓存；保护 `~/.bun/install/global`。
- deno：清理 `~/.cache/deno` 中的缓存；保护 `~/.deno/bin`。
- 两者都接入了 `--all-safe`、`--scan` 和新的全局包检查。

### 新增——模式 {#added--modes}

- **[`--globals`](./modes/globals-audit.md)**——只读的检查，列出 npm、pnpm、yarn、bun 和 deno 中直接安装的全局包，把每个标记为 `recently used`、`needed by: <pkg>` 或 `STALE — safe to uninstall`，并打印可直接复制的卸载命令。**从不删除任何东西。** 即使软件包管理器的命令不在 `PATH` 中也能工作。
- **[`--doctor`](./modes/doctor.md)**——检测磁盘上存在却没有接入 shell 初始化的运行时（nvm、pnpm、bun、deno、cargo），并提议追加标准的配置块。**只追加，且需确认。从不删除或修改已有的行。**

### 变更 {#changed}

- `--all-safe` 会明确打印“globals are PRESERVED”和“shell-init files are NEVER touched”的提示。

## 1.0.0 — 2026-05-09 {#100--2026-05-09}

首次公开发布。

### 分发 {#distribution}

- 发布到 npm——可以通过 `npx linux-cleanup` 或 `npm install -g linux-cleanup` 运行。软件包附带一个轻量的 Node 启动器，负责找到 bash 入口，并把日志和记录放到 `~/.linux-cleanup/`，这样它们不会随 npx 临时目录被清除而丢失。
- 也支持直接 `git clone`，输出保留在克隆目录内。

### 功能 {#features}

- **十步引导流程**作为默认模式，带进度标题、`a` / `s` / `q` 提示、每一步释放的字节数和累计总数。
- **基于白名单的安全**——拒绝精心整理的受保护清单中的任何路径，以及光秃秃的 `$HOME` 和 `/`。
- **个人数据只能交互式处理**——从不批量处理，也不能用 `--yes`。
- **清理类别**——软件包管理器缓存（yarn、npm、pnpm、pip、composer）；应用缓存（Chrome、Firefox、Brave、Chromium、Edge、Vivaldi、Gradle、Cypress、Playwright、TypeScript、Zoom）；开发工具（Android AVD、pub-cache、Dart、flatpak）；编辑器扩展；长期未用的 `node_modules`；未完成的下载和长期未用的个人文件；需要 sudo 的系统清理。
- **会话记录**——每次运行都会写入标准 JSON，并可按需导出 Markdown 和 HTML。HTML 使用能适应深色模式的内嵌 CSS。
- **[报告管理器](./modes/reports.md)**（`--reports`）和非交互式的 `--export FMT ID`。
- **自检**（`--self-test`）：验证依赖、每个 shell 文件的语法和安全保护是否正常——断言对 `/`、`$HOME`、`~/Documents` 和 `/etc` 的保护返回 true。
- **`--feedback`** 和 **`--debug-bundle`**，用于结构化的 bug 报告。
- **隐私**——零网络请求。没有遥测、分析或崩溃上报。唯一离开您机器的数据，是您自己选择通过邮件发送的内容。
- **每个产物都带署名**——日志以自带出处的开头开始，记录带有顶层的 `credits` 块，HTML 输出的页脚有署名。
- **设置辅助**——`--install-alias`、`--install-cron` 以及对应的卸载命令。
- 支持 `NO_COLOR` 和 `--no-color`。

### 安全与防护加固 {#security-and-safety-hardening}

- HTML 输出通过 `jq` 的 `@html` 过滤器转义所有来自 JSON 的值，防止格式错误的记录造成注入。
- 每个可选依赖（`snap`、`crontab`、`xdg-open`、`jq`）都有 `command -v` 检查。
- `realpath -m` 在任何受保护路径检查之前解析符号链接，所以符号链接无法绕过白名单。

## 上游 {#upstream}

权威的更新日志在[源码仓库](https://github.com/aoneahsan/linux-cleanup/blob/main/CHANGELOG.md)中。
