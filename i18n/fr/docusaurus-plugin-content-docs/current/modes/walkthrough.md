---
title: Parcours guidé (par défaut)
description: "Le mode par défaut de linux-cleanup : dix étapes guidées à travers toutes les catégories de nettoyage, avec une question avant chacune, un total cumulé et un rapport de session JSON."
tags: [walkthrough, default, interactive, guided, modes]
sidebar_position: 2
---

# Parcours guidé (par défaut)

**Lancer `linux-cleanup` sans option démarre le parcours guidé : dix étapes à travers toutes les catégories de nettoyage, chacune demandant avant d’agir.** C’est la façon recommandée d’utiliser l’outil en interactif.

```bash
linux-cleanup          # ou : linux-cleanup -w / --walkthrough
```

## Les dix étapes {#the-ten-steps}

| # | Étape | Supprime | Remarques |
|---|---|---|---|
| 1 | Caches des gestionnaires de paquets | Régénérable | yarn, npm, npx, pnpm, pip, composer, bun, deno |
| 2 | Caches des applications | Régénérable | Navigateurs, Gradle, Cypress, Playwright, Zoom, VSIX d’éditeurs |
| 3 | Données des outils de développement | Seulement l’inutilisé | AVD Android, pub-cache, analyse Dart, flatpak |
| 4 | Anciennes extensions d’éditeurs | Inutilisé + remplacé | VS Code / Cursor |
| 5 | `node_modules` délaissés | **Interactif** | Projets inutilisés au-delà du seuil |
| 6 | Téléchargements partiels ou orphelins | **Interactif** | `.crdownload`, `.part`, `.fdmdownload` |
| 7 | Fichiers personnels inutilisés | **Interactif** | Gros fichiers inutilisés dans `~/Downloads`, `~/Desktop` |
| 8 | Nettoyage du système (sudo) | Système | apt, journal, snap, `/tmp`, cache de pages |
| 9 | Bilan final des tailles | Rien | Résumé en lecture seule |
| 10 | Génération d’un rapport lisible | Rien | Export Markdown / HTML — nécessite `jq` |

Les étapes 5, 6 et 7 sont les étapes [uniquement interactives](../safety/guards.md#guard-3--personal-data-is-interactive-only). Elles ne peuvent pas être confirmées automatiquement, et l’étape 7 est la seule de tout l’outil qui puisse supprimer quelque chose de vraiment irremplaçable.

## Comment fonctionnent les questions {#how-the-prompts-work}

Deux niveaux de confirmation.

**Par étape**, vous choisissez quoi faire de toute la catégorie :

| Touche | Effet |
|---|---|
| `a` | Exécuter cette étape. C’est le choix par défaut : Entrée la sélectionne |
| `s` | Passer entièrement cette étape |
| `q` | Quitter le parcours maintenant, en gardant la progression |

**Par cible**, dans une étape que vous avez choisi d’exécuter, chaque élément a sa propre confirmation `[Y/n]` ou `[y/N]`. La lettre majuscule est la réponse par défaut.

Répondre `a` au niveau de l’étape ne vous engage donc pas à tout supprimer : vous voyez toujours chaque cible et y répondez.

## Totaux cumulés {#running-totals}

Après chaque étape exécutée, l’outil affiche la variation mesurée et le total de la session jusque-là.

Le résumé final indique l’espace disque libre avant et après. Ce chiffre est mesuré avec `df`, il reflète donc tout ce qui se passe sur la machine : si une compilation a tourné pendant votre session, l’espace libéré indiqué peut être inférieur à la somme des étapes, voire négatif. Ce n’est pas un bogue ; voir [Dépannage](../troubleshooting.md#disk-usage-grew-during-the-session).

## Quitter en cours de route {#quitting-early}

`q` à n’importe quelle question d’étape, ou `Ctrl-C` à tout moment, termine proprement la session :

- Les suppressions déjà faites restent définitives ; consultez le journal pour voir les étapes tentées avant l’interruption
- `Ctrl-C` quitte avec le code `130`, que le [piège de plantage ignore volontairement](../reference/exit-codes.md#how-the-crash-trap-decides) : aucun paquet de plantage n’est écrit
- Les étapes non atteintes sont notées comme passées dans le rapport

## Le rapport de session {#the-session-report}

Le parcours écrit un rapport JSON dans `~/.linux-cleanup/reports/report-<timestamp>.json`, sauf si `--no-report` ou `--dry-run` est indiqué. Il contient l’état et les octets libérés de chaque étape, le disque et la mémoire avant et après, et les totaux de la session. Liste complète des champs : [Schéma du rapport](../reference/report-schema.md).

L’étape 10 le convertit au besoin en Markdown et en HTML. Cette étape nécessite `jq` ; sans lui, elle est notée `skipped (jq missing)` et le JSON est tout de même écrit.

```bash
linux-cleanup --no-report    # ne génère pas le JSON ; les journaux sont quand même écrits
```

## Options utiles à combiner {#options-worth-combining}

```bash
linux-cleanup -d 30          # seuil d’inactivité de 30 jours au lieu de 100
linux-cleanup --purge-all    # désactive entièrement le seuil d’inactivité
linux-cleanup --no-color     # sortie sans couleur
linux-cleanup --cleanup-logs # supprime le journal de cette exécution à la fin
```

:::danger `--purge-all` change ce que suppriment les étapes 1 à 4
Avec le [seuil d’inactivité](../safety/guards.md#guard-2--the-staleness-gate) désactivé, les étapes de cache vident entièrement leurs cibles au lieu d’élaguer les fichiers inutilisés. Cela inclut les distributions du wrapper Gradle, les navigateurs Playwright et les binaires Cypress dont vous pourriez encore avoir besoin. La bannière d’avant exécution indique la stratégie active.
:::

## Quand utiliser autre chose {#when-to-use-something-else}

| Situation | Mode plus adapté |
|---|---|
| Vous ne voulez qu’une catégorie | [Menu](./menu.md) ou [TUI](./tui.md) |
| Sans surveillance ou via cron | [Entièrement sûr](./all-safe.md) avec `-y` |
| Vous voulez regarder, pas supprimer | [Analyse](./scan.md) |
| Vous voulez la version visuelle de ceci | [TUI](./tui.md) |

## Ensuite {#next}

- [Analyse](./scan.md) — à lancer en premier
- [Entièrement sûr](./all-safe.md) — l’équivalent sans surveillance
- [Rapports](./reports.md) — lire la sortie
