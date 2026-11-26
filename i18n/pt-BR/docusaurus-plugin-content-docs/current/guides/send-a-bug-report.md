---
title: Enviar um relatório de bug
description: Como reportar um bug do linux-cleanup — criar um pacote de depuração, o que um pacote de falha contém, o que revisar antes de enviar e para onde enviar.
tags: [guide, bug-report, feedback, debug-bundle, crash, privacy]
sidebar_position: 3
---

# Enviar um relatório de bug

**Dois comandos geram tudo o que quem mantém a ferramenta precisa.** Nada é enviado automaticamente — você revisa o pacote e envia por conta própria.

```bash
linux-cleanup --debug-bundle    # empacota o log e o registro de sessão mais recentes
linux-cleanup --feedback        # instruções e um rascunho mailto opcional
```

## O caminho rápido {#the-quick-path}

```bash
linux-cleanup --debug-bundle
```

Grava `~/.linux-cleanup/feedback/debug-bundle-<timestamp>.tar.gz`, com:

- O log de sessão mais recente
- O registro JSON de sessão mais recente, se existir
- Um `MANIFEST.txt` com a distribuição, o kernel, a versão do bash e a saída do autoteste

Depois:

```bash
linux-cleanup --feedback
```

Mostra o que incluir e oferece abrir um rascunho `mailto:` com as informações do sistema já preenchidas.

## Revise o pacote antes de enviar {#review-the-bundle-before-sending-it}

:::caution Um pacote contém caminhos da sua máquina
Não o conteúdo dos arquivos — mas o log cita todo caminho tocado, ou seja, nomes de pastas, de projetos e às vezes nomes de arquivos de `~/Downloads`.

Confira antes:

```bash
tar -tzf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz     # lista o conteúdo
tar -xzOf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz    # lê tudo
```

Se houver algo sensível, extraia o pacote, remova ou censure o arquivo e empacote de novo — ou mande só o manifesto e as linhas que importam.
:::

## Pacotes de falha {#crash-bundles}

Desde a [1.3.0](../changelog.md#130--2026-05-10), uma saída inesperada com código diferente de zero grava automaticamente `crash-<timestamp>.tar.gz` na mesma pasta e mostra o caminho.

Ele traz o log ativo, o registro mais recente e um manifesto do sistema com o código de saída.

**O pacote não é enviado para lugar nenhum.** A checagem de versões lê um arquivo de texto público, mas não envia pacote nem caminhos locais. O pacote fica no seu disco até você decidir se vai compartilhar.

Pacotes de falha **não** são gravados em saídas esperadas: `0`, `130` (`Ctrl-C`), `143` (SIGTERM) e `2` (erro de argumentos) ficam de fora. Veja [Códigos de saída](../reference/exit-codes.md#how-the-crash-trap-decides).

## O que incluir {#what-to-include}

Um bom relatório é curto e específico:

| Inclua | Exemplo |
|---|---|
| Distribuição e versão | `lsb_release -d` |
| Versão do Bash | `bash --version \| head -1` |
| Versão da ferramenta | `linux-cleanup --version` |
| O comando exato | `linux-cleanup --all-safe -y -d 30` |
| O esperado e o que aconteceu | "esperava que o wrapper do Gradle fosse mantido, mas ele foi apagado" |
| O pacote | Anexe o tar.gz |

A linha mais valiosa é **o esperado e o que aconteceu**. Um log sozinho mostra o que aconteceu, mas não por que você acha que estava errado.

## Para onde enviar {#where-to-send-it}

| Canal | Para |
|---|---|
| [GitHub issues](https://github.com/aoneahsan/linux-cleanup/issues) | Bugs, pedidos de recurso — o preferido, público |
| [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) | Qualquer coisa que você prefira não publicar |
| Um pull request | Você tem uma correção. Licença MIT, forks são bem-vindos |

Pedidos de recurso só com descrição são tão bem-vindos quanto código. Diga o que você gostaria que fosse limpo e por que os modos atuais não cobrem.

## Bugs que valem um relatório imediato {#bugs-worth-reporting-immediately}

Qualquer coisa que contradiga o modelo de segurança documentado:

- Uma exclusão dentro de um [caminho protegido](../reference/protected-paths.md)
- A versão *atual* de uma extensão de editor removida, e não só uma substituída
- Um arquivo apagado apesar de ser mais novo que `--days`, sem `--purge-all`
- Um modo de dados pessoais agindo sem confirmação
- Uma requisição de rede que envie caminhos locais de limpeza ou relatórios

Cada um deles é uma violação do modelo de segurança, não só um incômodo.

## Privacidade: o que sai da sua máquina {#privacy-what-leaves-your-machine}

:::note Checagem de versões e relatórios locais
Ao iniciar, quando há conexão, o linux-cleanup lê um registro público de versões por HTTPS. Ele não envia verificações, logs nem pacotes de falha. Instalar ou atualizar uma cópia usa o npm ou o GitHub.

Confira num clone:

```bash
grep -rE 'curl|wget|http://|https://' cleanup.sh lib/ modules/ bin/
```

Leia `modules/update_check.sh` para ver a requisição de versões e o comando oferecido para uma cópia mais nova.
:::

Logs, registros e pacotes são arquivos locais. Quem mantém a ferramenta não consegue vê-los nem mandar uma correção para a sua máquina — uma versão nova só chega quando você roda o `npx` de novo ou atualiza.

## Próximos passos {#next}

- [Solução de problemas](../troubleshooting.md) — olhe aqui primeiro
- [Recuperação](../recovery.md) — se dados foram perdidos
- [Códigos de saída](../reference/exit-codes.md)
