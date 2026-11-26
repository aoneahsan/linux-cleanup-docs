---
title: 保護パス
description: linux-cleanup が削除を拒否するパスの、確認済みの完全な一覧。システムのルート、個人のディレクトリ、パッケージマネージャーのインストール先、シェルの初期化ファイル名。
tags: [protected, allowlist, safety, paths, reference]
sidebar_position: 3
---

# 保護パス

**linux-cleanup が削除を拒否するパスの一覧です。** 拒否は無条件です。`--purge-all` を含め、これを覆すフラグはありません。

候補はすべて確認の前に `realpath` で解決するので、保護されたディレクトリを指すシンボリックリンクは、リンクではなく解決後のパスで拒否されます。

:::tip このページを信じるより、自分のインストールで確かめてください
一覧はバージョンによって変わります。また、このツールについての又聞きの説明には、実際には保護され**ていない**ディレクトリが載っていることがあります。

```bash
linux-cleanup --list-targets   # あなたのビルドから見た一覧
linux-cleanup --self-test      # 既知のパスで関門が働くことを確認
```
:::

## 3 つの別々の一覧 {#three-separate-lists}

関門は、一致のしかたが違う 3 つの一覧でできています。この違いが大事です。`~/.npm/_cacache` は掃除できるのに、`~/.npm` そのものには触れられないのはこのためです。

| 一覧 | 一致するもの | 目的 |
|---|---|---|
| 保護パス | そのパス**とその下のすべて** | 個人データ、認証情報、設定 |
| 完全一致の保護 | **そのパスちょうどだけ** | パッケージマネージャーのインストール先 |
| 保護されたファイル名 | **その名前のファイルすべて、場所を問わず** | シェルの初期化と履歴のファイル |

## システムのルート {#system-roots}

注記がない限り、パスそのものもその下のものも拒否します。

| パス | 下のものも拒否 |
|---|---|
| `/` | —（ルートそのもの） |
| `/home` | いいえ — そのパスちょうどだけ |
| `/root` | いいえ — そのパスちょうどだけ |
| `/etc` | **はい** |
| `/boot` | **はい** |
| `/usr` | **はい** |
| `/var` | いいえ — そのパスちょうどだけ |
| `/lib` | いいえ — そのパスちょうどだけ |
| `/sbin` | いいえ — そのパスちょうどだけ |
| `/bin` | いいえ — そのパスちょうどだけ |
| `$HOME` | いいえ — ホームのルートそのもの。`$HOME` だけを指定して消すことは決してできません |

:::note `/proc` と `/sys` はこの一覧にありません
掃除の対象がこれらに近づくことはありませんが、許可リストに明記はされていません。このツールの説明の中には明記されているとするものがありますが、されていません。
:::

## 個人のディレクトリ {#personal-directories}

中のものも含めて拒否します。

| パス | 中身 |
|---|---|
| `~/Documents` | 文書 |
| `~/Pictures` | 画像 |
| `~/Music` | 音声 |
| `~/Videos` | 動画 |
| `~/Desktop` | デスクトップの内容 |
| `~/Public` | 共有ファイル |
| `~/Templates` | 文書のテンプレート |

:::caution `~/Downloads` は意図して保護していません
保護できないのです。そこにある大きく長く使われていないファイルの掃除は機能の 1 つだからです（[使われていない個人ファイル](../modes/personal-stale-files.md)）。代わりに守るのは[関門 3](../safety/guards.md#guard-3--personal-data-is-interactive-only)です。対話式のみで、ファイルごとに確認し、`--yes` は無視します。

取り戻せないものを `~/Downloads` に置いているなら、保護されたディレクトリに移してください。それが長く続く解決策です。
:::

## 認証情報、設定、エージェントの状態 {#credentials-configuration-and-agent-state}

| パス | 中身 |
|---|---|
| `~/.ssh` | SSH の鍵と既知のホスト |
| `~/.gnupg` | GPG のキーリング |
| `~/.config` | アプリの設定（範囲が非常に広い） |
| `~/.gnome` | GNOME の設定 |
| `~/.mozilla` | Firefox のプロファイル |
| `~/.thunderbird` | Thunderbird のプロファイル |
| `~/.claude` | Claude Code の状態 |
| `~/.local/share/claude` | Claude Code のデータ |

:::danger よく保護されていると言われる 2 つのパスは、保護されていません
**`~/.password-store`**（pass）と **`~/.aws`**（AWS の認証情報）は、ソースの保護リストに**ありません**。このツールについての記事の中には、あると書いているものがあります。

実際にはどちらも掃除の対象ではないので、ふだんの使い方で危険はありません。ただし、許可リストで守られていると思わないでください。その保証がほしい場合は、まず自分のインストールで `--list-targets` を使って確かめてください。
:::

なお、`~/.mozilla` が保護されていても、Firefox のキャッシュは掃除できます。キャッシュは別のツリーの `~/.cache/mozilla` にあるからです。

## 完全一致で保護されるパス {#exact-match-protected-paths}

**ちょうどそのパス**だけに一致し、その下は掃除できます。これで、グローバルにインストールしたパッケージを守りつつ、インストール先の中の作り直せるキャッシュは整理できます。

| エコシステム | パス |
|---|---|
| pnpm | `~/.local/share/pnpm` とその `global`, `bin`, `nodejs` |
| npm | `~/.npm`, `~/.npm-global`, `~/.npm-global/lib`, `~/.npm-global/lib/node_modules` |
| yarn | `~/.yarn`, `~/.config/yarn/global` |
| bun | `~/.bun`, `~/.bun/install`, `~/.bun/install/global` とその `node_modules`, `~/.bun/bin` |
| deno | `~/.deno`, `~/.deno/bin` |
| Node のバージョン管理ツール | `~/.volta`, `~/.volta/bin`, `~/.nvm`, `~/.nvm/versions`, `~/.fnm` |
| Rust | `~/.cargo`, `~/.cargo/bin`, `~/.rustup` |
| Go | `~/go`, `~/go/bin` |

この一覧は実際の不具合から生まれました。[1.1.0](../changelog.md#110--2026-05-10) より前、pnpm の掃除はインストール先の `~/.local/share/pnpm` を対象にしていて、`pnpm` のバイナリそのものと一緒に、グローバルにインストールしたパッケージを消していました。修正で対象を `~/.local/share/pnpm/store` に絞り、同じ誤りが起きないようこの一覧を加えました。

さらに [`--all-safe`](../modes/all-safe.md) は起動時に、これらが対象の一覧に入っていないことを確かめ、入っていれば `BUG:` のメッセージで止まります。

## 保護されたファイル名 {#protected-basenames}

**ファイル名で、場所を問わず**拒否します。そこに至るパスは関係ありません。

`.bashrc` · `.bash_profile` · `.bash_login` · `.profile` · `.bash_logout` · `.zshrc` · `.zshenv` ·
`.zprofile` · `.zlogin` · `.zlogout` · `.bash_aliases` · `.bash_history` · `.zsh_history` · `.inputrc` ·
`.dircolors` · `.config` · `.local`

これは最後の砦です。将来の不具合で、シェルの初期化ファイルがなぜか対象の一覧に入ってしまっても、削除できないようにするためのものです。

## 拒否されたときの表示 {#what-a-refusal-looks-like}

```text
✗ REFUSE: protected path: /home/you/Documents/notes
✗ REFUSE: unsafe path: '/home/you'
✗ REFUSE: shell-init / history file: /home/you/.bashrc
```

拒否は正しい動きであり、回避すべきエラーではありません。掃除したいキャッシュが拒否される場合、原因はほぼ必ず、保護された場所につながるシンボリックリンクです。直すのはツールではなくリンクです。[トラブルシューティング](../troubleshooting.md#refuse-protected-path)を参照。

## 次へ {#next}

- [安全の関門](../safety/guards.md) — この一覧の使われ方
- [削除するもの](../safety/what-it-deletes.md) — 境界の反対側
