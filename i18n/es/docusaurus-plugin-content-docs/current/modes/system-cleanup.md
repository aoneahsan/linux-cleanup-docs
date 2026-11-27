---
title: Limpieza del sistema (sudo)
description: "El modo de sistema con sudo: apt, registro del sistema, Snap, lista de kernels, archivos antiguos de /tmp y vaciado opcional de la caché de páginas."
sidebar_position: 7
---

# Limpieza del sistema (sudo)

**`--system` pide sudo antes de empezar y luego pregunta por cada paso del sistema.** Usa `apt` y `dpkg` directamente para los paquetes, así que el modo completo es para Debian y Ubuntu. Otras distribuciones pueden ejecutar las partes del registro o de `/tmp`, pero los comandos de paquetes fallarán; vea [Compatibilidad con distribuciones](../distro-support.md).

```bash
linux-cleanup --system --dry-run
linux-cleanup --system
```

Una simulación imprime los comandos propuestos sin eliminar objetivos de limpieza ni cambiar la configuración. Puede seguir escribiendo un registro local y el estado de la comprobación de actualizaciones. Revísela antes de una ejecución real, que no se puede deshacer.

## Los seis pasos {#the-six-steps}

| Paso | Lo que ejecuta el código tras la confirmación | Predeterminado |
|---|---|---|
| apt | `sudo apt autoremove --purge -y`, `sudo apt clean` | Sí |
| Registro del sistema | `sudo journalctl --vacuum-size=100M` | Sí |
| Snap | Revisiones desactivadas que cumplen los requisitos, mediante `sudo snap remove` | Sí |
| Kernels | Lista los paquetes `linux-image-*` instalados mediante `dpkg` | No elimina nada |
| `/tmp` | `sudo find /tmp -mindepth 1 -atime +7 -delete` | Sí |
| Caché de páginas | `sudo sync`, `sudo sysctl -q -w vm.drop_caches=3` | No |

El objetivo del registro es 100 MB y la antigüedad de `/tmp` es de 7 días; ninguno sigue a `--days`. El paso de Snap conserva una revisión desactivada de respaldo hasta que su sustituta alcance el umbral de antigüedad configurado, salvo que se use `--purge-all`. La lista de kernels es informativa; apt puede eliminar paquetes de kernel sustituidos en su paso anterior.

El paso de `/tmp` depende de los tiempos de acceso. Si el sistema de archivos no los registra de forma fiable, la herramienta omite la eliminación por antigüedad. Vaciar la caché de páginas libera RAM, no disco, y puede hacer más lentas las lecturas siguientes mientras la caché se vuelve a llenar.

## Límites {#boundaries}

El modo guarda en caché las credenciales de sudo mientras se ejecuta para poder lanzar sus distintos comandos. No inicie una limpieza del sistema si no está dispuesto a revisar esos comandos. `--speed` tiene correcciones opcionales propias que también pueden pedir sudo; el modo de sistema no es el único camino de la CLI que puede usar sudo.

El espacio recuperado depende del equipo. Un cambio de espacio en disco medido después de la ejecución también puede incluir escrituras de otros procesos. Lea el registro para ver los comandos que intentó ejecutar la herramienta.

## Siga leyendo {#read-next}

- [Revisar antes de eliminar](../safety/preview-first.md)
- [Protecciones](../safety/guards.md)
- [Compatibilidad con distribuciones](../distro-support.md)
