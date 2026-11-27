---
title: Limpeza do sistema (sudo)
description: "O modo de sistema com sudo: apt, journal, Snap, lista de kernels, arquivos antigos do /tmp e liberação opcional do cache de páginas."
sidebar_position: 7
---

# Limpeza do sistema (sudo)

**O `--system` pede sudo antes de começar e depois pergunta sobre cada etapa do sistema.** Ele usa `apt` e `dpkg` diretamente para os pacotes, então o modo completo é para Debian e Ubuntu. Outras distribuições podem rodar as partes de journal ou `/tmp`, mas os comandos de pacotes vão falhar; veja [Distribuições suportadas](../distro-support.md).

```bash
linux-cleanup --system --dry-run
linux-cleanup --system
```

A simulação mostra os comandos propostos sem remover alvos de limpeza nem mudar configurações. Ela ainda pode gravar um log local e o estado da checagem de atualizações. Revise antes de uma execução real, que não tem como desfazer.

## As seis etapas {#the-six-steps}

| Etapa | O que o código roda depois da confirmação | Padrão |
|---|---|---|
| apt | `sudo apt autoremove --purge -y`, `sudo apt clean` | Sim |
| Journal | `sudo journalctl --vacuum-size=100M` | Sim |
| Snap | Revisões desativadas elegíveis, via `sudo snap remove` | Sim |
| Kernels | Lista os pacotes `linux-image-*` instalados via `dpkg` | Não apaga nada |
| `/tmp` | `sudo find /tmp -mindepth 1 -atime +7 -delete` | Sim |
| Cache de páginas | `sudo sync`, `sudo sysctl -q -w vm.drop_caches=3` | Não |

A meta do journal é 100 MB e a idade do `/tmp` é 7 dias; nenhuma das duas segue o `--days`. A etapa do Snap mantém uma revisão de reserva desativada até a substituta atingir o limite de idade configurado, a menos que se use `--purge-all`. A lista de kernels é só informativa; o apt pode remover pacotes de kernel substituídos na etapa anterior.

A etapa do `/tmp` depende dos tempos de acesso. Se o sistema de arquivos não os registra de forma confiável, a ferramenta pula a exclusão por idade. Liberar o cache de páginas libera RAM, não disco, e pode deixar as leituras seguintes mais lentas enquanto o cache se enche de novo.

## Limites {#boundaries}

O modo guarda as credenciais do sudo em cache enquanto roda, para poder emitir os comandos separados. Não comece uma limpeza do sistema se não estiver disposto a revisar esses comandos. O `--speed` tem correções opcionais próprias que também podem pedir sudo; o modo de sistema não é o único caminho da CLI que usa sudo.

O espaço recuperado depende da máquina. Uma mudança de espaço em disco medida depois da execução também pode incluir gravações de outros processos. Leia o log para ver os comandos que a ferramenta tentou rodar.

## Leia também {#read-next}

- [Visualizar antes de apagar](../safety/preview-first.md)
- [Proteções](../safety/guards.md)
- [Distribuições suportadas](../distro-support.md)
