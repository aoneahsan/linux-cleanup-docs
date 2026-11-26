---
title: エディター拡張機能
description: VS Code と Cursor で置き換えられた拡張機能の古いバージョン（更新後に残るコピー）を、置き換えの確認とアイドルしきい値を条件に削除します。
tags: [vscode, cursor, extensions, editor, modes]
sidebar_position: 11
---

# エディター拡張機能

**`--editor-ext` は、VS Code と Cursor で置き換えられた拡張機能のバージョンを削除します。** 拡張機能が更新されても、古いバージョンのディレクトリがディスクに残ることがよくあります。拡張機能が多く、数年分の更新があるマシンでは、数百メガバイトになります。

```bash
linux-cleanup --editor-ext
```

## 2 つの条件 {#the-two-conditions}

バージョンのディレクトリが候補になるのは、次の**両方**を満たす場合だけです。

1. **同じ拡張機能の新しいバージョンがある** — 現在のバージョンは決して候補になりません
2. **その古いバージョンが `--days` 日以上使われていない**（既定は 100）

2 つ目の条件は [1.2.1](../changelog.md#121--2026-05-10) で加えました。それまでは置き換えられていれば十分だったため、最近読み込んだ古いバージョンまで削除されていました。出力にはバージョンごとの未使用日数が表示されるので、何かが残された理由がわかります。

## 触れないもの {#what-it-does-not-touch}

- どの拡張機能でも現在のバージョン
- 拡張機能の設定、キー割り当て、ワークスペースの状態
- `~/.config` の中のもの。そのツリー全体が[保護されています](../reference/protected-paths.md)
- VS Code と Cursor 以外のエディターの拡張機能

## 実行したあと {#after-running-it}

VS Code に拡張機能が見つからないというバナーが出たら、ウィンドウを再読み込みしてください。`Ctrl+Shift+P` → **Developer: Reload Window**。エディターが、もう存在しないディレクトリを参照しています。

拡張機能が本当になくなっている場合（「最新バージョン」の判定が現在のものを取り違えたことになります）は、再インストールして[不具合を報告](../guides/send-a-bug-report.md)してください。

```bash
code --install-extension <publisher>.<name>
```

## 取り戻せる量の目安 {#expected-reclaim}

このマシンに入っている置き換え済みのバージョンによって変わります。掃除するかどうかを決める前に、スキャンで現在のディレクトリを確認してください。

## ガイド付きの手順と完全安全モードでは {#in-the-walkthrough-and-all-safe}

[ガイド付きの手順](./walkthrough.md)の手順 4 として実行され、置き換え済みで再生成できるコピーしか削除しないため、[`--all-safe`](./all-safe.md) にも含まれます。

## 次へ {#next}

- [アイドルしきい値](../safety/guards.md#guard-2--the-staleness-gate)
- [モードの概要](./overview.md)
