---
sidebar_position: 6
title: Solución de problemas de la aplicación
description: El AppImage no arranca, el inicio de sesión no termina, el servidor de cuentas no responde o una programación no se ejecutó.
---

# Solución de problemas de la aplicación

La pantalla **Ayuda › Errores y sin conexión** de la aplicación cubre los mismos casos, con un botón para cada uno. Esta página es la versión extensa.

## El AppImage no se abre {#the-appimage-does-not-open}

- **No pasa nada al hacer doble clic.** El archivo tiene que ser ejecutable: `chmod +x linux-cleanup_*_amd64.AppImage`.
- **Un error menciona FUSE.** Los AppImage se montan con FUSE 2. Ubuntu 22.04 y posteriores no lo instalan por defecto: `sudo apt install libfuse2` (en Ubuntu 24.04, `libfuse2t64`). Sin él, el AppImage también puede ejecutarse con `./linux-cleanup_*_amd64.AppImage --appimage-extract-and-run`.
- **Un error menciona WebKitGTK o `libwebkit2gtk-4.1`.** La ventana necesita WebKitGTK 4.1 de su distribución. En Debian y Ubuntu, el `.deb` lo instala; con el AppImage, instale `libwebkit2gtk-4.1-0`.

## La aplicación dice que falta la CLI incluida {#the-app-says-the-bundled-cli-is-missing}

La aplicación comprueba su propia copia de `cleanup.sh` al iniciarse. Si esa comprobación falla, la instalación está dañada: vuelva a descargar la versión desde la [página de descarga](https://linux-cleanup.aoneahsan.com/download). Reinstalar no toca sus recibos, informes ni registros.

## El inicio de sesión no termina {#sign-in-does-not-finish}

El inicio de sesión se hace en su navegador y vuelve a la aplicación a través de `127.0.0.1`. Si el navegador muestra el resultado pero la aplicación no avanza, puede que un cortafuegos o una extensión del navegador estén bloqueando las direcciones locales. Un inicio de sesión fallido no cambia nada; puede volver a pulsar **Iniciar sesión con Google**.

## El servidor de cuentas no responde {#the-account-server-does-not-answer}

Las simulaciones, las ejecuciones reales, los recibos y las programaciones nunca necesitan internet. Sin conexión, la aplicación sigue contando las ejecuciones reales con la cuota mensual de este equipo y sincroniza cuando el servidor vuelve a responder. Solo esperan los cambios de plan y el historial sincronizado.

## Una programación no se ejecutó {#a-schedule-did-not-run}

```bash
systemctl --user list-timers 'linux-cleanup-schedule-*'
journalctl --user -u 'linux-cleanup-schedule-*' --since today
```

Un temporizador solo se dispara mientras tiene la sesión iniciada; uno perdido con el equipo apagado se ejecuta en el siguiente inicio de sesión. Cada ejecución que sí empezó deja su flujo en `~/.linux-cleanup/schedule-runs/`, y la aplicación lo convierte en un recibo la próxima vez que la abre.
