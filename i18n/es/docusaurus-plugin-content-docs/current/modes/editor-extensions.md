---
title: Extensiones de editores
description: Elimine las versiones sustituidas de extensiones de VS Code y Cursor (las copias antiguas que quedan al actualizarse una extensión), sujeto a una comprobación de sustitución y al filtro de inactividad.
tags: [vscode, cursor, extensions, editor, modes]
sidebar_position: 11
---

# Extensiones de editores

**`--editor-ext` elimina las versiones sustituidas de extensiones de VS Code y Cursor.** Cuando una extensión se actualiza, el directorio de la versión antigua suele quedarse en el disco. En un equipo con muchas extensiones y unos años de actualizaciones, esto acumula cientos de megabytes.

```bash
linux-cleanup --editor-ext
```

## Las dos condiciones {#the-two-conditions}

Un directorio de versión solo es candidato cuando se cumplen **ambas**:

1. **Existe una versión más nueva de la misma extensión**: la versión actual nunca es candidata
2. **Esa versión antigua lleva sin usarse `--days` o más** (100 de forma predeterminada)

La segunda condición se añadió en la [1.2.1](../changelog.md#121--2026-05-10). Antes bastaba con estar sustituida, lo que eliminaba versiones antiguas que había cargado hacía poco. La salida muestra los días sin uso de cada versión, para que vea por qué se conservó algo.

## Lo que no toca {#what-it-does-not-touch}

- La versión actual de cualquier extensión
- La configuración, los atajos de teclado o el estado del espacio de trabajo de las extensiones
- Nada de `~/.config`: todo ese árbol está [protegido](../reference/protected-paths.md)
- Extensiones de editores que no sean VS Code ni Cursor

## Después de ejecutarlo {#after-running-it}

Si VS Code muestra un aviso de extensión ausente, recargue la ventana: `Ctrl+Shift+P` → **Developer: Reload Window**. El editor tiene una referencia a un directorio que ya no existe.

Si una extensión ha desaparecido de verdad (lo que significaría que la detección de la «versión más alta» identificó mal la actual), reinstálela y, por favor, [informe del error](../guides/send-a-bug-report.md):

```bash
code --install-extension <publisher>.<name>
```

## Cuánto se espera recuperar {#expected-reclaim}

El tamaño depende de las versiones sustituidas instaladas en este equipo. Use un análisis para revisar el directorio actual antes de decidir si lo limpia.

## En el recorrido guiado y en la limpieza totalmente segura {#in-the-walkthrough-and-all-safe}

Se ejecuta como paso 4 del [recorrido guiado](./walkthrough.md) y está incluido en [`--all-safe`](./all-safe.md), ya que solo elimina copias regenerables y sustituidas.

## Siguiente {#next}

- [El filtro de inactividad](../safety/guards.md#guard-2--the-staleness-gate)
- [Resumen de modos](./overview.md)
