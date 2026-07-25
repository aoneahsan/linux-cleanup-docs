---
title: About
description: Who built linux-cleanup, the design principles behind it, its licence, and how to get in touch or contribute.
tags: [about, author, licence, contributing, credits]
sidebar_position: 95
---

# About

**linux-cleanup is built and maintained by [Ahsan Mahmood](https://aoneahsan.com)**, an independent software
engineer working on developer tooling and application development.

| | |
|---|---|
| **Author** | Ahsan Mahmood |
| **Email** | [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |
| **Web** | [aoneahsan.com](https://aoneahsan.com) |
| **LinkedIn** | [linkedin.com/in/aoneahsan](https://linkedin.com/in/aoneahsan) |
| **GitHub** | [github.com/aoneahsan](https://github.com/aoneahsan) |
| **npm** | [npmjs.com/~aoneahsan](https://www.npmjs.com/~aoneahsan) |

## Why it exists

Developer machines accumulate an enormous amount of regenerable junk — package-manager caches measured in
tens of gigabytes, browser caches, build-tool caches, emulator images, and `node_modules` for projects
abandoned two years ago.

Existing cleaners tended to fall into one of two shapes. Either they did not know about modern developer
caches at all, or they were single-button wipers that deleted whatever looked like junk and hoped for the
best.

linux-cleanup takes the opposite stance: **scriptable, transparent, allowlist-guarded, and interactive by
default.** You can read exactly what it will touch before it touches anything.

## Design principles

**Fail closed.** An [allowlist, not a blocklist](./safety/guards.md#guard-1--the-path-allowlist). A path the
tool does not recognise is refused. A blocklist puts one typo between clearing a cache and clearing a home
directory.

**Distinguish caches from tools.** `~/.cache/yarn` regenerates in seconds; a Gradle wrapper distribution is a
230 MB download you might need next month. The [staleness gate](./safety/guards.md#guard-2--the-staleness-gate)
exists because treating those the same was wrong, and 1.2.0 changed it.

**The user is the oracle for personal data.** Nothing on disk distinguishes an installer you will never open
again from the only copy of a document. The tool refuses to guess, which is why those modes
[ignore `--yes`](./safety/guards.md#guard-3--personal-data-is-interactive-only).

**Prevention over recovery.** [No undo](./safety/irreversibility.md), by choice — an undo log is write
amplification on the disk you are freeing, and it breeds carelessness.

**Auditable over convenient.** Bash, because it is already installed and can be read. A compiled binary would
be more ergonomic and much harder to trust.

**No network, ever.** No telemetry, no analytics, no update check. Nothing leaves your machine unless you
email it.

## Corrections shape the tool

Two of the safety features exist because someone pointed out a real problem.

The [protected install-root list](./reference/protected-paths.md#exact-match-protected-paths) came from a
genuine defect: pnpm cleanup targeted `~/.local/share/pnpm` — the install root — and removed globally
installed packages. Fixed in [1.1.0](./changelog.md#110--2026-05-10), along with an assertion so it cannot
recur.

The [staleness gate](./safety/guards.md#guard-2--the-staleness-gate) came from a user observing that 1.2.0
still wiped Android AVDs wholesale, and that the same reasoning should apply to anything that is a tool
rather than a cache. That became [1.2.1](./changelog.md#121--2026-05-10).

If you find something wrong, [say so](./guides/send-a-bug-report.md).

## Licence

**[MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)** since
[1.4.0](./changelog.md#140--2026-07-11).

Use it personally or commercially, modify it, fork it, embed it, redistribute it. The only condition is
keeping the copyright notice and the MIT permission notice in copies or substantial portions.

:::danger Provided "AS IS", with no warranty
This is a tool that deletes files. The author accepts no liability for any claim or damages, including data
loss, arising from its use. Back up your data and review every action before confirming it.

The [full licence text](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE) controls.
:::

Releases published before 1.4.0 keep the licence they shipped under.

## Contributing

Contributions are welcome under MIT.

- **Fork and open a pull request** — no special access needed
- **Report bugs or request features** via
  [GitHub issues](https://github.com/aoneahsan/linux-cleanup/issues) or email
- **`main` is protected** — changes land through reviewed PRs

Coding standards are safety-first, offline-only, and ShellCheck-clean. See
[CONTRIBUTING.md](https://github.com/aoneahsan/linux-cleanup/blob/main/CONTRIBUTING.md).

A description-only feature request is as welcome as code. Say what you would want cleaned and why the
existing modes do not cover it.

## This documentation

Built with [Docusaurus](https://docusaurus.io/) and deployed to GitHub Pages. Source:
[github.com/aoneahsan/linux-cleanup-docs](https://github.com/aoneahsan/linux-cleanup-docs) — corrections
welcome there too.

Machine-readable summary for AI assistants: [`/llms.txt`](https://linux-cleanup-docs.aoneahsan.com/llms.txt).

## Related links

| | |
|---|---|
| **Source** | [github.com/aoneahsan/linux-cleanup](https://github.com/aoneahsan/linux-cleanup) |
| **npm** | [npmjs.com/package/linux-cleanup](https://www.npmjs.com/package/linux-cleanup) |
| **Issues** | [github.com/aoneahsan/linux-cleanup/issues](https://github.com/aoneahsan/linux-cleanup/issues) |
| **Support the work** | [aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=linux-cleanup&project-identifier=linux-cleanup) |
