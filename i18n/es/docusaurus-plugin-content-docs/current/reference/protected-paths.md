---
title: Rutas protegidas
description: "La lista completa y verificada de rutas que linux-cleanup se niega a eliminar: raíces del sistema, directorios personales, raíces de instalación de gestores de paquetes y nombres de archivos de inicio del shell."
sidebar_position: 3
---

# Rutas protegidas

**Estas son las rutas que linux-cleanup se niega a eliminar.** El rechazo es incondicional: ninguna opción lo anula, ni siquiera `--purge-all`.

Cada candidata se resuelve con `realpath` antes de la comprobación, así que un enlace simbólico que apunta a un directorio protegido se rechaza por la ruta resuelta, no por el enlace.

:::tip Compruébelo en su propia instalación en lugar de fiarse de esta página
Las listas cambian entre versiones, y circulan descripciones de segunda mano de esta herramienta con directorios que en realidad **no** están protegidos.

```bash
linux-cleanup --list-targets   # las listas tal como las ve su versión
linux-cleanup --self-test      # comprueba que la barrera actúa en rutas conocidas
```
:::

## Tres listas separadas {#three-separate-lists}

La barrera se forma con tres listas con reglas de coincidencia distintas. La diferencia importa: es lo que permite limpiar `~/.npm/_cacache` mientras `~/.npm` sigue intocable.

| Lista | Coincide con | Propósito |
|---|---|---|
| Rutas protegidas | La ruta **y todo lo que hay debajo** | Datos personales, credenciales, configuración |
| Protegidas exactas | **Solo esa ruta exacta** | Raíces de instalación de gestores de paquetes |
| Nombres protegidos | **Cualquier archivo con ese nombre, en cualquier sitio** | Archivos de inicio y de historial del shell |

## Raíces del sistema {#system-roots}

Se rechazan como ruta o como cualquier elemento dentro, salvo donde se indica.

| Ruta | También se rechaza su contenido |
|---|---|
| `/` | — (la raíz misma) |
| `/home` | No: solo la ruta exacta |
| `/root` | No: solo la ruta exacta |
| `/etc` | **Sí** |
| `/boot` | **Sí** |
| `/usr` | **Sí** |
| `/var` | No: solo la ruta exacta |
| `/lib` | No: solo la ruta exacta |
| `/sbin` | No: solo la ruta exacta |
| `/bin` | No: solo la ruta exacta |
| `$HOME` | No: la raíz del directorio personal, para que un `$HOME` a secas nunca pueda vaciarse |

:::note `/proc` y `/sys` no están en esta lista
Ningún destino de limpieza se acerca a ellos, pero la lista de permitidas no los nombra de forma explícita. Algunas descripciones de esta herramienta afirman que sí. No es así.
:::

## Directorios personales {#personal-directories}

Se rechazan junto con todo lo que contienen.

| Ruta | Contiene |
|---|---|
| `~/Documents` | Documentos |
| `~/Pictures` | Imágenes |
| `~/Music` | Audio |
| `~/Videos` | Vídeo |
| `~/Desktop` | Contenido del escritorio |
| `~/Public` | Archivos compartidos |
| `~/Templates` | Plantillas de documentos |

:::caution `~/Downloads` NO está protegido a propósito
No puede estarlo: limpiar allí archivos grandes sin uso desde hace tiempo es una función ([Archivos personales sin uso](../modes/personal-stale-files.md)). Lo que lo protege es [la barrera 3](../safety/guards.md#guard-3--personal-data-is-interactive-only): solo interactivo, confirmación archivo por archivo y `--yes` ignorado.

Si guarda algo irreemplazable en `~/Downloads`, muévalo a un directorio protegido. Esa es la solución duradera.
:::

## Credenciales, configuración y estado de agentes {#credentials-configuration-and-agent-state}

| Ruta | Contiene |
|---|---|
| `~/.ssh` | Claves SSH y hosts conocidos |
| `~/.gnupg` | Llavero GPG |
| `~/.config` | Configuración de aplicaciones (muy amplia) |
| `~/.gnome` | Ajustes de GNOME |
| `~/.mozilla` | Perfiles de Firefox |
| `~/.thunderbird` | Perfiles de Thunderbird |
| `~/.claude` | Estado de Claude Code |
| `~/.local/share/claude` | Datos de Claude Code |

:::danger Dos rutas que se suelen dar por protegidas NO lo están
**`~/.password-store`** (pass) y **`~/.aws`** (credenciales de AWS) **no** aparecen en la lista protegida del código. Algunos textos sobre esta herramienta dicen que sí.

En la práctica ningún destino de limpieza apunta a ellas, así que no corren riesgo en el uso normal; pero no confíe en la lista de permitidas para defenderlas. Si quiere esa garantía, compruébelo antes con `--list-targets` en su instalación.
:::

Tenga en cuenta que proteger `~/.mozilla` no impide limpiar la caché de Firefox: la caché está en `~/.cache/mozilla`, otro árbol.

## Rutas protegidas por coincidencia exacta {#exact-match-protected-paths}

Coinciden **exactamente**: su contenido se puede seguir limpiando. Esto conserva los paquetes instalados globalmente y a la vez permite podar la caché regenerable dentro de cada raíz de instalación.

| Ecosistema | Rutas |
|---|---|
| pnpm | `~/.local/share/pnpm` y sus `global`, `bin`, `nodejs` |
| npm | `~/.npm`, `~/.npm-global`, `~/.npm-global/lib`, `~/.npm-global/lib/node_modules` |
| yarn | `~/.yarn`, `~/.config/yarn/global` |
| bun | `~/.bun`, `~/.bun/install`, `~/.bun/install/global` y su `node_modules`, `~/.bun/bin` |
| deno | `~/.deno`, `~/.deno/bin` |
| Gestores de versiones de Node | `~/.volta`, `~/.volta/bin`, `~/.nvm`, `~/.nvm/versions`, `~/.fnm` |
| Rust | `~/.cargo`, `~/.cargo/bin`, `~/.rustup` |
| Go | `~/go`, `~/go/bin` |

Esta lista existe por un defecto real: antes de la [1.1.0](../changelog.md#110--2026-05-10), la limpieza de pnpm apuntaba a `~/.local/share/pnpm` (la raíz de instalación) y eliminaba los paquetes globales junto con el propio binario `pnpm`. La corrección limitó el destino a `~/.local/share/pnpm/store` y añadió esta lista para que el error no se repita.

[`--all-safe`](../modes/all-safe.md) además comprueba al arrancar que ninguna de ellas aparezca nunca en su lista de destinos, y se detiene con un mensaje `BUG:` si aparece alguna.

## Nombres de archivo protegidos {#protected-basenames}

Se rechazan **por nombre de archivo, en cualquier ubicación**, sea cual sea la ruta que lleva a ellos:

`.bashrc` · `.bash_profile` · `.bash_login` · `.profile` · `.bash_logout` · `.zshrc` · `.zshenv` ·
`.zprofile` · `.zlogin` · `.zlogout` · `.bash_aliases` · `.bash_history` · `.zsh_history` · `.inputrc` ·
`.dircolors` · `.config` · `.local`

Es una última barrera. Existe para que un error futuro que de algún modo metiera un archivo de inicio del shell en una lista de destinos siga sin poder eliminarlo.

## Cómo se ve un rechazo {#what-a-refusal-looks-like}

```text
✗ REFUSE: protected path: /home/you/Documents/notes
✗ REFUSE: unsafe path: '/home/you'
✗ REFUSE: shell-init / history file: /home/you/.bashrc
```

Un rechazo es el comportamiento correcto, no un error que haya que esquivar. Si se rechaza una caché que quiere limpiar, la causa casi siempre es un enlace simbólico que acaba en un sitio protegido: arregle el enlace, no la herramienta. Vea [Solución de problemas](../troubleshooting.md#refuse-protected-path).

## Siguiente {#next}

- [Barreras de seguridad](../safety/guards.md) — cómo se aplica esta lista
- [Qué elimina](../safety/what-it-deletes.md) — el otro lado del límite
