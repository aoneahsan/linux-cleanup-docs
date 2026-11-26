---
title: よくある質問
description: linux-cleanup のパス、リリースの確認、ドライラン、完全な削除、対応ディストリビューションについての回答。
tags: [faq, questions, safety, privacy, licence]
sidebar_position: 93
---

# よくある質問

症状ごとの問題は[トラブルシューティング](./troubleshooting.md)に、設計の理由は[安全装置](./safety/guards.md)にあります。

## 自分のコードが削除されますか？ {#will-it-delete-my-code}

**ソースファイルは削除されません。** `~/Documents` などの個人用ディレクトリは[例外なく保護](./reference/protected-paths.md)されており、プロジェクトのソースを指すクリーンアップ対象はありません。

いちばん近いのは、プロジェクトのルートにある使われていない `node_modules` を探すことです。これは[対話式のみ](./modes/node-modules-finder.md)でプロジェクトごとに確認し、`yarn install` で作り直せます。

1 つだけ注意があります。パッチツールを使わず `node_modules` の*中の*ファイルを直接書き換えた場合、その変更はほかのどこにも残っていません。

## 外部にデータを送りますか？ {#does-it-phone-home}

**オンライン時、CLI は起動時に HTTPS で公開リリース記録を確認します。** スキャン結果、クリーンアップのパス、クラッシュ用のバンドルは送りません。オフラインなら確認をスキップして実行を続けます。

クローンで自分で確かめられます。

```bash
grep -rE 'curl|wget|http://|https://' cleanup.sh lib/ modules/ bin/
```

リリースの確認は `modules/update_check.sh` にあるので、このファイルも確認してください。インストールや更新の適用では npm か GitHub を使います。フィードバック機能は下書きを開くだけで、送るかどうかはあなたが決めます。

## なぜ元に戻す機能がないのですか？ {#why-is-there-no-undo}

元に戻すためのログは、空けたいディスクそのものへの書き込みを増やします。20 GB を空けるために 20 GB を残しても意味がありません。誤った安心感も生み、取り消しはせいぜい部分的にしかできません。

安全モデルは予防に重点を置いています。パスの許可リスト、アイドルしきい値、対話式の確認です。詳しい理由：[削除は元に戻せない](./safety/irreversibility.md)。

## `--dry-run` はありますか？ {#is-there-a---dry-run}

**あります。** `--scan` は読み取りのみ、`--dry-run` は選んだクリーンアップをファイルの削除も設定の変更もせずにたどります。ドライランでもローカルのログは残り、JSON のセッションレポートは書き出しません。[削除前のプレビュー](./safety/preview-first.md)を参照。

## いちばん安全な試し方は？ {#what-is-the-safest-way-to-try-it}

```bash
linux-cleanup --self-test      # 安全装置が実際に働くか確認
linux-cleanup --scan           # 読み取り専用。取り戻せる量を表示
linux-cleanup --list-targets   # 触れる可能性のあるすべてのパス
linux-cleanup --all-safe --dry-run  # キャッシュのクリーンアップをプレビュー
```

ここまでで、1 バイトも失わずに安全モデルが動くところを確かめられます。そのあと `linux-cleanup` を実行し、意外に思ったものにはすべて `n` と答えてください。

## パソコンが速くなりますか？ {#will-it-speed-up-my-computer}

少しだけ、ときどきです。正直に言えば、ごくわずかです。

- 拡張機能のディレクトリが 50 から 12 ほどになると、VS Code の起動が少し速くなります
- 小さなキャッシュは、膨らんだキャッシュよりわずかに速くたどれます
- ブラウザーのコールドスタートは変わりません。キャッシュはキーと値の形で、検索は O(1) です
- ページキャッシュの解放で空くのはディスクではなく RAM で、カーネルがすぐにまた埋めます

本当の利点は、「ディスクがいっぱい」で作業が止まらなくなることです。ベンチマークの数字ではありません。

## クリーンアップの途中で `Ctrl-C` を押すとどうなりますか？ {#what-if-i-press-ctrl-c-mid-cleanup}

実行中の削除は完了します（たいてい 1 秒よりずっと短い時間です）。そのあとスクリプトはコード `130` で終了します。その時点までの内容はログに残ります。[クラッシュ時の処理は `130` を意図して無視する](./reference/exit-codes.md)ので、クラッシュ用のバンドルは作られません。

## root で実行できますか？ {#can-i-run-it-as-root}

できますが、すべきではありません。一般ユーザーで動かす前提で作られており、root で実行しても、万一不具合が安全装置をすり抜けたときの被害が広がるだけです。正当な sudo の用途は、[`--system`](./modes/system-cleanup.md) が確認済みのコマンドを 1 つずつ使って内部で扱います。

## 自分のディストリビューションで動きますか？ {#does-it-work-on-my-distro}

`$HOME` 内のキャッシュのクリーンアップは、**どの** Linux ディストリビューションでも動きます。

[`--system`](./modes/system-cleanup.md) は **Debian と Ubuntu 専用**です。ディストリビューションを判定せずに `apt` と `dpkg` を呼び出します。Fedora、Arch、openSUSE ではパッケージの手順が失敗しますが、ジャーナル、`/tmp`、ページキャッシュの手順は動きます。[対応ディストリビューション](./distro-support.md)を参照。

## WSL ではどうですか？ {#what-about-wsl}

CLI は Linux 側で動きます。クリーンアップの前に、Linux のホームから `/mnt/c/` へのシンボリックリンクを確認してください。許可リストはシンボリックリンクを解決しますが、Windows の `Documents` のパスが Linux のホームのルールで自動的に守られるわけではありません。

## なぜ Python、Go、Rust ではなく bash なのですか？ {#why-bash-rather-than-python-go-or-rust}

対象とするシステムには Bash がすでに入っています。コンパイル済みのバイナリでは、利用者が簡単に中身を確かめられないものを配ることになります。Python や Node で作れば、ディスクから物を消すことが仕事のすべてのツールに、実行環境への依存が加わります。

スクリプトはコメント付きの bash で数千行ほどで、経験のあるエンジニアなら半日で読めます。`sudo` が使える状態で `rm -rf` を実行するツールでは、使いやすさよりも監査できることのほうが価値があります。

## どのくらいの頻度で実行すればよいですか？ {#how-often-should-i-run-it}

| モード | 頻度 |
|---|---|
| [`--scan`](./modes/scan.md) | 毎月、基準として |
| [`--all-safe -y`](./modes/all-safe.md) | 毎週 — [自動化する](./guides/alias-and-cron.md) |
| [`--system`](./modes/system-cleanup.md) | 四半期ごとに手動で |
| [`--node-modules`](./modes/node-modules-finder.md) | 年に一度、個人プロジェクトがたまってきたら |
| [`--editor-ext`](./modes/editor-extensions.md) | エディターが遅く感じたとき（`--all-safe` でも扱う） |
| [`--stale`](./modes/personal-stale-files.md) | 四半期ごとに、慎重に |
| [`--doctor`](./modes/doctor.md) | `command not found` が出たとき |
| [`--globals`](./modes/globals-audit.md) | Node の入れ直しやマシンの移行の前 |

## `--purge-all` は何のためのものですか？ {#what-is---purge-all-for}

[アイドルしきい値](./safety/guards.md#guard-2--the-staleness-gate)を無効にし、使われていないファイルを間引くのではなく、キャッシュを丸ごと消去します。まだ使うかもしれない Gradle wrapper のディストリビューション、Playwright のブラウザー、Cypress のバイナリも含まれます。

マシンを入れ直す前には正しい選択ですが、それ以外の既定としては不適切です。cron のジョブとは決して組み合わせないでください。

## どのバージョンを入れればよいですか？ {#which-version-should-i-install}

現在公開中のバージョンは [npm のパッケージ](https://www.npmjs.com/package/linux-cleanup)で確認し、手元のコピーは `linux-cleanup --version` で確認してください。アップグレードの前に[変更履歴](./changelog.md)を読んでください。

## ライセンスは何ですか？ {#what-licence-is-it-under}

1.4.0 から **[MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)** です。寛容で OSI の承認を受けたライセンスです。個人でも商用でも使え、改変、フォーク、組み込み、再配布ができます。条件は著作権表示と許諾表示を残すことだけです。

「AS IS」（現状のまま）で提供され、保証はありません。1.4.0 より前に公開したリリースは、公開時のライセンスのままです。

## 機能の要望や不具合の報告はどうすればよいですか？ {#how-do-i-request-a-feature-or-report-a-bug}

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

そのうえで [GitHub の issue](https://github.com/aoneahsan/linux-cleanup/issues) を作るか、[aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) にメールしてください。MIT のもとでのプルリクエストを歓迎します。説明だけの機能要望も同じく歓迎です。[不具合を報告する](./guides/send-a-bug-report.md)を参照。

## 決してしないことは何ですか？ {#what-will-it-never-do}

- [保護パスの一覧](./reference/protected-paths.md)にあるものの削除
- ファイルごとの確認なしに個人データに触れること
- スキャン結果、クリーンアップのパス、クラッシュ用のバンドルの自動アップロード
- サービス、デーモン、バックグラウンドのエージェントのインストール
- シェルの設定にある既存の行の変更や削除
- 削除したものの復元
