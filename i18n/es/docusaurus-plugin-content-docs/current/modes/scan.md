---
title: Análisis (solo lectura)
description: Revise las raíces de caché, las descargas incompletas y otros candidatos de limpieza de Linux sin eliminar archivos.
tags: [scan, read-only, audit, preview, modes]
sidebar_position: 3
---

# Análisis (solo lectura)

**`--scan` lista rutas y su tamaño actual sin eliminar archivos.** Es un primer vistazo al equipo. Use una simulación del modo de limpieza elegido para ver las acciones propuestas.

```bash
linux-cleanup --scan
```

## ¿Qué revisa? {#what-does-it-inspect}

El análisis imprime una tabla de raíces de caché y de herramientas de compilación: gestores de paquetes, navegadores, Gradle, ejecutores de pruebas, herramientas de Android y otras ubicaciones configuradas. También lista descargas incompletas, descargas probablemente duplicadas, archivos personales grandes y sin uso que son candidatos y algunas observaciones del sistema. No ejecuta la limpieza de gestores de paquetes ni pide `sudo`.

El tamaño de una raíz de caché listada abarca todo lo que contiene ahora. **No** es lo que eliminará la herramienta. El modo elegido, el umbral de inactividad, el uso actual y las reglas de rechazo determinan lo que se queda.

El análisis escribe un registro local de la sesión. No escribe el [informe JSON de la sesión](../reference/report-schema.md) del recorrido guiado.

## Lea las rutas antes de elegir un modo {#read-the-paths-before-choosing-a-mode}

Compruebe cualquier ruta que no reconozca. Un enlace simbólico puede apuntar a un lugar distinto de lo que indica su nombre; revíselo con `realpath` antes de una limpieza. La protección de rutas también resuelve los enlaces antes de eliminar.

Los archivos personales candidatos aparecen solo para revisarlos. La limpieza habitual `--all-safe` no los selecciona. Para previsualizar la limpieza de cachés:

```bash
linux-cleanup --all-safe --dry-run
```

Una simulación recorre ese modo sin eliminar. Puede seguir escribiendo un registro local y el estado de la comprobación de actualizaciones. Una eliminación real no se puede deshacer.

## Análisis legible por máquina {#machine-readable-scan}

```bash
linux-cleanup --scan --json-events > scan.ndjson
```

El [flujo de eventos de la versión 1](../reference/json-events.md) va a stdout; el texto para personas, a stderr. Puede contener rutas locales completas. Manténgalo en este equipo y use el código de salida para distinguir una ejecución completa de un flujo interrumpido.

## Otras vistas de solo lectura {#other-read-only-views}

| Comando | Pregunta que responde |
|---|---|
| `--list-targets` | ¿Qué rutas configuradas puede abarcar o rechazar un modo? |
| `--audit` | ¿Qué entradas de `$HOME` son las más grandes, las cubra o no un modo de limpieza? |
| `--globals` | ¿Qué paquetes globales de runtimes están instalados? |
| `--self-test` | ¿Pasan los comandos necesarios, la sintaxis y las verificaciones de las protecciones? |

Lea [Revisar antes de eliminar](../safety/preview-first.md) para el orden y después [Opciones de la CLI](../reference/cli-flags.md) para las opciones de cada modo.
