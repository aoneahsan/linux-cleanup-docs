---
title: Perguntas frequentes
description: Respostas sobre os caminhos do linux-cleanup, a checagem de versões, simulações, exclusão permanente e distribuições suportadas.
sidebar_position: 93
---

# Perguntas frequentes

Problemas com um sintoma específico ficam em [Solução de problemas](./troubleshooting.md); os motivos do projeto, em [Proteções](./safety/guards.md).

## Ele vai apagar meu código? {#will-it-delete-my-code}

**Seus arquivos-fonte, não.** `~/Documents` e as outras pastas pessoais são [protegidas sem exceção](./reference/protected-paths.md), e nenhum alvo de limpeza aponta para o código-fonte de um projeto.

O mais perto que ele chega é procurar `node_modules` parados nas raízes dos seus projetos. Esses são [só interativos](./modes/node-modules-finder.md), com confirmação por projeto, e o `yarn install` os reconstrói.

Uma ressalva que vale saber: se você editou um arquivo *dentro* de `node_modules` diretamente, em vez de usar uma ferramenta de patch, essa edição não existe em mais nenhum lugar.

## Ele envia dados para algum lugar? {#does-it-phone-home}

**Ao iniciar, quando há conexão, a CLI consulta um registro público de versões por HTTPS.** Ela não envia resultados da verificação, caminhos de limpeza nem pacotes de falha. Sem conexão, a checagem é ignorada e a execução continua.

Confira você mesmo num clone:

```bash
grep -rE 'curl|wget|http://|https://' cleanup.sh lib/ modules/ bin/
```

A checagem de versões fica em `modules/update_check.sh`; confira esse arquivo também. Instalar ou aceitar uma atualização usa o npm ou o GitHub. O assistente de feedback abre um rascunho que você decide se envia.

## Por que não existe desfazer? {#why-is-there-no-undo}

Um log de desfazer multiplicaria a escrita no mesmo disco que você quer liberar — guardar 20 GB para recuperar 20 GB não resolve nada. Ele também daria uma falsa sensação de segurança, e seria parcial, na melhor das hipóteses.

O modelo de segurança aposta na prevenção: uma lista de caminhos permitidos, um limite de ociosidade e confirmação interativa. O raciocínio completo: [Apagar é permanente](./safety/irreversibility.md).

## Existe `--dry-run`? {#is-there-a---dry-run}

**Sim.** `--scan` só lê; `--dry-run` percorre a limpeza escolhida sem apagar arquivos nem mudar configurações. A simulação ainda guarda um log local e não grava relatório JSON da sessão. Veja [Visualizar antes de apagar](./safety/preview-first.md).

## Qual é o jeito mais seguro de experimentar? {#what-is-the-safest-way-to-try-it}

```bash
linux-cleanup --self-test      # confirma que as proteções disparam
linux-cleanup --scan           # somente leitura; mostra o que seria recuperado
linux-cleanup --list-targets   # todo caminho que ele pode tocar
linux-cleanup --all-safe --dry-run  # visualiza uma limpeza de cache
```

Depois disso você já viu o modelo de segurança funcionar sem perder um byte. Aí rode `linux-cleanup` e responda `n` a tudo o que te surpreender.

## Ele vai deixar meu computador mais rápido? {#will-it-speed-up-my-computer}

Um pouco, às vezes, e é bom ser honesto sobre o quão pouco:

- O VS Code abre um pouco mais rápido com uma dúzia de pastas de extensões em vez de cinquenta
- Um cache enxuto é um pouquinho mais rápido de percorrer que um inchado
- A abertura a frio do navegador não muda — caches são chave-valor, as buscas são O(1)
- Liberar o cache de páginas libera RAM, não disco, e o kernel o preenche de novo na hora

O benefício real é que "disco cheio" para de atrapalhar seu trabalho — não um número de benchmark.

## E se eu apertar `Ctrl-C` no meio da limpeza? {#what-if-i-press-ctrl-c-mid-cleanup}

A remoção em andamento termina — normalmente em bem menos de um segundo — e o script sai com o código `130`. O log guarda tudo até aquele ponto. A [armadilha de falhas ignora `130` de propósito](./reference/exit-codes.md), então nenhum pacote de falha é gravado.

## Posso rodar como root? {#can-i-run-it-as-root}

Pode, mas não deveria. Ele foi feito para rodar como usuário comum, e rodar como root só aumenta o estrago se algum bug passar pelas proteções. O [`--system`](./modes/system-cleanup.md) cuida internamente das necessidades legítimas de sudo, um comando revisado de cada vez.

## Funciona na minha distribuição? {#does-it-work-on-my-distro}

A limpeza de cache dentro do `$HOME` funciona em **todas** as distribuições Linux.

O [`--system`](./modes/system-cleanup.md) é **só para Debian e Ubuntu** — ele chama `apt` e `dpkg` sem detectar a distribuição. No Fedora, no Arch ou no openSUSE as etapas de pacotes falham, enquanto as de journal, `/tmp` e cache de páginas continuam funcionando. Veja [Distribuições suportadas](./distro-support.md).

## E o WSL? {#what-about-wsl}

A CLI roda do lado Linux. Confira antes da limpeza qualquer link simbólico da sua pasta pessoal do Linux para `/mnt/c/`. A lista de caminhos permitidos resolve links simbólicos, mas um caminho `Documents` do Windows não fica coberto automaticamente por uma regra da pasta pessoal do Linux.

## Por que bash e não Python, Go ou Rust? {#why-bash-rather-than-python-go-or-rust}

O Bash já está em todo sistema que a ferramenta atende. Um binário compilado significaria distribuir algo que os usuários não conseguem auditar com facilidade; uma versão em Python ou Node acrescentaria uma dependência de execução a uma ferramenta cujo único trabalho é tirar coisas do seu disco.

O script tem alguns milhares de linhas de bash comentado, que um engenheiro experiente lê numa tarde. Numa ferramenta que roda `rm -rf` com `sudo` disponível, poder auditar vale mais do que comodidade.

## Com que frequência devo rodar? {#how-often-should-i-run-it}

| Modo | Frequência |
|---|---|
| [`--scan`](./modes/scan.md) | Mensal, como referência |
| [`--all-safe -y`](./modes/all-safe.md) | Semanal — [automatize](./guides/alias-and-cron.md) |
| [`--system`](./modes/system-cleanup.md) | Trimestral, manualmente |
| [`--node-modules`](./modes/node-modules-finder.md) | Anual, quando os projetos paralelos se acumulam |
| [`--editor-ext`](./modes/editor-extensions.md) | Quando o editor estiver lento — também coberto pelo `--all-safe` |
| [`--stale`](./modes/personal-stale-files.md) | Trimestral, com atenção |
| [`--doctor`](./modes/doctor.md) | Quando aparecer `command not found` |
| [`--globals`](./modes/globals-audit.md) | Antes de reinstalar o Node ou trocar de máquina |

## Para que serve o `--purge-all`? {#what-is---purge-all-for}

Ele desliga o [limite de ociosidade](./safety/guards.md#guard-2--the-staleness-gate) e esvazia os caches por completo em vez de podar os arquivos ociosos. Isso inclui distribuições do wrapper do Gradle, navegadores do Playwright e binários do Cypress que você talvez ainda queira.

É a escolha certa antes de reinstalar uma máquina e um péssimo padrão fora disso. Nunca combine com uma tarefa do cron.

## Qual versão devo instalar? {#which-version-should-i-install}

Veja o [pacote no npm](https://www.npmjs.com/package/linux-cleanup) para a versão publicada atual e rode `linux-cleanup --version` para identificar a cópia instalada. Leia o [registro de mudanças](./changelog.md) antes de atualizar.

## Qual é a licença? {#what-licence-is-it-under}

**[MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)** desde a 1.4.0 — permissiva e aprovada pela OSI. Use de forma pessoal ou comercial, modifique, faça fork, incorpore, redistribua. A única condição é manter o aviso de copyright e de permissão.

Fornecido "AS IS" (no estado em que se encontra), sem garantia. Versões publicadas antes da 1.4.0 mantêm a licença com que foram lançadas.

## Como peço um recurso ou reporto um bug? {#how-do-i-request-a-feature-or-report-a-bug}

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

Depois abra uma [issue no GitHub](https://github.com/aoneahsan/linux-cleanup/issues) ou mande e-mail para [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com). Pull requests são bem-vindos sob MIT; pedidos de recurso só com descrição também. Veja [Enviar um relatório de bug](./guides/send-a-bug-report.md).

## O que ele nunca vai fazer? {#what-will-it-never-do}

- Apagar qualquer coisa da [lista de caminhos protegidos](./reference/protected-paths.md)
- Mexer em dados pessoais sem confirmação arquivo por arquivo
- Enviar automaticamente resultados da verificação, caminhos de limpeza ou pacotes de falha
- Instalar serviço, daemon ou agente em segundo plano
- Alterar ou remover uma linha existente da configuração do seu shell
- Recuperar qualquer coisa que tenha apagado
