---
title: Solução de problemas
description: Sintoma, causa e solução para os problemas que os usuários do linux-cleanup realmente encontram — recusas, dependências faltando, falhas no cron, verificações lentas e confusão de versões.
tags: [troubleshooting, errors, fixes, cron, jq, whiptail]
sidebar_position: 92
---

# Solução de problemas

Sintoma → causa → solução. Rode primeiro o comando de checagem; se bater, aplique a solução.

Se você perdeu dados em vez de dar de cara com um erro, vá para [Recuperação](./recovery.md).

## REFUSE: protected path {#refuse-protected-path}

```text
✗ REFUSE: protected path: /home/you/Documents/something
```

**Causa.** Depois de expandir os links simbólicos, o caminho foi parar em algum lugar da [lista protegida](./reference/protected-paths.md). A lista de caminhos permitidos bloqueou.

**Esse é o comportamento certo, não uma falha.** Nada foi apagado.

**Solução.** Descubra o que foi parar onde:

```bash
linux-cleanup --list-targets
realpath <the path that was rejected>
```

Quase sempre é um cache com link simbólico para dentro de uma pasta protegida. **Corrija o link, não a ferramenta** — ela está fazendo exatamente o trabalho dela. De propósito, não existe opção para passar por cima.

Duas mensagens relacionadas:

```text
✗ REFUSE: unsafe path: '/home/you'            # $HOME ou / sozinho
✗ REFUSE: shell-init / history file: …        # .bashrc, .zshrc e parecidos
```

## TUI mode needs whiptail or dialog {#tui-mode-needs-whiptail-or-dialog}

**Causa.** `--tui` foi rodado sem nenhum dos dois instalado.

**Solução.** Instale um deles ou aceite a volta sugerida para o menu da CLI.

```bash
sudo apt install whiptail     # Debian / Ubuntu
sudo dnf install newt         # Fedora / RHEL
sudo pacman -S libnewt        # Arch
```

**Checagem.** `command -v whiptail` e rode de novo. Veja [TUI](./modes/tui.md).

## export requires jq {#export-requires-jq}

**Causa.** `--export md`, `--export html` ou uma conversão no gerenciador de relatórios sem o `jq` instalado.

**Solução.**

```bash
sudo apt install jq
```

O `jq` só é necessário para a conversão. Os registros JSON continuam sendo gravados em toda execução sem ele. Veja [Relatórios](./modes/reports.md).

## command not found {#command-not-found}

**Causa.** Falta uma dependência necessária ou ela está escondida atrás de um alias incompatível. É comum em contêineres mínimos que vêm com BusyBox no lugar do GNU coreutils.

**Checagem.**

```bash
linux-cleanup --self-test
```

Ele testa cada comando necessário e diz qual é o primeiro que falta.

**Solução.** Instale os pacotes coreutils, findutils e gawk da sua distribuição. No Alpine:

```bash
apk add coreutils findutils bash
```

O `realpath` é o mais importante — é ele que deixa a [checagem de caminhos protegidos](./reference/protected-paths.md) segura contra links simbólicos. Veja [Distribuições suportadas](./distro-support.md#minimal-containers).

## A tarefa do cron roda mas não faz nada {#cron-entry-runs-but-does-nothing}

**Checagem.**

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

**Causa.** Um `command not found` no log do cron quer dizer que o `PATH` mínimo do cron (`/usr/bin:/bin`) não enxerga sua instalação. Esse é o problema mais comum com cron.

**Solução.** Use um caminho absoluto no crontab:

```bash
crontab -e
# Troque:  0 3 * * 0 linux-cleanup --all-safe -y …
# Por:  0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y …
```

Descubra o caminho certo com `command -v linux-cleanup`. Outra opção é colocar uma linha `PATH=` no topo do crontab. Veja [Alias e cron](./guides/alias-and-cron.md).

## $HOME is not set {#home-is-not-set}

```text
✗ $HOME is not set
```

**Causa.** Rodar num contexto que não define `$HOME` — algumas imagens Docker, alguns executores de CI.

**Solução.**

```bash
HOME=/root linux-cleanup --scan
```

Ou exporte uma vez para a sessão. O script para em vez de adivinhar, de propósito: um `$HOME` errado faria toda checagem de caminho ser feita na árvore errada.

## A verificação ou o --node-modules parece travado {#scan-or---node-modules-seems-to-hang}

**Causa.** O `find` está percorrendo milhares de pastas dentro do `$HOME`. Num HD mecânico, a primeira execução leva de um a três minutos.

**Checagem.** Acompanhe o log em vez do terminal:

```bash
tail -f ~/.linux-cleanup/logs/cleanup-*.log
```

Se aparecerem linhas novas a cada cinco a dez segundos, ele está trabalhando.

**Solução.** Tenha paciência na primeira execução; as próximas são mais rápidas graças aos metadados de pastas em cache. Se o mesmo caminho travar sempre por mais de cinco minutos, desconfie de um loop de links simbólicos ou de uma montagem de rede ou FUSE que não responde — e [reporte](./guides/send-a-bug-report.md).

## O uso do disco aumentou durante a sessão {#disk-usage-grew-during-the-session}

**Causa.** A recuperação mostrada é uma diferença de `df` na máquina inteira. Outro processo — um build, uma atualização de pacotes, a rotação do journal, um IDE reindexando — gravou mais durante a sessão do que a limpeza liberou.

**Não é bug**, e não quer dizer que a limpeza falhou. Veja o que as próprias etapas informaram:

```bash
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

**Solução.** Rode `--scan` de novo quando a máquina estiver tranquila para ver o cenário real.

## apt update falha depois do --system {#apt-update-fails-after---system}

**Causa.** É raro. `apt clean` não quebra o `apt update`, mas a limpeza pode ter coincidido com outra operação do apt segurando uma trava.

**Checagem.**

```bash
sudo apt update 2>&1 | tail -20
```

**Solução.**

```bash
sudo rm -f /var/lib/apt/lists/lock /var/cache/apt/archives/lock /var/lib/dpkg/lock-frontend
sudo apt update
```

Só faça isso quando não houver de fato nenhum processo do apt rodando — antes, `ps aux | grep -i apt`.

## O VS Code diz que falta uma extensão {#vs-code-reports-a-missing-extension}

**Causa.** Normalmente é o comportamento esperado: uma versão substituída foi removida enquanto o editor ainda fazia referência a ela.

**Solução.** Recarregue a janela — `Ctrl+Shift+P` → **Developer: Reload Window**.

**Confira** se a versão atual continua lá:

```bash
ls ~/.vscode/extensions/ | grep <extension-name>
```

Se a versão *atual* realmente sumiu, é sinal de bug na detecção da versão mais alta. Reinstale e [reporte](./guides/send-a-bug-report.md):

```bash
code --install-extension <publisher>.<name>
```

## Apareceu um pacote de falha, mas não vi falha nenhuma {#a-crash-bundle-appeared-but-i-saw-no-crash}

**Causa.** O script saiu com código diferente de zero num ponto inesperado — um `find` em segundo plano encerrado pelo OOM killer, ou um pipe quebrado.

**Solução.** Leia o código de saída no manifesto do pacote:

```bash
tar -xzOf ~/.linux-cleanup/feedback/crash-*.tar.gz --wildcards '*MANIFEST*'
```

`137` é o OOM killer, `141` é SIGPIPE, `139` é falha de segmentação. Veja [Códigos de saída](./reference/exit-codes.md). Qualquer um deles vale um relatório.

## O alias cleanup não é encontrado depois do --install-alias {#alias-cleanup-not-found-after---install-alias}

**Causa.** O arquivo rc do shell ainda não foi relido.

**Solução.**

```bash
source ~/.bashrc      # ou ~/.zshrc
```

Ou abra um terminal novo.

## Está rodando a versão errada {#wrong-version-running}

**Checagem.**

```bash
command -v linux-cleanup
linux-cleanup --version
```

**Causa.** Uma instalação global antiga escondendo um cache mais novo do `npx`, ou um hash de comandos do shell desatualizado.

**Solução.**

```bash
npm uninstall -g linux-cleanup
npm install -g linux-cleanup@latest
hash -r
linux-cleanup --version
```

Veja o [pacote no npm](https://www.npmjs.com/package/linux-cleanup) para saber a versão publicada atual. Confira o [registro de mudanças](./changelog.md) para o que mudou desde a sua cópia instalada.

## Ainda sem solução {#still-stuck}

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

Revise o pacote e mande por e-mail com uma descrição curta do que você esperava e do que aconteceu. Veja [Enviar um relatório de bug](./guides/send-a-bug-report.md).
