---
sidebar_position: 8
title: linux-cleanup e Ubuntu Cleaner
description: "Como linux-cleanup e Ubuntu Cleaner diferem, pelas próprias páginas, conferido em 2026-11-22."
---

# linux-cleanup e Ubuntu Cleaner

*Conferido em 2026-11-22 com a <a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">página oficial do Ubuntu Cleaner</a>.*

**O que é:** Um limpador em Bash para Ubuntu, Debian e Linux Mint, com manutenção de pacotes e de caches de desenvolvimento.

**Preço lá:** Não informado nas páginas que verificamos. **Preço aqui:** A linha de comando é gratuita sob a licença MIT. Os planos do aplicativo para desktop estão na [página de preços](https://linux-cleanup.aoneahsan.com/pt-BR/pricing).

| | linux-cleanup | Ubuntu Cleaner |
|---|---|---|
| Interface de linha de comando | Sim | Sim (<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">fonte</a>) |
| Prévia antes de apagar | Sim | Sim (<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">fonte</a>) |
| Simulação | Sim | Sim (<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">fonte</a>) |
| Limpeza de cache | Sim | Sim (<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">fonte</a>) |
| Busca de arquivos duplicados | Em parte | Não informado nas páginas que verificamos |

## Para quem o Ubuntu Cleaner serve melhor {#who-is-better-served-by-ubuntu-cleaner}

Escolha o Ubuntu Cleaner pelo foco na família Debian e pela manutenção do Docker.

## Onde o linux-cleanup está à frente {#where-linux-cleanup-is-ahead}

Escolha o linux-cleanup se você quer que a limpeza rode com o seu usuário normal e deixe os pacotes do sistema para um modo --system separado e explícito.

## Por onde começar aqui {#where-to-start-here}

Não existe importação de uma ferramenta para a outra: cada uma mantém as próprias regras. Para ver o que o linux-cleanup faria no seu computador, comece por [Visualizar antes de apagar](../safety/preview-first.md) e rode `npx -y linux-cleanup --all-safe --yes --dry-run`, que não apaga nada.
