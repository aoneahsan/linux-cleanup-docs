---
title: Instalação
description: Instale o linux-cleanup de três jeitos — sem instalar com npx, globalmente com npm ou clonando o repositório — e confira a instalação antes de rodar qualquer coisa que apague.
tags: [installation, npx, npm, git, setup, upgrade]
sidebar_position: 2
---

# Instalação

**O linux-cleanup vem de três jeitos: `npx` sem instalar, instalação global com `npm` ou `git clone`.** Os três rodam o mesmo script Bash — o pacote npm é só um lançador Node enxuto que encontra o `cleanup.sh` e aponta logs e relatórios para uma pasta persistente.

:::info Confira a versão instalada
Rode `linux-cleanup --version` depois de instalar ou atualizar. O [registro de mudanças](../changelog.md) registra as mudanças na simulação e nos avisos de versão.
:::

## Opção 1 — `npx`, sem instalar {#option-1--npx-no-install}

O jeito mais rápido de experimentar. Nada vai para o seu `PATH` e nada fica para trás se você desistir.

```bash
npx linux-cleanup --version
npx linux-cleanup --scan      # verificação somente leitura
npx linux-cleanup             # passeio guiado
```

O `npx` baixa o pacote para uma pasta temporária do cache do npm. Seus logs e relatórios são gravados em `~/.linux-cleanup/` — **não** na pasta temporária —, então sobrevivem à limpeza do cache do npm e continuam lá na próxima vez.

## Opção 2 — instalação global com `npm` {#option-2--global-npm-install}

```bash
npm install -g linux-cleanup
linux-cleanup --version
```

Depois disso, o `linux-cleanup` fica no seu `PATH` em qualquer lugar. Logs e relatórios continuam indo para `~/.linux-cleanup/`.

```bash
npm install -g linux-cleanup@latest   # atualizar
npm uninstall -g linux-cleanup        # remover
```

Desinstalar o pacote não remove um alias do shell nem uma entrada do cron que você instalou — veja [Desinstalar](../guides/uninstall.md) para a remoção completa.

## Opção 3 — `git clone` {#option-3--git-clone}

Para ler, auditar ou modificar o código-fonte. O conteúdo do repositório é o que o npm publica.

```bash
git clone https://github.com/aoneahsan/linux-cleanup ~/linux-cleanup
cd ~/linux-cleanup
chmod +x cleanup.sh
./cleanup.sh --self-test
./cleanup.sh
```

A única diferença de comportamento: **um clone guarda a saída junto do código-fonte**, em `<clone>/logs/`, `<clone>/reports/` e `<clone>/feedback/`, em vez de `~/.linux-cleanup/`. As duas podem ser trocadas com `LINUX_CLEANUP_DATA_HOME`. Veja [Caminhos de saída](../reference/output-paths.md).

O projeto tem licença MIT, então forks e modificações estão liberados.

## Confira antes de rodar qualquer coisa que apague {#verify-before-you-run-anything-destructive}

```bash
linux-cleanup --version      # confirma qual build você realmente tem
linux-cleanup --self-test    # checagem de dependências, sintaxe e proteções
```

Um autoteste sem problemas termina com uma mensagem de sucesso. Ele confirma que a [proteção de caminhos](../safety/guards.md#guard-1--the-path-allowlist) realmente recusa `/`, `$HOME`, `~/Documents`, `~/.ssh` e `/etc`, e que não recusa `~/.cache/yarn`. Qualquer checagem que falhe sai com código diferente de zero.

:::tip Rode `--self-test` depois de cada atualização
É a única checagem que roda no código que você realmente tem, e não na documentação. Leva um segundo.
:::

## Qual instalação escolher {#which-install-path-to-choose}

| Se você… | Use |
|---|---|
| Quer experimentar uma vez | `npx` |
| Vai rodar com frequência, ou pelo cron | Instalação global com `npm` |
| Quer ler ou modificar o código | `git clone` |
| Está numa máquina sem Node.js | `git clone` |
| Precisa da saída junto do código | `git clone` |

Para o cron, prefira a instalação global e use um **caminho absoluto** no crontab — o cron roda com um `PATH` mínimo e não vai achar uma instalação em `~/.local/bin`. Esse é o problema mais comum com cron; veja [Alias e cron](../guides/alias-and-cron.md).

## O que a instalação não faz {#what-installing-does-not-do}

- Não cria serviço do sistema, daemon em segundo plano nem tarefa agendada (a não ser que você peça)
- Não tem agente de telemetria. Ao iniciar, a CLI busca um registro público de versões quando há conexão; sem conexão, continua normalmente
- Não muda a configuração do shell, a menos que você rode `--install-alias` ou `--doctor`
- Não cria arquivos fora do pacote e de `~/.linux-cleanup/`, e esta última só quando você realmente roda a ferramenta

## Próximos passos {#next}

- [Início rápido](./quick-start.md) — sua primeira limpeza
- [O que ele apaga](../safety/what-it-deletes.md) — leia antes da primeira execução real
- [Desinstalar](../guides/uninstall.md) — remoção completa, incluindo alias e cron
