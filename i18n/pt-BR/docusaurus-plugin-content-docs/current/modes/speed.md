---
title: Diagnóstico de velocidade
description: Confira temperatura, pressão e o que inicia junto com o Linux, e decida se aplica cada mudança sugerida.
sidebar_position: 16
---

# Diagnóstico de velocidade

**O `--speed` mostra onde a máquina está gastando tempo.** Ele lê os contadores térmicos, a pressão de CPU, memória e E/S, os processos pesados e as informações de boot. Também consegue achar contêineres, serviços e apps de login que iniciam sozinhos.

```bash
linux-cleanup --speed --dry-run
linux-cleanup --speed
```

A simulação mostra as mudanças sobre as quais ele perguntaria, sem aplicá-las. Uma execução normal pergunta separadamente antes de cada mudança proposta; a resposta padrão é Não. `--yes` não autoriza essas correções.

Algumas correções aceitas param um contêiner, desativam um serviço ou mudam uma configuração de login do usuário. Elas não apagam arquivos de cache, mas mudam o que inicia da próxima vez. A CLI mostra um comando para desfazer depois de aplicar uma mudança. Pode aparecer um pedido de sudo para mudar um serviço do sistema.

Um achado é uma medição ou uma condição, não a prova de que um app específico está com defeito. Leia o processo ou serviço indicado e decida se você precisa dele antes de aceitar uma mudança.

Para comandos que faltam na inicialização do shell, use o modo [Doctor](./doctor.md), à parte. Para espaço em disco, comece por uma [verificação](./scan.md).
