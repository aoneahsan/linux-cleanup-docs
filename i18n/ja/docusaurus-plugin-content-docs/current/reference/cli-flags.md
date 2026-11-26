---
title: CLI のフラグ
description: linux-cleanup のすべてのコマンドラインフラグ（モード、オプション、別名、既定値）と、それぞれの働きと詳しい説明のページ。
tags: [cli, flags, reference, options, commands]
sidebar_position: 1
---

# CLI のフラグ

**linux-cleanup が受け付けるすべてのフラグです。** モードは同時に使えないので 1 つだけ渡してください。オプションはどのモードとも組み合わせられます。

```bash
linux-cleanup --help    # 同じ一覧を、あなたのマシンの実際のパスで表示
```

認識できないフラグはヘルプを表示し、コード `2` で終了します。

## モード {#modes}

渡すのは 1 つまでです。何も渡さなければ[ガイド付きの手順](../modes/walkthrough.md)になります。

| フラグ | 別名 | 働き | 詳しいページ |
|---|---|---|---|
| _（なし）_ | `-w` `--walkthrough` | 10 の手順を案内し、各手順の前に確認する | [ガイド付きの手順](../modes/walkthrough.md) |
| `-m` | `--menu` `-i` `--interactive` | 番号で直接移動できるメニュー | [メニュー](../modes/menu.md) |
| `-t` | `--tui` `-g` `--gui` | whiptail / dialog の画面メニュー | [TUI](../modes/tui.md) |
| `-a` | `--all-safe` | 作り直せるキャッシュをまとめて掃除 | [完全安全](../modes/all-safe.md) |
| `-s` | `--scan` | すべての分類を読み取りのみで監査 | [スキャン](../modes/scan.md) |
| `-p` | `--stale` | 大きく使われていない個人ファイル（対話式） | [使われていない個人ファイル](../modes/personal-stale-files.md) |
| | `--system` | apt、ジャーナル、snap、`/tmp`、ページキャッシュ（sudo） | [システムのクリーンアップ](../modes/system-cleanup.md) |
| | `--partials` | 取り残された途中のダウンロード（対話式） | [途中の・持ち主のないダウンロード](../modes/partial-downloads.md) |
| | `--audit` | `$HOME` の大きいもの上位 20 件 | [ホームの監査](../modes/home-audit.md) |
| | `--node-modules` | 使われていない `node_modules`（対話式） | [使われていない node_modules の検出](../modes/node-modules-finder.md) |
| | `--globals` | グローバルパッケージを読み取りのみで監査 | [グローバルパッケージの監査](../modes/globals-audit.md) |
| | `--doctor` | ランタイムに足りないシェルの初期化を修復 | [Doctor](../modes/doctor.md) |
| | `--speed` | 負荷と起動時の処理を調べ、変更の前に確認する | [速度の診断](../modes/speed.md) |
| | `--editor-ext` | 置き換え済みの VS Code / Cursor のバージョン | [エディター拡張機能](../modes/editor-extensions.md) |
| | `--reports` | セッション記録の対話式の管理 | [レポート](../modes/reports.md) |
| | `--export FMT ID` | 記録の対話なしの変換 | [レポート](../modes/reports.md#exporting) |
| | `--feedback` | 不具合報告の案内と、任意の mailto の下書き | [不具合を報告する](../guides/send-a-bug-report.md) |
| | `--debug-bundle` | 最新のログと記録を tar.gz にまとめる | [不具合を報告する](../guides/send-a-bug-report.md) |
| | `--list-targets` | 対象にできるパスと保護パスをすべて表示 | [削除前のプレビュー](../safety/preview-first.md) |
| | `--self-test` | 依存関係、構文、安全の関門を確認 | [削除前のプレビュー](../safety/preview-first.md) |
| `-V` | `--version` | バージョンと作者 | — |
| | `--install-alias` | シェルのエイリアス `cleanup` を追加 | [シェルのエイリアスと毎週の cron](../guides/alias-and-cron.md) |
| | `--install-cron` | 毎週日曜 03:00 に `--all-safe -y` | [シェルのエイリアスと毎週の cron](../guides/alias-and-cron.md) |
| | `--uninstall-alias` | エイリアスを削除 | [アンインストール](../guides/uninstall.md) |
| | `--uninstall-cron` | cron の行を削除 | [アンインストール](../guides/uninstall.md) |
| | `--refresh-app` | エイリアスと cron が使う常設のコピーを更新 | [インストール](../getting-started/installation.md) |

## オプション {#options}

| フラグ | 既定値 | 効果 |
|---|---|---|
| `-d N` `--days N` | `100` | アイドルのしきい値。`atime` と `mtime` の**両方**がこれを超えたファイルだけが対象です。小さいほど積極的になります |
| `--purge-all` | オフ | **アイドルの関門を無効にします。** 対象のキャッシュを丸ごと消します（1.2.0 より前の動き） |
| `-y` `--yes` | オフ | 作り直せるキャッシュを自動で承認します。`--all-safe` と一緒のときだけ有効です。**個人データのモードは無視します** |
| `--no-report` | オフ | JSON を作りません。ログは書き出します |
| `--cleanup-logs` | オフ | 終了時にその回のログを削除します。**記録は必ず残します** |
| `-n` `--dry-run` | オフ | 選んだモードをたどりますが、ファイルの削除も設定の変更もしません。ローカルのログは残り、JSON のセッションレポートは書きません |
| `--json-events` | オフ | `--scan` か `--all-safe --yes` のとき、stdout に [機械で読めるイベント](./json-events.md) を出します。人が読むテキストは stderr に出します |
| `--no-color` | オフ | ANSI の色を消します。`NO_COLOR` にも従います |
| `-h` `--help` | — | ヘルプを表示して終了 |

:::danger `--purge-all` は安全の関門を 1 つ外します
[アイドルの関門](../safety/guards.md#guard-2--the-staleness-gate)を無効にするので、最後にいつ使ったかに関係なくキャッシュを丸ごと消します。Gradle wrapper の配布物、Playwright のブラウザー、Cypress のバイナリなど、取り直しに手間のかかるものも一緒に消えます。実行前の表示で、どの方針が有効かがわかります。
:::

:::note スキャンとドライランは答える問いが違います
[`--scan`](../modes/scan.md) は現在のパスとサイズを読み取ります。`--dry-run` は選んだクリーンアップをたどり、削除せずに予定の操作を表示します。[削除前のプレビュー](../safety/preview-first.md)を参照。
:::

## よく使う組み合わせ {#recipes}

| 目的 | コマンド |
|---|---|
| インストールを確認する | `linux-cleanup --self-test` |
| 取り戻せる容量を見る | `linux-cleanup --scan` |
| 選んだキャッシュの掃除をプレビューする | `linux-cleanup --all-safe --dry-run` |
| 読み取りのみのスキャンを JSON イベントで出す | `linux-cleanup --scan --json-events` |
| 触れる可能性のあるパスをすべて見る | `linux-cleanup --list-targets` |
| ガイド付きで掃除する | `linux-cleanup` |
| 確認なしで一度にまとめて掃除する | `linux-cleanup --all-safe -y` |
| 積極的に掃除する | `linux-cleanup --all-safe -y -d 30` |
| 入れ直す前にできるだけ取り戻す | `linux-cleanup --all-safe -y --purge-all` |
| 画面メニュー | `linux-cleanup --tui` |
| 古いプロジェクトの依存関係のディレクトリ | `linux-cleanup --node-modules -d 90` |
| システムの保守 | `linux-cleanup --system` |
| 毎週の自動実行 | `linux-cleanup --install-cron` |
| 最新の記録を HTML に変換する | `linux-cleanup --export html latest` |
| 不具合を報告する | `linux-cleanup --debug-bundle && linux-cleanup --feedback` |

## 環境変数 {#environment-variables}

よく使うものです。[一覧](./environment-variables.md)は別ページにあります。

| 変数 | 効果 |
|---|---|
| `NO_COLOR` | 空でない値なら何でも色を消す |
| `LINUX_CLEANUP_LOG_DIR` | ログのディレクトリを上書き |
| `LINUX_CLEANUP_REPORTS_DIR` | セッション記録のディレクトリを上書き |
| `LINUX_CLEANUP_DATA_HOME` | ログ、記録、フィードバック用バンドルの親 |

## 終了コード {#exit-codes}

| コード | 意味 |
|---|---|
| `0` | 正常に終了 |
| `2` | 引数の解析エラー、またはイベント出力に対応していないモード |
| `3` | リリース記録で止められた古いバージョン |
| `130` | `Ctrl-C` で中断 |
| `143` | `SIGTERM` で終了 |
| その他 | 予期しない終了 — クラッシュ用バンドルを書く |

一覧とクラッシュ時の処理のしくみ：[終了コード](./exit-codes.md)。
