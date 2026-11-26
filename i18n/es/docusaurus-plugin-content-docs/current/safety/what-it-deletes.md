---
title: Qué elimina
description: Los modos de limpieza de Linux y sus rutas de destino, con la diferencia entre cachés habituales, tareas del sistema y archivos personales.
tags: [safety, deletion, targets, caches, disk-space]
sidebar_position: 1
---

# Qué elimina

**linux-cleanup elimina de forma permanente las cachés y los restos seleccionados.** El destino depende del modo. Un análisis lista las rutas y su tamaño actual; una simulación recorre la limpieza elegida y muestra las acciones propuestas. Ninguno es una copia de seguridad.

```bash
linux-cleanup --list-targets
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

La [protección de rutas](../reference/protected-paths.md) rechaza las ubicaciones personales y del sistema configuradas, después de resolver los enlaces simbólicos. Lea cada ruta propuesta antes de una ejecución real.

## Cachés de gestores de paquetes

La limpieza habitual totalmente segura puede podar estas raíces de caché. Reinstalar un paquete después puede requerir una descarga.

| Caché | Raíz de destino |
|---|---|
| Yarn Berry | `~/.yarn/berry/cache` |
| npm | `~/.npm/_cacache` |
| npx | `~/.npm/_npx` |
| pnpm store | `~/.local/share/pnpm/store` |
| pnpm cache | `~/.cache/pnpm` |
| bun | `~/.bun/install/cache` |
| deno | `~/.cache/deno` |
| Composer | `~/.cache/composer` |
| pip | `~/.cache/pip` |

Los paquetes extraídos de Yarn v1 se podan como entradas completas en `~/.cache/yarn`. Los paquetes instalados globalmente y las raíces de instalación de los gestores de paquetes son independientes de estas cachés.

## Cachés de navegadores y aplicaciones

Los destinos habituales incluyen las cachés de navegador configuradas, las unidades de versión de Gradle, los binarios de Cypress y Playwright y la caché del observador de TypeScript. Un navegador o una herramienta de compilación puede tener que regenerar o volver a descargar lo eliminado la próxima vez que se use. La distribución actual de Gradle y la versión actual de Android Studio se conservan por sus propias reglas; una unidad antigua que cumple los requisitos se elimina entera para no dejar una instalación a medio borrar.

El modo comprueba el último acceso y la última modificación antes de podar archivo por archivo. Un sistema de archivos con tiempos de acceso poco fiables impide la poda por antigüedad. `--purge-all` quita ese filtro de antigüedad y exige una decisión aparte.

## Datos de herramientas de desarrollo

El análisis puede mostrar AVD de Android, la caché de pub de Flutter, datos de usuario de Flatpak y otras raíces grandes. **Que una ruta aparezca en el análisis no garantiza que `--all-safe` la elimine.** Lea la página del modo y la salida de la simulación para ver lo que el modo elegido abarca de verdad. Los emuladores de Android y las aplicaciones Flatpak instaladas no son caché habitual.

## Extensiones de editores

`--editor-ext` considera las versiones de extensiones de VS Code y Cursor que ya fueron sustituidas. Requiere una versión más nueva y una versión antigua sin uso; la versión actual se conserva. Vea [Extensiones de editores](../modes/editor-extensions.md).

## Archivos de proyectos y personales: solo de forma interactiva

Los `node_modules` de proyectos abandonados, las descargas incompletas y los archivos personales grandes sin uso tienen sus propios modos interactivos. `--yes` no aprueba estos modos. Una descarga incompleta o un archivo en `~/Downloads` puede ser la única copia que tiene. Lea cada ruta y su consecuencia antes de confirmar.

## Limpieza del sistema (requiere sudo)

`--system` pregunta antes de cada paso de apt, registros del sistema, Snap, `/tmp` y caché de páginas. Sus comandos de paquetes usan `apt` y `dpkg`; no se adaptan a Fedora, Arch ni openSUSE. El paso del kernel lista las versiones instaladas; no elimina ninguna directamente. La limpieza del registro apunta a 100 MB, y la antigüedad de `/tmp` es de 7 días sin importar `--days`. Vaciar la caché de páginas afecta a la RAM, no al espacio en disco. Vea [Limpieza del sistema](../modes/system-cleanup.md) y [Compatibilidad con distribuciones](../distro-support.md).

## Lo que se niega a eliminar

La protección rechaza la raíz y rutas protegidas del directorio personal como `~/Documents`, `~/Pictures`, `~/.ssh`, `~/.config` y `~/.claude`. La lista exacta y sus excepciones están en [Rutas protegidas](../reference/protected-paths.md). `--self-test` comprueba algunos casos de rechazo en la copia instalada.

Una eliminación real no se puede deshacer. [Revisar antes de eliminar](./preview-first.md) explica el orden que conviene seguir antes de una limpieza.
