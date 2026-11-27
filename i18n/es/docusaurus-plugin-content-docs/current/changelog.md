---
title: Registro de cambios
description: Historial de versiones de linux-cleanup, con simulaciones, avisos de versión y eventos JSON locales.
sidebar_position: 94
---

# Registro de cambios

Historial de versiones de `linux-cleanup`. El formato sigue [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) y el proyecto usa [versionado semántico](https://semver.org/spec/v2.0.0.html).

Consulte el [paquete de npm](https://www.npmjs.com/package/linux-cleanup) para ver la versión publicada actual. El [registro de cambios del código](https://github.com/aoneahsan/linux-cleanup/blob/main/CHANGELOG.md) contiene el historial completo. Las entradas de abajo explican los cambios que afectan a la decisión de limpieza.

## 2.1.1 — 2026-11-22 {#211--2026-11-22}

`--help`, `--version`, el cuadro «Acerca de» del menú y la pantalla de comentarios muestran el sitio web, este manual y la página de descarga de la aplicación de escritorio. El `credits.tool_homepage` del informe de ejecución es ahora el sitio del producto. El cuadro «Acerca de» ya no dice que el script no hace llamadas de red: lee el registro público de versiones una vez al arrancar. No cambia lo que elimina ningún modo.

## 2.1.0 — 2026-11-21 {#210--2026-11-21}

`--json-events` emite eventos JSON locales y con versión para `--scan` y para `--all-safe --yes` no interactivo. Añadir `--dry-run` al modo totalmente seguro informa de las rutas propuestas sin eliminarlas. El flujo puede contener rutas locales completas, así que manténgalo en el equipo.

## 2.0.1 — 2026-11-21 {#201--2026-11-21}

El README enumera todos los lugares donde se publica linux-cleanup. No cambia lo que hace el script.

## 2.0.0 — 2026-11-10 {#200--2026-11-10}

Se añadieron `--dry-run`, una comprobación del registro público de versiones al arrancar y `--refresh-app` para la copia persistente de la CLI. Los avisos de versión normales permiten la primera ejecución y bloquean desde el siguiente arranque; los urgentes bloquean una copia antigua de inmediato. Sin conexión, la ejecución continúa. Una simulación no elimina destinos de limpieza ni cambia ajustes, aunque puede escribir un registro local y el estado de la comprobación de actualizaciones.

## 1.6.0 — 2026-09-18 {#160--2026-09-18}

Se añadieron el diagnóstico de solo lectura `--speed` y raíces de búsqueda configurables para proyectos y archivos personales. Se corrigió la detección de inactividad en sistemas de archivos `noatime`: las versiones antiguas podían eliminar una caché aún en uso porque no se registraban las horas de acceso. Las instalaciones de alias y cron apuntan ahora a una copia persistente, y la limpieza de registros solo elimina el de la ejecución actual.

## 1.5.2 — 2026-09-18 {#152--2026-09-18}

Se conservan las revisiones de Snap desactivadas recientes como copias para revertir, y `--node-modules` ya no lista los elementos internos de Yarn PnP.

## 1.5.1 — 2026-09-18 {#151--2026-09-18}

La poda de cachés de paquetes extraídos y de navegadores pasa a hacerse por entrada completa, para que un archivo poco usado no se elimine de una instalación que sigue activa.

## 1.5.0 — 2026-09-18 {#150--2026-09-18}

La poda de cachés de Gradle y Android Studio pasa a operar sobre unidades de versión completas, y se repararon la detección de `node_modules` sin uso y su barrera de eliminación dedicada. Las limpiezas de 1.4.0/1.5.0 pueden haber dejado incompleta una caché extraída; vea los pasos de recuperación en el registro de cambios del código.

## 1.4.0 — 2026-07-11 {#140--2026-07-11}

### Cambios {#changed}

- **Se cambió la licencia a la [Licencia MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE).** Antes se distribuía con una licencia propia «Source-Available · No-Derivatives · Non-Commercial v1.0». Ahora es código abierto permisivo y aprobado por la OSI: puede usarse, modificarse, bifurcarse, redistribuirse y usarse comercialmente sin coste, con atribución.

  El descargo de responsabilidad «AS IS / sin responsabilidad» de MIT sustituye a las condiciones anteriores de garantía, responsabilidad e indemnización. `package.json` declara ahora `"license": "MIT"`.

  Se aplica de aquí en adelante: **las versiones publicadas antes conservan la licencia con la que salieron.**

Sin cambios en el código, en las barreras de seguridad ni en la CLI.

## 1.3.1 — 2026-05-10 {#131--2026-05-10}

Versión solo de documentación. Sin cambios de comportamiento.

### Novedades {#added}

- Un árbol `docs/` completo organizado según el [marco Diátaxis](https://diataxis.fr/): tutoriales, guías prácticas, referencia y explicación. Cada modo, opción, ruta de salida y código de salida, documentados.
- Páginas propias para los dieciséis modos, páginas de referencia para opciones, modos, variables de entorno, rutas de salida, códigos de salida y el esquema JSON, además de recetas prácticas y preguntas frecuentes.
- Una sección «Documentación completa» en el README que enlaza las páginas más usadas.

El código, las barreras de seguridad y la interfaz de la CLI no cambian respecto a la 1.3.0.

## 1.3.0 — 2026-05-10 {#130--2026-05-10}

Versión de pulido final: un menú visual y la captura automática de fallos. Sin lógica de limpieza nueva; las barreras de seguridad y de inactividad existentes no cambian.

### Novedades {#added-1}

- **[Modo TUI](./modes/tui.md)** (`-t` / `--tui` / `-g` / `--gui`): un menú basado en whiptail o dialog. Cada selección vuelve a la salida normal de la CLI para la ejecución y luego regresa al menú. Si no hay ninguna de las dos herramientas, recurre sin problemas al menú de la CLI con una sugerencia de instalación para la distribución.
- **Captura automática de paquetes de fallo**: una trampa EXIT que, ante una salida inesperada distinta de cero, escribe en `~/.linux-cleanup/feedback/` un `crash-<stamp>.tar.gz` autónomo con el registro de la sesión, el informe más reciente y un manifiesto del sistema, y luego imprime una línea que puede enviar por correo.

  No se genera en una salida correcta, con `Ctrl-C` (130), `SIGTERM` (143) ni en salidas por error de argumentos (2). **Sin llamadas de red**: el paquete se queda en su equipo hasta que decida compartirlo.
- Un cuadro **Acerca de** en la TUI con la versión, los datos de contacto, la licencia y el compromiso de privacidad.

### Cambios {#changed-1}

- La supresión del aviso inicial y del resumen de sesión incluye ahora el modo `tui`, para que el cuadro de diálogo no choque con la salida del registro.

## 1.2.2 — 2026-05-10 {#122--2026-05-10}

### Correcciones {#fixed}

- Pequeñas correcciones y mejoras internas de estabilidad.

## 1.2.1 — 2026-05-10 {#121--2026-05-10}

Amplía la barrera de inactividad de la 1.2.0 a todo lo que es una *herramienta* y no una caché regenerable. Eliminar algo así exige ahora **a la vez** que ningún software activo dependa de ello **y** que usted no lo haya tocado en `--days` días.

### Cambios {#changed-2}

- **AVD de Android**: antes se borraba entero `~/.android/avd` al confirmar. Ahora cada directorio `*.avd` se examina como una unidad, junto con su `*.ini` hermano, y solo se poda cuando todos los archivos del perfil superan el umbral de inactividad. Los perfiles de emulador usados hace poco se conservan intactos.
- **[Extensiones sustituidas de VS Code / Cursor](./modes/editor-extensions.md)**: la comprobación «existe una versión más nueva» cubría la primera condición; ahora el directorio sustituido *también* debe superar el umbral de inactividad. Las versiones antiguas cargadas hace poco se listan pero se conservan, con los días de inactividad de cada una.
- **Datos de usuario de Flatpak**: `~/.local/share/flatpak` contiene aplicaciones instaladas a nivel de usuario, no solo cachés. El módulo ahora se niega a tocar el árbol si hay alguna aplicación de usuario instalada y, además, exige que el árbol supere el umbral de inactividad. Remite a `flatpak uninstall --user --unused` como vía más segura.

### Novedades {#added-2}

- `newest_access_age_days <path>`: devuelve los días transcurridos desde el `atime`/`mtime` más reciente en cualquier punto bajo una ruta.
- `prune_stale_units <root> <days> [glob]`: trata cada elemento de primer nivel como indivisible, para que una poda parcial no estropee el estado.

### Por qué {#why}

Un usuario señaló que la 1.2.0 seguía borrando enteros los AVD de Android, y que el mismo razonamiento debía aplicarse a todo lo que es una herramienta y no una caché: no eliminar software del que depende otra herramienta, ni software que el propio usuario haya usado hace poco.

## 1.2.0 — 2026-05-10 {#120--2026-05-10}

**La estrategia de eliminación por defecto pasó a ser solo lo que lleva tiempo sin usarse.** No se elimina nada dentro de una caché de destino salvo que sus archivos lleven sin tocarse —tanto `atime` como `mtime`— `--days` días, 100 por defecto.

### Cambios {#changed-3}

- **`clean_target`, el limpiador común de todos los módulos de caché, ahora poda en lugar de vaciarlo todo.** Elimina solo los archivos que superan el umbral y luego barre los directorios vacíos. Los archivos usados hace poco se conservan y la estructura del directorio se mantiene para que las herramientas sigan encontrando su organización.
- **[`--all-safe`](./modes/all-safe.md) poda cada destino** del mismo modo, y su resumen indica los bytes liberados **y** los conservados en cada destino.
- **La limpieza de la caché de npm respeta la barrera de inactividad** en lugar de ejecutar siempre `npm cache clean --force`, que ignoraba por completo la antigüedad.
- El aviso previo a la ejecución indica la estrategia activa: «prune ≥Nd» o «FULL PURGE».

### Novedades {#added-3}

- **`--purge-all`** restablece el comportamiento anterior a la 1.2.0 de borrarlo todo, documentado con sus pros y contras.
- **`prune_stale <root> <days>`**: una función auxiliar pública para los módulos que rechaza las rutas protegidas, elimina solo donde ambas marcas de tiempo superan el umbral, barre los directorios vacíos e informa de los bytes liberados.

### Por qué {#why-1}

El comportamiento por defecto de la 1.1.0 eliminaba árboles de caché enteros al confirmar. Eso era correcto para `~/.cache/yarn`, que se regenera rápido, y un error para `~/.gradle/wrapper/dists/`, una descarga de 230 MB que quizá necesite de verdad el mes que viene.

Un umbral de 100 días separa con claridad «lo toqué hace poco y lo echaría de menos» de «no lo abro desde hace tres meses». Los usuarios avanzados aún pueden forzar el comportamiento antiguo o endurecer la barrera con `-d 30`.

## 1.1.0 — 2026-05-10 {#110--2026-05-10}

Versión de refuerzo de la seguridad. Cierra la puerta a que se toquen alguna vez los paquetes instalados globalmente y los archivos de inicio del shell.

### Correcciones {#fixed-1}

- **Se estaban borrando los paquetes globales de pnpm.** La limpieza del almacén de contenido de pnpm apuntaba a `~/.local/share/pnpm` (`PNPM_HOME`), que contiene los paquetes instalados globalmente, los accesos directos de bin y el propio binario `pnpm` de `pnpm setup`. Ahora solo apunta a `~/.local/share/pnpm/store`, la caché regenerable direccionada por contenido.

  Afectaba a `--all-safe`, a la opción 3 del menú, al análisis, al recorrido guiado y a `--list-targets`.

### Novedades: barreras de seguridad {#added--safety-guards}

- **[`PROTECTED_EXACT`](./reference/protected-paths.md#exact-match-protected-paths)**: un bloqueo por coincidencia exacta de los directorios de instalación de gestores de paquetes y de las carpetas de los entornos de ejecución: pnpm, npm, yarn, bun, deno, volta, nvm, fnm, cargo, rustup y Go.
- **[`PROTECTED_BASENAMES`](./reference/protected-paths.md#protected-basenames)**: rechaza cualquier ruta cuyo nombre sea un archivo de inicio o de historial del shell, esté donde esté.
- **Una comprobación al arrancar `--all-safe`** que se detiene con un mensaje `BUG:` si algún directorio protegido de un entorno de ejecución llega a la lista de destinos, para evitar una regresión silenciosa.

### Novedades: compatibilidad con bun y deno {#added--bun-and-deno-coverage}

- bun: limpieza de caché en `~/.bun/install/cache`; `~/.bun/install/global` protegido.
- deno: limpieza de caché en `~/.cache/deno`; `~/.deno/bin` protegido.
- Ambos conectados a `--all-safe`, `--scan` y la nueva revisión de paquetes globales.

### Novedades: modos {#added--modes}

- **[`--globals`](./modes/globals-audit.md)**: una revisión de solo lectura que lista los paquetes globales instalados directamente con npm, pnpm, yarn, bun y deno, marca cada uno como `recently used`, `needed by: <pkg>` o `STALE — safe to uninstall` e imprime comandos de desinstalación listos para copiar. **Nunca elimina nada.** Funciona aunque la CLI del gestor de paquetes no esté en `PATH`.
- **[`--doctor`](./modes/doctor.md)**: detecta un entorno de ejecución presente en el disco pero no conectado al inicio del shell (nvm, pnpm, bun, deno, cargo) y ofrece añadir el bloque estándar. **Solo añade, con confirmación. Nunca elimina ni modifica líneas existentes.**

### Cambios {#changed-4}

- `--all-safe` imprime avisos explícitos de «globals are PRESERVED» y «shell-init files are NEVER touched».

## 1.0.0 — 2026-05-09 {#100--2026-05-09}

Primera versión pública.

### Distribución {#distribution}

- Publicado en npm: se ejecuta con `npx linux-cleanup` o `npm install -g linux-cleanup`. El paquete incluye un lanzador de Node ligero que localiza el punto de entrada en bash y envía los registros y los informes a `~/.linux-cleanup/` para que sobrevivan a la limpieza del directorio temporal de npx.
- También se admite `git clone` directo, con la salida dentro del clon.

### Funciones {#features}

- **Recorrido guiado de diez pasos** como modo por defecto, con cabeceras de progreso, preguntas `a` / `s` / `q`, bytes liberados por paso y un total acumulado.
- **Seguridad basada en una lista de permitidas**: rechaza cualquier ruta dentro de una lista protegida cuidada, además de `$HOME` y `/` a secas.
- **Datos personales solo en modo interactivo**: nunca por lotes, nunca con `--yes`.
- **Categorías de limpieza**: cachés de gestores de paquetes (yarn, npm, pnpm, pip, composer); cachés de aplicaciones (Chrome, Firefox, Brave, Chromium, Edge, Vivaldi, Gradle, Cypress, Playwright, TypeScript, Zoom); herramientas de desarrollo (AVD de Android, pub-cache, Dart, flatpak); extensiones de editores; `node_modules` sin uso; descargas incompletas y archivos personales sin uso; limpieza del sistema con sudo.
- **Informes de sesión**: JSON estándar en cada ejecución, con exportación a Markdown y HTML a petición. El HTML usa CSS incrustado que se adapta al modo oscuro.
- **[Gestor de informes](./modes/reports.md)** (`--reports`) y `--export FMT ID` no interactivo.
- **Autocomprobación** (`--self-test`) que verifica las dependencias, la sintaxis de cada archivo del shell y el buen estado de las barreras de seguridad, comprobando que la protección devuelve true para `/`, `$HOME`, `~/Documents` y `/etc`.
- **`--feedback`** y **`--debug-bundle`** para informes de errores estructurados.
- **Privacidad**: ninguna llamada de red. Sin telemetría, analítica ni informes de fallos. Los únicos datos que salen de su equipo son los que usted decide enviar por correo.
- **Créditos en cada archivo generado**: los registros empiezan con una cabecera que indica su origen, los informes llevan un bloque `credits` de primer nivel y la salida HTML tiene créditos en el pie.
- **Ayudas de configuración**: `--install-alias`, `--install-cron` y sus equivalentes de desinstalación.
- Compatibilidad con `NO_COLOR` y `--no-color`.

### Seguridad y refuerzo {#security-and-safety-hardening}

- La salida HTML escapa todos los valores procedentes del JSON con el filtro `@html` de `jq`, para evitar inyecciones desde un informe malformado.
- Comprobaciones `command -v` en cada dependencia opcional (`snap`, `crontab`, `xdg-open`, `jq`).
- `realpath -m` resuelve los enlaces simbólicos antes de cualquier comprobación de rutas protegidas, así que un enlace simbólico no puede esquivar la lista de permitidas.

## Origen {#upstream}

El registro de cambios de referencia está en el [repositorio del código](https://github.com/aoneahsan/linux-cleanup/blob/main/CHANGELOG.md).
