---
title: Safety guards
description: The four independent gates a path must clear before linux-cleanup deletes it — the path allowlist, the staleness gate, interactive-only personal modes, and sudo confinement.
tags: [safety, allowlist, staleness, guards, design]
sidebar_position: 3
---

# Safety guards

**linux-cleanup applies up to four independent gates before any deletion. A path must clear every gate that
applies to it.** This page explains what each gate is, why it exists, and what it does not cover.

The guards are the entire safety model. There is no backup and
[no undo](./irreversibility.md) behind them.

## Guard 1 — The path allowlist

Always on. Cannot be disabled, and no flag overrides it.

Before any removal, the target is resolved with `realpath` and rejected if it lands on or inside a protected
path. Because resolution happens first, a symlink cannot smuggle a path through: if `~/.cache/yarn` is a
symlink into `~/Documents`, the resolved path is inside `~/Documents`, the guard fires, and the deletion is
refused.

Three separate lists back this up:

| List | Match style | Purpose |
|---|---|---|
| System roots and personal directories | Path or any child | `/etc`, `~/Documents`, `~/.ssh`, `~/.config`, … |
| Package-manager install roots | **Exact path only** | `~/.local/share/pnpm`, `~/.npm`, `~/.cargo`, … |
| Shell-init and history files | **Basename, any location** | `.bashrc`, `.zshrc`, `.bash_history`, … |

When the guard fires you see a refusal on stderr:

```text
✗ REFUSE: protected path: /home/you/Documents/notes
```

The exact-match list deserves a note. `~/.npm` is protected *exactly*, which is what allows
`~/.npm/_cacache` — a child — to be cleaned. That is deliberate: the install root is preserved while the
regenerable cache inside it is fair game. The full lists are at
[Protected paths](../reference/protected-paths.md).

:::note What this guard does not do
It protects *locations*, not *value*. A 40 GB irreplaceable video sitting in `~/Downloads` is not covered
by the allowlist — `~/Downloads` is not a protected path. It is covered by
[Guard 3](#guard-3--personal-data-is-interactive-only) instead.
:::

**Why an allowlist rather than a blocklist.** A blocklist fails open: anything the author forgot to list is
deletable, so one typo in a path is the difference between clearing a cache and clearing a home directory.
An allowlist fails closed — an unrecognised path is refused by default. For a tool that runs `rm -rf` at
scale with `sudo` available, failing closed is the only defensible default.

## Guard 2 — The staleness gate

Default: 100 days. Introduced in [1.2.0](../changelog.md#120--2026-05-10), extended in
[1.2.1](../changelog.md#121--2026-05-10).

Since 1.2.0 the default strategy is to **prune, not wipe**. Within a target directory, a file is deleted
only when **both** its `atime` and its `mtime` are older than `--days`. Empty directories left behind are
swept up; the directory shell itself stays so the owning tool still finds its layout.

Requiring both timestamps matters. `mtime` alone would delete a file downloaded a year ago and read
yesterday; `atime` alone is unreliable on filesystems mounted `noatime` or `relatime`. Requiring both is
the conservative reading.

For anything that is a *tool* rather than a cache — Android AVDs, editor extension versions, flatpak user
data — 1.2.1 added a second condition on top. Such an asset is removed only when **no active software
depends on it AND it has been idle past the threshold**. Each asset is evaluated as an indivisible unit, so
a partial prune cannot leave a half-deleted emulator profile behind.

```bash
linux-cleanup --all-safe -y -d 30    # more aggressive: 30-day threshold
linux-cleanup --all-safe -y          # default: 100 days
linux-cleanup --all-safe --purge-all # gate OFF — full wipe, pre-1.2.0 behaviour
```

:::danger `--purge-all` disables this guard entirely
With `--purge-all` every target cache is wiped in full regardless of age. That is the behaviour that
prompted the gate: it removes Gradle wrapper distributions, Playwright browsers for old release branches,
and yarn-cached tarballs of pinned dependencies — each an expensive re-download.

It is a legitimate choice before reimaging a machine. It is a poor default for everyday use.
:::

The pre-run banner states which strategy is active, so there is never any ambiguity about what is about to
happen.

## Guard 3 — Personal data is interactive only

The modes that can touch personal files are interactive by policy:

- [`--stale`](../modes/personal-stale-files.md) — large, idle files in `~/Downloads` and `~/Desktop`
- [`--partials`](../modes/partial-downloads.md) — orphaned partial downloads
- [`--node-modules`](../modes/node-modules-finder.md) — stale project dependency directories

**`--yes` does not apply to these modes and never will.** `--yes` auto-confirms regenerable caches only.
The tool prints its candidate list, waits for per-entry confirmation, and deletes nothing until you answer.

The reasoning is that personal files carry no signal a program can read. Nothing on disk distinguishes an
installer you will never open again from the only copy of a document you have not needed yet. The user is
the only oracle, so the tool refuses to guess.

## Guard 4 — Sudo confinement

[`--system`](../modes/system-cleanup.md) is the only mode that calls `sudo`, and it does so for a fixed,
enumerated set of operations — each a separate, reviewable invocation, each prompted individually:

| Operation | Prompt default |
|---|---|
| `apt autoremove --purge -y` and `apt clean` | Yes |
| `journalctl --vacuum-size=100M` | Yes |
| Remove disabled snap revisions | Yes |
| List installed kernels — **no deletion** | — |
| Remove `/tmp` files with `atime` older than 7 days | Yes |
| `sync` then `sysctl vm.drop_caches=3` | **No** |

The script does not hold a long-lived root session, does not edit `/etc/sudoers`, does not install or
modify any service, and never escalates silently. If `sudo` is unavailable the mode aborts rather than
continuing in a degraded state.

Two values here are **hardcoded and ignore `--days`**: the journal vacuum target (100 MB) and the `/tmp`
age threshold (7 days).

## What no guard covers

Being explicit about the gaps is more useful than reassurance.

| Gap | What it means |
|---|---|
| **No undo** | Nothing here makes a deletion reversible. See [Deletion is permanent](./irreversibility.md). |
| **`~/Downloads` and `~/Desktop` are not allowlisted** | They are reachable. Only Guard 3 stands between them and deletion — read the candidates. |
| **`--purge-all` removes Guard 2** | Guards 1, 3 and 4 still apply; the staleness gate does not. |
| **Running as root widens the blast radius** | The tool is designed to run as a normal user. `--system` handles the legitimate sudo needs internally. |
| **Guards protect paths, not content** | A protected directory is safe wherever it sits; a valuable file outside one is not. |
| **`/proc` and `/sys` are not on the protected list** | Nothing targets them, but the allowlist does not name them either. |

## Verifying the guards yourself

```bash
npx linux-cleanup --self-test      # asserts the guards fire on known paths
npx linux-cleanup --list-targets   # prints both target and protected lists
```

`--self-test` is the honest check. It asserts that `/`, `$HOME`, `~/Documents`, `~/.ssh` and `/etc` are
protected and that `~/.cache/yarn` is not, then exits non-zero if any assertion fails. Documentation can
drift; the assertion runs against the code you actually have.

## Next

- [Protected paths](../reference/protected-paths.md) — the complete verified lists
- [Deletion is permanent](./irreversibility.md) — the model behind "no undo"
- [What it deletes](./what-it-deletes.md) — the target inventory
