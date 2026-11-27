---
title: Visão geral dos modos
description: Todos os modos do linux-cleanup agrupados pelo que fazem — inspeção somente leitura, limpeza guiada e em lote, modos interativos para dados pessoais e auxiliares de saída e reparo.
sidebar_position: 1
---

# Visão geral dos modos

**O linux-cleanup tem um único ponto de entrada e escolhe o modo por uma única opção.** Rodar sem opção abre o [passeio guiado](./walkthrough.md).

Os modos são mutuamente exclusivos — passe um só. Opções como `--days` e `--yes` se combinam com eles.

## Somente leitura — nunca apaga nada {#read-only--never-deletes-anything}

Estes modos não apagam alvos de limpeza. Eles ainda podem gravar um log local, e a checagem de versões pode ler um registro público quando há conexão.

| Modo | Opção | Mostra |
|---|---|---|
| [Verificação](./scan.md) | `-s` `--scan` | Todas as categorias de cache com o tamanho atual |
| [Auditoria da pasta pessoal](./home-audit.md) | `--audit` | As 20 maiores entradas do `$HOME` |
| [Auditoria de pacotes globais](./globals-audit.md) | `--globals` | Pacotes globais de npm/pnpm/yarn/bun/deno |
| Listar alvos | `--list-targets` | Todo caminho que a ferramenta pode tocar, mais a lista protegida |
| Autoteste | `--self-test` | Checagem de dependências, sintaxe e proteções |
| Versão | `-V` `--version` | Versão e autor |

## Limpeza — dados regeneráveis {#cleanup--regenerable-data}

Estes modos podem apagar alvos de limpeza. O `--yes` só pula a confirmação do lote no `--all-safe`; os outros modos mantêm as próprias perguntas.

| Modo | Opção | Comportamento |
|---|---|---|
| [Passeio guiado](./walkthrough.md) | _(padrão)_ `-w` | Dez etapas guiadas, com pergunta antes de cada uma |
| [Menu](./menu.md) | `-m` `--menu` | Menu numerado — escolha uma categoria |
| [TUI](./tui.md) | `-t` `--tui` | O mesmo, numa caixa do whiptail/dialog |
| [Totalmente seguro](./all-safe.md) | `-a` `--all-safe` | Todos os caches regeneráveis de uma vez |
| [Extensões de editores](./editor-extensions.md) | `--editor-ext` | Versões substituídas do VS Code / Cursor |
| [Limpeza do sistema](./system-cleanup.md) | `--system` | apt, journal, snap, `/tmp`, cache de páginas — exige `sudo` |

## Limpeza — só interativa {#cleanup--interactive-only}

Dados pessoais ou de projetos. Estes modos **ignoram `--yes`** e exigem confirmação item por item. Veja a [barreira 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

| Modo | Opção | Encontra |
|---|---|---|
| [Arquivos pessoais sem uso](./personal-stale-files.md) | `-p` `--stale` | Arquivos grandes ociosos em `~/Downloads` e nas raízes sem proteção configuradas |
| [Downloads incompletos](./partial-downloads.md) | `--partials` | `.fdmdownload`, `.crdownload`, `.part` |
| [Localizador de node_modules](./node-modules-finder.md) | `--node-modules` | Pastas de dependências de projetos ociosas há N+ dias |

## Saída, reparo e configuração {#output-repair-and-setup}

| Modo | Opção | Para que serve |
|---|---|---|
| [Relatórios](./reports.md) | `--reports` | Listar, converter e ver relatórios de sessões anteriores |
| [Exportar](./reports.md#exporting) | `--export FMT ID` | Conversão não interativa |
| [Doctor](./doctor.md) | `--doctor` | Consertar a inicialização do shell para nvm, pnpm, bun, deno, cargo |
| [Diagnóstico de velocidade](./speed.md) | `--speed` | Medir pressão e o que inicia junto; correções opcionais perguntam à parte |
| Feedback | `--feedback` | Instruções para reportar bugs, rascunho mailto opcional |
| Pacote de depuração | `--debug-bundle` | Empacotar o log e o relatório mais recentes num tar.gz |
| Instalar alias | `--install-alias` | Adicionar um alias de shell `cleanup` |
| Instalar cron | `--install-cron` | `--all-safe -y` semanal, aos domingos às 03:00 |
| Desinstalar alias / cron | `--uninstall-alias` `--uninstall-cron` | Remover qualquer um dos dois |

## Escolhendo um modo {#choosing-a-mode}

| Objetivo | Modo |
|---|---|
| Primeira vez usando a ferramenta | `--self-test`, `--scan`, `--all-safe --dry-run` |
| Liberar espaço agora, com controle | _(passeio guiado padrão)_ |
| Liberar espaço agora, sem perguntas | `--all-safe -y` |
| Uma categoria específica | `--menu` / `--tui` |
| Manutenção semanal sem supervisão | `--all-safe -y` + `--install-cron` |
| Recuperar o máximo antes de reinstalar | `--all-safe -y --purge-all` |
| Descobrir o que está comendo o disco | `--audit`, `--scan` |
| Projetos paralelos antigos se acumulando | `--node-modules` |
| `command not found` depois de instalar | `--doctor` |

## Opções que se combinam com os modos {#options-that-combine-with-modes}

| Opção | Padrão | Efeito |
|---|---|---|
| `-d N` `--days N` | 100 | Limite de ociosidade. Quanto menor, mais agressivo |
| `--purge-all` | desligado | Desliga o limite de ociosidade — limpeza total |
| `-y` `--yes` | desligado | Confirma automaticamente caches regeneráveis. Só com `--all-safe` |
| `--no-report` | desligado | Pula o relatório JSON. Os logs continuam sendo gravados |
| `--cleanup-logs` | desligado | Apaga o log desta execução no fim. Os relatórios são sempre mantidos |
| `--no-color` | desligado | Desliga a cor ANSI. `NO_COLOR` também é respeitado |
| `-n` `--dry-run` | desligado | Percorre a limpeza escolhida sem apagar; o log local e o estado da checagem de atualizações ainda podem ser gravados |
| `--json-events` | desligado | NDJSON para `--scan` ou `--all-safe --yes` não interativo |

Detalhes completos: [Opções da CLI](../reference/cli-flags.md) e a [matriz de modos](../reference/modes-matrix.md).
