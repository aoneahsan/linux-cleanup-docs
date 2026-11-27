---
title: Histórico de mudanças
description: Histórico de versões do linux-cleanup, com simulações, avisos de versão e eventos JSON locais.
sidebar_position: 94
---

# Histórico de mudanças

Histórico de versões do `linux-cleanup`. O formato segue o [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), e o projeto usa [versionamento semântico](https://semver.org/spec/v2.0.0.html).

Veja o [pacote no npm](https://www.npmjs.com/package/linux-cleanup) para a versão publicada atual. O [histórico de mudanças do código](https://github.com/aoneahsan/linux-cleanup/blob/main/CHANGELOG.md) traz o registro completo. As entradas abaixo explicam as mudanças que afetam a decisão de limpeza.

## 2.1.1 — 2026-11-22 {#211--2026-11-22}

`--help`, `--version`, a caixa “Sobre” do menu e a tela de feedback mostram o site, este manual e a página de download do aplicativo para desktop. O `credits.tool_homepage` do relatório de execução agora é o site do produto. A caixa “Sobre” não diz mais que o script não faz chamadas de rede: ele lê o registro público de versões uma vez ao iniciar. Nada muda no que cada modo remove.

## 2.1.0 — 2026-11-21 {#210--2026-11-21}

O `--json-events` transmite eventos JSON locais e com versão para o `--scan` e para o `--all-safe --yes` não interativo. Acrescentar `--dry-run` ao modo totalmente seguro informa os caminhos propostos sem apagá-los. O fluxo pode conter caminhos locais completos, então mantenha-o na máquina.

## 2.0.1 — 2026-11-21 {#201--2026-11-21}

O README lista todos os lugares onde o linux-cleanup é publicado. Nada muda no que o script faz.

## 2.0.0 — 2026-11-10 {#200--2026-11-10}

Foram adicionados o `--dry-run`, uma checagem do registro público de versões ao iniciar e o `--refresh-app` para a cópia persistente da CLI. Avisos de versão normais liberam a primeira execução e bloqueiam a partir da próxima inicialização; avisos urgentes bloqueiam uma cópia antiga na hora. Offline, a execução continua. Uma simulação não remove alvos de limpeza nem muda configurações, embora possa gravar um log local e o estado da checagem de atualizações.

## 1.6.0 — 2026-09-18 {#160--2026-09-18}

Foram adicionados o diagnóstico somente leitura `--speed` e raízes de busca configuráveis para projetos e arquivos pessoais. A detecção de inatividade em sistemas de arquivos `noatime` foi corrigida: versões antigas podiam apagar um cache ainda em uso porque os horários de acesso não eram registrados. As instalações de alias e cron agora apontam para uma cópia persistente, e a limpeza de logs só remove o log da execução atual.

## 1.5.2 — 2026-09-18 {#152--2026-09-18}

As revisões desativadas recentes do Snap passaram a ser preservadas como cópias de reversão, e o `--node-modules` parou de listar os itens internos do Yarn PnP.

## 1.5.1 — 2026-09-18 {#151--2026-09-18}

A limpeza de caches de pacotes extraídos e de navegadores passou a ser feita por entrada inteira, para que um arquivo pouco usado não seja removido de uma instalação que continua ativa.

## 1.5.0 — 2026-09-18 {#150--2026-09-18}

A limpeza dos caches do Gradle e do Android Studio passou a operar em unidades de versão completas, e a detecção de `node_modules` sem uso e a barreira de remoção própria dela foram consertadas. Limpezas anteriores na 1.4.0/1.5.0 podem ter deixado um cache extraído incompleto; veja os passos de recuperação no histórico do código.

## 1.4.0 — 2026-07-11 {#140--2026-07-11}

### Mudou {#changed}

- **Licença trocada para a [Licença MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE).** Antes era distribuído sob uma licença própria “Source-Available · No-Derivatives · Non-Commercial v1.0”. Agora é código aberto permissivo e aprovado pela OSI: livre para usar, modificar, fazer fork, redistribuir e usar comercialmente, com atribuição.

  O aviso “AS IS / sem responsabilidade” da MIT substitui os termos anteriores de garantia, responsabilidade e indenização. O `package.json` agora declara `"license": "MIT"`.

  Vale daqui para a frente — **as versões publicadas antes mantêm a licença com que saíram.**

Sem mudanças no código, nas barreiras de segurança ou na CLI.

## 1.3.1 — 2026-05-10 {#131--2026-05-10}

Versão só de documentação. Nenhuma mudança de comportamento.

### Novo {#added}

- Uma árvore `docs/` completa organizada pelo [modelo Diátaxis](https://diataxis.fr/) — tutoriais, guias práticos, referência e explicação. Todo modo, opção, caminho de saída e código de saída documentado.
- Páginas próprias para os dezesseis modos, páginas de referência para opções, modos, variáveis de ambiente, caminhos de saída, códigos de saída e o esquema JSON, além de receitas práticas e perguntas frequentes.
- Uma seção “Documentação completa” no README com links para as páginas mais usadas.

O código, as barreiras de segurança e a interface da CLI não mudaram em relação à 1.3.0.

## 1.3.0 — 2026-05-10 {#130--2026-05-10}

Versão de acabamento final: um menu visual e a captura automática de falhas. Sem nova lógica de limpeza; as barreiras de segurança e de inatividade existentes não mudaram.

### Novo {#added-1}

- **[Modo TUI](./modes/tui.md)** (`-t` / `--tui` / `-g` / `--gui`) — um menu com whiptail ou dialog. Cada escolha volta para a saída normal da CLI durante a execução e depois retorna ao menu. Se nenhuma das duas ferramentas estiver instalada, volta sem problemas para o menu da CLI com uma dica de instalação para a distribuição.
- **Captura automática do pacote de falha** — uma armadilha EXIT que, numa saída inesperada diferente de zero, grava em `~/.linux-cleanup/feedback/` um `crash-<stamp>.tar.gz` independente com o log da sessão, o registro mais recente e um manifesto do sistema, e depois mostra uma linha que você pode mandar por e-mail.

  Não é gerado em saída limpa, `Ctrl-C` (130), `SIGTERM` (143) nem em saídas por erro de argumentos (2). **Nenhuma chamada de rede** — o pacote fica na sua máquina até você decidir compartilhar.
- Uma caixa **Sobre** na TUI com versão, contatos, licença e o compromisso de privacidade.

### Mudou {#changed-1}

- A supressão do aviso inicial e do resumo da sessão agora inclui o modo `tui`, para que a caixa de diálogo não brigue com a saída do log.

## 1.2.2 — 2026-05-10 {#122--2026-05-10}

### Corrigido {#fixed}

- Pequenas correções de bugs e melhorias internas de estabilidade.

## 1.2.1 — 2026-05-10 {#121--2026-05-10}

Estende a barreira de inatividade da 1.2.0 a tudo o que é *ferramenta*, e não cache que se regenera. Apagar algo assim agora exige **as duas coisas**: que nenhum software ativo dependa dele **e** que você não tenha mexido nele em `--days` dias.

### Mudou {#changed-2}

- **AVDs do Android** — antes `~/.android/avd` era apagado inteiro ao confirmar. Agora cada pasta `*.avd` é examinada como uma unidade, junto com o `*.ini` vizinho, e só é limpa quando todos os arquivos do perfil passam do limite de inatividade. Perfis de emulador usados recentemente ficam intactos.
- **[Extensões substituídas do VS Code / Cursor](./modes/editor-extensions.md)** — a checagem “existe uma versão mais nova” cobria a primeira condição; agora a pasta substituída *também* precisa passar do limite de inatividade. Versões antigas carregadas recentemente são listadas, mas mantidas, com os dias de inatividade de cada uma.
- **Dados de usuário do Flatpak** — `~/.local/share/flatpak` guarda aplicativos instalados no nível do usuário, não só caches. O módulo agora se recusa a mexer na árvore se houver qualquer aplicativo de usuário instalado, e ainda exige que a árvore passe do limite de inatividade. Indica `flatpak uninstall --user --unused` como caminho mais seguro.

### Novo {#added-2}

- `newest_access_age_days <path>` — retorna os dias desde o `atime`/`mtime` mais recente em qualquer ponto sob um caminho.
- `prune_stale_units <root> <days> [glob]` — trata cada item de primeiro nível como indivisível, para que uma limpeza parcial não corrompa o estado.

### Por quê {#why}

Um usuário apontou que a 1.2.0 ainda apagava os AVDs do Android por inteiro, e que o mesmo raciocínio devia valer para tudo o que é ferramenta, não cache: não remover software do qual outra ferramenta depende, nem software que o próprio usuário usou recentemente.

## 1.2.0 — 2026-05-10 {#120--2026-05-10}

**A estratégia padrão de remoção passou a ser só o que está parado.** Nada dentro de um cache-alvo é removido a menos que os arquivos estejam sem ser tocados — `atime` e `mtime` — há `--days` dias, 100 por padrão.

### Mudou {#changed-3}

- **O `clean_target`, o limpador comum a todos os módulos de cache, agora limpa por partes em vez de apagar tudo.** Remove só os arquivos que passaram do limite e depois varre as pastas vazias. Arquivos usados recentemente ficam, e a estrutura da pasta também, para que as ferramentas continuem encontrando o próprio layout.
- **O [`--all-safe`](./modes/all-safe.md) limpa cada alvo** do mesmo jeito, e o resumo informa os bytes liberados **e** os mantidos por alvo.
- **A limpeza do cache do npm respeita a barreira de inatividade** em vez de rodar sempre `npm cache clean --force`, que ignorava a idade por completo.
- O aviso antes da execução informa a estratégia ativa — “prune ≥Nd” ou “FULL PURGE”.

### Novo {#added-3}

- **`--purge-all`** restaura o comportamento de antes da 1.2.0, de apagar tudo, documentado com as vantagens e desvantagens.
- **`prune_stale <root> <days>`** — uma função auxiliar pública para os módulos, que recusa caminhos protegidos, só apaga onde os dois horários passam do limite, varre pastas vazias e informa os bytes liberados.

### Por quê {#why-1}

O padrão da 1.1.0 apagava árvores de cache inteiras ao confirmar. Isso estava certo para `~/.cache/yarn`, que se regenera rápido, e errado para `~/.gradle/wrapper/dists/` — um download de 230 MB de que você pode realmente precisar no mês que vem.

Um limite de 100 dias separa bem “mexi nisso há pouco e sentiria falta” de “não abro isso há três meses”. Quem quiser ainda pode forçar o comportamento antigo ou apertar a barreira com `-d 30`.

## 1.1.0 — 2026-05-10 {#110--2026-05-10}

Versão de reforço de segurança. Fecha a porta para que pacotes instalados globalmente e arquivos de inicialização do shell sejam tocados.

### Corrigido {#fixed-1}

- **Os pacotes globais do pnpm estavam sendo apagados.** A limpeza do armazenamento de conteúdo do pnpm mirava `~/.local/share/pnpm` (`PNPM_HOME`) — que guarda os pacotes instalados globalmente, os atalhos de bin e o próprio binário `pnpm` do `pnpm setup`. Agora mira só `~/.local/share/pnpm/store`, o cache endereçado por conteúdo que se regenera.

  Afetava o `--all-safe`, a opção 3 do menu, a verificação, o passeio guiado e o `--list-targets`.

### Novo — barreiras de segurança {#added--safety-guards}

- **[`PROTECTED_EXACT`](./reference/protected-paths.md#exact-match-protected-paths)** — um bloqueio por correspondência exata das pastas de instalação de gerenciadores de pacotes e das pastas dos runtimes: pnpm, npm, yarn, bun, deno, volta, nvm, fnm, cargo, rustup e Go.
- **[`PROTECTED_BASENAMES`](./reference/protected-paths.md#protected-basenames)** — recusa qualquer caminho cujo nome seja de um arquivo de inicialização ou de histórico do shell, esteja onde estiver.
- **Uma verificação ao iniciar o `--all-safe`** que para com uma mensagem `BUG:` se alguma pasta de runtime protegida vazar para a lista de alvos, evitando uma regressão silenciosa.

### Novo — suporte a bun e deno {#added--bun-and-deno-coverage}

- bun: limpeza de cache em `~/.bun/install/cache`; `~/.bun/install/global` protegido.
- deno: limpeza de cache em `~/.cache/deno`; `~/.deno/bin` protegido.
- Os dois ligados ao `--all-safe`, ao `--scan` e à nova auditoria de pacotes globais.

### Novo — modos {#added--modes}

- **[`--globals`](./modes/globals-audit.md)** — uma auditoria somente leitura que lista os pacotes globais instalados diretamente pelo npm, pnpm, yarn, bun e deno, marca cada um como `recently used`, `needed by: <pkg>` ou `STALE — safe to uninstall` e mostra comandos de desinstalação prontos para copiar. **Nunca apaga nada.** Funciona mesmo quando a CLI do gerenciador de pacotes não está no `PATH`.
- **[`--doctor`](./modes/doctor.md)** — detecta um runtime presente no disco mas não ligado à inicialização do shell (nvm, pnpm, bun, deno, cargo) e oferece acrescentar o bloco padrão. **Só acrescenta, com confirmação. Nunca remove nem altera linhas existentes.**

### Mudou {#changed-4}

- O `--all-safe` mostra avisos explícitos de “globals are PRESERVED” e “shell-init files are NEVER touched”.

## 1.0.0 — 2026-05-09 {#100--2026-05-09}

Primeira versão pública.

### Distribuição {#distribution}

- Publicado no npm — roda com `npx linux-cleanup` ou `npm install -g linux-cleanup`. O pacote traz um inicializador Node enxuto que encontra o ponto de entrada em bash e manda logs e registros para `~/.linux-cleanup/`, para que sobrevivam à limpeza da pasta temporária do npx.
- O `git clone` direto também funciona, com a saída dentro do clone.

### Recursos {#features}

- **Passeio guiado de dez etapas** como modo padrão, com cabeçalhos de progresso, perguntas `a` / `s` / `q`, bytes liberados por etapa e um total acumulado.
- **Segurança baseada numa lista de permitidos** — recusa qualquer caminho dentro de uma lista protegida escolhida a dedo, além de `$HOME` e `/` puros.
- **Dados pessoais só no modo interativo** — nunca em lote, nunca com `--yes`.
- **Categorias de limpeza** — caches de gerenciadores de pacotes (yarn, npm, pnpm, pip, composer); caches de aplicativos (Chrome, Firefox, Brave, Chromium, Edge, Vivaldi, Gradle, Cypress, Playwright, TypeScript, Zoom); ferramentas de desenvolvimento (AVDs do Android, pub-cache, Dart, flatpak); extensões de editores; `node_modules` sem uso; downloads incompletos e arquivos pessoais sem uso; limpeza do sistema com sudo.
- **Registros de sessão** — JSON padrão gravado a cada execução, com exportação para Markdown e HTML sob demanda. O HTML usa CSS embutido que respeita o modo escuro.
- **[Gerenciador de relatórios](./modes/reports.md)** (`--reports`) e `--export FMT ID` não interativo.
- **Autoteste** (`--self-test`) que confere dependências, a sintaxe de cada arquivo shell e a saúde das barreiras de segurança — garantindo que a proteção retorna true para `/`, `$HOME`, `~/Documents` e `/etc`.
- **`--feedback`** e **`--debug-bundle`** para relatórios de bug estruturados.
- **Privacidade** — nenhuma chamada de rede. Sem telemetria, analytics ou relatório de falhas. Os únicos dados que saem da sua máquina são os que você escolhe mandar por e-mail.
- **Créditos em cada arquivo gerado** — os logs começam com um cabeçalho que diz de onde vieram, os registros têm um bloco `credits` no nível superior e a saída HTML traz créditos no rodapé.
- **Ajudas de configuração** — `--install-alias`, `--install-cron` e os equivalentes de desinstalação.
- Suporte a `NO_COLOR` e `--no-color`.

### Segurança e reforço {#security-and-safety-hardening}

- A saída HTML escapa todos os valores vindos do JSON pelo filtro `@html` do `jq`, evitando injeção a partir de um registro malformado.
- Checagens `command -v` em toda dependência opcional (`snap`, `crontab`, `xdg-open`, `jq`).
- O `realpath -m` resolve links simbólicos antes de qualquer checagem de caminho protegido, então um link simbólico não consegue escapar da lista de permitidos.

## Origem {#upstream}

O histórico de mudanças oficial está no [repositório do código](https://github.com/aoneahsan/linux-cleanup/blob/main/CHANGELOG.md).
