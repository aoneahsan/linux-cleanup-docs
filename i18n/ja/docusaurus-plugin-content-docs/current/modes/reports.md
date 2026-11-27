---
title: レポート
description: ガイド付きの手順では JSON のセッション記録を書き出せます。その記録の一覧表示、閲覧、Markdown や HTML への変換、書き出し。
sidebar_position: 15
---

# レポート

**ガイド付きの手順は JSON のセッション記録を** `~/.linux-cleanup/reports/report-<timestamp>.json` に書き出します。`--no-report` か `--dry-run` を付けた場合は書き出しません。ほかのモードではこの記録は作られません。既存の記録が自動で削除されることはありません。

Markdown と HTML は、必要なときに作る任意の変換です。

```bash
linux-cleanup --reports              # 対話式の管理
linux-cleanup --export both latest   # 対話なしの変換
```

## セッション記録の中身 {#what-a-session-record-contains}

| セクション | 内容 |
|---|---|
| `schema_version` | 現在は `1` |
| `credits` | ツールの名前、バージョン、ホームページ、ライセンス、作者の情報 |
| `meta` | タイムスタンプ、所要時間、ホスト、ユーザー、モード、アイドルしきい値、ログのパス、起動方法 |
| `disk` | 実行前後のファイルシステムの使用量 |
| `memory` | 実行前後のメモリの使用量 |
| `steps` | 手順ごとに 1 項目。番号、タイトル、状態、解放したバイト数 |
| `totals` | 取り戻した合計バイト数、読みやすい合計、実行した手順とスキップした手順 |

各フィールドの詳しい説明：[レポートのスキーマ](../reference/report-schema.md)。

## 対話式の管理 {#the-interactive-manager}

```bash
linux-cleanup --reports
```

過去のセッションを一覧にし、1 つを表示する、Markdown や HTML に変換する、HTML をブラウザーで開く、削除する、といった操作ができます。

`jq` がインストールされていないと変換の項目は表示されません。[後述](#jq-is-required-for-conversion)を参照。

## 書き出し {#exporting}

スクリプトや習慣向けに、対話なしで：

```bash
linux-cleanup --export both latest   # 最新の記録から Markdown と HTML
linux-cleanup --export html all      # すべての記録を HTML に
linux-cleanup --export md 3          # 3 番の記録を Markdown に
```

| 引数 | 指定できる値 |
|---|---|
| 形式 | `md`, `html`, `both` |
| 識別子 | 記録の番号、`latest`、`all` |

出力は JSON の隣に、ファイル名に同じタイムスタンプを付けて作られます。HTML は CSS を埋め込み、ダークモードに対応し、外部のリソースを使わない単体のファイルなので、そのままメールで送ったり保管したりできます。

## 変換には `jq` が必要 {#jq-is-required-for-conversion}

:::note JSON は必ず書き出されます。変換は任意の部分です
`jq` がなくても、ガイド付きの手順で JSON の記録は作れます。使えなくなるのは Markdown と HTML の書き出しだけで、手順 10 は `skipped (jq missing)` として記録されます。

```bash
sudo apt install jq      # Debian / Ubuntu
sudo dnf install jq      # Fedora / RHEL
sudo pacman -S jq        # Arch
```
:::

生成される HTML は、JSON から来る値をすべて `jq` の `@html` フィルターでエスケープするので、壊れた入力が表示されるページにマークアップを差し込むことはできません。

## JSON を直接問い合わせる {#querying-the-json-directly}

JSON はツールで読むためのものです。

```bash
# 最新のセッションで取り戻した合計
jq '.totals.total_reclaimed_human' ~/.linux-cleanup/reports/report-*.json | tail -1

# 最新のセッションで実際に実行した各手順
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

# 記録されたすべてのセッションでの合計
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## 保存期間 {#retention}

これらの記録が自動で削除されることは**ありません**。`--cleanup-logs` でも消えません。こちらが消すのは今回の実行のログファイルだけです。

自分で整理するには：

```bash
find ~/.linux-cleanup/reports/ -name 'report-*' -mtime +90 -delete
```

1 回の実行で記録を作らないようにするには `--no-report` を使います。ログは書き出されます。

## これは記録で、バックアップではありません {#these-are-records-not-backups}

:::danger セッション記録は手順の要約で、バックアップではありません
記録するのは手順とディスクの所見で、削除したファイルの完全な一覧ではありません。削除した内容は一切含まず、ここから何かを復元することもできません。意図しない削除のあとに役立つのは、自分のバックアップから何を戻すか、何を再ダウンロードするかを見極める手がかりになる点です。[復旧](../recovery.md)を参照。
:::

## 次へ {#next}

- [レポートのスキーマ](../reference/report-schema.md) — すべてのフィールド
- [出力パス](../reference/output-paths.md) — ファイルの保存先
- [復旧](../recovery.md) — 思わぬことが起きたあとのセッション記録の使い方
