---
title: O que ele apaga
description: Os modos de limpeza do Linux e seus caminhos de destino, com a diferença entre caches do dia a dia, tarefas do sistema e arquivos pessoais.
tags: [safety, deletion, targets, caches, disk-space]
sidebar_position: 1
---

# O que ele apaga

**O linux-cleanup remove de forma permanente os caches e restos selecionados.** O alvo depende do modo. A verificação lista os caminhos e o tamanho atual; a simulação percorre a limpeza escolhida e mostra as ações propostas. Nenhuma das duas é backup.

```bash
linux-cleanup --list-targets
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

A [proteção de caminhos](../reference/protected-paths.md) recusa os locais pessoais e do sistema configurados, depois de resolver links simbólicos. Leia cada caminho proposto antes de uma execução real.

## Caches de gerenciadores de pacotes {#package-manager-caches}

A limpeza totalmente segura do dia a dia pode podar estas raízes de cache. Reinstalar um pacote depois pode exigir um download.

| Cache | Raiz de destino |
|---|---|
| Yarn Berry | `~/.yarn/berry/cache` |
| npm | `~/.npm/_cacache` |
| npx | `~/.npm/_npx` |
| pnpm store | `~/.local/share/pnpm/store` |
| pnpm cache | `~/.cache/pnpm` |
| bun | `~/.bun/install/cache` |
| deno | `~/.cache/deno` |
| Composer | `~/.cache/composer` |
| pip | `~/.cache/pip` |

Os pacotes extraídos do Yarn v1 são podados como entradas inteiras em `~/.cache/yarn`. Pacotes instalados globalmente e as raízes de instalação dos gerenciadores de pacotes ficam separados desses caches.

## Caches de navegadores e aplicativos {#browser-and-application-caches}

Os alvos do dia a dia incluem os caches de navegador configurados, unidades de versão do Gradle, binários do Cypress e do Playwright e o cache do observador do TypeScript. Um navegador ou ferramenta de build pode precisar recriar ou baixar de novo o que foi removido no próximo uso. A distribuição atual do Gradle e a versão atual do Android Studio são mantidas pelas próprias regras; uma unidade antiga elegível é removida inteira, para não deixar uma instalação apagada pela metade.

O modo confere o último acesso e a última modificação antes de podar arquivo por arquivo. Um sistema de arquivos com tempos de acesso pouco confiáveis impede a poda por idade. `--purge-all` tira essa barreira de idade e exige uma decisão à parte.

## Dados de ferramentas de desenvolvimento {#developer-tool-data}

A verificação pode mostrar AVDs do Android, o cache do pub do Flutter, dados de usuário do Flatpak e outras raízes grandes. **Um caminho aparecer na verificação não garante que o `--all-safe` vá removê-lo.** Leia a página do modo e a saída da simulação para ver o que o modo escolhido realmente atinge. Emuladores do Android e aplicativos Flatpak instalados não são cache do dia a dia.

## Extensões de editores {#editor-extensions}

`--editor-ext` considera versões de extensões do VS Code e do Cursor que já foram substituídas. Ele exige uma versão mais nova e uma versão antiga ociosa; a versão atual é mantida. Veja [Extensões de editores](../modes/editor-extensions.md).

## Arquivos de projetos e pessoais — só no modo interativo {#project-and-personal-files--interactive-only}

`node_modules` de projetos parados, downloads incompletos e arquivos pessoais grandes sem uso têm modos interativos próprios. `--yes` não aprova esses modos. Um download incompleto ou um arquivo em `~/Downloads` pode ser a única cópia que você tem. Leia cada caminho e a consequência antes de confirmar.

## Limpeza do sistema (exige sudo) {#system-cleanup-requires-sudo}

`--system` pergunta antes de cada etapa de apt, journal, Snap, `/tmp` e cache de páginas. Os comandos de pacotes usam `apt` e `dpkg`; eles não se adaptam a Fedora, Arch ou openSUSE. A etapa do kernel lista as versões instaladas; ela não remove nenhuma diretamente. A limpeza do journal mira 100 MB, e a idade do `/tmp` é de 7 dias, independentemente de `--days`. Liberar o cache de páginas afeta a RAM, não o espaço em disco. Veja [Limpeza do sistema](../modes/system-cleanup.md) e [Distribuições suportadas](../distro-support.md).

## O que ele se recusa a apagar {#what-it-refuses-to-delete}

A proteção recusa a raiz e caminhos protegidos da pasta pessoal, como `~/Documents`, `~/Pictures`, `~/.ssh`, `~/.config` e `~/.claude`. A lista exata e as exceções estão em [Caminhos protegidos](../reference/protected-paths.md). `--self-test` confere alguns casos de recusa na cópia instalada.

Uma exclusão real não tem como desfazer. [Visualizar antes de apagar](./preview-first.md) explica a ordem a seguir antes de uma limpeza.
