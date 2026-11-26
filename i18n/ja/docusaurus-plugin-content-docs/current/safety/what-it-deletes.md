---
title: 何を削除するか
description: Linux のクリーンアップモードと対象パス。通常のキャッシュ、システム作業、個人ファイルの違い。
tags: [safety, deletion, targets, caches, disk-space]
sidebar_position: 1
---

# 何を削除するか

**linux-cleanup は、選んだキャッシュと残りファイルを完全に削除します。** 対象はモードによって異なります。スキャンはパスと現在のサイズを一覧にし、ドライランは選んだクリーンアップをたどって予定の操作を表示します。どちらもバックアップではありません。

```bash
linux-cleanup --list-targets
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

[保護パスの安全装置](../reference/protected-paths.md)は、シンボリックリンクを解決したうえで、設定された個人用とシステムの場所を拒否します。本番実行の前に、提案されたパスをすべて読んでください。

## パッケージマネージャーのキャッシュ {#package-manager-caches}

通常の完全安全モードでは、次のキャッシュのルートを間引くことがあります。その後パッケージを再インストールするときに、ダウンロードが必要になる場合があります。

| キャッシュ | 対象のルート |
|---|---|
| Yarn Berry | `~/.yarn/berry/cache` |
| npm | `~/.npm/_cacache` |
| npx | `~/.npm/_npx` |
| pnpm store | `~/.local/share/pnpm/store` |
| pnpm cache | `~/.cache/pnpm` |
| bun | `~/.bun/install/cache` |
| deno | `~/.cache/deno` |
| Composer | `~/.cache/composer` |
| pip | `~/.cache/pip` |

Yarn v1 の展開済みパッケージは、`~/.cache/yarn` の中でエントリ単位で間引かれます。グローバルにインストールしたパッケージや、パッケージマネージャー本体のインストール先は、これらのキャッシュとは別です。

## ブラウザーとアプリケーションのキャッシュ {#browser-and-application-caches}

通常の対象には、設定されたブラウザーのキャッシュ、Gradle のバージョン単位、Cypress と Playwright のバイナリ、TypeScript のウォッチャーのキャッシュが含まれます。ブラウザーやビルドツールは、次に使うときに削除された内容を再構築または再ダウンロードすることがあります。現在の Gradle ディストリビューションと現在の Android Studio のバージョンは、それぞれのルールで残します。条件を満たす古い単位はまとめて削除し、途中まで消えたインストールを残しません。

ファイル単位で間引く前に、モードは最終アクセスと最終更新の時刻を確認します。アクセス時刻が信頼できないファイルシステムでは、経過日数による間引きは行いません。`--purge-all` はこの日数の関門を外すもので、別途の判断が必要です。

## 開発ツールのデータ {#developer-tool-data}

スキャンには、Android の AVD、Flutter の pub キャッシュ、Flatpak のユーザーデータなど、大きなルートが表示されることがあります。**スキャンに表示されたパスを `--all-safe` が削除するとは限りません。** 選んだモードが実際に何を対象にするかは、そのモードのページとドライランの出力で確認してください。Android エミュレーターとインストール済みの Flatpak アプリは、通常のキャッシュではありません。

## エディター拡張機能 {#editor-extensions}

`--editor-ext` は、置き換えられた VS Code と Cursor の拡張機能のバージョンを対象にします。新しいバージョンがあり、古いバージョンが使われていないことが条件で、現在のバージョンは残します。[エディター拡張機能](../modes/editor-extensions.md)を参照。

## プロジェクトと個人ファイル — 対話式のみ {#project-and-personal-files--interactive-only}

長く使われていないプロジェクトの `node_modules`、途中で止まったダウンロード、大きく長期間使われていない個人ファイルの候補は、それぞれ別の対話式モードで扱います。`--yes` ではこれらのモードは承認されません。途中のダウンロードや `~/Downloads` のファイルが、手元にある唯一のコピーかもしれません。確定する前に、各パスとその結果を読んでください。

## システムのクリーンアップ（sudo が必要） {#system-cleanup-requires-sudo}

`--system` は、apt、ジャーナル、Snap、`/tmp`、ページキャッシュの各手順の前に確認します。パッケージ関連のコマンドは `apt` と `dpkg` を使い、Fedora、Arch、openSUSE には対応しません。カーネルの手順はインストール済みのバージョンを一覧にするだけで、直接削除はしません。ジャーナルの整理は 100 MB を目標にし、`/tmp` の経過日数は `--days` に関係なく 7 日です。ページキャッシュの解放はディスク容量ではなく RAM に影響します。[システムのクリーンアップ](../modes/system-cleanup.md)と[対応ディストリビューション](../distro-support.md)を参照。

## 削除を拒否するもの {#what-it-refuses-to-delete}

安全装置は、ルートと、`~/Documents`、`~/Pictures`、`~/.ssh`、`~/.config`、`~/.claude` などの保護されたホームのパスを拒否します。正確な一覧と例外は[保護パス](../reference/protected-paths.md)にあります。`--self-test` は、インストール済みのコピーで一部の拒否ケースを確認します。

本番の削除は元に戻せません。クリーンアップの前に進める順番は[削除前のプレビュー](./preview-first.md)で説明しています。
