---
title: Requisitos
description: O que o linux-cleanup precisa para rodar — bash 4+, GNU coreutils, só Linux — e as dependências opcionais que liberam a exportação de relatórios e o menu visual.
tags: [requirements, dependencies, installation, jq, whiptail]
sidebar_position: 1
---

# Requisitos

**O linux-cleanup roda no Linux com `bash` 4 ou mais recente e GNU coreutils.** Todo o resto é opcional, e a ferramenta continua funcionando sem ele.

## Plataforma {#platform}

| | |
|---|---|
| **Sistema operacional** | Só Linux. O pacote npm declara `"os": ["linux"]` e se recusa a instalar em outros sistemas |
| **Shell** | `bash` ≥ 4.0 |
| **Node.js** | ≥ 14 — **só** para `npx` e `npm install -g`. Não é necessário para um git clone |
| **Permissões** | Roda como usuário comum. Só o [`--system`](../modes/system-cleanup.md) pede `sudo` |

Vale separar macOS e WSL:

- **O macOS não é suportado.** Os caminhos, as opções do `find` e os gerenciadores de pacotes são diferentes. Existe uma ferramenta irmã para ele; não use esta num Mac.
- **O WSL roda do lado Linux.** Confira antes de uma limpeza qualquer link simbólico do `$HOME` para `/mnt/c/`. A [lista de caminhos permitidos](../reference/protected-paths.md) resolve links simbólicos, mas os caminhos protegidos da pasta pessoal do Linux não significam que todas as pastas do Windows estejam protegidas.

## Comandos necessários {#required-commands}

Eles vêm em praticamente todas as distribuições populares: `bash`, `find`, `du`, `df`, `rm`, `awk`, `sort`, `grep`, `sed`, `stat`, `realpath`.

O `realpath` importa mais que os outros: é ele que resolve os links simbólicos antes da checagem de caminhos protegidos. Numa imagem de contêiner mínima sem GNU coreutils, instale-os antes de rodar.

```bash
npx linux-cleanup --self-test
```

`--self-test` testa cada comando necessário e diz qual é o primeiro que falta, com uma dica de correção. Rode antes de qualquer coisa que apague.

## Dependências opcionais {#optional-dependencies}

Cada uma libera um recurso. Sem ela, aquele recurso fica indisponível e o resto da ferramenta não é afetado.

| Dependência | Libera | Sem ela |
|---|---|---|
| `jq` | [Exportação de relatórios](../modes/reports.md) em Markdown / HTML | Os relatórios JSON continuam sendo gravados; a conversão fica indisponível |
| `whiptail` | O [menu TUI](../modes/tui.md) visual | `--tui` volta ao menu da CLI com uma dica de instalação |
| `dialog` | Alternativa de TUI quando falta o `whiptail` | Igual ao anterior |
| `snap` | Limpeza de revisões de snap desativadas no `--system` | Essa etapa é pulada sem problemas |
| `crontab` | O [instalador semanal do cron](../guides/alias-and-cron.md) | `--install-cron` não consegue rodar |
| `numfmt` | Tamanhos em bytes legíveis | Mostra a contagem bruta de bytes |
| `xdg-open` | Abrir relatórios HTML no navegador | Abra o arquivo manualmente |
| `less` | Visualização paginada do JSON no gerenciador de relatórios | Leia o arquivo direto |
| `lsb_release` | Detecção melhor da distribuição nos pacotes de feedback | O pacote é gerado mesmo assim |

### Instalando as duas que importam {#installing-the-two-that-matter}

`jq` (exportação de relatórios) e `whiptail` (menu visual) são as duas que a maioria das pessoas quer.

```bash
# Debian / Ubuntu / Mint
sudo apt install jq whiptail

# Fedora / RHEL / Rocky
sudo dnf install jq newt

# Arch / Manjaro
sudo pacman -S jq libnewt

# openSUSE
sudo zypper install jq newt
```

O binário `whiptail` vem no pacote `newt` nas distribuições baseadas em RPM e no `libnewt` no Arch.

## Distribuições cobertas {#distro-coverage}

A limpeza de caches dentro do `$HOME` — que é a grande maioria do que esta ferramenta recupera — funciona igual em todas as distribuições Linux.

:::warning `--system` é só para Debian/Ubuntu
O modo com sudo chama `apt` e `dpkg` diretamente, sem detectar a distribuição e sem proteção. No Fedora, no Arch ou no openSUSE, as etapas de pacotes falham com "command not found".

O detalhamento completo do que funciona onde: [Distribuições suportadas](../distro-support.md).
:::

## Saída em disco {#output-on-disk}

Cada execução pode gravar um log local. Um passeio guiado também pode gravar um relatório JSON, e um pacote de depuração é criado quando você pede ou depois de uma falha inesperada. O tamanho depende da execução. Veja [Caminhos de saída](../reference/output-paths.md) para a organização.

## Próximos passos {#next}

- [Instalação](./installation.md) — os três jeitos de instalar
- [Início rápido](./quick-start.md) — sua primeira limpeza
