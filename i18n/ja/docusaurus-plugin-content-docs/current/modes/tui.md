---
title: TUI（ビジュアルメニュー）
description: linux-cleanup 1.3.0 で加わった whiptail または dialog によるビジュアルメニュー。どちらもない場合は CLI メニューに切り替わります。
sidebar_position: 5
---

# TUI（ビジュアルメニュー）

**`--tui` は、カテゴリーのメニューを whiptail か dialog の全画面表示で表示します。** [1.3.0](../changelog.md#130--2026-05-10) で追加しました。動作は [`--menu`](./menu.md) と同じで、見た目が異なります。

```bash
linux-cleanup --tui      # または: -t, -g, --gui
```

## 動き方 {#how-it-behaves}

項目を選ぶと画面を抜け、そのカテゴリーを通常の CLI の出力と確認で実行し、終わるとメニューに戻ります。つまり画面は起動役にすぎず、実際の確認はいつものテキストのプロンプトで、安全装置もすべてそのままです。

TUI には**About** 画面もあり、バージョン、連絡先、ライセンス、プライバシーへの約束を表示します。

## 必要なものと代替 {#requirements-and-fallback}

`whiptail` か `dialog` が必要です。どちらもない場合は、ディストリビューションに合わせたインストールの案内を表示し、通常の CLI メニューに切り替わります。失敗はしません。

```bash
sudo apt install whiptail     # Debian / Ubuntu
sudo dnf install newt         # Fedora / RHEL
sudo pacman -S libnewt        # Arch
```

RPM 系と Arch では `whiptail` は `newt` / `libnewt` のパッケージに含まれるため、パッケージ名とコマンド名が一致しません。

:::note ツールがディストリビューションを判定するのはここだけです
上のインストール案内はディストリビューションに合わせて変わります。linux-cleanup のほかの部分はそうではありません。とくに [`--system` は Debian/Ubuntu を前提にしています](../distro-support.md)。
:::

## 通常のメニューを使うべきとき {#when-to-use-the-plain-menu}

`--tui` には全画面の表示ができるターミナルが必要です。制限のある接続、CI のログの中、TTY のない `ssh -T` のセッションでは、bash だけで動く [`--menu`](./menu.md) を使ってください。

## 次へ {#next}

- [メニュー](./menu.md) — テキスト版
- [モードの概要](./overview.md)
