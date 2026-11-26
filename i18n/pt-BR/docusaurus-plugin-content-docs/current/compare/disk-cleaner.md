---
sidebar_position: 9
title: linux-cleanup e Disk Cleaner
description: "Como linux-cleanup e Disk Cleaner diferem, pelas próprias páginas, conferido em 2026-11-22."
---

# linux-cleanup e Disk Cleaner

*Conferido em 2026-11-22 com a <a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">página oficial do Disk Cleaner</a>.*

**O que é:** Um limpador GTK para Linux com visualizações do disco e tarefas de limpeza sugeridas.

**Preço lá:** Não informado nas páginas que verificamos. **Preço aqui:** A linha de comando é gratuita sob a licença MIT. Os planos do aplicativo para desktop estão na [página de preços](https://linux-cleanup.aoneahsan.com/pt-BR/pricing).

| | linux-cleanup | Disk Cleaner |
|---|---|---|
| Interface de linha de comando | Sim | Sim (<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">fonte</a>) |
| Prévia antes de apagar | Sim | Não informado nas páginas que verificamos |
| Simulação | Sim | Sim (<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">fonte</a>) |
| Limpeza de cache | Sim | Sim (<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">fonte</a>) |
| Busca de arquivos duplicados | Em parte | Não informado nas páginas que verificamos |

## Para quem o Disk Cleaner serve melhor {#who-is-better-served-by-disk-cleaner}

Escolha o Disk Cleaner se você precisa de uma visualização interativa em treemap ou sunburst.

## Onde o linux-cleanup está à frente {#where-linux-cleanup-is-ahead}

Escolha o linux-cleanup se você quer que a ferramenta decida por regras quais caches passaram do limite de ociosidade, em vez de ler um gráfico e escolher na mão.

## Por onde começar aqui {#where-to-start-here}

Não existe importação de uma ferramenta para a outra: cada uma mantém as próprias regras. Para ver o que o linux-cleanup faria no seu computador, comece por [Visualizar antes de apagar](../safety/preview-first.md) e rode `npx -y linux-cleanup --all-safe --yes --dry-run`, que não apaga nada.
