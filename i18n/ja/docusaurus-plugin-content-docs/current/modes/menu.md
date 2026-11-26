---
title: メニュー
description: ガイド付きの手順全体ではなく、linux-cleanup のカテゴリーを 1 つずつ実行できる番号付きメニュー。
tags: [menu, interactive, modes]
sidebar_position: 4
---

# メニュー

**`--menu` は全カテゴリーを番号付きで一覧にし、選んだものを実行します。** やりたいことが決まっていて、10 手順の案内が不要なときに使います。

```bash
linux-cleanup --menu     # または: -m, -i, --interactive
```

## ガイド付きの手順との違い {#how-it-differs-from-the-walkthrough}

| | メニュー | [ガイド付きの手順](./walkthrough.md) |
|---|---|---|
| 順番 | 自分で選ぶ | 固定の 10 手順 |
| 範囲 | 1 回の選択で 1 カテゴリー | すべてを順に |
| 繰り返し | 終わるとメニューに戻る | 最後まで進む |
| レポート | 操作ごと | セッションで 1 つ |
| 向いている用途 | 狙いを絞ったクリーンアップ | 初回の実行、まとめての掃除 |

安全モデルは同じです。各カテゴリーはガイド付きの手順のときとまったく同じように動き、[パスの許可リスト](../safety/guards.md#guard-1--the-path-allowlist)、[アイドルしきい値](../safety/guards.md#guard-2--the-staleness-gate)、対象ごとの確認がすべて適用されます。メニューから個人データのカテゴリーを選んでも項目ごとに確認があり、`--yes` は引き続き効きません。

## オプションはそのまま使える {#options-still-apply}

```bash
linux-cleanup --menu -d 30        # 選んだものに 30 日のしきい値
linux-cleanup --menu --purge-all  # アイドルしきい値をオフ
linux-cleanup --menu --no-color   # 装飾なしの出力
```

## TUI を使うべきとき {#when-to-use-the-tui-instead}

[`--tui`](./tui.md) は同じメニューを whiptail か dialog の画面で表示します。どちらかのインストールが必要です。`--menu` は bash だけで動き、簡素なターミナルや、全画面の表示が崩れる `ssh -T` のセッションなど、どんな接続でも使えます。

## 次へ {#next}

- [TUI](./tui.md) — ビジュアル版
- [モードの概要](./overview.md) — メニューに並ぶ全カテゴリー
