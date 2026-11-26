---
title: Opções da CLI
description: Todas as opções de linha de comando do linux-cleanup — modos, opções, aliases e padrões — com o que cada uma faz e onde está a documentação completa.
tags: [cli, flags, reference, options, commands]
sidebar_position: 1
---

# Opções da CLI

**Todas as opções que o linux-cleanup aceita.** Os modos são mutuamente exclusivos — passe um. As opções combinam com qualquer modo.

```bash
linux-cleanup --help    # a mesma lista, com os caminhos reais da sua máquina
```

Uma opção desconhecida mostra a ajuda e sai com o código `2`.

## Modos {#modes}

Passe no máximo um. Sem nenhum, você cai no [passeio guiado](../modes/walkthrough.md).

| Opção | Aliases | O que faz | Página completa |
|---|---|---|---|
| _(nenhuma)_ | `-w` `--walkthrough` | Dez etapas guiadas, com pergunta antes de cada uma | [Passeio guiado](../modes/walkthrough.md) |
| `-m` | `--menu` `-i` `--interactive` | Menu numerado para pular direto | [Menu](../modes/menu.md) |
| `-t` | `--tui` `-g` `--gui` | Menu visual com whiptail / dialog | [TUI](../modes/tui.md) |
| `-a` | `--all-safe` | Limpa de uma vez todos os caches que se regeneram | [Totalmente seguro](../modes/all-safe.md) |
| `-s` | `--scan` | Auditoria somente leitura de todas as categorias | [Verificação](../modes/scan.md) |
| `-p` | `--stale` | Arquivos pessoais grandes sem uso (interativo) | [Arquivos pessoais sem uso](../modes/personal-stale-files.md) |
| | `--system` | apt, journal, snap, `/tmp`, cache de páginas (sudo) | [Limpeza do sistema](../modes/system-cleanup.md) |
| | `--partials` | Downloads incompletos abandonados (interativo) | [Downloads incompletos ou órfãos](../modes/partial-downloads.md) |
| | `--audit` | As 20 maiores entradas de `$HOME` | [Auditoria da pasta pessoal](../modes/home-audit.md) |
| | `--node-modules` | `node_modules` sem uso (interativo) | [Localizador de node_modules parados](../modes/node-modules-finder.md) |
| | `--globals` | Auditoria somente leitura dos pacotes globais | [Auditoria de pacotes globais](../modes/globals-audit.md) |
| | `--doctor` | Repara a inicialização do shell que falta para runtimes | [Doctor](../modes/doctor.md) |
| | `--speed` | Examina a pressão e a inicialização; pergunta antes de mudar | [Diagnóstico de velocidade](../modes/speed.md) |
| | `--editor-ext` | Versões substituídas do VS Code / Cursor | [Extensões de editores](../modes/editor-extensions.md) |
| | `--reports` | Gerenciador interativo dos registros de sessão | [Relatórios](../modes/reports.md) |
| | `--export FMT ID` | Conversão não interativa de registros | [Relatórios](../modes/reports.md#exporting) |
| | `--feedback` | Instruções para relatar bugs, rascunho mailto opcional | [Enviar um relatório de bug](../guides/send-a-bug-report.md) |
| | `--debug-bundle` | Empacota o log e o registro mais recentes num tar.gz | [Enviar um relatório de bug](../guides/send-a-bug-report.md) |
| | `--list-targets` | Mostra todo caminho que pode ser alvo e todo caminho protegido | [Visualizar antes de apagar](../safety/preview-first.md) |
| | `--self-test` | Checa dependências, sintaxe e barreiras de segurança | [Visualizar antes de apagar](../safety/preview-first.md) |
| `-V` | `--version` | Versão e autor | — |
| | `--install-alias` | Adiciona o alias de shell `cleanup` | [Alias do shell e cron semanal](../guides/alias-and-cron.md) |
| | `--install-cron` | `--all-safe -y` semanal, aos domingos às 03:00 | [Alias do shell e cron semanal](../guides/alias-and-cron.md) |
| | `--uninstall-alias` | Remove o alias | [Desinstalar](../guides/uninstall.md) |
| | `--uninstall-cron` | Remove a entrada do cron | [Desinstalar](../guides/uninstall.md) |
| | `--refresh-app` | Atualiza a cópia persistente usada pelo alias e pelo cron | [Instalação](../getting-started/installation.md) |

## Opções {#options}

| Opção | Padrão | Efeito |
|---|---|---|
| `-d N` `--days N` | `100` | Limite de inatividade. Um arquivo só entra quando `atime` **e** `mtime` passam dele. Quanto menor, mais agressivo |
| `--purge-all` | desligada | **Desliga a barreira de inatividade.** Os caches-alvo são apagados por inteiro — o comportamento de antes da 1.2.0 |
| `-y` `--yes` | desligada | Confirma automaticamente os caches que se regeneram. Só vale com `--all-safe`. **Os modos pessoais ignoram** |
| `--no-report` | desligada | Não gera o JSON. Os logs continuam sendo gravados |
| `--cleanup-logs` | desligada | Apaga o log desta execução no fim. **Os registros sempre ficam** |
| `-n` `--dry-run` | desligada | Percorre o modo escolhido sem apagar arquivos nem mudar configurações. Fica um log local; nenhum relatório JSON de sessão é gravado |
| `--json-events` | desligada | [Eventos legíveis por máquina](./json-events.md) no stdout para `--scan` ou `--all-safe --yes`; o texto para pessoas vai para o stderr |
| `--no-color` | desligada | Desliga a cor ANSI. O `NO_COLOR` também é respeitado |
| `-h` `--help` | — | Mostra a ajuda e sai |

:::danger O `--purge-all` tira uma barreira de segurança
Ele desliga a [barreira de inatividade](../safety/guards.md#guard-2--the-staleness-gate), então os caches são apagados inteiros, não importa quando foram usados pela última vez. Recursos caros — distribuições do Gradle wrapper, navegadores do Playwright, binários do Cypress — vão junto. O aviso antes da execução diz qual estratégia está ativa.
:::

:::note Verificação e simulação respondem a perguntas diferentes
O [`--scan`](../modes/scan.md) lê os caminhos e tamanhos atuais. O `--dry-run` percorre a limpeza escolhida e mostra as ações propostas sem apagar. Veja [Visualizar antes de apagar](../safety/preview-first.md).
:::

## Receitas {#recipes}

| Objetivo | Comando |
|---|---|
| Conferir a instalação | `linux-cleanup --self-test` |
| Ver quanto dá para recuperar | `linux-cleanup --scan` |
| Visualizar uma limpeza de caches | `linux-cleanup --all-safe --dry-run` |
| Transmitir uma verificação somente leitura como eventos JSON | `linux-cleanup --scan --json-events` |
| Ver todos os caminhos que ele pode tocar | `linux-cleanup --list-targets` |
| Limpeza guiada | `linux-cleanup` |
| Um lote só, sem perguntas | `linux-cleanup --all-safe -y` |
| Varredura agressiva | `linux-cleanup --all-safe -y -d 30` |
| Recuperar o máximo antes de reinstalar | `linux-cleanup --all-safe -y --purge-all` |
| Menu visual | `linux-cleanup --tui` |
| Pastas de dependências de projetos antigos | `linux-cleanup --node-modules -d 90` |
| Manutenção do sistema | `linux-cleanup --system` |
| Automação semanal | `linux-cleanup --install-cron` |
| Converter o registro mais recente em HTML | `linux-cleanup --export html latest` |
| Relatar um bug | `linux-cleanup --debug-bundle && linux-cleanup --feedback` |

## Variáveis de ambiente {#environment-variables}

As mais usadas, com a [lista completa](./environment-variables.md) à parte:

| Variável | Efeito |
|---|---|
| `NO_COLOR` | Qualquer valor não vazio desliga a cor |
| `LINUX_CLEANUP_LOG_DIR` | Troca a pasta de logs |
| `LINUX_CLEANUP_REPORTS_DIR` | Troca a pasta de registros de sessão |
| `LINUX_CLEANUP_DATA_HOME` | Pasta pai de logs, registros e pacotes de feedback |

## Códigos de saída {#exit-codes}

| Código | Significado |
|---|---|
| `0` | Execução limpa |
| `2` | Erro ao interpretar argumentos ou modo não suportado pelo fluxo de eventos |
| `3` | Uma versão antiga bloqueada pelo registro de versões |
| `130` | Interrompido com `Ctrl-C` |
| `143` | Encerrado por `SIGTERM` |
| outro | Inesperado — grava um pacote de falha |

A tabela completa e a lógica da armadilha de falhas: [Códigos de saída](./exit-codes.md).
