---
title: Extensões de editores
description: Remova versões substituídas de extensões do VS Code e do Cursor — as cópias antigas que ficam quando uma extensão atualiza — passando por uma checagem de substituição e pelo limite de ociosidade.
sidebar_position: 11
---

# Extensões de editores

**O `--editor-ext` remove versões substituídas de extensões do VS Code e do Cursor.** Quando uma extensão atualiza, a pasta da versão antiga costuma ficar no disco. Numa máquina com muitas extensões e alguns anos de atualizações, isso chega a centenas de megabytes.

```bash
linux-cleanup --editor-ext
```

## As duas condições {#the-two-conditions}

Uma pasta de versão só vira candidata quando **as duas** valem:

1. **Existe uma versão mais nova da mesma extensão** — a versão atual nunca é candidata
2. **Essa versão antiga está ociosa há `--days` dias ou mais** (100 por padrão)

A segunda condição chegou na [1.2.1](../changelog.md#121--2026-05-10). Antes, bastava estar substituída, o que removia versões antigas que você tinha carregado havia pouco. A saída mostra os dias ociosos de cada versão, para você ver por que algo foi mantido.

## O que ele não toca {#what-it-does-not-touch}

- A versão atual de qualquer extensão
- Configurações, atalhos de teclado ou estado do workspace das extensões
- Qualquer coisa em `~/.config` — essa árvore toda é [protegida](../reference/protected-paths.md)
- Extensões de editores que não sejam o VS Code e o Cursor

## Depois de rodar {#after-running-it}

Se o VS Code mostrar um aviso de extensão faltando, recarregue a janela: `Ctrl+Shift+P` → **Developer: Reload Window**. O editor está segurando uma referência a uma pasta que não existe mais.

Se uma extensão realmente sumiu — o que significaria que a detecção da "versão mais alta" identificou errado a atual —, reinstale e, por favor, [reporte o bug](../guides/send-a-bug-report.md):

```bash
code --install-extension <publisher>.<name>
```

## Quanto se espera recuperar {#expected-reclaim}

O tamanho depende das versões substituídas instaladas nesta máquina. Use uma verificação para conferir a pasta atual antes de decidir se vai limpá-la.

## No passeio guiado e no modo totalmente seguro {#in-the-walkthrough-and-all-safe}

Roda como etapa 4 do [passeio guiado](./walkthrough.md) e está incluído no [`--all-safe`](./all-safe.md), já que só remove cópias substituídas e regeneráveis.

## Próximos passos {#next}

- [O limite de ociosidade](../safety/guards.md#guard-2--the-staleness-gate)
- [Visão geral dos modos](./overview.md)
