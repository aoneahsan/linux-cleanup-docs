---
title: Instalación
description: Instale linux-cleanup de tres maneras (sin instalar con npx, globalmente con npm o clonando el repositorio) y compruebe la instalación antes de ejecutar nada destructivo.
sidebar_position: 2
---

# Instalación

**linux-cleanup se ofrece de tres maneras: `npx` sin instalar, una instalación global con `npm` o un `git clone`.** Las tres ejecutan el mismo script de Bash: el paquete de npm es un lanzador de Node mínimo que localiza `cleanup.sh` y dirige los registros y los informes a un directorio persistente.

:::info Compruebe la versión instalada
Ejecute `linux-cleanup --version` después de instalar o actualizar. El [registro de cambios](../changelog.md) recoge los cambios en la simulación y en los avisos de versión.
:::

## Opción 1: `npx`, sin instalar {#option-1--npx-no-install}

La forma más rápida de probarlo. No se añade nada a su `PATH` y no queda nada si decide no usarlo.

```bash
npx linux-cleanup --version
npx linux-cleanup --scan      # revisión de solo lectura
npx linux-cleanup             # recorrido guiado
```

`npx` descarga el paquete en un directorio temporal de la caché de npm. Sus registros e informes se escriben en `~/.linux-cleanup/`, **no** en el directorio temporal, así que sobreviven a la limpieza de la caché de npm y siguen ahí la próxima vez.

## Opción 2: instalación global con `npm` {#option-2--global-npm-install}

```bash
npm install -g linux-cleanup
linux-cleanup --version
```

Después, `linux-cleanup` está en su `PATH` en cualquier lugar. Los registros y los informes siguen yendo a `~/.linux-cleanup/`.

```bash
npm install -g linux-cleanup@latest   # actualizar
npm uninstall -g linux-cleanup        # eliminar
```

Desinstalar el paquete no elimina un alias de la shell ni una entrada de cron que haya instalado; vea [Desinstalar](../guides/uninstall.md) para la eliminación completa.

## Opción 3: `git clone` {#option-3--git-clone}

Para leer el código fuente, auditarlo o modificarlo. El contenido del repositorio es lo que se publica en npm.

```bash
git clone https://github.com/aoneahsan/linux-cleanup ~/linux-cleanup
cd ~/linux-cleanup
chmod +x cleanup.sh
./cleanup.sh --self-test
./cleanup.sh
```

La única diferencia de comportamiento: **un clon guarda su salida junto al código fuente**, en `<clone>/logs/`, `<clone>/reports/` y `<clone>/feedback/`, en lugar de en `~/.linux-cleanup/`. Ambas se pueden cambiar con `LINUX_CLEANUP_DATA_HOME`. Vea [Rutas de salida](../reference/output-paths.md).

El proyecto tiene licencia MIT, así que puede bifurcarlo y modificarlo.

## Compruebe antes de ejecutar nada destructivo {#verify-before-you-run-anything-destructive}

```bash
linux-cleanup --version      # confirma qué compilación tiene realmente
linux-cleanup --self-test    # comprobación de dependencias, sintaxis y protecciones
```

Una autocomprobación correcta termina con un mensaje de éxito. Verifica que la [protección de rutas](../safety/guards.md#guard-1--the-path-allowlist) rechaza de verdad `/`, `$HOME`, `~/Documents`, `~/.ssh` y `/etc`, y que no rechaza `~/.cache/yarn`. Cualquier verificación fallida termina con un código distinto de cero.

:::tip Ejecute `--self-test` después de cada actualización
Es la única comprobación que se ejecuta sobre el código que realmente tiene, no sobre la documentación. Tarda un segundo.
:::

## Qué forma de instalación elegir {#which-install-path-to-choose}

| Si usted… | Use |
|---|---|
| Quiere probarlo una vez | `npx` |
| Lo ejecutará con regularidad o desde cron | Instalación global con `npm` |
| Quiere leer o modificar el código | `git clone` |
| Está en un equipo sin Node.js | `git clone` |
| Necesita la salida junto al código | `git clone` |

Para cron en concreto, prefiera una instalación global y use una **ruta absoluta** en el crontab: cron se ejecuta con un `PATH` mínimo y no encontrará una instalación en `~/.local/bin`. Es el problema más común con cron; vea [Alias y cron](../guides/alias-and-cron.md).

## Lo que no hace la instalación {#what-installing-does-not-do}

- No crea un servicio del sistema, un demonio en segundo plano ni una tarea programada (salvo que lo pida)
- No hay agente de telemetría. Al iniciar, la CLI obtiene un registro público de versiones si hay conexión; sin conexión, continúa
- No cambia la configuración de la shell salvo que ejecute `--install-alias` o `--doctor`
- No crea archivos fuera del paquete y de `~/.linux-cleanup/`, y este último solo cuando lo ejecuta de verdad

## Siguiente {#next}

- [Inicio rápido](./quick-start.md): su primera limpieza
- [Qué elimina](../safety/what-it-deletes.md): léalo antes de la primera ejecución destructiva
- [Desinstalar](../guides/uninstall.md): eliminación completa, incluidos el alias y cron
