---
title: Recorrido guiado (predeterminado)
description: "El modo predeterminado de linux-cleanup: diez pasos guiados por todas las categorías de limpieza, con pregunta antes de cada uno, total acumulado e informe JSON de la sesión."
tags: [walkthrough, default, interactive, guided, modes]
sidebar_position: 2
---

# Recorrido guiado (predeterminado)

**Ejecutar `linux-cleanup` sin opciones inicia el recorrido guiado: diez pasos por todas las categorías de limpieza, y cada uno pregunta antes de hacer nada.** Es la forma recomendada de usar la herramienta de manera interactiva.

```bash
linux-cleanup          # o: linux-cleanup -w / --walkthrough
```

## Los diez pasos {#the-ten-steps}

| # | Paso | Elimina | Notas |
|---|---|---|---|
| 1 | Cachés de gestores de paquetes | Regenerable | yarn, npm, npx, pnpm, pip, composer, bun, deno |
| 2 | Cachés de aplicaciones | Regenerable | Navegadores, Gradle, Cypress, Playwright, Zoom, VSIX de editores |
| 3 | Datos de herramientas de desarrollo | Solo lo que no se usa | AVD de Android, pub-cache, análisis de Dart, flatpak |
| 4 | Extensiones antiguas de editores | Sin uso + sustituido | VS Code / Cursor |
| 5 | `node_modules` abandonados | **Interactivo** | Proyectos sin uso más allá del umbral |
| 6 | Descargas incompletas o huérfanas | **Interactivo** | `.crdownload`, `.part`, `.fdmdownload` |
| 7 | Archivos personales sin uso | **Interactivo** | Archivos grandes sin uso en `~/Downloads` y sus raíces personales configuradas |
| 8 | Limpieza del sistema (sudo) | Sistema | apt, registro del sistema, snap, `/tmp`, caché de páginas |
| 9 | Revisión final de tamaño | Nada | Resumen de solo lectura |
| 10 | Generar un informe legible | Nada | Exportación a Markdown / HTML; requiere `jq` |

Los pasos 5, 6 y 7 son los [solo interactivos](../safety/guards.md#guard-3--personal-data-is-interactive-only). No se pueden confirmar automáticamente, y el paso 7 es el único de toda la herramienta que puede eliminar algo realmente irreemplazable.

## Cómo funcionan las preguntas {#how-the-prompts-work}

Hay dos niveles de confirmación.

**Por paso**, usted elige qué hacer con toda la categoría:

| Tecla | Efecto |
|---|---|
| `a` | Ejecutar este paso. Es la opción predeterminada: Intro la elige |
| `s` | Saltar este paso por completo |
| `q` | Salir del recorrido ahora, conservando el progreso |

**Por objetivo**, dentro de un paso que eligió ejecutar, cada elemento tiene su propia confirmación `[Y/n]` o `[y/N]`. La letra mayúscula es la opción predeterminada.

Así que pulsar `a` en un paso no le compromete a eliminar todo lo que contiene: sigue viendo y respondiendo cada objetivo.

## Totales acumulados {#running-totals}

Después de cada paso que se ejecutó, la herramienta imprime el cambio medido y el total de la sesión hasta ese momento.

El resumen final indica el espacio libre en disco antes y después. Esa cifra se mide con `df`, así que refleja todo lo que ocurre en el equipo: si se ejecutó una compilación durante su sesión, la recuperación indicada puede ser menor que la suma de los pasos, o incluso negativa. No es un error; vea [Solución de problemas](../troubleshooting.md#disk-usage-grew-during-the-session).

## Salir antes de tiempo {#quitting-early}

`q` en cualquier pregunta de paso, o `Ctrl-C` en cualquier momento, termina la sesión limpiamente:

- Las eliminaciones anteriores siguen siendo permanentes; revise el registro para ver qué pasos se intentaron antes de la interrupción
- `Ctrl-C` sale con el código `130`, que la [trampa de fallos ignora a propósito](../reference/exit-codes.md#how-the-crash-trap-decides), así que no se escribe ningún paquete de fallo
- Los pasos a los que no se llegó constan como omitidos en el informe

## El informe de la sesión {#the-session-report}

El recorrido escribe un informe JSON en `~/.linux-cleanup/reports/report-<timestamp>.json`, salvo que se indique `--no-report` o `--dry-run`. Contiene el estado y los bytes liberados de cada paso, el disco y la memoria antes y después, y los totales de la sesión. Lista completa de campos: [Esquema del informe](../reference/report-schema.md).

El paso 10 lo convierte opcionalmente a Markdown y HTML. Ese paso necesita `jq`; sin él consta como `skipped (jq missing)` y el JSON se escribe igualmente.

```bash
linux-cleanup --no-report    # omite el JSON; los registros se siguen escribiendo
```

## Opciones que vale la pena combinar {#options-worth-combining}

```bash
linux-cleanup -d 30          # umbral de inactividad de 30 días en vez de 100
linux-cleanup --purge-all    # desactiva por completo el filtro de inactividad
linux-cleanup --no-color     # salida sin formato
linux-cleanup --cleanup-logs # elimina el registro de esta ejecución al terminar
```

:::danger `--purge-all` cambia lo que eliminan los pasos 1 a 4
Con el [filtro de inactividad](../safety/guards.md#guard-2--the-staleness-gate) desactivado, los pasos de caché vacían sus objetivos por completo en lugar de podar los archivos sin uso. Eso incluye distribuciones del wrapper de Gradle, navegadores de Playwright y binarios de Cypress que quizá todavía quiera. El aviso previo a la ejecución indica qué estrategia está activa.
:::

## Cuándo usar otra cosa {#when-to-use-something-else}

| Situación | Mejor modo |
|---|---|
| Solo quiere una categoría | [Menú](./menu.md) o [TUI](./tui.md) |
| Desatendido o con cron | [Totalmente seguro](./all-safe.md) con `-y` |
| Quiere mirar, no eliminar | [Análisis](./scan.md) |
| Quiere la versión visual de esto | [TUI](./tui.md) |

## Siguiente {#next}

- [Análisis](./scan.md): ejecútelo primero
- [Totalmente seguro](./all-safe.md): el equivalente desatendido
- [Informes](./reports.md): cómo leer la salida
