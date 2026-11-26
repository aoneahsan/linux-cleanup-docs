---
sidebar_position: 10
title: linux-cleanup e Czkawka
description: "Como linux-cleanup e Czkawka diferem, pelas próprias páginas, conferido em 2026-11-22."
---

# linux-cleanup e Czkawka

*Conferido em 2026-11-22 com a <a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">página oficial do Czkawka</a>.*

**O que é:** Um utilitário para encontrar duplicados, pastas vazias, mídias parecidas e outras bagunças.

**Preço lá:** Não informado nas páginas que verificamos. **Preço aqui:** A linha de comando é gratuita sob a licença MIT. Os planos do aplicativo para desktop estão na [página de preços](https://linux-cleanup.aoneahsan.com/pt-BR/pricing).

| | linux-cleanup | Czkawka |
|---|---|---|
| Interface de linha de comando | Sim | Sim (<a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">fonte</a>) |
| Prévia antes de apagar | Sim | Não informado nas páginas que verificamos |
| Simulação | Sim | Não informado nas páginas que verificamos |
| Limpeza de cache | Sim | Não informado nas páginas que verificamos |
| Busca de arquivos duplicados | Em parte | Sim (<a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">fonte</a>) |

## Para quem o Czkawka serve melhor {#who-is-better-served-by-czkawka}

Escolha o Czkawka para encontrar arquivos pessoais duplicados ou parecidos; o linux-cleanup não se propõe a esse trabalho.

## Onde o linux-cleanup está à frente {#where-linux-cleanup-is-ahead}

Escolha o linux-cleanup para caches, logs e arquivos temporários que passaram do limite de ociosidade; as próprias páginas do Czkawka descrevem a busca por arquivos duplicados e parecidos.

## Por onde começar aqui {#where-to-start-here}

Não existe importação de uma ferramenta para a outra: cada uma mantém as próprias regras. Para ver o que o linux-cleanup faria no seu computador, comece por [Visualizar antes de apagar](../safety/preview-first.md) e rode `npx -y linux-cleanup --all-safe --yes --dry-run`, que não apaga nada.
