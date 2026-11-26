---
sidebar_position: 1
title: La aplicación de escritorio
description: Qué es la aplicación de escritorio de linux-cleanup, cómo ejecuta la CLI y qué envía fuera de su equipo.
---

# La aplicación de escritorio

La aplicación de escritorio es linux-cleanup en una ventana. Incluye la misma CLI que documenta este sitio y ejecuta un modo a través de ella: la [limpieza totalmente segura](../modes/all-safe.md), primero como simulación y luego como ejecución real cuando usted lo confirma. Cada regla sobre lo que se elimina y lo que se rechaza pertenece a la CLI; la aplicación muestra esas decisiones y nunca las modifica.

## Cómo ejecuta la CLI {#how-it-runs-the-cli}

La aplicación inicia el `cleanup.sh` incluido con una de exactamente dos listas de argumentos y lee su flujo [`--json-events`](../reference/json-events.md):

| Usted pulsa | La aplicación ejecuta |
|---|---|
| **Iniciar una simulación** | `--all-safe --yes --dry-run --json-events` |
| **Ejecutar la limpieza ahora** | `--all-safe --yes --json-events` |

Los informes y registros van a `~/.linux-cleanup/reports/` y `~/.linux-cleanup/logs/`, las mismas carpetas que usa una ejecución de `npx linux-cleanup`, así que la aplicación y la terminal comparten un único historial.

La copia incluida omite la comprobación de actualizaciones propia de la CLI (`LINUX_CLEANUP_LAUNCHER=desktop`). En su lugar, la aplicación busca sus propias actualizaciones; vea [Instalar y actualizar](./install.md).

## Qué sale de su equipo {#what-leaves-your-computer}

| Datos | ¿Salen del equipo? |
|---|---|
| Rutas de archivos y carpetas, nombres de archivo | Nunca |
| Resultados de los pasos, tamaños, espacio libre antes y después, nombre de la distribución | Solo si inicia sesión, como números |
| Qué pantallas se abren y qué acciones se ejecutan | Se cuentan con Amplitude, sin rutas, nombres ni su correo |

Iniciar sesión es opcional. Sin sesión, las simulaciones, las ejecuciones reales, los recibos y las programaciones funcionan en este equipo; la cuota mensual de ejecuciones reales se cuenta por equipo.

## La eliminación es permanente {#removal-is-permanent}

Una ejecución real elimina archivos igual que la CLI: de forma permanente, sin guardar copia. La aplicación exige una simulación reciente antes de una ejecución real, y la pantalla de confirmación lo dice con palabras claras antes de que se ejecute nada.
