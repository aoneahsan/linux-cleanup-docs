---
title: Revisión de paquetes globales
description: Una revisión de solo lectura de los paquetes instalados globalmente con npm, pnpm, yarn, bun y deno, que marca cada uno como usado recientemente, como dependencia o sin uso, e imprime comandos de desinstalación que ejecuta usted.
tags: [globals, npm, pnpm, yarn, bun, deno, read-only, modes]
sidebar_position: 12
---

# Revisión de paquetes globales

**`--globals` lista los paquetes que tiene instalados globalmente con npm, pnpm, yarn, bun y deno, y marca cada uno.** Se añadió en la [1.1.0](../changelog.md#110--2026-05-10).

```bash
linux-cleanup --globals
linux-cleanup --globals -d 180
```

:::note Este modo nunca elimina nada
Imprime comandos de desinstalación listos para copiar y pegar, y se detiene. Usted decide qué ejecutar. Los paquetes globales son justo el tipo de cosa que rompe un flujo de trabajo cuando se eliminan por sorpresa, así que la herramienta se niega a quitarlos por usted.
:::

## Los veredictos {#the-verdicts}

| Veredicto | Significado |
|---|---|
| **recently used** | Modificado o usado en los últimos `--days` días. Déjelo |
| **needed by: `<pkg>`** | Otro paquete global lo declara como dependencia. Quitarlo rompe ese otro |
| **STALE — safe to uninstall** | Sin uso más allá del umbral y nada depende de él |

«Seguro de desinstalar» significa seguro desde el punto de vista de los demás paquetes globales de su equipo. No puede saber de un script de shell, una tarea de CI o una costumbre suya que llame al binario. Lea la lista antes de actuar.

## Por qué importan aquí los paquetes globales {#why-global-packages-matter-here}

Ningún modo de limpieza elimina **nunca** los paquetes instalados globalmente. `~/.local/share/pnpm`, `~/.npm`, `~/.yarn`, `~/.bun/install/global` y `~/.deno/bin` están en la [lista protegida de coincidencia exacta](../reference/protected-paths.md#exact-match-protected-paths) precisamente para protegerlos, una lección de un error real en el que la limpieza de pnpm apuntó a la raíz de instalación y borró paquetes globales. Vea la [1.1.0](../changelog.md#110--2026-05-10).

Esta revisión es la contrapartida deliberada: visibilidad sin automatización.

## Funciona sin los gestores de paquetes en el PATH {#works-without-the-package-managers-on-path}

Cada gestor se consulta mediante su CLI cuando está disponible, y mediante la inspección del sistema de archivos cuando no. Así que la revisión funciona incluso en un equipo donde `pnpm` se instaló pero ahora no está en el `PATH`, que a menudo es justo la situación que intenta diagnosticar.

Si un runtime está en el disco pero no conectado a su shell, el modo que lo arregla es [`--doctor`](./doctor.md).

## Buenos momentos para ejecutarlo {#good-moments-to-run-it}

- Antes de reinstalar Node o de cambiar de gestor de versiones
- Antes de pasar a un equipo nuevo: es un inventario portátil de sus herramientas
- Cuando la salida de `npm ls -g` ya no se reconoce
- Una o dos veces al año, por higiene

## Siguiente {#next}

- [Doctor](./doctor.md): arreglar un runtime instalado pero fuera del `PATH`
- [Rutas protegidas](../reference/protected-paths.md): por qué nunca se tocan los paquetes globales
