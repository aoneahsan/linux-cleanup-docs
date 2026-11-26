---
title: ホームの監査
description: ホームディレクトリで最も大きい 20 項目を、linux-cleanup が掃除できるかどうかに関係なく読み取り専用で一覧にします。ディスクを実際に使っているものを知るいちばん早い方法です。
tags: [audit, disk-usage, read-only, home, modes]
sidebar_position: 13
---

# ホームの監査

**`--audit` は `$HOME` で最も大きい 20 項目をサイズ順に一覧にします。** 何も削除せず、見つけたものをツールが掃除できるかどうかも気にしません。

```bash
linux-cleanup --audit
```

## `--scan` との違い {#why-this-is-different-from---scan}

[`--scan`](./scan.md) は linux-cleanup が掃除のしかたを知っているカテゴリーを測ります。`--audit` が測るのはホームディレクトリそのものです。

この違いこそが要点です。ディスクを埋めているのが 60 GB の仮想マシンのイメージ、ダウンロードしたデータセット、Steam のライブラリなら、`--scan` はそれに一切触れず、`--audit` は一覧のいちばん上に出します。

| | `--audit` | `--scan` |
|---|---|---|
| 範囲 | `$HOME` のすべて | 掃除できるカテゴリーのみ |
| 答える問い | 何がディスクを使っているか | このツールで何を取り戻せるか |
| JSON のセッションレポートを書くか | いいえ | いいえ |
| 削除 | しない | しない |

## いつもの流れ {#the-usual-workflow}

```bash
linux-cleanup --audit    # 何が大きいか
linux-cleanup --scan     # このツールで何を取り戻せるか
```

監査の上位がスキャンにも出ていれば、このツールが役に立ちます。出ていなければ、もっと役立つことがわかったことになります。容量はこのツールが扱わない場所にあり、直接対処できます。

linux-cleanup が掃除**しない**、よくある大きなもの：

- 仮想マシンのイメージやコンテナーのストレージ（`~/.local/share/libvirt`、`~/.local/share/docker`）
- ゲームのライブラリ（Steam、Lutris）
- データセット、モデルの重み、メディアのライブラリ
- `~/Documents`、`~/Pictures`、`~/Music`、`~/Videos` の中身。どれも[保護されています](../reference/protected-paths.md)

## 見つけたものを掘り下げる {#following-up-on-a-finding}

```bash
du -sh ~/.local/share/*      | sort -rh | head -20
du -sh ~/*                   | sort -rh | head -20
```

`--audit` で手早く当たりをつけ、見る場所がわかったら `du` で絞り込みます。

## 次へ {#next}

- [スキャン](./scan.md) — ツールで取り戻せるもの
- [できるだけ多くの容量を取り戻す](../guides/reclaim-the-most-space.md)
