---
title: Recuperar espaço com critério
description: Confira o uso do disco no Linux, visualize cada modo de limpeza e depois escolha caminhos de cache, de projetos ou do sistema, um de cada vez.
sidebar_position: 1
---

# Recuperar espaço com critério

**Meça primeiro. Escolha o menor escopo de limpeza que resolve os caminhos que você encontrou.** O tamanho informado de uma raiz de cache não é promessa de que uma limpeza pode ou deve remover tudo.

## 1. Encontre os caminhos grandes {#1-find-the-large-paths}

```bash
linux-cleanup --audit
linux-cleanup --scan
```

O `--audit` lista as entradas grandes do `$HOME`, inclusive coisas que esta ferramenta não sabe limpar. O `--scan` lista as raízes de cache configuradas e outros candidatos sem apagar nada. Se o disco é ocupado principalmente por uma imagem de máquina virtual, um conjunto de dados ou uma biblioteca de jogos, confira direto em vez de rodar modos de limpeza que não têm nada a ver.

## 2. Visualize os caches do dia a dia {#2-preview-routine-caches}

```bash
linux-cleanup --all-safe --dry-run
```

O modo totalmente seguro padrão poda os caches regeneráveis elegíveis depois do limite de 100 dias de ociosidade. A visualização percorre essas regras sem apagar. Um log local e o estado da checagem de atualizações ainda podem ser gravados.

Se todo caminho proposto for algo que você consegue recriar ou baixar de novo, rode `linux-cleanup --all-safe` e leia a confirmação. O `--yes` é para uma execução sem supervisão depois que você já revisou esta máquina.

## 3. Revise as dependências de projetos à parte {#3-review-project-dependencies-separately}

```bash
linux-cleanup --node-modules --dry-run
```

O modo de dependências de projetos é interativo. Confira o caminho do projeto e o lockfile antes de uma exclusão real. Uma alteração local feita dentro de `node_modules` não volta ao reinstalar as dependências.

## 4. Revise o armazenamento do sistema à parte {#4-review-system-storage-separately}

```bash
linux-cleanup --system --dry-run
```

O modo de sistema completo usa apt e dpkg, então é para Debian e Ubuntu. Ele pede sudo e inclui a limpeza do journal, os arquivos antigos do `/tmp` e uma etapa opcional de cache de páginas. Essa etapa afeta a RAM, não o disco. Veja [Limpeza do sistema](../modes/system-cleanup.md).

## 5. Só mude o limite de idade depois de outra visualização {#5-change-the-age-threshold-only-after-another-preview}

O `--days N` muda quais arquivos ociosos ou unidades de cache inteiras passam a ser elegíveis. Baixar de 100 para 30 pode remover material que você usou há pouco, então veja antes uma simulação com o valor escolhido. O `--purge-all` desliga a proteção por idade; ele pode remover uma distribuição do Gradle ou um navegador de testes que você vai precisar baixar de novo.

## 6. Deixe os arquivos pessoais como uma decisão separada {#6-keep-personal-files-as-a-separate-decision}

O `--stale` mostra arquivos pessoais grandes e ociosos que são candidatos e pergunta antes de cada exclusão. Um download antigo pode ser a sua única cópia. O `--yes` não aprova este modo. Veja [Arquivos pessoais sem uso](../modes/personal-stale-files.md) e [Apagar é permanente](../safety/irreversibility.md).

O espaço recuperado varia conforme a máquina e outros processos gravando durante a execução. Confira o log final e os caminhos mantidos antes de decidir se precisa de outro modo.
