---
sidebar_position: 7
title: Desinstalar
description: Remova o aplicativo para desktop, os agendamentos dele e o que ele guarda no seu computador.
---

# Desinstalar

## Remova os agendamentos primeiro {#remove-the-schedules-first}

Os agendamentos são temporizadores de usuário do systemd e rodam uma cópia da CLI fora do aplicativo. Remover o aplicativo **não** os remove. Apague cada um na tela **Agendamentos** antes de desinstalar, ou pelo terminal:

```bash
systemctl --user disable --now 'linux-cleanup-schedule-*.timer'
rm -f ~/.config/systemd/user/linux-cleanup-schedule-*.{timer,service}
systemctl --user daemon-reload
```

## Remova o aplicativo {#remove-the-app}

| Instalado como | Remova com |
|---|---|
| AppImage | Apague o arquivo `.AppImage` e depois o item de menu dele: `rm ~/.local/share/applications/linux-cleanup-desktop.desktop ~/.local/share/icons/hicolor/*/apps/linux-cleanup-desktop.png` |
| `.deb` | `sudo apt remove linux-cleanup` |

## O que fica para trás {#what-stays-behind}

| Pasta | Guarda | Remova se |
|---|---|---|
| `~/.linux-cleanup/` | Relatórios, logs, fluxos das execuções agendadas e a cópia da CLI usada pelos agendamentos. A CLI do terminal usa a mesma pasta | Você também não usa mais a CLI |
| `~/.local/share/com.aoneahsan.linuxcleanup/` | As configurações do aplicativo, os recibos e o id aleatório deste computador | Sempre seguro remover depois de desinstalar |

Uma conta conectada continua existindo depois que o aplicativo sai. Exclua-a em **Conta** antes de desinstalar; a exclusão remove a conta e os números sincronizados do servidor.
