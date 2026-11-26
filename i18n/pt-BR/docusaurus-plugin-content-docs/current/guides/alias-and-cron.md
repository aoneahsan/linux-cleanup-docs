---
title: Alias do shell e cron semanal
description: Instale um alias de shell cleanup e uma execução automática semanal totalmente segura, veja o que cada um grava e como remover de novo.
tags: [guide, alias, cron, automation, scheduling, setup]
sidebar_position: 2
---

# Alias do shell e cron semanal

**Dois auxiliares de configuração de uma vez só: um alias de shell `cleanup` e uma execução automática semanal.** Os dois podem ser desfeitos com a opção de desinstalação correspondente.

```bash
linux-cleanup --install-alias
linux-cleanup --install-cron
```

## O alias do shell {#the-shell-alias}

```bash
linux-cleanup --install-alias
```

Acrescenta um alias `cleanup` ao `~/.bash_aliases` ou ao `~/.zshrc`, conforme o seu shell. Depois disso, digitar `cleanup` em qualquer lugar roda a ferramenta.

Recarregue o shell, senão vai parecer que o alias não existe:

```bash
source ~/.bashrc     # ou ~/.zshrc
```

Remova com `linux-cleanup --uninstall-alias`.

:::note Os arquivos de inicialização do shell são protegidos na camada de exclusão
`.bashrc`, `.zshrc`, `.bash_aliases` e parecidos estão na [lista de nomes de arquivo protegidos](../reference/protected-paths.md#protected-basenames), então nenhum modo de limpeza consegue apagar um deles, seja qual for o caminho. O instalador do alias acrescenta uma linha; o desinstalador só remove a dele.
:::

## A tarefa semanal do cron {#the-weekly-cron-job}

```bash
linux-cleanup --install-cron
```

Agenda o `--all-safe -y` para **domingos às 03:00**, acrescentando a saída em `~/.linux-cleanup/logs/cron.log`. Exige o `crontab`.

Remova com `linux-cleanup --uninstall-cron`.

### Por que o `--all-safe` é o modo certo para isso {#why---all-safe-is-the-right-mode-for-this}

É o único modo em que o `--yes` vale, e ele **não consegue mexer em dados pessoais** — os modos só interativos não fazem parte dele e ignoram o `--yes` por projeto. Então uma execução sem supervisão pode limpar caches e nunca consegue apagar um arquivo de `~/Downloads`. Veja a [barreira 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

O [limite de ociosidade](../safety/guards.md#guard-2--the-staleness-gate) continua valendo, então arquivos usados recentemente sobrevivem a cada passada semanal.

## Escrevendo a entrada do crontab você mesmo {#writing-the-crontab-entry-yourself}

Para outro horário ou outras opções:

```bash
crontab -e
```

```bash
0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1
```

:::danger Use um caminho absoluto
O cron roda com um `PATH` mínimo — normalmente só `/usr/bin:/bin`. Um `linux-cleanup` sem caminho não será encontrado se estiver em `~/.local/bin` ou numa pasta de gerenciador de versões do Node, e a tarefa vai falhar em silêncio toda semana.

Esse é o problema mais comum em execuções agendadas. Descubra o seu caminho com:

```bash
command -v linux-cleanup
```

Ou defina `PATH=` explicitamente no topo do crontab.
:::

| Opção | Por que no cron |
|---|---|
| `--all-safe -y` | Sem supervisão, só caches |
| `--no-report` | Impede que os registros JSON se acumulem — eles **nunca** são apagados sozinhos |
| `--cleanup-logs` | Remove o log daquela execução no fim |
| `-d 30` | Opcional: poda semanal mais agressiva |

O `--cleanup-logs` sozinho não basta para manter a pasta pequena: ele nunca mexe nos registros. Quem faz isso é o `--no-report`.

:::caution Não acrescente `--purge-all` a uma tarefa agendada
Sem supervisão e sem limite de ociosidade significa que algo caro pode sumir na semana anterior àquela em que você vai precisar, sem ninguém olhando. Deixe o `--purge-all` para execuções conscientes e acompanhadas. Veja [Recuperar o máximo de espaço](./reclaim-the-most-space.md).
:::

## Conferindo se rodou {#checking-that-it-ran}

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

Se o log mostrar `command not found`, é o problema de `PATH` de cima. Se o log estiver vazio, a tarefa nunca disparou — confira se o daemon do cron está rodando (`systemctl status cron` ou `crond`).

O log do cron **nunca é rotacionado**. Rotacione você mesmo quando ele crescer:

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## Um temporizador do systemd no lugar {#a-systemd-timer-instead}

Se você prefere temporizadores ao cron, não há nada específico da ferramenta nisso — agende o mesmo comando. A ferramenta não sabe nem se importa com qual agendador a chamou, e o `--install-cron` é uma comodidade, não uma exigência.

## Removendo os dois {#removing-both}

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

Remoção completa, incluindo o próprio pacote: [Desinstalar](./uninstall.md).
