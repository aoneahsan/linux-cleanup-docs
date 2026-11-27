---
title: Requisitos
description: Lo que necesita linux-cleanup para funcionar (bash 4+, GNU coreutils, solo Linux) y las dependencias opcionales que habilitan la exportación de informes y el menú visual.
sidebar_position: 1
---

# Requisitos

**linux-cleanup funciona en Linux con `bash` 4 o posterior y GNU coreutils.** Todo lo demás es opcional y, si falta, la herramienta sigue funcionando sin esa parte.

## Plataforma {#platform}

| | |
|---|---|
| **Sistema operativo** | Solo Linux. El paquete de npm declara `"os": ["linux"]` y se negará a instalarse en otros sistemas |
| **Shell** | `bash` ≥ 4.0 |
| **Node.js** | ≥ 14, **solo** para `npx` y `npm install -g`. No hace falta para un git clone |
| **Privilegios** | Se ejecuta como usuario normal. Solo [`--system`](../modes/system-cleanup.md) pide `sudo` |

Conviene distinguir macOS y WSL:

- **macOS no es compatible.** Las rutas, las opciones de `find` y los gestores de paquetes son distintos. Existe una herramienta hermana para macOS; no use esta en un Mac.
- **WSL funciona del lado de Linux.** Revise antes de una limpieza cualquier enlace simbólico de `$HOME` hacia `/mnt/c/`. La [lista de rutas permitidas](../reference/protected-paths.md) resuelve los enlaces simbólicos, pero sus rutas protegidas del directorio personal de Linux no implican que todos los directorios de Windows estén protegidos.

## Comandos necesarios {#required-commands}

Están presentes en prácticamente todas las distribuciones habituales: `bash`, `find`, `du`, `df`, `rm`, `awk`, `sort`, `grep`, `sed`, `stat`, `realpath`.

`realpath` importa más que los demás: es el que resuelve los enlaces simbólicos antes de la comprobación de rutas protegidas. En una imagen de contenedor mínima sin GNU coreutils, instálelas antes de ejecutar.

```bash
npx linux-cleanup --self-test
```

`--self-test` comprueba cada comando necesario e indica el primero que falte, con una pista para solucionarlo. Ejecútelo antes de cualquier cosa destructiva.

## Dependencias opcionales {#optional-dependencies}

Cada una habilita una función. Sin ella, esa función no está disponible y el resto de la herramienta no se ve afectado.

| Dependencia | Habilita | Sin ella |
|---|---|---|
| `jq` | [Exportación de informes](../modes/reports.md) a Markdown / HTML | Los informes JSON se siguen escribiendo; la conversión no está disponible |
| `whiptail` | El [menú TUI](../modes/tui.md) visual | `--tui` vuelve al menú de la CLI con una pista de instalación |
| `dialog` | Alternativa de TUI cuando falta `whiptail` | Igual que arriba |
| `snap` | Limpieza de revisiones de snap desactivadas en `--system` | Ese paso se omite sin problemas |
| `crontab` | El [instalador semanal de cron](../guides/alias-and-cron.md) | `--install-cron` no puede ejecutarse |
| `numfmt` | Tamaños de bytes legibles | Se muestran los bytes en bruto |
| `xdg-open` | Abrir informes HTML en un navegador | Abra el archivo a mano |
| `less` | Vista JSON paginada en el gestor de informes | Lea el archivo directamente |
| `lsb_release` | Mejor detección de la distribución en los paquetes de comentarios | El paquete se genera igualmente |

### Instalar las dos que importan {#installing-the-two-that-matter}

`jq` (exportación de informes) y `whiptail` (menú visual) son las dos que quiere la mayoría.

```bash
# Debian / Ubuntu / Mint
sudo apt install jq whiptail

# Fedora / RHEL / Rocky
sudo dnf install jq newt

# Arch / Manjaro
sudo pacman -S jq libnewt

# openSUSE
sudo zypper install jq newt
```

El binario `whiptail` viene en el paquete `newt` en las distribuciones basadas en RPM y en `libnewt` en Arch.

## Compatibilidad con distribuciones {#distro-coverage}

La limpieza de cachés dentro de `$HOME`, que es la gran mayoría de lo que recupera esta herramienta, funciona igual en todas las distribuciones de Linux.

:::warning `--system` es solo para Debian/Ubuntu
El modo con sudo llama directamente a `apt` y `dpkg`, sin detectar la distribución y sin protección. En Fedora, Arch u openSUSE sus pasos de paquetes fallan con «command not found».

El detalle completo de qué pasos funcionan dónde: [Compatibilidad con distribuciones](../distro-support.md).
:::

## Salida en disco {#output-on-disk}

Cada ejecución puede escribir un registro local. Un recorrido guiado también puede escribir un informe JSON, y se crea un paquete de depuración cuando se pide o después de un fallo inesperado. Su tamaño depende de la ejecución. Vea [Rutas de salida](../reference/output-paths.md) para la estructura.

## Siguiente {#next}

- [Instalación](./installation.md): las tres formas de instalar
- [Inicio rápido](./quick-start.md): su primera limpieza
