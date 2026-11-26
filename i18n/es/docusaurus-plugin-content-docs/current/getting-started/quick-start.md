---
title: Inicio rápido
description: "Ejecute su primera sesión de linux-cleanup en unos diez minutos: compruebe las protecciones, revise en modo de solo lectura, ejecute el recorrido guiado y lea el informe."
tags: [quick-start, tutorial, walkthrough, first-run, scan]
sidebar_position: 3
---

# Inicio rápido

**Compruebe las protecciones, revise el análisis y previsualice el modo elegido antes de eliminar.** El espacio que recupere depende de las rutas y los archivos de este equipo.

:::caution No se salte los pasos 1 y 2
Llevan dos minutos y marcan la diferencia entre una limpieza que usted controló y una que descubrió después. Esta herramienta [elimina de forma permanente](../safety/irreversibility.md).
:::

## Paso 1: compruebe la instalación {#step-1--verify-the-install}

```bash
npx linux-cleanup --version
npx linux-cleanup --self-test
```

`--version` confirma qué compilación tiene. `--self-test` comprueba las dependencias y la sintaxis de la shell, y verifica que las protecciones se activan de verdad. Una ejecución correcta termina con un mensaje de éxito; cualquier verificación fallida termina con un código distinto de cero, y en ese caso debe detenerse.

## Paso 2: revise sin eliminar nada {#step-2--audit-deleting-nothing}

```bash
npx linux-cleanup --scan
```

`--scan` es de solo lectura. Lista las raíces de caché y su tamaño actual, junto con otros candidatos y observaciones del sistema. No elimina nada ni escribe un informe JSON de la sesión.

Lea las rutas antes de continuar. El tamaño de una raíz de caché no significa que todo el directorio pueda eliminarse. Revise por separado cualquier ruta inesperada y cada archivo personal candidato.

## Paso 3: previsualice la limpieza {#step-3--preview-the-cleanup}

```bash
npx linux-cleanup --all-safe --dry-run
```

Recorre el modo de caché totalmente seguro sin eliminar archivos ni cambiar la configuración. Lea las acciones propuestas y decida si lo ejecuta. Una eliminación real no se puede deshacer.

## Paso 4: ejecute el recorrido guiado {#step-4--run-the-guided-walkthrough}

```bash
npx linux-cleanup
```

Sin opciones se inicia el [recorrido guiado](../modes/walkthrough.md): diez pasos, cada uno pregunta antes de hacer nada, con un total acumulado de bytes recuperados.

En cada paso tiene tres opciones:

| Tecla | Efecto |
|---|---|
| `a` | Ejecutar este paso (la opción predeterminada; pulsar Intro la elige) |
| `s` | Saltar este paso |
| `q` | Salir del recorrido ahora |

Dentro de un paso, cada objetivo tiene su propia confirmación `[Y/n]`. Así que hay dos niveles: saltar toda una categoría, o aceptarla y rechazar elementos concretos.

Los diez pasos, en orden:

1. Cachés de gestores de paquetes
2. Cachés de aplicaciones
3. Datos de herramientas de desarrollo
4. Extensiones antiguas de editores
5. `node_modules` abandonados
6. Descargas incompletas o huérfanas
7. Archivos personales sin uso
8. Limpieza del sistema (sudo)
9. Revisión final de tamaño
10. Generar un informe legible

:::tip En los pasos 6 y 7 conviene ir despacio
Todo lo anterior es regenerable. Las descargas incompletas y los archivos personales sin uso no lo son: lea cada candidato en lugar de aceptar el lote. En una primera ejecución puede saltar ambos con `s` si prefiere revisarlos aparte más tarde.
:::

`Ctrl-C` detiene el recorrido con el código `130`. Las eliminaciones anteriores siguen siendo permanentes. Lea el registro para ver qué pasos se ejecutaron antes de la interrupción.

## Paso 5: lea el informe {#step-5--read-the-report}

La sesión termina con un resumen que indica su registro y, cuando se genera, su informe. Lea las rutas que muestra su propia ejecución en lugar de suponer una ubicación fija para cada forma de instalación.

El recorrido guiado escribe un informe JSON salvo que use `--no-report` o `--dry-run`. Para convertir un informe existente para leerlo o archivarlo, instale `jq` y ejecute:

```bash
linux-cleanup --export both latest   # Markdown + HTML junto al JSON
linux-cleanup --reports              # gestor interactivo de informes
```

Vea [Informes](../modes/reports.md).

## Paso 6: automatícelo cuando confíe en él {#step-6--automate-it-once-you-trust-it}

Solo después de una ejecución manual que le haya dejado satisfecho:

```bash
linux-cleanup --install-alias   # escriba `cleanup` desde cualquier lugar
linux-cleanup --install-cron    # --all-safe -y semanal, los domingos a las 03:00
```

La tarea de cron ejecuta `--all-safe -y`, que confirma automáticamente **solo cachés regenerables**. No puede tocar archivos personales: [esos modos ignoran `--yes`](../safety/guards.md#guard-3--personal-data-is-interactive-only).

Vea [Alias y cron](../guides/alias-and-cron.md) para saber exactamente qué escribe cada uno y cómo quitarlo.

## Lo que ya sabe {#what-you-now-know}

| Concepto | Más información |
|---|---|
| Los modos de solo lectura nunca eliminan | [Revisar antes de eliminar](../safety/preview-first.md) |
| El recorrido pregunta antes de cada paso | [Recorrido guiado](../modes/walkthrough.md) |
| La lista de rutas permitidas rechaza Documents, `.ssh`, `.config` | [Protecciones](../safety/guards.md) |
| De forma predeterminada solo se podan archivos sin uso desde hace 100+ días | [El filtro de inactividad](../safety/guards.md#guard-2--the-staleness-gate) |
| Los modos de datos personales son solo interactivos | [Archivos personales sin uso](../modes/personal-stale-files.md) |
| Nada se puede recuperar desde la herramienta | [La eliminación es permanente](../safety/irreversibility.md) |

## Preguntas habituales después {#common-follow-ups}

- **«Quiero más espacio».** → [Recuperar el máximo de espacio](../guides/reclaim-the-most-space.md)
- **«Algo se rompió».** → [Solución de problemas](../troubleshooting.md)
- **«Eliminó algo que quería».** → [Recuperación](../recovery.md)
- **«¿Cuáles son todas las opciones?»** → [Opciones de la CLI](../reference/cli-flags.md)
