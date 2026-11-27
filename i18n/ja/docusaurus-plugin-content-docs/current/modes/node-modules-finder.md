---
title: 使われていない node_modules の検出
description: N 日以上手を付けていないプロジェクトの node_modules を見つけ、対話式で削除します。開発用のマシンでは、いちばん多く容量を取り戻せることがよくあります。
sidebar_position: 8
---

# 使われていない node_modules の検出

**`--node-modules` は、`--days` 日以上手を付けていないプロジェクトの `node_modules` を見つけ、1 つずつ削除を提案します。** 取り戻せる容量は、このマシンにあるプロジェクトによって変わります。

```bash
linux-cleanup --node-modules          # 既定は 100 日
linux-cleanup --node-modules -d 90
```

## 対話式のみ {#interactive-only}

このモードはプロジェクトごとの確認が必要で、**`--yes` を無視します**。[`--all-safe`](./all-safe.md) には含まれず、無人では実行できません。[関門 3](../safety/guards.md#guard-3--personal-data-is-interactive-only)を参照。

## 探すもの {#what-it-looks-for}

プロジェクトのルートを調べ、しきい値を超えて使われていないプロジェクトの `node_modules` を探し、それぞれのサイズと未使用日数を報告します。すでに一覧に出たディレクトリの中にある入れ子の `node_modules` は別に数えません。

プロジェクトのルートは、`$XDG_CONFIG_HOME`（既定は `~/.config`）の下の `project-roots.txt` で設定できます。[環境変数](../reference/environment-variables.md)を参照。

## ふつうは安全な理由 {#why-this-is-usually-safe}

`node_modules` は、開発用のマシンでいちばん確実に再生成できるものです。`yarn install` か `npm install` で、ロックファイルから作り直せます。

すべて受け入れる前に、知っておくべき注意が 2 つあります。

:::caution それでも痛手になりうる 2 つのケース
**手で修正した依存パッケージ。** `patch-package` や yarn のパッチを使わず `node_modules` の中のファイルを直接書き換えた場合、その変更はほかのどこにもありません。レジストリにもロックファイルにもありません。

**ロックファイルがない、ネットワークがない。** 入れ直すには、レジストリにつながることとロックファイルがあることが必要です。ロックファイルをコミットしていないプロジェクトでは同じ依存関係にならないことがあり、ネットワークから隔離されたマシンではまったく解決できないこともあります。
:::

どちらもよくあることではなく、ツールにはどちらも判別できません。一覧のプロジェクトにどちらかが当てはまるなら、そのプロジェクトは断ってください。

## 触れないもの {#what-it-does-not-touch}

- プロジェクトのソース。削除するのは中の `node_modules` だけです
- ロックファイル、`package.json`、そのほかプロジェクト内のもの
- しきい値の期間内に手を付けたプロジェクト
- [保護パスの一覧](../reference/protected-paths.md)にあるもの

## 積極的に取り戻す {#reclaiming-aggressively}

```bash
linux-cleanup --node-modules -d 30
```

しきい値を下げると候補が増えます。30 日にすると、まだときどき作業しているプロジェクトも出てくるので、まとめて受け入れずに一覧を読んでください。間違えたときの代償は入れ直しで、小さいとはいえゼロではありません。

## ガイド付きの手順では {#in-the-walkthrough}

[ガイド付きの手順](./walkthrough.md)の手順 5 として、同じくプロジェクトごとの確認つきで実行されます。

## 次へ {#next}

- [できるだけ多くの容量を取り戻す](../guides/reclaim-the-most-space.md)
- [安全装置](../safety/guards.md)
