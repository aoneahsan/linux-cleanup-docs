---
sidebar_position: 2
title: インストールと更新
description: linux-cleanup のデスクトップアプリを AppImage または .deb でインストールする方法と、自動更新のしくみ。
---

# インストールと更新

最新のリリースは[ダウンロードページ](https://linux-cleanup.aoneahsan.com/download)から入手できます。どのリリースも `desktop-v<version>` のタグで [GitHub Releases](https://github.com/aoneahsan/linux-cleanup/releases) にもあります。リリースごとにインストーラーが 2 つあります。

| ファイル | 対象 |
|---|---|
| `linux-cleanup_<version>_amd64.AppImage` | デスクトップ環境のあるディストリビューションなら何でも。実行権限を付けてから起動します |
| `linux-cleanup_<version>_amd64.deb` | Debian、Ubuntu とその派生 (`sudo apt install ./linux-cleanup_<version>_amd64.deb`) |

```bash
chmod +x linux-cleanup_*_amd64.AppImage
./linux-cleanup_*_amd64.AppImage
```

バージョン 1.0.4 から、AppImage は初回の起動時にアプリケーションメニューに自身を追加します。`~/.local/share/applications/linux-cleanup-desktop.desktop` と、`~/.local/share/icons/hicolor/` の下にアイコンを書き込み、メニューの項目がファイルのある場所を指すようにします。AppImage を移動したら、新しい場所から一度起動すれば項目も追従します。`.deb` は自前のメニュー項目をインストールします。

デスクトップアプリには WebKitGTK 4.1 と GTK 3 が必要です。現在のデスクトップ向けディストリビューションには入っています。`.deb` はこれらを依存関係として宣言しています。

## 更新のしくみ {#how-it-updates}

アプリは自動で更新されます。起動したとき、ウィンドウが再び表示されたとき、そして新しいリリースが公開された瞬間に、署名付きの更新を確認します。**アップデートを自動でインストール** がオン（既定）なら、更新をダウンロードして署名を確かめ、落ち着いたときに再起動します。実行中に再起動することはありません。

**AppImage** はその場で置き換えられます。**`.deb`** でのインストールは `dpkg` で更新されるため、デスクトップが先に管理者のパスワードを求めます（いつものグラフィカルな確認です）。キャンセルすれば今のバージョンのまま動き続けます。

リリースが**必須**になっていることもあります。

- **緊急**のリリースはアプリをすぐに止め、理由を示し、**更新** ボタンを 1 つだけ表示します。
- **通常**のリリースは新しいバージョンが出たことを知らせ、次の起動から必須になります。

確認のときにオフラインでもアプリはそのまま動きます。確認に失敗しても実行が妨げられることはありません。
