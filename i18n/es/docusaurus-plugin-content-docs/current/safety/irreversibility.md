---
title: La eliminación es permanente
description: linux-cleanup no tiene deshacer, papelera ni copia de seguridad. Qué significa en la práctica, por qué se diseñó así y qué opciones tiene realmente después.
tags: [safety, irreversible, undo, data-loss, recovery]
sidebar_position: 4
---

# La eliminación es permanente

**linux-cleanup llama a `rm -rf`. No hay deshacer, ni directorio de papelera, ni instantánea, ni copia de seguridad.**
Una vez eliminada una ruta, esta herramienta no puede recuperarla, ni ninguna opción que le pase.

:::danger Lea esto antes de su primera ejecución destructiva
- Los archivos eliminados **no** van a una papelera.
- No hay `--undo`, ni comando de restauración, ni una copia oculta guardada en ningún sitio.
- Un registro local puede ayudarle a reconstruir una ejecución; el registro de un recorrido guiado resume sus pasos. Ninguno es una copia archivo por archivo.
- Si un archivo era irreemplazable y no tenía copia, se perdió.

La seguridad de la herramienta viene por completo de [negarse a eliminar lo que no debe](./guards.md) desde el principio.
:::

## Lo que de verdad promete «regenerable» {#what-regenerable-actually-promises}

Casi todo lo que elimina esta herramienta se describe como regenerable. Esa palabra tiene un significado preciso, y conviene tener claro lo que implica y lo que no.

| Significa | No significa |
|---|---|
| *Otro* programa puede volver a crear los datos | linux-cleanup puede volver a crearlos |
| El próximo `yarn install` vuelve a descargar el paquete | Los bytes siguen en algún lugar del disco |
| El navegador reconstruye su caché mientras navega | La eliminación es reversible |
| Volver a crearlos puede requerir red, tiempo o ambos | Volver a crearlos es gratis o inmediato |

El paquete de navegadores de Playwright es regenerable, y volver a descargarlo lleva varios minutos y unos cientos de megabytes. Un equipo sin conexión no puede regenerarlo en absoluto. Regenerable describe de dónde pueden venir los datos, no lo cómodo que es recuperarlos.

## Las categorías que de verdad son irreemplazables {#the-categories-that-are-genuinely-irreplaceable}

Tres objetivos pueden contener datos que no se regeneran. Los tres son [solo interactivos](./guards.md#guard-3--personal-data-is-interactive-only) y los tres merecen atención real cuando responda a las preguntas.

| Objetivo | Por qué nada puede recuperarlo |
|---|---|
| **Archivos personales** en `~/Downloads` o en raíces sin protección configuradas | No hay origen del que volver a obtenerlos. Si era la única copia, esa era la copia. |
| **Descargas incompletas** (`.crdownload`, `.part`, …) | Solo las reanuda la sesión original del navegador, que normalmente ya terminó hace tiempo. |
| **Trabajo sin confirmar dentro de un `node_modules` abandonado** | Es raro, pero una dependencia que modificó en el sitio no está en ningún registro. |

La primera es la que hace perder datos a la gente. `~/Downloads` no es una ruta protegida (*no puede* serlo, porque limpiarla es una función central), así que lo único que separa un archivo de ahí de su eliminación es que usted lea la lista de candidatos.

## Por qué no hay deshacer {#why-there-is-no-undo}

Las razones del diseño, sin rodeos:

1. **Un registro para deshacer multiplica la escritura en el mismo disco que intenta liberar.** Conservar 20 GB para recuperar 20 GB no consigue nada.
2. **Crearía una falsa confianza.** Una herramienta que parece reversible invita a usarla sin cuidado, y la reversibilidad sería parcial en el mejor de los casos: un deshacer que restaura el 90 % de los casos es más peligroso en el 10 % restante.
3. **Prevenir es mejor inversión que recuperar.** La [lista de rutas permitidas](./guards.md#guard-1--the-path-allowlist), el [filtro de inactividad](./guards.md#guard-2--the-staleness-gate) y la confirmación interactiva impiden que ocurra la eliminación equivocada, lo cual es mejor sin discusión que deshacerla después.

Es un trato razonable para las cachés. Es un trato que debe entender antes de usar la herramienta sobre `~/Downloads`.

## Lo que tiene realmente después {#what-you-actually-have-afterwards}

Si una eliminación le sorprende, revise los registros locales disponibles. Ninguno es una copia de seguridad.

| Archivo | Ubicación | Contiene |
|---|---|---|
| Registro de la sesión | `~/.linux-cleanup/logs/cleanup-<timestamp>.log` | La salida legible de la ejecución, salvo que se haya borrado el registro |
| Informe JSON | `~/.linux-cleanup/reports/report-<timestamp>.json` | El resumen de pasos del recorrido guiado, salvo que se hayan desactivado los informes |

Pueden ayudar a identificar el modo y los objetivos elegidos, pero no listan cada archivo eliminado. No contienen nada del contenido eliminado.

Procedimiento completo: [Recuperación](../recovery.md).

## Reducir el riesgo antes de ejecutar {#reducing-the-risk-before-you-run}

```bash
# 1. Confirme que las protecciones funcionan en esta instalación
npx linux-cleanup --self-test

# 2. Vea lo que se recuperaría; no elimina nada
npx linux-cleanup --scan

# 3. Ejecute el recorrido guiado y responda 'n' a todo lo que no tenga claro
npx linux-cleanup
```

Además:

- **Tenga copia de todo lo irreemplazable.** Esto es cierto con o sin esta herramienta; es lo único que hace recuperable cualquier eliminación.
- **Nunca use los modos de archivos personales en un equipo que no haya revisado.** Ejecute antes `--scan`.
- **Reserve `--all-safe -y` para las cachés de equipos en los que ya confía.** No puede tocar archivos personales, pero tampoco le muestra nada hasta que termina.
- **Trate `--purge-all` como una herramienta previa a reinstalar el sistema**, no de uso diario.

:::tip El único hábito que vale la pena adquirir
Ejecute `--scan` antes de `--all-safe`, siempre. Cuesta un minuto y es el único paso que le muestra el resultado mientras todavía es hipotético.
:::

## Siguiente {#next}

- [Recuperación](../recovery.md): el procedimiento tras una eliminación no deseada
- [Protecciones](./guards.md): lo que impide la eliminación desde el principio
- [Revisar antes de eliminar](./preview-first.md): los modos de solo lectura
