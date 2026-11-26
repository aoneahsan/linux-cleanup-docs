---
sidebar_position: 7
title: Desinstalar
description: Quite la aplicación de escritorio, sus programaciones y lo que guarda en su equipo.
---

# Desinstalar

## Quite primero las programaciones {#remove-the-schedules-first}

Las programaciones son temporizadores de usuario de systemd y ejecutan una copia de la CLI fuera de la aplicación. Quitar la aplicación **no** las quita. Elimine cada una en la pantalla **Programaciones** antes de desinstalar, o desde una terminal:

```bash
systemctl --user disable --now 'linux-cleanup-schedule-*.timer'
rm -f ~/.config/systemd/user/linux-cleanup-schedule-*.{timer,service}
systemctl --user daemon-reload
```

## Quite la aplicación {#remove-the-app}

| Instalada como | Se quita con |
|---|---|
| AppImage | Elimine el archivo `.AppImage` y después su entrada de menú: `rm ~/.local/share/applications/linux-cleanup-desktop.desktop ~/.local/share/icons/hicolor/*/apps/linux-cleanup-desktop.png` |
| `.deb` | `sudo apt remove linux-cleanup` |

## Lo que queda {#what-stays-behind}

| Carpeta | Contiene | Elimínela si |
|---|---|---|
| `~/.linux-cleanup/` | Informes, registros, flujos de las ejecuciones programadas y la copia de la CLI de las programaciones. La CLI de la terminal usa la misma carpeta | Ya no usa tampoco la CLI |
| `~/.local/share/com.aoneahsan.linuxcleanup/` | La configuración de la aplicación, los recibos y el identificador aleatorio de este equipo | Siempre se puede eliminar sin riesgo tras desinstalar |

Una cuenta con la que haya iniciado sesión sigue existiendo cuando la aplicación ya no está. Elimínela desde **Cuenta** antes de desinstalar; al eliminarla se borran la cuenta y sus números sincronizados del servidor.
