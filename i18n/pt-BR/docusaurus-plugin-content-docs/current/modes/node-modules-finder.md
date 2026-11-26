---
title: Localizador de node_modules parados
description: Encontre pastas node_modules em projetos sem mexer há N dias ou mais e apague de forma interativa. Muitas vezes é o que mais libera espaço na máquina de quem programa.
tags: [node-modules, projects, interactive, disk-space, modes]
sidebar_position: 8
---

# Localizador de node_modules parados

**O `--node-modules` encontra pastas `node_modules` em projetos que você não mexe há `--days` dias ou mais, e oferece apagar cada uma.** O espaço disponível depende dos projetos que existem nesta máquina.

```bash
linux-cleanup --node-modules          # padrão de 100 dias
linux-cleanup --node-modules -d 90
```

## Só no modo interativo {#interactive-only}

Este modo exige confirmação por projeto e **ignora `--yes`**. Ele não faz parte do [`--all-safe`](./all-safe.md) e não pode rodar sem supervisão. Veja a [barreira 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

## O que ele procura {#what-it-looks-for}

Ele vasculha as raízes dos seus projetos atrás de pastas `node_modules` cujo projeto está ocioso além do limite, e mostra cada uma com o tamanho e os dias ociosos. `node_modules` aninhados dentro de uma pasta já listada não são contados à parte.

As raízes de projetos são configuradas pelo `project-roots.txt` dentro de `$XDG_CONFIG_HOME` (padrão `~/.config`). Veja [Variáveis de ambiente](../reference/environment-variables.md).

## Por que isso costuma ser seguro {#why-this-is-usually-safe}

O `node_modules` é a coisa mais confiavelmente regenerável numa máquina de desenvolvimento — `yarn install` ou `npm install` reconstrói a partir do lockfile.

Duas ressalvas que vale conhecer antes de aceitar tudo:

:::caution Dois jeitos de isso ainda te custar caro
**Uma dependência com patch.** Se você editou um arquivo dentro de `node_modules` diretamente em vez de usar o `patch-package` ou um patch do yarn, essa edição não existe em nenhum outro lugar. Não está em registro nenhum nem no seu lockfile.

**Sem lockfile, sem rede.** Reinstalar exige que o registro esteja acessível e que o lockfile exista. Um projeto sem lockfile commitado pode não chegar à mesma árvore de dependências — e uma máquina sem rede pode não chegar a nada.
:::

Nenhuma das duas é comum, e a ferramenta não consegue detectar nenhuma. Se alguma se aplicar a um projeto da lista, recuse esse.

## O que ele não toca {#what-it-does-not-touch}

- O código-fonte do projeto — só a pasta `node_modules` dentro dele
- Lockfiles, `package.json` ou qualquer outra coisa do projeto
- Projetos mexidos dentro do limite
- Qualquer coisa da [lista de caminhos protegidos](../reference/protected-paths.md)

## Recuperando com mais agressividade {#reclaiming-aggressively}

```bash
linux-cleanup --node-modules -d 30
```

Baixar o limite aumenta a lista de candidatos. Com 30 dias você vai começar a ver projetos em que ainda trabalha de vez em quando, então leia a lista em vez de aceitar tudo de uma vez — o custo de um erro é uma reinstalação, pequena, mas não de graça.

## No passeio guiado {#in-the-walkthrough}

Roda como etapa 5 do [passeio guiado](./walkthrough.md), com as mesmas perguntas por projeto.

## Próximos passos {#next}

- [Recuperar o máximo de espaço](../guides/reclaim-the-most-space.md)
- [Proteções](../safety/guards.md)
