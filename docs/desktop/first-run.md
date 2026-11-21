---
sidebar_position: 3
title: Dry run, real run, receipt
description: The first launch, then the one path every cleanup takes in the desktop app — dry run, confirm, real run, receipt.
---

# Dry run, real run, receipt

Every cleanup in the desktop app takes the same four steps, in the same order. Nothing can skip one.

## First launch

The first time the app opens it shows three short steps: what the app is, which folders the CLI always
refuses, and an optional **Sign in with Google**. Each can be skipped and opened again from **Help**.
Signing in is never needed to clean up; it adds real runs to the month and keeps run numbers across your
computers ([Accounts and plans](./accounts-and-plans.md)).

Sign-in opens Google in your browser. When you finish there, the browser hands the result back to the app on
`127.0.0.1`, and the app window takes over again.

## 1. Dry run

**Start a dry run** runs the all-safe cleanup with `--dry-run`. It removes nothing, anywhere. The screen then
lists every path the cleanup would remove, its measured size and why, and every path the CLI refused and
kept, with the reason. **Save the list as JSON** writes that list to a file on this computer.

A dashed button in the app is always a dry run. A solid button removes files.

## 2. Confirm

**Review and run** opens the only screen that starts a real run. It repeats what the dry run found, says how
many real runs your plan has left this month, and states that removal is permanent. **Run the cleanup now**
stays unavailable while:

- the dry run is more than a day old (run it again first);
- another run is still going;
- no real runs are left this month.

## 3. Real run

The CLI reports each path as it removes it, and the screen follows along. It checks every path again before it
removes it, so something that changed since the dry run is judged as it is now. **Cancel after this item**
stops once the current step finishes; anything already removed stays removed.

## 4. Receipt

Every run ends with a receipt, a dry run included: free space before and after, each step marked completed,
skipped or failed, and how the run ended. A cancelled or interrupted run lists its unfinished step as
failed. Receipts stay on this computer under **Receipts & history**, beside the CLI's own reports and logs in
`~/.linux-cleanup/`. Signed in on a plan with history sync, the app also sends the receipt's numbers — never a
path or a file name ([What leaves your computer](./overview.md#what-leaves-your-computer)).
