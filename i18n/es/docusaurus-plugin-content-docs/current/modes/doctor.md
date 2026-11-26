---
title: Doctor
description: Detecte runtimes instalados en el disco pero ausentes del arranque de la shell (nvm, pnpm, bun, deno, cargo) y añada el bloque de inicio estándar con su confirmación. Solo añade.
tags: [doctor, repair, shell, bashrc, nvm, pnpm, bun, deno, cargo, modes]
sidebar_position: 14
---

# Doctor

**`--doctor` encuentra runtimes que están en el disco pero no conectados a la configuración de su shell, y ofrece añadir el bloque de inicio que falta.** Se añadió en la [1.1.0](../changelog.md#110--2026-05-10).

```bash
linux-cleanup --doctor
```

Es el modo para cuando aparece `pnpm: command not found` y usted sabe perfectamente que instaló pnpm.

## Solo añade {#additive-only}

:::note Doctor nunca elimina ni edita una línea existente
**Añade** un bloque de inicio estándar, y solo después de que usted lo confirme. No modifica, reordena ni elimina nada que ya esté en la configuración de su shell.

Los archivos de inicio de la shell están además protegidos en la capa de eliminación: `safe_rm` rechaza cualquier ruta cuyo nombre de archivo sea `.bashrc`, `.zshrc`, `.profile`, `.bash_aliases` o similar, esté donde esté. Vea [Rutas protegidas](../reference/protected-paths.md#protected-basenames).
:::

## Qué comprueba {#what-it-checks}

| Runtime | Detecta | Añade |
|---|---|---|
| `nvm` | `~/.nvm` presente, sin inicio de `NVM_DIR` | El bloque estándar de carga de nvm |
| `pnpm` | `~/.local/share/pnpm` presente, fuera del `PATH` | La exportación de `PNPM_HOME` y la entrada en `PATH` |
| `bun` | `~/.bun` presente, fuera del `PATH` | El bloque de inicio de Bun |
| `deno` | `~/.deno` presente, fuera del `PATH` | La entrada de Deno en `PATH` |
| `cargo` | `~/.cargo` presente, fuera del `PATH` | `. "$HOME/.cargo/env"` |

## Cómo suele ocurrir {#how-this-usually-happens}

Un instalador escribe su bloque de inicio en un archivo que su shell no lee. `~/.profile` solo lo leen las shells de inicio de sesión; `~/.bash_profile`, si existe, lo tapa; un cambio en `~/.bashrc` nunca llega a una sesión de `zsh`. El runtime se instala bien y luego parece desaparecer.

También ocurre al trasladar un repositorio de dotfiles entre equipos o al cambiar de shell de inicio de sesión.

## Después {#afterwards}

Recargue la shell, o parecerá que el cambio no ha funcionado:

```bash
source ~/.bashrc     # o ~/.zshrc
```

Luego compruébelo:

```bash
command -v pnpm && pnpm --version
```

## Su relación con la revisión de paquetes globales {#its-relationship-to-the-globals-audit}

[`--globals`](./globals-audit.md) funciona aunque falte un gestor de paquetes en el `PATH`, porque recurre a inspeccionar el sistema de archivos. Así que si la revisión lista paquetes globales de pnpm pero no se encuentra `pnpm`, la solución es `--doctor`.

## Siguiente {#next}

- [Revisión de paquetes globales](./globals-audit.md)
- [Solución de problemas](../troubleshooting.md)
