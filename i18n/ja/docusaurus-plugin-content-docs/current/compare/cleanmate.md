---
sidebar_position: 6
title: linux-cleanup と CleanMate
description: "linux-cleanup と CleanMate の違い。それぞれの公式ページをもとに 2026-11-22 に確認。"
---

# linux-cleanup と CleanMate

*2026-11-22 に<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">CleanMate の公式ページ</a>で確認。*

**概要：**デスクトップアプリ、ターミナルアプリ、削除前の確認フローを備えた macOS と Ubuntu 向けのクリーナー。

**先方の価格：**無料（<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">出典</a>、2026-11-22 確認）。**こちらの価格：**コマンドラインは MIT ライセンスで無料です。デスクトップアプリのプランは[料金ページ](https://linux-cleanup.aoneahsan.com/ja/pricing)をご覧ください。

| | linux-cleanup | CleanMate |
|---|---|---|
| コマンドラインインターフェース | あり | あり（<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| 削除前のプレビュー | あり | あり（<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| ドライラン | あり | 確認したページには記載なし |
| キャッシュの掃除 | あり | あり（<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |
| 重複ファイルの検出 | 一部 | あり（<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">出典</a>） |

## CleanMate が向いている人 {#who-is-better-served-by-cleanmate}

Ubuntu のデスクトップアプリ、Space Lens、個人ファイルのゴミ箱と取り消しのフローが欲しいなら CleanMate。

## linux-cleanup が優れている点 {#where-linux-cleanup-is-ahead}

JSON イベントストリームを持つスクリプト向きのコマンドラインと、本番実行ごとのローカル JSON レポートが欲しいなら linux-cleanup。

## ここから始めるなら {#where-to-start-here}

ツール間でのインポートはありません。それぞれが独自のルールを持っています。linux-cleanup があなたのコンピューターで何をするかを知るには、[削除前のプレビュー](../safety/preview-first.md)から始め、何も削除しない `npx -y linux-cleanup --all-safe --yes --dry-run` を実行してください。
