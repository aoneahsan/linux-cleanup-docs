---
sidebar_position: 8
title: linux-cleanup と Ubuntu Cleaner
description: "linux-cleanup と Ubuntu Cleaner の違い。それぞれの公式ページをもとに 2026-11-22 に確認。"
---

# linux-cleanup と Ubuntu Cleaner

*2026-11-22 に<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">Ubuntu Cleaner の公式ページ</a>で確認。*

**概要：**パッケージと開発用キャッシュの保守を行う、Ubuntu、Debian、Linux Mint 向けの Bash クリーナー。

**先方の価格：**確認したページには記載なし。**こちらの価格：**コマンドラインは MIT ライセンスで無料です。デスクトップアプリのプランは[料金ページ](https://linux-cleanup.aoneahsan.com/ja/pricing)をご覧ください。

| | linux-cleanup | Ubuntu Cleaner |
|---|---|---|
| コマンドラインインターフェース | あり | あり（<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| 削除前のプレビュー | あり | あり（<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| ドライラン | あり | あり（<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| キャッシュの掃除 | あり | あり（<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| 重複ファイルの検出 | 一部 | 確認したページには記載なし |

## Ubuntu Cleaner が向いている人 {#who-is-better-served-by-ubuntu-cleaner}

Debian 系への特化と Docker の保守を求めるなら Ubuntu Cleaner。

## linux-cleanup が優れている点 {#where-linux-cleanup-is-ahead}

掃除を普段のユーザーで実行し、システムパッケージは独立した明示的な --system モードに任せたいなら linux-cleanup。

## ここから始めるなら {#where-to-start-here}

ツール間でのインポートはありません。それぞれが独自のルールを持っています。linux-cleanup があなたのコンピューターで何をするかを知るには、[削除前のプレビュー](../safety/preview-first.md)から始め、何も削除しない `npx -y linux-cleanup --all-safe --yes --dry-run` を実行してください。
