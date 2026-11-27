---
title: 対応ディストリビューション
description: 各 Linux ディストリビューションで linux-cleanup がすること。キャッシュの掃除はどこでも動きますが、sudo を使う --system モードは Debian と Ubuntu 専用です。
sidebar_position: 90
---

# 対応ディストリビューション

**ホームのキャッシュの掃除は、必要な GNU のユーティリティがそろった Linux ディストリビューション向けです。**
[`--system`](./modes/system-cleanup.md) は Debian と Ubuntu のパッケージ用コマンドを使います。掃除の前に `--self-test` で入っているツールを確認してください。

## まとめ {#the-summary}

| ディストリビューションの系統 | `$HOME` のキャッシュの掃除 | `--system` |
|---|---|---|
| Debian, Ubuntu, Mint, Pop!\_OS | すべて対応 | **すべて対応** |
| Fedora, RHEL, Rocky, Alma | 必要なユーティリティがあれば | 使わないでください：apt の手順が失敗します |
| Arch, Manjaro, EndeavourOS | 必要なユーティリティがあれば | 使わないでください：apt の手順が失敗します |
| openSUSE | 必要なユーティリティがあれば | 使わないでください：apt の手順が失敗します |
| Alpine、最小構成のコンテナ | Bash と GNU のユーティリティが必要 | 使わないでください：apt の手順が失敗します |
| WSL | 必要なユーティリティがあれば | Debian/Ubuntu のみ。先にマウントされたパスを確認 |

:::warning `--system` はディストリビューションを判別しません
apt の手順は `apt` と `dpkg` を直接呼び出します。`command -v` による確認も、`dnf`、`pacman`、`zypper` への切り替えもありません。Debian 系でないシステムでは、手順ごとに "command not found" で失敗します。

apt が失敗してもモードは止まらず、後の手順は動くことがあります。ほかのディストリビューションでは使わないでください。

このツールの説明の中には、`--system` が複数のディストリビューションに段階的に対応し、`apt` の代わりに `dnf`、Arch では `paccache` を使うとするものがあります。**そのようなコードはありません。** クローンで `grep -rn 'dnf\|pacman\|zypper' modules/system_sudo.sh` を実行すれば確かめられます。何も出てきません。
:::

## 手順ごと {#step-by-step}

| `--system` の手順 | Debian/Ubuntu | Fedora/RHEL | Arch | openSUSE |
|---|---|---|---|---|
| `apt autoremove` + `apt clean` | 動く | **失敗** | **失敗** | **失敗** |
| `journalctl --vacuum-size=100M` | 動く | 動く | 動く | 動く |
| 無効になった snap のリビジョン | 動く | snap があれば動く | snap があれば動く | snap があれば動く |
| カーネルの一覧（`dpkg --list`） | 動く | 出力なし — 何も表示しない | 出力なし | 出力なし |
| 7 日より古い `/tmp` のファイル | 動く | 動く | 動く | 動く |
| ページキャッシュの解放 | 動く | 動く | 動く | 動く |

ジャーナル、`/tmp`、ページキャッシュの手順は `journalctl`、`find`、`sysctl` を使うので、systemd があればどこでも同じように動きます。カーネルの手順はどのみち一覧を出すだけなので、dpkg がないシステムで失敗しても困ることはありません。

## パッケージの部分を自分で行う {#doing-the-package-part-yourself}

Debian 系でないシステムでは、そのパッケージマネージャー自身の保守の案内に従ってください。次のコマンドは例なので、実行する前に内容を確認してください。

```bash
# Fedora / RHEL / Rocky
sudo dnf autoremove
sudo dnf clean all

# Arch / Manjaro  (paccache は pacman-contrib に含まれる)
sudo pacman -Rns "$(pacman -Qtdq)"    # 孤立したパッケージ（あれば）
sudo paccache -r                       # 最新の 3 バージョンを残す
sudo pacman -Scc                       # パッケージのキャッシュをすべて消す

# openSUSE
sudo zypper clean --all
sudo zypper packages --orphaned
```

ホームのキャッシュについては、linux-cleanup が見つけるものをプレビューしてください。

```bash
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

## ホームのキャッシュの対象 {#home-cache-targets}

ホームのパスは、ディストリビューションではなく入っているツールで決まります。マシンによって異なります。

- パッケージマネージャーのキャッシュ — yarn, npm, pnpm, pip, composer, bun, deno
- ブラウザーのキャッシュ — Chrome, Firefox, Brave, Chromium, Edge, Vivaldi
- ビルドツールのキャッシュ — Gradle, Cypress, Playwright, TypeScript
- 開発ツールのデータ — Android AVD, Flutter pub-cache, Dart, flatpak
- エディター拡張機能 — VS Code, Cursor
- `node_modules`、途中のダウンロード、使われていない個人ファイル
- スキャン、監査、安全確認、ローカルのログ

## 最小構成のコンテナ {#minimal-containers}

Alpine などの最小構成のイメージには、たいてい GNU coreutils ではなく BusyBox が入っています。ツールには GNU の `find`、`du`、`stat`、とくに `realpath` が必要です。`realpath` は、[保護パスの確認](./reference/protected-paths.md)の前にシンボリックリンクを解決します。

```bash
apk add coreutils findutils bash
linux-cleanup --self-test
```

`--self-test` は、最初に見つかった足りない依存関係を示します。通るまでは、削除するモードを実行しないでください。

## WSL {#wsl}

ツールは Linux の環境で動きます。パスの保護はシンボリックリンクを解決しますが、Windows の個人フォルダーを保護された Linux のフォルダーとしては扱いません。ホームのディレクトリやキャッシュが `/mnt/` の中を指している場合は、スキャンとドライランの結果をよく確認してください。

## macOS {#macos}

対応していません。npm パッケージは `"os": ["linux"]` を宣言しているので、インストールを拒否します。パス、`find` のフラグ、パッケージマネージャーがすべて異なります。

## 次へ {#next}

- [システムの掃除](./modes/system-cleanup.md) — このページが補足するモード
- [動作要件](./getting-started/requirements.md)
