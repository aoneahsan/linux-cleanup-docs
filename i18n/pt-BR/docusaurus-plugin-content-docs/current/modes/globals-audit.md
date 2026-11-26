---
title: Auditoria de pacotes globais
description: Uma auditoria somente leitura dos pacotes instalados globalmente com npm, pnpm, yarn, bun e deno, que marca cada um como usado recentemente, dependência de outro ou parado — e mostra comandos de desinstalação para você mesmo rodar.
tags: [globals, npm, pnpm, yarn, bun, deno, read-only, modes]
sidebar_position: 12
---

# Auditoria de pacotes globais

**O `--globals` lista os pacotes que você instalou globalmente com npm, pnpm, yarn, bun e deno, e marca cada um.** Chegou na [1.1.0](../changelog.md#110--2026-05-10).

```bash
linux-cleanup --globals
linux-cleanup --globals -d 180
```

:::note Este modo nunca apaga nada
Ele mostra comandos de desinstalação prontos para copiar e colar, e para por aí. Você decide o que rodar. Pacotes globais são exatamente o tipo de coisa que quebra um fluxo de trabalho quando some de surpresa, então a ferramenta se recusa a removê-los por você.
:::

## Os veredictos {#the-verdicts}

| Veredicto | Significado |
|---|---|
| **recently used** | Modificado ou usado nos últimos `--days` dias. Deixe como está |
| **needed by: `<pkg>`** | Outro pacote global o declara como dependência. Removê-lo quebra esse outro |
| **STALE — safe to uninstall** | Ocioso além do limite e nada depende dele |

"Seguro para desinstalar" quer dizer seguro do ponto de vista dos outros pacotes globais da sua máquina. Ele não tem como saber de um script de shell, de uma tarefa de CI ou de um hábito seu que chame aquele binário. Leia a lista antes de agir.

## Por que os pacotes globais importam aqui {#why-global-packages-matter-here}

Nenhum modo de limpeza **jamais** apaga pacotes instalados globalmente. `~/.local/share/pnpm`, `~/.npm`, `~/.yarn`, `~/.bun/install/global` e `~/.deno/bin` estão na [lista protegida de correspondência exata](../reference/protected-paths.md#exact-match-protected-paths) justamente para protegê-los — lição de um bug real em que a limpeza do pnpm mirou a raiz de instalação e apagou pacotes globais. Veja a [1.1.0](../changelog.md#110--2026-05-10).

Esta auditoria é a contrapartida proposital: visibilidade sem automação.

## Funciona sem os gerenciadores de pacotes no PATH {#works-without-the-package-managers-on-path}

Cada gerenciador é consultado pela CLI quando ela está disponível, e pela inspeção do sistema de arquivos quando não está. Então a auditoria funciona até numa máquina em que o `pnpm` foi instalado mas não está no `PATH` agora — que muitas vezes é justamente a situação que você está tentando diagnosticar.

Se um runtime está no disco mas não está ligado ao seu shell, o modo que resolve é o [`--doctor`](./doctor.md).

## Bons momentos para rodar {#good-moments-to-run-it}

- Antes de reinstalar o Node ou trocar de gerenciador de versões
- Antes de migrar para uma máquina nova — é um inventário portátil das suas ferramentas
- Quando a saída do `npm ls -g` virou algo irreconhecível
- Uma ou duas vezes por ano, por higiene

## Próximos passos {#next}

- [Doctor](./doctor.md) — consertar um runtime instalado mas fora do `PATH`
- [Caminhos protegidos](../reference/protected-paths.md) — por que os pacotes globais nunca são tocados
