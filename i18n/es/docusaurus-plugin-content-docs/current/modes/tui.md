---
title: TUI (menú visual)
description: El menú visual con whiptail o dialog añadido en linux-cleanup 1.3.0, que vuelve al menú de la CLI si no hay ninguno instalado.
sidebar_position: 5
---

# TUI (menú visual)

**`--tui` muestra el menú de categorías como un cuadro de whiptail o dialog a pantalla completa.** Se añadió en la [1.3.0](../changelog.md#130--2026-05-10). Mismo comportamiento que [`--menu`](./menu.md), distinta presentación.

```bash
linux-cleanup --tui      # o: -t, -g, --gui
```

## Cómo funciona {#how-it-behaves}

Al elegir una entrada se sale del cuadro, se ejecuta esa categoría con la salida y las preguntas normales de la CLI y luego se vuelve al menú. Así que el cuadro es un lanzador: las confirmaciones reales siguen siendo las preguntas de texto habituales, y todas las protecciones siguen igual.

La TUI incluye también un cuadro **Acerca de** con la versión, los datos de contacto, la licencia y el compromiso de privacidad.

## Requisitos y alternativa {#requirements-and-fallback}

Necesita `whiptail` o `dialog`. Si no hay ninguno, la herramienta muestra una pista de instalación según la distribución y vuelve al menú normal de la CLI; no falla.

```bash
sudo apt install whiptail     # Debian / Ubuntu
sudo dnf install newt         # Fedora / RHEL
sudo pacman -S libnewt        # Arch
```

`whiptail` viene dentro de los paquetes `newt` / `libnewt` en sistemas RPM y Arch, por eso el nombre del paquete no coincide con el del comando.

:::note Es el único lugar donde la herramienta detecta su distribución
La pista de instalación de arriba tiene en cuenta la distribución. Nada más en linux-cleanup lo hace; en particular, [`--system` da por hecho Debian/Ubuntu](../distro-support.md).
:::

## Cuándo usar el menú simple {#when-to-use-the-plain-menu}

`--tui` necesita una terminal capaz de mostrar un cuadro a pantalla completa. En una conexión limitada, dentro de un registro de CI o en una sesión `ssh -T` sin TTY, use [`--menu`](./menu.md): no necesita nada más que bash.

## Siguiente {#next}

- [Menú](./menu.md): el equivalente en texto
- [Resumen de modos](./overview.md)
