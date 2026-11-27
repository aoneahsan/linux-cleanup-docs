---
title: Revisión del directorio personal
description: "Una lista de solo lectura de las 20 entradas más grandes de su directorio personal, pueda o no limpiarlas linux-cleanup: la forma más rápida de saber qué ocupa de verdad el disco."
sidebar_position: 13
---

# Revisión del directorio personal

**`--audit` lista las 20 entradas más grandes de `$HOME`, ordenadas por tamaño.** No elimina nada y le da igual si la herramienta puede limpiar lo que encuentra.

```bash
linux-cleanup --audit
```

## En qué se diferencia de `--scan` {#why-this-is-different-from---scan}

[`--scan`](./scan.md) mide las categorías que linux-cleanup sabe limpiar. `--audit` mide su directorio personal, sin más.

Esa diferencia es lo importante. Si lo que de verdad llenó el disco es una imagen de máquina virtual de 60 GB, un conjunto de datos descargado o una biblioteca de Steam, `--scan` nunca lo mencionará y `--audit` lo pondrá al principio de la lista.

| | `--audit` | `--scan` |
|---|---|---|
| Alcance | Todo en `$HOME` | Solo categorías que se pueden limpiar |
| Responde a | ¿Qué ocupa mi disco? | ¿Qué puede recuperar esta herramienta? |
| Escribe un informe JSON de la sesión | No | No |
| Elimina | Nunca | Nunca |

## El flujo habitual {#the-usual-workflow}

```bash
linux-cleanup --audit    # ¿qué es grande?
linux-cleanup --scan     # ¿qué puede recuperar esta herramienta?
```

Si las primeras entradas de la revisión aparecen en el análisis, la herramienta puede ayudar. Si no, ha aprendido algo más útil: el espacio está en un sitio al que esta herramienta no llega, y puede ocuparse de él directamente.

Cosas grandes habituales que linux-cleanup **no** limpiará:

- Imágenes de máquinas virtuales y almacenamiento de contenedores (`~/.local/share/libvirt`, `~/.local/share/docker`)
- Bibliotecas de juegos (Steam, Lutris)
- Conjuntos de datos, pesos de modelos, bibliotecas multimedia
- Cualquier cosa en `~/Documents`, `~/Pictures`, `~/Music`, `~/Videos`: todas [protegidas](../reference/protected-paths.md)

## Investigar un hallazgo {#following-up-on-a-finding}

```bash
du -sh ~/.local/share/*      | sort -rh | head -20
du -sh ~/*                   | sort -rh | head -20
```

`--audit` es la primera pasada rápida; `du` afina una vez que sabe dónde mirar.

## Siguiente {#next}

- [Análisis](./scan.md): lo que la herramienta puede recuperar
- [Recuperar el máximo de espacio](../guides/reclaim-the-most-space.md)
