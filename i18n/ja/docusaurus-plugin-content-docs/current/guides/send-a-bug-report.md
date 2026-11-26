---
title: 不具合を報告する
description: linux-cleanup の不具合の報告方法。デバッグ用バンドルの作り方、クラッシュ用バンドルの中身、送る前に確認すること、送り先。
tags: [guide, bug-report, feedback, debug-bundle, crash, privacy]
sidebar_position: 3
---

# 不具合を報告する

**メンテナーが必要とするものは 2 つのコマンドでそろいます。** 何も自動では送信されません。バンドルの中身を確認し、自分で送ってください。

```bash
linux-cleanup --debug-bundle    # 最新のログとセッション記録をまとめる
linux-cleanup --feedback        # 案内と、任意の mailto の下書き
```

## 手早い方法 {#the-quick-path}

```bash
linux-cleanup --debug-bundle
```

`~/.linux-cleanup/feedback/debug-bundle-<timestamp>.tar.gz` を書き出します。中身は次のとおりです。

- 最新のセッションログ
- 最新の JSON セッション記録（ある場合）
- ディストリビューション、カーネル、bash のバージョン、セルフテストの出力を記した `MANIFEST.txt`

続いて：

```bash
linux-cleanup --feedback
```

含めるべき内容を表示し、システム情報を記入済みの `mailto:` の下書きを開くことを提案します。

## 送る前にバンドルを確認する {#review-the-bundle-before-sending-it}

:::caution バンドルにはこのマシンのパスが含まれます
ファイルの中身は含みませんが、ログには触れたパスがすべて記録されます。ディレクトリ名、プロジェクト名、ときには `~/Downloads` のファイル名も含まれます。

先に確認してください。

```bash
tar -tzf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz     # 中身の一覧
tar -xzOf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz    # 全文を読む
```

知られたくないものがあれば、バンドルを展開してそのファイルを削除するか伏せ、もう一度アーカイブしてください。マニフェストと関係する行だけを送ってもかまいません。
:::

## クラッシュ用バンドル {#crash-bundles}

[1.3.0](../changelog.md#130--2026-05-10) から、想定外に 0 以外のコードで終了すると、同じディレクトリに `crash-<timestamp>.tar.gz` を自動で書き出し、そのパスを表示します。

中身は、実行中のログ、最新の記録、終了コードを含むシステムのマニフェストです。

**バンドルはアップロードされません。** リリースの確認は公開のテキストファイルを読むだけで、バンドルやローカルのパスは送りません。共有するかどうかを決めるまで、バンドルはディスクに残ります。

想定どおりの終了ではクラッシュ用バンドルは作られ**ません**。`0`、`130`（`Ctrl-C`）、`143`（SIGTERM）、`2`（引数の誤り）は対象外です。[終了コード](../reference/exit-codes.md#how-the-crash-trap-decides)を参照。

## 含める内容 {#what-to-include}

よい報告は短く具体的です。

| 含めるもの | 例 |
|---|---|
| ディストリビューションとバージョン | `lsb_release -d` |
| Bash のバージョン | `bash --version \| head -1` |
| ツールのバージョン | `linux-cleanup --version` |
| 実行したコマンドそのもの | `linux-cleanup --all-safe -y -d 30` |
| 期待した結果と実際の結果 | 「Gradle wrapper は残るはずが、削除された」 |
| バンドル | tar.gz を添付 |

いちばん役に立つのは**期待した結果と実際の結果**です。ログだけでは何が起きたかはわかっても、なぜおかしいと思ったのかはわかりません。

## 送り先 {#where-to-send-it}

| 窓口 | 用途 |
|---|---|
| [GitHub issues](https://github.com/aoneahsan/linux-cleanup/issues) | 不具合と機能の要望。おすすめで、公開されます |
| [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) | 公開したくない内容 |
| プルリクエスト | 修正をお持ちの場合。MIT ライセンスで、フォークも歓迎します |

説明だけの機能要望もコードと同じく歓迎します。何を掃除してほしいのか、なぜ今のモードでは足りないのかを書いてください。

## すぐに報告してほしい不具合 {#bugs-worth-reporting-immediately}

記載された安全モデルと食い違うことすべて：

- [保護パス](../reference/protected-paths.md)の中での削除
- 置き換え済みではなく*現在の*エディター拡張機能のバージョンが消えた
- `--purge-all` なしで、`--days` より新しいファイルが削除された
- 個人データのモードが確認なしに動いた
- ローカルのクリーンアップのパスやレポートを送るネットワーク通信

どれも、単に不便なのではなく安全モデルの違反です。

## プライバシー：マシンの外に出るもの {#privacy-what-leaves-your-machine}

:::note リリースの確認とローカルのレポート
起動時、オンラインなら linux-cleanup は HTTPS で公開リリース記録を 1 件読み込みます。スキャン結果、ログ、クラッシュ用バンドルはアップロードしません。コピーのインストールや更新では npm または GitHub を使います。

クローンで確かめられます。

```bash
grep -rE 'curl|wget|http://|https://' cleanup.sh lib/ modules/ bin/
```

リリースの取得と、新しいコピー向けに案内するコマンドは `modules/update_check.sh` で確認できます。
:::

ログ、記録、バンドルはローカルのファイルです。メンテナーには見えず、修正をあなたのマシンに送り込むこともできません。新しいバージョンが届くのは、`npx` をもう一度実行するかアップグレードしたときです。

## 次へ {#next}

- [トラブルシューティング](../troubleshooting.md) — まずここを確認
- [復旧](../recovery.md) — データを失った場合
- [終了コード](../reference/exit-codes.md)
