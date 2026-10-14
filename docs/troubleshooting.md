---
title: Troubleshooting
description: Symptom, cause and fix for the problems linux-cleanup users actually hit — refusals, missing dependencies, cron failures, slow scans and version confusion.
tags: [troubleshooting, errors, fixes, cron, jq, whiptail]
sidebar_position: 92
---

# Troubleshooting

Symptom → cause → fix. Run the verify command first; if it matches, apply the fix.

If you have lost data rather than hit an error, go to [Recovery](./recovery.md) instead.

## REFUSE: protected path

```text
✗ REFUSE: protected path: /home/you/Documents/something
```

**Cause.** The path resolved — after symlink expansion — to somewhere on the
[protected list](./reference/protected-paths.md). The allowlist blocked it.

**This is correct behaviour, not a failure.** Nothing was deleted.

**Fix.** Find out what resolved where:

```bash
linux-cleanup --list-targets
realpath <the path that was rejected>
```

Almost always a cache symlinked into a protected directory. **Fix the symlink, not the tool** — the tool is
doing exactly its job. There is no override flag, by design.

Two related messages:

```text
✗ REFUSE: unsafe path: '/home/you'            # bare $HOME or /
✗ REFUSE: shell-init / history file: …        # .bashrc, .zshrc and similar
```

## TUI mode needs whiptail or dialog

**Cause.** `--tui` was run with neither installed.

**Fix.** Install one, or accept the offered fallback to the CLI menu.

```bash
sudo apt install whiptail     # Debian / Ubuntu
sudo dnf install newt         # Fedora / RHEL
sudo pacman -S libnewt        # Arch
```

**Verify.** `command -v whiptail`, then re-run. See [TUI](./modes/tui.md).

## export requires jq

**Cause.** `--export md`, `--export html`, or a conversion in the reports manager, without `jq` installed.

**Fix.**

```bash
sudo apt install jq
```

`jq` is needed only for conversion. JSON records are still written on every run without it. See
[Reports](./modes/reports.md).

## command not found

**Cause.** A required dependency is missing or shadowed by an incompatible alias. Common on minimal
containers that ship BusyBox instead of GNU coreutils.

**Verify.**

```bash
linux-cleanup --self-test
```

This probes every required command and names the first one missing.

**Fix.** Install your distro's coreutils, findutils and gawk packages. On Alpine:

```bash
apk add coreutils findutils bash
```

`realpath` matters most — it is what makes the [protected-path check](./reference/protected-paths.md)
symlink-safe. See [Distro support](./distro-support.md#minimal-containers).

## Cron entry runs but does nothing

**Verify.**

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

**Cause.** `command not found` in the cron log means cron's minimal `PATH` (`/usr/bin:/bin`) cannot see your
install. This is the single most common cron problem.

**Fix.** Use an absolute path in the crontab:

```bash
crontab -e
# Change:  0 3 * * 0 linux-cleanup --all-safe -y …
# To:      0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y …
```

Find the right path with `command -v linux-cleanup`. Alternatively put a `PATH=` line at the top of the
crontab. See [Alias and cron](./guides/alias-and-cron.md).

## $HOME is not set

```text
✗ $HOME is not set
```

**Cause.** Running in a context that does not set `$HOME` — some Docker images, some CI runners.

**Fix.**

```bash
HOME=/root linux-cleanup --scan
```

Or export it once for the session. The script aborts rather than guessing, deliberately: a wrong `$HOME`
would mean every path check is evaluated against the wrong tree.

## Scan or --node-modules seems to hang

**Cause.** `find` walking thousands of directories under `$HOME`. On a spinning disk the first run takes one
to three minutes.

**Verify.** Watch the log rather than the terminal:

```bash
tail -f ~/.linux-cleanup/logs/cleanup-*.log
```

New lines every five to ten seconds means it is working.

**Fix.** Be patient on the first run; later runs are faster thanks to cached directory metadata. If the same
path consistently stalls past five minutes, suspect a symlink loop or an unresponsive network or FUSE mount —
and [report it](./guides/send-a-bug-report.md).

## Disk usage grew during the session

**Cause.** The reported recovery is a `df` delta across the whole machine. Another process — a build, a
package update, journal rotation, an IDE re-indexing — wrote more during your session than the cleanup
reclaimed.

**This is not a bug**, and it does not mean the cleanup failed. Check what the steps themselves reported:

```bash
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

**Fix.** Re-run `--scan` when the machine is quiet to see the real picture.

## apt update fails after --system

**Cause.** Rare. `apt clean` does not break `apt update`, but the cleanup may have raced with another apt
operation holding a lock.

**Verify.**

```bash
sudo apt update 2>&1 | tail -20
```

**Fix.**

```bash
sudo rm -f /var/lib/apt/lists/lock /var/cache/apt/archives/lock /var/lib/dpkg/lock-frontend
sudo apt update
```

Do this only when no apt process is genuinely running — `ps aux | grep -i apt` first.

## VS Code reports a missing extension

**Cause.** Usually correct behaviour: a superseded version was removed while the editor still held a
reference to it.

**Fix.** Reload the window — `Ctrl+Shift+P` → **Developer: Reload Window**.

**Verify** the current version is still present:

```bash
ls ~/.vscode/extensions/ | grep <extension-name>
```

If the *current* version is genuinely gone, that indicates a bug in the highest-version detection. Reinstall
and [report it](./guides/send-a-bug-report.md):

```bash
code --install-extension <publisher>.<name>
```

## A crash bundle appeared but I saw no crash

**Cause.** The script exited non-zero from somewhere unexpected — a backgrounded `find` killed by the OOM
killer, or a broken pipe.

**Fix.** Read the exit code in the bundle's manifest:

```bash
tar -xzOf ~/.linux-cleanup/feedback/crash-*.tar.gz --wildcards '*MANIFEST*'
```

`137` is the OOM killer, `141` is SIGPIPE, `139` a segfault. See [Exit codes](./reference/exit-codes.md). Any
of these is worth reporting.

## alias cleanup: not found after --install-alias

**Cause.** The shell rc file has not been re-read.

**Fix.**

```bash
source ~/.bashrc      # or ~/.zshrc
```

Or open a new terminal.

## Wrong version running

**Verify.**

```bash
command -v linux-cleanup
linux-cleanup --version
```

**Cause.** An old global install shadowing a newer `npx` cache, or a stale shell command hash.

**Fix.**

```bash
npm uninstall -g linux-cleanup
npm install -g linux-cleanup@latest
hash -r
linux-cleanup --version
```

The npm registry reported **1.6.0** on 2026-10-14. Review the
[changelog](./changelog.md) for fixes since 1.4.0.

## Still stuck

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

Review the bundle, then email it with a short description of expected versus actual. See
[Send a bug report](./guides/send-a-bug-report.md).
