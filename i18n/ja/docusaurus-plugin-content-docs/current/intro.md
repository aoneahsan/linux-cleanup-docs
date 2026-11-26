---
title: linux-cleanup
description: パスの許可リスト、アイドルしきい値、対話式の確認を経て、再生成できるキャッシュを完全に削除し、Linux のディスク容量を取り戻す Bash 製コマンドラインツール。
tags: [linux, cleanup, disk-space, cli, bash, overview]
slug: /
sidebar_label: はじめに
sidebar_position: 1
---

# linux-cleanup

**linux-cleanup は、Linux 上の再生成できるキャッシュを削除する前にパスを表示します。** パッケージマネージャー、ブラウザー、ビルドツールのキャッシュを対象とし、システム作業と個人ファイルの候補にはそれぞれ別のモードがあります。本番のクリーンアップを選ぶ前に、読み取り専用のスキャンかドライランから始めてください。

linux-cleanup を入手: [npm](https://www.npmjs.com/package/linux-cleanup) · [ウェブサイト](https://linux-cleanup.aoneahsan.com) · [すべての入手先](/apps)

これは**削除を行うツール**です。削除はすべて完全で、元に戻せません。安全性は、後から戻せることではなく、触れてはいけないものに最初から触れないことで成り立っています。

:::danger このツールはファイルを完全に削除します
元に戻す操作、ゴミ箱、バックアップの手順はありません。本番のクリーンアップは選んだファイルを完全に削除します。確定する前に `--dry-run` で選んだモードをプレビューしてください。

何かを削除させる前に、**[何を削除するか](./safety/what-it-deletes.md)** を読み、**[読み取り専用のプレビュー](./safety/preview-first.md)** を実行してください。
:::

| | |
|---|---|
| **パッケージのバージョン** | npm の 2.1.1（2026-11-22）。インストール済みのコピーは `linux-cleanup --version` で確認 |
| **プラットフォーム** | Linux のみ — `bash` 4 以上と GNU coreutils |
| **ライセンス** | [MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE) — 1.4.0 から |
| **ネットワーク** | オンライン時、起動時に公開リリース記録を 1 回取得。インストールや更新では npm または GitHub も使用 |
| **作者** | [Ahsan Mahmood](https://aoneahsan.com) · [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |

## 順番に読んでください {#read-this-in-order}

このドキュメントは、データを消すツールのために意図して順序立てています。最初の 3 ページが、トラブルを避けるためのページです。

| 手順 | ページ | 理由 |
|---|---|---|
| 1 | [何を削除するか](./safety/what-it-deletes.md) | カテゴリ別の対象一覧 |
| 2 | [削除前のプレビュー](./safety/preview-first.md) | 読み取り専用のスキャン、次に選んだモードのドライラン |
| 3 | [安全装置](./safety/guards.md) | 削除の前にパスが通過する 4 つの関門 |
| 4 | [削除は元に戻せない](./safety/irreversibility.md) | 「元に戻せない」が実際に意味すること |
| 5 | [インストール](./getting-started/installation.md) | `npx`、グローバルの `npm`、または `git clone` |
| 6 | [クイックスタート](./getting-started/quick-start.md) | 最初の本番クリーンアップ |

## 得意なこと {#what-it-is-good-at}

- **候補を示す。** スキャンはキャッシュのルートと現在のサイズを示します。ドライランは選んだクリーンアップをたどり、予定している操作を示します。
- **間違ったものを消さない。** [パスの許可リスト](./reference/protected-paths.md)は、シンボリックリンクを解決したうえで `~/Documents`、`~/.ssh`、`~/.config`、`/etc` などを必ず拒否します。
- **最近使ったファイルには触れない。** 1.2.0 からは、全消去ではなく*間引き*が既定です。キャッシュの中で 100 日以上触れられていないファイルだけを削除します。[アイドルしきい値](./safety/guards.md#guard-2--the-staleness-gate)を参照。
- **実行を記録する。** CLI はローカルにログを残します。ガイド付きの手順は、無効にしない限り [JSON のセッションレポート](./reference/report-schema.md)を書き出します。ドライランでは書き出しません。
- **更新を確認する。** 起動時、利用できる場合は HTTPS で公開リリース記録を読み込みます。

## できないこと {#what-it-is-not}

機能一覧より、境界をはっきりさせるほうが役に立ちます。

- **バックアップツールではありません。** 削除するだけで、保存はしません。削除したものをツール内から戻すことはできません。
- **元に戻すツールではありません。** [`--scan`](./modes/scan.md) は読み取りのみ、`--dry-run` は選んだクリーンアップのプレビューです。どちらも本番実行後にファイルを戻せません。
- **セキュリティスキャナーではありません。** 秘密情報、マルウェア、脆弱性は探しません。
- **クロスプラットフォームではありません。** Linux のみです。npm パッケージは `"os": ["linux"]` を宣言しています。
- **すべてのディストリビューションで同じではありません。** `$HOME` 内のキャッシュ削除はどこでも動きますが、[`--system` モードは Debian/Ubuntu 専用](./distro-support.md)です。`apt` と `dpkg` を直接呼び出します。
- **あなたの判断の代わりにはなりません。** 確定する前に、提案内容を読んでください。

## 30 秒版 {#the-30-second-version}

```bash
# 1. 取り戻せる容量を確認。何も削除しません。
npx linux-cleanup --scan

# 2. 選んだクリーンアップを削除せずにプレビュー。
npx linux-cleanup --all-safe --dry-run

# 3. ガイド付きの手順を実行。削除前に各選択を確認。
npx linux-cleanup
```

手順 3 が既定のモードです。10 のカテゴリを順にたどり、各カテゴリの前に確認し、取り戻したバイト数の合計を表示して、最後にレポートを書き出します。[ガイド付きの手順](./modes/walkthrough.md)を参照。

## 次に読むページ {#where-to-go-next}

- いちばん早く容量を取り戻したい → [できるだけ多くの容量を取り戻す](./guides/reclaim-the-most-space.md)
- 問題が起きた → [復旧](./recovery.md)、次に[トラブルシューティング](./troubleshooting.md)
- すべてのフラグを見たい → [CLI フラグ](./reference/cli-flags.md)
- 何が変わったか知りたい → [変更履歴](./changelog.md)
