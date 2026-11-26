---
title: Alias de shell y cron semanal
description: Instale un alias de shell cleanup y una ejecución automática semanal totalmente segura, qué escribe cada uno y cómo volver a quitarlos.
tags: [guide, alias, cron, automation, scheduling, setup]
sidebar_position: 2
---

# Alias de shell y cron semanal

**Dos ayudantes de configuración que se usan una vez: un alias de shell `cleanup` y una ejecución automática semanal.** Ambos se deshacen con su opción de desinstalación correspondiente.

```bash
linux-cleanup --install-alias
linux-cleanup --install-cron
```

## El alias de shell {#the-shell-alias}

```bash
linux-cleanup --install-alias
```

Añade un alias `cleanup` a `~/.bash_aliases` o a `~/.zshrc`, según su shell. Después, escribir `cleanup` en cualquier lugar ejecuta la herramienta.

Recargue la shell o parecerá que el alias no existe:

```bash
source ~/.bashrc     # o ~/.zshrc
```

Quítelo con `linux-cleanup --uninstall-alias`.

:::note Los archivos de inicio de la shell están protegidos en la capa de eliminación
`.bashrc`, `.zshrc`, `.bash_aliases` y similares están en la [lista de nombres de archivo protegidos](../reference/protected-paths.md#protected-basenames), así que ningún modo de limpieza puede eliminar nunca uno de ellos, esté en la ruta que esté. El instalador del alias añade una línea; el desinstalador solo quita la suya.
:::

## La tarea semanal de cron {#the-weekly-cron-job}

```bash
linux-cleanup --install-cron
```

Programa `--all-safe -y` para **los domingos a las 03:00**, añadiendo la salida a `~/.linux-cleanup/logs/cron.log`. Requiere `crontab`.

Quítela con `linux-cleanup --uninstall-cron`.

### Por qué `--all-safe` es el modo adecuado para esto {#why---all-safe-is-the-right-mode-for-this}

Es el único modo al que se aplica `--yes`, y **no puede tocar datos personales**: los modos solo interactivos no forman parte de él e ignoran `--yes` por diseño. Así que una ejecución desatendida puede vaciar cachés y nunca puede eliminar un archivo de `~/Downloads`. Vea el [filtro 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

El [filtro de inactividad](../safety/guards.md#guard-2--the-staleness-gate) sigue aplicándose, así que los archivos usados recientemente sobreviven a cada pasada semanal.

## Escribir usted mismo la entrada del crontab {#writing-the-crontab-entry-yourself}

Para otro horario u otras opciones:

```bash
crontab -e
```

```bash
0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1
```

:::danger Use una ruta absoluta
Cron se ejecuta con un `PATH` mínimo, normalmente solo `/usr/bin:/bin`. Un `linux-cleanup` sin ruta no se encontrará si está en `~/.local/bin` o en un directorio de un gestor de versiones de Node, y la tarea fallará sin avisar cada semana.

Es el problema más común con las ejecuciones programadas. Encuentre su ruta con:

```bash
command -v linux-cleanup
```

O defina `PATH=` explícitamente al principio del crontab.
:::

| Opción | Por qué en cron |
|---|---|
| `--all-safe -y` | Desatendido, solo cachés |
| `--no-report` | Evita que se acumulen registros JSON, que **nunca** se eliminan solos |
| `--cleanup-logs` | Elimina el registro de esa ejecución al terminar |
| `-d 30` | Opcional: poda semanal más agresiva |

`--cleanup-logs` por sí solo no basta para mantener pequeño el directorio: nunca toca los registros de sesión. La opción que sí lo hace es `--no-report`.

:::caution No añada `--purge-all` a una tarea programada
Desatendido y sin filtro de inactividad significa que un recurso costoso puede desaparecer la semana antes de que lo necesite, sin que nadie lo vea. Reserve `--purge-all` para ejecuciones deliberadas y supervisadas. Vea [Recuperar el máximo de espacio](./reclaim-the-most-space.md).
:::

## Comprobar que se ejecutó {#checking-that-it-ran}

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

Si el registro muestra `command not found`, es el problema del `PATH` de arriba. Si el registro está vacío, la tarea nunca se disparó: compruebe que el demonio de cron está en marcha (`systemctl status cron` o `crond`).

El registro de cron **nunca se rota**. Rótelo usted cuando crezca:

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## Un temporizador de systemd en su lugar {#a-systemd-timer-instead}

Si prefiere temporizadores a cron, no hay nada específico de la herramienta: programe el mismo comando. A la herramienta no le importa ni sabe qué programador la ejecutó, y `--install-cron` es una comodidad, no un requisito.

## Quitar ambos {#removing-both}

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

Eliminación completa, incluido el paquete: [Desinstalar](./uninstall.md).
