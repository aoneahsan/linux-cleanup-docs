---
title: Doctor
description: Detecte runtimes instalados no disco mas ausentes da inicialização do shell — nvm, pnpm, bun, deno, cargo — e acrescente o bloco de inicialização padrão com a sua confirmação. Só acrescenta.
sidebar_position: 14
---

# Doctor

**O `--doctor` encontra runtimes que estão no disco mas não estão ligados à configuração do seu shell, e oferece acrescentar o bloco de inicialização que falta.** Chegou na [1.1.0](../changelog.md#110--2026-05-10).

```bash
linux-cleanup --doctor
```

É o modo para quando aparece `pnpm: command not found` e você sabe muito bem que instalou o pnpm.

## Só acrescenta {#additive-only}

:::note O Doctor nunca apaga nem edita uma linha existente
Ele **acrescenta** um bloco de inicialização padrão, e só depois que você confirma. Ele não altera, reordena nem remove nada que já esteja na configuração do seu shell.

Os arquivos de inicialização do shell também são protegidos na camada de exclusão: o `safe_rm` recusa qualquer caminho cujo nome de arquivo seja `.bashrc`, `.zshrc`, `.profile`, `.bash_aliases` ou parecido, onde quer que esteja. Veja [Caminhos protegidos](../reference/protected-paths.md#protected-basenames).
:::

## O que ele confere {#what-it-checks}

| Runtime | Detecta | Acrescenta |
|---|---|---|
| `nvm` | `~/.nvm` presente, sem inicialização do `NVM_DIR` | O bloco padrão de carregamento do nvm |
| `pnpm` | `~/.local/share/pnpm` presente, fora do `PATH` | O export do `PNPM_HOME` e a entrada no `PATH` |
| `bun` | `~/.bun` presente, fora do `PATH` | O bloco de inicialização do Bun |
| `deno` | `~/.deno` presente, fora do `PATH` | A entrada do Deno no `PATH` |
| `cargo` | `~/.cargo` presente, fora do `PATH` | `. "$HOME/.cargo/env"` |

## Como isso costuma acontecer {#how-this-usually-happens}

Um instalador grava o bloco de inicialização num arquivo que o seu shell não lê. O `~/.profile` só é lido por shells de login; o `~/.bash_profile`, quando existe, passa por cima dele; uma mudança no `~/.bashrc` nunca chega a uma sessão do `zsh`. O runtime instala direitinho e depois parece sumir.

Também acontece depois de levar um repositório de dotfiles de uma máquina para outra, ou de trocar o shell de login.

## Depois {#afterwards}

Recarregue o shell, senão vai parecer que a mudança não funcionou:

```bash
source ~/.bashrc     # ou ~/.zshrc
```

Depois confirme:

```bash
command -v pnpm && pnpm --version
```

## A relação com a auditoria de pacotes globais {#its-relationship-to-the-globals-audit}

O [`--globals`](./globals-audit.md) funciona mesmo quando um gerenciador de pacotes não está no `PATH`, porque recorre à inspeção do sistema de arquivos. Então, se a auditoria listar pacotes globais do pnpm mas o próprio `pnpm` não for encontrado, a solução é o `--doctor`.

## Próximos passos {#next}

- [Auditoria de pacotes globais](./globals-audit.md)
- [Solução de problemas](../troubleshooting.md)
