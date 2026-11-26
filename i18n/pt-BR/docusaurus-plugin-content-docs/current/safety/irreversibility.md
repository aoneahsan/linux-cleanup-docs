---
title: Apagar é permanente
description: O linux-cleanup não tem desfazer, lixeira nem backup. O que isso significa na prática, por que foi feito assim e quais opções você realmente tem depois.
tags: [safety, irreversible, undo, data-loss, recovery]
sidebar_position: 4
---

# Apagar é permanente

**O linux-cleanup chama `rm -rf`. Não há desfazer, pasta de lixeira, snapshot nem etapa de backup.**
Depois que um caminho é removido, esta ferramenta não consegue trazê-lo de volta, nem qualquer opção que você passe para ela.

:::danger Leia antes da sua primeira execução real
- Arquivos apagados **não** vão para a lixeira.
- Não existe `--undo`, comando de restauração nem cópia escondida guardada em lugar nenhum.
- Um log local pode ajudar a refazer o caminho de uma execução; o registro de um passeio guiado resume as etapas. Nenhum dos dois é backup arquivo por arquivo.
- Se um arquivo era insubstituível e você não tinha backup, ele se foi.

A segurança da ferramenta vem inteiramente de [se recusar a apagar a coisa errada](./guards.md) desde o início.
:::

## O que "regenerável" realmente promete {#what-regenerable-actually-promises}

Quase tudo o que esta ferramenta remove é descrito como regenerável. Essa palavra tem um sentido preciso, e vale ser exato sobre o que ela quer e não quer dizer.

| Quer dizer | Não quer dizer |
|---|---|
| Que *outro* programa consegue recriar os dados | Que o linux-cleanup consegue recriá-los |
| Que o próximo `yarn install` baixa o pacote de novo | Que os bytes ainda estão em algum lugar do disco |
| Que o navegador reconstrói o cache enquanto você navega | Que a exclusão é reversível |
| Que recriar pode exigir rede, tempo ou os dois | Que recriar é grátis ou instantâneo |

O pacote de navegadores do Playwright é regenerável, e baixá-lo de novo leva vários minutos e algumas centenas de megabytes. Uma máquina offline não consegue regenerá-lo de jeito nenhum. Regenerável diz de onde os dados podem vir, não o quanto é prático recuperá-los.

## As categorias que são mesmo insubstituíveis {#the-categories-that-are-genuinely-irreplaceable}

Três alvos podem conter dados que não se regeneram. Os três são [só interativos](./guards.md#guard-3--personal-data-is-interactive-only), e os três merecem atenção de verdade na hora de responder às perguntas.

| Alvo | Por que nada traz de volta |
|---|---|
| **Arquivos pessoais** em `~/Downloads` ou em raízes sem proteção configuradas | Não há origem de onde baixar de novo. Se era a única cópia, era a cópia. |
| **Downloads incompletos** (`.crdownload`, `.part`, …) | Só a sessão original do navegador consegue retomá-los, e ela costuma ter acabado há muito tempo. |
| **Trabalho sem commit dentro de um `node_modules` parado** | É raro, mas uma dependência que você editou no lugar não está em nenhum registro. |

A primeira é a que faz as pessoas perderem dados. `~/Downloads` não é um caminho protegido (e *não pode* ser, porque limpá-lo é uma função central), então a única coisa entre um arquivo ali e a exclusão é você ler a lista de candidatos.

## Por que não há desfazer {#why-there-is-no-undo}

Os motivos do projeto, sem rodeios:

1. **Um log de desfazer multiplica a escrita no mesmo disco que você quer liberar.** Guardar 20 GB para recuperar 20 GB não resolve nada.
2. **Ele criaria uma falsa sensação de segurança.** Uma ferramenta que parece reversível convida ao uso descuidado, e a reversão seria parcial na melhor das hipóteses: um desfazer que restaura 90% dos casos é mais perigoso justamente nos outros 10%.
3. **Prevenir vale mais do que recuperar.** A [lista de caminhos permitidos](./guards.md#guard-1--the-path-allowlist), o [limite de ociosidade](./guards.md#guard-2--the-staleness-gate) e a confirmação interativa impedem que a exclusão errada aconteça, o que é sempre melhor do que desfazê-la depois.

É uma troca razoável para caches. É uma troca que você precisa entender antes de apontar a ferramenta para `~/Downloads`.

## O que você realmente tem depois {#what-you-actually-have-afterwards}

Se uma exclusão te pegar de surpresa, confira os registros locais disponíveis. Nenhum deles é backup.

| Arquivo | Local | Contém |
|---|---|---|
| Log da sessão | `~/.linux-cleanup/logs/cleanup-<timestamp>.log` | A saída legível da execução, a menos que o log tenha sido removido |
| Relatório JSON | `~/.linux-cleanup/reports/report-<timestamp>.json` | O resumo das etapas do passeio guiado, a menos que os relatórios tenham sido desativados |

Eles ajudam a identificar o modo e os alvos escolhidos, mas não listam cada arquivo apagado. Não contêm nada do conteúdo apagado.

Procedimento completo: [Recuperação](../recovery.md).

## Reduzindo o risco antes de rodar {#reducing-the-risk-before-you-run}

```bash
# 1. Confirme que as proteções funcionam nesta instalação
npx linux-cleanup --self-test

# 2. Veja o que seria recuperado — não apaga nada
npx linux-cleanup --scan

# 3. Rode o passeio guiado, respondendo 'n' a tudo de que não tiver certeza
npx linux-cleanup
```

Além disso:

- **Tenha backup de tudo o que for insubstituível.** Isso vale com ou sem esta ferramenta; é a única coisa que torna qualquer exclusão recuperável.
- **Nunca use os modos de arquivos pessoais numa máquina que você não revisou.** Rode `--scan` antes.
- **Deixe `--all-safe -y` para os caches de máquinas em que você já confia.** Ele não toca em arquivos pessoais, mas também não mostra nada até terminar.
- **Trate `--purge-all` como ferramenta de antes de reinstalar o sistema**, não de uso diário.

:::tip O único hábito que vale criar
Rode `--scan` antes de `--all-safe`, toda vez. Leva um minuto e é a única etapa que mostra o resultado enquanto ele ainda é hipotético.
:::

## Próximos passos {#next}

- [Recuperação](../recovery.md) — o procedimento depois de uma exclusão indesejada
- [Proteções](./guards.md) — o que impede a exclusão desde o início
- [Visualizar antes de apagar](./preview-first.md) — os modos somente leitura
