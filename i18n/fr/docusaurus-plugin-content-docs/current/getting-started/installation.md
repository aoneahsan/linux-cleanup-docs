---
title: Installation
description: Installer linux-cleanup de trois façons (sans installation avec npx, globalement avec npm ou en clonant le dépôt) et vérifier l’installation avant tout nettoyage réel.
sidebar_position: 2
---

# Installation

**linux-cleanup se propose de trois façons : `npx` sans installation, une installation `npm` globale ou un `git clone`.** Les trois exécutent le même script Bash : le paquet npm n’est qu’un lanceur Node très léger qui trouve `cleanup.sh` et dirige les journaux et rapports vers un dossier persistant.

:::info Vérifier la version installée
Lancez `linux-cleanup --version` après une installation ou une mise à jour. Le [journal des modifications](../changelog.md) consigne les changements apportés à la simulation et aux avis de version.
:::

## Option 1 — `npx`, sans installation {#option-1--npx-no-install}

La façon la plus rapide de l’essayer. Rien n’arrive dans votre `PATH` et rien ne reste si vous y renoncez.

```bash
npx linux-cleanup --version
npx linux-cleanup --scan      # analyse en lecture seule
npx linux-cleanup             # parcours guidé
```

`npx` télécharge le paquet dans un dossier temporaire du cache npm. Vos journaux et rapports sont écrits dans `~/.linux-cleanup/`, **pas** dans le dossier temporaire : ils survivent au nettoyage du cache npm et sont toujours là la fois suivante.

## Option 2 — installation `npm` globale {#option-2--global-npm-install}

```bash
npm install -g linux-cleanup
linux-cleanup --version
```

`linux-cleanup` est alors dans votre `PATH` partout. Les journaux et rapports vont toujours dans `~/.linux-cleanup/`.

```bash
npm install -g linux-cleanup@latest   # mettre à jour
npm uninstall -g linux-cleanup        # désinstaller
```

Désinstaller le paquet ne retire pas un alias shell ou une entrée cron que vous avez installés ; voir [Désinstaller](../guides/uninstall.md) pour une suppression complète.

## Option 3 — `git clone` {#option-3--git-clone}

Pour lire le code source, l’auditer ou le modifier. Le contenu du dépôt est ce que npm publie.

```bash
git clone https://github.com/aoneahsan/linux-cleanup ~/linux-cleanup
cd ~/linux-cleanup
chmod +x cleanup.sh
./cleanup.sh --self-test
./cleanup.sh
```

La seule différence de comportement : **un clone garde sa sortie à côté du code source**, dans `<clone>/logs/`, `<clone>/reports/` et `<clone>/feedback/`, plutôt que dans `~/.linux-cleanup/`. Les deux se modifient avec `LINUX_CLEANUP_DATA_HOME`. Voir [Chemins de sortie](../reference/output-paths.md).

Le projet est sous licence MIT : forks et modifications sont permis.

## Vérifier avant tout nettoyage réel {#verify-before-you-run-anything-destructive}

```bash
linux-cleanup --version      # confirme la version que vous avez réellement
linux-cleanup --self-test    # vérifie dépendances, syntaxe et garde-fous
```

Un autotest réussi se termine par un message de succès. Il vérifie que la [protection des chemins](../safety/guards.md#guard-1--the-path-allowlist) refuse bien `/`, `$HOME`, `~/Documents`, `~/.ssh` et `/etc`, et qu’elle ne refuse pas `~/.cache/yarn`. Toute vérification en échec quitte avec un code non nul.

:::tip Lancez `--self-test` après chaque mise à jour
C’est la seule vérification qui porte sur le code que vous avez réellement, et non sur la documentation. Elle prend une seconde.
:::

## Quelle installation choisir {#which-install-path-to-choose}

| Si vous… | Utilisez |
|---|---|
| Voulez l’essayer une fois | `npx` |
| Le lancerez régulièrement, ou depuis cron | Installation `npm` globale |
| Voulez lire ou modifier le code | `git clone` |
| Êtes sur une machine sans Node.js | `git clone` |
| Voulez la sortie à côté du code | `git clone` |

Pour cron en particulier, préférez une installation globale et un **chemin absolu** dans la crontab : cron s’exécute avec un `PATH` minimal et ne trouvera pas une installation dans `~/.local/bin`. C’est le problème cron le plus fréquent ; voir [Alias et cron](../guides/alias-and-cron.md).

## Ce que l’installation ne fait pas {#what-installing-does-not-do}

- Aucun service système, aucun démon en arrière-plan, aucune tâche planifiée (sauf si vous en demandez une)
- Aucun agent de télémétrie. Au démarrage, la CLI récupère un registre public des versions si elle est en ligne ; hors ligne, elle continue
- Aucune modification de la configuration du shell, sauf si vous lancez `--install-alias` ou `--doctor`
- Aucun fichier en dehors du paquet et de `~/.linux-cleanup/`, et ce dernier seulement quand vous le lancez vraiment

## Ensuite {#next}

- [Démarrage rapide](./quick-start.md) — votre premier nettoyage
- [Ce qu’il supprime](../safety/what-it-deletes.md) — à lire avant le premier nettoyage réel
- [Désinstaller](../guides/uninstall.md) — suppression complète, alias et cron compris
