---
sidebar_position: 11
title: linux-cleanup と Safe Disk Cleaner
description: "linux-cleanup と Safe Disk Cleaner の違い。それぞれの公式ページをもとに 2026-11-22 に確認。"
---

# linux-cleanup と Safe Disk Cleaner

*2026-11-22 に<a href="https://github.com/cyb3rl00m/safe-disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">Safe Disk Cleaner の公式ページ</a>で確認。*

**概要：**ディスクのカテゴリを説明し、削除の前に確認する GTK 4 アプリ。

**先方の価格：**確認したページには記載なし。**こちらの価格：**コマンドラインは MIT ライセンスで無料です。デスクトップアプリのプランは[料金ページ](https://linux-cleanup.aoneahsan.com/ja/pricing)をご覧ください。

| | linux-cleanup | Safe Disk Cleaner |
|---|---|---|
| コマンドラインインターフェース | あり | 確認したページには記載なし |
| 削除前のプレビュー | あり | あり（<a href="https://github.com/cyb3rl00m/safe-disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| ドライラン | あり | 確認したページには記載なし |
| キャッシュの掃除 | あり | あり（<a href="https://github.com/cyb3rl00m/safe-disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| 重複ファイルの検出 | 一部 | 確認したページには記載なし |

## Safe Disk Cleaner が向いている人 {#who-is-better-served-by-safe-disk-cleaner}

わかりやすいカテゴリの説明と GTK のデスクトップ表示を求めるなら Safe Disk Cleaner。

## linux-cleanup が優れている点 {#where-linux-cleanup-is-ahead}

同じような判断をターミナルで行い、保存できるドライランと、信頼する前に実行できる --self-test が欲しいなら linux-cleanup。

## ここから始めるなら {#where-to-start-here}

ツール間でのインポートはありません。それぞれが独自のルールを持っています。linux-cleanup があなたのコンピューターで何をするかを知るには、[削除前のプレビュー](../safety/preview-first.md)から始め、何も削除しない `npx -y linux-cleanup --all-safe --yes --dry-run` を実行してください。
