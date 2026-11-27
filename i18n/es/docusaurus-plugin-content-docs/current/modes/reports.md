---
title: Informes
description: El recorrido guiado puede escribir un registro JSON de la sesión. Liste, vea, convierta a Markdown o HTML y exporte esos registros.
sidebar_position: 15
---

# Informes

**El recorrido guiado escribe un registro JSON de la sesión** en `~/.linux-cleanup/reports/report-<timestamp>.json`, salvo que se indique `--no-report` o `--dry-run`. Los demás modos no crean ese registro. Los registros existentes no se eliminan automáticamente.

Markdown y HTML son conversiones opcionales que se generan cuando se piden.

```bash
linux-cleanup --reports              # gestor interactivo
linux-cleanup --export both latest   # conversión no interactiva
```

## Qué contiene un registro de sesión {#what-a-session-record-contains}

| Sección | Contiene |
|---|---|
| `schema_version` | Actualmente `1` |
| `credits` | Nombre, versión, página web, licencia y datos del autor de la herramienta |
| `meta` | Marcas de tiempo, duración, equipo, usuario, modo, umbral de inactividad, ruta del registro, lanzador |
| `disk` | Uso del sistema de archivos antes y después |
| `memory` | Uso de memoria antes y después |
| `steps` | Una entrada por paso: número, título, estado, bytes liberados |
| `totals` | Total de bytes recuperados, total legible, pasos ejecutados y omitidos |

Referencia completa campo por campo: [Esquema del informe](../reference/report-schema.md).

## El gestor interactivo {#the-interactive-manager}

```bash
linux-cleanup --reports
```

Lista las sesiones anteriores y le permite ver una, convertirla a Markdown o HTML, abrir el HTML en un navegador o eliminarla.

Las opciones de conversión se ocultan si `jq` no está instalado; vea [más abajo](#jq-is-required-for-conversion).

## Exportar {#exporting}

Sin preguntas, para scripts y costumbres:

```bash
linux-cleanup --export both latest   # Markdown + HTML del registro más reciente
linux-cleanup --export html all      # todos los registros a HTML
linux-cleanup --export md 3          # el registro n.º 3 a Markdown
```

| Argumento | Acepta |
|---|---|
| Formato | `md`, `html`, `both` |
| Identificador | un número de registro, `latest` o `all` |

La salida queda junto al JSON, con la misma marca de tiempo en el nombre del archivo. El HTML es autónomo (CSS incrustado, compatible con el modo oscuro, sin recursos externos), así que se puede enviar por correo o archivar como un único archivo.

## Para convertir hace falta `jq` {#jq-is-required-for-conversion}

:::note El JSON siempre se escribe; la conversión es la parte opcional
Sin `jq`, un recorrido guiado puede seguir generando su registro JSON. Solo dejan de estar disponibles las exportaciones a Markdown y HTML, y el paso 10 del recorrido se registra como `skipped (jq missing)`.

```bash
sudo apt install jq      # Debian / Ubuntu
sudo dnf install jq      # Fedora / RHEL
sudo pacman -S jq        # Arch
```
:::

El HTML generado escapa cada valor procedente del JSON mediante el filtro `@html` de `jq`, de modo que una entrada mal formada no puede inyectar marcado en la página.

## Consultar el JSON directamente {#querying-the-json-directly}

El JSON está pensado para que lo lean las herramientas:

```bash
# Total recuperado en la sesión más reciente
jq '.totals.total_reclaimed_human' ~/.linux-cleanup/reports/report-*.json | tail -1

# Cada paso que de verdad se ejecutó en la sesión más reciente
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

# Lo recuperado en todas las sesiones registradas
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## Conservación {#retention}

Estos registros **nunca** se eliminan automáticamente, ni siquiera con `--cleanup-logs`, que solo elimina el archivo de registro de la ejecución actual.

Para depurarlos usted mismo:

```bash
find ~/.linux-cleanup/reports/ -name 'report-*' -mtime +90 -delete
```

Para no generarlo en una sola ejecución, use `--no-report`; el registro de la sesión se sigue escribiendo.

## Son registros, no copias de seguridad {#these-are-records-not-backups}

:::danger Un registro de sesión es un resumen de pasos, no una copia de seguridad
Registra pasos y observaciones del disco, no una lista completa de cada archivo eliminado. No contiene nada del contenido eliminado, y nada de lo que contiene puede restaurar nada. Su valor tras una eliminación no deseada es ayudarle a identificar qué restaurar desde su propia copia de seguridad o qué volver a descargar. Vea [Recuperación](../recovery.md).
:::

## Siguiente {#next}

- [Esquema del informe](../reference/report-schema.md): todos los campos
- [Rutas de salida](../reference/output-paths.md): dónde se guardan los archivos
- [Recuperación](../recovery.md): usar un registro de sesión después de un susto
