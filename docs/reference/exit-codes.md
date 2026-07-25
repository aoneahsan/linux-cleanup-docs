---
title: Exit codes
description: What each linux-cleanup exit code means, which ones trigger an automatic crash bundle, and how to branch on them from a script or cron job.
tags: [exit-codes, scripting, cron, crash-bundle, reference]
sidebar_position: 6
---

# Exit codes

**linux-cleanup follows the Unix convention: `0` is success, anything else is a problem.** Some non-zero
codes are expected and deliberately not treated as crashes.

## Codes

| Code | Meaning | Crash bundle |
|---|---|---|
| `0` | Clean run. Every requested action completed or was declined | No |
| `1` | Generic failure — an invariant was violated. Rare | Yes |
| `2` | Argument parse error. Help is printed | No |
| `127` | Command not found — a required dependency is missing | Yes |
| `130` | Aborted with `Ctrl-C` (SIGINT) | No |
| `137` | Killed by SIGKILL — usually the OOM killer or `kill -9` | Yes |
| `139` | Segfault. Should not happen in pure bash | Yes |
| `143` | Terminated by SIGTERM | No |
| any other non-zero | Unexpected internal failure | Yes |

`2` is the one worth remembering: **an unknown flag exits `2`**. If you typed `--dry-run` expecting safety,
this is the code you get — and no cleanup runs. That is not a safety feature to rely on; use
[`--scan`](../modes/scan.md).

## How the crash trap decides

The EXIT trap added in [1.3.0](../changelog.md#130--2026-05-10) evaluates in this order:

1. Exit code is `0`, **or** the script set its internal completion sentinel → no bundle
2. Exit code is `130` (`Ctrl-C`) or `143` (SIGTERM) → no bundle. A user-initiated stop is not a crash
3. Exit code is `2` (argument parse) → no bundle. The script printed help and stopped on purpose
4. Anything else → write `crash-<timestamp>.tar.gz` to `~/.linux-cleanup/feedback/`

The bundle contains the active session log, the most recent JSON record, and a short system manifest. It
stays on your machine — **nothing is transmitted**. The tool prints the path so you can review it and decide
whether to email it.

See [Send a bug report](../guides/send-a-bug-report.md).

## Branching on the code

```bash
if linux-cleanup --scan; then
  echo "scan succeeded"
else
  case $? in
    2)   echo "bad flag" ;;
    127) echo "missing dependency — run --self-test" ;;
    130) echo "user aborted" ;;
    *)   echo "unexpected failure — check ~/.linux-cleanup/feedback/" ;;
  esac
fi
```

## In cron

```bash
linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1 || \
  echo "linux-cleanup exited $?" | mail -s "cleanup failed on $(hostname)" you@example.com
```

Exit code `127` from a cron job almost always means the crontab used a bare command name and cron's minimal
`PATH` could not find it. Use an absolute path — see
[Troubleshooting](../troubleshooting.md#cron-entry-runs-but-does-nothing).

## Diagnosing an unexpected code from a crash bundle

The bundle's manifest records the exit code. The common ones:

| Code | Usual cause |
|---|---|
| `137` | Out-of-memory killer. Typically a `find` over an enormous tree |
| `141` | SIGPIPE — a pipe closed early, often a `tee` or pager exiting |
| `139` | Segfault — should never occur here; report it |
| `127` | Missing dependency. Run `--self-test` to identify it |

## Next

- [Send a bug report](../guides/send-a-bug-report.md)
- [Troubleshooting](../troubleshooting.md)
