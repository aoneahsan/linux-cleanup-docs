---
title: Desinstalar
description: "Elimine linux-cleanup por completo: el paquete, el alias de la shell, la entrada de cron y sus registros y registros de sesión."
tags: [guide, uninstall, remove, cleanup, cron, alias]
sidebar_position: 4
---

# Desinstalar

**Quite primero la automatización, luego el paquete y por último los datos.** Desinstalar el paquete no quita un alias de la shell ni una entrada de cron que haya instalado: son cosas aparte.

## 1. Quite la automatización {#1-remove-the-automation}

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

Hágalo **antes** de quitar el paquete, mientras el comando siga existiendo. Si ya lo quitó, vea la [eliminación manual](#if-you-removed-the-package-first) más abajo.

Compruébelo:

```bash
crontab -l | grep -i cleanup     # no debería salir nada
grep -rn 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

## 2. Quite el paquete {#2-remove-the-package}

```bash
npm uninstall -g linux-cleanup
```

Con `npx` no hay nada instalado: la caché de npm lo descarta por sí sola. Para vaciarla ahora:

```bash
npm cache clean --force
```

Con un git clone, elimine el directorio:

```bash
rm -rf ~/linux-cleanup
```

:::caution Un clon guarda sus propios registros
A diferencia de las instalaciones con npm, un clon guarda la salida en `<clone>/logs/` y `<clone>/reports/`. Al eliminar el clon se eliminan también. Copie antes lo que quiera conservar. Vea [Rutas de salida](../reference/output-paths.md).
:::

## 3. Quite los datos {#3-remove-the-data}

Los registros, los registros de sesión y los paquetes de comentarios están en `~/.linux-cleanup/` y **nunca** se eliminan al desinstalar.

```bash
ls -la ~/.linux-cleanup/           # mire antes de eliminar
rm -rf ~/.linux-cleanup/
```

Ocupan poco (normalmente unos pocos megabytes) y son la única constancia de lo que eliminaron las ejecuciones anteriores. Conservarlos no cuesta nada; eliminarlos es irreversible, como todo lo demás.

Si definió `LINUX_CLEANUP_DATA_HOME`, elimine ese directorio en su lugar y quite la exportación de la configuración de su shell.

## 4. Quite la configuración, si creó alguna {#4-remove-configuration-if-you-created-any}

```bash
rm -f ~/.config/personal-roots.txt ~/.config/project-roots.txt
```

Solo existen si los creó usted. Vea [Variables de entorno](../reference/environment-variables.md#configuring-the-scanned-roots).

## Si quitó primero el paquete {#if-you-removed-the-package-first}

Deshaga a mano los dos ayudantes.

**Cron:**

```bash
crontab -e
# elimine la línea que contiene linux-cleanup o cleanup.sh
```

**Alias:**

```bash
grep -n 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

Quite la línea del alias con su editor y luego haga `source` del archivo o abra una terminal nueva.

## Qué queda {#what-is-left-behind}

Nada, una vez hecho lo anterior. La herramienta no instala ningún servicio del sistema, demonio, unidad de systemd, entrada en `/etc` ni archivo propiedad de root. Todo lo que crea está dentro de su directorio personal.

Efectos en su sistema que no deshace, porque no son archivos suyos:

- **Las cachés eliminadas siguen eliminadas.** Se regeneran cuando cada herramienta las necesita
- **Los bloques de inicio de la shell añadidos por [`--doctor`](../modes/doctor.md)** se quedan. Son la configuración correcta para los runtimes que tiene instalados; quítelos a mano si no los quiere

## Comprobación {#verify}

```bash
command -v linux-cleanup      # no debería salir nada
crontab -l | grep -i cleanup  # no debería salir nada
ls ~/.linux-cleanup 2>&1      # debería decir: No such file or directory
```

## Siguiente {#next}

- [Instalación](../getting-started/installation.md): si va a reinstalar
