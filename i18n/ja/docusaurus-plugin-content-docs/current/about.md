---
title: このプロジェクトについて
description: linux-cleanup を作った人、その設計の考え方、ライセンス、連絡や貢献の方法。
tags: [about, author, licence, contributing, credits]
sidebar_position: 95
---

# このプロジェクトについて

**linux-cleanup は [Ahsan Mahmood](https://aoneahsan.com) が開発し、保守しています。** 開発者向けツールとアプリ開発に取り組む独立したソフトウェアエンジニアです。

| | |
|---|---|
| **作者** | Ahsan Mahmood |
| **メール** | [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |
| **ウェブ** | [aoneahsan.com](https://aoneahsan.com) |
| **LinkedIn** | [linkedin.com/in/aoneahsan](https://linkedin.com/in/aoneahsan) |
| **GitHub** | [github.com/aoneahsan](https://github.com/aoneahsan) |
| **npm** | [npmjs.com/~aoneahsan](https://www.npmjs.com/~aoneahsan) |

## なぜ作ったのか {#why-it-exists}

開発用のマシンには、作り直せるゴミが大量にたまります。数十 GB に及ぶパッケージマネージャーのキャッシュ、ブラウザーのキャッシュ、ビルドツールのキャッシュ、エミュレーターのイメージ、2 年前に手を止めたプロジェクトの `node_modules` などです。

これまでの掃除ツールは、たいてい 2 つのどちらかでした。今の開発用キャッシュをまったく知らないか、ボタン 1 つでゴミに見えるものを消し、うまくいくことを祈るだけのものです。

linux-cleanup はその逆を取ります。**スクリプトで使え、中身が見え、許可リストで守られ、既定で対話式です。** 何かに触れる前に、何に触れるのかを正確に読むことができます。

## 設計の考え方 {#design-principles}

**迷ったら拒否する。** [拒否リストではなく許可リスト](./safety/guards.md#guard-1--the-path-allowlist)を使います。ツールが知らないパスは拒否します。拒否リストでは、キャッシュを消すこととホームのディレクトリを消すことの間に、打ち間違い 1 つしかありません。

**キャッシュとツールを区別する。** `~/.cache/yarn` は数秒で作り直せますが、Gradle wrapper の配布物は 230 MB のダウンロードで、来月また必要になるかもしれません。両者を同じように扱うのは誤りだったので、[アイドルの関門](./safety/guards.md#guard-2--the-staleness-gate)を設け、1.2.0 で改めました。

**個人データは利用者が判断する。** 二度と開かないインストーラーと、ある文書の唯一のコピーを、ディスク上で見分ける手がかりはありません。ツールは推測しないので、これらのモードは [`--yes` を無視します](./safety/guards.md#guard-3--personal-data-is-interactive-only)。

**復旧より予防。** [元に戻す機能はありません](./safety/irreversibility.md)。意図した選択です。取り消し用のログは空けようとしているディスクへの書き込みを増やし、不注意も招きます。

**便利さより確かめやすさ。** Bash を使うのは、最初から入っていて読めるからです。コンパイルしたバイナリのほうが扱いやすいでしょうが、信頼するのはずっと難しくなります。

**リリースの確認は最小限。** 起動時、オンラインなら CLI は公開リリース記録を 1 件読みます。掃除したパス、レポート、クラッシュ用バンドルはアップロードしません。レポートを送るかどうかは、いつでもあなたが決めます。

## 指摘がツールを形づくる {#corrections-shape-the-tool}

安全のための機能のうち 2 つは、だれかが実際の問題を指摘してくれたことから生まれました。

[保護されたインストール先の一覧](./reference/protected-paths.md#exact-match-protected-paths)は、実際の不具合から生まれました。pnpm の掃除がインストール先の `~/.local/share/pnpm` を対象にしていて、グローバルにインストールしたパッケージを消していたのです。[1.1.0](./changelog.md#110--2026-05-10) で直し、再発しないよう確認の処理も加えました。

[アイドルの関門](./safety/guards.md#guard-2--the-staleness-gate)は、1.2.0 がまだ Android の AVD を丸ごと消していること、そしてキャッシュではなくツールであるものすべてに同じ考え方を当てはめるべきだという、利用者の指摘から生まれました。それが [1.2.1](./changelog.md#121--2026-05-10) になりました。

おかしな点を見つけたら、[知らせてください](./guides/send-a-bug-report.md)。

## ライセンス {#licence}

[1.4.0](./changelog.md#140--2026-07-11) から **[MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)** です。

個人でも商用でも使え、改変、フォーク、組み込み、再配布ができます。条件は、コピーや主要な部分に著作権表示と MIT の許諾表示を残すことだけです。

:::danger 「現状のまま」提供し、保証はありません
これはファイルを削除するツールです。利用によって生じたいかなる請求や損害（データの損失を含む）についても、作者は責任を負いません。データをバックアップし、確認する前に一つひとつの操作を見直してください。

[ライセンスの全文](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)が優先されます。
:::

1.4.0 より前に公開したリリースは、公開時のライセンスのままです。

## 貢献 {#contributing}

MIT のもとでの貢献を歓迎します。

- **フォークしてプルリクエストを開いてください** — 特別な権限はいりません
- **不具合の報告や機能の要望**は [GitHub issues](https://github.com/aoneahsan/linux-cleanup/issues) かメールで
- **`main` は保護されています** — 変更はレビュー済みの PR で取り込みます

コードの基準は、安全第一、オフラインのみ、ShellCheck で警告なしです。[CONTRIBUTING.md](https://github.com/aoneahsan/linux-cleanup/blob/main/CONTRIBUTING.md) を参照。

説明だけの機能の要望も、コードと同じく歓迎します。何を掃除したいのか、なぜ今のモードでは足りないのかを書いてください。

## このドキュメントについて {#this-documentation}

[Docusaurus](https://docusaurus.io/) で作り、GitHub Pages で公開しています。ソース：[github.com/aoneahsan/linux-cleanup-docs](https://github.com/aoneahsan/linux-cleanup-docs)。修正の提案もこちらで歓迎します。

AI アシスタント向けの機械で読める要約：[`/llms.txt`](https://linux-cleanup-docs.aoneahsan.com/llms.txt)。

## 関連リンク {#related-links}

| | |
|---|---|
| **ソース** | [github.com/aoneahsan/linux-cleanup](https://github.com/aoneahsan/linux-cleanup) |
| **npm** | [npmjs.com/package/linux-cleanup](https://www.npmjs.com/package/linux-cleanup) |
| **課題** | [github.com/aoneahsan/linux-cleanup/issues](https://github.com/aoneahsan/linux-cleanup/issues) |
| **活動を支援する** | [aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=linux-cleanup&project-identifier=linux-cleanup) |
