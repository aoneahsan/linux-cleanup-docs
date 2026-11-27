---
title: トラブルシューティング
description: linux-cleanup の利用者が実際につまずく問題の症状、原因、対処。拒否、依存関係の不足、cron の失敗、遅いスキャン、バージョンの取り違え。
sidebar_position: 92
---

# トラブルシューティング

症状 → 原因 → 対処。まず確認用のコマンドを実行し、当てはまれば対処を行ってください。

エラーではなくデータを失った場合は、[復旧](./recovery.md)を見てください。

## REFUSE: protected path {#refuse-protected-path}

```text
✗ REFUSE: protected path: /home/you/Documents/something
```

**原因。** シンボリックリンクを展開した結果、パスが[保護リスト](./reference/protected-paths.md)の場所に行き着きました。許可リストがそれを止めました。

**これは正しい動作で、故障ではありません。** 何も削除されていません。

**対処。** どこがどこに解決されたかを調べます。

```bash
linux-cleanup --list-targets
realpath <the path that was rejected>
```

ほとんどの場合、キャッシュが保護ディレクトリの中へシンボリックリンクされています。**直すのはツールではなくリンクです。** ツールは本来の役目を果たしています。回避するフラグは意図して用意していません。

関連するメッセージが 2 つあります。

```text
✗ REFUSE: unsafe path: '/home/you'            # $HOME や / そのもの
✗ REFUSE: shell-init / history file: …        # .bashrc、.zshrc など
```

## TUI mode needs whiptail or dialog {#tui-mode-needs-whiptail-or-dialog}

**原因。** どちらもインストールされていない状態で `--tui` を実行しました。

**対処。** どちらかをインストールするか、案内に従って CLI メニューを使ってください。

```bash
sudo apt install whiptail     # Debian / Ubuntu
sudo dnf install newt         # Fedora / RHEL
sudo pacman -S libnewt        # Arch
```

**確認。** `command -v whiptail` を実行してから、もう一度実行します。[TUI](./modes/tui.md)を参照。

## export requires jq {#export-requires-jq}

**原因。** `jq` がない状態で `--export md`、`--export html`、またはレポート管理での変換を使いました。

**対処。**

```bash
sudo apt install jq
```

`jq` が必要なのは変換だけです。なくても JSON の記録は毎回書き出されます。[レポート](./modes/reports.md)を参照。

## command not found {#command-not-found}

**原因。** 必須の依存関係がないか、互換性のないエイリアスに隠れています。GNU coreutils の代わりに BusyBox を使う最小限のコンテナでよく起きます。

**確認。**

```bash
linux-cleanup --self-test
```

必須のコマンドをすべて確かめ、最初に見つからなかったものを示します。

**対処。** お使いのディストリビューションの coreutils、findutils、gawk のパッケージをインストールしてください。Alpine の場合：

```bash
apk add coreutils findutils bash
```

いちばん重要なのは `realpath` です。[保護パスのチェック](./reference/protected-paths.md)をシンボリックリンクに対して安全にしているのがこのコマンドです。[対応ディストリビューション](./distro-support.md#minimal-containers)を参照。

## cron のジョブが動くのに何もしない {#cron-entry-runs-but-does-nothing}

**確認。**

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

**原因。** cron のログに `command not found` があれば、cron の最小限の `PATH`（`/usr/bin:/bin`）からインストール先が見えていません。cron でいちばんよくある問題です。

**対処。** crontab では絶対パスを使ってください。

```bash
crontab -e
# 変更前：  0 3 * * 0 linux-cleanup --all-safe -y …
# 変更後：  0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y …
```

正しいパスは `command -v linux-cleanup` でわかります。crontab の先頭に `PATH=` の行を書く方法もあります。[エイリアスと cron](./guides/alias-and-cron.md)を参照。

## $HOME is not set {#home-is-not-set}

```text
✗ $HOME is not set
```

**原因。** `$HOME` が設定されない環境で実行しています。一部の Docker イメージや CI ランナーなどです。

**対処。**

```bash
HOME=/root linux-cleanup --scan
```

または、そのセッションで一度 export してください。スクリプトは推測せずに意図して中止します。`$HOME` が間違っていると、パスのチェックがすべて別のツリーに対して行われてしまうからです。

## スキャンや --node-modules が止まったように見える {#scan-or---node-modules-seems-to-hang}

**原因。** `find` が `$HOME` の下にある何千ものディレクトリをたどっています。HDD では初回の実行に 1〜3 分かかります。

**確認。** ターミナルではなくログを見てください。

```bash
tail -f ~/.linux-cleanup/logs/cleanup-*.log
```

5〜10 秒ごとに新しい行が出ていれば動いています。

**対処。** 初回は気長に待ってください。2 回目以降はディレクトリのメタデータがキャッシュされて速くなります。同じパスで毎回 5 分以上止まる場合は、シンボリックリンクのループや、応答しないネットワークや FUSE のマウントを疑い、[報告してください](./guides/send-a-bug-report.md)。

## セッション中にディスク使用量が増えた {#disk-usage-grew-during-the-session}

**原因。** 表示される回収量はマシン全体の `df` の差分です。ほかのプロセス（ビルド、パッケージの更新、ジャーナルのローテーション、IDE の再インデックスなど）が、セッション中にクリーンアップで空いた量より多く書き込みました。

**不具合ではなく**、クリーンアップが失敗したわけでもありません。各手順自身の報告を確認してください。

```bash
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

**対処。** マシンが落ち着いているときに `--scan` をもう一度実行すると、実際の状況がわかります。

## --system のあとに apt update が失敗する {#apt-update-fails-after---system}

**原因。** まれです。`apt clean` で `apt update` が壊れることはありませんが、ロックを握っている別の apt の処理とクリーンアップが重なった可能性があります。

**確認。**

```bash
sudo apt update 2>&1 | tail -20
```

**対処。**

```bash
sudo rm -f /var/lib/apt/lists/lock /var/cache/apt/archives/lock /var/lib/dpkg/lock-frontend
sudo apt update
```

本当に apt のプロセスが動いていないときに限って行ってください。先に `ps aux | grep -i apt` で確認します。

## VS Code が拡張機能が見つからないと言う {#vs-code-reports-a-missing-extension}

**原因。** たいていは正しい動作です。置き換えられた古いバージョンが、エディターがまだ参照しているあいだに削除されました。

**対処。** ウィンドウを再読み込みしてください。`Ctrl+Shift+P` → **Developer: Reload Window**。

現在のバージョンが残っていることを**確認**します。

```bash
ls ~/.vscode/extensions/ | grep <extension-name>
```

*現在の*バージョンが本当になくなっている場合は、最新バージョンの判定に不具合があります。再インストールして[報告してください](./guides/send-a-bug-report.md)。

```bash
code --install-extension <publisher>.<name>
```

## クラッシュ用のバンドルができたが、クラッシュは見ていない {#a-crash-bundle-appeared-but-i-saw-no-crash}

**原因。** スクリプトが想定外の場所で 0 以外の終了コードで終わりました。バックグラウンドの `find` が OOM killer に止められた、パイプが壊れた、などです。

**対処。** バンドルのマニフェストで終了コードを確認します。

```bash
tar -xzOf ~/.linux-cleanup/feedback/crash-*.tar.gz --wildcards '*MANIFEST*'
```

`137` は OOM killer、`141` は SIGPIPE、`139` はセグメンテーション違反です。[終了コード](./reference/exit-codes.md)を参照。どれも報告する価値があります。

## --install-alias のあとにエイリアス cleanup が見つからない {#alias-cleanup-not-found-after---install-alias}

**原因。** シェルの rc ファイルがまだ読み直されていません。

**対処。**

```bash
source ~/.bashrc      # または ~/.zshrc
```

または新しいターミナルを開いてください。

## 違うバージョンが動いている {#wrong-version-running}

**確認。**

```bash
command -v linux-cleanup
linux-cleanup --version
```

**原因。** 古いグローバルインストールが新しい `npx` のキャッシュを隠しているか、シェルのコマンドのハッシュが古くなっています。

**対処。**

```bash
npm uninstall -g linux-cleanup
npm install -g linux-cleanup@latest
hash -r
linux-cleanup --version
```

現在公開中のバージョンは [npm のパッケージ](https://www.npmjs.com/package/linux-cleanup)で確認できます。インストール済みのバージョン以降の変更は[変更履歴](./changelog.md)を見てください。

## それでも解決しない {#still-stuck}

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

バンドルの内容を確認してから、期待した動作と実際の動作を短く書き添えてメールで送ってください。[不具合を報告する](./guides/send-a-bug-report.md)を参照。
