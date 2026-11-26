---
sidebar_position: 3
title: スケジュール
description: systemd のユーザータイマーとしてスケジュールしたドライランと完全安全のクリーンアップ。
---

# スケジュール

スケジュールは Pro と Team のプランで使えます。スケジュールは、`~/.config/systemd/user/` にある `linux-cleanup-schedule-<id>.timer` と `.service` という**systemd のユーザーユニット**の組です。ドライランか完全安全のクリーンアップを、毎日、毎週、または毎月の決まった日（1〜28 日）に実行します。

タイマーは `Persistent=true` を使います。決めた時刻にコンピューターの電源が切れていた場合は、次のログイン時に実行します。スケジュールした実行は、イベントの出力を `~/.linux-cleanup/schedule-runs/` に書き込み、次にアプリを開いたときにそれがレシートになります。

AppImage のファイルはアプリを閉じると消えてしまうため、スケジュールは `~/.linux-cleanup/desktop-engine/` にある同梱の CLI のコピーを実行します。アプリは起動のたびにこのコピーを更新するので、タイマーが動かすのは常にアプリに同梱されたバージョンです。

ターミナルからタイマーを確認したり止めたりするには：

```bash
systemctl --user list-timers 'linux-cleanup-schedule-*'
systemctl --user disable --now linux-cleanup-schedule-<id>.timer
```
