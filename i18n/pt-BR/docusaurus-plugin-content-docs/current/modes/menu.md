---
title: Menu
description: O menu numerado que permite rodar uma categoria do linux-cleanup por vez em vez do passeio completo.
tags: [menu, interactive, modes]
sidebar_position: 4
---

# Menu

**O `--menu` mostra uma lista numerada de todas as categorias e roda a que você escolher.** Use quando você sabe o que quer e não precisa do passeio de dez etapas.

```bash
linux-cleanup --menu     # ou: -m, -i, --interactive
```

## No que ele difere do passeio guiado {#how-it-differs-from-the-walkthrough}

| | Menu | [Passeio guiado](./walkthrough.md) |
|---|---|---|
| Ordem | Você escolhe | Fixa, dez etapas |
| Escopo | Uma categoria por escolha | Tudo, em sequência |
| Repetição | Volta ao menu depois | Vai até o fim |
| Relatório | Por ação | Um relatório da sessão |
| Melhor para | Limpeza pontual | Primeiras execuções, limpezas completas |

O modelo de segurança é o mesmo. Cada categoria se comporta exatamente como no passeio guiado — a [lista de caminhos permitidos](../safety/guards.md#guard-1--the-path-allowlist), o [limite de ociosidade](../safety/guards.md#guard-2--the-staleness-gate) e a confirmação por alvo continuam valendo. Escolher uma categoria de dados pessoais no menu ainda gera perguntas item por item, e `--yes` continua sem efeito nela.

## As opções continuam valendo {#options-still-apply}

```bash
linux-cleanup --menu -d 30        # limite de 30 dias para o que você escolher
linux-cleanup --menu --purge-all  # limite de ociosidade desligado
linux-cleanup --menu --no-color   # saída simples
```

## Quando usar a TUI {#when-to-use-the-tui-instead}

O [`--tui`](./tui.md) é o mesmo menu exibido numa caixa do whiptail ou do dialog. Ele precisa de um dos dois instalado; o `--menu` só precisa do bash e funciona em qualquer conexão, inclusive num terminal simples ou numa sessão `ssh -T` em que uma caixa de tela cheia daria problema.

## Próximos passos {#next}

- [TUI](./tui.md) — a versão visual
- [Visão geral dos modos](./overview.md) — todas as categorias do menu
