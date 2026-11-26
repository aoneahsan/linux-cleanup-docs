---
sidebar_position: 7
title: Удаление
description: Удаление настольного приложения, его расписаний и того, что оно хранит на вашем компьютере.
---

# Удаление

## Сначала удалите расписания {#remove-the-schedules-first}

Расписания — это пользовательские таймеры systemd, и они запускают копию CLI вне приложения. Удаление приложения их **не** удаляет. Перед удалением уберите каждое на экране **Расписания** или из терминала:

```bash
systemctl --user disable --now 'linux-cleanup-schedule-*.timer'
rm -f ~/.config/systemd/user/linux-cleanup-schedule-*.{timer,service}
systemctl --user daemon-reload
```

## Удаление приложения {#remove-the-app}

| Как установлено | Как удалить |
|---|---|
| AppImage | Удалите файл `.AppImage`, затем его пункт меню: `rm ~/.local/share/applications/linux-cleanup-desktop.desktop ~/.local/share/icons/hicolor/*/apps/linux-cleanup-desktop.png` |
| `.deb` | `sudo apt remove linux-cleanup` |

## Что остаётся {#what-stays-behind}

| Каталог | Что хранит | Удаляйте, если |
|---|---|---|
| `~/.linux-cleanup/` | Отчёты, журналы, потоки запусков по расписанию и копию CLI для расписаний. Терминальный CLI использует тот же каталог | Вы больше не пользуетесь и CLI |
| `~/.local/share/com.aoneahsan.linuxcleanup/` | Настройки приложения, отчёты и случайный идентификатор этого компьютера | После удаления приложения — всегда безопасно |

Учётная запись, в которую вы входили, остаётся и после удаления приложения. Удалите её в разделе **Учётная запись** до удаления приложения; удаление стирает учётную запись и её синхронизированные числа с сервера.
