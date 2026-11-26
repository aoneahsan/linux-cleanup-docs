---
title: Arquivos pessoais sem uso
description: O modo só interativo que encontra arquivos grandes, sem uso há muito tempo, em ~/Downloads e nas raízes sem proteção configuradas.
tags: [personal, downloads, desktop, interactive, stale, modes]
sidebar_position: 9
---

# Arquivos pessoais sem uso

**O `--stale` encontra, em `~/Downloads` e nas raízes sem proteção configuradas, arquivos de mais de uns 10 MB que estão sem uso há `--days` dias ou mais, e oferece apagá-los um por um.**

```bash
linux-cleanup --stale         # ou: -p
linux-cleanup --stale -d 180  # só arquivos ociosos há 180+ dias
```

:::danger Arquivos pessoais podem ser insubstituíveis
`~/Downloads` e as suas raízes sem proteção configuradas guardam o que você colocou lá — inclusive, às vezes, a única cópia de algo importante.

A ferramenta não consegue diferenciar um instalador que você nunca mais vai abrir de um documento de que você ainda não precisou. Ela nem tenta. **Leia cada candidato.**
:::

## Interativo por regra {#interactive-by-policy}

A confirmação por arquivo ou por intervalo é obrigatória. Aqui o `--yes` é ignorado, e sempre vai ser, e este modo não faz parte do [`--all-safe`](./all-safe.md). Veja a [barreira 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

A lista de candidatos é mostrada inteira antes de qualquer pergunta, então rodar o modo e recusar tudo é um jeito legítimo de auditar essas pastas.

## O que torna um arquivo candidato {#what-makes-a-file-a-candidate}

Três condições ao mesmo tempo:

1. Ele está numa raiz pessoal configurada — por padrão `~/Downloads`; raízes protegidas como `~/Desktop` são ignoradas
2. Ele tem mais de uns 10 MB
3. Tanto o `atime` quanto o `mtime` são mais antigos que `--days` (100 por padrão)

As raízes pessoais são configuradas pelo `personal-roots.txt` dentro de `$XDG_CONFIG_HOME` (padrão `~/.config`). Veja [Variáveis de ambiente](../reference/environment-variables.md).

:::note Por que `~/Downloads` não está na lista protegida
Não tem como estar — limpar essa pasta é a razão de ser deste modo. A [lista de caminhos permitidos](../safety/guards.md#guard-1--the-path-allowlist) protege `~/Documents`, `~/Pictures`, `~/Music` e `~/Videos` justamente para que a única pasta aonde ele chega seja a que você espera.

Se você guarda coisas importantes em `~/Downloads`, mova-as para um lugar protegido — é a solução duradoura, e as protege de mais coisas do que esta ferramenta.
:::

## Lendo a lista de candidatos {#reading-the-candidate-list}

Cada item mostra o caminho, o tamanho e os dias ociosos. Vale parar para pensar em:

| Tipo | Considere |
|---|---|
| Instaladores, ISOs, `.deb`/`.AppImage` | Normalmente seguros — dá para baixar de novo |
| Qualquer coisa que você produziu em vez de baixar | Guarde, ou mova para um lugar protegido |
| Entregas de clientes ou do trabalho | Guarde. Downloads não é lugar para elas |
| Mídia sem origem óbvia | Investigue antes de aceitar |
| Arquivos compactados que você nunca extraiu | Confira o conteúdo antes |

## Uma ordem mais segura {#a-safer-sequence}

```bash
linux-cleanup --audit            # o que é realmente grande no $HOME
linux-cleanup --stale -d 365     # só arquivos realmente antigos
```

Começar com 365 dias e ir baixando te dá primeiro uma lista curta e óbvia. Quando ela estiver resolvida, baixe o limite.

## No passeio guiado {#in-the-walkthrough}

Etapa 7 do [passeio guiado](./walkthrough.md). Pular ali com `s` e rodar à parte depois — quando tiver tempo de ler com calma — é um hábito sensato.

## Próximos passos {#next}

- [Apagar é permanente](../safety/irreversibility.md)
- [Downloads incompletos](./partial-downloads.md) — o modo interativo relacionado
- [Auditoria da pasta pessoal](./home-audit.md) — descubra antes o que é grande
