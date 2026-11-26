---
sidebar_position: 7
title: アンインストール
description: デスクトップアプリ、そのスケジュール、コンピューターに残すものを取り除きます。
---

# アンインストール

## まずスケジュールを取り除く {#remove-the-schedules-first}

スケジュールは systemd のユーザータイマーで、アプリの外で CLI のコピーを実行します。アプリを取り除いてもスケジュールは**消えません**。アンインストールの前に **スケジュール** の画面で 1 つずつ削除するか、ターミナルで次を実行してください。

```bash
systemctl --user disable --now 'linux-cleanup-schedule-*.timer'
rm -f ~/.config/systemd/user/linux-cleanup-schedule-*.{timer,service}
systemctl --user daemon-reload
```

## アプリを取り除く {#remove-the-app}

| インストール方法 | 取り除き方 |
|---|---|
| AppImage | `.AppImage` ファイルを削除し、メニューの項目も削除: `rm ~/.local/share/applications/linux-cleanup-desktop.desktop ~/.local/share/icons/hicolor/*/apps/linux-cleanup-desktop.png` |
| `.deb` | `sudo apt remove linux-cleanup` |

## 残るもの {#what-stays-behind}

| フォルダー | 中身 | 削除してよい場合 |
|---|---|---|
| `~/.linux-cleanup/` | レポート、ログ、スケジュール実行の出力、スケジュール用の CLI のコピー。ターミナルの CLI も同じフォルダーを使います | CLI も使わなくなった場合 |
| `~/.local/share/com.aoneahsan.linuxcleanup/` | アプリの設定、レシート、このコンピューターのランダムな端末 ID | アンインストール後ならいつでも安全 |

サインインしたアカウントは、アプリを取り除いても残ります。アンインストールの前に **アカウント** から削除してください。削除すると、アカウントと同期した数値がサーバーから消えます。
