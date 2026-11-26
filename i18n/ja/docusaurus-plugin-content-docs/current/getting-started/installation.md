---
title: インストール
description: npx でインストールせずに、npm でグローバルに、またはリポジトリをクローンして linux-cleanup を導入する 3 つの方法と、削除を伴う実行の前にインストールを確かめる方法。
tags: [installation, npx, npm, git, setup, upgrade]
sidebar_position: 2
---

# インストール

**linux-cleanup の入手方法は 3 つあります。インストール不要の `npx`、`npm` でのグローバルインストール、`git clone` です。** どれも同じ Bash スクリプトを実行します。npm パッケージは `cleanup.sh` を探し、ログとレポートの保存先を永続的なディレクトリに向けるだけの薄い Node ランチャーです。

:::info インストール済みのバージョンを確認する
インストールやアップグレードのあとに `linux-cleanup --version` を実行してください。ドライランやリリース通知の変更は[変更履歴](../changelog.md)に記録しています。
:::

## 方法 1 — `npx`（インストール不要） {#option-1--npx-no-install}

試すのにいちばん早い方法です。`PATH` には何も追加されず、使わないと決めても何も残りません。

```bash
npx linux-cleanup --version
npx linux-cleanup --scan      # 読み取り専用の確認
npx linux-cleanup             # ガイド付きの手順
```

`npx` はパッケージを一時的な npm キャッシュのディレクトリに取得します。ログとレポートは一時ディレクトリでは**なく** `~/.linux-cleanup/` に書き込まれるので、npm のキャッシュが消えても残り、次回もそこにあります。

## 方法 2 — `npm` でグローバルインストール {#option-2--global-npm-install}

```bash
npm install -g linux-cleanup
linux-cleanup --version
```

これで `linux-cleanup` がどこからでも `PATH` で使えます。ログとレポートは引き続き `~/.linux-cleanup/` に保存されます。

```bash
npm install -g linux-cleanup@latest   # アップグレード
npm uninstall -g linux-cleanup        # 削除
```

パッケージをアンインストールしても、自分で入れたシェルのエイリアスや cron の設定は消えません。完全に取り除く方法は[アンインストール](../guides/uninstall.md)を参照してください。

## 方法 3 — `git clone` {#option-3--git-clone}

ソースを読む、監査する、変更する場合に。リポジトリの内容が npm で公開しているものと同じです。

```bash
git clone https://github.com/aoneahsan/linux-cleanup ~/linux-cleanup
cd ~/linux-cleanup
chmod +x cleanup.sh
./cleanup.sh --self-test
./cleanup.sh
```

動作の違いは 1 つだけです。**クローンでは出力がソースの隣に保存されます。** `~/.linux-cleanup/` ではなく `<clone>/logs/`、`<clone>/reports/`、`<clone>/feedback/` です。どちらも `LINUX_CLEANUP_DATA_HOME` で変更できます。[出力パス](../reference/output-paths.md)を参照。

プロジェクトは MIT ライセンスなので、フォークや改変は自由です。

## 削除を伴う実行の前に確認する {#verify-before-you-run-anything-destructive}

```bash
linux-cleanup --version      # 手元のビルドを確認
linux-cleanup --self-test    # 依存関係、構文、安全装置のチェック
```

問題のないセルフテストは成功メッセージで終わります。[保護パスの安全装置](../safety/guards.md#guard-1--the-path-allowlist)が `/`、`$HOME`、`~/Documents`、`~/.ssh`、`/etc` を確実に拒否し、`~/.cache/yarn` を拒否しないことを確かめます。1 つでも失敗すれば 0 以外の終了コードで終わります。

:::tip アップグレードのたびに `--self-test` を実行する
ドキュメントではなく、実際に手元にあるコードに対して動く唯一の確認です。1 秒で終わります。
:::

## どの方法を選ぶか {#which-install-path-to-choose}

| こんなとき | 使う方法 |
|---|---|
| 一度だけ試したい | `npx` |
| 定期的に、または cron で実行する | `npm` でのグローバルインストール |
| ソースを読んだり変更したりしたい | `git clone` |
| Node.js のないマシンで使う | `git clone` |
| 出力をソースの隣に置きたい | `git clone` |

cron で使う場合は、グローバルインストールにして crontab には**絶対パス**を書いてください。cron は最小限の `PATH` で動くため、`~/.local/bin` のインストールを見つけられません。これが cron でいちばんよくある問題です。[エイリアスと cron](../guides/alias-and-cron.md)を参照。

## インストールで行われないこと {#what-installing-does-not-do}

- システムサービス、常駐デーモン、スケジュールタスクは作りません（頼まない限り）
- テレメトリーのエージェントはありません。起動時、オンラインなら CLI は公開リリース記録を 1 件取得し、オフラインならそのまま続けます
- `--install-alias` か `--doctor` を実行しない限り、シェルの設定は変えません
- パッケージと `~/.linux-cleanup/` 以外にはファイルを作らず、後者も実際に実行したときにだけ作ります

## 次へ {#next}

- [クイックスタート](./quick-start.md) — 最初のクリーンアップ
- [何を削除するか](../safety/what-it-deletes.md) — 最初の本番実行の前に読んでください
- [アンインストール](../guides/uninstall.md) — エイリアスと cron を含めた完全な削除
