---
title: FAQ
description: Common questions about linux-cleanup — whether it can delete your code, whether it phones home, why there is no undo, how often to run it, and what it will not do.
tags: [faq, questions, safety, privacy, licence]
sidebar_position: 93
---

# FAQ

Symptom-specific problems belong in [Troubleshooting](./troubleshooting.md); design rationale is in
[Safety guards](./safety/guards.md).

## Will it delete my code?

**Your source files, no.** `~/Documents` and the other personal directories are
[protected outright](./reference/protected-paths.md), and no cleanup target points at a project's source.

The closest it comes is finding stale `node_modules` directories inside your project roots. Those are
[interactive-only](./modes/node-modules-finder.md) with per-project confirmation, and `yarn install` rebuilds
them.

One caveat worth knowing: if you edited a file *inside* `node_modules` directly, rather than through a patch
tool, that edit exists nowhere else.

## Does it phone home?

**No. Zero network calls.** No telemetry, no analytics, no crash upload, no update check.

Verify it yourself on a clone:

```bash
grep -rE 'curl|wget|http://|https://' cleanup.sh lib/ modules/ bin/
```

Matches appear only in the version banner's URLs, the `mailto:` feedback helper, and comments. There is no
network code path. The only data that leaves your machine is what you choose to email.

## Why is there no undo?

An undo log would be write amplification on the disk you are trying to free — keeping 20 GB in order to
reclaim 20 GB accomplishes nothing. It would also create false confidence, and be partial at best.

The safety model is prevention instead: an allowlist, a staleness gate, and interactive confirmation. Full
reasoning: [Deletion is permanent](./safety/irreversibility.md).

## Is there a `--dry-run`?

**No.** Read-only inspection is a separate mode, [`--scan`](./modes/scan.md). Passing `--dry-run` exits with
code `2` for an unknown flag — do not treat that as a safety net. See
[Preview before deleting](./safety/preview-first.md).

## What is the safest way to try it?

```bash
linux-cleanup --self-test      # verifies the guards actually fire
linux-cleanup --scan           # read-only; shows what would be reclaimed
linux-cleanup --list-targets   # every path it can touch
```

After those three you have seen the safety model work without losing a byte. Then run `linux-cleanup` and
answer `n` to anything that surprises you.

## Will it speed up my computer?

A little, sometimes, and it is worth being honest about how little:

- VS Code launches faster with a dozen extension directories rather than fifty
- A cold cache is marginally faster to skim than a bloated one
- Browser cold-starts are unaffected — caches are key-value, lookups are O(1)
- The page-cache drop frees RAM, not disk, and the kernel refills it immediately

The real benefit is that "disk full" stops blocking your work — not a benchmark number.

## What if I press `Ctrl-C` mid-cleanup?

The current removal finishes — usually well under a second — then the script exits with code `130`. The log
keeps everything up to that point. The [crash trap deliberately ignores `130`](./reference/exit-codes.md),
so no crash bundle is written.

## Can I run it as root?

You can, but you should not. It is designed to run as a normal user, and running as root only widens the
blast radius if a bug ever slipped past the guards. [`--system`](./modes/system-cleanup.md) handles the
legitimate sudo needs internally, one audited command at a time.

## Does it work on my distro?

Cache cleanup inside `$HOME` works on **every** Linux distribution.

[`--system`](./modes/system-cleanup.md) is **Debian and Ubuntu only** — it calls `apt` and `dpkg` with no
distro detection. On Fedora, Arch or openSUSE its package steps fail while the journal, `/tmp` and page-cache
steps still work. See [Distro support](./distro-support.md).

## What about WSL?

Works normally. linux-cleanup runs on the Linux side and behaves identically to a native install. It does not
walk into `/mnt/c/`. If `~/Downloads` is symlinked to a Windows directory, the allowlist resolves the symlink
before deciding, so Windows-side `Documents` and `Pictures` are refused.

## Why bash rather than Python, Go or Rust?

Bash is already on every system this targets. A compiled binary would mean shipping something users cannot
easily audit; a Python or Node implementation would add a runtime dependency to a tool whose entire job is
removing things from your disk.

The script is a few thousand lines of commented bash that a senior engineer can read in an afternoon. For a
tool that runs `rm -rf` with `sudo` available, auditability is worth more than ergonomics.

## How often should I run it?

| Mode | Cadence |
|---|---|
| [`--scan`](./modes/scan.md) | Monthly, as a baseline |
| [`--all-safe -y`](./modes/all-safe.md) | Weekly — [automate it](./guides/alias-and-cron.md) |
| [`--system`](./modes/system-cleanup.md) | Quarterly, manually |
| [`--node-modules`](./modes/node-modules-finder.md) | Yearly, once side projects pile up |
| [`--editor-ext`](./modes/editor-extensions.md) | When the editor feels slow — also covered by `--all-safe` |
| [`--stale`](./modes/personal-stale-files.md) | Quarterly, deliberately |
| [`--doctor`](./modes/doctor.md) | When `command not found` appears |
| [`--globals`](./modes/globals-audit.md) | Before reinstalling Node or migrating machines |

## What is `--purge-all` for?

It disables the [staleness gate](./safety/guards.md#guard-2--the-staleness-gate), wiping caches in full
rather than pruning idle files. That includes Gradle wrapper distributions, Playwright browsers and Cypress
binaries you might still want.

It is the right choice before reimaging a machine and a poor default otherwise. Never combine it with a cron
job.

## Which version should I install?

The npm registry reported **1.6.0** on 2026-10-14. Versions 1.5.0–1.6.0
include safety and behavior changes. See the [changelog](./changelog.md).

## What licence is it under?

**[MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)** since 1.4.0 — permissive and
OSI-approved. Use it personally or commercially, modify it, fork it, embed it, redistribute it. The only
condition is keeping the copyright and permission notice.

Provided "AS IS" with no warranty. Releases published before 1.4.0 keep the licence they shipped under.

## How do I request a feature or report a bug?

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

Then open a [GitHub issue](https://github.com/aoneahsan/linux-cleanup/issues) or email
[aoneahsan@gmail.com](mailto:aoneahsan@gmail.com). Pull requests are welcome under MIT; description-only
feature requests are equally welcome. See [Send a bug report](./guides/send-a-bug-report.md).

## What will it never do?

- Delete anything on the [protected-path list](./reference/protected-paths.md)
- Touch personal data without per-file confirmation
- Make a network connection
- Install a service, daemon or background agent
- Modify or remove an existing line in your shell configuration
- Recover anything it deleted
