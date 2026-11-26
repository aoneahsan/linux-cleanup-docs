---
sidebar_position: 3
title: Programaciones
description: Simulaciones y limpiezas totalmente seguras programadas como temporizadores de usuario de systemd.
---

# Programaciones

Las programaciones forman parte de los planes Pro y Team. Una programación es un par de **unidades de usuario de systemd** en `~/.config/systemd/user/`, llamadas `linux-cleanup-schedule-<id>.timer` y `.service`. Ejecuta una simulación o la limpieza totalmente segura a diario, semanalmente o un día del mes (del 1 al 28).

El temporizador usa `Persistent=true`: si el equipo estaba apagado a la hora fijada, la ejecución se hace en el siguiente inicio de sesión. Cada ejecución programada escribe su flujo de eventos en `~/.linux-cleanup/schedule-runs/`, y la aplicación lo convierte en un recibo la próxima vez que la abre.

Como los archivos de un AppImage desaparecen al cerrar la aplicación, una programación ejecuta una copia de la CLI incluida en `~/.linux-cleanup/desktop-engine/`. La aplicación actualiza esa copia cada vez que se inicia, así que un temporizador siempre ejecuta la versión que incluye la aplicación.

Para ver o detener un temporizador desde una terminal:

```bash
systemctl --user list-timers 'linux-cleanup-schedule-*'
systemctl --user disable --now linux-cleanup-schedule-<id>.timer
```
