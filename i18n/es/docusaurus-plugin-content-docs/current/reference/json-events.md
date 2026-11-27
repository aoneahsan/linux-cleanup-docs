---
title: Eventos legibles por máquina
description: Eventos NDJSON de la versión 1 para análisis locales y ejecuciones totalmente seguras no interactivas.
sidebar_position: 8
---

# Eventos legibles por máquina

`--json-events` escribe JSON delimitado por saltos de línea en stdout. El texto para personas y las preguntas van a stderr, con una copia local en el registro de la sesión. El flujo se queda en este equipo; puede contener rutas locales completas. Quien lo consuma no debería subir esas rutas como parte de datos de cuenta o de analítica.

La opción admite `--scan` y `--all-safe --yes`. Una ejecución totalmente segura necesita `--yes` para que un cliente automático no se quede parado en una pregunta. Añada `--dry-run` para previsualizar la acción totalmente segura sin eliminar archivos. Puede seguir escribiéndose un registro local y el estado de la comprobación de actualizaciones. Los demás modos devuelven el código de salida 2.

```bash
linux-cleanup --scan --json-events > scan.ndjson
linux-cleanup --all-safe --yes --dry-run --json-events > preview.ndjson
```

Todo evento completo tiene `v: 1`, un `type` y `ts` (milisegundos Unix). Quien lo consuma debería rechazar un `v` mayor e ignorar los campos desconocidos en la versión 1. El ID del modo es una cadena: `scan` o `allsafe`.

| Evento | Campos | Significado |
|---|---|---|
| `plan` | `version`, `dry_run`, `profile`, `sections[]` | Primer evento; una sección para el modo elegido. Una sección tiene `id`, `title`, `stamp`, `sudo`, `deep`. |
| `disk` | `phase`, `total_kb`, `free_kb`, `purgeable_kb`, `snapshots`, `snapshot_note` | Muestra del disco antes y después del modo. Las estimaciones no admitidas son `null`. |
| `section_start` | `id`, `title`, `stamp` | Empezó el modo elegido. |
| `item` | `id`, `path`, `kb`, `action`, `unique`, `age_days`, `reason` | Un resultado del análisis de solo lectura o una ruta seleccionada por un ayudante de limpieza. `report` solo lee, `delete` es una acción propuesta en una simulación y una acción completada del ayudante en una ejecución real, `skip` es un rechazo. `kb` se trunca a KiB enteros. |
| `progress` | `id`, `done`, `total` | El único modo elegido está en 0/1 o 1/1. Es un límite del modo, no un porcentaje por archivo. |
| `error` | `id`, `message` | Un fallo o un rechazo informado por la CLI. |
| `section_result` | `id`, `status`, `freed_kb`, `items`, `reason` | El estado es `completed` o `failed`. Los totales de bytes y de elementos quedan en `null` hasta que la CLI pueda distinguir sus propias escrituras de otra actividad del disco. |
| `summary` | `attempted`, `completed`, `skipped`, `failed`, `freed_kb`, `disk_free_before_kb`, `disk_free_after_kb`, `elapsed_s`, `reports`, `log`, `dry_run` | Último evento tras un modo completado. Las dos muestras de espacio libre son observaciones, no una afirmación de los bytes recuperados por este proceso. |

En una ejecución completa, el flujo empieza con `plan` y termina con `summary`. Un proceso interrumpido o un requisito de actualización no cumplido pueden no dejar `summary`; trátelo como una ejecución incompleta y use el código de salida y stderr. Un argumento rechazado puede emitir un evento `error` y salir con 2 antes del plan. Sin la opción, la salida de texto y los códigos de salida no cambian.

El flujo de eventos complementa el informe JSON local de la sesión. Una simulación no escribe informe de sesión. Quien lo consuma puede usar `item.path` para explicar una decisión local y luego descartarla en lugar de sincronizarla con un servidor. Cuando `--cleanup-logs` elimina el registro de la sesión, `summary.log` es `null`.
