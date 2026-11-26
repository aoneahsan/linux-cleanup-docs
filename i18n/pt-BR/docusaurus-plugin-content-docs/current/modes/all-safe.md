---
title: Totalmente seguro (em lote)
description: Limpe todos os caches regeneráveis de uma vez. O modo feito para cron e manutenção sem supervisão, e o único em que o --yes vale.
tags: [all-safe, batch, cron, unattended, yes, modes]
sidebar_position: 6
---

# Totalmente seguro (em lote)

**O `--all-safe` limpa todos os caches regeneráveis de uma vez só.** É o modo para manutenção sem supervisão e o único em que o `--yes` vale.

```bash
linux-cleanup --all-safe        # uma confirmação para o lote todo
linux-cleanup --all-safe -y     # sem perguntas — o jeito para o cron
```

## O que "seguro" quer dizer aqui {#what-safe-means-here}

Seguro quer dizer **regenerável**: caches de gerenciadores de pacotes, caches de navegadores e aplicativos e dados parados de ferramentas de desenvolvimento. **Não** quer dizer sem risco, nem reversível — as exclusões continuam [permanentes](../safety/irreversibility.md).

O que o `--all-safe` nunca vai tocar, com ou sem `--yes`:

- Arquivos pessoais em `~/Downloads`, `~/Desktop` ou em qualquer outro lugar
- Downloads incompletos
- Pastas `node_modules`
- Qualquer coisa da [lista de caminhos protegidos](../reference/protected-paths.md)
- Pacotes instalados globalmente ou arquivos de inicialização do shell

Essas categorias são [só interativas por projeto](../safety/guards.md#guard-3--personal-data-is-interactive-only) e simplesmente não fazem parte deste modo. É isso que torna aceitável usar `--all-safe -y` numa tarefa do cron.

Desde a 1.1.0, o modo também roda uma **checagem na inicialização** que para com uma mensagem `BUG:` se alguma pasta de runtime protegida vazar para a lista de alvos, para que uma regressão futura falhe de forma escandalosa em vez de apagar algo que não devia.

## `--yes` e seus limites {#--yes-and-its-limits}

`-y` / `--yes` confirma automaticamente as exclusões de cache. Ele só vale com `--all-safe`; os modos interativos o ignoram por regra.

```bash
linux-cleanup --all-safe -y
```

:::caution Com `-y` você só vê as decisões depois
A lista de caminhos permitidos e o limite de ociosidade continuam valendo, mas você só lê o log depois da execução. Uma execução totalmente segura sozinha não grava o relatório JSON da sessão do passeio guiado. Na primeira vez, confira antes um [`--scan`](./scan.md) e um `--all-safe --dry-run`.
:::

## A poda, e o que sobra {#pruning-and-what-survives}

Por padrão, o `--all-safe` poda os arquivos de cache elegíveis cujos `atime` e `mtime` são ambos mais antigos que `--days` (100 por padrão). Pacotes extraídos e ferramentas com versão são tratados como unidades inteiras, pelas próprias regras de ociosidade. A saída legível mostra parte dos resultados; use a simulação para conferir os caminhos propostos antes de apagar.

```bash
linux-cleanup --all-safe -y            # limite de 100 dias
linux-cleanup --all-safe -y -d 30      # mais agressivo
linux-cleanup --all-safe -y --purge-all # barreira desligada — limpeza total
```

:::danger `--purge-all` numa tarefa do cron é uma péssima combinação
Sem supervisão e sem limite de ociosidade significa que uma distribuição do wrapper do Gradle ou um pacote de navegadores do Playwright pode sumir na semana anterior àquela em que você vai precisar, sem ninguém olhando. Deixe o `--purge-all` para execuções conscientes, antes de reinstalar o sistema.
:::

## Rodando toda semana {#running-it-weekly}

```bash
linux-cleanup --install-cron
```

Isso agenda o `--all-safe -y` para os domingos às 03:00 e acrescenta a saída em `~/.linux-cleanup/logs/cron.log`. Veja [Alias e cron](../guides/alias-and-cron.md) para a entrada exata e como removê-la.

Se você mesmo escrever a entrada no crontab, use um **caminho absoluto** — o `PATH` mínimo do cron não vai achar uma instalação em `~/.local/bin`:

```bash
0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1
```

O `--cleanup-logs` remove o log daquela execução. Execuções totalmente seguras sozinhas não gravam o registro JSON da sessão do passeio guiado, então o `--no-report` não tem efeito adicional aqui.

## Conferindo o que uma execução do cron fez {#checking-what-a-cron-run-did}

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
```

Se o log do cron mostrar `command not found`, o crontab está usando o nome do comando sem caminho — veja [Solução de problemas](../troubleshooting.md#cron-entry-runs-but-does-nothing).

## Quando usar outra coisa {#when-to-use-something-else}

| Situação | Modo melhor |
|---|---|
| Primeira vez nesta máquina | [`--scan`](./scan.md) e depois `--all-safe --dry-run` |
| Você quer ver cada decisão | [Passeio guiado](./walkthrough.md) |
| Só uma categoria precisa de limpeza | [Menu](./menu.md) ou [TUI](./tui.md) |
| Você também quer recuperar espaço de arquivos pessoais | [Arquivos pessoais sem uso](./personal-stale-files.md), no modo interativo |

## Próximos passos {#next}

- [Alias e cron](../guides/alias-and-cron.md) — agendando
- [Recuperar o máximo de espaço](../guides/reclaim-the-most-space.md) — o caminho agressivo
- [Proteções](../safety/guards.md) — o que continua valendo com `-y`
