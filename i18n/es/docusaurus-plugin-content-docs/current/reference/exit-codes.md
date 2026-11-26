---
title: Códigos de salida
description: Qué significa cada código de salida de linux-cleanup, cuáles generan automáticamente un paquete de fallo y cómo actuar según ellos desde un script o una tarea de cron.
tags: [exit-codes, scripting, cron, crash-bundle, reference]
sidebar_position: 6
---

# Códigos de salida

**linux-cleanup sigue la convención de Unix: `0` es éxito y cualquier otro valor es un problema.** Algunos códigos distintos de cero son esperables y, a propósito, no se tratan como fallos.

## Códigos {#codes}

| Código | Significado | Paquete de fallo |
|---|---|---|
| `0` | Ejecución correcta. Cada acción pedida se completó o se rechazó | No |
| `1` | Fallo genérico: se incumplió un invariante. Poco frecuente | Sí |
| `2` | Error al analizar los argumentos. Se imprime la ayuda | No |
| `3` | El registro público de versiones exige actualizar | No |
| `127` | Comando no encontrado: falta una dependencia necesaria | Sí |
| `130` | Interrumpido con `Ctrl-C` (SIGINT) | No |
| `137` | Terminado por SIGKILL: normalmente el OOM killer o `kill -9` | Sí |
| `139` | Fallo de segmentación. No debería ocurrir en bash puro | Sí |
| `143` | Terminado por SIGTERM | No |
| cualquier otro distinto de cero | Fallo interno inesperado | Sí |

Una opción desconocida sale con `2` antes de limpiar. `--dry-run` está disponible: recorre el modo elegido sin eliminar archivos. Vea [Revisar antes de eliminar](../safety/preview-first.md).

## Cómo decide la trampa de fallos {#how-the-crash-trap-decides}

La trampa EXIT añadida en la [1.3.0](../changelog.md#130--2026-05-10) evalúa en este orden:

1. El código de salida es `0`, **o** el script marcó su indicador interno de finalización → sin paquete
2. El código de salida es `130` (`Ctrl-C`) o `143` (SIGTERM) → sin paquete. Que el usuario lo detenga no es un fallo
3. El código de salida es `2` (análisis de argumentos) → sin paquete. El script mostró la ayuda y se detuvo a propósito
4. Cualquier otro caso → escribe `crash-<timestamp>.tar.gz` en `~/.linux-cleanup/feedback/`

El paquete contiene el registro activo de la sesión, el registro JSON más reciente y un breve manifiesto del sistema. Se queda en su equipo: **no se envía nada**. La herramienta imprime la ruta para que lo revise y decida si lo envía por correo.

Vea [Enviar un informe de error](../guides/send-a-bug-report.md).

## Actuar según el código {#branching-on-the-code}

```bash
if linux-cleanup --scan; then
  echo "análisis correcto"
else
  case $? in
    2)   echo "opción incorrecta" ;;
    127) echo "falta una dependencia: ejecute --self-test" ;;
    130) echo "interrumpido por el usuario" ;;
    *)   echo "fallo inesperado: revise ~/.linux-cleanup/feedback/" ;;
  esac
fi
```

## En cron {#in-cron}

```bash
linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1 || \
  echo "linux-cleanup exited $?" | mail -s "cleanup failed on $(hostname)" you@example.com
```

Un código `127` en una tarea de cron casi siempre significa que el crontab usó el nombre del comando sin ruta y el `PATH` mínimo de cron no lo encontró. Use una ruta absoluta; vea [Solución de problemas](../troubleshooting.md#cron-entry-runs-but-does-nothing).

## Diagnosticar un código inesperado a partir de un paquete de fallo {#diagnosing-an-unexpected-code-from-a-crash-bundle}

El manifiesto del paquete registra el código de salida. Los más comunes:

| Código | Causa habitual |
|---|---|
| `137` | El OOM killer (falta de memoria). Normalmente un `find` sobre un árbol enorme |
| `141` | SIGPIPE: una tubería se cerró antes de tiempo, a menudo al salir un `tee` o un paginador |
| `139` | Fallo de segmentación: aquí no debería ocurrir nunca; infórmelo |
| `127` | Falta una dependencia. Ejecute `--self-test` para identificarla |

## Siguiente {#next}

- [Enviar un informe de error](../guides/send-a-bug-report.md)
- [Solución de problemas](../troubleshooting.md)
