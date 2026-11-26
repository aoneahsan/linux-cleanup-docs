---
sidebar_position: 1
title: O aplicativo para desktop
description: O que é o aplicativo para desktop do linux-cleanup, como ele roda a CLI e o que ele envia para fora do seu computador.
---

# O aplicativo para desktop

O aplicativo para desktop é o linux-cleanup numa janela. Ele traz a mesma CLI que este site documenta e roda um modo por meio dela: a [limpeza totalmente segura](../modes/all-safe.md), primeiro como simulação e depois como execução real, quando você confirma. Toda regra sobre o que é removido e o que é recusado pertence à CLI; o aplicativo mostra essas decisões e nunca as altera.

## Como ele roda a CLI {#how-it-runs-the-cli}

O aplicativo inicia o `cleanup.sh` incluído com uma de exatamente duas listas de argumentos e lê o fluxo [`--json-events`](../reference/json-events.md) dele:

| Você aperta | O aplicativo roda |
|---|---|
| **Iniciar uma simulação** | `--all-safe --yes --dry-run --json-events` |
| **Executar a limpeza agora** | `--all-safe --yes --json-events` |

Relatórios e logs vão para `~/.linux-cleanup/reports/` e `~/.linux-cleanup/logs/`, as mesmas pastas que uma execução do `npx linux-cleanup` usa, então o aplicativo e o terminal compartilham um só histórico.

A cópia incluída pula a checagem de atualização da própria CLI (`LINUX_CLEANUP_LAUNCHER=desktop`). No lugar dela, o aplicativo confere as próprias atualizações; veja [Instalar e atualizar](./install.md).

## O que sai do seu computador {#what-leaves-your-computer}

| Dados | Saem do computador? |
|---|---|
| Caminhos de arquivos e pastas, nomes de arquivos | Nunca |
| Resultados das etapas, tamanhos, espaço livre antes e depois, nome da distribuição | Só quando você entra na conta, como números |
| Quais telas abrem e quais ações rodam | Contados com o Amplitude, sem caminhos, nomes ou o seu e-mail |

Entrar na conta é opcional. Sem conta, simulações, execuções reais, recibos e agendamentos funcionam neste computador; a cota mensal de execuções reais é contada por computador.

## Apagar é permanente {#removal-is-permanent}

Uma execução real remove arquivos do mesmo jeito que a CLI: para sempre, sem guardar cópia. O aplicativo exige uma simulação recente antes de uma execução real, e a tela de confirmação diz isso com todas as letras antes de qualquer coisa rodar.
