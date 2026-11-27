---
title: 動作要件
description: linux-cleanup の実行に必要なもの（bash 4 以上、GNU coreutils、Linux のみ）と、レポートの書き出しやビジュアルメニューを使えるようにする任意の依存関係。
sidebar_position: 1
---

# 動作要件

**linux-cleanup は、`bash` 4 以上と GNU coreutils がある Linux で動作します。** それ以外はすべて任意で、なくても問題なく動きます。

## プラットフォーム {#platform}

| | |
|---|---|
| **OS** | Linux のみ。npm パッケージは `"os": ["linux"]` を宣言しており、ほかの環境ではインストールを拒否します |
| **シェル** | `bash` 4.0 以上 |
| **Node.js** | 14 以上。`npx` と `npm install -g` を使う場合**のみ**必要で、git clone では不要です |
| **権限** | 一般ユーザーで動きます。`sudo` を求めるのは [`--system`](../modes/system-cleanup.md) だけです |

macOS と WSL は分けて考えてください。

- **macOS には対応していません。** パス、`find` のフラグ、パッケージマネージャーが異なります。macOS 向けには姉妹ツールがあります。このツールを Mac で使わないでください。
- **WSL は Linux 側で動きます。** クリーンアップの前に、`$HOME` から `/mnt/c/` へのシンボリックリンクを確認してください。[許可リスト](../reference/protected-paths.md)はシンボリックリンクを解決しますが、Linux のホームの保護パスがあるからといって、Windows のディレクトリがすべて保護されるわけではありません。

## 必須のコマンド {#required-commands}

主要なディストリビューションならほぼ必ず入っています：`bash`, `find`, `du`, `df`, `rm`, `awk`, `sort`, `grep`, `sed`, `stat`, `realpath`。

なかでも `realpath` は重要です。保護パスのチェックの前にシンボリックリンクを解決するのがこのコマンドだからです。GNU coreutils のない最小限のコンテナイメージでは、実行前にインストールしてください。

```bash
npx linux-cleanup --self-test
```

`--self-test` は必須のコマンドをすべて確かめ、最初に見つからなかったものを修正のヒントとともに示します。削除を伴う操作の前に実行してください。

## 任意の依存関係 {#optional-dependencies}

それぞれが 1 つの機能を使えるようにします。なければその機能が使えないだけで、ほかは影響を受けません。

| 依存関係 | 使えるようになる機能 | ない場合 |
|---|---|---|
| `jq` | Markdown / HTML への[レポートの書き出し](../modes/reports.md) | JSON レポートは書き出されるが、変換はできない |
| `whiptail` | ビジュアルな [TUI メニュー](../modes/tui.md) | `--tui` はインストールのヒントを出して CLI メニューに切り替わる |
| `dialog` | `whiptail` がないときの TUI の代替 | 同上 |
| `snap` | `--system` での無効な snap リビジョンの整理 | その手順は問題なくスキップされる |
| `crontab` | [毎週の cron インストーラー](../guides/alias-and-cron.md) | `--install-cron` を実行できない |
| `numfmt` | 読みやすいバイト表記 | バイト数をそのまま表示 |
| `xdg-open` | HTML レポートをブラウザーで開く | ファイルを手動で開く |
| `less` | レポート管理での JSON のページ表示 | ファイルを直接読む |
| `lsb_release` | フィードバック用バンドルでのディストリビューション判定の精度 | バンドルは作成される |

### 重要な 2 つをインストールする {#installing-the-two-that-matter}

`jq`（レポートの書き出し）と `whiptail`（ビジュアルメニュー）が、多くの人が必要とする 2 つです。

```bash
# Debian / Ubuntu / Mint
sudo apt install jq whiptail

# Fedora / RHEL / Rocky
sudo dnf install jq newt

# Arch / Manjaro
sudo pacman -S jq libnewt

# openSUSE
sudo zypper install jq newt
```

`whiptail` の実行ファイルは、RPM 系のディストリビューションでは `newt` パッケージ、Arch では `libnewt` に含まれます。

## 対応ディストリビューション {#distro-coverage}

`$HOME` 内のキャッシュのクリーンアップ（このツールが取り戻す容量の大部分）は、どの Linux ディストリビューションでも同じように動きます。

:::warning `--system` は Debian/Ubuntu 専用です
sudo を使うモードは、ディストリビューションの判定も安全装置もなしに `apt` と `dpkg` を直接呼び出します。Fedora、Arch、openSUSE ではパッケージの手順が「command not found」で失敗します。

どの手順がどこで動くかの詳細：[対応ディストリビューション](../distro-support.md)。
:::

## ディスクへの出力 {#output-on-disk}

実行のたびにローカルのログが書き出されることがあります。ガイド付きの手順では JSON レポートも書き出されることがあり、求めた場合や予期しない失敗のあとにはデバッグ用のバンドルが作られます。サイズは実行内容によって変わります。構成は[出力パス](../reference/output-paths.md)を参照してください。

## 次へ {#next}

- [インストール](./installation.md) — 3 つのインストール方法
- [クイックスタート](./quick-start.md) — 最初のクリーンアップ
