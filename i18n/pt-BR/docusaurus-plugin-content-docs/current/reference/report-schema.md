---
title: Esquema do relatório
description: A estrutura JSON que o passeio guiado do linux-cleanup grava, com credits, meta, disk, memory, steps e totals.
sidebar_position: 7
---

# Esquema do relatório

**O passeio guiado grava um registro JSON com `"schema_version": 1`**, a menos que `--no-report` ou `--dry-run` esteja definido. O `--scan` sozinho não grava esse relatório. Para uma verificação legível por máquina, use `--scan --json-events`; esse fluxo tem outra estrutura.

:::warning Documentação mais antiga descreve outra estrutura
Alguns materiais — inclusive uma página de referência dentro do repositório do código — descrevem um formato montado em torno de `schema` (uma string como `linux-cleanup/report/v1`) com os objetos `tool`, `session` e `categories`.

**A ferramenta não emite isso.** Um parser escrito para esse formato vai falhar com todo arquivo real. A estrutura abaixo é a que o `modules/walkthrough.sh` grava. Confira na sua máquina:

```bash
jq 'keys' "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```
:::

## Nível superior {#top-level}

```json
{
  "schema_version": 1,
  "credits": { },
  "meta":    { },
  "disk":    { "before": {}, "after": {} },
  "memory":  { "before": {}, "after": {} },
  "steps":   [ ],
  "totals":  { }
}
```

| Chave | Tipo | Conteúdo |
|---|---|---|
| `schema_version` | número | Hoje é `1`. Recuse qualquer valor que você não reconheça |
| `credits` | objeto | Identidade da ferramenta, licença e autor |
| `meta` | objeto | Contexto da sessão — quando, onde, como e com quais configurações |
| `disk` | objeto | Uso do sistema de arquivos antes e depois |
| `memory` | objeto | Uso de memória antes e depois |
| `steps` | array | Uma entrada por etapa tentada |
| `totals` | objeto | Resumo da sessão |

## `credits` {#credits}

```json
{
  "tool": "linux-cleanup",
  "tool_version": "2.1.1",
  "tool_homepage": "https://linux-cleanup.aoneahsan.com",
  "tool_license": "MIT",
  "author": {
    "name": "Ahsan Mahmood",
    "email": "aoneahsan@gmail.com",
    "website": "https://aoneahsan.com",
    "linkedin": "https://linkedin.com/in/aoneahsan"
  }
}
```

Está aí para que o registro diga de onde veio, onde quer que vá parar. Nada aqui reflete a sua máquina.

## `meta` {#meta}

| Chave | Tipo | Conteúdo |
|---|---|---|
| `tool` | string | Sempre `linux-cleanup` |
| `tool_version` | string | A versão que gravou o registro. Baseie nela a lógica de quem consome |
| `started_at` | string | Horário de início da sessão |
| `finished_at` | string | Horário de fim da sessão |
| `duration_seconds` | número | Duração real |
| `host` | string | Saída do `hostname` |
| `user` | string | `$USER` |
| `mode` | string | O modo que rodou — `walkthrough`, `scan`, `allsafe`, `system` e assim por diante |
| `stale_days` | número | O limite `--days` em vigor |
| `log_file` | string | Caminho absoluto do log desta sessão |
| `launcher` | string | Como foi chamado — `bash` numa execução direta |
| `via_npx` | número | `1` quando rodou pelo inicializador do npm, `0` caso contrário |

Vale guardar o `stale_days`: é a diferença entre uma execução que limpou com 100 dias e outra com `-d 30`, e explica por que duas sessões na mesma máquina recuperaram quantidades diferentes.

## `disk` e `memory` {#disk-and-memory}

Os dois guardam um retrato `before` e outro `after`, tirados no início e no fim da sessão.

O `disk` traz campos do sistema de arquivos — sistema de arquivos, tamanho, usado, disponível e percentual de uso — vindos do `df`. O `memory` traz o equivalente do relatório de memória do sistema.

:::note `after` menos `before` não é só a sua limpeza
São medições da máquina inteira. Um build, uma atualização de pacotes ou um navegador aberto durante a sessão também mexem nelas, por isso a recuperação informada pode ser menor que a soma das etapas — ou negativa. Veja [Solução de problemas](../troubleshooting.md#disk-usage-grew-during-the-session).
:::

## `steps` {#steps}

Um array, com uma entrada por etapa tentada, em ordem:

```json
{ "n": 1, "title": "Package-manager caches", "status": "ran", "freed_bytes": 13315108864 }
```

| Chave | Tipo | Conteúdo |
|---|---|---|
| `n` | número | Número da etapa, a partir de 1 |
| `title` | string | Nome legível da etapa |
| `status` | string | `ran`, `skipped`, `skipped (quit)` ou `skipped (jq missing)` |
| `freed_bytes` | número | Bytes recuperados por esta etapa. `0` quando pulada |

O `skipped (quit)` marca as etapas depois que você apertou `q` — útil para separar uma parada proposital de uma etapa recusada individualmente.

## `totals` {#totals}

| Chave | Tipo | Conteúdo |
|---|---|---|
| `total_reclaimed_bytes` | número | Soma de todas as etapas |
| `total_reclaimed_human` | string | O mesmo, formatado |
| `steps_run` | número | Etapas com status `ran` |
| `steps_skipped` | número | Etapas com algum status `skipped` |

## Lendo com jq {#parsing}

```bash
LATEST="$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

jq '.totals.total_reclaimed_human' "$LATEST"
jq '.meta | {mode, stale_days, duration_seconds}' "$LATEST"
jq '.steps[] | select(.status == "ran") | "\(.title): \(.freed_bytes)"' "$LATEST"

# Recuperação somando todas as sessões registradas
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## Validação {#validating}

Nenhum arquivo JSON Schema vem com a ferramenta. Uma checagem de estrutura:

```bash
jq -e 'has("schema_version") and .schema_version == 1
       and has("meta") and has("steps") and has("totals")' \
  ~/.linux-cleanup/reports/report-*.json
```

Mostra `true` para cada arquivo válido.

## Orientações de compatibilidade {#compatibility-guidance}

Ao escrever um consumidor:

- **Decida pelo `schema_version`.** Trate um valor desconhecido como impossível de ler em vez de adivinhar
- **Trate chaves desconhecidas como acréscimos.** Campos já foram adicionados dentro da versão 1 e podem ser de novo
- **Use o `meta.tool_version`** para comportamentos que mudam entre versões
- **Não presuma que todo modo preenche todas as seções.** Modos somente leitura geram menos etapas
- **Conte com um `total_reclaimed_bytes` negativo de vez em quando.** É uma diferença do `df`, não uma soma do que foi apagado

## Próximos passos {#next}

- [Relatórios](../modes/reports.md) — ver e exportar
- [Caminhos de saída](./output-paths.md) — onde os arquivos ficam
