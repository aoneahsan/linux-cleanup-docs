---
title: Protected paths
description: The complete verified list of paths linux-cleanup refuses to delete — system roots, personal directories, package-manager install roots, and shell-init filenames.
tags: [protected, allowlist, safety, paths, reference]
sidebar_position: 3
---

# Protected paths

**These are the paths linux-cleanup refuses to delete.** The refusal is unconditional — there is no flag
that overrides it, including `--purge-all`.

Every candidate is resolved with `realpath` before the check, so a symlink pointing into a protected
directory is refused on the resolved path, not the link.

:::tip Verify against your own install rather than trusting this page
Lists change between versions, and second-hand descriptions of this tool circulate with directories that are
**not** actually protected.

```bash
linux-cleanup --list-targets   # the lists as your build sees them
linux-cleanup --self-test      # asserts the guard fires on known paths
```
:::

## Three separate lists

The guard is built from three lists with different matching rules. The distinction matters — it is what lets
`~/.npm/_cacache` be cleaned while `~/.npm` itself is untouchable.

| List | Matches | Purpose |
|---|---|---|
| Protected paths | The path **and everything beneath it** | Personal data, credentials, configuration |
| Protected exact | **Only that exact path** | Package-manager install roots |
| Protected basenames | **Any file with that name, anywhere** | Shell-init and history files |

## System roots

Refused as a path or as any child, except where noted.

| Path | Children also refused |
|---|---|
| `/` | — (root itself) |
| `/home` | No — only the exact path |
| `/root` | No — only the exact path |
| `/etc` | **Yes** |
| `/boot` | **Yes** |
| `/usr` | **Yes** |
| `/var` | No — only the exact path |
| `/lib` | No — only the exact path |
| `/sbin` | No — only the exact path |
| `/bin` | No — only the exact path |
| `$HOME` | No — the home root itself, so a bare `$HOME` can never be wiped |

:::note `/proc` and `/sys` are not on this list
No cleanup target goes anywhere near them, but the allowlist does not name them explicitly. Some
descriptions of this tool claim it does. It does not.
:::

## Personal directories

Refused along with everything inside them.

| Path | Holds |
|---|---|
| `~/Documents` | Documents |
| `~/Pictures` | Images |
| `~/Music` | Audio |
| `~/Videos` | Video |
| `~/Desktop` | Desktop contents |
| `~/Public` | Shared files |
| `~/Templates` | Document templates |

:::caution `~/Downloads` is deliberately NOT protected
It cannot be — cleaning large, long-idle files there is a feature
([Stale personal files](../modes/personal-stale-files.md)). What protects it instead is
[Guard 3](../safety/guards.md#guard-3--personal-data-is-interactive-only): interactive-only, per-file
confirmation, and `--yes` ignored.

If you keep anything irreplaceable in `~/Downloads`, move it into a protected directory. That is the durable
fix.
:::

## Credentials, configuration and agent state

| Path | Holds |
|---|---|
| `~/.ssh` | SSH keys and known hosts |
| `~/.gnupg` | GPG keyring |
| `~/.config` | Application configuration (very broad) |
| `~/.gnome` | GNOME settings |
| `~/.mozilla` | Firefox profiles |
| `~/.thunderbird` | Thunderbird profiles |
| `~/.claude` | Claude Code state |
| `~/.local/share/claude` | Claude Code data |

:::danger Two paths commonly claimed as protected are NOT
**`~/.password-store`** (pass) and **`~/.aws`** (AWS credentials) do **not** appear on the protected list in
the source. Some write-ups of this tool state that they do.

In practice no cleanup target points at either, so neither is at risk during normal operation — but do not
rely on the allowlist to defend them. If you want that guarantee, verify with `--list-targets` on your own
install first.
:::

Note that `~/.mozilla` being protected does not stop Firefox cache cleanup: the cache lives under
`~/.cache/mozilla`, a different tree.

## Exact-match protected paths

Matched **exactly** — children remain cleanable. This is what preserves your globally installed packages
while still allowing the regenerable cache inside each install root to be pruned.

| Ecosystem | Paths |
|---|---|
| pnpm | `~/.local/share/pnpm` and its `global`, `bin`, `nodejs` |
| npm | `~/.npm`, `~/.npm-global`, `~/.npm-global/lib`, `~/.npm-global/lib/node_modules` |
| yarn | `~/.yarn`, `~/.config/yarn/global` |
| bun | `~/.bun`, `~/.bun/install`, `~/.bun/install/global` and its `node_modules`, `~/.bun/bin` |
| deno | `~/.deno`, `~/.deno/bin` |
| Node version managers | `~/.volta`, `~/.volta/bin`, `~/.nvm`, `~/.nvm/versions`, `~/.fnm` |
| Rust | `~/.cargo`, `~/.cargo/bin`, `~/.rustup` |
| Go | `~/go`, `~/go/bin` |

This list exists because of a real defect: before
[1.1.0](../changelog.md#110--2026-05-10) the pnpm cleanup targeted `~/.local/share/pnpm` — the install root —
and removed globally installed packages along with the `pnpm` binary itself. The fix narrowed the target to
`~/.local/share/pnpm/store` and added this list so the mistake cannot recur.

[`--all-safe`](../modes/all-safe.md) additionally asserts at startup that none of these ever appear in its
target list, aborting with a `BUG:` message if one does.

## Protected basenames

Refused by **filename, in any location**, regardless of the path leading to it:

`.bashrc` · `.bash_profile` · `.bash_login` · `.profile` · `.bash_logout` · `.zshrc` · `.zshenv` ·
`.zprofile` · `.zlogin` · `.zlogout` · `.bash_aliases` · `.bash_history` · `.zsh_history` · `.inputrc` ·
`.dircolors` · `.config` · `.local`

This is a last-ditch guard. It exists so a future bug that somehow introduced a shell-init file into a target
list still cannot delete it.

## What a refusal looks like

```text
✗ REFUSE: protected path: /home/you/Documents/notes
✗ REFUSE: unsafe path: '/home/you'
✗ REFUSE: shell-init / history file: /home/you/.bashrc
```

A refusal is correct behaviour, not an error to work around. If a cache you want cleaned is being refused,
the cause is almost always a symlink landing somewhere protected — fix the symlink, not the tool. See
[Troubleshooting](../troubleshooting.md#refuse-protected-path).

## Next

- [Safety guards](../safety/guards.md) — how this list is applied
- [What it deletes](../safety/what-it-deletes.md) — the other side of the boundary
