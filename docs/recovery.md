---
title: Recovery
description: What to do after an unwanted linux-cleanup deletion — inspect available logs, restore from a backup or source, and avoid further disk writes where recovery matters.
tags: [recovery, data-loss, restore, undo, logs, reports]
sidebar_position: 91
---

# Recovery

**linux-cleanup has no undo.** This page is about working out what was removed and what your real options
are.

:::danger Stop writing to the disk first
If something irreplaceable was deleted and you intend to attempt file-carving recovery, **stop using the
filesystem now**. Every write reduces the chance of recovering unlinked data.

That applies only to the [genuinely irreplaceable categories](#3-decide-what-is-actually-recoverable). For a
cache, skip it — just let the tool re-fetch.
:::

## 1. Inspect the available record

A run can leave a local log. A guided walkthrough can also leave a JSON session record unless reporting was disabled. Neither is a complete per-file deletion record or a backup.

```bash
# The most recent session log
less "$(ls -t ~/.linux-cleanup/logs/cleanup-*.log | head -1)"

# The latest walkthrough record, if one exists
jq '.' "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

To search retained logs for a specific path:

```bash
grep -rn 'the-filename-you-are-missing' ~/.linux-cleanup/logs/
```

No match does not prove the tool left that file alone. A helper may report a whole cache directory or a command rather than each file, and `--cleanup-logs` can remove a run's log. Check the selected mode and target roots too.

Narrow to a single session's steps:

```bash
jq '.steps[] | select(.status == "ran")' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

## 2. Confirm it was not simply refused

Refusals are logged too. If you find a line like this, nothing was deleted:

```text
✗ REFUSE: protected path: /home/you/Documents/notes
```

See [Protected paths](./reference/protected-paths.md).

## 3. Decide what is actually recoverable

| What was deleted | Recovery |
|---|---|
| Package-manager cache | **Automatic.** The next install re-downloads it |
| Browser cache | **Automatic.** Rebuilds as you browse |
| Gradle cache or wrapper distro | **Automatic.** Next build re-fetches — expect a slow first build |
| Cypress / Playwright binaries | Re-run the install step for that tool |
| `node_modules` | `yarn install` or `npm install` in the project |
| Android AVD | Recreate in Android Studio. The **profile config is gone**; the system image re-downloads |
| Editor extension version | Reload the editor window; reinstall if genuinely missing |
| apt cache, journal, snap revisions | Regenerate on their own. Nothing to do |
| **Personal file from `~/Downloads`** | **Only from your own backup**, or re-download from the source |
| **Partial download** | Not recoverable. Restart the download |

### Regenerating the common ones

```bash
# In the affected project
yarn install            # or: npm install / pnpm install

# Test-runner binaries
npx cypress install
npx playwright install

# Flutter
flutter pub get
```

Nothing here needs the tool's involvement — you are just letting each tool do what it does on a cold cache.

## 4. If it was genuinely irreplaceable

Realistically, in order:

1. **Your own backup.** Timeshift, Borg, restic, rsync snapshot, cloud sync — whatever you run. This is the
   only reliable answer.
2. **The original source.** A downloaded file can be downloaded again. Check your browser history for the
   URL.
3. **A sync service's trash.** Dropbox, Nextcloud, Google Drive and similar keep deleted files server-side
   for a retention window. If the directory was synced, look there.
4. **File-carving tools** — `extundelete`, `testdisk`, `photorec`. These work on unlinked inodes and are a
   long shot on a busy filesystem, especially SSDs with TRIM enabled. Unmount the filesystem first, or work
   from a live USB, and never write recovered data back to the same device.

:::caution Be honest with yourself about step 4
On a mounted, actively-used SSD with TRIM, carving usually recovers nothing. It is worth attempting only for
something genuinely important, and only after you have stopped writing to the disk.
:::

## 5. Stop it happening again

| Change | Effect |
|---|---|
| Run [`--scan`](./modes/scan.md) before every cleanup | You see the outcome while it is still hypothetical |
| Move valuables out of `~/Downloads` | `~/Documents` and `~/Desktop` are [protected](./reference/protected-paths.md) |
| Skip step 7 in the walkthrough | Personal files then need a deliberate separate run |
| Raise the threshold: `-d 365` | Only genuinely ancient files become candidates |
| Never use `-y` outside `--all-safe` on a trusted machine | `-y` cannot touch personal data, but you see decisions only afterwards |
| Set up a real backup | The only thing that makes any deletion recoverable |

## 6. If the tool did something it should not have

If a deletion happened inside a [protected path](./reference/protected-paths.md), or a *current* editor
extension version was removed, or anything else contradicts the documented guards — that is a bug worth
reporting.

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

Include the log and a walkthrough record if one exists. See [Send a bug report](./guides/send-a-bug-report.md).

## Next

- [Deletion is permanent](./safety/irreversibility.md) — the design behind no-undo
- [Preview before deleting](./safety/preview-first.md) — avoiding the situation
- [Troubleshooting](./troubleshooting.md) — for problems that are not data loss
