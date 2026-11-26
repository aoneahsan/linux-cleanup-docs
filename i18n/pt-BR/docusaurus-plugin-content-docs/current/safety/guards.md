---
title: Proteções
description: "As quatro barreiras independentes que um caminho precisa passar antes de o linux-cleanup apagá-lo: a lista de caminhos permitidos, o limite de ociosidade, os modos pessoais só interativos e o confinamento do sudo."
tags: [safety, allowlist, staleness, guards, design]
sidebar_position: 3
---

# Proteções

**O linux-cleanup aplica até quatro barreiras independentes antes de qualquer exclusão. Um caminho precisa passar por todas as que se aplicam a ele.** Esta página explica o que é cada barreira, por que ela existe e o que ela não cobre.

As proteções são todo o modelo de segurança. Atrás delas não há backup nem [desfazer](./irreversibility.md).

## Barreira 1 — A lista de caminhos permitidos {#guard-1--the-path-allowlist}

Sempre ligada. Não pode ser desativada, e nenhuma opção passa por cima dela.

Antes de qualquer remoção, o alvo é resolvido com `realpath` e recusado se cair em um caminho protegido ou dentro dele. Como a resolução vem primeiro, um link simbólico não consegue contrabandear um caminho: se `~/.cache/yarn` for um link simbólico para dentro de `~/Documents`, o caminho resolvido fica dentro de `~/Documents`, a barreira dispara e a exclusão é recusada.

Três listas separadas dão suporte a isso:

| Lista | Tipo de correspondência | Função |
|---|---|---|
| Raízes do sistema e pastas pessoais | O caminho ou qualquer subcaminho | `/etc`, `~/Documents`, `~/.ssh`, `~/.config`, … |
| Raízes de instalação dos gerenciadores de pacotes | **Só o caminho exato** | `~/.local/share/pnpm`, `~/.npm`, `~/.cargo`, … |
| Arquivos de inicialização e de histórico do shell | **Nome do arquivo, em qualquer local** | `.bashrc`, `.zshrc`, `.bash_history`, … |

Quando a barreira dispara, você vê uma recusa no stderr:

```text
✗ REFUSE: protected path: /home/you/Documents/notes
```

A lista de correspondência exata merece um comentário. `~/.npm` é protegido *exatamente*, e é isso que permite limpar `~/.npm/_cacache`, que fica dentro dele. É de propósito: a raiz de instalação é preservada, enquanto o cache regenerável dentro dela pode ser limpo. As listas completas estão em [Caminhos protegidos](../reference/protected-paths.md).

:::note O que esta barreira não faz
Ela protege *locais*, não *valor*. Um vídeo insubstituível de 40 GB em `~/Downloads` não é coberto pela lista de caminhos permitidos: `~/Downloads` não é um caminho protegido. Quem cobre é a [barreira 3](#guard-3--personal-data-is-interactive-only).
:::

Os modos de limpeza escolhem caminhos de destino definidos e depois a checagem de caminhos protegidos recusa destinos perigosos. Um caminho fora da lista protegida não é automaticamente seguro para remover: confira os alvos de cada modo e a simulação dele.

## Barreira 2 — O limite de ociosidade {#guard-2--the-staleness-gate}

Padrão: 100 dias. Introduzido na [1.2.0](../changelog.md#120--2026-05-10) e ampliado na [1.2.1](../changelog.md#121--2026-05-10).

Desde a 1.2.0 a estratégia padrão é **podar, não esvaziar**. Dentro de uma pasta de destino, um arquivo só é apagado quando o `atime` **e** o `mtime` dele são mais antigos que `--days`. As pastas vazias que sobram são varridas; a estrutura da pasta continua, para que a ferramenta dona dela ainda encontre a organização.

Exigir as duas marcas de tempo faz diferença. Só o `mtime` apagaria um arquivo baixado há um ano e lido ontem; só o `atime` não é confiável em sistemas de arquivos montados com `noatime` ou `relatime`. Exigir as duas é a leitura conservadora.

Para o que é uma *ferramenta* e não um cache (AVDs do Android, versões de extensões de editores, dados de usuário do flatpak), a 1.2.1 acrescentou uma segunda condição. Um item assim só é removido quando **nenhum software ativo depende dele E ele está ocioso além do limite**. Cada item é avaliado como uma unidade indivisível, para que uma poda parcial não deixe um perfil de emulador apagado pela metade.

```bash
linux-cleanup --all-safe -y -d 30    # mais agressivo: limite de 30 dias
linux-cleanup --all-safe -y          # padrão: 100 dias
linux-cleanup --all-safe --purge-all # barreira DESLIGADA — limpeza total, comportamento de antes da 1.2.0
```

:::danger `--purge-all` desliga esta barreira por completo
Com `--purge-all`, todo cache de destino é esvaziado por inteiro, seja qual for a idade. Foi esse comportamento que motivou a barreira: ele remove distribuições do wrapper do Gradle, navegadores do Playwright de branches antigas e tarballs do cache do yarn de dependências fixadas — cada um, um download caro de refazer.

É uma escolha legítima antes de reinstalar uma máquina. É um péssimo padrão para o dia a dia.
:::

O aviso antes da execução informa qual estratégia está ativa, então nunca há dúvida sobre o que vai acontecer.

## Barreira 3 — Dados pessoais só no modo interativo {#guard-3--personal-data-is-interactive-only}

Os modos que podem mexer em arquivos pessoais são interativos por regra:

- [`--stale`](../modes/personal-stale-files.md) — arquivos grandes e ociosos em `~/Downloads` e em raízes sem proteção configuradas
- [`--partials`](../modes/partial-downloads.md) — downloads incompletos abandonados
- [`--node-modules`](../modes/node-modules-finder.md) — pastas de dependências de projetos parados

**`--yes` não vale para esses modos e nunca vai valer.** `--yes` só confirma automaticamente caches regeneráveis. A ferramenta mostra a lista de candidatos, espera a confirmação de cada item e não apaga nada até você responder.

O motivo é que arquivos pessoais não carregam nenhum sinal que um programa consiga ler. Nada no disco diferencia um instalador que você nunca mais vai abrir da única cópia de um documento de que você ainda não precisou. Só você sabe, então a ferramenta se recusa a adivinhar.

## Barreira 4 — Confinamento do sudo {#guard-4--sudo-confinement}

[`--system`](../modes/system-cleanup.md) é o único modo que chama `sudo`, e só para um conjunto fixo e listado de operações — cada uma é uma chamada separada e verificável, perguntada individualmente:

| Operação | Resposta padrão |
|---|---|
| `apt autoremove --purge -y` + `apt clean` | Sim |
| `journalctl --vacuum-size=100M` | Sim |
| Remover revisões de snap desativadas | Sim |
| Listar os kernels instalados — **não apaga nada** | — |
| Remover arquivos do `/tmp` com `atime` de mais de 7 dias | Sim |
| `sync` + `sysctl vm.drop_caches=3` | **Não** |

O script não edita `/etc/sudoers`, e `--system` pergunta antes de cada operação. Se o `sudo` não estiver disponível, o modo para em vez de seguir num estado degradado.

Há dois valores **fixos que ignoram `--days`**: a meta de limpeza do journal (100 MB) e o limite de idade do `/tmp` (7 dias).

## O que nenhuma barreira cobre {#what-no-guard-covers}

Ser claro sobre as lacunas ajuda mais do que tranquilizar.

| Lacuna | O que significa |
|---|---|
| **Não há desfazer** | Nada aqui torna uma exclusão reversível. Veja [Apagar é permanente](./irreversibility.md). |
| **`~/Downloads` não é protegido** | O modo interativo de arquivos pessoais chega até ele — leia os candidatos. `~/Desktop` é protegido. |
| **`--purge-all` tira a barreira 2** | As barreiras 1, 3 e 4 continuam valendo; o limite de ociosidade, não. |
| **Rodar como root amplia o estrago possível** | A ferramenta foi feita para rodar como usuário comum. `--system` cuida internamente das necessidades legítimas de sudo. |
| **As proteções cobrem caminhos, não conteúdo** | Uma pasta protegida está a salvo onde quer que esteja; um arquivo valioso fora dela, não. |
| **`/proc` e `/sys` não estão na lista protegida** | Nada mira neles, mas a lista também não os cita. |

## Confira as proteções você mesmo {#verifying-the-guards-yourself}

```bash
npx linux-cleanup --self-test      # confirma que as barreiras disparam em caminhos conhecidos
npx linux-cleanup --list-targets   # mostra a lista de alvos e a de caminhos protegidos
```

`--self-test` é a checagem honesta. Ele confirma que `/`, `$HOME`, `~/Documents`, `~/.ssh` e `/etc` são protegidos e que `~/.cache/yarn` não é, e sai com código diferente de zero se alguma checagem falhar. A documentação pode ficar desatualizada; a checagem roda no código que você realmente tem.

## Próximos passos {#next}

- [Caminhos protegidos](../reference/protected-paths.md) — as listas completas verificadas
- [Apagar é permanente](./irreversibility.md) — o raciocínio por trás do "sem desfazer"
- [O que ele apaga](./what-it-deletes.md) — o inventário de alvos
