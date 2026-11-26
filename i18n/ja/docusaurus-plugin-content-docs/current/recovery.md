---
title: 復旧
description: linux-cleanup で意図しない削除が起きたときにすること。手元のログを確認し、バックアップや入手元から戻し、復旧が重要ならディスクへの書き込みを避けます。
tags: [recovery, data-loss, restore, undo, logs, reports]
sidebar_position: 91
---

# 復旧

**linux-cleanup には元に戻す機能がありません。** このページでは、何が削除されたかを突き止め、実際に取れる手段を整理します。

:::danger まずディスクへの書き込みを止める
かけがえのないものが削除され、ファイルカービングでの復元を試すつもりなら、**今すぐそのファイルシステムの使用をやめてください**。書き込むたびに、リンクの切れたデータを取り戻せる可能性が下がります。

これは[本当にかけがえのないもの](#3-decide-what-is-actually-recoverable)に限った話です。キャッシュなら気にせず、各ツールに取り直させてください。
:::

## 1. 手元の記録を確認する {#1-inspect-the-available-record}

実行のたびにローカルのログが残ることがあります。ガイド付きの手順では、レポートを無効にしていなければ JSON のセッション記録も残ります。どちらもファイル単位の完全な削除記録ではなく、バックアップでもありません。

```bash
# いちばん新しいセッションログ
less "$(ls -t ~/.linux-cleanup/logs/cleanup-*.log | head -1)"

# 最新のガイド付き手順の記録（ある場合）
jq '.' "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

保存されているログから特定のパスを探すには：

```bash
grep -rn 'the-filename-you-are-missing' ~/.linux-cleanup/logs/
```

見つからなくても、ツールがそのファイルに触れなかった証拠にはなりません。補助プログラムがファイルごとではなくキャッシュのディレクトリ全体やコマンド単位で記録することがあり、`--cleanup-logs` で実行時のログが消えていることもあります。選んだモードと対象のルートもあわせて確認してください。

1 回のセッションの手順に絞り込むには：

```bash
jq '.steps[] | select(.status == "ran")' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

## 2. 単に拒否されただけではないか確かめる {#2-confirm-it-was-not-simply-refused}

拒否もログに記録されます。次のような行があれば、何も削除されていません。

```text
✗ REFUSE: protected path: /home/you/Documents/notes
```

[保護パス](./reference/protected-paths.md)を参照。

## 3. 本当に取り戻せるものを見極める {#3-decide-what-is-actually-recoverable}

| 削除されたもの | 取り戻し方 |
|---|---|
| パッケージマネージャーのキャッシュ | **自動。** 次回のインストールで再ダウンロード |
| ブラウザーのキャッシュ | **自動。** 閲覧するうちに作り直される |
| Gradle のキャッシュや wrapper のディストリビューション | **自動。** 次のビルドで取り直す（初回のビルドは遅くなる） |
| Cypress / Playwright のバイナリ | そのツールのインストール手順をもう一度実行 |
| `node_modules` | プロジェクトで `yarn install` または `npm install` |
| Android の AVD | Android Studio で作り直す。**プロファイルの設定は失われる**。システムイメージは再ダウンロード |
| エディター拡張機能のバージョン | エディターのウィンドウを再読み込み。本当になくなっていれば再インストール |
| apt のキャッシュ、ジャーナル、snap のリビジョン | 自然に作り直される。何もしなくてよい |
| **`~/Downloads` の個人ファイル** | **自分のバックアップからのみ**、または入手元から再ダウンロード |
| **途中のダウンロード** | 取り戻せない。ダウンロードをやり直す |

### よくあるものを作り直す {#regenerating-the-common-ones}

```bash
# 影響を受けたプロジェクトで
yarn install            # または: npm install / pnpm install

# テストランナーのバイナリ
npx cypress install
npx playwright install

# Flutter
flutter pub get
```

どれも linux-cleanup は必要ありません。キャッシュが空のときに各ツールが普段どおりのことをするだけです。

## 4. 本当にかけがえのないものだった場合 {#4-if-it-was-genuinely-irreplaceable}

現実的には、次の順で試します。

1. **自分のバックアップ。** Timeshift、Borg、restic、rsync のスナップショット、クラウド同期など、使っているもの。確実なのはこれだけです。
2. **元の入手先。** ダウンロードしたファイルなら、もう一度ダウンロードできます。ブラウザーの履歴で URL を探してください。
3. **同期サービスのゴミ箱。** Dropbox、Nextcloud、Google Drive などは、削除されたファイルを一定期間サーバー側に残します。そのディレクトリを同期していたなら確認してください。
4. **ファイルカービングのツール** — `extundelete`、`testdisk`、`photorec`。リンクの切れた inode を対象にしますが、使用中のファイルシステム、とくに TRIM が有効な SSD では望みは薄いです。先にファイルシステムをアンマウントするか、ライブ USB から作業し、取り戻したデータを同じデバイスに書き戻さないでください。

:::caution 手順 4 については冷静に
マウントされて使用中の、TRIM が有効な SSD では、カービングでたいてい何も戻りません。試す価値があるのは本当に大切なものだけで、それもディスクへの書き込みを止めたあとです。
:::

## 5. 二度と起こさないために {#5-stop-it-happening-again}

| 変えること | 効果 |
|---|---|
| クリーンアップの前に毎回 [`--scan`](./modes/scan.md) を実行 | 結果がまだ仮定のうちに見える |
| 大事なものを `~/Downloads` から移す | `~/Documents` と `~/Desktop` は[保護されている](./reference/protected-paths.md) |
| ガイド付きの手順で手順 7 をスキップ | 個人ファイルは意図して別に実行する必要がある |
| しきい値を上げる：`-d 365` | 本当に古いファイルだけが候補になる |
| 信頼できるマシンの `--all-safe` 以外で `-y` を使わない | `-y` は個人データに触れないが、判断はあとからしか見えない |
| きちんとしたバックアップを用意する | どんな削除でも取り戻せるようにする唯一の手段 |

## 6. ツールがすべきでないことをした場合 {#6-if-the-tool-did-something-it-should-not-have}

[保護パス](./reference/protected-paths.md)の中で削除が起きた、エディター拡張機能の*現在の*バージョンが消えた、そのほか記載された安全装置と食い違うことが起きた場合は、報告すべき不具合です。

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

ログと、ある場合はガイド付き手順の記録を添えてください。[不具合を報告する](./guides/send-a-bug-report.md)を参照。

## 次へ {#next}

- [削除は元に戻せない](./safety/irreversibility.md) — 元に戻す機能がない理由
- [削除前のプレビュー](./safety/preview-first.md) — この状況を避けるために
- [トラブルシューティング](./troubleshooting.md) — データの喪失以外の問題
