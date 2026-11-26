---
title: 长期未用的 node_modules 查找
description: 在 N 天或更久没有动过的项目中查找 node_modules 目录，并以交互方式删除。在开发者的机器上，这往往是回收空间最多的一项。
tags: [node-modules, projects, interactive, disk-space, modes]
sidebar_position: 8
---

# 长期未用的 node_modules 查找

**`--node-modules` 会在您 `--days` 天或更久没有动过的项目中查找 `node_modules` 目录，并逐个提供删除选项。** 可回收的空间取决于这台机器上的项目。

```bash
linux-cleanup --node-modules          # 默认 100 天
linux-cleanup --node-modules -d 90
```

## 仅限交互式 {#interactive-only}

这个模式需要逐个项目确认，并**忽略 `--yes`**。它不属于 [`--all-safe`](./all-safe.md)，无法无人值守运行。见[关卡 3](../safety/guards.md#guard-3--personal-data-is-interactive-only)。

## 它查找什么 {#what-it-looks-for}

它会在您的项目根目录中扫描 `node_modules` 目录，条件是所属项目闲置超过阈值，并报告每个目录的大小和闲置天数。已列出目录内部嵌套的 `node_modules` 不会单独计算。

项目根目录可以通过 `$XDG_CONFIG_HOME`（默认 `~/.config`）下的 `project-roots.txt` 配置。见[环境变量](../reference/environment-variables.md)。

## 为什么这通常是安全的 {#why-this-is-usually-safe}

`node_modules` 是开发者机器上最可靠可再生成的东西——`yarn install` 或 `npm install` 会根据锁文件重建它。

全部接受之前，有两点值得知道：

:::caution 这样做仍可能让您付出代价的两种情况
**打过补丁的依赖。** 如果您直接修改了 `node_modules` 里的文件，而不是通过 `patch-package` 或 yarn patch，那个修改在别处并不存在。它不在任何仓库里，也不在您的锁文件里。

**没有锁文件，没有网络。** 重新安装需要能访问软件包仓库，并且锁文件存在。没有提交锁文件的项目，解析出来的依赖树可能不一样——而隔离网络的机器可能根本无法解析。
:::

这两种情况都不常见，工具也都检测不到。如果列表中的某个项目属于其中之一，就拒绝它。

## 它不会触碰什么 {#what-it-does-not-touch}

- 项目源代码——只删除其中的 `node_modules` 目录
- 锁文件、`package.json` 或项目中的其他任何东西
- 在阈值内动过的项目
- [受保护路径列表](../reference/protected-paths.md)上的任何内容

## 激进地回收 {#reclaiming-aggressively}

```bash
linux-cleanup --node-modules -d 30
```

降低阈值会扩大候选列表。在 30 天时，您会开始看到自己偶尔还在做的项目，所以请阅读列表而不是整批接受——出错的代价是重新安装，虽然不大，但也不是零。

## 在引导流程中 {#in-the-walkthrough}

它作为[引导流程](./walkthrough.md)的第 5 步运行，同样逐个项目询问。

## 接下来 {#next}

- [回收最多的空间](../guides/reclaim-the-most-space.md)
- [安全防护](../safety/guards.md)
