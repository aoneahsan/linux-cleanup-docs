---
sidebar_position: 2
title: 安装与更新
description: 以 AppImage 或 .deb 安装 linux-cleanup 桌面应用，以及它如何自我更新。
---

# 安装与更新

从[下载页面](https://linux-cleanup.aoneahsan.com/download)下载当前版本；每个版本也会以 `desktop-v<version>` 标签发布在 [GitHub Releases](https://github.com/aoneahsan/linux-cleanup/releases) 上。每个版本都带有两个安装包：

| 文件 | 适用于 |
|---|---|
| `linux-cleanup_<version>_amd64.AppImage` | 任何有桌面会话的发行版。赋予可执行权限后运行 |
| `linux-cleanup_<version>_amd64.deb` | Debian、Ubuntu 及其衍生版 (`sudo apt install ./linux-cleanup_<version>_amd64.deb`) |

```bash
chmod +x linux-cleanup_*_amd64.AppImage
./linux-cleanup_*_amd64.AppImage
```

从 1.0.4 版起，AppImage 会在第一次运行时把自己加入应用菜单：它会写入 `~/.local/share/applications/linux-cleanup-desktop.desktop`，在 `~/.local/share/icons/hicolor/` 下放置图标，并让菜单项指向文件所在的位置。如果您移动了 AppImage，从新位置运行一次，菜单项就会跟过去。`.deb` 会安装自己的菜单项。

桌面应用需要 WebKitGTK 4.1 和 GTK 3，当前的桌面发行版都自带。`.deb` 把它们声明为依赖。

## 它如何更新 {#how-it-updates}

应用会自我更新。它会在启动时、窗口重新显示时，以及新版本发布的那一刻检查是否有已签名的更新。开启 **自动安装更新**（默认开启）时，它会下载更新、验证签名，并在空闲时重新启动：运行进行中时绝不会。

**AppImage** 会被就地替换。**`.deb`** 安装通过 `dpkg` 更新，所以桌面会先要求输入管理员密码（常见的图形提示）；取消的话，当前版本会继续运行。

某个版本也可能被标记为**必需**：

- **紧急**版本会立即停止应用，说明原因，并只提供一个 **更新** 按钮；
- **普通**版本会提示有新版本，并从下次启动起变为必需。

如果检查时应用处于离线状态，它会照常继续；检查失败绝不会阻止运行。
