---
title: Downloads incompletos ou órfãos
description: Encontre e remova arquivos de downloads incompletos abandonados — .crdownload, .part e .fdmdownload — deixados por transferências interrompidas de navegadores e gerenciadores de download.
sidebar_position: 10
---

# Downloads incompletos ou órfãos

**O `--partials` encontra arquivos de downloads incompletos abandonados e oferece apagá-los.** São os arquivos provisórios que um navegador ou gerenciador de download grava durante a transferência e esquece de limpar quando ela é interrompida.

```bash
linux-cleanup --partials
```

## O que ele procura {#what-it-looks-for}

| Extensão | Gravada por |
|---|---|
| `.crdownload` | Chrome, Chromium, Brave, Edge, Vivaldi |
| `.part` | Firefox, wget, aria2 |
| `.fdmdownload` | Free Download Manager |

Um arquivo incompleto guarda os bytes que chegaram antes de a transferência cair — às vezes uns poucos kilobytes, às vezes quase uma ISO inteira de vários gigabytes.

## Só no modo interativo {#interactive-only}

Confirmação arquivo por arquivo, `--yes` ignorado, fora do [`--all-safe`](./all-safe.md). Veja a [barreira 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

## O que custa apagar um {#what-deleting-one-costs-you}

:::caution Um arquivo incompleto talvez ainda possa ser retomado — mas normalmente não
Retomar exige a sessão de download original: o item no gerenciador de downloads do navegador, a URL de origem e um servidor que aceite requisições por intervalo. Se o navegador foi reiniciado ou o item do download foi apagado, o arquivo incompleto não pode mais ser retomado e é puro desperdício.

O arquivo, sozinho, nunca serve para nada — um arquivo compactado baixado pela metade não abre. Então a única pergunta prática é se você ainda pretende retomar.
:::

Confira antes de aceitar apagar um grande:

- Abra a página de downloads do navegador e procure um item pausado ou com falha com o mesmo nome de arquivo
- Se houver, retome por lá em vez de apagar o arquivo incompleto
- Se não houver, o arquivo incompleto está órfão e pode ser removido com segurança

## Um download em andamento também vai aparecer aqui {#an-active-download-will-show-up-here}

Um download que está rodando *agora* também tem um arquivo `.crdownload` ou `.part`. A ferramenta não tem como distinguir uma transferência em andamento de uma abandonada. Apagar um arquivo incompleto ativo quebra a transferência em andamento — então confira a página de downloads se estiver em dúvida, ou rode este modo quando nada estiver baixando.

## No passeio guiado {#in-the-walkthrough}

Etapa 6 do [passeio guiado](./walkthrough.md).

## Próximos passos {#next}

- [Arquivos pessoais sem uso](./personal-stale-files.md) — o modo interativo relacionado
- [Apagar é permanente](../safety/irreversibility.md)
