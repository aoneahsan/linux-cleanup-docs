---
title: Códigos de saída
description: O que significa cada código de saída do linux-cleanup, quais geram automaticamente um pacote de falha e como usá-los num script ou numa tarefa do cron.
tags: [exit-codes, scripting, cron, crash-bundle, reference]
sidebar_position: 6
---

# Códigos de saída

**O linux-cleanup segue a convenção do Unix: `0` é sucesso, qualquer outra coisa é problema.** Alguns códigos diferentes de zero são esperados e, de propósito, não são tratados como falha.

## Códigos {#codes}

| Código | Significado | Pacote de falha |
|---|---|---|
| `0` | Execução limpa. Toda ação pedida foi concluída ou recusada | Não |
| `1` | Falha genérica — uma invariante foi violada. Raro | Sim |
| `2` | Erro ao interpretar os argumentos. A ajuda é exibida | Não |
| `3` | Atualização exigida pelo registro público de versões | Não |
| `127` | Comando não encontrado — falta uma dependência necessária | Sim |
| `130` | Interrompido com `Ctrl-C` (SIGINT) | Não |
| `137` | Encerrado por SIGKILL — normalmente o OOM killer ou `kill -9` | Sim |
| `139` | Falha de segmentação. Não deveria acontecer em bash puro | Sim |
| `143` | Encerrado por SIGTERM | Não |
| qualquer outro diferente de zero | Falha interna inesperada | Sim |

Uma opção desconhecida sai com `2` antes de limpar. O `--dry-run` é suportado; ele percorre o modo escolhido sem apagar arquivos. Veja [Visualizar antes de apagar](../safety/preview-first.md).

## Como a armadilha de falhas decide {#how-the-crash-trap-decides}

A armadilha EXIT adicionada na [1.3.0](../changelog.md#130--2026-05-10) avalia nesta ordem:

1. O código de saída é `0`, **ou** o script marcou o indicador interno de conclusão → sem pacote
2. O código de saída é `130` (`Ctrl-C`) ou `143` (SIGTERM) → sem pacote. Uma parada feita pelo usuário não é falha
3. O código de saída é `2` (interpretação dos argumentos) → sem pacote. O script mostrou a ajuda e parou de propósito
4. Qualquer outro caso → grava `crash-<timestamp>.tar.gz` em `~/.linux-cleanup/feedback/`

O pacote traz o log ativo da sessão, o registro JSON mais recente e um manifesto curto do sistema. Ele fica na sua máquina — **nada é enviado**. A ferramenta mostra o caminho para você revisar e decidir se manda por e-mail.

Veja [Enviar um relatório de bug](../guides/send-a-bug-report.md).

## Agindo conforme o código {#branching-on-the-code}

```bash
if linux-cleanup --scan; then
  echo "verificação concluída"
else
  case $? in
    2)   echo "opção inválida" ;;
    127) echo "falta uma dependência — rode --self-test" ;;
    130) echo "interrompido pelo usuário" ;;
    *)   echo "falha inesperada — confira ~/.linux-cleanup/feedback/" ;;
  esac
fi
```

## No cron {#in-cron}

```bash
linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1 || \
  echo "linux-cleanup exited $?" | mail -s "cleanup failed on $(hostname)" you@example.com
```

O código `127` numa tarefa do cron quase sempre significa que o crontab usou o nome do comando sem caminho e o `PATH` mínimo do cron não o encontrou. Use um caminho absoluto — veja [Solução de problemas](../troubleshooting.md#cron-entry-runs-but-does-nothing).

## Diagnosticando um código inesperado a partir de um pacote de falha {#diagnosing-an-unexpected-code-from-a-crash-bundle}

O manifesto do pacote registra o código de saída. Os mais comuns:

| Código | Causa habitual |
|---|---|
| `137` | O OOM killer (falta de memória). Normalmente um `find` numa árvore enorme |
| `141` | SIGPIPE — um pipe fechou antes da hora, muitas vezes na saída de um `tee` ou de um paginador |
| `139` | Falha de segmentação — nunca deveria acontecer aqui; reporte |
| `127` | Falta uma dependência. Rode `--self-test` para descobrir qual |

## Próximos passos {#next}

- [Enviar um relatório de bug](../guides/send-a-bug-report.md)
- [Solução de problemas](../troubleshooting.md)
