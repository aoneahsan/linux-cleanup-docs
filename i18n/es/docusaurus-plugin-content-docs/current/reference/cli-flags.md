---
title: Opciones de la CLI
description: Todas las opciones de línea de comandos de linux-cleanup (modos, opciones, alias y valores por defecto), con lo que hace cada una y dónde está documentada a fondo.
sidebar_position: 1
---

# Opciones de la CLI

**Todas las opciones que acepta linux-cleanup.** Los modos son excluyentes: pase uno. Las opciones se combinan con cualquier modo.

```bash
linux-cleanup --help    # la misma lista, con las rutas reales de su equipo
```

Una opción no reconocida imprime la ayuda y sale con el código `2`.

## Modos {#modes}

Pase como mucho uno. Sin ninguno, obtiene el [recorrido guiado](../modes/walkthrough.md).

| Opción | Alias | Qué hace | Página completa |
|---|---|---|---|
| _(ninguna)_ | `-w` `--walkthrough` | Diez pasos guiados, con una pregunta antes de cada uno | [Recorrido guiado](../modes/walkthrough.md) |
| `-m` | `--menu` `-i` `--interactive` | Menú numerado para saltar a un paso | [Menú](../modes/menu.md) |
| `-t` | `--tui` `-g` `--gui` | Menú visual con whiptail / dialog | [TUI](../modes/tui.md) |
| `-a` | `--all-safe` | Limpia de una vez todas las cachés regenerables | [Totalmente seguro](../modes/all-safe.md) |
| `-s` | `--scan` | Revisión de solo lectura de todas las categorías | [Análisis](../modes/scan.md) |
| `-p` | `--stale` | Archivos personales grandes sin uso (interactivo) | [Archivos personales sin uso](../modes/personal-stale-files.md) |
| | `--system` | apt, diario, snap, `/tmp`, caché de páginas (sudo) | [Limpieza del sistema](../modes/system-cleanup.md) |
| | `--partials` | Descargas incompletas huérfanas (interactivo) | [Descargas incompletas o huérfanas](../modes/partial-downloads.md) |
| | `--audit` | Las 20 entradas más grandes de `$HOME` | [Revisión del directorio personal](../modes/home-audit.md) |
| | `--node-modules` | `node_modules` sin uso (interactivo) | [Buscador de node_modules abandonados](../modes/node-modules-finder.md) |
| | `--globals` | Revisión de solo lectura de los paquetes globales | [Revisión de paquetes globales](../modes/globals-audit.md) |
| | `--doctor` | Repara la inicialización del shell que falta para entornos de ejecución | [Doctor](../modes/doctor.md) |
| | `--speed` | Revisa la presión del sistema y el arranque; pregunta antes de cambiar nada | [Diagnóstico de velocidad](../modes/speed.md) |
| | `--editor-ext` | Versiones sustituidas de VS Code / Cursor | [Extensiones de editores](../modes/editor-extensions.md) |
| | `--reports` | Gestor interactivo de registros de sesión | [Informes](../modes/reports.md) |
| | `--export FMT ID` | Conversión no interactiva de registros | [Informes](../modes/reports.md#exporting) |
| | `--feedback` | Instrucciones para informar de errores, borrador mailto opcional | [Enviar un informe de error](../guides/send-a-bug-report.md) |
| | `--debug-bundle` | Empaqueta el último registro de sesión y su informe en un tar.gz | [Enviar un informe de error](../guides/send-a-bug-report.md) |
| | `--list-targets` | Imprime todas las rutas que puede limpiar y las protegidas | [Revisar antes de eliminar](../safety/preview-first.md) |
| | `--self-test` | Comprobación de dependencias, sintaxis y barreras de seguridad | [Revisar antes de eliminar](../safety/preview-first.md) |
| `-V` | `--version` | Versión y autor | — |
| | `--install-alias` | Añade el alias de shell `cleanup` | [Alias de shell y cron semanal](../guides/alias-and-cron.md) |
| | `--install-cron` | `--all-safe -y` semanal, los domingos a las 03:00 | [Alias de shell y cron semanal](../guides/alias-and-cron.md) |
| | `--uninstall-alias` | Quita el alias | [Desinstalar](../guides/uninstall.md) |
| | `--uninstall-cron` | Quita la entrada de cron | [Desinstalar](../guides/uninstall.md) |
| | `--refresh-app` | Actualiza la copia persistente que usan el alias y cron | [Instalación](../getting-started/installation.md) |

## Opciones {#options}

| Opción | Por defecto | Efecto |
|---|---|---|
| `-d N` `--days N` | `100` | Umbral de inactividad. Un archivo solo es candidato cuando **tanto** `atime` como `mtime` lo superan. Cuanto más bajo, más agresivo |
| `--purge-all` | desactivada | **Desactiva la barrera de inactividad.** Las cachés se vacían por completo, como antes de la 1.2.0 |
| `-y` `--yes` | desactivada | Confirma automáticamente las cachés regenerables. Solo vale con `--all-safe`. **Los modos personales la ignoran** |
| `--no-report` | desactivada | No genera el JSON. El registro de sesión se sigue escribiendo |
| `--cleanup-logs` | desactivada | Elimina al terminar el registro de esta ejecución. **Los informes siempre se conservan** |
| `-n` `--dry-run` | desactivada | Recorre el modo elegido sin eliminar archivos ni cambiar ajustes. Queda un registro local; no se escribe informe JSON de sesión |
| `--json-events` | desactivada | [Eventos legibles por máquina](./json-events.md) en stdout para `--scan` o `--all-safe --yes`; el texto para personas va a stderr |
| `--no-color` | desactivada | Desactiva el color ANSI. También se respeta `NO_COLOR` |
| `-h` `--help` | — | Imprime la ayuda y sale |

:::danger `--purge-all` quita una barrera de seguridad
Desactiva la [barrera de inactividad](../safety/guards.md#guard-2--the-staleness-gate), así que las cachés se vacían enteras sin importar cuándo se usaron por última vez. Los recursos caros (distribuciones del Gradle wrapper, navegadores de Playwright, binarios de Cypress) se van con ellas. El aviso previo a la ejecución indica qué estrategia está activa.
:::

:::note El análisis y la simulación responden preguntas distintas
[`--scan`](../modes/scan.md) lee las rutas y los tamaños actuales. `--dry-run` recorre la limpieza elegida y muestra las acciones propuestas sin eliminar nada. Vea [Revisar antes de eliminar](../safety/preview-first.md).
:::

## Recetas {#recipes}

| Objetivo | Comando |
|---|---|
| Comprobar la instalación | `linux-cleanup --self-test` |
| Ver cuánto se puede recuperar | `linux-cleanup --scan` |
| Previsualizar una limpieza de cachés | `linux-cleanup --all-safe --dry-run` |
| Emitir un análisis de solo lectura como eventos JSON | `linux-cleanup --scan --json-events` |
| Ver todas las rutas que puede tocar | `linux-cleanup --list-targets` |
| Limpieza guiada | `linux-cleanup` |
| Una pasada por lotes, sin preguntas | `linux-cleanup --all-safe -y` |
| Barrido agresivo | `linux-cleanup --all-safe -y -d 30` |
| Recuperar al máximo antes de reinstalar | `linux-cleanup --all-safe -y --purge-all` |
| Menú visual | `linux-cleanup --tui` |
| Directorios de dependencias de proyectos viejos | `linux-cleanup --node-modules -d 90` |
| Mantenimiento del sistema | `linux-cleanup --system` |
| Automatización semanal | `linux-cleanup --install-cron` |
| Convertir el informe más reciente a HTML | `linux-cleanup --export html latest` |
| Informar de un error | `linux-cleanup --debug-bundle && linux-cleanup --feedback` |

## Variables de entorno {#environment-variables}

Las más usadas; la [lista completa](./environment-variables.md) está aparte:

| Variable | Efecto |
|---|---|
| `NO_COLOR` | Cualquier valor no vacío desactiva el color |
| `LINUX_CLEANUP_LOG_DIR` | Cambia el directorio de registros |
| `LINUX_CLEANUP_REPORTS_DIR` | Cambia el directorio de informes de sesión |
| `LINUX_CLEANUP_DATA_HOME` | Directorio padre de registros, informes y paquetes de comentarios |

## Códigos de salida {#exit-codes}

| Código | Significado |
|---|---|
| `0` | Ejecución correcta |
| `2` | Error al analizar argumentos o modo no admitido por el flujo de eventos |
| `3` | Una versión antigua bloqueada por el registro de versiones |
| `130` | Interrumpido con `Ctrl-C` |
| `143` | Terminado por `SIGTERM` |
| otro | Inesperado: escribe un paquete de fallo |

La tabla completa y la lógica de la trampa de fallos: [Códigos de salida](./exit-codes.md).
