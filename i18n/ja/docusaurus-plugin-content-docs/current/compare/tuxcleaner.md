---
sidebar_position: 7
title: linux-cleanup と TuxCleaner
description: "linux-cleanup と TuxCleaner の違い。それぞれの公式ページをもとに 2026-11-22 に確認。"
---

# linux-cleanup と TuxCleaner

*2026-11-22 に<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">TuxCleaner の公式ページ</a>で確認。*

**概要：**掃除、アプリのアンインストール、ディスク分析、状態確認のための Linux CLI。

**先方の価格：**確認したページには記載なし。**こちらの価格：**コマンドラインは MIT ライセンスで無料です。デスクトップアプリのプランは[料金ページ](https://linux-cleanup.aoneahsan.com/ja/pricing)をご覧ください。

| | linux-cleanup | TuxCleaner |
|---|---|---|
| コマンドラインインターフェース | あり | あり（<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| 削除前のプレビュー | あり | あり（<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| ドライラン | あり | あり（<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| キャッシュの掃除 | あり | あり（<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| 重複ファイルの検出 | 一部 | 確認したページには記載なし |

## TuxCleaner が向いている人 {#who-is-better-served-by-tuxcleaner}

ディストリビューションごとのパッケージアダプターとアプリのアンインストールを求めるなら TuxCleaner。

## linux-cleanup が優れている点 {#where-linux-cleanup-is-ahead}

ビルド不要の Bash スクリプトを npx で実行し、Gradle や Android Studio のまとまりを使われていないときだけ削除するルールを保ちたいなら linux-cleanup。

## ここから始めるなら {#where-to-start-here}

ツール間でのインポートはありません。それぞれが独自のルールを持っています。linux-cleanup があなたのコンピューターで何をするかを知るには、[削除前のプレビュー](../safety/preview-first.md)から始め、何も削除しない `npx -y linux-cleanup --all-safe --yes --dry-run` を実行してください。
