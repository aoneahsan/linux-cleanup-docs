---
title: Uninstall
description: Remove linux-cleanup completely — the package, the shell alias, the cron entry, and its logs and session records.
tags: [guide, uninstall, remove, cleanup, cron, alias]
sidebar_position: 4
---

# Uninstall

**Remove the automation first, then the package, then the data.** Uninstalling the package does not remove a
shell alias or cron entry you installed — those are separate.

## 1. Remove the automation

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

Do this **before** removing the package, while the command still exists. If you have already removed it, see
[manual removal](#if-you-removed-the-package-first) below.

Verify:

```bash
crontab -l | grep -i cleanup     # expect no output
grep -rn 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

## 2. Remove the package

```bash
npm uninstall -g linux-cleanup
```

For `npx`, nothing is installed — the npm cache evicts it on its own. To clear it now:

```bash
npm cache clean --force
```

For a git clone, delete the directory:

```bash
rm -rf ~/linux-cleanup
```

:::caution A clone holds its own logs and records
Unlike the npm install paths, a clone keeps output in `<clone>/logs/` and `<clone>/reports/`. Deleting the
clone deletes those too. Copy anything you want to keep first. See
[Output paths](../reference/output-paths.md).
:::

## 3. Remove the data

Logs, session records and feedback bundles live in `~/.linux-cleanup/` and are **never** removed by
uninstalling.

```bash
ls -la ~/.linux-cleanup/           # look before deleting
rm -rf ~/.linux-cleanup/
```

They are small — usually a few megabytes — and they are the only account of what past runs deleted. Keeping
them costs nothing; removing them is irreversible like anything else.

If you set `LINUX_CLEANUP_DATA_HOME`, remove that directory instead, and drop the export from your shell
configuration.

## 4. Remove configuration, if you created any

```bash
rm -f ~/.config/personal-roots.txt ~/.config/project-roots.txt
```

Only present if you created them. See
[Environment variables](../reference/environment-variables.md#configuring-the-scanned-roots).

## If you removed the package first

Undo both helpers by hand.

**Cron:**

```bash
crontab -e
# delete the line containing linux-cleanup or cleanup.sh
```

**Alias:**

```bash
grep -n 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

Remove the matching alias line with your editor, then `source` the file or open a new terminal.

## What is left behind

Nothing, once the above is done. The tool installs no system service, no daemon, no systemd unit, no
`/etc` entry and no root-owned file. Everything it creates is inside your home directory.

Effects on your system it does not undo — because they are not files it owns:

- **Deleted caches stay deleted.** They regenerate as each tool needs them
- **Shell-init blocks added by [`--doctor`](../modes/doctor.md)** stay. They are the correct configuration
  for runtimes you have installed; remove them by hand if you want them gone

## Verify

```bash
command -v linux-cleanup      # expect no output
crontab -l | grep -i cleanup  # expect no output
ls ~/.linux-cleanup 2>&1      # expect: No such file or directory
```

## Next

- [Installation](../getting-started/installation.md) — if you are reinstalling
