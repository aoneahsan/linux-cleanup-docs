---
title: ガイド付きの手順（既定）
description: linux-cleanup の既定のモード。すべてのクリーンアップのカテゴリーを 10 の手順でたどり、それぞれの前に確認し、累計と JSON のセッションレポートを残します。
tags: [walkthrough, default, interactive, guided, modes]
sidebar_position: 2
---

# ガイド付きの手順（既定）

**`linux-cleanup` をフラグなしで実行すると、ガイド付きの手順が始まります。10 の手順ですべてのクリーンアップのカテゴリーをたどり、どの手順も何かする前に確認します。** 対話式でこのツールを使うときのおすすめの方法です。

```bash
linux-cleanup          # または: linux-cleanup -w / --walkthrough
```

## 10 の手順 {#the-ten-steps}

| # | 手順 | 削除するもの | 補足 |
|---|---|---|---|
| 1 | パッケージマネージャーのキャッシュ | 再生成できるもの | yarn、npm、npx、pnpm、pip、composer、bun、deno |
| 2 | アプリケーションのキャッシュ | 再生成できるもの | ブラウザー、Gradle、Cypress、Playwright、Zoom、エディターの VSIX |
| 3 | 開発ツールのデータ | 使われていないものだけ | Android の AVD、pub-cache、Dart の解析、flatpak |
| 4 | エディターの古い拡張機能 | 未使用かつ置き換え済み | VS Code / Cursor |
| 5 | 使われていない `node_modules` | **対話式** | しきい値を超えて使われていないプロジェクト |
| 6 | 途中の・持ち主のないダウンロード | **対話式** | `.crdownload`、`.part`、`.fdmdownload` |
| 7 | 使われていない個人ファイル | **対話式** | `~/Downloads` と設定した個人のルートにある大きな未使用ファイル |
| 8 | システムのクリーンアップ（sudo） | システム | apt、ジャーナル、snap、`/tmp`、ページキャッシュ |
| 9 | 最終的なサイズの確認 | なし | 読み取り専用の要約 |
| 10 | 読みやすいレポートの作成 | なし | Markdown / HTML の書き出し — `jq` が必要 |

手順 5、6、7 が[対話式のみ](../safety/guards.md#guard-3--personal-data-is-interactive-only)の手順です。自動で承認することはできず、ツール全体で本当にかけがえのないものを消しうるのは手順 7 だけです。

## 確認のしくみ {#how-the-prompts-work}

確認は 2 段階です。

**手順ごと**に、カテゴリー全体をどうするかを選びます。

| キー | 動作 |
|---|---|
| `a` | この手順を実行。既定の選択で、Enter キーで選べます |
| `s` | この手順をまるごとスキップ |
| `q` | ここまでの進み具合を残してすぐに終了 |

**対象ごと**には、実行を選んだ手順の中で、各項目に `[Y/n]` または `[y/N]` の確認があります。大文字が既定の答えです。

つまり、手順で `a` を選んでも、その中のすべてを削除することにはなりません。対象を 1 つずつ見て答えます。

## 累計 {#running-totals}

実行した手順ごとに、測定した変化とその時点までのセッションの合計を表示します。

最後の要約には、実行前後のディスクの空き容量が出ます。この値は `df` で測るため、マシンで起きていることがすべて反映されます。セッション中にビルドが動いていれば、表示される回収量が手順ごとの合計より少なくなったり、マイナスになったりすることもあります。不具合ではありません。[トラブルシューティング](../troubleshooting.md#disk-usage-grew-during-the-session)を参照。

## 途中でやめる {#quitting-early}

どの手順の確認でも `q`、またはいつでも `Ctrl-C` で、セッションをきれいに終えられます。

- それまでの削除は元に戻りません。中断前にどの手順を試みたかはログで確認してください
- `Ctrl-C` はコード `130` で終了します。[クラッシュ時の処理はこれを意図して無視する](../reference/exit-codes.md#how-the-crash-trap-decides)ので、クラッシュ用のバンドルは作られません
- たどり着かなかった手順は、レポートにスキップとして記録されます

## セッションレポート {#the-session-report}

ガイド付きの手順は、`--no-report` か `--dry-run` を付けない限り、JSON レポートを `~/.linux-cleanup/reports/report-<timestamp>.json` に書き出します。手順ごとの状態と解放したバイト数、実行前後のディスクとメモリ、セッションの合計が入ります。フィールドの一覧：[レポートのスキーマ](../reference/report-schema.md)。

手順 10 では、必要に応じて Markdown と HTML に変換します。この手順には `jq` が必要で、ない場合は `skipped (jq missing)` と記録され、JSON は書き出されます。

```bash
linux-cleanup --no-report    # JSON を作らない。ログは書き出す
```

## 組み合わせると便利なオプション {#options-worth-combining}

```bash
linux-cleanup -d 30          # しきい値を 100 日ではなく 30 日に
linux-cleanup --purge-all    # アイドルしきい値を完全に無効にする
linux-cleanup --no-color     # 装飾なしの出力
linux-cleanup --cleanup-logs # 終了時にこの回のログを削除
```

:::danger `--purge-all` を使うと手順 1〜4 で削除するものが変わります
[アイドルしきい値](../safety/guards.md#guard-2--the-staleness-gate)を無効にすると、キャッシュの手順は使われていないファイルを間引くのではなく、対象を丸ごと消去します。まだ使うかもしれない Gradle wrapper のディストリビューション、Playwright のブラウザー、Cypress のバイナリも含まれます。どの方針が有効かは実行前のバナーに表示されます。
:::

## ほかのモードを使うべきとき {#when-to-use-something-else}

| 状況 | より合うモード |
|---|---|
| カテゴリーを 1 つだけ扱いたい | [メニュー](./menu.md)または [TUI](./tui.md) |
| 無人、または cron で | `-y` を付けた[完全安全](./all-safe.md) |
| 削除せずに見るだけにしたい | [スキャン](./scan.md) |
| これのビジュアル版がほしい | [TUI](./tui.md) |

## 次へ {#next}

- [スキャン](./scan.md) — まずこれを実行
- [完全安全](./all-safe.md) — 無人で使う同等のモード
- [レポート](./reports.md) — 出力の読み方
