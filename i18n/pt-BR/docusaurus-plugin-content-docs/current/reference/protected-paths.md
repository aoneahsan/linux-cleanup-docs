---
title: Caminhos protegidos
description: A lista completa e verificada dos caminhos que o linux-cleanup se recusa a apagar — raízes do sistema, pastas pessoais, raízes de instalação de gerenciadores de pacotes e nomes de arquivos de inicialização do shell.
tags: [protected, allowlist, safety, paths, reference]
sidebar_position: 3
---

# Caminhos protegidos

**Estes são os caminhos que o linux-cleanup se recusa a apagar.** A recusa é incondicional — nenhuma opção passa por cima dela, nem o `--purge-all`.

Cada candidato é resolvido com `realpath` antes da checagem, então um link simbólico que aponta para dentro de uma pasta protegida é recusado pelo caminho resolvido, não pelo link.

:::tip Confira na sua própria instalação em vez de confiar nesta página
As listas mudam entre versões, e circulam descrições de segunda mão desta ferramenta com pastas que **não** estão protegidas de verdade.

```bash
linux-cleanup --list-targets   # as listas como a sua versão as vê
linux-cleanup --self-test      # confirma que a barreira funciona em caminhos conhecidos
```
:::

## Três listas separadas {#three-separate-lists}

A barreira é formada por três listas com regras de correspondência diferentes. A diferença importa — é ela que permite limpar `~/.npm/_cacache` enquanto o próprio `~/.npm` fica intocável.

| Lista | Corresponde a | Finalidade |
|---|---|---|
| Caminhos protegidos | O caminho **e tudo o que está dentro dele** | Dados pessoais, credenciais, configuração |
| Protegidos exatos | **Só aquele caminho exato** | Raízes de instalação de gerenciadores de pacotes |
| Nomes protegidos | **Qualquer arquivo com aquele nome, em qualquer lugar** | Arquivos de inicialização e de histórico do shell |

## Raízes do sistema {#system-roots}

Recusadas como caminho ou como qualquer item dentro delas, exceto onde indicado.

| Caminho | O conteúdo também é recusado |
|---|---|
| `/` | — (a própria raiz) |
| `/home` | Não — só o caminho exato |
| `/root` | Não — só o caminho exato |
| `/etc` | **Sim** |
| `/boot` | **Sim** |
| `/usr` | **Sim** |
| `/var` | Não — só o caminho exato |
| `/lib` | Não — só o caminho exato |
| `/sbin` | Não — só o caminho exato |
| `/bin` | Não — só o caminho exato |
| `$HOME` | Não — a própria raiz da pasta pessoal, para que um `$HOME` puro nunca possa ser apagado |

:::note `/proc` e `/sys` não estão nesta lista
Nenhum alvo de limpeza chega perto deles, mas a lista de permitidos não os cita explicitamente. Algumas descrições desta ferramenta dizem que cita. Não cita.
:::

## Pastas pessoais {#personal-directories}

Recusadas junto com tudo o que há dentro.

| Caminho | Guarda |
|---|---|
| `~/Documents` | Documentos |
| `~/Pictures` | Imagens |
| `~/Music` | Áudio |
| `~/Videos` | Vídeo |
| `~/Desktop` | Conteúdo da área de trabalho |
| `~/Public` | Arquivos compartilhados |
| `~/Templates` | Modelos de documentos |

:::caution `~/Downloads` NÃO é protegido de propósito
Não tem como ser — limpar ali arquivos grandes parados há muito tempo é um recurso ([Arquivos pessoais sem uso](../modes/personal-stale-files.md)). O que protege essa pasta é a [barreira 3](../safety/guards.md#guard-3--personal-data-is-interactive-only): só interativo, confirmação arquivo por arquivo e `--yes` ignorado.

Se você guarda algo insubstituível em `~/Downloads`, mova para uma pasta protegida. Essa é a solução duradoura.
:::

## Credenciais, configuração e estado de agentes {#credentials-configuration-and-agent-state}

| Caminho | Guarda |
|---|---|
| `~/.ssh` | Chaves SSH e hosts conhecidos |
| `~/.gnupg` | Chaveiro GPG |
| `~/.config` | Configuração de aplicativos (muito ampla) |
| `~/.gnome` | Configurações do GNOME |
| `~/.mozilla` | Perfis do Firefox |
| `~/.thunderbird` | Perfis do Thunderbird |
| `~/.claude` | Estado do Claude Code |
| `~/.local/share/claude` | Dados do Claude Code |

:::danger Dois caminhos muitas vezes dados como protegidos NÃO são
**`~/.password-store`** (pass) e **`~/.aws`** (credenciais da AWS) **não** aparecem na lista protegida do código. Alguns textos sobre esta ferramenta dizem que aparecem.

Na prática, nenhum alvo de limpeza aponta para eles, então nenhum dos dois corre risco no uso normal — mas não conte com a lista de permitidos para defendê-los. Se você quer essa garantia, confira antes com `--list-targets` na sua instalação.
:::

Note que proteger `~/.mozilla` não impede a limpeza do cache do Firefox: o cache fica em `~/.cache/mozilla`, outra árvore.

## Caminhos protegidos por correspondência exata {#exact-match-protected-paths}

Correspondência **exata** — o conteúdo continua podendo ser limpo. É isso que preserva os pacotes instalados globalmente e ainda permite limpar o cache que se regenera dentro de cada raiz de instalação.

| Ecossistema | Caminhos |
|---|---|
| pnpm | `~/.local/share/pnpm` e as suas pastas `global`, `bin`, `nodejs` |
| npm | `~/.npm`, `~/.npm-global`, `~/.npm-global/lib`, `~/.npm-global/lib/node_modules` |
| yarn | `~/.yarn`, `~/.config/yarn/global` |
| bun | `~/.bun`, `~/.bun/install`, `~/.bun/install/global` e a sua pasta `node_modules`, `~/.bun/bin` |
| deno | `~/.deno`, `~/.deno/bin` |
| Gerenciadores de versão do Node | `~/.volta`, `~/.volta/bin`, `~/.nvm`, `~/.nvm/versions`, `~/.fnm` |
| Rust | `~/.cargo`, `~/.cargo/bin`, `~/.rustup` |
| Go | `~/go`, `~/go/bin` |

Esta lista existe por causa de um defeito real: antes da [1.1.0](../changelog.md#110--2026-05-10), a limpeza do pnpm mirava `~/.local/share/pnpm` — a raiz de instalação — e removia os pacotes instalados globalmente junto com o próprio binário `pnpm`. A correção restringiu o alvo a `~/.local/share/pnpm/store` e acrescentou esta lista para que o erro não volte.

O [`--all-safe`](../modes/all-safe.md) também confere, ao iniciar, que nenhum deles aparece na lista de alvos, e para com uma mensagem `BUG:` se algum aparecer.

## Nomes de arquivo protegidos {#protected-basenames}

Recusados **pelo nome do arquivo, em qualquer lugar**, seja qual for o caminho até ele:

`.bashrc` · `.bash_profile` · `.bash_login` · `.profile` · `.bash_logout` · `.zshrc` · `.zshenv` ·
`.zprofile` · `.zlogin` · `.zlogout` · `.bash_aliases` · `.bash_history` · `.zsh_history` · `.inputrc` ·
`.dircolors` · `.config` · `.local`

É uma última barreira. Existe para que um bug futuro que de algum jeito colocasse um arquivo de inicialização do shell numa lista de alvos ainda não consiga apagá-lo.

## Como é uma recusa {#what-a-refusal-looks-like}

```text
✗ REFUSE: protected path: /home/you/Documents/notes
✗ REFUSE: unsafe path: '/home/you'
✗ REFUSE: shell-init / history file: /home/you/.bashrc
```

Uma recusa é o comportamento certo, não um erro a contornar. Se um cache que você quer limpar está sendo recusado, a causa quase sempre é um link simbólico que termina num lugar protegido — conserte o link, não a ferramenta. Veja [Solução de problemas](../troubleshooting.md#refuse-protected-path).

## Próximos passos {#next}

- [Barreiras de segurança](../safety/guards.md) — como esta lista é aplicada
- [O que ele apaga](../safety/what-it-deletes.md) — o outro lado do limite
