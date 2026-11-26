---
sidebar_position: 2
title: Instalar y actualizar
description: Instale la aplicación de escritorio de linux-cleanup como AppImage o .deb, y cómo se actualiza sola.
---

# Instalar y actualizar

Descargue la versión actual desde la [página de descarga](https://linux-cleanup.aoneahsan.com/download); cada versión también está en [GitHub Releases](https://github.com/aoneahsan/linux-cleanup/releases) con una etiqueta `desktop-v<version>`. Cada versión incluye dos instaladores:

| Archivo | Para |
|---|---|
| `linux-cleanup_<version>_amd64.AppImage` | Cualquier distribución con sesión de escritorio. Hágalo ejecutable y ábralo |
| `linux-cleanup_<version>_amd64.deb` | Debian, Ubuntu y sus derivadas (`sudo apt install ./linux-cleanup_<version>_amd64.deb`) |

```bash
chmod +x linux-cleanup_*_amd64.AppImage
./linux-cleanup_*_amd64.AppImage
```

Desde la versión 1.0.4, el AppImage se añade al menú de aplicaciones la primera vez que se ejecuta: escribe `~/.local/share/applications/linux-cleanup-desktop.desktop` y su icono en `~/.local/share/icons/hicolor/`, y apunta la entrada al lugar donde esté el archivo. Si mueve el AppImage, ejecútelo una vez desde la nueva ubicación y la entrada lo seguirá. El `.deb` instala su propia entrada de menú.

La aplicación de escritorio necesita WebKitGTK 4.1 y GTK 3, que incluyen las distribuciones de escritorio actuales. El `.deb` los declara como dependencias.

## Cómo se actualiza {#how-it-updates}

La aplicación se actualiza sola. Busca una actualización firmada al iniciarse, cuando su ventana vuelve a mostrarse y en el momento en que se publica una versión nueva. Con **Instalar actualizaciones automáticamente** activado (lo predeterminado), descarga la actualización, comprueba su firma y se reinicia en un momento tranquilo: nunca mientras hay una ejecución en curso.

Un **AppImage** se sustituye en su sitio. Una instalación **`.deb`** se actualiza mediante `dpkg`, así que el escritorio pide primero una contraseña de administrador (la ventana gráfica habitual); si la cancela, la versión actual sigue en marcha.

Una versión también puede marcarse como **obligatoria**:

- una versión **urgente** detiene la aplicación de inmediato, explica el motivo y ofrece un único botón **Actualizar**;
- una versión **normal** avisa de que hay una versión nueva y pasa a ser obligatoria desde el siguiente inicio.

Si la aplicación no tiene conexión al comprobar, sigue funcionando; una comprobación fallida nunca bloquea una ejecución.
