---
title: Send a bug report
description: How to report a linux-cleanup bug — building a debug bundle, what a crash bundle contains, what to review before sending, and where to send it.
tags: [guide, bug-report, feedback, debug-bundle, crash, privacy]
sidebar_position: 3
---

# Send a bug report

**Two commands produce everything a maintainer needs.** Nothing is transmitted automatically — you review
the bundle and send it yourself.

```bash
linux-cleanup --debug-bundle    # package the latest log + session record
linux-cleanup --feedback        # instructions, and an optional mailto draft
```

## The quick path

```bash
linux-cleanup --debug-bundle
```

Writes `~/.linux-cleanup/feedback/debug-bundle-<timestamp>.tar.gz` containing:

- The latest session log
- The latest JSON session record, if one exists
- A `MANIFEST.txt` with distro, kernel, bash version and self-test output

Then:

```bash
linux-cleanup --feedback
```

Prints what to include and offers to open a pre-filled `mailto:` draft with system information already
completed.

## Review the bundle before sending it

:::caution A bundle contains paths from your machine
Not file contents — but the log names every path touched, which means directory names, project names, and
sometimes filenames from `~/Downloads`.

Inspect it first:

```bash
tar -tzf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz     # list contents
tar -xzOf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz    # read it in full
```

If something in there is sensitive, extract the bundle, remove or redact the file, and re-archive — or just
send the manifest plus the specific lines that matter.
:::

## Crash bundles

Since [1.3.0](../changelog.md#130--2026-05-10), an unexpected non-zero exit writes
`crash-<timestamp>.tar.gz` to the same directory automatically, and prints the path.

It holds the active log, the most recent record, and a system manifest including the exit code.

**Nothing is sent.** The tool has no network code path — see [Privacy](#privacy-what-leaves-your-machine).
The bundle sits on your disk until you decide.

Crash bundles are **not** written for expected exits: `0`, `130` (`Ctrl-C`), `143` (SIGTERM) and `2`
(argument error) are all excluded. See
[Exit codes](../reference/exit-codes.md#how-the-crash-trap-decides).

## What to include

A good report is short and specific:

| Include | Example |
|---|---|
| Distro and version | `lsb_release -d` |
| Bash version | `bash --version \| head -1` |
| Tool version | `linux-cleanup --version` |
| The exact command | `linux-cleanup --all-safe -y -d 30` |
| Expected versus actual | "expected the Gradle wrapper kept, it was deleted" |
| The bundle | Attach the tar.gz |

The most valuable line is **expected versus actual**. A log alone shows what happened but not why you think
it was wrong.

## Where to send it

| Route | Use for |
|---|---|
| [GitHub issues](https://github.com/aoneahsan/linux-cleanup/issues) | Bugs, feature requests — preferred, public |
| [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) | Anything you would rather not post publicly |
| A pull request | You have a fix. MIT licensed, forks welcome |

Feature requests by description are as welcome as code. Say what you would want cleaned and why the existing
modes do not cover it.

## Bugs worth reporting immediately

Anything contradicting the documented safety model:

- A deletion inside a [protected path](../reference/protected-paths.md)
- A *current* editor extension version removed, not just a superseded one
- A file deleted despite being newer than `--days`, without `--purge-all`
- A personal-data mode acting without confirmation
- Any network connection made by the tool

Each of those is a safety-model violation rather than an inconvenience.

## Privacy: what leaves your machine

:::note Nothing, unless you send it
linux-cleanup makes **zero network calls**. No telemetry, no analytics, no crash upload, no update check.

Verify on a clone:

```bash
grep -rE 'curl|wget|http://|https://' cleanup.sh lib/ modules/ bin/
```

The only matches are the author's URLs in the version banner, the `mailto:` helper, and comments. There is no
network code path.
:::

Logs, records and bundles are local files. The maintainer cannot see them, and cannot push a fix to your
machine — a new version reaches you when you re-run `npx` or upgrade.

## Next

- [Troubleshooting](../troubleshooting.md) — check here first
- [Recovery](../recovery.md) — if data was lost
- [Exit codes](../reference/exit-codes.md)
