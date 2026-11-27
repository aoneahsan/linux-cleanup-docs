---
title: TUI (menu visual)
description: O menu visual com whiptail ou dialog, lançado no linux-cleanup 1.3.0, que volta ao menu da CLI quando nenhum dos dois está instalado.
sidebar_position: 5
---

# TUI (menu visual)

**O `--tui` mostra o menu de categorias numa caixa do whiptail ou do dialog em tela cheia.** Chegou na [1.3.0](../changelog.md#130--2026-05-10). Mesmo comportamento do [`--menu`](./menu.md), apresentação diferente.

```bash
linux-cleanup --tui      # ou: -t, -g, --gui
```

## Como funciona {#how-it-behaves}

Ao escolher um item, você sai da caixa, a categoria roda com a saída e as perguntas normais da CLI e depois volta ao menu. Ou seja, a caixa é só um lançador — as confirmações de verdade continuam sendo as perguntas em texto de sempre, e todas as proteções continuam iguais.

A TUI também tem uma caixa **Sobre** com a versão, os contatos, a licença e o compromisso de privacidade.

## Requisitos e alternativa {#requirements-and-fallback}

Precisa do `whiptail` ou do `dialog`. Se nenhum dos dois estiver instalado, a ferramenta mostra uma dica de instalação para a sua distribuição e volta ao menu normal da CLI — ela não falha.

```bash
sudo apt install whiptail     # Debian / Ubuntu
sudo dnf install newt         # Fedora / RHEL
sudo pacman -S libnewt        # Arch
```

O `whiptail` vem dentro dos pacotes `newt` / `libnewt` em sistemas RPM e Arch, por isso o nome do pacote não bate com o do comando.

:::note Este é o único lugar em que a ferramenta detecta a sua distribuição
A dica de instalação acima leva a distribuição em conta. Mais nada no linux-cleanup faz isso — em especial, o [`--system` parte do princípio de que é Debian/Ubuntu](../distro-support.md).
:::

## Quando usar o menu simples {#when-to-use-the-plain-menu}

O `--tui` precisa de um terminal que consiga mostrar uma caixa em tela cheia. Numa conexão limitada, dentro de um log de CI ou numa sessão `ssh -T` sem TTY, use o [`--menu`](./menu.md) — ele só precisa do bash.

## Próximos passos {#next}

- [Menu](./menu.md) — o equivalente em texto
- [Visão geral dos modos](./overview.md)
