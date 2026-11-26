---
sidebar_position: 6
title: アプリのトラブルシューティング
description: AppImage が起動しない、サインインが終わらない、アカウントのサーバーにつながらない、スケジュールが動かなかった、といった場合。
---

# アプリのトラブルシューティング

アプリの **ヘルプ › エラーとオフライン** の画面でも、同じケースをそれぞれのボタンつきで扱っています。このページはその詳しい版です。

## AppImage が開かない {#the-appimage-does-not-open}

- **ダブルクリックしても何も起きない。** ファイルに実行権限が必要です：`chmod +x linux-cleanup_*_amd64.AppImage`。
- **FUSE に関するエラーが出る。** AppImage は FUSE 2 で自身をマウントします。Ubuntu 22.04 以降は既定では入っていません：`sudo apt install libfuse2`（Ubuntu 24.04 では `libfuse2t64`）。入れない場合は `./linux-cleanup_*_amd64.AppImage --appimage-extract-and-run` でも実行できます。
- **WebKitGTK や `libwebkit2gtk-4.1` に関するエラーが出る。** ウィンドウにはディストリビューションの WebKitGTK 4.1 が必要です。Debian と Ubuntu では `.deb` が一緒に入れます。AppImage の場合は `libwebkit2gtk-4.1-0` をインストールしてください。

## 同梱の CLI が見つからないと表示される {#the-app-says-the-bundled-cli-is-missing}

アプリは起動時に自分の `cleanup.sh` のコピーを確認します。この確認に失敗した場合、インストールが壊れています。[ダウンロードページ](https://linux-cleanup.aoneahsan.com/download)からリリースをもう一度ダウンロードしてください。入れ直してもレシート、レポート、ログには影響しません。

## サインインが終わらない {#sign-in-does-not-finish}

サインインはブラウザーで行い、`127.0.0.1` を通じてアプリに戻ります。ブラウザーに結果が出ているのにアプリが先に進まない場合は、ファイアウォールやブラウザーの拡張機能がローカルのアドレスを止めている可能性があります。サインインに失敗しても何も変わりません。**Google でサインイン** をもう一度押せます。

## アカウントのサーバーが応答しない {#the-account-server-does-not-answer}

ドライラン、本番実行、レシート、スケジュールはインターネットを必要としません。オフラインの間も、アプリはこのコンピューターの月の回数で本番実行を数え続け、サーバーが応答するようになったら同期します。待たされるのはプランの変更と履歴の同期だけです。

## スケジュールが動かなかった {#a-schedule-did-not-run}

```bash
systemctl --user list-timers 'linux-cleanup-schedule-*'
journalctl --user -u 'linux-cleanup-schedule-*' --since today
```

タイマーが動くのはログインしている間だけです。電源が切れていて逃した実行は、次のログイン時に行われます。実際に始まった実行はそれぞれ `~/.linux-cleanup/schedule-runs/` に出力を残し、次にアプリを開いたときにレシートになります。
