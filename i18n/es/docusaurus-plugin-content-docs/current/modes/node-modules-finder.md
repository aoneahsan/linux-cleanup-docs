---
title: Buscador de node_modules abandonados
description: Busque directorios node_modules en proyectos sin tocar durante N días o más y elimínelos de forma interactiva. A menudo es lo que más espacio libera en el equipo de un desarrollador.
tags: [node-modules, projects, interactive, disk-space, modes]
sidebar_position: 8
---

# Buscador de node_modules abandonados

**`--node-modules` busca directorios `node_modules` en proyectos que no ha tocado en `--days` días o más, y ofrece eliminar cada uno.** El espacio disponible depende de los proyectos que haya en este equipo.

```bash
linux-cleanup --node-modules          # 100 días de forma predeterminada
linux-cleanup --node-modules -d 90
```

## Solo interactivo {#interactive-only}

Este modo exige confirmación por proyecto e **ignora `--yes`**. No forma parte de [`--all-safe`](./all-safe.md) y no se puede ejecutar sin supervisión. Vea el [filtro 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

## Qué busca {#what-it-looks-for}

Recorre las raíces de sus proyectos en busca de directorios `node_modules` cuyo proyecto lleve sin usarse más allá del umbral, e informa de cada uno con su tamaño y sus días sin uso. Los `node_modules` anidados dentro de un directorio ya listado no se cuentan aparte.

Las raíces de proyectos se configuran con `project-roots.txt` dentro de `$XDG_CONFIG_HOME` (`~/.config` de forma predeterminada). Vea [Variables de entorno](../reference/environment-variables.md).

## Por qué suele ser seguro {#why-this-is-usually-safe}

`node_modules` es lo más fiablemente regenerable del equipo de un desarrollador: `yarn install` o `npm install` lo reconstruyen a partir del archivo de bloqueo.

Dos matices que conviene conocer antes de aceptarlo todo:

:::caution Dos formas en que todavía puede costarle
**Una dependencia parcheada.** Si editó un archivo dentro de `node_modules` directamente en lugar de con `patch-package` o un parche de yarn, esa edición no existe en ningún otro sitio. No está en ningún registro ni en su archivo de bloqueo.

**Sin archivo de bloqueo, sin red.** Reinstalar requiere poder llegar al registro y que exista el archivo de bloqueo. Un proyecto sin archivo de bloqueo confirmado puede no resolver el mismo árbol de dependencias, y un equipo aislado de la red puede no resolver nada.
:::

Ninguna de las dos es habitual, y la herramienta no puede detectar ninguna. Si alguna afecta a un proyecto de la lista, rechace ese.

## Lo que no toca {#what-it-does-not-touch}

- El código fuente del proyecto: solo el directorio `node_modules` que contiene
- Los archivos de bloqueo, `package.json` ni nada más del proyecto
- Los proyectos tocados dentro del umbral
- Nada de la [lista de rutas protegidas](../reference/protected-paths.md)

## Recuperar de forma agresiva {#reclaiming-aggressively}

```bash
linux-cleanup --node-modules -d 30
```

Bajar el umbral amplía la lista de candidatos. Con 30 días empezará a ver proyectos en los que todavía trabaja de vez en cuando, así que lea la lista en lugar de aceptarla en bloque: el coste de un error es una reinstalación, que es pequeño pero no gratis.

## En el recorrido guiado {#in-the-walkthrough}

Se ejecuta como paso 5 del [recorrido guiado](./walkthrough.md), con las mismas preguntas por proyecto.

## Siguiente {#next}

- [Recuperar el máximo de espacio](../guides/reclaim-the-most-space.md)
- [Protecciones](../safety/guards.md)
