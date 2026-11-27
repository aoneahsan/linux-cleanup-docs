---
title: Recuperação
description: O que fazer depois de uma exclusão indesejada do linux-cleanup — conferir os logs disponíveis, restaurar de um backup ou da origem e evitar gravar no disco quando a recuperação importa.
sidebar_position: 91
---

# Recuperação

**O linux-cleanup não tem desfazer.** Esta página ajuda a descobrir o que foi removido e quais são suas opções de verdade.

:::danger Antes de tudo, pare de gravar no disco
Se algo insubstituível foi apagado e você pretende tentar recuperar com ferramentas de file carving, **pare de usar o sistema de arquivos agora**. Cada gravação reduz a chance de recuperar dados desvinculados.

Isso vale só para as [categorias realmente insubstituíveis](#3-decide-what-is-actually-recoverable). Se for cache, pule esta parte — deixe a ferramenta baixar de novo.
:::

## 1. Confira o registro disponível {#1-inspect-the-available-record}

Uma execução pode deixar um log local. Um passeio guiado também pode deixar um registro JSON da sessão, a menos que os relatórios tenham sido desativados. Nenhum dos dois é um registro completo, arquivo por arquivo, nem um backup.

```bash
# O log de sessão mais recente
less "$(ls -t ~/.linux-cleanup/logs/cleanup-*.log | head -1)"

# O registro mais recente do passeio guiado, se existir
jq '.' "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

Para procurar um caminho específico nos logs guardados:

```bash
grep -rn 'the-filename-you-are-missing' ~/.linux-cleanup/logs/
```

Não encontrar nada não prova que a ferramenta deixou o arquivo em paz. Um auxiliar pode registrar uma pasta de cache inteira ou um comando em vez de cada arquivo, e `--cleanup-logs` pode apagar o log de uma execução. Confira também o modo escolhido e as raízes de destino.

Para ficar só nas etapas de uma sessão:

```bash
jq '.steps[] | select(.status == "ran")' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

## 2. Confirme que não foi só uma recusa {#2-confirm-it-was-not-simply-refused}

Recusas também vão para o log. Se você encontrar uma linha assim, nada foi apagado:

```text
✗ REFUSE: protected path: /home/you/Documents/notes
```

Veja [Caminhos protegidos](./reference/protected-paths.md).

## 3. Descubra o que dá para recuperar de verdade {#3-decide-what-is-actually-recoverable}

| O que foi apagado | Recuperação |
|---|---|
| Cache de gerenciador de pacotes | **Automática.** A próxima instalação baixa de novo |
| Cache do navegador | **Automática.** Ele se reconstrói enquanto você navega |
| Cache do Gradle ou distribuição do wrapper | **Automática.** O próximo build busca de novo — conte com um primeiro build lento |
| Binários do Cypress / Playwright | Rode de novo a etapa de instalação da ferramenta |
| `node_modules` | `yarn install` ou `npm install` no projeto |
| AVD do Android | Recrie no Android Studio. **A configuração do perfil se perdeu**; a imagem do sistema é baixada de novo |
| Versão de extensão de editor | Recarregue a janela do editor; reinstale se ela realmente sumiu |
| Cache do apt, journal, revisões de snap | Se regeneram sozinhos. Nada a fazer |
| **Arquivo pessoal de `~/Downloads`** | **Só do seu próprio backup**, ou baixando de novo da origem |
| **Download incompleto** | Não tem recuperação. Comece o download de novo |

### Regenerando os mais comuns {#regenerating-the-common-ones}

```bash
# No projeto afetado
yarn install            # ou: npm install / pnpm install

# Binários dos executores de testes
npx cypress install
npx playwright install

# Flutter
flutter pub get
```

Nada disso precisa do linux-cleanup — você só está deixando cada ferramenta fazer o que faz com o cache vazio.

## 4. Se era mesmo insubstituível {#4-if-it-was-genuinely-irreplaceable}

Sendo realista, nesta ordem:

1. **Seu próprio backup.** Timeshift, Borg, restic, snapshot do rsync, sincronização na nuvem — o que você usar. É a única resposta confiável.
2. **A origem.** Um arquivo baixado pode ser baixado de novo. Procure a URL no histórico do navegador.
3. **A lixeira de um serviço de sincronização.** Dropbox, Nextcloud, Google Drive e parecidos guardam os arquivos apagados no servidor por um tempo. Se a pasta estava sincronizada, procure lá.
4. **Ferramentas de file carving** — `extundelete`, `testdisk`, `photorec`. Elas trabalham com inodes desvinculados e têm pouca chance num sistema de arquivos movimentado, principalmente em SSD com TRIM ativado. Desmonte o sistema de arquivos antes ou trabalhe a partir de um pendrive live, e nunca grave os dados recuperados no mesmo dispositivo.

:::caution Seja sincero consigo mesmo sobre o passo 4
Num SSD montado, em uso e com TRIM, o carving normalmente não recupera nada. Só vale tentar para algo realmente importante, e só depois de parar de gravar no disco.
:::

## 5. Evite que aconteça de novo {#5-stop-it-happening-again}

| Mudança | Efeito |
|---|---|
| Rode [`--scan`](./modes/scan.md) antes de cada limpeza | Você vê o resultado enquanto ele ainda é hipotético |
| Tire o que é valioso de `~/Downloads` | `~/Documents` e `~/Desktop` são [protegidos](./reference/protected-paths.md) |
| Pule a etapa 7 no passeio guiado | Arquivos pessoais passam a exigir uma execução separada e consciente |
| Aumente o limite: `-d 365` | Só arquivos realmente antigos viram candidatos |
| Nunca use `-y` fora de `--all-safe` numa máquina confiável | `-y` não mexe em dados pessoais, mas você só vê as decisões depois |
| Configure um backup de verdade | É a única coisa que torna qualquer exclusão recuperável |

## 6. Se a ferramenta fez o que não devia {#6-if-the-tool-did-something-it-should-not-have}

Se uma exclusão aconteceu dentro de um [caminho protegido](./reference/protected-paths.md), se a versão *atual* de uma extensão de editor foi removida ou se qualquer outra coisa contradiz as proteções documentadas, é um bug que vale reportar.

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

Inclua o log e, se existir, o registro do passeio guiado. Veja [Enviar um relatório de bug](./guides/send-a-bug-report.md).

## Próximos passos {#next}

- [Apagar é permanente](./safety/irreversibility.md) — o projeto por trás do "sem desfazer"
- [Visualizar antes de apagar](./safety/preview-first.md) — como evitar essa situação
- [Solução de problemas](./troubleshooting.md) — para problemas que não são perda de dados
