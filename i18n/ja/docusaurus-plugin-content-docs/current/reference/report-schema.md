---
title: レポートのスキーマ
description: linux-cleanup のガイド付きの手順が書き出す JSON の構造。credits、meta、disk、memory、steps、totals。
tags: [json, schema, reports, parsing, jq, reference]
sidebar_position: 7
---

# レポートのスキーマ

**ガイド付きの手順は `"schema_version": 1` の JSON 記録を書き出します。** `--no-report` か `--dry-run` を付けた場合は書きません。単独の `--scan` はこのレポートを書きません。機械で読めるスキャン結果がほしい場合は `--scan --json-events` を使ってください。こちらは構造が異なります。

:::warning 古いドキュメントは別の構造を説明しています
ソースのリポジトリ内の参照ページを含む一部の資料は、`schema`（`linux-cleanup/report/v1` のような文字列）を中心に、`tool`、`session`、`categories` のオブジェクトを持つ形を説明しています。

**ツールはその形を出力しません。** それに合わせて書いたパーサーは、実際のファイルではすべて失敗します。下の構造が、`modules/walkthrough.sh` が実際に書き出すものです。自分のマシンで確認してください。

```bash
jq 'keys' "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```
:::

## 最上位 {#top-level}

```json
{
  "schema_version": 1,
  "credits": { },
  "meta":    { },
  "disk":    { "before": {}, "after": {} },
  "memory":  { "before": {}, "after": {} },
  "steps":   [ ],
  "totals":  { }
}
```

| キー | 型 | 中身 |
|---|---|---|
| `schema_version` | 数値 | 現在は `1`。知らない値は受け付けないでください |
| `credits` | オブジェクト | ツールの情報、ライセンス、作者 |
| `meta` | オブジェクト | セッションの状況。いつ、どこで、どのように、どの設定で |
| `disk` | オブジェクト | 前後のファイルシステムの使用量 |
| `memory` | オブジェクト | 前後のメモリの使用量 |
| `steps` | 配列 | 試みた手順ごとに 1 件 |
| `totals` | オブジェクト | セッションのまとめ |

## `credits` {#credits}

```json
{
  "tool": "linux-cleanup",
  "tool_version": "2.1.1",
  "tool_homepage": "https://linux-cleanup.aoneahsan.com",
  "tool_license": "MIT",
  "author": {
    "name": "Ahsan Mahmood",
    "email": "aoneahsan@gmail.com",
    "website": "https://aoneahsan.com",
    "linkedin": "https://linkedin.com/in/aoneahsan"
  }
}
```

記録がどこに渡っても出どころがわかるように入れています。あなたのマシンの情報は含みません。

## `meta` {#meta}

| キー | 型 | 中身 |
|---|---|---|
| `tool` | 文字列 | 常に `linux-cleanup` |
| `tool_version` | 文字列 | 記録を書いたバージョン。受け取る側の処理はこれを基準にしてください |
| `started_at` | 文字列 | セッション開始の時刻 |
| `finished_at` | 文字列 | セッション終了の時刻 |
| `duration_seconds` | 数値 | 実際にかかった時間 |
| `host` | 文字列 | `hostname` の出力 |
| `user` | 文字列 | `$USER` |
| `mode` | 文字列 | 実行したモード（`walkthrough`、`scan`、`allsafe`、`system` など） |
| `stale_days` | 数値 | 適用された `--days` のしきい値 |
| `log_file` | 文字列 | このセッションのログの絶対パス |
| `launcher` | 文字列 | 起動のしかた。直接実行なら `bash` |
| `via_npx` | 数値 | npm のランチャー経由なら `1`、それ以外は `0` |

`stale_days` は残しておく価値があります。100 日で整理した回と `-d 30` で実行した回の違いがわかり、同じマシンの 2 つのセッションで取り戻せた量が違う理由も説明できます。

## `disk` と `memory` {#disk-and-memory}

どちらも、セッションの開始時と終了時に取った `before` と `after` の値を持ちます。

`disk` には `df` から得たファイルシステムの項目（ファイルシステム、サイズ、使用量、空き、使用率）が入ります。`memory` にはシステムのメモリ情報から得た同様の値が入ります。

:::note `after` から `before` を引いた値は、掃除の結果だけではありません
これはマシン全体の測定値です。セッション中のビルド、パッケージの更新、ブラウザーの動作でも変わるので、報告される取り戻した量は手順の合計より少なくなったり、マイナスになったりすることがあります。[トラブルシューティング](../troubleshooting.md#disk-usage-grew-during-the-session)を参照。
:::

## `steps` {#steps}

試みた手順ごとに 1 件ずつ、順番に並んだ配列です。

```json
{ "n": 1, "title": "Package-manager caches", "status": "ran", "freed_bytes": 13315108864 }
```

| キー | 型 | 中身 |
|---|---|---|
| `n` | 数値 | 1 から始まる手順の番号 |
| `title` | 文字列 | 人が読める手順の名前 |
| `status` | 文字列 | `ran`、`skipped`、`skipped (quit)`、`skipped (jq missing)` のいずれか |
| `freed_bytes` | 数値 | この手順で取り戻したバイト数。飛ばした場合は `0` |

`skipped (quit)` は `q` を押したあとの手順を表します。意図して止めたのか、手順を 1 つずつ断ったのかを区別するのに役立ちます。

## `totals` {#totals}

| キー | 型 | 中身 |
|---|---|---|
| `total_reclaimed_bytes` | 数値 | 全手順の合計 |
| `total_reclaimed_human` | 文字列 | 同じ値を読みやすく整えたもの |
| `steps_run` | 数値 | 状態が `ran` の手順の数 |
| `steps_skipped` | 数値 | 状態が `skipped` 系の手順の数 |

## 読み取り {#parsing}

```bash
LATEST="$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

jq '.totals.total_reclaimed_human' "$LATEST"
jq '.meta | {mode, stale_days, duration_seconds}' "$LATEST"
jq '.steps[] | select(.status == "ran") | "\(.title): \(.freed_bytes)"' "$LATEST"

# 記録にあるすべてのセッションの合計
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## 検証 {#validating}

ツールには JSON Schema のファイルは付いていません。構造の確認：

```bash
jq -e 'has("schema_version") and .schema_version == 1
       and has("meta") and has("steps") and has("totals")' \
  ~/.linux-cleanup/reports/report-*.json
```

有効なファイルごとに `true` を表示します。

## 互換性の指針 {#compatibility-guidance}

受け取る側を書くときは：

- **`schema_version` で分岐してください。** 知らない値は推測せず、読み取れないものとして扱います
- **知らないキーは追加されたものとして扱ってください。** バージョン 1 の中でも項目は追加されてきましたし、今後もありえます
- **`meta.tool_version` を使ってください。** リリースによって動きが違う部分に役立ちます
- **すべてのモードがすべての項目を埋めるとは限りません。** 読み取り専用のモードでは手順が少なくなります
- **`total_reclaimed_bytes` がときどきマイナスになることを想定してください。** 削除量の合計ではなく `df` の差です

## 次へ {#next}

- [レポート](../modes/reports.md) — 表示と書き出し
- [出力先のパス](./output-paths.md) — ファイルの置き場所
