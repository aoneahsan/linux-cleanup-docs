---
title: linux-cleanup
description: Um utilitário de linha de comando em Bash que recupera espaço em disco no Linux apagando de forma permanente caches que podem ser regenerados, atrás de uma lista de caminhos permitidos, um limite de ociosidade e uma confirmação interativa.
tags: [linux, cleanup, disk-space, cli, bash, overview]
slug: /
sidebar_label: Introdução
sidebar_position: 1
---

# linux-cleanup

**O linux-cleanup mostra os caminhos antes de remover caches regeneráveis no Linux.** Ele cobre caches de gerenciadores de pacotes, navegadores e ferramentas de build, com modos separados para o sistema e para arquivos pessoais candidatos. Comece com uma verificação somente leitura ou uma simulação antes de escolher uma limpeza real.

Baixe o linux-cleanup: [no npm](https://www.npmjs.com/package/linux-cleanup) · [o site](https://linux-cleanup.aoneahsan.com) · [todos os lugares](/apps)

É uma **ferramenta destrutiva**. Toda exclusão é permanente e não tem como desfazer. A segurança dela vem de se recusar a tocar no que não deve desde o início, e não de conseguir devolver depois.

:::danger Esta ferramenta apaga arquivos de forma permanente
Não há desfazer, lixeira nem backup. Uma limpeza real apaga para sempre os arquivos selecionados. Use `--dry-run` para visualizar o modo escolhido antes de confirmar.

Leia **[O que ele apaga](./safety/what-it-deletes.md)** e rode **[a visualização somente leitura](./safety/preview-first.md)** antes de deixá-lo apagar qualquer coisa.
:::

| | |
|---|---|
| **Versão do pacote** | 2.1.1 no npm (2026-11-22); use `linux-cleanup --version` para ver a cópia instalada |
| **Plataforma** | Somente Linux — `bash` ≥ 4 e GNU coreutils |
| **Licença** | [MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE) — desde a 1.4.0 |
| **Acesso à rede** | Uma consulta ao registro público de versões ao iniciar, quando há conexão; instalar ou atualizar também usa o npm ou o GitHub |
| **Autor** | [Ahsan Mahmood](https://aoneahsan.com) · [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |

## Leia na ordem {#read-this-in-order}

Esta documentação segue de propósito uma ordem pensada para uma ferramenta que apaga dados. As três primeiras páginas são as que evitam dor de cabeça.

| Passo | Página | Por quê |
|---|---|---|
| 1 | [O que ele apaga](./safety/what-it-deletes.md) | A lista completa de alvos, por categoria |
| 2 | [Visualizar antes de apagar](./safety/preview-first.md) | Verificação somente leitura e depois uma simulação do modo escolhido |
| 3 | [Proteções](./safety/guards.md) | As quatro barreiras que um caminho precisa passar antes de ser apagado |
| 4 | [Apagar é permanente](./safety/irreversibility.md) | O que "sem desfazer" significa na prática |
| 5 | [Instalação](./getting-started/installation.md) | `npx`, `npm` global ou `git clone` |
| 6 | [Início rápido](./getting-started/quick-start.md) | Sua primeira limpeza real |

## No que ele é bom {#what-it-is-good-at}

- **Mostrar os candidatos.** Uma verificação nomeia as raízes de cache e o tamanho atual de cada uma. Uma simulação percorre a limpeza escolhida e nomeia as ações propostas.
- **Não apagar a coisa errada.** Uma [lista de caminhos permitidos](./reference/protected-paths.md) recusa sem exceção `~/Documents`, `~/.ssh`, `~/.config`, `/etc` e similares, depois de resolver links simbólicos.
- **Deixar em paz os arquivos usados há pouco.** Desde a 1.2.0, o padrão é *podar*, não esvaziar: dentro de um cache, só saem arquivos sem uso há mais de 100 dias. Veja [o limite de ociosidade](./safety/guards.md#guard-2--the-staleness-gate).
- **Registrar cada execução.** A CLI mantém um log local. Os passeios guiados gravam um [relatório JSON da sessão](./reference/report-schema.md), a menos que desativado; simulações não.
- **Verificar atualizações.** Ao iniciar, a CLI lê um registro público de versões por HTTPS quando disponível.

## O que ele não é {#what-it-is-not}

Deixar os limites claros ajuda mais do que uma lista de recursos.

- **Não é uma ferramenta de backup.** Ele apaga; nunca arquiva. Nada do que ele apaga pode ser recuperado de dentro da ferramenta.
- **Não é uma ferramenta de desfazer.** [`--scan`](./modes/scan.md) só lê; `--dry-run` mostra a limpeza escolhida; nenhum dos dois recupera arquivos depois de uma execução real.
- **Não é um scanner de segurança.** Ele não encontra segredos, malware nem vulnerabilidades.
- **Não é multiplataforma.** Somente Linux. O pacote npm declara `"os": ["linux"]`.
- **Não funciona por completo em todas as distribuições.** A limpeza de caches dentro do `$HOME` funciona em qualquer lugar, mas [o modo `--system` é só para Debian/Ubuntu](./distro-support.md): ele chama `apt` e `dpkg` diretamente.
- **Não substitui o seu julgamento.** Leia o que ele propõe antes de confirmar.

## A versão de 30 segundos {#the-30-second-version}

```bash
# 1. Veja o que pode ser recuperado. Não apaga nada.
npx linux-cleanup --scan

# 2. Visualize a limpeza escolhida sem apagar.
npx linux-cleanup --all-safe --dry-run

# 3. Rode o passeio guiado. Revise cada escolha antes de apagar.
npx linux-cleanup
```

O passo 3 é o modo padrão. Ele passa por dez categorias, pergunta antes de cada uma, mostra o total acumulado de bytes recuperados e grava um relatório no fim. Veja [Passeio guiado](./modes/walkthrough.md).

## Para onde ir depois {#where-to-go-next}

- Quer o espaço de volta o quanto antes? → [Recuperar o máximo de espaço](./guides/reclaim-the-most-space.md)
- Algo deu errado? → [Recuperação](./recovery.md) e depois [Solução de problemas](./troubleshooting.md)
- Quer ver todas as opções? → [Opções da CLI](./reference/cli-flags.md)
- O que mudou? → [Registro de mudanças](./changelog.md)
