---
sidebar_position: 5
title: linux-cleanup と Cross Cleaner
description: "linux-cleanup と Cross Cleaner の違い。それぞれの公式ページをもとに 2026-11-22 に確認。"
---

# linux-cleanup と Cross Cleaner

*2026-11-22 に<a href="https://cross-cleaner.github.io/" target="_blank" rel="noopener noreferrer nofollow">Cross Cleaner の公式ページ</a>で確認。*

**概要：**ウィンドウ版、ターミナル版、コマンドライン版があるクロスプラットフォームのクリーナー。

**先方の価格：**無料（<a href="https://cross-cleaner.github.io/" target="_blank" rel="noopener noreferrer nofollow">出典</a>、2026-11-22 確認）。**こちらの価格：**コマンドラインは MIT ライセンスで無料です。デスクトップアプリのプランは[料金ページ](https://linux-cleanup.aoneahsan.com/ja/pricing)をご覧ください。

| | linux-cleanup | Cross Cleaner |
|---|---|---|
| コマンドラインインターフェース | あり | あり（<a href="https://cross-cleaner.github.io/" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| 削除前のプレビュー | あり | 確認したページには記載なし |
| ドライラン | あり | あり（<a href="https://cross-cleaner.github.io/" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| キャッシュの掃除 | あり | あり（<a href="https://cross-cleaner.github.io/" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| 重複ファイルの検出 | 一部 | 確認したページには記載なし |

## Cross Cleaner が向いている人 {#who-is-better-served-by-cross-cleaner}

Linux、Windows、macOS、Android でひとつのクリーナーを使いたいなら Cross Cleaner。

## linux-cleanup が優れている点 {#where-linux-cleanup-is-ahead}

キャッシュのルールがどうであれ、保護リストが ~/Documents、~/.ssh、~/.config を名前で拒否する Linux 専用ツールなら linux-cleanup。

## ここから始めるなら {#where-to-start-here}

ツール間でのインポートはありません。それぞれが独自のルールを持っています。linux-cleanup があなたのコンピューターで何をするかを知るには、[削除前のプレビュー](../safety/preview-first.md)から始め、何も削除しない `npx -y linux-cleanup --all-safe --yes --dry-run` を実行してください。
