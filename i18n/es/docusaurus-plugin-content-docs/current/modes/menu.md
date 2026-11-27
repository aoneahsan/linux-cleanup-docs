---
title: Menú
description: El menú numerado que permite ejecutar una sola categoría de linux-cleanup cada vez en lugar del recorrido completo.
sidebar_position: 4
---

# Menú

**`--menu` imprime una lista numerada de todas las categorías y ejecuta la que elija.** Úselo cuando sepa lo que quiere y no necesite el recorrido de diez pasos.

```bash
linux-cleanup --menu     # o: -m, -i, --interactive
```

## En qué se diferencia del recorrido guiado {#how-it-differs-from-the-walkthrough}

| | Menú | [Recorrido guiado](./walkthrough.md) |
|---|---|---|
| Orden | Lo elige usted | Fijo, diez pasos |
| Alcance | Una categoría por elección | Todo, en secuencia |
| Repetición | Vuelve al menú al terminar | Llega hasta el final |
| Informe | Por acción | Un informe de sesión |
| Ideal para | Limpiezas concretas | Primeras ejecuciones, limpiezas completas |

El modelo de seguridad es idéntico. Cada categoría se comporta exactamente igual que en el recorrido: se aplican la [lista de rutas permitidas](../safety/guards.md#guard-1--the-path-allowlist), el [filtro de inactividad](../safety/guards.md#guard-2--the-staleness-gate) y la confirmación por objetivo. Elegir una categoría de datos personales en el menú sigue dando preguntas por entrada, y `--yes` sigue sin tener efecto en ella.

## Las opciones siguen funcionando {#options-still-apply}

```bash
linux-cleanup --menu -d 30        # umbral de 30 días para lo que elija
linux-cleanup --menu --purge-all  # filtro de inactividad desactivado
linux-cleanup --menu --no-color   # salida sin formato
```

## Cuándo usar la TUI {#when-to-use-the-tui-instead}

[`--tui`](./tui.md) es el mismo menú mostrado como un cuadro de whiptail o dialog. Necesita uno de ellos instalado; `--menu` no necesita nada más que bash y funciona con cualquier conexión, incluida una terminal sencilla o una sesión `ssh -T` donde un cuadro a pantalla completa daría problemas.

## Siguiente {#next}

- [TUI](./tui.md): la versión visual
- [Resumen de modos](./overview.md): todas las categorías que lista el menú
