---
title: Diagnóstico de velocidad
description: Revise la temperatura, la presión y el trabajo de arranque de Linux, y decida si aplica cada cambio propuesto.
sidebar_position: 16
---

# Diagnóstico de velocidad

**`--speed` informa de en qué está gastando el tiempo el equipo.** Lee los contadores térmicos, la presión de CPU, memoria y E/S, los procesos pesados y la información de arranque. También puede encontrar contenedores, servicios y aplicaciones de inicio de sesión que se inician solos.

```bash
linux-cleanup --speed --dry-run
linux-cleanup --speed
```

La simulación informa de los cambios sobre los que preguntaría sin aplicarlos. Una ejecución normal pregunta por separado antes de cada cambio propuesto; la respuesta predeterminada es No. `--yes` no autoriza estas correcciones.

Algunas correcciones aceptadas detienen un contenedor, desactivan un servicio o cambian un ajuste de inicio de sesión del usuario. No eliminan archivos de caché, pero afectan a lo que se inicia la próxima vez. La CLI imprime un comando para revertir después de aplicar un cambio. Puede aparecer una solicitud de sudo al cambiar un servicio del sistema.

Un hallazgo es una medición o una condición, no la prueba de que una aplicación concreta falle. Lea el proceso o servicio indicado y decida si lo necesita antes de aceptar un cambio.

Para comandos que faltan en el arranque de la shell, use el modo [Doctor](./doctor.md), aparte. Para el espacio en disco, empiece con un [análisis](./scan.md).
