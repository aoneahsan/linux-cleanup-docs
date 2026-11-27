---
title: Recuperar espacio con criterio
description: Revise el uso del disco en Linux, previsualice cada modo de limpieza y elija rutas de caché, de proyectos o del sistema de una en una.
sidebar_position: 1
---

# Recuperar espacio con criterio

**Mida primero. Elija el alcance de limpieza más pequeño que resuelva las rutas que encontró.** El tamaño indicado para una raíz de caché no garantiza que una limpieza pueda o deba eliminarla entera.

## 1. Encuentre las rutas grandes {#1-find-the-large-paths}

```bash
linux-cleanup --audit
linux-cleanup --scan
```

`--audit` lista las entradas grandes de `$HOME`, incluidas las que esta herramienta no puede limpiar. `--scan` lista las raíces de caché configuradas y otros candidatos sin eliminar nada. Si el disco lo ocupa sobre todo una imagen de máquina virtual, un conjunto de datos o una biblioteca de juegos, revísela directamente en lugar de ejecutar modos de limpieza que no tienen que ver.

## 2. Previsualice las cachés habituales {#2-preview-routine-caches}

```bash
linux-cleanup --all-safe --dry-run
```

El modo totalmente seguro predeterminado poda las cachés regenerables que cumplen los requisitos tras el umbral de 100 días de inactividad. La revisión recorre esas reglas sin eliminar. Puede seguir escribiendo un registro local y el estado de la comprobación de actualizaciones.

Si todas las rutas propuestas son cosas que puede reconstruir o volver a descargar, ejecute `linux-cleanup --all-safe` y revise su confirmación. `--yes` es para una ejecución desatendida después de haber revisado ya este equipo.

## 3. Revise aparte las dependencias de proyectos {#3-review-project-dependencies-separately}

```bash
linux-cleanup --node-modules --dry-run
```

El modo de dependencias de proyectos es interactivo. Compruebe la ruta del proyecto y su archivo de bloqueo antes de una eliminación real. Un cambio local hecho dentro de `node_modules` no se recupera al reinstalar las dependencias.

## 4. Revise aparte el almacenamiento del sistema {#4-review-system-storage-separately}

```bash
linux-cleanup --system --dry-run
```

El modo de sistema completo usa apt y dpkg, así que es para Debian y Ubuntu. Pide sudo e incluye la limpieza del registro, los archivos antiguos de `/tmp` y un paso opcional de caché de páginas. Ese paso afecta a la RAM, no al disco. Vea [Limpieza del sistema](../modes/system-cleanup.md).

## 5. Cambie el umbral de antigüedad solo tras otra revisión {#5-change-the-age-threshold-only-after-another-preview}

`--days N` cambia qué archivos sin uso o qué unidades de caché completas cumplen los requisitos. Bajarlo de 100 a 30 puede eliminar material que usó hace poco, así que revise antes una simulación con el valor elegido. `--purge-all` desactiva la protección por antigüedad; puede eliminar una distribución de Gradle o un navegador de pruebas que tendrá que volver a descargar.

## 6. Deje los archivos personales como una decisión aparte {#6-keep-personal-files-as-a-separate-decision}

`--stale` muestra archivos personales grandes y sin uso que son candidatos, y pregunta por cada eliminación. Una descarga antigua puede ser su única copia. `--yes` no aprueba este modo. Vea [Archivos personales sin uso](../modes/personal-stale-files.md) y [La eliminación es permanente](../safety/irreversibility.md).

El espacio recuperado varía según el equipo y según otros procesos que escriban durante la ejecución. Revise el registro final y las rutas conservadas antes de decidir si necesita otro modo.
