---
sidebar_position: 3
title: Agendamentos
description: Simulações e limpezas totalmente seguras agendadas como temporizadores de usuário do systemd.
---

# Agendamentos

Os agendamentos fazem parte dos planos Pro e Team. Um agendamento é um par de **unidades de usuário do systemd** em `~/.config/systemd/user/`, chamadas `linux-cleanup-schedule-<id>.timer` e `.service`. Ele roda uma simulação ou a limpeza totalmente segura, todo dia, toda semana ou num dia do mês (de 1 a 28).

O temporizador usa `Persistent=true`: se o computador estava desligado no horário marcado, a execução acontece no próximo login. Cada execução agendada grava o fluxo de eventos em `~/.linux-cleanup/schedule-runs/`, e o aplicativo o transforma num recibo na próxima vez que você abri-lo.

Como os arquivos de um AppImage somem quando o aplicativo fecha, um agendamento roda uma cópia da CLI incluída em `~/.linux-cleanup/desktop-engine/`. O aplicativo atualiza essa cópia toda vez que abre, então o temporizador sempre roda a versão que vem com o aplicativo.

Para ver ou parar um temporizador pelo terminal:

```bash
systemctl --user list-timers 'linux-cleanup-schedule-*'
systemctl --user disable --now linux-cleanup-schedule-<id>.timer
```
