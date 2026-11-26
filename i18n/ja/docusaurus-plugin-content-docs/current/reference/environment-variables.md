---
title: 環境変数
description: linux-cleanup が読むすべての環境変数と、その既定値と効果。出力先の上書き、色の制御、XDG の設定ファイルの探し方。
tags: [environment, variables, configuration, no-color, xdg, reference]
sidebar_position: 4
---

# 環境変数

**linux-cleanup が読む環境変数の一覧です。** すべて任意です。

| 変数 | 既定値 | 効果 |
|---|---|---|
| `NO_COLOR` | 未設定 | 空でない値なら何でも ANSI の色を無効にします。[no-color.org](https://no-color.org) の、多くのツールに共通する標準です。`--no-color` と同じです |
| `CLEANUP_NO_COLOR` | `0` | linux-cleanup 専用の色のスイッチ。`1` にするとここだけ色を消します |
| `LINUX_CLEANUP_LOG_DIR` | `~/.linux-cleanup/logs/`（npx / npm）または `<repo>/logs/`（クローン） | セッションログの保存先。なければ作ります |
| `LINUX_CLEANUP_REPORTS_DIR` | `~/.linux-cleanup/reports/` または `<repo>/reports/` | JSON のセッション記録の保存先。なければ作ります |
| `LINUX_CLEANUP_DATA_HOME` | 未設定 — ログのディレクトリの親を使う | `logs/`、`reports/`、`feedback/` をまとめた親 |
| `LINUX_CLEANUP_NPX` | 未設定 | **内部用。** Node のランチャーが `1` にします。自分で設定しないでください |
| `LINUX_CLEANUP_LAUNCHER` | 未設定 | **内部用。** Node のランチャーは `node`、デスクトップアプリは `desktop` にします。`desktop` のときは、アプリが自分で更新を確認するので CLI 側の確認を飛ばします（2.1.0 から）。自分で設定しないでください |
| `XDG_CONFIG_HOME` | `~/.config` | `personal-roots.txt` と `project-roots.txt` を探す場所 |

## 出力をすべて別の場所へ {#redirecting-all-output}

`LINUX_CLEANUP_DATA_HOME` は、ログ、記録、フィードバック用バンドルのすべてをまとめて移す唯一の設定です。

```bash
export LINUX_CLEANUP_DATA_HOME="/mnt/secure/linux-cleanup"
linux-cleanup --scan
```

:::caution ディレクトリは作りますが、マウントポイントは作りません
ツールは指定したパスの下に `logs/`、`reports/`、`feedback/` を作ります。その下にあるマウントポイントは作らず、確認も**しません**。マウントされていないパスを指すと、出力は気づかないうちにその下のファイルシステムに書かれます。

頼る前に、出力先がマウントされていて書き込めることを確かめてください。
:::

細かく制御したい場合は、`LINUX_CLEANUP_LOG_DIR` と `LINUX_CLEANUP_REPORTS_DIR` を個別に上書きできます。こちらがデータのルートより優先されます。

## 色の制御 {#colour-control}

```bash
export NO_COLOR=1          # このマシン上のすべてのツール
export CLEANUP_NO_COLOR=1  # linux-cleanup だけ
linux-cleanup --no-color   # この実行だけ
```

`CLEANUP_NO_COLOR` は、ほかのツールでは色を使い、このツールだけはプレーンな出力にしたい場合のためのものです。エスケープシーケンスを崩してしまう場所に出力をパイプで渡すときなどに使います。

## スキャンするルートの設定 {#configuring-the-scanned-roots}

`$XDG_CONFIG_HOME`（既定は `~/.config`）の下にある 2 つのファイルで、個人ファイルとプロジェクトのスキャンがたどるディレクトリを決めます。

| ファイル | 使うモード | 既定のルート |
|---|---|---|
| `personal-roots.txt` | [`--stale`](../modes/personal-stale-files.md) | `~/Downloads`。`~/Desktop` などの保護されたルートは無視します |
| `project-roots.txt` | [`--node-modules`](../modes/node-modules-finder.md) | あなたのプロジェクトのディレクトリ |

1 行に 1 つのパスを書きます。[XDG Base Directory の仕様](https://specifications.freedesktop.org/basedir-spec/)に従うので、`XDG_CONFIG_HOME` を設定すると両方の場所が変わります。

:::danger `personal-roots.txt` にルートを足すと、削除できる範囲が広がります
個人ファイルのスキャンは[対話式のみ](../safety/guards.md#guard-3--personal-data-is-interactive-only)なので、ファイルごとに確認しない限り何も消えません。ただし、足したルートの中身は候補の一覧に出てくるようになります。

[パスの許可リスト](./protected-paths.md)は引き続き適用され、こちらが優先されます。ここに `~/Documents` を足しても削除できるようにはなりません。
:::

## CI とスクリプトでは {#for-ci-and-scripts}

```bash
NO_COLOR=1 linux-cleanup --scan > /tmp/scan.log
```

単独のスキャンでは、ガイド付きの手順の JSON セッションレポートは作りません。スクリプトでは[終了コード](./exit-codes.md)を確認するか、構造化された出力がほしい場合は [`--json-events`](./json-events.md) を使ってください。

## 読まないもの {#what-it-does-not-read}

- `PATH`（どの任意のツールが入っているかを調べる場合を除く）
- `USER` と `LOGNAME`（ログの先頭に書く場合を除く）
- シェルの履歴、エイリアス、設定。シェルの初期化ファイルを読むのは [`--doctor`](../modes/doctor.md) だけで、それもランタイムが組み込まれているかの確認のためです
- リモートやネットワークから届く設定。そういうものはありません

`$HOME` が設定されていなければ、推測せずにすぐ止まります。[トラブルシューティング](../troubleshooting.md#home-is-not-set)を参照。

## 次へ {#next}

- [出力先のパス](./output-paths.md) — ファイルが実際に置かれる場所
- [CLI のフラグ](./cli-flags.md)
