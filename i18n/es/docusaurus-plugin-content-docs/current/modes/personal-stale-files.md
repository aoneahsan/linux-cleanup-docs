---
title: Archivos personales sin uso
description: El modo solo interactivo que busca archivos grandes y sin usar desde hace tiempo en ~/Downloads y en raíces sin protección configuradas.
sidebar_position: 9
---

# Archivos personales sin uso

**`--stale` busca archivos de más de unos 10 MB en `~/Downloads` y en raíces sin protección configuradas que llevan sin usarse `--days` días o más, y ofrece eliminarlos de uno en uno.**

```bash
linux-cleanup --stale         # o: -p
linux-cleanup --stale -d 180  # solo archivos sin uso desde hace 180+ días
```

:::danger Los archivos personales pueden ser irreemplazables
`~/Downloads` y sus raíces sin protección configuradas contienen lo que usted haya puesto ahí, incluida a veces la única copia de algo importante.

La herramienta no puede distinguir un instalador que nunca volverá a abrir de un documento que todavía no ha necesitado. Ni lo intenta. **Lea cada candidato.**
:::

## Interactivo por norma {#interactive-by-policy}

La confirmación por archivo o por rango es obligatoria. Aquí se ignora `--yes`, y siempre será así, y este modo no forma parte de [`--all-safe`](./all-safe.md). Vea el [filtro 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

La lista de candidatos se imprime completa antes de preguntar nada, así que ejecutar el modo y rechazarlo todo es una forma legítima de revisar esos directorios.

## Qué convierte un archivo en candidato {#what-makes-a-file-a-candidate}

Tres condiciones a la vez:

1. Está en una raíz personal configurada: `~/Downloads` de forma predeterminada; las raíces protegidas como `~/Desktop` se ignoran
2. Ocupa más de unos 10 MB
3. Tanto `atime` como `mtime` son anteriores a `--days` (100 de forma predeterminada)

Las raíces personales se configuran con `personal-roots.txt` dentro de `$XDG_CONFIG_HOME` (`~/.config` de forma predeterminada). Vea [Variables de entorno](../reference/environment-variables.md).

:::note Por qué `~/Downloads` no está en la lista protegida
No puede estarlo: limpiarlo es todo el sentido de este modo. La [lista de rutas permitidas](../safety/guards.md#guard-1--the-path-allowlist) protege `~/Documents`, `~/Pictures`, `~/Music` y `~/Videos` precisamente para que el único directorio al que llega sea el que usted espera.

Si guarda cosas importantes en `~/Downloads`, muévalas a un lugar protegido: es la solución duradera, y las protege de más cosas que esta herramienta.
:::

## Cómo leer la lista de candidatos {#reading-the-candidate-list}

Cada entrada muestra la ruta, el tamaño y los días sin uso. Merece la pena detenerse en:

| Tipo | Tenga en cuenta |
|---|---|
| Instaladores, ISO, `.deb`/`.AppImage` | Normalmente seguros: se pueden volver a descargar |
| Cualquier cosa que haya creado usted en vez de descargarla | Consérvela o muévala a un lugar protegido |
| Entregables de clientes o del trabajo | Consérvelos. Descargas no es buen sitio para ellos |
| Archivos multimedia sin origen claro | Investigue antes de aceptar |
| Archivos comprimidos que nunca extrajo | Revise primero el contenido |

## Un orden más seguro {#a-safer-sequence}

```bash
linux-cleanup --audit            # qué es realmente grande en $HOME
linux-cleanup --stale -d 365     # solo archivos de verdad antiguos
```

Empezar en 365 días e ir bajando le da primero una lista corta y evidente. Cuando esa esté resuelta, baje el umbral.

## En el recorrido guiado {#in-the-walkthrough}

Paso 7 del [recorrido guiado](./walkthrough.md). Saltarlo ahí con `s` y ejecutarlo aparte más tarde, cuando tenga tiempo para leer con calma, es una costumbre razonable.

## Siguiente {#next}

- [La eliminación es permanente](../safety/irreversibility.md)
- [Descargas incompletas](./partial-downloads.md): el modo interactivo relacionado
- [Revisión del directorio personal](./home-audit.md): primero, encuentre lo que ocupa más
