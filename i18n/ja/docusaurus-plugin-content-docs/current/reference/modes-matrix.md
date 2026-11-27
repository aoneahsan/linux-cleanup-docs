---
title: モードの対照表
description: linux-cleanup のすべてのモードを並べて比較。削除するか、対話式か、sudo を使うか、セッション記録を書くか。
sidebar_position: 2
---

# モードの対照表

すべてのモードをひと目で確認できます。ページ全体を読まずに「これは何か削除するのか」に答えるときに使ってください。

## 対照表 {#the-matrix}

| モード | フラグ | 削除 | 対話式 | sudo | 記録を書く |
|---|---|---|---|---|---|
| [ガイド付きの手順](../modes/walkthrough.md) | _（なし）_ `-w` | あり | あり | 手順 8 のみ | あり |
| [メニュー](../modes/menu.md) | `-m` | あり | あり | 選んだ場合 | なし |
| [TUI](../modes/tui.md) | `-t` | あり | あり | 選んだ場合 | なし |
| [完全安全](../modes/all-safe.md) | `-a` | あり | `-y` なしの場合 | なし | なし |
| [スキャン](../modes/scan.md) | `-s` | **なし** | なし | なし | なし |
| [使われていない個人ファイル](../modes/personal-stale-files.md) | `-p` | あり | **常に** | なし | なし |
| [システム](../modes/system-cleanup.md) | `--system` | あり | あり | **あり** | なし |
| [途中のダウンロード](../modes/partial-downloads.md) | `--partials` | あり | **常に** | なし | なし |
| [ホームの監査](../modes/home-audit.md) | `--audit` | **なし** | なし | なし | なし |
| [node_modules](../modes/node-modules-finder.md) | `--node-modules` | あり | **常に** | なし | なし |
| [グローバルパッケージの監査](../modes/globals-audit.md) | `--globals` | **なし** | なし | なし | なし |
| [Doctor](../modes/doctor.md) | `--doctor` | **なし** — 追記のみ | あり | なし | なし |
| [エディター拡張機能](../modes/editor-extensions.md) | `--editor-ext` | あり | あり | なし | なし |
| [速度](../modes/speed.md) | `--speed` | ファイルは削除しない。任意の設定変更 | あり | なし | なし |
| [レポート](../modes/reports.md) | `--reports` | 記録のみ | あり | なし | なし |
| 書き出し | `--export` | **なし** | なし | なし | なし |
| フィードバック | `--feedback` | **なし** | あり | なし | なし |
| デバッグ用バンドル | `--debug-bundle` | **なし** | なし | なし | なし |
| 対象の一覧 | `--list-targets` | **なし** | なし | なし | なし |
| セルフテスト | `--self-test` | **なし** | なし | なし | なし |
| バージョン | `-V` | **なし** | なし | なし | なし |
| エイリアスの導入 | `--install-alias` | **なし** | あり | なし | なし |
| cron の導入 | `--install-cron` | **なし** | あり | なし | なし |
| デスクトップアプリの更新 | `--refresh-app` | リリースからアプリを更新 | あり | なし | なし |
| エイリアスの削除 | `--uninstall-alias` | エイリアスの行 | あり | なし | なし |
| cron の削除 | `--uninstall-cron` | cron の行 | あり | なし | なし |

## 何も削除しないモード {#modes-that-never-delete-anything}

次のコマンドはクリーンアップの対象を削除しません。ローカルのログ、レポート、書き出し、診断用バンドルを書くものはあります。

`--scan` · `--audit` · `--globals` · `--list-targets` · `--self-test` · `--version` · `--export` ·
`--feedback` · `--debug-bundle`

`--doctor` もここに入りますが、注意点があります。シェルの設定を変更しますが、確認のあとで**追記**するだけです。既存の行を削除したり書き換えたりすることはありません。

## `--yes` が効くモード {#modes---yes-affects}

1 つだけです：[`--all-safe`](../modes/all-safe.md)。

個人データを扱う対話式のモード（`--stale`、`--partials`、`--node-modules`）は、それぞれ独自の確認を求めます。[関門 3](../safety/guards.md#guard-3--personal-data-is-interactive-only)を参照。

## アイドルの関門が適用されるモード {#modes-the-staleness-gate-applies-to}

| 適用される | 適用されない |
|---|---|
| ガイド付きの手順、メニュー、TUI、完全安全でのキャッシュの整理 | `--system`（`/tmp` に独自の固定 7 日ルールを使う） |
| `--editor-ext` での古いバージョンの置き換え | `--partials`（経過時間は基準ではない） |
| `--node-modules` | 読み取り専用のモード（何も削除しない） |
| `--stale` |  |
| 開発ツールのデータ（AVD、flatpak、pub-cache） |  |

`--purge-all` は、本来なら関門が適用される場所でそれを無効にします。

## 任意の依存関係が必要なモード {#which-modes-need-optional-dependencies}

| モード | 必要なもの | ない場合 |
|---|---|---|
| `--tui` | `whiptail` または `dialog` | 導入方法の案内を出して `--menu` に切り替える |
| `--export`、`--reports` の変換 | `jq` | JSON は書き出すが、変換はできない |
| `--install-cron` | `crontab` | 実行できない |
| `--system` の snap の手順 | `snap` | その手順をきれいに飛ばす |
| `--system` の apt の手順 | `apt`、`dpkg` | **失敗する** — [Debian/Ubuntu のみ](../distro-support.md) |

## 次へ {#next}

- [CLI のフラグ](./cli-flags.md) — 各フラグの詳細
- [モードの概要](../modes/overview.md) — 目的別
