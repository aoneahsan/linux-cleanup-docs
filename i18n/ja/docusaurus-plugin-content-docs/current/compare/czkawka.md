---
sidebar_position: 10
title: linux-cleanup と Czkawka
description: "linux-cleanup と Czkawka の違い。それぞれの公式ページをもとに 2026-11-22 に確認。"
---

# linux-cleanup と Czkawka

*2026-11-22 に<a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">Czkawka の公式ページ</a>で確認。*

**概要：**重複ファイル、空のフォルダー、似たメディアなどを見つけるユーティリティ。

**先方の価格：**確認したページには記載なし。**こちらの価格：**コマンドラインは MIT ライセンスで無料です。デスクトップアプリのプランは[料金ページ](https://linux-cleanup.aoneahsan.com/ja/pricing)をご覧ください。

| | linux-cleanup | Czkawka |
|---|---|---|
| コマンドラインインターフェース | あり | あり（<a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| 削除前のプレビュー | あり | 確認したページには記載なし |
| ドライラン | あり | 確認したページには記載なし |
| キャッシュの掃除 | あり | 確認したページには記載なし |
| 重複ファイルの検出 | 一部 | あり（<a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |

## Czkawka が向いている人 {#who-is-better-served-by-czkawka}

重複したり似ていたりする個人ファイルを探すなら Czkawka。linux-cleanup はその役割をうたっていません。

## linux-cleanup が優れている点 {#where-linux-cleanup-is-ahead}

使われない期間の基準を超えたキャッシュ、ログ、一時ファイルを扱うなら linux-cleanup。Czkawka 自身のページは、重複ファイルや似たファイルの検出について説明しています。

## ここから始めるなら {#where-to-start-here}

ツール間でのインポートはありません。それぞれが独自のルールを持っています。linux-cleanup があなたのコンピューターで何をするかを知るには、[削除前のプレビュー](../safety/preview-first.md)から始め、何も削除しない `npx -y linux-cleanup --all-safe --yes --dry-run` を実行してください。
