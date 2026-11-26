---
title: Caminhos de saída
description: "Onde o linux-cleanup grava os logs, os registros JSON de sessão, os pacotes de depuração e os de falha: a estrutura, os padrões por forma de instalação, a retenção e as permissões."
tags: [output, paths, logs, reports, feedback, retention, reference]
sidebar_position: 5
---

# Caminhos de saída

**Toda a saída fica sob uma única raiz de dados.** Qual raiz depende de como você instalou a ferramenta, e as duas podem ser trocadas.

## Estrutura {#layout}

```text
$DATA_HOME/
├── logs/
│   ├── cleanup-<YYYY-MM-DD_HHMMSS>.log     # um por sessão
│   └── cron.log                             # acrescentado pelo cron semanal
├── reports/
│   ├── report-<YYYY-MM-DD_HHMMSS>.json     # registro do passeio guiado, a menos que desativado
│   ├── report-<YYYY-MM-DD_HHMMSS>.md       # criado pelo --export md
│   └── report-<YYYY-MM-DD_HHMMSS>.html     # criado pelo --export html
└── feedback/
    ├── debug-bundle-<YYYY-MM-DD_HHMMSS>.tar.gz   # criado pelo --debug-bundle
    └── crash-<YYYY-MM-DD_HHMMSS>.tar.gz          # criado automaticamente numa falha
```

## Padrões por forma de instalação {#per-install-defaults}

| Instalado via | `$DATA_HOME` |
|---|---|
| `npx linux-cleanup` | `~/.linux-cleanup/` |
| `npm install -g linux-cleanup` | `~/.linux-cleanup/` |
| `git clone` | A própria pasta do clone |

A diferença é proposital. O `npx` roda o pacote de uma pasta temporária do cache do npm que é limpa, então o que fosse gravado lá se perderia; `~/.linux-cleanup/` permanece entre execuções. Um clone já é um local permanente, então a saída fica ao lado do código.

Troque qualquer um com [`LINUX_CLEANUP_DATA_HOME`](./environment-variables.md), ou as pastas de logs e de registros separadamente.

## Retenção {#retention}

| Caminho | Limpeza automática | Observações |
|---|---|---|
| `logs/cleanup-*.log` | Só com `--cleanup-logs` | Essa opção apaga no fim o log **desta execução**. Os anteriores ficam |
| `logs/cron.log` | Nunca | Nunca é rotacionado. Rotacione você mesmo se crescer |
| `reports/*.json` | **Nunca** | O histórico de auditoria duradouro |
| `reports/*.md`, `*.html` | **Nunca** | Criados sob demanda, removidos sob demanda |
| `feedback/*.tar.gz` | **Nunca** | Você decide quando não são mais necessários |

O `--cleanup-logs` é a única remoção automática que a ferramenta faz na própria saída, e só mexe em arquivos `.log`.

## Tamanho e retenção {#size-and-retention}

O tamanho dos logs e pacotes depende dos caminhos e eventos de cada execução. Veja o que se acumulou antes de apagar registros antigos. Para enxugar arquivos antigos de propósito:

```bash
find ~/.linux-cleanup/logs/    -name 'cleanup-*.log' -mtime +90 -delete
find ~/.linux-cleanup/reports/ -name 'report-*'      -mtime +90 -delete
```

Rotacionando o log do cron:

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## Permissões {#permissions}

Os arquivos pertencem ao usuário que executa a ferramenta. Confira as permissões efetivas com `stat` na sua máquina; contam tanto as permissões de pasta configuradas pela ferramenta quanto o umask do processo. Não compartilhe um log ou pacote sem ler antes.

## O que esses arquivos contêm {#what-these-files-contain}

:::caution Logs e pacotes contêm os seus caminhos
Um log de sessão cita cada caminho tocado, ou seja, contém nomes de pastas da sua máquina — nomes de projetos e, às vezes, nomes de arquivos de `~/Downloads`.

Isso fica só na máquina e nunca é enviado, mas revise um pacote antes de mandá-lo por e-mail:

```bash
tar -tzf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz
```

Veja [Enviar um relatório de bug](../guides/send-a-bug-report.md).
:::

Nada aqui contém o **conteúdo** dos arquivos — só caminhos, tamanhos e horários. São registros do que aconteceu, não cópias do que foi apagado. Veja [Recuperação](../recovery.md).

## Próximos passos {#next}

- [Variáveis de ambiente](./environment-variables.md) — trocando esses locais
- [Esquema do relatório](./report-schema.md) — a estrutura JSON
