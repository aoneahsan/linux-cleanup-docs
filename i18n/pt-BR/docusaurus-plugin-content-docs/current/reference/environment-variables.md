---
title: Variáveis de ambiente
description: "Todas as variáveis de ambiente que o linux-cleanup lê, com o padrão e o efeito de cada uma: troca das pastas de saída, controle de cor e busca da configuração XDG."
tags: [environment, variables, configuration, no-color, xdg, reference]
sidebar_position: 4
---

# Variáveis de ambiente

**Todas as variáveis de ambiente que o linux-cleanup lê.** Todas são opcionais.

| Variável | Padrão | Efeito |
|---|---|---|
| `NO_COLOR` | não definida | Qualquer valor não vazio desliga a cor ANSI. O padrão comum a várias ferramentas, do [no-color.org](https://no-color.org). Igual ao `--no-color` |
| `CLEANUP_NO_COLOR` | `0` | Chave de cor própria do linux-cleanup. Use `1` para desligar a cor só aqui |
| `LINUX_CLEANUP_LOG_DIR` | `~/.linux-cleanup/logs/` (npx / npm) ou `<repo>/logs/` (clone) | Onde ficam os logs de sessão. Criada se não existir |
| `LINUX_CLEANUP_REPORTS_DIR` | `~/.linux-cleanup/reports/` ou `<repo>/reports/` | Onde ficam os registros JSON de sessão. Criada se não existir |
| `LINUX_CLEANUP_DATA_HOME` | não definida — usa a pasta pai da pasta de logs | Pasta pai de `logs/`, `reports/` e `feedback/` juntas |
| `LINUX_CLEANUP_NPX` | não definida | **Interna.** O inicializador Node define como `1`. Não defina você mesmo |
| `LINUX_CLEANUP_LAUNCHER` | não definida | **Interna.** O inicializador Node define `node`; o aplicativo para desktop define `desktop`, o que pula a checagem de atualização da CLI, porque o aplicativo faz a própria (desde a 2.1.0). Não defina você mesmo |
| `XDG_CONFIG_HOME` | `~/.config` | Onde `personal-roots.txt` e `project-roots.txt` são procurados |

## Redirecionando toda a saída {#redirecting-all-output}

O `LINUX_CLEANUP_DATA_HOME` é a única alavanca que move tudo — logs, registros e pacotes de feedback:

```bash
export LINUX_CLEANUP_DATA_HOME="/mnt/secure/linux-cleanup"
linux-cleanup --scan
```

:::caution A pasta é criada, o ponto de montagem não
A ferramenta cria `logs/`, `reports/` e `feedback/` sob o caminho indicado. Ela **não** cria nem verifica o ponto de montagem por baixo. Aponte para um caminho não montado e a saída vai parar no sistema de arquivos de baixo, em silêncio.

Confirme que o destino está montado e aceita gravação antes de contar com ele.
:::

Para um controle mais fino, `LINUX_CLEANUP_LOG_DIR` e `LINUX_CLEANUP_REPORTS_DIR` trocam cada um separadamente e têm prioridade sobre a raiz de dados.

## Controle de cor {#colour-control}

```bash
export NO_COLOR=1          # tudo nesta máquina, todas as ferramentas
export CLEANUP_NO_COLOR=1  # só o linux-cleanup
linux-cleanup --no-color   # só esta execução
```

O `CLEANUP_NO_COLOR` existe para quando você quer cor em todas as outras ferramentas e texto puro nesta — normalmente ao mandar a saída por pipe para algo que estraga as sequências de escape.

## Configurando as raízes verificadas {#configuring-the-scanned-roots}

Dois arquivos em `$XDG_CONFIG_HOME` (padrão `~/.config`) definem quais pastas as verificações de arquivos pessoais e de projetos percorrem:

| Arquivo | Usado por | Raízes padrão |
|---|---|---|
| `personal-roots.txt` | [`--stale`](../modes/personal-stale-files.md) | `~/Downloads`; raízes protegidas como `~/Desktop` são ignoradas |
| `project-roots.txt` | [`--node-modules`](../modes/node-modules-finder.md) | Suas pastas de projetos |

Um caminho por linha. Isso segue a [especificação XDG Base Directory](https://specifications.freedesktop.org/basedir-spec/), então definir `XDG_CONFIG_HOME` muda os dois de lugar.

:::danger Acrescentar uma raiz ao `personal-roots.txt` amplia o que pode ser apagado
A verificação de arquivos pessoais é [somente interativa](../safety/guards.md#guard-3--personal-data-is-interactive-only), então nada é removido sem a sua confirmação arquivo por arquivo — mas uma raiz que você acrescenta é uma pasta cujo conteúdo vai começar a aparecer nas listas de candidatos.

A [lista de caminhos permitidos](./protected-paths.md) continua valendo e continua tendo a palavra final: acrescentar `~/Documents` aqui não o torna apagável.
:::

## Para CI e scripts {#for-ci-and-scripts}

```bash
NO_COLOR=1 linux-cleanup --scan > /tmp/scan.log
```

A verificação sozinha não cria o relatório JSON de sessão do passeio guiado. Confira o [código de saída](./exit-codes.md) nos scripts, ou use [`--json-events`](./json-events.md) para uma saída estruturada.

## O que ele não lê {#what-it-does-not-read}

- `PATH`, a não ser para detectar quais ferramentas opcionais estão instaladas
- `USER` e `LOGNAME`, a não ser para anotar o cabeçalho do log
- O histórico, os aliases ou a configuração do seu shell — o [`--doctor`](../modes/doctor.md) é o único modo que lê os arquivos de inicialização do shell, e só para conferir se um runtime está ligado
- Nenhuma configuração remota ou vinda da rede. Não existe nenhuma

Se `$HOME` não estiver definido, o script para na hora em vez de adivinhar. Veja [Solução de problemas](../troubleshooting.md#home-is-not-set).

## Próximos passos {#next}

- [Caminhos de saída](./output-paths.md) — onde os arquivos vão parar de fato
- [Opções da CLI](./cli-flags.md)
