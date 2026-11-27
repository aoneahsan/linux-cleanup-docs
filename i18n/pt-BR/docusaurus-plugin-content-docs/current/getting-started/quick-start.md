---
title: Início rápido
description: "Sua primeira sessão do linux-cleanup em uns dez minutos: confira as proteções, faça uma verificação somente leitura, rode o passeio guiado e leia o relatório."
sidebar_position: 3
---

# Início rápido

**Confira as proteções, veja a verificação e visualize o modo escolhido antes de apagar.** O espaço recuperado depende dos caminhos e arquivos desta máquina.

:::caution Não pule os passos 1 e 2
Eles levam dois minutos e fazem a diferença entre uma limpeza que você controlou e uma que você descobriu depois. Esta ferramenta [apaga de forma permanente](../safety/irreversibility.md).
:::

## Passo 1 — Confira a instalação {#step-1--verify-the-install}

```bash
npx linux-cleanup --version
npx linux-cleanup --self-test
```

`--version` confirma qual build você tem. `--self-test` confere dependências e sintaxe do shell e verifica se as proteções realmente disparam. Uma execução sem problemas termina com mensagem de sucesso; qualquer checagem que falhe sai com código diferente de zero, e aí você deve parar.

## Passo 2 — Verifique sem apagar nada {#step-2--audit-deleting-nothing}

```bash
npx linux-cleanup --scan
```

`--scan` é somente leitura. Ele lista as raízes de cache e o tamanho atual de cada uma, além de outros candidatos e observações sobre o sistema. Ele não apaga nada nem grava relatório JSON da sessão.

Leia os caminhos antes de continuar. O tamanho de uma raiz de cache não quer dizer que a pasta inteira pode ser removida. Confira à parte qualquer caminho inesperado e cada arquivo pessoal candidato.

## Passo 3 — Visualize a limpeza {#step-3--preview-the-cleanup}

```bash
npx linux-cleanup --all-safe --dry-run
```

Isso percorre o modo de cache totalmente seguro sem apagar arquivos nem mudar configurações. Leia as ações propostas e depois decida se vai rodar. Uma exclusão real não tem como desfazer.

## Passo 4 — Rode o passeio guiado {#step-4--run-the-guided-walkthrough}

```bash
npx linux-cleanup
```

Sem opções, você entra no [passeio guiado](../modes/walkthrough.md): dez etapas, cada uma pergunta antes de fazer qualquer coisa, com o total acumulado de bytes recuperados.

Em cada etapa você tem três escolhas:

| Tecla | Efeito |
|---|---|
| `a` | Rodar esta etapa (o padrão — apertar Enter escolhe esta) |
| `s` | Pular esta etapa |
| `q` | Sair do passeio agora |

Dentro de uma etapa, cada alvo tem sua própria confirmação `[Y/n]`. Então há dois níveis: pular uma categoria inteira, ou aceitar a categoria e recusar itens específicos.

As dez etapas, em ordem:

1. Caches de gerenciadores de pacotes
2. Caches de aplicativos
3. Dados de ferramentas de desenvolvimento
4. Extensões antigas de editores
5. `node_modules` parados
6. Downloads incompletos ou órfãos
7. Arquivos pessoais sem uso
8. Limpeza do sistema (sudo)
9. Checagem final de tamanho
10. Gerar relatório legível

:::tip Vá com calma nas etapas 6 e 7
Tudo antes delas é regenerável. Downloads incompletos e arquivos pessoais sem uso não são — leia cada candidato em vez de aceitar o lote. Na primeira execução, pule as duas com `s` se preferir revisá-las à parte depois.
:::

`Ctrl-C` interrompe o passeio com o código `130`. O que já tiver sido apagado continua apagado. Leia o log para ver quais etapas rodaram antes da interrupção.

## Passo 5 — Leia o relatório {#step-5--read-the-report}

A sessão termina com um resumo que indica o log e, quando gerado, o relatório. Leia os caminhos que a sua própria execução mostrar em vez de supor um local fixo para cada forma de instalação.

O passeio guiado grava um relatório JSON, a menos que você passe `--no-report` ou `--dry-run`. Para converter um relatório existente para ler ou arquivar, instale o `jq` e rode:

```bash
linux-cleanup --export both latest   # Markdown + HTML ao lado do JSON
linux-cleanup --reports              # gerenciador interativo de relatórios
```

Veja [Relatórios](../modes/reports.md).

## Passo 6 — Automatize quando já confiar {#step-6--automate-it-once-you-trust-it}

Só depois de uma execução manual que te deixou satisfeito:

```bash
linux-cleanup --install-alias   # digite `cleanup` de qualquer lugar
linux-cleanup --install-cron    # --all-safe -y semanal, aos domingos às 03:00
```

A tarefa do cron roda `--all-safe -y`, que confirma automaticamente **só caches regeneráveis**. Ela não consegue mexer em arquivos pessoais — [esses modos ignoram `--yes`](../safety/guards.md#guard-3--personal-data-is-interactive-only).

Veja [Alias e cron](../guides/alias-and-cron.md) para saber exatamente o que cada um grava e como remover.

## O que você já sabe {#what-you-now-know}

| Conceito | Saiba mais |
|---|---|
| Modos somente leitura nunca apagam | [Visualizar antes de apagar](../safety/preview-first.md) |
| O passeio pergunta antes de cada etapa | [Passeio guiado](../modes/walkthrough.md) |
| A lista de caminhos permitidos recusa Documents, `.ssh`, `.config` | [Proteções](../safety/guards.md) |
| Por padrão, só são podados arquivos sem uso há mais de 100 dias | [O limite de ociosidade](../safety/guards.md#guard-2--the-staleness-gate) |
| Os modos de dados pessoais são só interativos | [Arquivos pessoais sem uso](../modes/personal-stale-files.md) |
| Nada pode ser recuperado pela ferramenta | [Apagar é permanente](../safety/irreversibility.md) |

## Dúvidas comuns depois {#common-follow-ups}

- **"Quero mais espaço."** → [Recuperar o máximo de espaço](../guides/reclaim-the-most-space.md)
- **"Alguma coisa quebrou."** → [Solução de problemas](../troubleshooting.md)
- **"Ele apagou algo que eu queria."** → [Recuperação](../recovery.md)
- **"Quais são todas as opções?"** → [Opções da CLI](../reference/cli-flags.md)
