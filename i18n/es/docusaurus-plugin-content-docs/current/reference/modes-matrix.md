---
title: Tabla de modos
description: "Todos los modos de linux-cleanup lado a lado: si eliminan, si son interactivos, si usan sudo y si escriben un registro de sesión."
tags: [modes, matrix, reference, comparison]
sidebar_position: 2
---

# Tabla de modos

Todos los modos de un vistazo. Úsela para responder «¿esto eliminará algo?» sin leer una página entera.

## La tabla {#the-matrix}

| Modo | Opción | Elimina | Interactivo | sudo | Escribe registro |
|---|---|---|---|---|---|
| [Recorrido guiado](../modes/walkthrough.md) | _(ninguna)_ `-w` | Sí | Sí | Solo el paso 8 | Sí |
| [Menú](../modes/menu.md) | `-m` | Sí | Sí | Si se elige | No |
| [TUI](../modes/tui.md) | `-t` | Sí | Sí | Si se elige | No |
| [Totalmente seguro](../modes/all-safe.md) | `-a` | Sí | Salvo con `-y` | No | No |
| [Análisis](../modes/scan.md) | `-s` | **No** | No | No | No |
| [Archivos personales sin uso](../modes/personal-stale-files.md) | `-p` | Sí | **Siempre** | No | No |
| [Sistema](../modes/system-cleanup.md) | `--system` | Sí | Sí | **Sí** | No |
| [Descargas incompletas](../modes/partial-downloads.md) | `--partials` | Sí | **Siempre** | No | No |
| [Revisión del directorio personal](../modes/home-audit.md) | `--audit` | **No** | No | No | No |
| [node_modules](../modes/node-modules-finder.md) | `--node-modules` | Sí | **Siempre** | No | No |
| [Revisión de paquetes globales](../modes/globals-audit.md) | `--globals` | **No** | No | No | No |
| [Doctor](../modes/doctor.md) | `--doctor` | **No**: solo añade | Sí | No | No |
| [Extensiones de editores](../modes/editor-extensions.md) | `--editor-ext` | Sí | Sí | No | No |
| [Velocidad](../modes/speed.md) | `--speed` | No elimina archivos; ajustes opcionales | Sí | No | No |
| [Informes](../modes/reports.md) | `--reports` | Solo registros | Sí | No | No |
| Exportar | `--export` | **No** | No | No | No |
| Comentarios | `--feedback` | **No** | Sí | No | No |
| Paquete de depuración | `--debug-bundle` | **No** | No | No | No |
| Listar destinos | `--list-targets` | **No** | No | No | No |
| Autocomprobación | `--self-test` | **No** | No | No | No |
| Versión | `-V` | **No** | No | No | No |
| Instalar alias | `--install-alias` | **No** | Sí | No | No |
| Instalar cron | `--install-cron` | **No** | Sí | No | No |
| Actualizar la aplicación de escritorio | `--refresh-app` | Actualiza la aplicación desde una versión | Sí | No | No |
| Desinstalar alias | `--uninstall-alias` | La línea del alias | Sí | No | No |
| Desinstalar cron | `--uninstall-cron` | La línea de cron | Sí | No | No |

## Modos que nunca eliminan nada {#modes-that-never-delete-anything}

Estos comandos no eliminan destinos de limpieza. Algunos escriben registros locales, informes, exportaciones o paquetes de diagnóstico:

`--scan` · `--audit` · `--globals` · `--list-targets` · `--self-test` · `--version` · `--export` ·
`--feedback` · `--debug-bundle`

`--doctor` también va aquí, con una salvedad: modifica la configuración de su shell, pero solo **añadiendo** líneas tras su confirmación. Nunca elimina ni reescribe una línea existente.

## Modos a los que afecta `--yes` {#modes---yes-affects}

Exactamente uno: [`--all-safe`](../modes/all-safe.md).

Los modos interactivos de datos personales —`--stale`, `--partials`, `--node-modules`— piden sus propias confirmaciones. Vea [la barrera 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

## Modos a los que se aplica la barrera de inactividad {#modes-the-staleness-gate-applies-to}

| Se aplica | No se aplica |
|---|---|
| Poda de cachés en el recorrido guiado, el menú, la TUI y el modo totalmente seguro | `--system` (usa su propia regla fija de 7 días para `/tmp`) |
| Sustitución de versiones en `--editor-ext` | `--partials` (la antigüedad no es el criterio) |
| `--node-modules` | Modos de solo lectura (no se elimina nada) |
| `--stale` |  |
| Datos de herramientas de desarrollo (AVD, flatpak, pub-cache) |  |

`--purge-all` desactiva la barrera allí donde se aplicaría.

## Qué modos necesitan dependencias opcionales {#which-modes-need-optional-dependencies}

| Modo | Necesita | Sin ella |
|---|---|---|
| `--tui` | `whiptail` o `dialog` | Recurre a `--menu` con una sugerencia de instalación |
| Conversión de `--export`, `--reports` | `jq` | El JSON se escribe igual; la conversión no está disponible |
| `--install-cron` | `crontab` | No puede ejecutarse |
| Paso de snap de `--system` | `snap` | El paso se omite sin problemas |
| Pasos de apt de `--system` | `apt`, `dpkg` | **Falla**: [solo Debian/Ubuntu](../distro-support.md) |

## Siguiente {#next}

- [Opciones de la CLI](./cli-flags.md) — cada opción en detalle
- [Resumen de los modos](../modes/overview.md) — agrupados por propósito
