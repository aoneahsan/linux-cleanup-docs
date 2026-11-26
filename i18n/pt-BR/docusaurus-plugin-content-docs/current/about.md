---
title: Sobre
description: Quem criou o linux-cleanup, os princípios de design por trás dele, a licença e como entrar em contato ou contribuir.
tags: [about, author, licence, contributing, credits]
sidebar_position: 95
---

# Sobre

**O linux-cleanup é criado e mantido por [Ahsan Mahmood](https://aoneahsan.com)**, engenheiro de software independente que trabalha com ferramentas para desenvolvedores e desenvolvimento de aplicativos.

| | |
|---|---|
| **Autor** | Ahsan Mahmood |
| **E-mail** | [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |
| **Site** | [aoneahsan.com](https://aoneahsan.com) |
| **LinkedIn** | [linkedin.com/in/aoneahsan](https://linkedin.com/in/aoneahsan) |
| **GitHub** | [github.com/aoneahsan](https://github.com/aoneahsan) |
| **npm** | [npmjs.com/~aoneahsan](https://www.npmjs.com/~aoneahsan) |

## Por que ele existe {#why-it-exists}

Máquinas de desenvolvimento acumulam uma quantidade enorme de lixo que se regenera — caches de gerenciadores de pacotes na casa das dezenas de gigabytes, caches de navegadores, caches de ferramentas de build, imagens de emuladores e `node_modules` de projetos abandonados há dois anos.

Os limpadores que existiam costumavam ter uma de duas formas. Ou não conheciam os caches modernos de desenvolvimento, ou eram apagadores de um botão só que removiam tudo o que parecia lixo e torciam pelo melhor.

O linux-cleanup faz o contrário: **programável, transparente, protegido por uma lista de caminhos permitidos e interativo por padrão.** Você pode ler exatamente o que ele vai tocar antes de ele tocar em qualquer coisa.

## Princípios de design {#design-principles}

**Na dúvida, recusar.** Uma [lista de caminhos permitidos, não uma lista de bloqueio](./safety/guards.md#guard-1--the-path-allowlist). Um caminho que a ferramenta não reconhece é recusado. Com uma lista de bloqueio, só um erro de digitação separa limpar um cache de limpar uma pasta pessoal.

**Separar caches de ferramentas.** O `~/.cache/yarn` se regenera em segundos; uma distribuição do Gradle wrapper é um download de 230 MB que você pode precisar no mês que vem. A [barreira de inatividade](./safety/guards.md#guard-2--the-staleness-gate) existe porque tratar os dois igual era errado, e a 1.2.0 mudou isso.

**Sobre dados pessoais, quem decide é você.** Nada no disco distingue um instalador que você nunca mais vai abrir da única cópia de um documento. A ferramenta se recusa a adivinhar, e é por isso que esses modos [ignoram o `--yes`](./safety/guards.md#guard-3--personal-data-is-interactive-only).

**Prevenir em vez de recuperar.** [Não há desfazer](./safety/irreversibility.md), de propósito — um log de desfazer multiplica as gravações no disco que você está liberando, e incentiva o descuido.

**Auditável em vez de conveniente.** Bash, porque já vem instalado e pode ser lido. Um binário compilado seria mais prático e bem mais difícil de confiar.

**A checagem de versões é limitada.** Ao iniciar, se houver conexão, a CLI lê um registro público de versões. Ela não envia caminhos de limpeza, relatórios nem pacotes de falha; mandar um relatório continua sendo escolha sua.

## As correções moldam a ferramenta {#corrections-shape-the-tool}

Dois dos recursos de segurança existem porque alguém apontou um problema real.

A [lista protegida de raízes de instalação](./reference/protected-paths.md#exact-match-protected-paths) veio de um defeito real: a limpeza do pnpm mirava `~/.local/share/pnpm` — a raiz de instalação — e removia os pacotes instalados globalmente. Corrigido na [1.1.0](./changelog.md#110--2026-05-10), junto com uma verificação para que não volte a acontecer.

A [barreira de inatividade](./safety/guards.md#guard-2--the-staleness-gate) veio de um usuário que percebeu que a 1.2.0 ainda apagava os AVDs do Android por inteiro, e que o mesmo raciocínio devia valer para tudo o que é ferramenta, não cache. Isso virou a [1.2.1](./changelog.md#121--2026-05-10).

Se encontrar algo errado, [avise](./guides/send-a-bug-report.md).

## Licença {#licence}

**[MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)** desde a [1.4.0](./changelog.md#140--2026-07-11).

Use para fins pessoais ou comerciais, modifique, faça fork, incorpore, redistribua. A única condição é manter o aviso de copyright e o aviso de permissão MIT nas cópias ou partes substanciais.

:::danger Fornecido “NO ESTADO EM QUE SE ENCONTRA”, sem garantia
Esta é uma ferramenta que apaga arquivos. O autor não se responsabiliza por nenhuma reclamação ou dano, inclusive perda de dados, decorrente do uso. Faça backup dos seus dados e revise cada ação antes de confirmar.

Vale o [texto completo da licença](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE).
:::

As versões publicadas antes da 1.4.0 mantêm a licença com que saíram.

## Contribuindo {#contributing}

Contribuições são bem-vindas sob a MIT.

- **Faça um fork e abra um pull request** — não precisa de acesso especial
- **Relate bugs ou peça recursos** pelas [issues do GitHub](https://github.com/aoneahsan/linux-cleanup/issues) ou por e-mail
- **A `main` é protegida** — as mudanças entram por PRs revisados

Os padrões de código: segurança em primeiro lugar, só offline e sem avisos do ShellCheck. Veja o [CONTRIBUTING.md](https://github.com/aoneahsan/linux-cleanup/blob/main/CONTRIBUTING.md).

Um pedido de recurso só com descrição é tão bem-vindo quanto código. Diga o que você gostaria de limpar e por que os modos atuais não cobrem isso.

## Esta documentação {#this-documentation}

Feita com [Docusaurus](https://docusaurus.io/) e publicada no GitHub Pages. Código-fonte: [github.com/aoneahsan/linux-cleanup-docs](https://github.com/aoneahsan/linux-cleanup-docs) — correções também são bem-vindas lá.

Resumo legível por máquina para assistentes de IA: [`/llms.txt`](https://linux-cleanup-docs.aoneahsan.com/llms.txt).

## Links relacionados {#related-links}

| | |
|---|---|
| **Código-fonte** | [github.com/aoneahsan/linux-cleanup](https://github.com/aoneahsan/linux-cleanup) |
| **npm** | [npmjs.com/package/linux-cleanup](https://www.npmjs.com/package/linux-cleanup) |
| **Issues** | [github.com/aoneahsan/linux-cleanup/issues](https://github.com/aoneahsan/linux-cleanup/issues) |
| **Apoie o trabalho** | [aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=linux-cleanup&project-identifier=linux-cleanup) |
