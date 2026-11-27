---
title: Preguntas frecuentes
description: Respuestas sobre las rutas de linux-cleanup, su comprobación de versiones, las simulaciones, la eliminación permanente y la compatibilidad con distribuciones.
sidebar_position: 93
---

# Preguntas frecuentes

Los problemas con un síntoma concreto están en [Solución de problemas](./troubleshooting.md); las razones del diseño, en [Protecciones](./safety/guards.md).

## ¿Eliminará mi código? {#will-it-delete-my-code}

**Sus archivos fuente, no.** `~/Documents` y los demás directorios personales están [protegidos sin excepción](./reference/protected-paths.md), y ningún destino de limpieza apunta al código fuente de un proyecto.

Lo más cerca que llega es buscar `node_modules` abandonados en las raíces de sus proyectos. Esos son [solo interactivos](./modes/node-modules-finder.md), con confirmación por proyecto, y `yarn install` los reconstruye.

Un matiz que conviene saber: si editó un archivo *dentro* de `node_modules` directamente, en lugar de con una herramienta de parches, esa edición no existe en ningún otro lugar.

## ¿Envía datos a algún sitio? {#does-it-phone-home}

**Si hay conexión, la CLI consulta al iniciar un registro público de versiones por HTTPS.** No envía resultados del análisis, rutas de limpieza ni paquetes de fallo. Sin conexión, la comprobación se omite y la ejecución continúa.

Compruébelo usted mismo en un clon:

```bash
grep -rE 'curl|wget|http://|https://' cleanup.sh lib/ modules/ bin/
```

La comprobación de versiones está en `modules/update_check.sh`; revise también ese archivo. Instalar o aceptar una actualización usa npm o GitHub. El asistente de comentarios abre un borrador que usted decide si envía.

## ¿Por qué no hay deshacer? {#why-is-there-no-undo}

Un registro para deshacer multiplicaría la escritura en el mismo disco que intenta liberar: conservar 20 GB para recuperar 20 GB no consigue nada. También daría una falsa confianza y, en el mejor de los casos, sería parcial.

El modelo de seguridad es la prevención: una lista de rutas permitidas, un filtro de inactividad y confirmación interactiva. Las razones completas: [La eliminación es permanente](./safety/irreversibility.md).

## ¿Hay `--dry-run`? {#is-there-a---dry-run}

**Sí.** `--scan` solo lee; `--dry-run` recorre la limpieza elegida sin eliminar archivos ni cambiar la configuración. Una simulación sigue guardando un registro local y no escribe un informe JSON de la sesión. Vea [Revisar antes de eliminar](./safety/preview-first.md).

## ¿Cuál es la forma más segura de probarlo? {#what-is-the-safest-way-to-try-it}

```bash
linux-cleanup --self-test      # comprueba que las protecciones se activan
linux-cleanup --scan           # solo lectura; muestra lo que se recuperaría
linux-cleanup --list-targets   # todas las rutas que puede tocar
linux-cleanup --all-safe --dry-run  # previsualiza una limpieza de cachés
```

Con eso ya habrá visto funcionar el modelo de seguridad sin perder un byte. Después ejecute `linux-cleanup` y responda `n` a todo lo que le sorprenda.

## ¿Hará más rápido mi equipo? {#will-it-speed-up-my-computer}

Un poco, a veces, y conviene ser sincero sobre lo poco:

- VS Code arranca algo más rápido con una docena de directorios de extensiones en lugar de cincuenta
- Una caché pequeña se recorre algo más rápido que una inflada
- El arranque en frío del navegador no cambia: las cachés son clave-valor y las búsquedas son O(1)
- Vaciar la caché de páginas libera RAM, no disco, y el kernel la vuelve a llenar enseguida

El beneficio real es que «disco lleno» deja de interrumpir su trabajo, no una cifra de rendimiento.

## ¿Qué pasa si pulso `Ctrl-C` en medio de una limpieza? {#what-if-i-press-ctrl-c-mid-cleanup}

La eliminación en curso termina, normalmente en mucho menos de un segundo, y el script sale con el código `130`. El registro conserva todo hasta ese momento. La [trampa de fallos ignora `130` a propósito](./reference/exit-codes.md), así que no se escribe ningún paquete de fallo.

## ¿Puedo ejecutarlo como root? {#can-i-run-it-as-root}

Puede, pero no debería. Está pensado para un usuario normal, y ejecutarlo como root solo amplía el daño si algún error llegara a saltarse las protecciones. [`--system`](./modes/system-cleanup.md) se encarga internamente de las necesidades legítimas de sudo, un comando revisado cada vez.

## ¿Funciona en mi distribución? {#does-it-work-on-my-distro}

La limpieza de cachés dentro de `$HOME` funciona en **todas** las distribuciones de Linux.

[`--system`](./modes/system-cleanup.md) es **solo para Debian y Ubuntu**: llama a `apt` y `dpkg` sin detectar la distribución. En Fedora, Arch u openSUSE fallan sus pasos de paquetes, mientras que los de registro del sistema, `/tmp` y caché de páginas siguen funcionando. Vea [Compatibilidad con distribuciones](./distro-support.md).

## ¿Y en WSL? {#what-about-wsl}

La CLI funciona del lado de Linux. Revise antes de la limpieza cualquier enlace simbólico de su directorio personal de Linux hacia `/mnt/c/`. La lista de rutas permitidas resuelve los enlaces, pero una ruta `Documents` de Windows no queda cubierta automáticamente por una regla del directorio personal de Linux.

## ¿Por qué bash y no Python, Go o Rust? {#why-bash-rather-than-python-go-or-rust}

Bash ya está en todos los sistemas a los que va dirigido. Un binario compilado significaría distribuir algo que los usuarios no pueden auditar con facilidad; una implementación en Python o Node añadiría una dependencia de ejecución a una herramienta cuyo único trabajo es quitar cosas del disco.

El script son unos miles de líneas de bash comentado que un ingeniero con experiencia puede leer en una tarde. En una herramienta que ejecuta `rm -rf` con `sudo` disponible, poder auditarla vale más que la comodidad.

## ¿Con qué frecuencia debería ejecutarlo? {#how-often-should-i-run-it}

| Modo | Frecuencia |
|---|---|
| [`--scan`](./modes/scan.md) | Mensual, como referencia |
| [`--all-safe -y`](./modes/all-safe.md) | Semanal: [automatícelo](./guides/alias-and-cron.md) |
| [`--system`](./modes/system-cleanup.md) | Trimestral, a mano |
| [`--node-modules`](./modes/node-modules-finder.md) | Anual, cuando se acumulen proyectos personales |
| [`--editor-ext`](./modes/editor-extensions.md) | Cuando el editor vaya lento; `--all-safe` también lo cubre |
| [`--stale`](./modes/personal-stale-files.md) | Trimestral, con calma |
| [`--doctor`](./modes/doctor.md) | Cuando aparezca `command not found` |
| [`--globals`](./modes/globals-audit.md) | Antes de reinstalar Node o de cambiar de equipo |

## ¿Para qué sirve `--purge-all`? {#what-is---purge-all-for}

Desactiva el [filtro de inactividad](./safety/guards.md#guard-2--the-staleness-gate) y vacía las cachés por completo en lugar de podar los archivos sin uso. Eso incluye distribuciones del wrapper de Gradle, navegadores de Playwright y binarios de Cypress que quizá todavía quiera.

Es la opción correcta antes de reinstalar un equipo y un mal valor predeterminado en cualquier otro caso. Nunca lo combine con una tarea de cron.

## ¿Qué versión debería instalar? {#which-version-should-i-install}

Consulte el [paquete de npm](https://www.npmjs.com/package/linux-cleanup) para ver la versión publicada actual y ejecute `linux-cleanup --version` para identificar su copia instalada. Lea el [registro de cambios](./changelog.md) antes de actualizar.

## ¿Bajo qué licencia está? {#what-licence-is-it-under}

**[MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)** desde la 1.4.0: permisiva y aprobada por la OSI. Úsela de forma personal o comercial, modifíquela, bifúrquela, intégrela y redistribúyala. La única condición es conservar el aviso de copyright y de permiso.

Se ofrece «AS IS» (tal cual), sin garantía. Las versiones publicadas antes de la 1.4.0 mantienen la licencia con la que salieron.

## ¿Cómo pido una función o informo de un error? {#how-do-i-request-a-feature-or-report-a-bug}

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

Después abra un [issue en GitHub](https://github.com/aoneahsan/linux-cleanup/issues) o escriba a [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com). Las pull requests son bienvenidas bajo MIT; las peticiones de funciones con solo una descripción también. Vea [Enviar un informe de error](./guides/send-a-bug-report.md).

## ¿Qué no hará nunca? {#what-will-it-never-do}

- Eliminar nada de la [lista de rutas protegidas](./reference/protected-paths.md)
- Tocar datos personales sin confirmación archivo por archivo
- Subir automáticamente resultados del análisis, rutas de limpieza o paquetes de fallo
- Instalar un servicio, demonio o agente en segundo plano
- Modificar o eliminar una línea existente de la configuración de su shell
- Recuperar nada de lo que eliminó
