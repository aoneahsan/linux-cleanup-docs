---
sidebar_position: 10
title: linux-cleanup y Czkawka
description: "En qué se diferencian linux-cleanup y Czkawka, según sus propias páginas, revisado el 2026-11-22."
---

# linux-cleanup y Czkawka

*Revisado el 2026-11-22 con la <a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">página propia de Czkawka</a>.*

**Qué es:** Una utilidad para encontrar duplicados, carpetas vacías, medios similares y otro desorden.

**Precio allí:** No se indica en las páginas que revisamos. **Precio aquí:** La línea de comandos es gratuita bajo la licencia MIT. Los planes de la aplicación de escritorio están en la [página de precios](https://linux-cleanup.aoneahsan.com/es/pricing).

| | linux-cleanup | Czkawka |
|---|---|---|
| Interfaz de línea de comandos | Sí | Sí (<a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">fuente</a>) |
| Vista previa antes de eliminar | Sí | No se indica en las páginas que revisamos |
| Simulación | Sí | No se indica en las páginas que revisamos |
| Limpieza de caché | Sí | No se indica en las páginas que revisamos |
| Búsqueda de archivos duplicados | En parte | Sí (<a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">fuente</a>) |

## A quién le sirve más Czkawka {#who-is-better-served-by-czkawka}

Elija Czkawka para encontrar archivos personales duplicados o similares; linux-cleanup no pretende hacer ese trabajo.

## Dónde linux-cleanup va por delante {#where-linux-cleanup-is-ahead}

Elija linux-cleanup para cachés, registros y archivos temporales que superan un umbral de inactividad; las propias páginas de Czkawka describen la búsqueda de archivos duplicados y similares.

## Por dónde empezar aquí {#where-to-start-here}

No hay importación de una herramienta a otra: cada una mantiene sus propias reglas. Para ver lo que haría linux-cleanup en su equipo, empiece por [Revisar antes de eliminar](../safety/preview-first.md) y ejecute `npx -y linux-cleanup --all-safe --yes --dry-run`, que no elimina nada.
