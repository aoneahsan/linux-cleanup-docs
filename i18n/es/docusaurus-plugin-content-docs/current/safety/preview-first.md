---
title: Revisar antes de eliminar
description: Use un análisis de solo lectura y una simulación para revisar las rutas de linux-cleanup antes de una eliminación permanente.
tags: [safety, dry-run, scan, preview, read-only]
sidebar_position: 2
---

# Revisar antes de eliminar

**Empiece con `--scan` y luego ejecute el modo de limpieza con `--dry-run`.** El análisis muestra rutas y tamaños sin eliminar nada. Una simulación recorre la limpieza elegida e imprime las acciones que realizaría, sin eliminar archivos ni cambiar la configuración. Ambos crean igualmente un registro local de la sesión.

```bash
linux-cleanup --self-test
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

`--self-test` comprueba las dependencias, la sintaxis de Bash y la protección de rutas. Deténgase si falla.

## ¿Qué muestra el análisis? {#what-does-the-scan-show}

`--scan` lista raíces de caché, descargas incompletas, descargas probablemente duplicadas, archivos personales grandes y sin uso que son candidatos, y observaciones del sistema. El tamaño que da para una raíz de caché es **todo lo que hay ahí ahora**, no lo que eliminará una limpieza posterior. El umbral de inactividad predeterminado de 100 días, el uso actual y las reglas de cada modo pueden conservar la mayor parte.

El análisis no crea un informe JSON de la sesión. Si necesita un análisis legible por máquina, use `linux-cleanup --scan --json-events`. El flujo de eventos puede incluir rutas locales completas; manténgalo en su equipo.

## ¿Qué muestra una simulación? {#what-does-a-dry-run-show}

`--dry-run` recorre la limpieza elegida e imprime las acciones propuestas. Por ejemplo:

```bash
linux-cleanup --all-safe --dry-run
linux-cleanup --all-safe --yes --dry-run --json-events > preview.ndjson
```

El primer comando pide confirmación igual que una ejecución real. El segundo no es interactivo y escribe eventos JSON versionados en stdout; el texto para personas va a stderr. Ninguno elimina archivos. Una simulación no escribe un informe JSON de la sesión.

Una revisión es una foto del equipo en este momento, no una promesa sobre una ejecución posterior. Entre la revisión y la confirmación, los archivos pueden usarse, modificarse o eliminarse. La herramienta no tiene deshacer ni copia de seguridad.

## Compruebe el límite antes de una ejecución real {#check-the-boundary-before-a-real-run}

`--list-targets` imprime las raíces de destino configuradas y las rutas protegidas sin medir el disco. Sirve para saber si un directorio entra en el alcance. La [referencia de rutas protegidas](../reference/protected-paths.md) describe las reglas de rechazo.

Los modos de archivos personales y los relacionados con proyectos son independientes de la limpieza habitual de cachés. Revise sus candidatos uno por uno. `--yes` solo se aplica a `--all-safe`; no aprueba la eliminación de archivos personales.

Cuando la revisión coincida con lo que quiere, elija el modo y lea su confirmación. Una eliminación real es permanente.

## Siga leyendo {#read-next}

- [Qué elimina](./what-it-deletes.md)
- [Protecciones](./guards.md)
- [Opciones de la CLI](../reference/cli-flags.md)
