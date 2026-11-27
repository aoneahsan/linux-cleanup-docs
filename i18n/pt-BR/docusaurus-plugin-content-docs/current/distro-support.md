---
title: Distribuições suportadas
description: O que o linux-cleanup faz em cada distribuição Linux — a limpeza de caches funciona em todas, mas o modo --system com sudo é só para Debian e Ubuntu.
sidebar_position: 90
---

# Distribuições suportadas

**A limpeza de caches da pasta pessoal foi feita para distribuições Linux com os utilitários GNU necessários.**
O [`--system`](./modes/system-cleanup.md) usa comandos de pacotes do Debian e do Ubuntu. Confira as ferramentas instaladas com `--self-test` antes de limpar.

## Resumo {#the-summary}

| Família de distribuições | Limpeza de caches em `$HOME` | `--system` |
|---|---|---|
| Debian, Ubuntu, Mint, Pop!\_OS | Completa | **Completa** |
| Fedora, RHEL, Rocky, Alma | Com os utilitários necessários | Não use: as etapas de apt falham |
| Arch, Manjaro, EndeavourOS | Com os utilitários necessários | Não use: as etapas de apt falham |
| openSUSE | Com os utilitários necessários | Não use: as etapas de apt falham |
| Alpine, contêineres mínimos | Precisa de Bash e utilitários GNU | Não use: as etapas de apt falham |
| WSL | Com os utilitários necessários | Só Debian/Ubuntu; confira antes os caminhos montados |

:::warning O `--system` não detecta a distribuição
As etapas de apt chamam `apt` e `dpkg` diretamente, sem checagem com `command -v` e sem recorrer a `dnf`, `pacman` ou `zypper`. Num sistema que não seja Debian, cada etapa falha com "command not found".

O modo não para depois de uma falha do apt: as etapas seguintes ainda podem rodar. Evite-o em outras distribuições.

Algumas descrições desta ferramenta afirmam que o `--system` tem suporte escalonado a várias distribuições, com `dnf` no lugar de `apt` e `paccache` no Arch. **Esse código não existe.** Confira com `grep -rn 'dnf\|pacman\|zypper' modules/system_sudo.sh` num clone — não retorna nada.
:::

## Etapa por etapa {#step-by-step}

| Etapa do `--system` | Debian/Ubuntu | Fedora/RHEL | Arch | openSUSE |
|---|---|---|---|---|
| `apt autoremove` + `apt clean` | Funciona | **Falha** | **Falha** | **Falha** |
| `journalctl --vacuum-size=100M` | Funciona | Funciona | Funciona | Funciona |
| Revisões desativadas do snap | Funciona | Se o snap estiver instalado | Se o snap estiver instalado | Se o snap estiver instalado |
| Lista de kernels (`dpkg --list`) | Funciona | Silencioso — não imprime nada | Silencioso | Silencioso |
| Arquivos do `/tmp` com mais de 7 dias | Funciona | Funciona | Funciona | Funciona |
| Liberação do cache de páginas | Funciona | Funciona | Funciona | Funciona |

As etapas do journal, do `/tmp` e do cache de páginas dependem de `journalctl`, `find` e `sysctl`, que se comportam igual onde houver systemd. A etapa do kernel só lista de qualquer forma, então a falha dela em sistemas sem dpkg não custa nada.

## Fazendo você mesmo a parte dos pacotes {#doing-the-package-part-yourself}

Num sistema que não seja Debian, siga as orientações de manutenção do próprio gerenciador de pacotes. Os comandos abaixo são exemplos para revisar antes de rodar:

```bash
# Fedora / RHEL / Rocky
sudo dnf autoremove
sudo dnf clean all

# Arch / Manjaro  (o paccache fica no pacman-contrib)
sudo pacman -Rns "$(pacman -Qtdq)"    # órfãos, se houver
sudo paccache -r                       # mantém as 3 últimas versões
sudo pacman -Scc                       # limpa todo o cache de pacotes

# openSUSE
sudo zypper clean --all
sudo zypper packages --orphaned
```

Para os caches da pasta pessoal, visualize o que o linux-cleanup encontra:

```bash
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

## Caches da pasta pessoal {#home-cache-targets}

Os caminhos da pasta pessoal vêm das ferramentas instaladas, não da distribuição. O que existe varia de máquina para máquina:

- Caches de gerenciadores de pacotes — yarn, npm, pnpm, pip, composer, bun, deno
- Caches de navegadores — Chrome, Firefox, Brave, Chromium, Edge, Vivaldi
- Caches de ferramentas de build — Gradle, Cypress, Playwright, TypeScript
- Dados de ferramentas de desenvolvimento — Android AVD, Flutter pub-cache, Dart, flatpak
- Extensões de editores — VS Code, Cursor
- `node_modules`, downloads incompletos, arquivos pessoais sem uso
- Verificação, auditoria, checagens de segurança e logs locais

## Contêineres mínimos {#minimal-containers}

O Alpine e outras imagens mínimas costumam vir com BusyBox em vez de GNU coreutils. A ferramenta precisa de `find`, `du`, `stat` e principalmente `realpath` do GNU — é ele que resolve os links simbólicos antes da [checagem de caminhos protegidos](./reference/protected-paths.md).

```bash
apk add coreutils findutils bash
linux-cleanup --self-test
```

O `--self-test` aponta a primeira dependência que falta. Não rode modos que apagam até ele passar.

## WSL {#wsl}

A ferramenta roda no ambiente Linux. A proteção de caminhos resolve links simbólicos, mas não reconhece as pastas pessoais do Windows como pastas protegidas do Linux. Revise com cuidado a verificação e a simulação se a sua pasta pessoal ou os caches apontarem para `/mnt/`.

## macOS {#macos}

Não é suportado. O pacote npm declara `"os": ["linux"]` e se recusa a instalar. Caminhos, opções do `find` e gerenciadores de pacotes são todos diferentes.

## Próximos passos {#next}

- [Limpeza do sistema](./modes/system-cleanup.md) — o modo que esta página detalha
- [Requisitos](./getting-started/requirements.md)
