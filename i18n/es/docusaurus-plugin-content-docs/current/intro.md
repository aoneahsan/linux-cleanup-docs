---
title: linux-cleanup
description: Una utilidad de línea de comandos en Bash que recupera espacio en disco en Linux eliminando de forma permanente cachés que se pueden regenerar, detrás de una lista de rutas permitidas, un umbral de inactividad y una confirmación interactiva.
tags: [linux, cleanup, disk-space, cli, bash, overview]
slug: /
sidebar_label: Introducción
sidebar_position: 1
---

# linux-cleanup

**linux-cleanup muestra las rutas antes de eliminar cachés regenerables en Linux.** Cubre las cachés de gestores de paquetes, navegadores y herramientas de compilación, con modos separados para el sistema y para archivos personales candidatos. Empiece con un análisis de solo lectura o una simulación antes de elegir una limpieza real.

Obtenga linux-cleanup: [en npm](https://www.npmjs.com/package/linux-cleanup) · [el sitio web](https://linux-cleanup.aoneahsan.com) · [todos los lugares](/apps)

Es una **herramienta destructiva**. Cada eliminación es permanente y no se puede deshacer. Su seguridad viene de negarse a tocar lo que no debe desde el principio, no de poder devolverlo después.

:::danger Esta herramienta elimina archivos de forma permanente
No hay deshacer, papelera ni copia de seguridad. Una limpieza real elimina para siempre los archivos seleccionados. Use `--dry-run` para revisar el modo elegido antes de confirmarlo.

Lea **[Qué elimina](./safety/what-it-deletes.md)** y ejecute **[la revisión de solo lectura](./safety/preview-first.md)** antes de dejar que elimine algo.
:::

| | |
|---|---|
| **Versión del paquete** | 2.1.1 en npm (2026-11-22); consulte `linux-cleanup --version` para la copia instalada |
| **Plataforma** | Solo Linux: `bash` ≥ 4 y GNU coreutils |
| **Licencia** | [MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE), desde la 1.4.0 |
| **Acceso a la red** | Una solicitud al registro público de versiones al iniciar, si hay conexión; instalar o actualizar también usa npm o GitHub |
| **Autor** | [Ahsan Mahmood](https://aoneahsan.com) · [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |

## Léalo en orden

Esta documentación sigue un orden pensado para una herramienta que borra datos. Las tres primeras páginas son las que le evitan problemas.

| Paso | Página | Por qué |
|---|---|---|
| 1 | [Qué elimina](./safety/what-it-deletes.md) | La lista completa de objetivos, por categoría |
| 2 | [Revisar antes de eliminar](./safety/preview-first.md) | Análisis de solo lectura y luego una simulación del modo elegido |
| 3 | [Protecciones](./safety/guards.md) | Los cuatro filtros que una ruta debe pasar antes de eliminarse |
| 4 | [La eliminación es permanente](./safety/irreversibility.md) | Qué significa en la práctica "sin deshacer" |
| 5 | [Instalación](./getting-started/installation.md) | `npx`, `npm` global o `git clone` |
| 6 | [Inicio rápido](./getting-started/quick-start.md) | Su primera limpieza real |

## En qué es bueno

- **Mostrar los candidatos.** Un análisis nombra las raíces de caché y su tamaño actual. Una simulación recorre la limpieza elegida y nombra las acciones propuestas.
- **No eliminar lo que no debe.** Una [lista de rutas permitidas](./reference/protected-paths.md) rechaza sin excepción `~/Documents`, `~/.ssh`, `~/.config`, `/etc` y similares, después de resolver los enlaces simbólicos.
- **Dejar en paz los archivos usados hace poco.** Desde la 1.2.0, lo predeterminado es *podar*, no vaciar: dentro de una caché solo se eliminan los archivos sin tocar durante más de 100 días. Vea [el filtro de inactividad](./safety/guards.md#guard-2--the-staleness-gate).
- **Registrar cada ejecución.** La CLI guarda un registro local. Los recorridos guiados escriben un [informe JSON de la sesión](./reference/report-schema.md) salvo que se desactive; las simulaciones no.
- **Buscar actualizaciones.** Al iniciar, la CLI lee un registro público de versiones por HTTPS cuando está disponible.

## Lo que no es

Tener claros los límites sirve más que una lista de funciones.

- **No es una herramienta de copias de seguridad.** Elimina; nunca archiva. Nada de lo que elimina se puede recuperar desde la herramienta.
- **No es una herramienta para deshacer.** [`--scan`](./modes/scan.md) solo lee; `--dry-run` muestra la limpieza elegida; ninguno recupera archivos después de una ejecución real.
- **No es un escáner de seguridad.** No encontrará secretos, malware ni vulnerabilidades.
- **No es multiplataforma.** Solo Linux. El paquete de npm declara `"os": ["linux"]`.
- **No funciona igual en todas las distribuciones.** La limpieza de cachés dentro de `$HOME` funciona en cualquiera, pero [el modo `--system` es solo para Debian/Ubuntu](./distro-support.md): llama directamente a `apt` y `dpkg`.
- **No sustituye su criterio.** Lea lo que propone antes de confirmarlo.

## La versión de 30 segundos

```bash
# 1. Vea cuánto se podría recuperar. No elimina nada.
npx linux-cleanup --scan

# 2. Revise la limpieza elegida sin eliminar.
npx linux-cleanup --all-safe --dry-run

# 3. Ejecute el recorrido guiado. Revise cada elección antes de eliminar.
npx linux-cleanup
```

El paso 3 es el modo predeterminado. Recorre diez categorías, pregunta antes de cada una, muestra el total acumulado de bytes recuperados y escribe un informe al final. Vea [Recorrido guiado](./modes/walkthrough.md).

## Adónde ir después

- ¿Quiere recuperar espacio lo antes posible? → [Recuperar el máximo de espacio](./guides/reclaim-the-most-space.md)
- ¿Algo salió mal? → [Recuperación](./recovery.md) y luego [Solución de problemas](./troubleshooting.md)
- ¿Quiere ver todas las opciones? → [Opciones de la CLI](./reference/cli-flags.md)
- ¿Qué cambió? → [Registro de cambios](./changelog.md)
