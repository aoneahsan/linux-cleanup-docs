---
title: Solución de problemas
description: "Síntoma, causa y solución de los problemas que de verdad encuentran los usuarios de linux-cleanup: rechazos, dependencias que faltan, fallos de cron, análisis lentos y confusión de versiones."
tags: [troubleshooting, errors, fixes, cron, jq, whiptail]
sidebar_position: 92
---

# Solución de problemas

Síntoma → causa → solución. Ejecute primero el comando de comprobación; si coincide, aplique la solución.

Si lo que ha perdido son datos y no se trata de un error, vaya a [Recuperación](./recovery.md).

## REFUSE: protected path {#refuse-protected-path}

```text
✗ REFUSE: protected path: /home/you/Documents/something
```

**Causa.** La ruta, después de expandir los enlaces simbólicos, apuntaba a algún lugar de la [lista protegida](./reference/protected-paths.md). La lista de rutas permitidas la bloqueó.

**Es el comportamiento correcto, no un fallo.** No se eliminó nada.

**Solución.** Averigüe qué apuntaba a dónde:

```bash
linux-cleanup --list-targets
realpath <the path that was rejected>
```

Casi siempre es una caché enlazada simbólicamente dentro de un directorio protegido. **Corrija el enlace, no la herramienta**: la herramienta está haciendo exactamente su trabajo. Por diseño, no existe ninguna opción para saltárselo.

Dos mensajes relacionados:

```text
✗ REFUSE: unsafe path: '/home/you'            # $HOME o / a secas
✗ REFUSE: shell-init / history file: …        # .bashrc, .zshrc y similares
```

## TUI mode needs whiptail or dialog {#tui-mode-needs-whiptail-or-dialog}

**Causa.** Se ejecutó `--tui` sin tener instalado ninguno de los dos.

**Solución.** Instale uno o acepte el menú de la CLI que se ofrece como alternativa.

```bash
sudo apt install whiptail     # Debian / Ubuntu
sudo dnf install newt         # Fedora / RHEL
sudo pacman -S libnewt        # Arch
```

**Comprobación.** `command -v whiptail` y vuelva a ejecutar. Vea [TUI](./modes/tui.md).

## export requires jq {#export-requires-jq}

**Causa.** `--export md`, `--export html` o una conversión en el gestor de informes sin `jq` instalado.

**Solución.**

```bash
sudo apt install jq
```

`jq` solo hace falta para convertir. Los registros JSON se siguen escribiendo en cada ejecución sin él. Vea [Informes](./modes/reports.md).

## command not found {#command-not-found}

**Causa.** Falta una dependencia necesaria o la tapa un alias incompatible. Es habitual en contenedores mínimos que traen BusyBox en lugar de GNU coreutils.

**Comprobación.**

```bash
linux-cleanup --self-test
```

Comprueba cada comando necesario e indica el primero que falta.

**Solución.** Instale los paquetes coreutils, findutils y gawk de su distribución. En Alpine:

```bash
apk add coreutils findutils bash
```

`realpath` es el más importante: es lo que hace que la [comprobación de rutas protegidas](./reference/protected-paths.md) sea segura ante enlaces simbólicos. Vea [Compatibilidad con distribuciones](./distro-support.md#minimal-containers).

## La tarea de cron se ejecuta pero no hace nada {#cron-entry-runs-but-does-nothing}

**Comprobación.**

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

**Causa.** Un `command not found` en el registro de cron significa que el `PATH` mínimo de cron (`/usr/bin:/bin`) no ve su instalación. Es el problema más común con cron.

**Solución.** Use una ruta absoluta en el crontab:

```bash
crontab -e
# Cambie:  0 3 * * 0 linux-cleanup --all-safe -y …
# Por:  0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y …
```

Encuentre la ruta correcta con `command -v linux-cleanup`. También puede poner una línea `PATH=` al principio del crontab. Vea [Alias y cron](./guides/alias-and-cron.md).

## $HOME is not set {#home-is-not-set}

```text
✗ $HOME is not set
```

**Causa.** Se ejecuta en un contexto que no define `$HOME`: algunas imágenes de Docker, algunos ejecutores de CI.

**Solución.**

```bash
HOME=/root linux-cleanup --scan
```

O expórtela una vez para la sesión. El script se detiene en lugar de adivinar, a propósito: un `$HOME` equivocado haría que todas las comprobaciones de rutas se evaluaran sobre el árbol equivocado.

## El análisis o --node-modules parece colgado {#scan-or---node-modules-seems-to-hang}

**Causa.** `find` está recorriendo miles de directorios dentro de `$HOME`. En un disco mecánico la primera ejecución tarda de uno a tres minutos.

**Comprobación.** Mire el registro en lugar de la terminal:

```bash
tail -f ~/.linux-cleanup/logs/cleanup-*.log
```

Si aparecen líneas nuevas cada cinco a diez segundos, está funcionando.

**Solución.** Tenga paciencia en la primera ejecución; las siguientes son más rápidas gracias a los metadatos de directorios en caché. Si la misma ruta se atasca siempre más de cinco minutos, sospeche de un bucle de enlaces simbólicos o de un montaje de red o FUSE que no responde, e [infórmelo](./guides/send-a-bug-report.md).

## El uso del disco aumentó durante la sesión {#disk-usage-grew-during-the-session}

**Causa.** La recuperación que se muestra es una diferencia de `df` de todo el equipo. Otro proceso (una compilación, una actualización de paquetes, la rotación de registros, un IDE reindexando) escribió más durante la sesión de lo que liberó la limpieza.

**No es un error** y no significa que la limpieza fallara. Revise lo que informaron los propios pasos:

```bash
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

**Solución.** Vuelva a ejecutar `--scan` cuando el equipo esté tranquilo para ver la situación real.

## apt update falla después de --system {#apt-update-fails-after---system}

**Causa.** Es raro. `apt clean` no rompe `apt update`, pero la limpieza pudo coincidir con otra operación de apt que tenía un bloqueo.

**Comprobación.**

```bash
sudo apt update 2>&1 | tail -20
```

**Solución.**

```bash
sudo rm -f /var/lib/apt/lists/lock /var/cache/apt/archives/lock /var/lib/dpkg/lock-frontend
sudo apt update
```

Hágalo solo cuando de verdad no haya ningún proceso de apt en marcha: primero `ps aux | grep -i apt`.

## VS Code indica que falta una extensión {#vs-code-reports-a-missing-extension}

**Causa.** Normalmente es lo esperado: se eliminó una versión sustituida mientras el editor todavía la tenía referenciada.

**Solución.** Recargue la ventana: `Ctrl+Shift+P` → **Developer: Reload Window**.

**Compruebe** que la versión actual sigue ahí:

```bash
ls ~/.vscode/extensions/ | grep <extension-name>
```

Si la versión *actual* ha desaparecido de verdad, indica un error en la detección de la versión más alta. Reinstálela e [infórmelo](./guides/send-a-bug-report.md):

```bash
code --install-extension <publisher>.<name>
```

## Apareció un paquete de fallo pero no vi ningún fallo {#a-crash-bundle-appeared-but-i-saw-no-crash}

**Causa.** El script terminó con un código distinto de cero en un punto inesperado: un `find` en segundo plano terminado por el OOM killer, o una tubería rota.

**Solución.** Lea el código de salida en el manifiesto del paquete:

```bash
tar -xzOf ~/.linux-cleanup/feedback/crash-*.tar.gz --wildcards '*MANIFEST*'
```

`137` es el OOM killer, `141` es SIGPIPE y `139` un fallo de segmentación. Vea [Códigos de salida](./reference/exit-codes.md). Cualquiera de ellos merece un informe.

## No se encuentra el alias cleanup después de --install-alias {#alias-cleanup-not-found-after---install-alias}

**Causa.** No se ha vuelto a leer el archivo rc de la shell.

**Solución.**

```bash
source ~/.bashrc      # o ~/.zshrc
```

O abra una terminal nueva.

## Se ejecuta la versión equivocada {#wrong-version-running}

**Comprobación.**

```bash
command -v linux-cleanup
linux-cleanup --version
```

**Causa.** Una instalación global antigua que tapa una caché de `npx` más nueva, o un hash de comandos de la shell desactualizado.

**Solución.**

```bash
npm uninstall -g linux-cleanup
npm install -g linux-cleanup@latest
hash -r
linux-cleanup --version
```

Consulte el [paquete de npm](https://www.npmjs.com/package/linux-cleanup) para ver la versión publicada actual. Revise el [registro de cambios](./changelog.md) para ver qué cambió desde su copia instalada.

## Sigue sin resolverse {#still-stuck}

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

Revise el paquete y envíelo por correo con una breve descripción de lo que esperaba y lo que ocurrió. Vea [Enviar un informe de error](./guides/send-a-bug-report.md).
