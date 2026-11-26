---
sidebar_position: 3
title: Simulación, ejecución real, recibo
description: "El primer inicio y luego el único camino que sigue cada limpieza en la aplicación de escritorio: simulación, confirmación, ejecución real, recibo."
---

# Simulación, ejecución real, recibo

Cada limpieza en la aplicación de escritorio sigue los mismos cuatro pasos, en el mismo orden. Ninguno se puede saltar.

## Primer inicio {#first-launch}

La primera vez que se abre, la aplicación muestra tres pasos breves: qué es la aplicación, qué carpetas rechaza siempre la CLI y un **Iniciar sesión con Google** opcional. Cada uno se puede saltar y volver a abrir desde **Ayuda**. Nunca hace falta iniciar sesión para limpiar; hacerlo añade ejecuciones reales al mes y mantiene el número de ejecuciones entre sus equipos ([Cuentas y planes](./accounts-and-plans.md)).

Al iniciar sesión se abre Google en su navegador. Cuando termina allí, el navegador devuelve el resultado a la aplicación a través de `127.0.0.1` y la ventana de la aplicación vuelve a tomar el control.

## 1. Simulación {#1-dry-run}

**Iniciar una simulación** ejecuta la limpieza totalmente segura con `--dry-run`. No elimina nada en ningún lugar. Después, la pantalla lista cada ruta que la limpieza eliminaría, su tamaño medido y el motivo, y cada ruta que la CLI rechazó y conservó, con la razón. **Guardar la lista como JSON** escribe esa lista en un archivo de este equipo.

Un botón con borde discontinuo en la aplicación es siempre una simulación. Un botón relleno elimina archivos.

## 2. Confirmación {#2-confirm}

**Revisar y ejecutar** abre la única pantalla que inicia una ejecución real. Repite lo que encontró la simulación, indica cuántas ejecuciones reales le quedan este mes en su plan y advierte de que la eliminación es permanente. **Ejecutar la limpieza ahora** no está disponible mientras:

- la simulación tenga más de un día (vuelva a ejecutarla primero);
- otra ejecución siga en curso;
- no queden ejecuciones reales este mes.

## 3. Ejecución real {#3-real-run}

La CLI informa de cada ruta a medida que la elimina, y la pantalla la sigue. Vuelve a comprobar cada ruta antes de eliminarla, así que lo que haya cambiado desde la simulación se juzga tal como está ahora. **Cancelar después de este elemento** se detiene cuando termina el paso en curso; lo que ya se eliminó sigue eliminado.

## 4. Recibo {#4-receipt}

Cada ejecución termina con un recibo, también las simulaciones: espacio libre antes y después, cada paso marcado como completado, omitido o fallido, y cómo terminó la ejecución. Una ejecución cancelada o interrumpida marca como fallido su paso sin terminar. Los recibos se quedan en este equipo en **Recibos e historial**, junto a los informes y registros propios de la CLI en `~/.linux-cleanup/`. Con la sesión iniciada en un plan con sincronización del historial, la aplicación también envía los números del recibo, nunca una ruta ni un nombre de archivo ([Qué sale de su equipo](./overview.md#what-leaves-your-computer)).
