---
title: シェルのエイリアスと毎週の cron
description: シェルのエイリアス cleanup と、毎週自動で実行する完全安全のクリーンアップの導入方法。それぞれが書き込むものと、取り除き方。
tags: [guide, alias, cron, automation, scheduling, setup]
sidebar_position: 2
---

# シェルのエイリアスと毎週の cron

**一度設定すれば済む補助機能が 2 つあります。シェルのエイリアス `cleanup` と、毎週の自動実行です。** どちらも対応するアンインストール用のフラグで元に戻せます。

```bash
linux-cleanup --install-alias
linux-cleanup --install-cron
```

## シェルのエイリアス {#the-shell-alias}

```bash
linux-cleanup --install-alias
```

シェルに応じて、`~/.bash_aliases` または `~/.zshrc` にエイリアス `cleanup` を追記します。以後はどこからでも `cleanup` と入力すればツールが動きます。

シェルを読み込み直してください。そうしないとエイリアスがないように見えます。

```bash
source ~/.bashrc     # または ~/.zshrc
```

取り除くには `linux-cleanup --uninstall-alias` を使います。

:::note シェルの初期化ファイルは削除の段階で保護されています
`.bashrc`、`.zshrc`、`.bash_aliases` などは[保護されたファイル名の一覧](../reference/protected-paths.md#protected-basenames)にあるため、どのパスにあっても、クリーンアップモードがこれらを削除することはありません。エイリアスのインストーラーは追記するだけで、アンインストールは自分の行だけを取り除きます。
:::

## 毎週の cron ジョブ {#the-weekly-cron-job}

```bash
linux-cleanup --install-cron
```

`--all-safe -y` を**毎週日曜 03:00** に実行するよう設定し、出力を `~/.linux-cleanup/logs/cron.log` に追記します。`crontab` が必要です。

取り除くには `linux-cleanup --uninstall-cron` を使います。

### なぜ `--all-safe` がこの用途に合うのか {#why---all-safe-is-the-right-mode-for-this}

`--yes` が効く唯一のモードであり、しかも**個人データには触れられません**。対話式のみのモードは含まれず、設計上 `--yes` を無視します。そのため、無人の実行でキャッシュは掃除できても、`~/Downloads` のファイルを消すことは決してありません。[関門 3](../safety/guards.md#guard-3--personal-data-is-interactive-only)を参照。

[アイドルしきい値](../safety/guards.md#guard-2--the-staleness-gate)は引き続き適用されるので、最近使ったファイルは毎週の実行でも残ります。

## crontab の設定を自分で書く {#writing-the-crontab-entry-yourself}

別の日時やフラグにしたい場合：

```bash
crontab -e
```

```bash
0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1
```

:::danger 絶対パスを使ってください
cron は最小限の `PATH`（多くは `/usr/bin:/bin` だけ）で動きます。`~/.local/bin` や Node のバージョン管理ツールのディレクトリにある場合、パスなしの `linux-cleanup` は見つからず、ジョブは毎週ひっそりと失敗します。

これはスケジュール実行でいちばんよくある問題です。パスは次で確認できます。

```bash
command -v linux-cleanup
```

または crontab の先頭で `PATH=` をはっきり設定してください。
:::

| フラグ | cron で使う理由 |
|---|---|
| `--all-safe -y` | 無人で、キャッシュのみ |
| `--no-report` | JSON の記録がたまるのを防ぐ（自動で削除されることは**ありません**） |
| `--cleanup-logs` | 終了時にその回のログを削除 |
| `-d 30` | 任意：毎週の間引きをより積極的に |

`--cleanup-logs` だけではディレクトリを小さく保てません。セッション記録には触れないからです。それを防ぐのは `--no-report` です。

:::caution スケジュールしたジョブに `--purge-all` を加えないでください
無人で、しかもアイドルしきい値がないと、手間のかかるものが、必要になる 1 週間前に誰も見ていないところで消えることがあります。`--purge-all` は、意図して見守りながら実行するときだけにしてください。[できるだけ多くの容量を取り戻す](./reclaim-the-most-space.md)を参照。
:::

## 実行されたかを確かめる {#checking-that-it-ran}

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

ログに `command not found` があれば、上で説明した `PATH` の問題です。ログが空なら、ジョブは一度も動いていません。cron のデーモンが動いているか確認してください（`systemctl status cron` または `crond`）。

cron のログは**ローテーションされません**。大きくなったら自分でローテーションしてください。

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## 代わりに systemd のタイマーを使う {#a-systemd-timer-instead}

cron よりタイマーを使いたい場合も、ツール側で特別なことはありません。同じコマンドをスケジュールしてください。ツールはどのスケジューラーから呼ばれたかを知らず、気にもしません。`--install-cron` は便利な手段で、必須ではありません。

## 両方を取り除く {#removing-both}

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

パッケージも含めて完全に取り除く方法：[アンインストール](./uninstall.md)。
