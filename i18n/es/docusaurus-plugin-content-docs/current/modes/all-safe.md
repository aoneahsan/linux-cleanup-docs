---
title: Totalmente seguro (por lotes)
description: Limpie todas las cachés regenerables de una sola pasada. El modo pensado para cron y el mantenimiento desatendido, y el único al que se aplica --yes.
tags: [all-safe, batch, cron, unattended, yes, modes]
sidebar_position: 6
---

# Totalmente seguro (por lotes)

**`--all-safe` limpia todas las cachés regenerables de una sola pasada.** Es el modo para el mantenimiento desatendido y el único al que se aplica `--yes`.

```bash
linux-cleanup --all-safe        # una confirmación para todo el lote
linux-cleanup --all-safe -y     # sin preguntas: la forma para cron
```

## Qué significa aquí «seguro» {#what-safe-means-here}

Seguro significa **regenerable**: cachés de gestores de paquetes, cachés de navegadores y aplicaciones, y datos de herramientas de desarrollo sin uso. **No** significa sin riesgo, ni reversible: las eliminaciones siguen siendo [permanentes](../safety/irreversibility.md).

Lo que `--all-safe` nunca tocará, con o sin `--yes`:

- Archivos personales en `~/Downloads`, `~/Desktop` o cualquier otro lugar
- Descargas incompletas
- Directorios `node_modules`
- Nada de la [lista de rutas protegidas](../reference/protected-paths.md)
- Paquetes instalados globalmente ni archivos de inicio de la shell

Esas categorías son [solo interactivas por diseño](../safety/guards.md#guard-3--personal-data-is-interactive-only) y simplemente no forman parte de este modo. Por eso es aceptable `--all-safe -y` en una tarea de cron.

Desde la 1.1.0, el modo también ejecuta una **verificación al arrancar** que se detiene con un mensaje `BUG:` si algún directorio de runtime protegido llega a colarse en su lista de destinos, para que una regresión futura falle de forma visible en lugar de eliminar algo que no debe.

## `--yes` y sus límites {#--yes-and-its-limits}

`-y` / `--yes` confirma automáticamente las eliminaciones de cachés. Solo es válido con `--all-safe`; los modos interactivos lo ignoran por norma.

```bash
linux-cleanup --all-safe -y
```

:::caution Con `-y` no verá las decisiones hasta después
La lista de rutas permitidas y el filtro de inactividad siguen aplicándose, pero usted revisa el registro tras la ejecución. Una ejecución totalmente segura por sí sola no escribe el informe JSON de la sesión del recorrido guiado. En una primera ejecución, revise antes un [`--scan`](./scan.md) y un `--all-safe --dry-run`.
:::

## La poda y lo que se conserva {#pruning-and-what-survives}

De forma predeterminada, `--all-safe` poda los archivos de caché que cumplen los requisitos y cuyo `atime` y `mtime` son anteriores a `--days` (100 por defecto). Los paquetes extraídos y las herramientas con versiones se tratan como unidades completas según sus propias reglas de inactividad. La salida legible informa de algunos resultados; use la simulación para revisar las rutas propuestas antes de eliminar.

```bash
linux-cleanup --all-safe -y            # umbral de 100 días
linux-cleanup --all-safe -y -d 30      # más agresivo
linux-cleanup --all-safe -y --purge-all # filtro desactivado: vaciado total
```

:::danger `--purge-all` en una tarea de cron es una mala combinación
Desatendido y sin filtro de inactividad significa que una distribución del wrapper de Gradle o un paquete de navegadores de Playwright puede desaparecer la semana antes de que lo necesite, sin que nadie lo vea. Reserve `--purge-all` para ejecuciones deliberadas antes de reinstalar el sistema.
:::

## Ejecutarlo cada semana {#running-it-weekly}

```bash
linux-cleanup --install-cron
```

Esto programa `--all-safe -y` para los domingos a las 03:00 y añade la salida a `~/.linux-cleanup/logs/cron.log`. Vea [Alias y cron](../guides/alias-and-cron.md) para la entrada exacta y cómo quitarla.

Si escribe usted la entrada del crontab, use una **ruta absoluta**: el `PATH` mínimo de cron no encontrará una instalación en `~/.local/bin`:

```bash
0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1
```

`--cleanup-logs` elimina el registro de esa ejecución. Las ejecuciones totalmente seguras por sí solas no escriben el registro JSON de la sesión del recorrido guiado, así que `--no-report` no tiene más efecto aquí.

## Ver qué hizo una ejecución de cron {#checking-what-a-cron-run-did}

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
```

Si el registro de cron muestra `command not found`, el crontab usa el nombre del comando sin ruta; vea [Solución de problemas](../troubleshooting.md#cron-entry-runs-but-does-nothing).

## Cuándo usar otra cosa {#when-to-use-something-else}

| Situación | Mejor modo |
|---|---|
| Primera vez en este equipo | [`--scan`](./scan.md) y luego `--all-safe --dry-run` |
| Quiere ver cada decisión | [Recorrido guiado](./walkthrough.md) |
| Solo hay que limpiar una categoría | [Menú](./menu.md) o [TUI](./tui.md) |
| También quiere recuperar archivos personales | [Archivos personales sin uso](./personal-stale-files.md), de forma interactiva |

## Siguiente {#next}

- [Alias y cron](../guides/alias-and-cron.md): programarlo
- [Recuperar el máximo de espacio](../guides/reclaim-the-most-space.md): el camino agresivo
- [Protecciones](../safety/guards.md): lo que se sigue aplicando con `-y`
