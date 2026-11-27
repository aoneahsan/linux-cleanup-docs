---
title: Relatórios
description: O passeio guiado pode gravar um registro JSON da sessão. Liste, veja, converta para Markdown ou HTML e exporte esses registros.
sidebar_position: 15
---

# Relatórios

**O passeio guiado grava um registro JSON da sessão** em `~/.linux-cleanup/reports/report-<timestamp>.json`, a menos que `--no-report` ou `--dry-run` esteja definido. Os outros modos não criam esse registro. Registros existentes não são apagados automaticamente.

Markdown e HTML são conversões opcionais, geradas sob demanda.

```bash
linux-cleanup --reports              # gerenciador interativo
linux-cleanup --export both latest   # conversão não interativa
```

## O que um registro de sessão contém {#what-a-session-record-contains}

| Seção | Guarda |
|---|---|
| `schema_version` | Atualmente `1` |
| `credits` | Nome, versão, página, licença e dados do autor da ferramenta |
| `meta` | Marcas de tempo, duração, máquina, usuário, modo, limite de ociosidade, caminho do log, lançador |
| `disk` | Uso do sistema de arquivos antes e depois |
| `memory` | Uso de memória antes e depois |
| `steps` | Um item por etapa: número, título, status, bytes liberados |
| `totals` | Total de bytes recuperados, total legível, etapas executadas e puladas |

Referência completa, campo por campo: [Esquema do relatório](../reference/report-schema.md).

## O gerenciador interativo {#the-interactive-manager}

```bash
linux-cleanup --reports
```

Lista as sessões anteriores e permite ver uma, convertê-la para Markdown ou HTML, abrir o HTML no navegador ou apagá-la.

As opções de conversão ficam escondidas quando o `jq` não está instalado — veja [abaixo](#jq-is-required-for-conversion).

## Exportando {#exporting}

Sem perguntas, para scripts e hábitos:

```bash
linux-cleanup --export both latest   # Markdown + HTML do registro mais recente
linux-cleanup --export html all      # todos os registros em HTML
linux-cleanup --export md 3          # o registro nº 3 em Markdown
```

| Argumento | Aceita |
|---|---|
| Formato | `md`, `html`, `both` |
| Identificador | um número de registro, `latest` ou `all` |

A saída fica ao lado do JSON, com a mesma marca de tempo no nome do arquivo. O HTML é autossuficiente — CSS embutido, compatível com modo escuro, sem recursos externos —, então pode ser mandado por e-mail ou arquivado como um arquivo só.

## A conversão exige o `jq` {#jq-is-required-for-conversion}

:::note O JSON é sempre gravado; a conversão é a parte opcional
Sem o `jq`, um passeio guiado continua gerando o registro JSON. Só as exportações para Markdown e HTML ficam indisponíveis, e a etapa 10 do passeio se registra como `skipped (jq missing)`.

```bash
sudo apt install jq      # Debian / Ubuntu
sudo dnf install jq      # Fedora / RHEL
sudo pacman -S jq        # Arch
```
:::

O HTML gerado escapa todo valor vindo do JSON pelo filtro `@html` do `jq`, então uma entrada malformada não consegue injetar marcação na página renderizada.

## Consultando o JSON diretamente {#querying-the-json-directly}

O JSON foi feito para ser lido por ferramentas:

```bash
# Total recuperado na sessão mais recente
jq '.totals.total_reclaimed_human' ~/.linux-cleanup/reports/report-*.json | tail -1

# Cada etapa que realmente rodou, na sessão mais recente
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

# Total recuperado em todas as sessões registradas
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## Retenção {#retention}

Esses registros **nunca** são apagados automaticamente — nem pelo `--cleanup-logs`, que só remove o arquivo de log da execução atual.

Para enxugá-los você mesmo:

```bash
find ~/.linux-cleanup/reports/ -name 'report-*' -mtime +90 -delete
```

Para não gerar em uma execução, use `--no-report`; o log continua sendo gravado.

## São registros, não backups {#these-are-records-not-backups}

:::danger Um registro de sessão é um resumo das etapas, não um backup
Ele registra etapas e observações do disco, não uma lista completa de cada arquivo removido. Não contém nada do conteúdo removido, e nada nele restaura coisa alguma. O valor dele depois de uma exclusão indesejada é ajudar você a identificar o que restaurar do seu próprio backup, ou baixar de novo. Veja [Recuperação](../recovery.md).
:::

## Próximos passos {#next}

- [Esquema do relatório](../reference/report-schema.md) — todos os campos
- [Caminhos de saída](../reference/output-paths.md) — onde os arquivos ficam
- [Recuperação](../recovery.md) — usando um registro de sessão depois de um susto
