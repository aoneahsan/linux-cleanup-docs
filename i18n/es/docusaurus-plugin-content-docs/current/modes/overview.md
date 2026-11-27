---
title: Resumen de modos
description: "Todos los modos de linux-cleanup agrupados por lo que hacen: inspección de solo lectura, limpieza guiada y por lotes, modos interactivos de datos personales y ayudantes de salida y reparación."
sidebar_position: 1
---

# Resumen de modos

**linux-cleanup tiene un único punto de entrada y elige el modo con una sola opción.** Ejecutarlo sin opciones inicia el [recorrido guiado](./walkthrough.md).

Los modos son excluyentes: indique uno. Opciones como `--days` y `--yes` se combinan con ellos.

## Solo lectura: nunca elimina nada {#read-only--never-deletes-anything}

Estos modos no eliminan objetivos de limpieza. Pueden escribir igualmente un registro local, y la comprobación de versiones puede leer un registro público si hay conexión.

| Modo | Opción | Muestra |
|---|---|---|
| [Análisis](./scan.md) | `-s` `--scan` | Todas las categorías de caché con su tamaño actual |
| [Revisión del directorio personal](./home-audit.md) | `--audit` | Las 20 entradas más grandes de `$HOME` |
| [Revisión de paquetes globales](./globals-audit.md) | `--globals` | Paquetes globales de npm/pnpm/yarn/bun/deno |
| Listar destinos | `--list-targets` | Todas las rutas que puede tocar la herramienta, más la lista protegida |
| Autocomprobación | `--self-test` | Comprobación de dependencias, sintaxis y protecciones |
| Versión | `-V` `--version` | Versión y autor |

## Limpieza: datos regenerables {#cleanup--regenerable-data}

Estos modos pueden eliminar objetivos de limpieza. `--yes` omite la confirmación del lote solo en `--all-safe`; los demás modos mantienen sus preguntas.

| Modo | Opción | Comportamiento |
|---|---|---|
| [Recorrido guiado](./walkthrough.md) | _(predeterminado)_ `-w` | Diez pasos guiados, con pregunta antes de cada uno |
| [Menú](./menu.md) | `-m` `--menu` | Menú numerado: elija una categoría |
| [TUI](./tui.md) | `-t` `--tui` | Lo mismo, como cuadro de whiptail/dialog |
| [Totalmente seguro](./all-safe.md) | `-a` `--all-safe` | Todas las cachés regenerables en una pasada |
| [Extensiones de editores](./editor-extensions.md) | `--editor-ext` | Versiones sustituidas de VS Code / Cursor |
| [Limpieza del sistema](./system-cleanup.md) | `--system` | apt, registro del sistema, snap, `/tmp`, caché de páginas; requiere `sudo` |

## Limpieza: solo interactiva {#cleanup--interactive-only}

Datos personales o de proyectos. Estos modos **ignoran `--yes`** y exigen confirmación por entrada. Vea el [filtro 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

| Modo | Opción | Busca |
|---|---|---|
| [Archivos personales sin uso](./personal-stale-files.md) | `-p` `--stale` | Archivos grandes sin uso en `~/Downloads` y en raíces sin protección configuradas |
| [Descargas incompletas](./partial-downloads.md) | `--partials` | `.fdmdownload`, `.crdownload`, `.part` |
| [Buscador de node_modules](./node-modules-finder.md) | `--node-modules` | Directorios de dependencias de proyectos sin uso desde hace N+ días |

## Salida, reparación y configuración {#output-repair-and-setup}

| Modo | Opción | Propósito |
|---|---|---|
| [Informes](./reports.md) | `--reports` | Listar, convertir y ver informes de sesiones anteriores |
| [Exportar](./reports.md#exporting) | `--export FMT ID` | Conversión no interactiva |
| [Doctor](./doctor.md) | `--doctor` | Reparar el inicio de la shell para nvm, pnpm, bun, deno, cargo |
| [Diagnóstico de velocidad](./speed.md) | `--speed` | Medir la presión y el trabajo de arranque; las correcciones opcionales preguntan aparte |
| Comentarios | `--feedback` | Instrucciones para informes de error, borrador mailto opcional |
| Paquete de depuración | `--debug-bundle` | Empaquetar el último registro e informe en un tar.gz |
| Instalar alias | `--install-alias` | Añadir un alias de shell `cleanup` |
| Instalar cron | `--install-cron` | `--all-safe -y` semanal, los domingos a las 03:00 |
| Desinstalar alias / cron | `--uninstall-alias` `--uninstall-cron` | Quitar cualquiera de los dos |

## Elegir un modo {#choosing-a-mode}

| Objetivo | Modo |
|---|---|
| Primera vez con la herramienta | `--self-test`, `--scan`, `--all-safe --dry-run` |
| Liberar espacio ya, con control | _(recorrido guiado predeterminado)_ |
| Liberar espacio ya, sin preguntas | `--all-safe -y` |
| Una categoría concreta | `--menu` / `--tui` |
| Mantenimiento semanal desatendido | `--all-safe -y` + `--install-cron` |
| Recuperar el máximo antes de reinstalar | `--all-safe -y --purge-all` |
| Averiguar qué se está comiendo el disco | `--audit`, `--scan` |
| Proyectos personales antiguos acumulándose | `--node-modules` |
| `command not found` después de instalar | `--doctor` |

## Opciones que se combinan con los modos {#options-that-combine-with-modes}

| Opción | Predeterminado | Efecto |
|---|---|---|
| `-d N` `--days N` | 100 | Umbral de inactividad. Cuanto menor, más agresivo |
| `--purge-all` | no | Desactiva el filtro de inactividad: vaciado total |
| `-y` `--yes` | no | Confirma automáticamente las cachés regenerables. Solo con `--all-safe` |
| `--no-report` | no | Omite el informe JSON. Los registros se siguen escribiendo |
| `--cleanup-logs` | no | Elimina el registro de esta ejecución al terminar. Los informes se conservan siempre |
| `--no-color` | no | Desactiva el color ANSI. También se respeta `NO_COLOR` |
| `-n` `--dry-run` | no | Recorre la limpieza elegida sin eliminar; aún puede escribir un registro local y el estado de la comprobación de actualizaciones |
| `--json-events` | no | NDJSON para `--scan` o `--all-safe --yes` no interactivo |

Detalle completo: [Opciones de la CLI](../reference/cli-flags.md) y la [matriz de modos](../reference/modes-matrix.md).
