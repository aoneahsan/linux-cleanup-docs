---
title: 出力先のパス
description: linux-cleanup がログ、JSON のセッション記録、デバッグ用バンドル、クラッシュ用バンドルを書く場所。構成、インストール方法ごとの既定値、保持期間、権限。
sidebar_position: 5
---

# 出力先のパス

**出力はすべて 1 つのデータのルートの下にまとまります。** どのルートになるかはインストール方法で決まり、どちらも上書きできます。

## 構成 {#layout}

```text
$DATA_HOME/
├── logs/
│   ├── cleanup-<YYYY-MM-DD_HHMMSS>.log     # セッションごとに 1 つ
│   └── cron.log                             # 毎週の cron が追記
├── reports/
│   ├── report-<YYYY-MM-DD_HHMMSS>.json     # ガイド付きの手順の記録（無効にしない限り）
│   ├── report-<YYYY-MM-DD_HHMMSS>.md       # --export md で作成
│   └── report-<YYYY-MM-DD_HHMMSS>.html     # --export html で作成
└── feedback/
    ├── debug-bundle-<YYYY-MM-DD_HHMMSS>.tar.gz   # --debug-bundle で作成
    └── crash-<YYYY-MM-DD_HHMMSS>.tar.gz          # クラッシュ時に自動で作成
```

## インストール方法ごとの既定値 {#per-install-defaults}

| インストール方法 | `$DATA_HOME` |
|---|---|
| `npx linux-cleanup` | `~/.linux-cleanup/` |
| `npm install -g linux-cleanup` | `~/.linux-cleanup/` |
| `git clone` | クローンのディレクトリそのもの |

この違いは意図したものです。`npx` は、いずれ消される一時的な npm キャッシュのディレクトリからパッケージを実行するので、そこに書いた出力は失われます。`~/.linux-cleanup/` は実行のたびに残ります。クローンはもともと永続的な場所なので、出力はソースのそばに置きます。

どちらも [`LINUX_CLEANUP_DATA_HOME`](./environment-variables.md) で上書きできます。ログと記録のディレクトリを個別に上書きすることもできます。

## 保持期間 {#retention}

| パス | 自動で削除 | 補足 |
|---|---|---|
| `logs/cleanup-*.log` | `--cleanup-logs` のときのみ | このフラグは終了時に**その回の**ログを削除します。過去のログは残ります |
| `logs/cron.log` | しない | ローテーションしません。大きくなったら自分でローテーションしてください |
| `reports/*.json` | **しない** | 長く残す監査の記録 |
| `reports/*.md`, `*.html` | **しない** | 必要なときに作り、必要なときに消す |
| `feedback/*.tar.gz` | **しない** | いつ不要になるかはあなたが決めます |

`--cleanup-logs` は、ツールが自分の出力に対して行う唯一の自動削除で、触れるのは `.log` ファイルだけです。

## サイズと保持 {#size-and-retention}

ログとバンドルの大きさは、その回のパスとイベントによって変わります。古い記録を消す前に、たまったものを確認してください。古いファイルを意図して減らすには：

```bash
find ~/.linux-cleanup/logs/    -name 'cleanup-*.log' -mtime +90 -delete
find ~/.linux-cleanup/reports/ -name 'report-*'      -mtime +90 -delete
```

cron のログのローテーション：

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## 権限 {#permissions}

ファイルの所有者はツールを実行したユーザーです。実際の権限はマシン上で `stat` を使って確認してください。ツールが設定するディレクトリの権限と、プロセスの umask の両方が影響します。中身を読まずにログやバンドルを共有しないでください。

## これらのファイルの中身 {#what-these-files-contain}

:::caution ログとバンドルにはあなたのパスが含まれます
セッションログには触れたパスがすべて記録されます。つまり、マシン上のディレクトリ名、プロジェクト名、ときには `~/Downloads` のファイル名も含まれます。

これらはローカルにだけあり、送信されることはありませんが、バンドルをメールで送る前には確認してください。

```bash
tar -tzf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz
```

[不具合を報告する](../guides/send-a-bug-report.md)を参照。
:::

ここにあるものに、ファイルの**中身**は含まれません。パス、サイズ、時刻だけです。起きたことの記録であり、削除したもののコピーではありません。[復旧](../recovery.md)を参照。

## 次へ {#next}

- [環境変数](./environment-variables.md) — これらの場所の上書き
- [レポートのスキーマ](./report-schema.md) — JSON の構造
