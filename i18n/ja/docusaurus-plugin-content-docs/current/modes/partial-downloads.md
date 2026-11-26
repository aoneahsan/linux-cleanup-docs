---
title: 途中の・持ち主のないダウンロード
description: ブラウザーやダウンロードマネージャーの転送が中断して残った途中のダウンロードファイル（.crdownload、.part、.fdmdownload）を見つけて削除します。
tags: [partials, downloads, orphan, interactive, modes]
sidebar_position: 10
---

# 途中の・持ち主のないダウンロード

**`--partials` は、放置された途中のダウンロードファイルを見つけ、削除を提案します。** ブラウザーやダウンロードマネージャーが転送中に書き込み、転送が中断したときに片付け忘れた一時ファイルです。

```bash
linux-cleanup --partials
```

## 探すもの {#what-it-looks-for}

| 拡張子 | 書き込むもの |
|---|---|
| `.crdownload` | Chrome、Chromium、Brave、Edge、Vivaldi |
| `.part` | Firefox、wget、aria2 |
| `.fdmdownload` | Free Download Manager |

途中のファイルには、転送が止まるまでに届いたバイトが入っています。数キロバイトのこともあれば、数ギガバイトの ISO のほとんどのこともあります。

## 対話式のみ {#interactive-only}

ファイルごとに確認し、`--yes` は無視され、[`--all-safe`](./all-safe.md) には含まれません。[関門 3](../safety/guards.md#guard-3--personal-data-is-interactive-only)を参照。

## 削除すると失うもの {#what-deleting-one-costs-you}

:::caution 途中のファイルはまだ再開できることもありますが、たいていはできません
再開するには、元のダウンロードのセッションが必要です。ブラウザーのダウンロードマネージャーの項目、元の URL、範囲指定のリクエストに対応したサーバーです。ブラウザーを再起動したり、ダウンロードの項目を消したりしていれば、そのファイルは再開できず、ただの無駄になります。

ファイル単体では使い道がありません。途中までダウンロードしたアーカイブは開けません。実際に考えるべきなのは、まだ再開するつもりかどうかだけです。
:::

大きなものの削除を承認する前に確認してください。

- ブラウザーのダウンロードページを開き、同じファイル名の一時停止中または失敗した項目を探す
- あれば、途中のファイルを削除せず、そこから再開する
- なければ、そのファイルは持ち主がなく、安全に削除できる

## 進行中のダウンロードもここに出ます {#an-active-download-will-show-up-here}

*いま*進行中のダウンロードにも `.crdownload` や `.part` のファイルがあります。ツールには、進行中の転送と放置されたものを区別する方法がありません。進行中のファイルを削除すると転送が壊れます。迷ったらダウンロードページを確認するか、何もダウンロードしていないときにこのモードを実行してください。

## ガイド付きの手順では {#in-the-walkthrough}

[ガイド付きの手順](./walkthrough.md)の手順 6 です。

## 次へ {#next}

- [使われていない個人ファイル](./personal-stale-files.md) — 関連する対話式モード
- [削除は元に戻せない](../safety/irreversibility.md)
