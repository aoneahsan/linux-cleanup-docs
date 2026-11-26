---
title: Recuperación
description: "Qué hacer tras una eliminación no deseada de linux-cleanup: revisar los registros disponibles, restaurar desde una copia o desde el origen y evitar más escrituras en disco cuando la recuperación importa."
tags: [recovery, data-loss, restore, undo, logs, reports]
sidebar_position: 91
---

# Recuperación

**linux-cleanup no tiene deshacer.** Esta página trata de averiguar qué se eliminó y cuáles son sus opciones reales.

:::danger Primero, deje de escribir en el disco
Si se eliminó algo irreemplazable y piensa intentar una recuperación por tallado de archivos, **deje de usar el sistema de archivos ahora**. Cada escritura reduce la posibilidad de recuperar datos desenlazados.

Esto solo se aplica a las [categorías realmente irreemplazables](#3-decide-what-is-actually-recoverable). Si es una caché, sáltelo: deje que la herramienta correspondiente la vuelva a descargar.
:::

## 1. Revise el registro disponible {#1-inspect-the-available-record}

Una ejecución puede dejar un registro local. Un recorrido guiado también puede dejar un registro JSON de la sesión, salvo que se hayan desactivado los informes. Ninguno es un registro completo archivo por archivo ni una copia de seguridad.

```bash
# El registro de sesión más reciente
less "$(ls -t ~/.linux-cleanup/logs/cleanup-*.log | head -1)"

# El último registro del recorrido guiado, si existe
jq '.' "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

Para buscar una ruta concreta en los registros conservados:

```bash
grep -rn 'the-filename-you-are-missing' ~/.linux-cleanup/logs/
```

Que no aparezca no demuestra que la herramienta no tocara ese archivo. Un ayudante puede informar de un directorio de caché entero o de un comando en lugar de cada archivo, y `--cleanup-logs` puede borrar el registro de una ejecución. Compruebe también el modo elegido y las raíces de destino.

Para limitarse a los pasos de una sola sesión:

```bash
jq '.steps[] | select(.status == "ran")' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

## 2. Confirme que no fue simplemente un rechazo {#2-confirm-it-was-not-simply-refused}

Los rechazos también se registran. Si encuentra una línea como esta, no se eliminó nada:

```text
✗ REFUSE: protected path: /home/you/Documents/notes
```

Vea [Rutas protegidas](./reference/protected-paths.md).

## 3. Decida qué se puede recuperar de verdad {#3-decide-what-is-actually-recoverable}

| Qué se eliminó | Recuperación |
|---|---|
| Caché de un gestor de paquetes | **Automática.** La próxima instalación la vuelve a descargar |
| Caché del navegador | **Automática.** Se reconstruye mientras navega |
| Caché de Gradle o distribución del wrapper | **Automática.** La próxima compilación la vuelve a obtener; la primera será lenta |
| Binarios de Cypress / Playwright | Vuelva a ejecutar el paso de instalación de esa herramienta |
| `node_modules` | `yarn install` o `npm install` en el proyecto |
| AVD de Android | Vuelva a crearlo en Android Studio. **La configuración del perfil se perdió**; la imagen del sistema se vuelve a descargar |
| Versión de una extensión de editor | Recargue la ventana del editor; reinstálela si de verdad falta |
| Caché de apt, registro del sistema, revisiones de snap | Se regeneran solos. No hay que hacer nada |
| **Archivo personal de `~/Downloads`** | **Solo desde su propia copia de seguridad**, o volviendo a descargarlo del origen |
| **Descarga incompleta** | No se recupera. Vuelva a iniciar la descarga |

### Regenerar las más habituales {#regenerating-the-common-ones}

```bash
# En el proyecto afectado
yarn install            # o: npm install / pnpm install

# Binarios de los ejecutores de pruebas
npx cypress install
npx playwright install

# Flutter
flutter pub get
```

Nada de esto necesita a linux-cleanup: solo deja que cada herramienta haga lo que hace con una caché vacía.

## 4. Si de verdad era irreemplazable {#4-if-it-was-genuinely-irreplaceable}

Siendo realistas, en este orden:

1. **Su propia copia de seguridad.** Timeshift, Borg, restic, una instantánea de rsync, sincronización en la nube: lo que use. Es la única respuesta fiable.
2. **El origen.** Un archivo descargado se puede volver a descargar. Busque la URL en el historial del navegador.
3. **La papelera de un servicio de sincronización.** Dropbox, Nextcloud, Google Drive y similares conservan los archivos eliminados en el servidor durante un tiempo. Si el directorio estaba sincronizado, busque ahí.
4. **Herramientas de tallado de archivos**: `extundelete`, `testdisk`, `photorec`. Trabajan sobre inodos desenlazados y tienen pocas probabilidades en un sistema de archivos con mucha actividad, sobre todo en SSD con TRIM activado. Desmonte antes el sistema de archivos o trabaje desde un USB de arranque, y nunca escriba los datos recuperados en el mismo dispositivo.

:::caution Sea honesto consigo mismo sobre el paso 4
En un SSD montado, en uso y con TRIM, el tallado no suele recuperar nada. Solo vale la pena intentarlo con algo realmente importante, y solo después de haber dejado de escribir en el disco.
:::

## 5. Evite que vuelva a pasar {#5-stop-it-happening-again}

| Cambio | Efecto |
|---|---|
| Ejecute [`--scan`](./modes/scan.md) antes de cada limpieza | Ve el resultado mientras todavía es hipotético |
| Saque lo valioso de `~/Downloads` | `~/Documents` y `~/Desktop` están [protegidas](./reference/protected-paths.md) |
| Salte el paso 7 del recorrido | Los archivos personales requerirán entonces una ejecución aparte y deliberada |
| Suba el umbral: `-d 365` | Solo los archivos realmente antiguos pasan a ser candidatos |
| No use `-y` fuera de `--all-safe` en un equipo de confianza | `-y` no puede tocar datos personales, pero solo ve las decisiones después |
| Configure una copia de seguridad de verdad | Es lo único que hace recuperable cualquier eliminación |

## 6. Si la herramienta hizo algo que no debía {#6-if-the-tool-did-something-it-should-not-have}

Si hubo una eliminación dentro de una [ruta protegida](./reference/protected-paths.md), se eliminó la versión *actual* de una extensión de editor o cualquier otra cosa contradice las protecciones documentadas, es un error que conviene informar.

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

Incluya el registro y, si existe, el registro del recorrido guiado. Vea [Enviar un informe de error](./guides/send-a-bug-report.md).

## Siguiente {#next}

- [La eliminación es permanente](./safety/irreversibility.md): el diseño detrás de no tener deshacer
- [Revisar antes de eliminar](./safety/preview-first.md): cómo evitar esta situación
- [Solución de problemas](./troubleshooting.md): para problemas que no son pérdida de datos
