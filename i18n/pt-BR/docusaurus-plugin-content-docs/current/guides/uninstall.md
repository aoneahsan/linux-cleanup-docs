---
title: Desinstalar
description: Remova o linux-cleanup por completo — o pacote, o alias do shell, a entrada do cron e os logs e registros de sessão.
tags: [guide, uninstall, remove, cleanup, cron, alias]
sidebar_position: 4
---

# Desinstalar

**Remova primeiro a automação, depois o pacote, depois os dados.** Desinstalar o pacote não remove um alias do shell nem uma entrada do cron que você instalou — são coisas separadas.

## 1. Remova a automação {#1-remove-the-automation}

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

Faça isso **antes** de remover o pacote, enquanto o comando ainda existe. Se você já removeu, veja a [remoção manual](#if-you-removed-the-package-first) mais abaixo.

Confira:

```bash
crontab -l | grep -i cleanup     # não deve aparecer nada
grep -rn 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

## 2. Remova o pacote {#2-remove-the-package}

```bash
npm uninstall -g linux-cleanup
```

Com o `npx`, nada fica instalado — o cache do npm descarta sozinho. Para limpar agora:

```bash
npm cache clean --force
```

Para um git clone, apague a pasta:

```bash
rm -rf ~/linux-cleanup
```

:::caution Um clone guarda os próprios logs e registros
Diferente das instalações pelo npm, um clone guarda a saída em `<clone>/logs/` e `<clone>/reports/`. Apagar o clone apaga isso também. Copie antes o que quiser manter. Veja [Caminhos de saída](../reference/output-paths.md).
:::

## 3. Remova os dados {#3-remove-the-data}

Logs, registros de sessão e pacotes de feedback ficam em `~/.linux-cleanup/` e **nunca** são removidos na desinstalação.

```bash
ls -la ~/.linux-cleanup/           # olhe antes de apagar
rm -rf ~/.linux-cleanup/
```

São pequenos — normalmente alguns megabytes — e são o único relato do que as execuções anteriores apagaram. Mantê-los não custa nada; apagá-los é irreversível como qualquer outra coisa.

Se você definiu `LINUX_CLEANUP_DATA_HOME`, apague essa pasta em vez disso e tire o export da configuração do shell.

## 4. Remova a configuração, se você criou alguma {#4-remove-configuration-if-you-created-any}

```bash
rm -f ~/.config/personal-roots.txt ~/.config/project-roots.txt
```

Só existem se você mesmo criou. Veja [Variáveis de ambiente](../reference/environment-variables.md#configuring-the-scanned-roots).

## Se você removeu o pacote primeiro {#if-you-removed-the-package-first}

Desfaça os dois auxiliares à mão.

**Cron:**

```bash
crontab -e
# apague a linha que contém linux-cleanup ou cleanup.sh
```

**Alias:**

```bash
grep -n 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

Remova a linha do alias no seu editor e depois faça `source` do arquivo ou abra um terminal novo.

## O que fica para trás {#what-is-left-behind}

Nada, depois de fazer o que está acima. A ferramenta não instala serviço do sistema, daemon, unidade do systemd, entrada em `/etc` nem arquivo do root. Tudo o que ela cria fica dentro da sua pasta pessoal.

Efeitos no sistema que ela não desfaz — porque não são arquivos dela:

- **Caches apagados continuam apagados.** Eles se regeneram quando cada ferramenta precisa
- **Os blocos de inicialização do shell adicionados pelo [`--doctor`](../modes/doctor.md)** ficam. Eles são a configuração certa para os runtimes que você instalou; remova à mão se não quiser mais

## Confira {#verify}

```bash
command -v linux-cleanup      # não deve aparecer nada
crontab -l | grep -i cleanup  # não deve aparecer nada
ls ~/.linux-cleanup 2>&1      # deve aparecer: No such file or directory
```

## Próximos passos {#next}

- [Instalação](../getting-started/installation.md) — se você for reinstalar
