---
title: Descargas incompletas o huérfanas
description: Busque y elimine archivos de descargas incompletas abandonados (.crdownload, .part y .fdmdownload) que dejan las transferencias interrumpidas de navegadores y gestores de descargas.
sidebar_position: 10
---

# Descargas incompletas o huérfanas

**`--partials` busca archivos de descargas incompletas abandonados y ofrece eliminarlos.** Son los archivos provisionales que escribe un navegador o un gestor de descargas durante la transferencia y que olvida limpiar cuando esta se interrumpe.

```bash
linux-cleanup --partials
```

## Qué busca {#what-it-looks-for}

| Extensión | La escribe |
|---|---|
| `.crdownload` | Chrome, Chromium, Brave, Edge, Vivaldi |
| `.part` | Firefox, wget, aria2 |
| `.fdmdownload` | Free Download Manager |

Un archivo incompleto contiene los bytes que llegaron antes de que se cortara la transferencia: a veces unos pocos kilobytes, a veces casi toda una ISO de varios gigabytes.

## Solo interactivo {#interactive-only}

Confirmación por archivo, `--yes` se ignora y no forma parte de [`--all-safe`](./all-safe.md). Vea el [filtro 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

## Lo que le cuesta eliminar uno {#what-deleting-one-costs-you}

:::caution Un archivo incompleto puede reanudarse todavía, pero normalmente no
Para reanudarlo hace falta la sesión de descarga original: la entrada del gestor de descargas del navegador, la URL de origen y un servidor que admita peticiones por rangos. Si el navegador se ha reiniciado o se ha borrado la entrada de la descarga, el archivo incompleto ya no se puede reanudar y es puro desperdicio.

El archivo por sí solo nunca sirve: un archivo comprimido a medio descargar no se abre. Así que la única pregunta práctica es si todavía piensa reanudarlo.
:::

Compruebe antes de aceptar uno grande:

- Abra la página de descargas del navegador y busque una entrada en pausa o fallida con el mismo nombre de archivo
- Si la hay, reanúdela ahí en lugar de eliminar el archivo incompleto
- Si no la hay, el archivo incompleto está huérfano y se puede eliminar sin riesgo

## Una descarga activa también aparecerá aquí {#an-active-download-will-show-up-here}

Una descarga que se está realizando *ahora mismo* también tiene un archivo `.crdownload` o `.part`. La herramienta no puede distinguir una transferencia en curso de una abandonada. Eliminar un archivo incompleto activo rompe la transferencia en curso, así que revise la página de descargas si tiene dudas, o ejecute este modo cuando no se esté descargando nada.

## En el recorrido guiado {#in-the-walkthrough}

Paso 6 del [recorrido guiado](./walkthrough.md).

## Siguiente {#next}

- [Archivos personales sin uso](./personal-stale-files.md): el modo interactivo relacionado
- [La eliminación es permanente](../safety/irreversibility.md)
