---
sidebar_position: 3
title: Simulação, execução real, recibo
description: A primeira abertura e depois o único caminho de toda limpeza no aplicativo para desktop — simulação, confirmação, execução real, recibo.
---

# Simulação, execução real, recibo

Toda limpeza no aplicativo para desktop passa pelas mesmas quatro etapas, na mesma ordem. Nenhuma pode ser pulada.

## Primeira abertura {#first-launch}

Na primeira vez que abre, o aplicativo mostra três passos curtos: o que é o aplicativo, quais pastas a CLI sempre recusa e um **Entrar com o Google** opcional. Cada um pode ser pulado e aberto de novo em **Ajuda**. Nunca é preciso entrar na conta para limpar; entrar aumenta as execuções reais do mês e mantém a contagem de execuções entre os seus computadores ([Contas e planos](./accounts-and-plans.md)).

Entrar abre o Google no seu navegador. Quando você termina lá, o navegador devolve o resultado ao aplicativo por `127.0.0.1`, e a janela do aplicativo volta a assumir.

## 1. Simulação {#1-dry-run}

**Iniciar uma simulação** roda a limpeza totalmente segura com `--dry-run`. Ela não apaga nada, em lugar nenhum. A tela então lista cada caminho que a limpeza removeria, o tamanho medido e o motivo, e cada caminho que a CLI recusou e manteve, com a razão. **Salvar a lista como JSON** grava essa lista num arquivo neste computador.

No aplicativo, um botão com borda tracejada é sempre uma simulação. Um botão preenchido apaga arquivos.

## 2. Confirmação {#2-confirm}

**Revisar e executar** abre a única tela que inicia uma execução real. Ela repete o que a simulação encontrou, diz quantas execuções reais ainda restam no seu plano este mês e avisa que apagar é permanente. **Executar a limpeza agora** fica indisponível enquanto:

- a simulação tiver mais de um dia (rode de novo antes);
- outra execução ainda estiver em andamento;
- não restarem execuções reais neste mês.

## 3. Execução real {#3-real-run}

A CLI informa cada caminho à medida que o remove, e a tela acompanha. Ela confere cada caminho de novo antes de remover, então o que mudou desde a simulação é julgado como está agora. **Cancelar depois deste item** para assim que a etapa atual termina; o que já foi removido continua removido.

## 4. Recibo {#4-receipt}

Toda execução termina com um recibo, inclusive a simulação: espaço livre antes e depois, cada etapa marcada como concluída, pulada ou com falha, e como a execução terminou. Uma execução cancelada ou interrompida marca a etapa não concluída como falha. Os recibos ficam neste computador em **Recibos e histórico**, ao lado dos relatórios e logs da própria CLI em `~/.linux-cleanup/`. Com a conta conectada num plano com sincronização de histórico, o aplicativo também envia os números do recibo — nunca um caminho ou nome de arquivo ([O que sai do seu computador](./overview.md#what-leaves-your-computer)).
