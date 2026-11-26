---
sidebar_position: 7
title: linux-cleanup e TuxCleaner
description: "Como linux-cleanup e TuxCleaner diferem, pelas próprias páginas, conferido em 2026-11-22."
---

# linux-cleanup e TuxCleaner

*Conferido em 2026-11-22 com a <a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">página oficial do TuxCleaner</a>.*

**O que é:** Uma CLI para Linux de limpeza, desinstalação de apps, análise de disco e status.

**Preço lá:** Não informado nas páginas que verificamos. **Preço aqui:** A linha de comando é gratuita sob a licença MIT. Os planos do aplicativo para desktop estão na [página de preços](https://linux-cleanup.aoneahsan.com/pt-BR/pricing).

| | linux-cleanup | TuxCleaner |
|---|---|---|
| Interface de linha de comando | Sim | Sim (<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">fonte</a>) |
| Prévia antes de apagar | Sim | Sim (<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">fonte</a>) |
| Simulação | Sim | Sim (<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">fonte</a>) |
| Limpeza de cache | Sim | Sim (<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">fonte</a>) |
| Busca de arquivos duplicados | Em parte | Não informado nas páginas que verificamos |

## Para quem o TuxCleaner serve melhor {#who-is-better-served-by-tuxcleaner}

Escolha o TuxCleaner pelos adaptadores de pacotes específicos de cada distribuição e pela desinstalação de apps.

## Onde o linux-cleanup está à frente {#where-linux-cleanup-is-ahead}

Escolha o linux-cleanup se você prefere rodar um script Bash pelo npx, sem etapa de build, e manter as regras de só-ocioso para unidades inteiras do Gradle e do Android Studio.

## Por onde começar aqui {#where-to-start-here}

Não existe importação de uma ferramenta para a outra: cada uma mantém as próprias regras. Para ver o que o linux-cleanup faria no seu computador, comece por [Visualizar antes de apagar](../safety/preview-first.md) e rode `npx -y linux-cleanup --all-safe --yes --dry-run`, que não apaga nada.
