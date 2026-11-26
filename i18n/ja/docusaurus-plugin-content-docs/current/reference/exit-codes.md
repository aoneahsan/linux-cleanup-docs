---
title: 終了コード
description: linux-cleanup の各終了コードの意味、自動でクラッシュ用バンドルを作るコード、スクリプトや cron のジョブでの分岐のしかた。
tags: [exit-codes, scripting, cron, crash-bundle, reference]
sidebar_position: 6
---

# 終了コード

**linux-cleanup は Unix の慣例に従います。`0` は成功で、それ以外は何らかの問題です。** 0 以外でも想定どおりのコードがあり、意図してクラッシュとは扱いません。

## コードの一覧 {#codes}

| コード | 意味 | クラッシュ用バンドル |
|---|---|---|
| `0` | 正常に終了。依頼した操作はすべて完了したか、断られた | 作らない |
| `1` | 一般的な失敗。不変条件が破られた。まれです | 作る |
| `2` | 引数の解析エラー。ヘルプを表示します | 作らない |
| `3` | 公開リリース記録が更新を必須にしている | 作らない |
| `127` | コマンドが見つからない。必須の依存関係がありません | 作る |
| `130` | `Ctrl-C`（SIGINT）で中断 | 作らない |
| `137` | SIGKILL で強制終了。多くは OOM killer か `kill -9` | 作る |
| `139` | セグメンテーション違反。純粋な bash では起きないはずです | 作る |
| `143` | SIGTERM で終了 | 作らない |
| それ以外の 0 以外 | 予期しない内部の失敗 | 作る |

不明なフラグは、クリーンアップの前に `2` で終了します。`--dry-run` は使えます。ファイルを削除せずに選んだモードをたどります。[削除前のプレビュー](../safety/preview-first.md)を参照。

## クラッシュ時の処理の判断 {#how-the-crash-trap-decides}

[1.3.0](../changelog.md#130--2026-05-10) で加えた EXIT のトラップは、次の順に判断します。

1. 終了コードが `0`、**または**スクリプトが内部の完了フラグを立てた → バンドルなし
2. 終了コードが `130`（`Ctrl-C`）か `143`（SIGTERM）→ バンドルなし。利用者が止めたのはクラッシュではありません
3. 終了コードが `2`（引数の解析）→ バンドルなし。スクリプトがヘルプを表示して意図して止まりました
4. それ以外 → `~/.linux-cleanup/feedback/` に `crash-<timestamp>.tar.gz` を書き出す

バンドルには、実行中のセッションログ、最新の JSON の記録、短いシステムのマニフェストが入ります。マシンに残り、**何も送信しません**。パスを表示するので、中身を確認してからメールで送るかどうかを決めてください。

[不具合を報告する](../guides/send-a-bug-report.md)を参照。

## コードで分岐する {#branching-on-the-code}

```bash
if linux-cleanup --scan; then
  echo "スキャン成功"
else
  case $? in
    2)   echo "フラグが不正" ;;
    127) echo "依存関係がない — --self-test を実行" ;;
    130) echo "利用者が中断" ;;
    *)   echo "予期しない失敗 — ~/.linux-cleanup/feedback/ を確認" ;;
  esac
fi
```

## cron では {#in-cron}

```bash
linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1 || \
  echo "linux-cleanup exited $?" | mail -s "cleanup failed on $(hostname)" you@example.com
```

cron のジョブで終了コード `127` が出るのは、ほとんどの場合、crontab でパスなしのコマンド名を使い、cron の最小限の `PATH` で見つからなかったためです。絶対パスを使ってください。[トラブルシューティング](../troubleshooting.md#cron-entry-runs-but-does-nothing)を参照。

## クラッシュ用バンドルから予期しないコードを調べる {#diagnosing-an-unexpected-code-from-a-crash-bundle}

バンドルのマニフェストに終了コードが記録されています。よくあるもの：

| コード | よくある原因 |
|---|---|
| `137` | メモリ不足による OOM killer。たいていは巨大なツリーでの `find` |
| `141` | SIGPIPE。パイプが早く閉じた。`tee` やページャーの終了が多い |
| `139` | セグメンテーション違反。ここでは起きないはずなので報告してください |
| `127` | 依存関係がない。`--self-test` で特定してください |

## 次へ {#next}

- [不具合を報告する](../guides/send-a-bug-report.md)
- [トラブルシューティング](../troubleshooting.md)
