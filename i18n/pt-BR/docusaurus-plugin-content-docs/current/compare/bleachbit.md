---
sidebar_position: 2
title: linux-cleanup e BleachBit
description: "Como linux-cleanup e BleachBit diferem, pelas próprias páginas, conferido em 2026-11-22."
---

# linux-cleanup e BleachBit

*Conferido em 2026-11-22 com a <a href="https://www.bleachbit.org/features" target="_blank" rel="noopener noreferrer nofollow">página oficial do BleachBit</a>.*

**O que é:** Um limpador de código aberto para espaço em disco e privacidade, com prévia gráfica e CLI.

**Preço lá:** Grátis (<a href="https://www.bleachbit.org/features" target="_blank" rel="noopener noreferrer nofollow">fonte</a>, verificado em 2026-11-22). **Preço aqui:** A linha de comando é gratuita sob a licença MIT. Os planos do aplicativo para desktop estão na [página de preços](https://linux-cleanup.aoneahsan.com/pt-BR/pricing).

| | linux-cleanup | BleachBit |
|---|---|---|
| Interface de linha de comando | Sim | Sim (<a href="https://www.bleachbit.org/features" target="_blank" rel="noopener noreferrer nofollow">fonte</a>) |
| Prévia antes de apagar | Sim | Sim (<a href="https://www.bleachbit.org/features" target="_blank" rel="noopener noreferrer nofollow">fonte</a>) |
| Simulação | Sim | Não informado nas páginas que verificamos |
| Limpeza de cache | Sim | Não informado nas páginas que verificamos |
| Busca de arquivos duplicados | Em parte | Não informado nas páginas que verificamos |

## Para quem o BleachBit serve melhor {#who-is-better-served-by-bleachbit}

Escolha o BleachBit pelo limpador gráfico, pela limpeza de dados privados e pelo suporte a Linux e Windows.

## Onde o linux-cleanup está à frente {#where-linux-cleanup-is-ahead}

Escolha o linux-cleanup para caches de desenvolvimento que ele só remove quando estão ociosos, como os armazenamentos do Gradle, do Playwright e do pnpm, com cada caminho recusado listado na simulação.

## Por onde começar aqui {#where-to-start-here}

Não existe importação de uma ferramenta para a outra: cada uma mantém as próprias regras. Para ver o que o linux-cleanup faria no seu computador, comece por [Visualizar antes de apagar](../safety/preview-first.md) e rode `npx -y linux-cleanup --all-safe --yes --dry-run`, que não apaga nada.
