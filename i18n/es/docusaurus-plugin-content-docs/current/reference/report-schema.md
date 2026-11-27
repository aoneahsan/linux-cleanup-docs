---
title: Esquema del informe
description: La estructura JSON que escribe el recorrido guiado de linux-cleanup, con credits, meta, disk, memory, steps y totals.
sidebar_position: 7
---

# Esquema del informe

**El recorrido guiado escribe un registro JSON con `"schema_version": 1`**, salvo que se use `--no-report` o `--dry-run`. El `--scan` independiente no escribe este informe. Para un análisis legible por máquina, use `--scan --json-events`; ese flujo tiene otra estructura.

:::warning Documentación más antigua describe otra estructura
Algunos materiales —incluida una página de referencia dentro del repositorio del código— describen una forma construida en torno a `schema` (una cadena como `linux-cleanup/report/v1`) con los objetos `tool`, `session` y `categories`.

**La herramienta no emite eso.** Un analizador escrito para esa forma fallará con cada archivo real. La estructura de abajo es la que escribe `modules/walkthrough.sh`. Compruébelo en su equipo:

```bash
jq 'keys' "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```
:::

## Nivel superior {#top-level}

```json
{
  "schema_version": 1,
  "credits": { },
  "meta":    { },
  "disk":    { "before": {}, "after": {} },
  "memory":  { "before": {}, "after": {} },
  "steps":   [ ],
  "totals":  { }
}
```

| Clave | Tipo | Contiene |
|---|---|---|
| `schema_version` | número | Por ahora `1`. Rechace cualquier valor que no reconozca |
| `credits` | objeto | Identidad de la herramienta, licencia y autor |
| `meta` | objeto | Contexto de la sesión: cuándo, dónde, cómo y con qué ajustes |
| `disk` | objeto | Uso del sistema de archivos antes y después |
| `memory` | objeto | Uso de memoria antes y después |
| `steps` | lista | Una entrada por cada paso intentado |
| `totals` | objeto | Resumen de la sesión |

## `credits` {#credits}

```json
{
  "tool": "linux-cleanup",
  "tool_version": "2.1.1",
  "tool_homepage": "https://linux-cleanup.aoneahsan.com",
  "tool_license": "MIT",
  "author": {
    "name": "Ahsan Mahmood",
    "email": "aoneahsan@gmail.com",
    "website": "https://aoneahsan.com",
    "linkedin": "https://linkedin.com/in/aoneahsan"
  }
}
```

Está ahí para que el informe indique su origen allá donde termine. Nada de esto refleja su equipo.

## `meta` {#meta}

| Clave | Tipo | Contiene |
|---|---|---|
| `tool` | cadena | Siempre `linux-cleanup` |
| `tool_version` | cadena | La versión que escribió el informe. Base en ella la lógica de quien lo consuma |
| `started_at` | cadena | Marca de tiempo del inicio de la sesión |
| `finished_at` | cadena | Marca de tiempo del fin de la sesión |
| `duration_seconds` | número | Duración real |
| `host` | cadena | Salida de `hostname` |
| `user` | cadena | `$USER` |
| `mode` | cadena | El modo que se ejecutó: `walkthrough`, `scan`, `allsafe`, `system`, etc. |
| `stale_days` | número | El umbral `--days` vigente |
| `log_file` | cadena | Ruta absoluta al registro de esta sesión |
| `launcher` | cadena | Cómo se invocó: `bash` en una ejecución directa |
| `via_npx` | número | `1` si se ejecutó con el lanzador de npm, `0` en otro caso |

Merece la pena guardar `stale_days`: es la diferencia entre una ejecución que podó a 100 días y otra con `-d 30`, y explica por qué dos sesiones en el mismo equipo recuperaron cantidades distintas.

## `disk` y `memory` {#disk-and-memory}

Ambos contienen una instantánea `before` y otra `after`, tomadas al inicio y al final de la sesión.

`disk` lleva los campos del sistema de archivos (sistema de archivos, tamaño, usado, disponible y porcentaje de uso) obtenidos de `df`. `memory` lleva lo equivalente del informe de memoria del sistema.

:::note `after` menos `before` no es solo su limpieza
Son mediciones de todo el equipo. Una compilación, una actualización de paquetes o un navegador abierto durante la sesión también las mueven, por eso lo recuperado puede ser menor que la suma de los pasos, o negativo. Vea [Solución de problemas](../troubleshooting.md#disk-usage-grew-during-the-session).
:::

## `steps` {#steps}

Una lista, con una entrada por paso intentado, en orden:

```json
{ "n": 1, "title": "Package-manager caches", "status": "ran", "freed_bytes": 13315108864 }
```

| Clave | Tipo | Contiene |
|---|---|---|
| `n` | número | Número de paso, empezando en 1 |
| `title` | cadena | Nombre legible del paso |
| `status` | cadena | `ran`, `skipped`, `skipped (quit)` o `skipped (jq missing)` |
| `freed_bytes` | número | Bytes recuperados por este paso. `0` si se omitió |

`skipped (quit)` marca los pasos posteriores a pulsar `q`: sirve para distinguir una parada deliberada de un paso rechazado individualmente.

## `totals` {#totals}

| Clave | Tipo | Contiene |
|---|---|---|
| `total_reclaimed_bytes` | número | Suma de todos los pasos |
| `total_reclaimed_human` | cadena | Lo mismo, con formato |
| `steps_run` | número | Pasos con estado `ran` |
| `steps_skipped` | número | Pasos con un estado `skipped` |

## Análisis con jq {#parsing}

```bash
LATEST="$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

jq '.totals.total_reclaimed_human' "$LATEST"
jq '.meta | {mode, stale_days, duration_seconds}' "$LATEST"
jq '.steps[] | select(.status == "ran") | "\(.title): \(.freed_bytes)"' "$LATEST"

# Total recuperado en todas las sesiones registradas
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## Validación {#validating}

La herramienta no incluye ningún archivo JSON Schema. Una comprobación estructural:

```bash
jq -e 'has("schema_version") and .schema_version == 1
       and has("meta") and has("steps") and has("totals")' \
  ~/.linux-cleanup/reports/report-*.json
```

Imprime `true` por cada archivo válido.

## Recomendaciones de compatibilidad {#compatibility-guidance}

Al escribir un programa que lo consuma:

- **Decida según `schema_version`.** Trate un valor desconocido como imposible de analizar en lugar de adivinar
- **Trate las claves desconocidas como añadidos.** Ya se han añadido campos dentro de la versión 1 y puede volver a pasar
- **Use `meta.tool_version`** para el comportamiento que cambia entre versiones
- **No suponga que todos los modos rellenan todas las secciones.** Los modos de solo lectura producen menos pasos
- **Cuente con que `total_reclaimed_bytes` sea negativo de vez en cuando.** Es una diferencia de `df`, no una suma de eliminaciones

## Siguiente {#next}

- [Informes](../modes/reports.md) — verlos y exportarlos
- [Rutas de salida](./output-paths.md) — dónde están los archivos
