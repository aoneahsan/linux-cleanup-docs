---
title: 完全安全（一括）
description: 再生成できるキャッシュを 1 回でまとめて掃除します。cron や無人のメンテナンス向けのモードで、`--yes` が効く唯一のモードです。
sidebar_position: 6
---

# 完全安全（一括）

**`--all-safe` は、再生成できるキャッシュを 1 回でまとめて掃除します。** 無人のメンテナンス向けのモードで、`--yes` が効く唯一のモードです。

```bash
linux-cleanup --all-safe        # 一括で確認は 1 回
linux-cleanup --all-safe -y     # 確認なし（cron 向け）
```

## ここでいう「安全」の意味 {#what-safe-means-here}

安全とは**再生成できる**という意味です。パッケージマネージャーのキャッシュ、ブラウザーやアプリケーションのキャッシュ、使われていない開発ツールのデータです。リスクがないという意味でも、元に戻せるという意味でも**ありません**。削除はやはり[元に戻せません](../safety/irreversibility.md)。

`--yes` の有無にかかわらず、`--all-safe` が決して触れないもの：

- `~/Downloads`、`~/Desktop`、そのほかの場所にある個人ファイル
- 途中のダウンロード
- `node_modules` ディレクトリ
- [保護パスの一覧](../reference/protected-paths.md)にあるもの
- グローバルにインストールしたパッケージやシェルの初期化ファイル

これらのカテゴリーは[設計上、対話式のみ](../safety/guards.md#guard-3--personal-data-is-interactive-only)で、このモードにはそもそも含まれません。だからこそ `--all-safe -y` を cron のジョブに入れても問題ありません。

1.1.0 からは、**起動時の検査**も行います。保護された実行環境のディレクトリが対象の一覧に紛れ込んだら、`BUG:` のメッセージで中止します。将来の不具合で消してはいけないものを消すのではなく、はっきり失敗させるためです。

## `--yes` とその限界 {#--yes-and-its-limits}

`-y` / `--yes` はキャッシュの削除を自動で承認します。有効なのは `--all-safe` と組み合わせたときだけで、対話式のモードでは方針として無視されます。

```bash
linux-cleanup --all-safe -y
```

:::caution `-y` を使うと、判断はあとになってからしか見えません
許可リストとアイドルしきい値は引き続き適用されますが、確認できるのは実行後のログです。`--all-safe` 単独の実行では、ガイド付きの手順の JSON セッションレポートは書き出されません。初回は先に [`--scan`](./scan.md) と `--all-safe --dry-run` を確認してください。
:::

## 間引きと残るもの {#pruning-and-what-survives}

既定では、`--all-safe` は条件を満たすキャッシュファイルのうち、`atime` と `mtime` の両方が `--days`（既定は 100）より古いものを間引きます。展開済みのパッケージやバージョン付きのツールは、それぞれの未使用ルールに従って単位ごとに扱います。人が読む出力には結果の一部が表示されます。削除の前に予定のパスを確かめるにはドライランを使ってください。

```bash
linux-cleanup --all-safe -y            # しきい値 100 日
linux-cleanup --all-safe -y -d 30      # より積極的
linux-cleanup --all-safe -y --purge-all # 関門オフ — 全消去
```

:::danger cron のジョブで `--purge-all` を使うのは悪い組み合わせです
無人で、しかもアイドルしきい値がないと、Gradle wrapper のディストリビューションや Playwright のブラウザー一式が、必要になる 1 週間前に誰も見ていないところで消えることがあります。`--purge-all` は、OS を入れ直す前の意図した実行に限ってください。
:::

## 毎週実行する {#running-it-weekly}

```bash
linux-cleanup --install-cron
```

`--all-safe -y` を毎週日曜 03:00 に実行するよう設定し、出力を `~/.linux-cleanup/logs/cron.log` に追記します。具体的な設定と削除のしかたは[エイリアスと cron](../guides/alias-and-cron.md)を参照してください。

crontab の設定を自分で書く場合は**絶対パス**を使ってください。cron の最小限の `PATH` では `~/.local/bin` のインストールが見つかりません。

```bash
0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1
```

`--cleanup-logs` はその回のログを削除します。`--all-safe` 単独の実行ではガイド付きの手順の JSON セッション記録は書き出されないため、ここでは `--no-report` に追加の効果はありません。

## cron の実行で何が起きたかを確かめる {#checking-what-a-cron-run-did}

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
```

cron のログに `command not found` が出ていれば、crontab でパスなしのコマンド名を使っています。[トラブルシューティング](../troubleshooting.md#cron-entry-runs-but-does-nothing)を参照。

## ほかのモードを使うべきとき {#when-to-use-something-else}

| 状況 | より合うモード |
|---|---|
| このマシンで初めて使う | [`--scan`](./scan.md)、続いて `--all-safe --dry-run` |
| 判断を 1 つずつ見たい | [ガイド付きの手順](./walkthrough.md) |
| 掃除したいカテゴリーが 1 つだけ | [メニュー](./menu.md)または [TUI](./tui.md) |
| 個人ファイルの容量も取り戻したい | [使われていない個人ファイル](./personal-stale-files.md)を対話式で |

## 次へ {#next}

- [エイリアスと cron](../guides/alias-and-cron.md) — 定期実行の設定
- [できるだけ多くの容量を取り戻す](../guides/reclaim-the-most-space.md) — 積極的なやり方
- [安全装置](../safety/guards.md) — `-y` でも適用されるもの
