---
title: Tabela de modos
description: "Todos os modos do linux-cleanup lado a lado: se apagam, se são interativos, se usam sudo e se gravam um registro de sessão."
tags: [modes, matrix, reference, comparison]
sidebar_position: 2
---

# Tabela de modos

Todos os modos de uma vez. Use para responder “isso vai apagar alguma coisa?” sem ler uma página inteira.

## A tabela {#the-matrix}

| Modo | Opção | Apaga | Interativo | sudo | Grava registro |
|---|---|---|---|---|---|
| [Passeio guiado](../modes/walkthrough.md) | _(nenhuma)_ `-w` | Sim | Sim | Só a etapa 8 | Sim |
| [Menu](../modes/menu.md) | `-m` | Sim | Sim | Se escolhido | Não |
| [TUI](../modes/tui.md) | `-t` | Sim | Sim | Se escolhido | Não |
| [Totalmente seguro](../modes/all-safe.md) | `-a` | Sim | A menos que use `-y` | Não | Não |
| [Verificação](../modes/scan.md) | `-s` | **Não** | Não | Não | Não |
| [Arquivos pessoais sem uso](../modes/personal-stale-files.md) | `-p` | Sim | **Sempre** | Não | Não |
| [Sistema](../modes/system-cleanup.md) | `--system` | Sim | Sim | **Sim** | Não |
| [Downloads incompletos](../modes/partial-downloads.md) | `--partials` | Sim | **Sempre** | Não | Não |
| [Auditoria da pasta pessoal](../modes/home-audit.md) | `--audit` | **Não** | Não | Não | Não |
| [node_modules](../modes/node-modules-finder.md) | `--node-modules` | Sim | **Sempre** | Não | Não |
| [Auditoria de pacotes globais](../modes/globals-audit.md) | `--globals` | **Não** | Não | Não | Não |
| [Doctor](../modes/doctor.md) | `--doctor` | **Não** — só acrescenta | Sim | Não | Não |
| [Extensões de editores](../modes/editor-extensions.md) | `--editor-ext` | Sim | Sim | Não | Não |
| [Velocidade](../modes/speed.md) | `--speed` | Não apaga arquivos; configurações opcionais | Sim | Não | Não |
| [Relatórios](../modes/reports.md) | `--reports` | Só registros | Sim | Não | Não |
| Exportar | `--export` | **Não** | Não | Não | Não |
| Feedback | `--feedback` | **Não** | Sim | Não | Não |
| Pacote de depuração | `--debug-bundle` | **Não** | Não | Não | Não |
| Listar alvos | `--list-targets` | **Não** | Não | Não | Não |
| Autoteste | `--self-test` | **Não** | Não | Não | Não |
| Versão | `-V` | **Não** | Não | Não | Não |
| Instalar alias | `--install-alias` | **Não** | Sim | Não | Não |
| Instalar cron | `--install-cron` | **Não** | Sim | Não | Não |
| Atualizar o aplicativo para desktop | `--refresh-app` | Atualiza o aplicativo a partir de uma versão | Sim | Não | Não |
| Desinstalar alias | `--uninstall-alias` | A linha do alias | Sim | Não | Não |
| Desinstalar cron | `--uninstall-cron` | A linha do cron | Sim | Não | Não |

## Modos que nunca apagam nada {#modes-that-never-delete-anything}

Estes comandos não apagam alvos de limpeza. Alguns gravam logs locais, relatórios, exportações ou pacotes de diagnóstico:

`--scan` · `--audit` · `--globals` · `--list-targets` · `--self-test` · `--version` · `--export` ·
`--feedback` · `--debug-bundle`

O `--doctor` também entra aqui, com uma ressalva: ele altera a configuração do seu shell, mas só **acrescentando** linhas depois da confirmação. Nunca remove nem reescreve uma linha existente.

## Modos afetados pelo `--yes` {#modes---yes-affects}

Exatamente um: [`--all-safe`](../modes/all-safe.md).

Os modos interativos de dados pessoais — `--stale`, `--partials`, `--node-modules` — pedem as próprias confirmações. Veja [a barreira 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

## Modos em que a barreira de inatividade vale {#modes-the-staleness-gate-applies-to}

| Vale | Não vale |
|---|---|
| Limpeza de caches no passeio guiado, no menu, na TUI e no modo totalmente seguro | `--system` (usa a própria regra fixa de 7 dias para `/tmp`) |
| Substituição de versões no `--editor-ext` | `--partials` (a idade não é o critério) |
| `--node-modules` | Modos somente leitura (nada é apagado) |
| `--stale` |  |
| Dados de ferramentas de desenvolvimento (AVDs, flatpak, pub-cache) |  |

O `--purge-all` desliga a barreira onde ela valeria.

## Quais modos precisam de dependências opcionais {#which-modes-need-optional-dependencies}

| Modo | Precisa de | Sem ela |
|---|---|---|
| `--tui` | `whiptail` ou `dialog` | Volta para o `--menu` com uma dica de instalação |
| Conversão do `--export` e do `--reports` | `jq` | O JSON ainda é gravado; a conversão fica indisponível |
| `--install-cron` | `crontab` | Não roda |
| Etapa de snap do `--system` | `snap` | A etapa é pulada sem problemas |
| Etapas de apt do `--system` | `apt`, `dpkg` | **Falha** — [só Debian/Ubuntu](../distro-support.md) |

## Próximos passos {#next}

- [Opções da CLI](./cli-flags.md) — cada opção em detalhe
- [Visão geral dos modos](../modes/overview.md) — agrupados por finalidade
