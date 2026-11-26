---
sidebar_position: 2
title: linux-cleanup と BleachBit
description: "linux-cleanup と BleachBit の違い。それぞれの公式ページをもとに 2026-11-22 に確認。"
---

# linux-cleanup と BleachBit

*2026-11-22 に<a href="https://www.bleachbit.org/features" target="_blank" rel="noopener noreferrer nofollow">BleachBit の公式ページ</a>で確認。*

**概要：**ディスク容量とプライバシーのためのオープンソースのクリーナー。グラフィカルなプレビューと CLI を備えています。

**先方の価格：**無料（<a href="https://www.bleachbit.org/features" target="_blank" rel="noopener noreferrer nofollow">出典</a>、2026-11-22 確認）。**こちらの価格：**コマンドラインは MIT ライセンスで無料です。デスクトップアプリのプランは[料金ページ](https://linux-cleanup.aoneahsan.com/ja/pricing)をご覧ください。

| | linux-cleanup | BleachBit |
|---|---|---|
| コマンドラインインターフェース | あり | あり（<a href="https://www.bleachbit.org/features" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| 削除前のプレビュー | あり | あり（<a href="https://www.bleachbit.org/features" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| ドライラン | あり | 確認したページには記載なし |
| キャッシュの掃除 | あり | 確認したページには記載なし |
| 重複ファイルの検出 | 一部 | 確認したページには記載なし |

## BleachBit が向いている人 {#who-is-better-served-by-bleachbit}

グラフィカルなクリーナー、プライバシー情報の消去、Linux と Windows への対応を求めるなら BleachBit。

## linux-cleanup が優れている点 {#where-linux-cleanup-is-ahead}

Gradle、Playwright、pnpm のストアなど、使われていないときだけ削除する開発用キャッシュを、拒否したパスをすべてドライランに示しながら扱うなら linux-cleanup。

## ここから始めるなら {#where-to-start-here}

ツール間でのインポートはありません。それぞれが独自のルールを持っています。linux-cleanup があなたのコンピューターで何をするかを知るには、[削除前のプレビュー](../safety/preview-first.md)から始め、何も削除しない `npx -y linux-cleanup --all-safe --yes --dry-run` を実行してください。
