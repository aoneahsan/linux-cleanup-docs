---
title: Variables de entorno
description: "Todas las variables de entorno que lee linux-cleanup, con su valor por defecto y su efecto: cambio de directorios de salida, control del color y búsqueda de configuración XDG."
tags: [environment, variables, configuration, no-color, xdg, reference]
sidebar_position: 4
---

# Variables de entorno

**Todas las variables de entorno que lee linux-cleanup.** Todas son opcionales.

| Variable | Por defecto | Efecto |
|---|---|---|
| `NO_COLOR` | sin definir | Cualquier valor no vacío desactiva el color ANSI. El estándar común a muchas herramientas de [no-color.org](https://no-color.org). Igual que `--no-color` |
| `CLEANUP_NO_COLOR` | `0` | Interruptor de color propio de linux-cleanup. Póngalo a `1` para quitar el color solo aquí |
| `LINUX_CLEANUP_LOG_DIR` | `~/.linux-cleanup/logs/` (npx / npm) o `<repo>/logs/` (clon) | Dónde van los registros de sesión. Se crea si no existe |
| `LINUX_CLEANUP_REPORTS_DIR` | `~/.linux-cleanup/reports/` o `<repo>/reports/` | Dónde van los registros JSON de sesión. Se crea si no existe |
| `LINUX_CLEANUP_DATA_HOME` | sin definir: usa el directorio padre del de registros | Directorio padre de `logs/`, `reports/` y `feedback/` a la vez |
| `LINUX_CLEANUP_NPX` | sin definir | **Interna.** El lanzador de Node la pone a `1`. No la defina usted |
| `LINUX_CLEANUP_LAUNCHER` | sin definir | **Interna.** El lanzador de Node pone `node`; la aplicación de escritorio pone `desktop`, que omite la comprobación de actualizaciones de la CLI porque la aplicación hace la suya (desde la 2.1.0). No la defina usted |
| `XDG_CONFIG_HOME` | `~/.config` | Dónde se buscan `personal-roots.txt` y `project-roots.txt` |

## Redirigir toda la salida

`LINUX_CLEANUP_DATA_HOME` es la única palanca que lo mueve todo: registros, informes y paquetes de comentarios:

```bash
export LINUX_CLEANUP_DATA_HOME="/mnt/secure/linux-cleanup"
linux-cleanup --scan
```

:::caution Se crea el directorio, no el punto de montaje
La herramienta crea `logs/`, `reports/` y `feedback/` bajo la ruta que indique. **No** crea ni comprueba el punto de montaje subyacente. Si apunta a una ruta sin montar, la salida acaba en el sistema de archivos subyacente, sin avisar.

Compruebe que el destino está montado y admite escritura antes de confiar en él.
:::

Para un control más fino, `LINUX_CLEANUP_LOG_DIR` y `LINUX_CLEANUP_REPORTS_DIR` cambian cada uno por separado y tienen prioridad sobre la raíz de datos.

## Control del color

```bash
export NO_COLOR=1          # todo en este equipo, todas las herramientas
export CLEANUP_NO_COLOR=1  # solo linux-cleanup
linux-cleanup --no-color   # solo esta ejecución
```

`CLEANUP_NO_COLOR` existe para cuando quiere color en todas las demás herramientas y texto plano en esta, normalmente al canalizar su salida hacia algo que estropea las secuencias de escape.

## Configurar las raíces analizadas

Dos archivos en `$XDG_CONFIG_HOME` (por defecto `~/.config`) deciden qué directorios recorren los analizadores de archivos personales y de proyectos:

| Archivo | Lo usa | Raíces por defecto |
|---|---|---|
| `personal-roots.txt` | [`--stale`](../modes/personal-stale-files.md) | `~/Downloads`; las raíces protegidas como `~/Desktop` se ignoran |
| `project-roots.txt` | [`--node-modules`](../modes/node-modules-finder.md) | Sus directorios de proyectos |

Una ruta por línea. Sigue la [especificación XDG Base Directory](https://specifications.freedesktop.org/basedir-spec/), así que definir `XDG_CONFIG_HOME` traslada ambos.

:::danger Añadir una raíz a `personal-roots.txt` amplía lo que se puede eliminar
El analizador de archivos personales es [solo interactivo](../safety/guards.md#guard-3--personal-data-is-interactive-only), así que no se elimina nada sin su confirmación archivo por archivo; pero una raíz que añada es un directorio cuyo contenido empezará a aparecer en las listas de candidatos.

La [lista de rutas permitidas](./protected-paths.md) sigue aplicándose y sigue mandando: añadir aquí `~/Documents` no lo vuelve eliminable.
:::

## Para CI y scripts

```bash
NO_COLOR=1 linux-cleanup --scan > /tmp/scan.log
```

El análisis independiente no crea el informe JSON de sesión del recorrido guiado. Compruebe el [código de salida](./exit-codes.md) en sus scripts o use [`--json-events`](./json-events.md) para obtener una salida estructurada.

## Lo que no lee

- `PATH`, salvo para detectar qué herramientas opcionales están instaladas
- `USER` y `LOGNAME`, salvo para anotar la cabecera del registro
- El historial, los alias o la configuración de su shell: [`--doctor`](../modes/doctor.md) es el único modo que lee los archivos de inicio del shell, y solo para comprobar si un entorno de ejecución está conectado
- Ninguna configuración remota o proporcionada por la red. No existe

Si `$HOME` no está definido, el script se detiene de inmediato en lugar de adivinar. Vea [Solución de problemas](../troubleshooting.md#home-is-not-set).

## Siguiente

- [Rutas de salida](./output-paths.md) — dónde acaban realmente los archivos
- [Opciones de la CLI](./cli-flags.md)
