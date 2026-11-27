---
title: Rutas de salida
description: "Dónde escribe linux-cleanup sus registros, los registros JSON de sesión, los paquetes de depuración y los de fallo: estructura, valores por defecto según la instalación, conservación y permisos."
sidebar_position: 5
---

# Rutas de salida

**Toda la salida vive bajo una misma raíz de datos.** Cuál es depende de cómo instaló la herramienta, y ambas se pueden cambiar.

## Estructura {#layout}

```text
$DATA_HOME/
├── logs/
│   ├── cleanup-<YYYY-MM-DD_HHMMSS>.log     # uno por sesión
│   └── cron.log                             # lo amplía el cron semanal
├── reports/
│   ├── report-<YYYY-MM-DD_HHMMSS>.json     # registro del recorrido guiado, salvo que esté desactivado
│   ├── report-<YYYY-MM-DD_HHMMSS>.md       # lo crea --export md
│   └── report-<YYYY-MM-DD_HHMMSS>.html     # lo crea --export html
└── feedback/
    ├── debug-bundle-<YYYY-MM-DD_HHMMSS>.tar.gz   # lo crea --debug-bundle
    └── crash-<YYYY-MM-DD_HHMMSS>.tar.gz          # se crea automáticamente tras un fallo
```

## Valores por defecto según la instalación {#per-install-defaults}

| Instalado con | `$DATA_HOME` |
|---|---|
| `npx linux-cleanup` | `~/.linux-cleanup/` |
| `npm install -g linux-cleanup` | `~/.linux-cleanup/` |
| `git clone` | El propio directorio del clon |

La diferencia es deliberada. `npx` ejecuta el paquete desde un directorio temporal de la caché de npm que se vacía, así que lo escrito allí se perdería; `~/.linux-cleanup/` se conserva entre ejecuciones. Un clon ya es una ubicación permanente, así que la salida se queda junto al código.

Cambie cualquiera de las dos con [`LINUX_CLEANUP_DATA_HOME`](./environment-variables.md), o los directorios de registros y de informes por separado.

## Conservación {#retention}

| Ruta | Limpieza automática | Notas |
|---|---|---|
| `logs/cleanup-*.log` | Solo con `--cleanup-logs` | Esa opción elimina al terminar el registro de **esta ejecución**. Los anteriores se quedan |
| `logs/cron.log` | Nunca | Nunca se rota. Rótelo usted si crece |
| `reports/*.json` | **Nunca** | El historial de auditoría duradero |
| `reports/*.md`, `*.html` | **Nunca** | Se crean a petición y se eliminan a petición |
| `feedback/*.tar.gz` | **Nunca** | Usted decide cuándo ya no hacen falta |

`--cleanup-logs` es la única eliminación automática que la herramienta hace sobre su propia salida, y solo toca archivos `.log`.

## Tamaño y conservación {#size-and-retention}

El tamaño de los registros y paquetes depende de las rutas y eventos de una ejecución. Revise lo acumulado antes de eliminar registros antiguos. Para aclarar archivos antiguos a propósito:

```bash
find ~/.linux-cleanup/logs/    -name 'cleanup-*.log' -mtime +90 -delete
find ~/.linux-cleanup/reports/ -name 'report-*'      -mtime +90 -delete
```

Rotar el registro de cron:

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## Permisos {#permissions}

Los archivos pertenecen al usuario que ejecuta la herramienta. Compruebe sus permisos efectivos con `stat` en su equipo; importan tanto los permisos de directorio configurados por la herramienta como el umask del proceso. No comparta un registro o un paquete sin leerlo antes.

## Qué contienen estos archivos {#what-these-files-contain}

:::caution Los registros y los paquetes contienen sus rutas
Un registro de sesión nombra cada ruta tocada, así que contiene nombres de directorios de su equipo: nombres de proyectos y, a veces, nombres de archivos de `~/Downloads`.

Es solo local y nunca se transmite, pero revise un paquete antes de enviarlo por correo:

```bash
tar -tzf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz
```

Vea [Enviar un informe de error](../guides/send-a-bug-report.md).
:::

Nada de esto contiene el **contenido** de los archivos: solo rutas, tamaños y marcas de tiempo. Son registros de lo que pasó, no copias de lo eliminado. Vea [Recuperación](../recovery.md).

## Siguiente {#next}

- [Variables de entorno](./environment-variables.md) — cambiar estas ubicaciones
- [Esquema del informe](./report-schema.md) — la estructura JSON
