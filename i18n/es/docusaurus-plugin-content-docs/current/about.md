---
title: Acerca de
description: Quién creó linux-cleanup, los principios de diseño que lo guían, su licencia y cómo ponerse en contacto o contribuir.
sidebar_position: 95
---

# Acerca de

**linux-cleanup lo crea y mantiene [Ahsan Mahmood](https://aoneahsan.com)**, ingeniero de software independiente que trabaja en herramientas para desarrolladores y desarrollo de aplicaciones.

| | |
|---|---|
| **Autor** | Ahsan Mahmood |
| **Correo** | [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |
| **Web** | [aoneahsan.com](https://aoneahsan.com) |
| **LinkedIn** | [linkedin.com/in/aoneahsan](https://linkedin.com/in/aoneahsan) |
| **GitHub** | [github.com/aoneahsan](https://github.com/aoneahsan) |
| **npm** | [npmjs.com/~aoneahsan](https://www.npmjs.com/~aoneahsan) |

## Por qué existe {#why-it-exists}

Los equipos de desarrollo acumulan muchísima basura regenerable: cachés de gestores de paquetes que ocupan decenas de gigabytes, cachés de navegadores, cachés de herramientas de compilación, imágenes de emuladores y `node_modules` de proyectos abandonados hace dos años.

Los limpiadores existentes solían ser de dos tipos. O no conocían las cachés modernas de desarrollo, o eran borradores de un solo botón que eliminaban todo lo que parecía basura y confiaban en la suerte.

linux-cleanup adopta la postura contraria: **programable, transparente, protegido por una lista de rutas permitidas e interactivo por defecto.** Puede leer exactamente qué va a tocar antes de que toque nada.

## Principios de diseño {#design-principles}

**Ante la duda, rechazar.** Una [lista de rutas permitidas, no de rutas bloqueadas](./safety/guards.md#guard-1--the-path-allowlist). Una ruta que la herramienta no reconoce se rechaza. Con una lista de bloqueo, entre vaciar una caché y vaciar un directorio personal solo hay un error tipográfico.

**Distinguir cachés de herramientas.** `~/.cache/yarn` se regenera en segundos; una distribución del Gradle wrapper es una descarga de 230 MB que quizá necesite el mes que viene. La [barrera de inactividad](./safety/guards.md#guard-2--the-staleness-gate) existe porque tratarlas igual era un error, y la 1.2.0 lo cambió.

**Sobre los datos personales decide el usuario.** Nada en el disco distingue un instalador que nunca volverá a abrir de la única copia de un documento. La herramienta se niega a adivinar, y por eso esos modos [ignoran `--yes`](./safety/guards.md#guard-3--personal-data-is-interactive-only).

**Prevenir antes que recuperar.** [No hay deshacer](./safety/irreversibility.md), a propósito: un registro para deshacer multiplica las escrituras en el disco que intenta liberar y fomenta el descuido.

**Auditable antes que cómodo.** Bash, porque ya está instalado y se puede leer. Un binario compilado sería más cómodo y mucho más difícil de verificar.

**Las comprobaciones de versión son mínimas.** Al arrancar, si hay conexión, la CLI lee un registro público de versiones. No sube rutas de limpieza, informes ni paquetes de fallo; enviar un informe sigue siendo decisión suya.

## Las correcciones dan forma a la herramienta {#corrections-shape-the-tool}

Dos de las funciones de seguridad existen porque alguien señaló un problema real.

La [lista protegida de raíces de instalación](./reference/protected-paths.md#exact-match-protected-paths) nació de un defecto real: la limpieza de pnpm apuntaba a `~/.local/share/pnpm` (la raíz de instalación) y eliminaba los paquetes instalados globalmente. Se corrigió en la [1.1.0](./changelog.md#110--2026-05-10), junto con una comprobación para que no vuelva a ocurrir.

La [barrera de inactividad](./safety/guards.md#guard-2--the-staleness-gate) nació de un usuario que observó que la 1.2.0 seguía borrando enteros los AVD de Android, y que el mismo razonamiento debía aplicarse a todo lo que es una herramienta y no una caché. Eso se convirtió en la [1.2.1](./changelog.md#121--2026-05-10).

Si encuentra algo que está mal, [díganoslo](./guides/send-a-bug-report.md).

## Licencia {#licence}

**[MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)** desde la [1.4.0](./changelog.md#140--2026-07-11).

Úsela de forma personal o comercial, modifíquela, bifúrquela, intégrela, redistribúyala. La única condición es conservar el aviso de copyright y el aviso de permiso MIT en las copias o partes sustanciales.

:::danger Se ofrece «TAL CUAL», sin garantía
Es una herramienta que elimina archivos. El autor no acepta responsabilidad por ninguna reclamación ni daño, incluida la pérdida de datos, derivados de su uso. Haga copias de seguridad y revise cada acción antes de confirmarla.

Rige el [texto completo de la licencia](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE).
:::

Las versiones publicadas antes de la 1.4.0 conservan la licencia con la que salieron.

## Contribuir {#contributing}

Las contribuciones son bienvenidas bajo MIT.

- **Haga un fork y abra un pull request**: no hace falta ningún acceso especial
- **Informe de errores o pida funciones** en [GitHub issues](https://github.com/aoneahsan/linux-cleanup/issues) o por correo
- **`main` está protegida**: los cambios entran mediante PR revisados

Las normas de código son: la seguridad primero, solo sin conexión y sin avisos de ShellCheck. Vea [CONTRIBUTING.md](https://github.com/aoneahsan/linux-cleanup/blob/main/CONTRIBUTING.md).

Una petición de función solo descrita es tan bienvenida como el código. Diga qué querría limpiar y por qué los modos actuales no lo cubren.

## Esta documentación {#this-documentation}

Hecha con [Docusaurus](https://docusaurus.io/) y publicada en GitHub Pages. Código fuente: [github.com/aoneahsan/linux-cleanup-docs](https://github.com/aoneahsan/linux-cleanup-docs); las correcciones también son bienvenidas allí.

Resumen legible por máquina para asistentes de IA: [`/llms.txt`](https://linux-cleanup-docs.aoneahsan.com/llms.txt).

## Enlaces relacionados {#related-links}

| | |
|---|---|
| **Código fuente** | [github.com/aoneahsan/linux-cleanup](https://github.com/aoneahsan/linux-cleanup) |
| **npm** | [npmjs.com/package/linux-cleanup](https://www.npmjs.com/package/linux-cleanup) |
| **Incidencias** | [github.com/aoneahsan/linux-cleanup/issues](https://github.com/aoneahsan/linux-cleanup/issues) |
| **Apoyar el trabajo** | [aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=linux-cleanup&project-identifier=linux-cleanup) |
