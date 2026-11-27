---
title: Compatibilidad con distribuciones
description: "Qué hace linux-cleanup en cada distribución de Linux: la limpieza de cachés funciona en todas, pero el modo --system con sudo solo es para Debian y Ubuntu."
sidebar_position: 90
---

# Compatibilidad con distribuciones

**La limpieza de cachés del directorio personal está pensada para distribuciones de Linux con las utilidades GNU necesarias.**
[`--system`](./modes/system-cleanup.md) usa comandos de paquetes de Debian y Ubuntu. Compruebe las herramientas instaladas con `--self-test` antes de limpiar.

## Resumen {#the-summary}

| Familia de distribuciones | Limpieza de cachés en `$HOME` | `--system` |
|---|---|---|
| Debian, Ubuntu, Mint, Pop!\_OS | Completa | **Completa** |
| Fedora, RHEL, Rocky, Alma | Con las utilidades necesarias | No lo use: los pasos de apt fallan |
| Arch, Manjaro, EndeavourOS | Con las utilidades necesarias | No lo use: los pasos de apt fallan |
| openSUSE | Con las utilidades necesarias | No lo use: los pasos de apt fallan |
| Alpine, contenedores mínimos | Necesita Bash y utilidades GNU | No lo use: los pasos de apt fallan |
| WSL | Con las utilidades necesarias | Solo Debian/Ubuntu; revise antes las rutas montadas |

:::warning `--system` no detecta la distribución
Los pasos de apt llaman directamente a `apt` y `dpkg`, sin comprobación con `command -v` y sin recurrir a `dnf`, `pacman` o `zypper`. En un sistema que no sea Debian, cada paso falla con "command not found".

El modo no se detiene tras un fallo de apt: los pasos siguientes pueden ejecutarse igual. Evítelo en otras distribuciones.

Algunas descripciones de esta herramienta afirman que `--system` ofrece compatibilidad escalonada con varias distribuciones, con `dnf` en lugar de `apt` y `paccache` en Arch. **Ese código no existe.** Compruébelo con `grep -rn 'dnf\|pacman\|zypper' modules/system_sudo.sh` en un clon: no devuelve nada.
:::

## Paso a paso {#step-by-step}

| Paso de `--system` | Debian/Ubuntu | Fedora/RHEL | Arch | openSUSE |
|---|---|---|---|---|
| `apt autoremove` + `apt clean` | Funciona | **Falla** | **Falla** | **Falla** |
| `journalctl --vacuum-size=100M` | Funciona | Funciona | Funciona | Funciona |
| Revisiones de snap desactivadas | Funciona | Si snap está instalado | Si snap está instalado | Si snap está instalado |
| Lista de kernels (`dpkg --list`) | Funciona | Silencioso: no imprime nada | Silencioso | Silencioso |
| Archivos de `/tmp` de más de 7 días | Funciona | Funciona | Funciona | Funciona |
| Vaciado de la caché de páginas | Funciona | Funciona | Funciona | Funciona |

Los pasos del diario, de `/tmp` y de la caché de páginas dependen de `journalctl`, `find` y `sysctl`, que se comportan igual dondequiera que haya systemd. El paso del kernel solo lista en cualquier caso, así que su fallo en sistemas sin dpkg no cuesta nada.

## Hacer usted la parte de los paquetes {#doing-the-package-part-yourself}

En un sistema que no sea Debian, siga las indicaciones de mantenimiento de su propio gestor de paquetes. Los comandos siguientes son ejemplos que conviene revisar antes de ejecutar:

```bash
# Fedora / RHEL / Rocky
sudo dnf autoremove
sudo dnf clean all

# Arch / Manjaro  (paccache está en pacman-contrib)
sudo pacman -Rns "$(pacman -Qtdq)"    # huérfanos, si los hay
sudo paccache -r                       # conserva las 3 últimas versiones
sudo pacman -Scc                       # vacía toda la caché de paquetes

# openSUSE
sudo zypper clean --all
sudo zypper packages --orphaned
```

Para las cachés del directorio personal, previsualice lo que encuentra linux-cleanup:

```bash
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

## Cachés del directorio personal {#home-cache-targets}

Las rutas del directorio personal dependen de las herramientas instaladas, no de la distribución. Lo que haya varía según el equipo:

- Cachés de gestores de paquetes — yarn, npm, pnpm, pip, composer, bun, deno
- Cachés de navegadores — Chrome, Firefox, Brave, Chromium, Edge, Vivaldi
- Cachés de herramientas de compilación — Gradle, Cypress, Playwright, TypeScript
- Datos de herramientas de desarrollo — Android AVD, Flutter pub-cache, Dart, flatpak
- Extensiones de editores — VS Code, Cursor
- `node_modules`, descargas incompletas, archivos personales sin uso
- Análisis, revisión, comprobaciones de seguridad y registros locales

## Contenedores mínimos {#minimal-containers}

Alpine y otras imágenes mínimas suelen incluir BusyBox en lugar de GNU coreutils. La herramienta necesita `find`, `du`, `stat` y, sobre todo, `realpath` de GNU: este último resuelve los enlaces simbólicos antes de la [comprobación de rutas protegidas](./reference/protected-paths.md).

```bash
apk add coreutils findutils bash
linux-cleanup --self-test
```

`--self-test` nombra la primera dependencia que falta. No ejecute modos que eliminen hasta que pase.

## WSL {#wsl}

La herramienta se ejecuta en el entorno Linux. Su protección de rutas resuelve los enlaces simbólicos, pero no reconoce las carpetas personales de Windows como carpetas protegidas de Linux. Revise con cuidado el análisis y la simulación si su directorio personal o sus cachés apuntan a `/mnt/`.

## macOS {#macos}

No es compatible. El paquete de npm declara `"os": ["linux"]` y se negará a instalarse. Las rutas, las opciones de `find` y los gestores de paquetes son distintos.

## Siguiente {#next}

- [Limpieza del sistema](./modes/system-cleanup.md) — el modo al que se refiere esta página
- [Requisitos](./getting-started/requirements.md)
