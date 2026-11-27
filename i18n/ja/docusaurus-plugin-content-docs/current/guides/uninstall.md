---
title: アンインストール
description: linux-cleanup を完全に取り除きます。パッケージ、シェルのエイリアス、cron の設定、ログとセッション記録。
sidebar_position: 4
---

# アンインストール

**まず自動化を、次にパッケージを、最後にデータを取り除きます。** パッケージをアンインストールしても、自分で入れたシェルのエイリアスや cron の設定は消えません。これらは別ものです。

## 1. 自動化を取り除く {#1-remove-the-automation}

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

コマンドがまだあるうちに、パッケージを取り除く**前に**行ってください。すでに取り除いてしまった場合は、下の[手動での削除](#if-you-removed-the-package-first)を参照してください。

確認：

```bash
crontab -l | grep -i cleanup     # 何も表示されなければ OK
grep -rn 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

## 2. パッケージを取り除く {#2-remove-the-package}

```bash
npm uninstall -g linux-cleanup
```

`npx` の場合は何もインストールされていません。npm のキャッシュが自然に片付けます。今すぐ消すには：

```bash
npm cache clean --force
```

git clone の場合はディレクトリを削除します：

```bash
rm -rf ~/linux-cleanup
```

:::caution クローンは自分のログと記録を持っています
npm でのインストールとは違い、クローンは出力を `<clone>/logs/` と `<clone>/reports/` に保存します。クローンを削除するとそれも消えます。残したいものは先にコピーしてください。[出力パス](../reference/output-paths.md)を参照。
:::

## 3. データを取り除く {#3-remove-the-data}

ログ、セッション記録、フィードバック用のバンドルは `~/.linux-cleanup/` にあり、アンインストールでは**決して**削除されません。

```bash
ls -la ~/.linux-cleanup/           # 削除する前に中身を確認
rm -rf ~/.linux-cleanup/
```

サイズは小さく（たいてい数メガバイト）、過去の実行で何を削除したかを示す唯一の記録です。残しておいても困ることはありません。削除すれば、ほかの削除と同じく元に戻せません。

`LINUX_CLEANUP_DATA_HOME` を設定していた場合は、代わりにそのディレクトリを削除し、シェルの設定からその export を取り除いてください。

## 4. 設定ファイルを取り除く（作った場合） {#4-remove-configuration-if-you-created-any}

```bash
rm -f ~/.config/personal-roots.txt ~/.config/project-roots.txt
```

自分で作った場合にだけ存在します。[環境変数](../reference/environment-variables.md#configuring-the-scanned-roots)を参照。

## 先にパッケージを取り除いてしまった場合 {#if-you-removed-the-package-first}

2 つの補助設定を手で元に戻します。

**cron：**

```bash
crontab -e
# linux-cleanup または cleanup.sh を含む行を削除
```

**エイリアス：**

```bash
grep -n 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

エディターで該当するエイリアスの行を削除し、ファイルを `source` するか、新しいターミナルを開いてください。

## 残るもの {#what-is-left-behind}

上の作業を終えれば何も残りません。このツールは、システムサービス、デーモン、systemd のユニット、`/etc` の設定、root 所有のファイルを一切インストールしません。作るものはすべてホームディレクトリの中にあります。

自分のファイルではないため、元に戻さないシステムへの影響：

- **削除したキャッシュは削除されたままです。** それぞれのツールが必要なときに作り直します
- **[`--doctor`](../modes/doctor.md) が追加したシェルの初期化ブロック**は残ります。インストール済みの実行環境にとって正しい設定です。不要なら手で削除してください

## 確認 {#verify}

```bash
command -v linux-cleanup      # 何も表示されなければ OK
crontab -l | grep -i cleanup  # 何も表示されなければ OK
ls ~/.linux-cleanup 2>&1      # No such file or directory と表示されれば OK
```

## 次へ {#next}

- [インストール](../getting-started/installation.md) — 入れ直す場合
