---
title: Shell alias and weekly cron
description: Install a cleanup shell alias and a weekly automated all-safe run, what each one writes, and how to remove them again.
tags: [guide, alias, cron, automation, scheduling, setup]
sidebar_position: 2
---

# Shell alias and weekly cron

**Two one-time setup helpers: a `cleanup` shell alias, and a weekly automated run.** Both are reversible with
a matching uninstall flag.

```bash
linux-cleanup --install-alias
linux-cleanup --install-cron
```

## The shell alias

```bash
linux-cleanup --install-alias
```

Appends a `cleanup` alias to `~/.bash_aliases` or `~/.zshrc`, depending on your shell. Afterwards, typing
`cleanup` anywhere runs the tool.

Reload your shell or the alias will not appear to exist:

```bash
source ~/.bashrc     # or ~/.zshrc
```

Remove it with `linux-cleanup --uninstall-alias`.

:::note Shell-init files are protected at the deletion layer
`.bashrc`, `.zshrc`, `.bash_aliases` and similar are on the
[protected-basename list](../reference/protected-paths.md#protected-basenames), so no cleanup mode can ever
delete one — regardless of the path it appears at. The alias installer appends; the uninstaller removes only
its own line.
:::

## The weekly cron job

```bash
linux-cleanup --install-cron
```

Schedules `--all-safe -y` for **Sundays at 03:00**, appending output to `~/.linux-cleanup/logs/cron.log`.
Requires `crontab`.

Remove it with `linux-cleanup --uninstall-cron`.

### Why `--all-safe` is the right mode for this

It is the only mode `--yes` applies to, and it **cannot touch personal data** — the interactive-only modes
are not part of it and ignore `--yes` by design. So an unattended run can clear caches and can never delete a
file from `~/Downloads`. See [Guard 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

The [staleness gate](../safety/guards.md#guard-2--the-staleness-gate) still applies, so recently-used files
survive each weekly pass.

## Writing the crontab entry yourself

For a different schedule or flags:

```bash
crontab -e
```

```bash
0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1
```

:::danger Use an absolute path
Cron runs with a minimal `PATH` — typically just `/usr/bin:/bin`. A bare `linux-cleanup` will not be found if
it lives in `~/.local/bin` or a Node version-manager directory, and the job fails silently every week.

This is the most common problem with scheduled runs. Find your path with:

```bash
command -v linux-cleanup
```

Or set `PATH=` explicitly at the top of the crontab.
:::

| Flag | Why in cron |
|---|---|
| `--all-safe -y` | Unattended, caches only |
| `--no-report` | Stops JSON records accumulating — they are **never** auto-deleted |
| `--cleanup-logs` | Removes that run's log at the end |
| `-d 30` | Optional: more aggressive weekly pruning |

`--cleanup-logs` alone is not enough to keep the directory small: it never touches records. `--no-report` is
the flag that does.

:::caution Do not add `--purge-all` to a scheduled job
Unattended plus no staleness gate means an expensive asset can disappear the week before you need it, with
nobody watching. Keep `--purge-all` for deliberate, supervised runs. See
[Reclaim the most space](./reclaim-the-most-space.md).
:::

## Checking that it ran

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

If the log shows `command not found`, it is the `PATH` problem above. If the log is empty, the job never
fired — check that the cron daemon is running (`systemctl status cron` or `crond`).

The cron log is **never rotated**. Rotate it yourself when it grows:

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## A systemd timer instead

If you prefer timers to cron, there is nothing tool-specific about it — schedule the same command. The tool
neither knows nor cares which scheduler invoked it, and `--install-cron` is a convenience rather than a
requirement.

## Removing both

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

Full removal including the package itself: [Uninstall](./uninstall.md).
