---
title: Enviar un informe de error
description: "Cómo informar de un error de linux-cleanup: crear un paquete de depuración, qué contiene un paquete de fallo, qué revisar antes de enviarlo y adónde enviarlo."
tags: [guide, bug-report, feedback, debug-bundle, crash, privacy]
sidebar_position: 3
---

# Enviar un informe de error

**Dos comandos generan todo lo que necesita quien mantiene la herramienta.** No se envía nada automáticamente: usted revisa el paquete y lo envía.

```bash
linux-cleanup --debug-bundle    # empaqueta el último registro + registro de sesión
linux-cleanup --feedback        # instrucciones y un borrador mailto opcional
```

## El camino rápido {#the-quick-path}

```bash
linux-cleanup --debug-bundle
```

Escribe `~/.linux-cleanup/feedback/debug-bundle-<timestamp>.tar.gz`, que contiene:

- El último registro de sesión
- El último registro JSON de la sesión, si existe
- Un `MANIFEST.txt` con la distribución, el kernel, la versión de bash y la salida de la autocomprobación

Después:

```bash
linux-cleanup --feedback
```

Indica qué incluir y ofrece abrir un borrador `mailto:` con la información del sistema ya completada.

## Revise el paquete antes de enviarlo {#review-the-bundle-before-sending-it}

:::caution Un paquete contiene rutas de su equipo
No el contenido de los archivos, pero el registro nombra cada ruta tocada, es decir, nombres de directorios, de proyectos y a veces de archivos de `~/Downloads`.

Revíselo antes:

```bash
tar -tzf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz     # lista el contenido
tar -xzOf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz    # léalo completo
```

Si hay algo sensible, extraiga el paquete, elimine o tache el archivo y vuelva a empaquetarlo, o envíe solo el manifiesto y las líneas concretas que importan.
:::

## Paquetes de fallo {#crash-bundles}

Desde la [1.3.0](../changelog.md#130--2026-05-10), una salida inesperada con código distinto de cero escribe automáticamente `crash-<timestamp>.tar.gz` en el mismo directorio e imprime la ruta.

Contiene el registro activo, el registro de sesión más reciente y un manifiesto del sistema que incluye el código de salida.

**El paquete no se sube a ningún sitio.** La comprobación de versiones lee un archivo de texto público, pero no envía ningún paquete ni rutas locales. El paquete se queda en su disco hasta que usted decida si compartirlo.

**No** se escriben paquetes de fallo en las salidas esperadas: `0`, `130` (`Ctrl-C`), `143` (SIGTERM) y `2` (error de argumentos) quedan excluidas. Vea [Códigos de salida](../reference/exit-codes.md#how-the-crash-trap-decides).

## Qué incluir {#what-to-include}

Un buen informe es breve y concreto:

| Incluya | Ejemplo |
|---|---|
| Distribución y versión | `lsb_release -d` |
| Versión de Bash | `bash --version \| head -1` |
| Versión de la herramienta | `linux-cleanup --version` |
| El comando exacto | `linux-cleanup --all-safe -y -d 30` |
| Lo esperado frente a lo ocurrido | «esperaba que se conservara el wrapper de Gradle y se eliminó» |
| El paquete | Adjunte el tar.gz |

La línea más valiosa es **lo esperado frente a lo ocurrido**. Un registro por sí solo muestra qué pasó, pero no por qué cree usted que estuvo mal.

## Adónde enviarlo {#where-to-send-it}

| Vía | Para |
|---|---|
| [GitHub issues](https://github.com/aoneahsan/linux-cleanup/issues) | Errores y peticiones de funciones: la vía preferida, pública |
| [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) | Cualquier cosa que prefiera no publicar |
| Una pull request | Tiene una corrección. Licencia MIT, forks bienvenidos |

Las peticiones de funciones con solo una descripción son tan bienvenidas como el código. Diga qué querría que se limpiara y por qué los modos actuales no lo cubren.

## Errores que conviene informar de inmediato {#bugs-worth-reporting-immediately}

Cualquier cosa que contradiga el modelo de seguridad documentado:

- Una eliminación dentro de una [ruta protegida](../reference/protected-paths.md)
- La eliminación de la versión *actual* de una extensión de editor, no solo de una sustituida
- Un archivo eliminado pese a ser más reciente que `--days`, sin `--purge-all`
- Un modo de datos personales que actúe sin confirmación
- Una petición de red que envíe rutas locales de limpieza o informes

Cada uno de ellos es una violación del modelo de seguridad, no una simple molestia.

## Privacidad: qué sale de su equipo {#privacy-what-leaves-your-machine}

:::note Comprobación de versiones e informes locales
Al iniciar, si hay conexión, linux-cleanup lee un registro público de versiones por HTTPS. No sube análisis, registros ni paquetes de fallo. Instalar o actualizar una copia usa npm o GitHub.

Compruébelo en un clon:

```bash
grep -rE 'curl|wget|http://|https://' cleanup.sh lib/ modules/ bin/
```

Lea `modules/update_check.sh` para ver la petición de versiones y el comando que se ofrece para una copia más nueva.
:::

Los registros y los paquetes son archivos locales. Quien mantiene la herramienta no puede verlos ni enviar una corrección a su equipo: una versión nueva le llega cuando vuelve a ejecutar `npx` o actualiza.

## Siguiente {#next}

- [Solución de problemas](../troubleshooting.md): mire aquí primero
- [Recuperación](../recovery.md): si se perdieron datos
- [Códigos de salida](../reference/exit-codes.md)
