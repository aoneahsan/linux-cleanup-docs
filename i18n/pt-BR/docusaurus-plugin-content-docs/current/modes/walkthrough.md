---
title: Passeio guiado (padrão)
description: O modo padrão do linux-cleanup — dez etapas guiadas por todas as categorias de limpeza, com pergunta antes de cada uma, total acumulado e relatório JSON da sessão.
tags: [walkthrough, default, interactive, guided, modes]
sidebar_position: 2
---

# Passeio guiado (padrão)

**Rodar `linux-cleanup` sem opções inicia o passeio guiado: dez etapas por todas as categorias de limpeza, e cada uma pergunta antes de fazer qualquer coisa.** É o jeito recomendado de usar a ferramenta de forma interativa.

```bash
linux-cleanup          # ou: linux-cleanup -w / --walkthrough
```

## As dez etapas {#the-ten-steps}

| # | Etapa | Apaga | Observações |
|---|---|---|---|
| 1 | Caches de gerenciadores de pacotes | Regenerável | yarn, npm, npx, pnpm, pip, composer, bun, deno |
| 2 | Caches de aplicativos | Regenerável | Navegadores, Gradle, Cypress, Playwright, Zoom, VSIX de editores |
| 3 | Dados de ferramentas de desenvolvimento | Só o que está parado | AVDs do Android, pub-cache, análise do Dart, flatpak |
| 4 | Extensões antigas de editores | Parado + substituído | VS Code / Cursor |
| 5 | `node_modules` parados | **Interativo** | Projetos ociosos além do limite |
| 6 | Downloads incompletos ou órfãos | **Interativo** | `.crdownload`, `.part`, `.fdmdownload` |
| 7 | Arquivos pessoais sem uso | **Interativo** | Arquivos grandes ociosos em `~/Downloads`, `~/Desktop` |
| 8 | Limpeza do sistema (sudo) | Sistema | apt, journal, snap, `/tmp`, cache de páginas |
| 9 | Checagem final de tamanho | Nada | Resumo somente leitura |
| 10 | Gerar relatório legível | Nada | Exportação Markdown / HTML — exige `jq` |

As etapas 5, 6 e 7 são as [só interativas](../safety/guards.md#guard-3--personal-data-is-interactive-only). Elas não podem ser confirmadas automaticamente, e a etapa 7 é a única de toda a ferramenta que pode remover algo realmente insubstituível.

## Como funcionam as perguntas {#how-the-prompts-work}

Dois níveis de confirmação.

**Por etapa**, você escolhe o que fazer com a categoria inteira:

| Tecla | Efeito |
|---|---|
| `a` | Rodar esta etapa. É o padrão — Enter escolhe esta |
| `s` | Pular esta etapa por completo |
| `q` | Sair do passeio agora, mantendo o progresso até aqui |

**Por alvo**, dentro de uma etapa que você escolheu rodar, cada item tem sua própria confirmação `[Y/n]` ou `[y/N]`. A letra maiúscula é o padrão.

Então apertar `a` no nível da etapa não te compromete a apagar tudo que há nela — você continua vendo e respondendo cada alvo.

## Totais acumulados {#running-totals}

Depois de cada etapa que rodou, a ferramenta mostra a mudança medida e o total da sessão até ali.

O resumo final informa o espaço livre em disco antes e depois. Esse número é medido pelo `df`, então reflete tudo o que acontece na máquina — se um build rodou durante a sua sessão, a recuperação informada pode ser menor que a soma das etapas, ou até negativa. Não é bug; veja [Solução de problemas](../troubleshooting.md#disk-usage-grew-during-the-session).

## Saindo antes {#quitting-early}

`q` em qualquer pergunta de etapa, ou `Ctrl-C` a qualquer momento, encerra a sessão de forma limpa:

- O que já foi apagado continua apagado; confira o log para ver as etapas tentadas antes da interrupção
- `Ctrl-C` sai com o código `130`, que a [armadilha de falhas ignora de propósito](../reference/exit-codes.md#how-the-crash-trap-decides), então nenhum pacote de falha é gravado
- As etapas que não foram alcançadas aparecem como puladas no relatório

## O relatório da sessão {#the-session-report}

O passeio grava um relatório JSON em `~/.linux-cleanup/reports/report-<timestamp>.json`, a menos que `--no-report` ou `--dry-run` esteja definido. Ele traz o status e os bytes liberados de cada etapa, disco e memória antes e depois, e os totais da sessão. Lista completa de campos: [Esquema do relatório](../reference/report-schema.md).

A etapa 10 converte opcionalmente para Markdown e HTML. Essa etapa precisa do `jq`; sem ele, ela fica registrada como `skipped (jq missing)` e o JSON é gravado mesmo assim.

```bash
linux-cleanup --no-report    # pula a geração do JSON; os logs continuam sendo gravados
```

## Opções que valem combinar {#options-worth-combining}

```bash
linux-cleanup -d 30          # limite de ociosidade de 30 dias em vez de 100
linux-cleanup --purge-all    # desliga o limite de ociosidade por completo
linux-cleanup --no-color     # saída simples
linux-cleanup --cleanup-logs # apaga o log desta execução no fim
```

:::danger `--purge-all` muda o que as etapas 1–4 apagam
Com o [limite de ociosidade](../safety/guards.md#guard-2--the-staleness-gate) desligado, as etapas de cache esvaziam os alvos por completo em vez de podar os arquivos ociosos. Isso inclui distribuições do wrapper do Gradle, navegadores do Playwright e binários do Cypress que você talvez ainda queira. O aviso antes da execução informa qual estratégia está ativa.
:::

## Quando usar outra coisa {#when-to-use-something-else}

| Situação | Modo melhor |
|---|---|
| Você só quer uma categoria | [Menu](./menu.md) ou [TUI](./tui.md) |
| Sem supervisão ou pelo cron | [Totalmente seguro](./all-safe.md) com `-y` |
| Você quer olhar, não apagar | [Verificação](./scan.md) |
| Você quer a versão visual disto | [TUI](./tui.md) |

## Próximos passos {#next}

- [Verificação](./scan.md) — rode isto primeiro
- [Totalmente seguro](./all-safe.md) — o equivalente sem supervisão
- [Relatórios](./reports.md) — lendo a saída
