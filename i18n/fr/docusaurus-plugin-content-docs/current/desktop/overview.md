---
sidebar_position: 1
title: L’application de bureau
description: Ce qu’est l’application de bureau linux-cleanup, comment elle exécute la CLI et ce qu’elle envoie hors de votre ordinateur.
---

# L’application de bureau

L’application de bureau, c’est linux-cleanup dans une fenêtre. Elle embarque la même CLI que celle documentée sur ce site et exécute un seul mode à travers elle : le [nettoyage entièrement sûr](../modes/all-safe.md), d’abord en simulation, puis en exécution réelle quand vous confirmez. Chaque règle sur ce qui est supprimé et ce qui est refusé appartient à la CLI ; l’application affiche ces décisions et ne les modifie jamais.

## Comment elle exécute la CLI {#how-it-runs-the-cli}

L’application lance le `cleanup.sh` embarqué avec l’une de deux listes d’arguments exactement, et lit son flux [`--json-events`](../reference/json-events.md) :

| Vous appuyez sur | L’application exécute |
|---|---|
| **Lancer une simulation** | `--all-safe --yes --dry-run --json-events` |
| **Lancer le nettoyage maintenant** | `--all-safe --yes --json-events` |

Les rapports et journaux vont dans `~/.linux-cleanup/reports/` et `~/.linux-cleanup/logs/`, les mêmes dossiers qu’une exécution de `npx linux-cleanup` : l’application et le terminal partagent un seul historique.

La copie embarquée saute la vérification de mise à jour propre à la CLI (`LINUX_CLEANUP_LAUNCHER=desktop`). L’application vérifie ses propres mises à jour à la place ; voir [Installer et mettre à jour](./install.md).

## Ce qui quitte votre ordinateur {#what-leaves-your-computer}

| Données | Quittent l’ordinateur ? |
|---|---|
| Chemins de fichiers et de dossiers, noms de fichiers | Jamais |
| Résultats des étapes, tailles, espace libre avant et après, nom de la distribution | Seulement si vous êtes connecté, sous forme de nombres |
| Quels écrans s’ouvrent et quelles actions s’exécutent | Comptés avec Amplitude, sans chemins, noms ni adresse e-mail |

La connexion est facultative. Sans connexion, les simulations, exécutions réelles, reçus et planifications fonctionnent sur cet ordinateur ; le quota mensuel d’exécutions réelles est compté par ordinateur.

## La suppression est définitive {#removal-is-permanent}

Une exécution réelle supprime les fichiers comme la CLI : définitivement, sans en garder de copie. L’application exige une simulation récente avant une exécution réelle, et l’écran de confirmation le dit en termes clairs avant que quoi que ce soit ne s’exécute.
