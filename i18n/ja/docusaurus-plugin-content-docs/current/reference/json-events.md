---
title: 機械で読めるイベント
description: ローカルのスキャンと対話なしの完全安全の実行で出力する、バージョン 1 の NDJSON イベント。
tags: [json, events, scan, dry-run, reference]
sidebar_position: 8
---

# 機械で読めるイベント

`--json-events` は、改行区切りの JSON を stdout に書き出します。人が読むテキストと確認は stderr に出し、そのローカルのコピーをセッションログに残します。出力はこのマシンにとどまりますが、ローカルの完全なパスが含まれることがあります。これを受け取る側は、それらのパスをアカウントや分析のデータとしてアップロードしないでください。

このフラグは `--scan` と `--all-safe --yes` に対応しています。完全安全の実行には `--yes` が必要で、機械のクライアントが確認で止まらないようにしています。`--dry-run` を加えると、ファイルを削除せずに完全安全の操作をプレビューできます。それでもローカルのログと更新チェックの状態は書き込まれることがあります。ほかのモードでは終了コード 2 を返します。

```bash
linux-cleanup --scan --json-events > scan.ndjson
linux-cleanup --all-safe --yes --dry-run --json-events > preview.ndjson
```

完全なイベントにはすべて `v: 1`、`type`、`ts`（Unix のミリ秒）があります。受け取る側は、より大きい `v` を拒否し、バージョン 1 では知らないフィールドを無視してください。モードの ID は文字列で、`scan` または `allsafe` です。

| イベント | フィールド | 意味 |
|---|---|---|
| `plan` | `version`, `dry_run`, `profile`, `sections[]` | 最初のイベント。選んだモードに対応するセクションが 1 つあります。セクションには `id`、`title`、`stamp`、`sudo`、`deep` があります。 |
| `disk` | `phase`, `total_kb`, `free_kb`, `purgeable_kb`, `snapshots`, `snapshot_note` | モードの前後のディスクの計測値。対応していない見積もりは `null`。 |
| `section_start` | `id`, `title`, `stamp` | 選んだモードが始まった。 |
| `item` | `id`, `path`, `kb`, `action`, `unique`, `age_days`, `reason` | 読み取り専用のスキャンの結果、またはクリーンアップの補助処理が選んだパス。`report` は読み取りのみ、`delete` はドライランでは予定の操作、本番では完了した操作、`skip` は拒否です。`kb` は KiB 単位で切り捨てます。 |
| `progress` | `id`, `done`, `total` | 選んだ 1 つのモードが 0/1 か 1/1 にある。モードの区切りで、ファイルごとの割合ではありません。 |
| `error` | `id`, `message` | CLI が報告した失敗または拒否。 |
| `section_result` | `id`, `status`, `freed_kb`, `items`, `reason` | 状態は `completed` か `failed`。CLI が自分の書き込みとほかのディスクの動きを区別できるまで、バイト数と項目数の合計は `null` のままです。 |
| `summary` | `attempted`, `completed`, `skipped`, `failed`, `freed_kb`, `disk_free_before_kb`, `disk_free_after_kb`, `elapsed_s`, `reports`, `log`, `dry_run` | モードが完了したあとの最後のイベント。2 つの空き容量の値は観測値で、このプロセスが取り戻したバイト数を示すものではありません。 |

完了した実行では、出力は `plan` で始まり `summary` で終わります。中断されたプロセスや、満たされなかった更新の要件では summary が残らないことがあります。その場合は未完了の実行として扱い、終了コードと stderr を使ってください。拒否された引数では、plan の前に `error` イベントを出して 2 で終了することがあります。フラグを付けなければ、これまでのテキスト出力と終了コードは変わりません。

イベントの出力は、ローカルの JSON セッションレポートを補うものです。ドライランではセッションレポートは書き出しません。受け取る側は `item.path` でローカルでの判断を説明し、そのあとはサーバーと同期せずに破棄できます。`--cleanup-logs` でセッションログを消した場合、`summary.log` は `null` です。
