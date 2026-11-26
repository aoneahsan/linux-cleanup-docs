---
title: Visualizar antes de apagar
description: Use uma verificação somente leitura e uma simulação para conferir os caminhos do linux-cleanup antes de uma exclusão permanente.
tags: [safety, dry-run, scan, preview, read-only]
sidebar_position: 2
---

# Visualizar antes de apagar

**Comece com `--scan` e depois rode o modo de limpeza com `--dry-run`.** A verificação mostra caminhos e tamanhos sem apagar nada. A simulação percorre a limpeza escolhida e mostra as ações que faria, sem remover arquivos nem mudar configurações. As duas ainda criam um log local da sessão.

```bash
linux-cleanup --self-test
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

`--self-test` confere as dependências, a sintaxe do Bash e a proteção de caminhos. Pare se ele falhar.

## O que a verificação mostra?

`--scan` lista raízes de cache, downloads incompletos, downloads provavelmente duplicados, arquivos pessoais grandes e sem uso que são candidatos e observações sobre o sistema. O tamanho que ela mostra para uma raiz de cache é **tudo o que existe ali agora**, e não o quanto uma limpeza posterior vai remover. O limite padrão de ociosidade de 100 dias, o uso atual e as regras de cada modo podem manter a maior parte.

A verificação não cria um relatório JSON da sessão. Se precisar de uma verificação legível por máquina, use `linux-cleanup --scan --json-events`. O fluxo de eventos pode incluir caminhos locais completos; mantenha-o na sua máquina.

## O que a simulação mostra?

`--dry-run` percorre a limpeza escolhida e mostra as ações propostas. Por exemplo:

```bash
linux-cleanup --all-safe --dry-run
linux-cleanup --all-safe --yes --dry-run --json-events > preview.ndjson
```

O primeiro comando ainda pede confirmação, como uma execução real. O segundo não é interativo e grava eventos JSON versionados no stdout; o texto para pessoas vai para o stderr. Nenhum dos dois apaga arquivos. A simulação não grava relatório JSON da sessão.

Uma visualização é um retrato da máquina naquele momento, e não uma promessa sobre uma execução posterior. Entre a visualização e a confirmação, arquivos podem ser usados, alterados ou removidos. A ferramenta não tem desfazer nem backup.

## Confira o limite antes de uma execução real

`--list-targets` mostra as raízes de destino configuradas e os caminhos protegidos sem medir o disco. Ajuda a saber se uma pasta está no escopo. A [referência de caminhos protegidos](../reference/protected-paths.md) descreve as regras de recusa.

Os modos de arquivos pessoais e os ligados a projetos são separados da limpeza de cache do dia a dia. Revise os candidatos deles um a um. `--yes` vale só para `--all-safe`; ele não aprova a exclusão de arquivos pessoais.

Quando a visualização corresponder ao que você quer, escolha o modo e leia a confirmação dele. Uma exclusão real é permanente.

## Leia também

- [O que ele apaga](./what-it-deletes.md)
- [Proteções](./guards.md)
- [Opções da CLI](../reference/cli-flags.md)
