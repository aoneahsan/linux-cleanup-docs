---
title: Protecciones
description: "Los cuatro filtros independientes que una ruta debe pasar antes de que linux-cleanup la elimine: la lista de rutas permitidas, el filtro de inactividad, los modos personales solo interactivos y el confinamiento de sudo."
sidebar_position: 3
---

# Protecciones

**linux-cleanup aplica hasta cuatro filtros independientes antes de cualquier eliminación. Una ruta debe pasar todos los que le correspondan.** Esta página explica qué es cada filtro, por qué existe y qué no cubre.

Las protecciones son todo el modelo de seguridad. Detrás de ellas no hay copia de seguridad ni [forma de deshacer](./irreversibility.md).

## Filtro 1: la lista de rutas permitidas {#guard-1--the-path-allowlist}

Siempre activo. No se puede desactivar y ninguna opción lo anula.

Antes de eliminar nada, el destino se resuelve con `realpath` y se rechaza si cae en una ruta protegida o dentro de ella. Como la resolución va primero, un enlace simbólico no puede colar una ruta: si `~/.cache/yarn` es un enlace simbólico hacia `~/Documents`, la ruta resuelta queda dentro de `~/Documents`, el filtro se activa y la eliminación se rechaza.

Lo respaldan tres listas separadas:

| Lista | Tipo de coincidencia | Propósito |
|---|---|---|
| Raíces del sistema y directorios personales | La ruta o cualquier subruta | `/etc`, `~/Documents`, `~/.ssh`, `~/.config`, … |
| Raíces de instalación de gestores de paquetes | **Solo la ruta exacta** | `~/.local/share/pnpm`, `~/.npm`, `~/.cargo`, … |
| Archivos de inicio y de historial de la shell | **Nombre de archivo, en cualquier ubicación** | `.bashrc`, `.zshrc`, `.bash_history`, … |

Cuando el filtro se activa, verá un rechazo en stderr:

```text
✗ REFUSE: protected path: /home/you/Documents/notes
```

La lista de coincidencia exacta merece un comentario. `~/.npm` está protegida *exactamente*, y por eso se puede limpiar `~/.npm/_cacache`, que está dentro. Es intencionado: la raíz de instalación se conserva mientras que la caché regenerable que contiene se puede limpiar. Las listas completas están en [Rutas protegidas](../reference/protected-paths.md).

:::note Lo que este filtro no hace
Protege *ubicaciones*, no *valor*. Un vídeo irreemplazable de 40 GB en `~/Downloads` no está cubierto por la lista de rutas permitidas: `~/Downloads` no es una ruta protegida. Lo cubre el [filtro 3](#guard-3--personal-data-is-interactive-only).
:::

Los modos de limpieza eligen rutas de destino concretas y después la comprobación de rutas protegidas rechaza los destinos peligrosos. Que una ruta no esté en la lista protegida no significa que sea seguro eliminarla: revise los destinos de cada modo y su simulación.

## Filtro 2: el filtro de inactividad {#guard-2--the-staleness-gate}

Predeterminado: 100 días. Introducido en la [1.2.0](../changelog.md#120--2026-05-10) y ampliado en la [1.2.1](../changelog.md#121--2026-05-10).

Desde la 1.2.0 la estrategia predeterminada es **podar, no vaciar**. Dentro de un directorio de destino, un archivo solo se elimina cuando **tanto** su `atime` como su `mtime` son anteriores a `--days`. Se recogen los directorios vacíos que quedan; la estructura del directorio se mantiene para que la herramienta propietaria siga encontrando su organización.

Exigir las dos marcas de tiempo es importante. Solo `mtime` borraría un archivo descargado hace un año y leído ayer; solo `atime` no es fiable en sistemas de archivos montados con `noatime` o `relatime`. Exigir ambas es la lectura prudente.

Para lo que es una *herramienta* y no una caché (AVD de Android, versiones de extensiones de editores, datos de usuario de flatpak), la 1.2.1 añadió una segunda condición. Un recurso así solo se elimina cuando **ningún software activo depende de él Y lleva inactivo más del umbral**. Cada recurso se evalúa como una unidad indivisible, para que una poda parcial no deje un perfil de emulador a medio borrar.

```bash
linux-cleanup --all-safe -y -d 30    # más agresivo: umbral de 30 días
linux-cleanup --all-safe -y          # predeterminado: 100 días
linux-cleanup --all-safe --purge-all # filtro DESACTIVADO: vaciado total, como antes de la 1.2.0
```

:::danger `--purge-all` desactiva este filtro por completo
Con `--purge-all` cada caché de destino se vacía entera sin importar la antigüedad. Ese comportamiento es el que motivó el filtro: elimina distribuciones del wrapper de Gradle, navegadores de Playwright de ramas antiguas y tarballs en caché de yarn de dependencias fijadas; cada uno es una descarga costosa.

Es una opción legítima antes de reinstalar un equipo. Es un mal valor predeterminado para el uso diario.
:::

El aviso previo a la ejecución indica qué estrategia está activa, así que nunca hay dudas sobre lo que va a pasar.

## Filtro 3: los datos personales son solo interactivos {#guard-3--personal-data-is-interactive-only}

Los modos que pueden tocar archivos personales son interactivos por norma:

- [`--stale`](../modes/personal-stale-files.md): archivos grandes y sin uso en `~/Downloads` y en raíces sin protección configuradas
- [`--partials`](../modes/partial-downloads.md): descargas incompletas abandonadas
- [`--node-modules`](../modes/node-modules-finder.md): directorios de dependencias de proyectos abandonados

**`--yes` no se aplica a estos modos y nunca se aplicará.** `--yes` solo confirma automáticamente las cachés regenerables. La herramienta imprime su lista de candidatos, espera la confirmación de cada entrada y no elimina nada hasta que usted responde.

La razón es que los archivos personales no llevan ninguna señal que un programa pueda leer. Nada en el disco distingue un instalador que nunca volverá a abrir de la única copia de un documento que todavía no ha necesitado. Solo usted lo sabe, así que la herramienta se niega a adivinar.

## Filtro 4: confinamiento de sudo {#guard-4--sudo-confinement}

[`--system`](../modes/system-cleanup.md) es el único modo que llama a `sudo`, y lo hace para un conjunto fijo y enumerado de operaciones, cada una como una invocación separada y revisable, y cada una con su propia pregunta:

| Operación | Respuesta predeterminada |
|---|---|
| `apt autoremove --purge -y` + `apt clean` | Sí |
| `journalctl --vacuum-size=100M` | Sí |
| Eliminar revisiones de snap desactivadas | Sí |
| Listar los kernels instalados: **no elimina nada** | — |
| Eliminar archivos de `/tmp` con `atime` de más de 7 días | Sí |
| `sync` + `sysctl vm.drop_caches=3` | **No** |

El script no edita `/etc/sudoers`, y `--system` pregunta por cada operación. Si `sudo` no está disponible, el modo se detiene en lugar de seguir en un estado degradado.

Hay dos valores **fijos que ignoran `--days`**: el objetivo de limpieza del registro (100 MB) y el umbral de antigüedad de `/tmp` (7 días).

## Lo que ningún filtro cubre {#what-no-guard-covers}

Ser claro sobre los huecos sirve más que tranquilizar.

| Hueco | Qué significa |
|---|---|
| **No hay deshacer** | Nada de esto hace reversible una eliminación. Vea [La eliminación es permanente](./irreversibility.md). |
| **`~/Downloads` no está protegida** | Se llega a ella con el modo interactivo de archivos personales: lea los candidatos. `~/Desktop` sí está protegida. |
| **`--purge-all` quita el filtro 2** | Los filtros 1, 3 y 4 siguen activos; el de inactividad no. |
| **Ejecutar como root amplía el alcance del daño** | La herramienta está pensada para un usuario normal. `--system` gestiona internamente las necesidades legítimas de sudo. |
| **Las protecciones cubren rutas, no contenido** | Un directorio protegido está a salvo esté donde esté; un archivo valioso fuera de uno, no. |
| **`/proc` y `/sys` no están en la lista protegida** | Nada los tiene como destino, pero la lista tampoco los nombra. |

## Compruebe usted mismo las protecciones {#verifying-the-guards-yourself}

```bash
npx linux-cleanup --self-test      # comprueba que los filtros saltan en rutas conocidas
npx linux-cleanup --list-targets   # imprime la lista de destinos y la de rutas protegidas
```

`--self-test` es la comprobación honesta. Verifica que `/`, `$HOME`, `~/Documents`, `~/.ssh` y `/etc` están protegidas y que `~/.cache/yarn` no lo está, y termina con un código distinto de cero si alguna verificación falla. La documentación puede quedarse atrás; la verificación se ejecuta sobre el código que realmente tiene.

## Siguiente {#next}

- [Rutas protegidas](../reference/protected-paths.md): las listas completas verificadas
- [La eliminación es permanente](./irreversibility.md): el modelo detrás de «sin deshacer»
- [Qué elimina](./what-it-deletes.md): el inventario de destinos
