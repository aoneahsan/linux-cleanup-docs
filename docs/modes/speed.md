---
title: Speed diagnosis
description: Inspect Linux temperature, pressure and startup work, then decide whether to apply each suggested change.
tags: [speed, diagnosis, performance, startup, modes]
sidebar_position: 16
---

# Speed diagnosis

**`--speed` reports where the machine is spending time.** It reads thermal counters, CPU, memory and I/O pressure, heavy processes and boot information. It can also find containers, services and login apps that start by themselves.

```bash
linux-cleanup --speed --dry-run
linux-cleanup --speed
```

The dry run reports the changes it would ask about without applying them. A normal run asks separately before a proposed change; the default answer is No. `--yes` does not authorise these fixes.

Some accepted fixes stop a container, disable a service or change a user login setting. They do not remove cache files, but they affect what starts next time. The CLI prints an undo command after an applied change. A sudo prompt may appear for a system service change.

A finding is a measurement or a condition, not proof that a particular app is faulty. Read the named process or service and decide whether you need it before accepting a change.

For missing runtime commands in shell startup, use the separate [Doctor](./doctor.md) mode. For disk space, start with a [scan](./scan.md).
