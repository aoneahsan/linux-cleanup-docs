---
title: Doctor
description: ディスクにはインストールされているのにシェルの初期化から漏れている実行環境（nvm、pnpm、bun、deno、cargo）を見つけ、確認のうえで標準の初期化ブロックを追記します。追記のみです。
tags: [doctor, repair, shell, bashrc, nvm, pnpm, bun, deno, cargo, modes]
sidebar_position: 14
---

# Doctor

**`--doctor` は、ディスクにはあるのにシェルの設定につながっていない実行環境を見つけ、足りない初期化ブロックの追記を提案します。** [1.1.0](../changelog.md#110--2026-05-10) で追加しました。

```bash
linux-cleanup --doctor
```

pnpm を確かにインストールしたのに `pnpm: command not found` と出るときに使うモードです。

## 追記のみ {#additive-only}

:::note Doctor は既存の行を削除も編集もしません
標準の初期化ブロックを**追記**するだけで、それも確認を得てからです。シェルの設定にすでにあるものを変更、並べ替え、削除することはありません。

シェルの初期化ファイルは削除の段階でも保護されています。`safe_rm` は、場所にかかわらず、ファイル名が `.bashrc`、`.zshrc`、`.profile`、`.bash_aliases` などのパスを拒否します。[保護パス](../reference/protected-paths.md#protected-basenames)を参照。
:::

## 確認する内容 {#what-it-checks}

| 実行環境 | 検出する状態 | 追記するもの |
|---|---|---|
| `nvm` | `~/.nvm` はあるが `NVM_DIR` の初期化がない | nvm の標準の読み込みブロック |
| `pnpm` | `~/.local/share/pnpm` はあるが `PATH` にない | `PNPM_HOME` の export と `PATH` への追加 |
| `bun` | `~/.bun` はあるが `PATH` にない | Bun の初期化ブロック |
| `deno` | `~/.deno` はあるが `PATH` にない | Deno の `PATH` への追加 |
| `cargo` | `~/.cargo` はあるが `PATH` にない | `. "$HOME/.cargo/env"` |

## よくある原因 {#how-this-usually-happens}

インストーラーが、シェルが読まないファイルに初期化ブロックを書き込むことです。`~/.profile` を読むのはログインシェルだけで、`~/.bash_profile` があるとそちらが優先されます。`~/.bashrc` への変更は `zsh` のセッションには届きません。実行環境は問題なくインストールされたのに、消えたように見えます。

dotfiles のリポジトリを別のマシンに移したあとや、ログインシェルを切り替えたあとにも起こります。

## そのあと {#afterwards}

シェルを読み込み直してください。そうしないと変更が効いていないように見えます。

```bash
source ~/.bashrc     # または ~/.zshrc
```

そして確認します。

```bash
command -v pnpm && pnpm --version
```

## グローバルパッケージの監査との関係 {#its-relationship-to-the-globals-audit}

[`--globals`](./globals-audit.md) は、パッケージマネージャーが `PATH` になくても、ファイルシステムを直接調べることで動きます。監査に pnpm のグローバルパッケージが出ているのに `pnpm` 自体が見つからないなら、`--doctor` が解決策です。

## 次へ {#next}

- [グローバルパッケージの監査](./globals-audit.md)
- [トラブルシューティング](../troubleshooting.md)
