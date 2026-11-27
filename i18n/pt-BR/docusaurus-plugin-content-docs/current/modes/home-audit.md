---
title: Auditoria da pasta pessoal
description: Uma lista somente leitura das 20 maiores entradas da sua pasta pessoal, o linux-cleanup consiga limpá-las ou não — o jeito mais rápido de descobrir o que realmente está ocupando o disco.
sidebar_position: 13
---

# Auditoria da pasta pessoal

**O `--audit` lista as 20 maiores entradas do `$HOME`, ordenadas por tamanho.** Ele não apaga nada e não se importa se a ferramenta consegue limpar o que encontra.

```bash
linux-cleanup --audit
```

## No que ele difere do `--scan` {#why-this-is-different-from---scan}

O [`--scan`](./scan.md) mede as categorias que o linux-cleanup sabe limpar. O `--audit` mede a sua pasta pessoal, e pronto.

Essa diferença é justamente o ponto. Se o que encheu o disco foi uma imagem de máquina virtual de 60 GB, um conjunto de dados baixado ou uma biblioteca do Steam, o `--scan` nunca vai mencionar, e o `--audit` vai colocar no topo da lista.

| | `--audit` | `--scan` |
|---|---|---|
| Escopo | Tudo no `$HOME` | Só categorias que dá para limpar |
| Responde | O que está ocupando meu disco? | O que esta ferramenta consegue recuperar? |
| Grava relatório JSON da sessão | Não | Não |
| Apaga | Nunca | Nunca |

## O fluxo de sempre {#the-usual-workflow}

```bash
linux-cleanup --audit    # o que é grande?
linux-cleanup --scan     # o que esta ferramenta consegue recuperar?
```

Se as primeiras entradas da auditoria aparecerem na verificação, a ferramenta pode ajudar. Se não aparecerem, você descobriu algo mais útil: o espaço está num lugar aonde esta ferramenta não vai, e você pode cuidar disso diretamente.

Coisas grandes comuns que o linux-cleanup **não** limpa:

- Imagens de máquinas virtuais e armazenamento de contêineres (`~/.local/share/libvirt`, `~/.local/share/docker`)
- Bibliotecas de jogos (Steam, Lutris)
- Conjuntos de dados, pesos de modelos, bibliotecas de mídia
- Qualquer coisa em `~/Documents`, `~/Pictures`, `~/Music`, `~/Videos` — todas [protegidas](../reference/protected-paths.md)

## Investigando um achado {#following-up-on-a-finding}

```bash
du -sh ~/.local/share/*      | sort -rh | head -20
du -sh ~/*                   | sort -rh | head -20
```

O `--audit` é a primeira passada rápida; o `du` afunila quando você já sabe onde olhar.

## Próximos passos {#next}

- [Verificação](./scan.md) — o que a ferramenta consegue recuperar
- [Recuperar o máximo de espaço](../guides/reclaim-the-most-space.md)
