---
title: モードの概要
description: linux-cleanup のすべてのモードを働きごとにまとめました。読み取り専用の確認、ガイド付き・一括のクリーンアップ、対話式の個人データのモード、出力と修復の補助。
sidebar_position: 1
---

# モードの概要

**linux-cleanup の入口は 1 つで、モードはフラグ 1 つで選びます。** フラグなしで実行すると[ガイド付きの手順](./walkthrough.md)になります。

モードは同時に使えません。1 つだけ指定してください。`--days` や `--yes` などのオプションは組み合わせて使えます。

## 読み取り専用 — 何も削除しない {#read-only--never-deletes-anything}

これらのモードはクリーンアップの対象を削除しません。ただし、ローカルのログを書き出すことがあり、オンライン時にはリリースの確認で公開記録を読むことがあります。

| モード | フラグ | 表示する内容 |
|---|---|---|
| [スキャン](./scan.md) | `-s` `--scan` | キャッシュの全カテゴリーと現在のサイズ |
| [ホームの監査](./home-audit.md) | `--audit` | `$HOME` で最も大きい 20 項目 |
| [グローバルパッケージの監査](./globals-audit.md) | `--globals` | npm/pnpm/yarn/bun/deno のグローバルパッケージ |
| 対象の一覧 | `--list-targets` | ツールが触れうるすべてのパスと保護リスト |
| セルフテスト | `--self-test` | 依存関係、構文、安全装置の確認 |
| バージョン | `-V` `--version` | バージョンと作者 |

## クリーンアップ — 再生成できるデータ {#cleanup--regenerable-data}

これらのモードはクリーンアップの対象を削除できます。`--yes` で一括の確認を省けるのは `--all-safe` だけで、ほかのモードは独自の確認を残します。

| モード | フラグ | 動作 |
|---|---|---|
| [ガイド付きの手順](./walkthrough.md) | _(既定)_ `-w` | 10 の手順で、それぞれの前に確認 |
| [メニュー](./menu.md) | `-m` `--menu` | 番号付きメニュー — カテゴリーを 1 つ選ぶ |
| [TUI](./tui.md) | `-t` `--tui` | 同じものを whiptail/dialog の画面で |
| [完全安全](./all-safe.md) | `-a` `--all-safe` | 再生成できるキャッシュをすべて 1 回で |
| [エディター拡張機能](./editor-extensions.md) | `--editor-ext` | 置き換えられた VS Code / Cursor のバージョン |
| [システムのクリーンアップ](./system-cleanup.md) | `--system` | apt、ジャーナル、snap、`/tmp`、ページキャッシュ — `sudo` が必要 |

## クリーンアップ — 対話式のみ {#cleanup--interactive-only}

個人やプロジェクトのデータです。これらは **`--yes` を無視し**、項目ごとの確認が必要です。[関門 3](../safety/guards.md#guard-3--personal-data-is-interactive-only)を参照。

| モード | フラグ | 見つけるもの |
|---|---|---|
| [使われていない個人ファイル](./personal-stale-files.md) | `-p` `--stale` | `~/Downloads` と設定された非保護ルートにある大きな未使用のファイル |
| [途中のダウンロード](./partial-downloads.md) | `--partials` | `.fdmdownload`、`.crdownload`、`.part` |
| [node_modules の検出](./node-modules-finder.md) | `--node-modules` | N 日以上使われていないプロジェクトの依存ディレクトリ |

## 出力、修復、設定 {#output-repair-and-setup}

| モード | フラグ | 目的 |
|---|---|---|
| [レポート](./reports.md) | `--reports` | 過去のセッションレポートの一覧、変換、閲覧 |
| [書き出し](./reports.md#exporting) | `--export FMT ID` | 対話なしの変換 |
| [Doctor](./doctor.md) | `--doctor` | nvm、pnpm、bun、deno、cargo の壊れたシェル初期化を直す |
| [速度の診断](./speed.md) | `--speed` | 負荷と起動時の処理を測る。任意の修正は個別に確認 |
| フィードバック | `--feedback` | 不具合報告の案内と、任意の mailto の下書き |
| デバッグ用バンドル | `--debug-bundle` | 最新のログとレポートを tar.gz にまとめる |
| エイリアスの導入 | `--install-alias` | シェルのエイリアス `cleanup` を追加 |
| cron の導入 | `--install-cron` | 毎週日曜 03:00 に `--all-safe -y` |
| エイリアス / cron の削除 | `--uninstall-alias` `--uninstall-cron` | どちらかを取り除く |

## モードの選び方 {#choosing-a-mode}

| 目的 | モード |
|---|---|
| ツールを初めて使う | `--self-test`, `--scan`, `--all-safe --dry-run` |
| 今すぐ空きを作る（自分で確認しながら） | _(既定のガイド付きの手順)_ |
| 今すぐ空きを作る（確認なし） | `--all-safe -y` |
| 特定のカテゴリーを 1 つ | `--menu` / `--tui` |
| 毎週の無人メンテナンス | `--all-safe -y` + `--install-cron` |
| OS の入れ直し前にできるだけ取り戻す | `--all-safe -y --purge-all` |
| ディスクを食っているものを探す | `--audit`, `--scan` |
| 古い個人プロジェクトがたまってきた | `--node-modules` |
| インストール後に `command not found` | `--doctor` |

## モードと組み合わせるオプション {#options-that-combine-with-modes}

| オプション | 既定 | 効果 |
|---|---|---|
| `-d N` `--days N` | 100 | アイドルしきい値。小さいほど積極的 |
| `--purge-all` | オフ | アイドルしきい値を無効にする — 全消去 |
| `-y` `--yes` | オフ | 再生成できるキャッシュを自動承認。`--all-safe` 専用 |
| `--no-report` | オフ | JSON レポートを作らない。ログは書き出す |
| `--cleanup-logs` | オフ | 終了時にこの回のログを削除。レポートは常に残す |
| `--no-color` | オフ | ANSI の色を無効にする。`NO_COLOR` にも従う |
| `-n` `--dry-run` | オフ | 選んだクリーンアップを削除せずにたどる。ローカルのログと更新チェックの状態は書き込むことがある |
| `--json-events` | オフ | `--scan` または対話なしの `--all-safe --yes` で NDJSON を出力 |

詳しくは [CLI フラグ](../reference/cli-flags.md)と[モードの対応表](../reference/modes-matrix.md)を参照。
