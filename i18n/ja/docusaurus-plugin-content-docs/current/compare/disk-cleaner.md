---
sidebar_position: 9
title: linux-cleanup と Disk Cleaner
description: "linux-cleanup と Disk Cleaner の違い。それぞれの公式ページをもとに 2026-11-22 に確認。"
---

# linux-cleanup と Disk Cleaner

*2026-11-22 に<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">Disk Cleaner の公式ページ</a>で確認。*

**概要：**ディスクの可視化と掃除の提案を備えた Linux の GTK クリーナー。

**先方の価格：**確認したページには記載なし。**こちらの価格：**コマンドラインは MIT ライセンスで無料です。デスクトップアプリのプランは[料金ページ](https://linux-cleanup.aoneahsan.com/ja/pricing)をご覧ください。

| | linux-cleanup | Disk Cleaner |
|---|---|---|
| コマンドラインインターフェース | あり | あり（<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| 削除前のプレビュー | あり | 確認したページには記載なし |
| ドライラン | あり | あり（<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| キャッシュの掃除 | あり | あり（<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| 重複ファイルの検出 | 一部 | 確認したページには記載なし |

## Disk Cleaner が向いている人 {#who-is-better-served-by-disk-cleaner}

インタラクティブなツリーマップやサンバースト表示が必要なら Disk Cleaner。

## linux-cleanup が優れている点 {#where-linux-cleanup-is-ahead}

グラフを見て手で選ぶのではなく、どのキャッシュが使われない期間の基準を超えたかをツールがルールで判断してほしいなら linux-cleanup。

## ここから始めるなら {#where-to-start-here}

ツール間でのインポートはありません。それぞれが独自のルールを持っています。linux-cleanup があなたのコンピューターで何をするかを知るには、[削除前のプレビュー](../safety/preview-first.md)から始め、何も削除しない `npx -y linux-cleanup --all-safe --yes --dry-run` を実行してください。
