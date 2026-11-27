---
title: Verificação (somente leitura)
description: Confira raízes de cache, downloads incompletos e outros candidatos à limpeza no Linux sem apagar arquivos.
sidebar_position: 3
---

# Verificação (somente leitura)

**O `--scan` lista caminhos e o tamanho atual de cada um sem apagar arquivos.** É uma primeira olhada na máquina. Para ver as ações propostas, use uma simulação do modo de limpeza escolhido.

```bash
linux-cleanup --scan
```

## O que ele confere? {#what-does-it-inspect}

A verificação mostra uma tabela de raízes de cache e de ferramentas de build: gerenciadores de pacotes, navegadores, Gradle, executores de testes, ferramentas do Android e outros locais configurados. Também lista downloads incompletos, downloads provavelmente duplicados, arquivos pessoais grandes e sem uso que são candidatos e algumas observações sobre o sistema. Ela não roda a limpeza dos gerenciadores de pacotes nem pede `sudo`.

O tamanho de uma raiz de cache listada cobre tudo o que está nela agora. **Não** é o quanto a ferramenta vai remover. O modo escolhido, o limite de ociosidade, o uso atual e as regras de recusa definem o que fica.

A verificação grava um log local da sessão. Ela não grava o [relatório JSON da sessão](../reference/report-schema.md) do passeio guiado.

## Leia os caminhos antes de escolher um modo {#read-the-paths-before-choosing-a-mode}

Confira qualquer caminho que você não reconheça. Um link simbólico pode apontar para um lugar diferente do que o nome sugere; inspecione com `realpath` antes de uma limpeza. A proteção de caminhos também resolve links simbólicos antes de apagar.

Arquivos pessoais candidatos aparecem só para revisão. A limpeza de rotina `--all-safe` não os seleciona. Para visualizar uma limpeza de cache:

```bash
linux-cleanup --all-safe --dry-run
```

A simulação percorre esse modo sem apagar. Ela ainda pode gravar um log local e o estado da checagem de atualizações. Uma exclusão real não tem como desfazer.

## Verificação legível por máquina {#machine-readable-scan}

```bash
linux-cleanup --scan --json-events > scan.ndjson
```

O [fluxo de eventos da versão 1](../reference/json-events.md) vai para o stdout; o texto para pessoas vai para o stderr. Ele pode conter caminhos locais completos. Mantenha-o nesta máquina e use o código de saída para distinguir uma execução completa de um fluxo interrompido.

## Outras visões somente leitura {#other-read-only-views}

| Comando | Pergunta que responde |
|---|---|
| `--list-targets` | Quais caminhos configurados um modo pode atingir ou recusar? |
| `--audit` | Quais entradas do `$HOME` são as maiores, estejam ou não cobertas por um modo de limpeza? |
| `--globals` | Quais pacotes globais de runtimes estão instalados? |
| `--self-test` | Os comandos necessários, a sintaxe e as checagens das proteções passam? |

Leia [Visualizar antes de apagar](../safety/preview-first.md) para a ordem e depois [Opções da CLI](../reference/cli-flags.md) para as opções de cada modo.
