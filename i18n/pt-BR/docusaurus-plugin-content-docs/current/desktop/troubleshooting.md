---
sidebar_position: 6
title: Solução de problemas do aplicativo
description: O AppImage não abre, o login não termina, o servidor de contas não responde ou um agendamento não rodou.
---

# Solução de problemas do aplicativo

A tela **Ajuda › Erros e offline** do aplicativo cobre os mesmos casos, com um botão para cada um. Esta página é a versão completa.

## O AppImage não abre {#the-appimage-does-not-open}

- **Nada acontece no clique duplo.** O arquivo precisa ser executável: `chmod +x linux-cleanup_*_amd64.AppImage`.
- **Um erro menciona FUSE.** Os AppImages se montam com o FUSE 2. O Ubuntu 22.04 e posteriores não o instalam por padrão: `sudo apt install libfuse2` (no Ubuntu 24.04, `libfuse2t64`). Sem ele, o AppImage também pode rodar como `./linux-cleanup_*_amd64.AppImage --appimage-extract-and-run`.
- **Um erro menciona WebKitGTK ou `libwebkit2gtk-4.1`.** A janela precisa do WebKitGTK 4.1 da sua distribuição. No Debian e no Ubuntu, o `.deb` já traz; com o AppImage, instale `libwebkit2gtk-4.1-0`.

## O aplicativo diz que falta a CLI incluída {#the-app-says-the-bundled-cli-is-missing}

O aplicativo confere a própria cópia do `cleanup.sh` ao abrir. Se a checagem falhar, a instalação está danificada: baixe a versão de novo na [página de download](https://linux-cleanup.aoneahsan.com/download). Reinstalar não mexe nos seus recibos, relatórios e logs.

## O login não termina {#sign-in-does-not-finish}

O login acontece no seu navegador e volta ao aplicativo por `127.0.0.1`. Se o navegador mostrar o resultado mas o aplicativo não seguir em frente, um firewall ou uma extensão do navegador pode estar bloqueando endereços locais. Um login que falha não muda nada; dá para apertar **Entrar com o Google** de novo.

## O servidor de contas não responde {#the-account-server-does-not-answer}

Simulações, execuções reais, recibos e agendamentos nunca precisam de internet. Offline, o aplicativo continua contando as execuções reais na cota mensal deste computador e sincroniza quando o servidor voltar a responder. Só as mudanças de plano e o histórico sincronizado ficam esperando.

## Um agendamento não rodou {#a-schedule-did-not-run}

```bash
systemctl --user list-timers 'linux-cleanup-schedule-*'
journalctl --user -u 'linux-cleanup-schedule-*' --since today
```

O temporizador só dispara enquanto você está logado; um que foi perdido com o computador desligado roda no próximo login. Cada execução que chegou a começar deixa o fluxo em `~/.linux-cleanup/schedule-runs/`, e o aplicativo o transforma num recibo da próxima vez que você abri-lo.
