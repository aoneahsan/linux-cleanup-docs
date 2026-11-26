---
title: Eventos legíveis por máquina
description: Eventos NDJSON da versão 1 para verificações locais e execuções totalmente seguras não interativas.
tags: [json, events, scan, dry-run, reference]
sidebar_position: 8
---

# Eventos legíveis por máquina

O `--json-events` grava JSON delimitado por quebras de linha no stdout. O texto para pessoas e as perguntas vão para o stderr, com uma cópia local no log da sessão. O fluxo fica nesta máquina; ele pode conter caminhos locais completos. Quem consome não deve enviar esses caminhos como parte de dados de conta ou de analytics.

A opção funciona com `--scan` e `--all-safe --yes`. Uma execução totalmente segura precisa de `--yes` para que um cliente automático não fique parado numa pergunta. Acrescente `--dry-run` para visualizar a ação totalmente segura sem apagar arquivos. Um log local e o estado da checagem de atualizações ainda podem ser gravados. Os outros modos retornam o código de saída 2.

```bash
linux-cleanup --scan --json-events > scan.ndjson
linux-cleanup --all-safe --yes --dry-run --json-events > preview.ndjson
```

Todo evento completo tem `v: 1`, um `type` e `ts` (milissegundos Unix). Quem consome deve recusar um `v` maior e ignorar campos desconhecidos na versão 1. O ID do modo é uma string: `scan` ou `allsafe`.

| Evento | Campos | Significado |
|---|---|---|
| `plan` | `version`, `dry_run`, `profile`, `sections[]` | Primeiro evento; uma seção para o modo escolhido. Uma seção tem `id`, `title`, `stamp`, `sudo`, `deep`. |
| `disk` | `phase`, `total_kb`, `free_kb`, `purgeable_kb`, `snapshots`, `snapshot_note` | Amostra do disco antes e depois do modo. Estimativas não suportadas são `null`. |
| `section_start` | `id`, `title`, `stamp` | O modo escolhido começou. |
| `item` | `id`, `path`, `kb`, `action`, `unique`, `age_days`, `reason` | Um resultado da verificação somente leitura ou um caminho escolhido por um auxiliar de limpeza. `report` só lê, `delete` é uma ação proposta numa simulação e uma ação concluída do auxiliar numa execução real, `skip` é uma recusa. `kb` é truncado para KiB inteiros. |
| `progress` | `id`, `done`, `total` | O único modo escolhido está em 0/1 ou 1/1. É um limite do modo, não um percentual por arquivo. |
| `error` | `id`, `message` | Uma falha ou recusa informada pela CLI. |
| `section_result` | `id`, `status`, `freed_kb`, `items`, `reason` | O status é `completed` ou `failed`. Os totais de bytes e de itens continuam `null` até a CLI conseguir separar as próprias gravações de outras atividades do disco. |
| `summary` | `attempted`, `completed`, `skipped`, `failed`, `freed_kb`, `disk_free_before_kb`, `disk_free_after_kb`, `elapsed_s`, `reports`, `log`, `dry_run` | Último evento depois de um modo concluído. As duas amostras de espaço livre são observações, não uma afirmação dos bytes recuperados por este processo. |

Numa execução concluída, o fluxo começa com `plan` e termina com `summary`. Um processo interrompido ou uma exigência de atualização não atendida pode não deixar summary; trate isso como execução incompleta e use o código de saída e o stderr. Um argumento recusado pode emitir um evento `error` e sair com 2 antes do plan. Sem a opção, a saída de texto e os códigos de saída não mudam.

O fluxo de eventos complementa o relatório JSON local da sessão. Uma simulação não grava relatório de sessão. Quem consome pode usar o `item.path` para explicar uma decisão local e depois descartá-lo, em vez de sincronizar com um servidor. Quando o `--cleanup-logs` remove o log da sessão, `summary.log` é `null`.
