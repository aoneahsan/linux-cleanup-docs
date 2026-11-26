---
sidebar_position: 4
title: linux-cleanup と Sweeper
description: "linux-cleanup と Sweeper の違い。それぞれの公式ページをもとに 2026-11-22 に確認。"
---

# linux-cleanup と Sweeper

*2026-11-22 に<a href="https://apps.kde.org/en-gb/sweeper/" target="_blank" rel="noopener noreferrer nofollow">Sweeper の公式ページ</a>で確認。*

**概要：**Cookie、キャッシュ、そのほかの利用の痕跡を消す KDE のユーティリティ。

**先方の価格：**確認したページには記載なし。**こちらの価格：**コマンドラインは MIT ライセンスで無料です。デスクトップアプリのプランは[料金ページ](https://linux-cleanup.aoneahsan.com/ja/pricing)をご覧ください。

| | linux-cleanup | Sweeper |
|---|---|---|
| コマンドラインインターフェース | あり | 確認したページには記載なし |
| 削除前のプレビュー | あり | 確認したページには記載なし |
| ドライラン | あり | 確認したページには記載なし |
| キャッシュの掃除 | あり | あり（<a href="https://apps.kde.org/en-gb/sweeper/" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| 重複ファイルの検出 | 一部 | 確認したページには記載なし |

## Sweeper が向いている人 {#who-is-better-served-by-sweeper}

利用の痕跡に特化した KDE のデスクトップユーティリティが欲しいなら Sweeper。

## linux-cleanup が優れている点 {#where-linux-cleanup-is-ahead}

痕跡クリーナーが対象にしない、一定期間使われていないパッケージマネージャーや開発用のキャッシュを扱うなら linux-cleanup。

## ここから始めるなら {#where-to-start-here}

ツール間でのインポートはありません。それぞれが独自のルールを持っています。linux-cleanup があなたのコンピューターで何をするかを知るには、[削除前のプレビュー](../safety/preview-first.md)から始め、何も削除しない `npx -y linux-cleanup --all-safe --yes --dry-run` を実行してください。
