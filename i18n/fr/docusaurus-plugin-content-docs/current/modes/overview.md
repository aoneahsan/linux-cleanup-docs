---
title: Aperçu des modes
description: "Tous les modes de linux-cleanup regroupés selon ce qu’ils font : inspection en lecture seule, nettoyage guidé et par lot, modes interactifs pour les données personnelles, et outils de sortie et de réparation."
tags: [modes, overview, cli, reference]
sidebar_position: 1
---

# Aperçu des modes

**linux-cleanup a un seul point d’entrée et choisit son mode d’après une seule option.** Le lancer sans option ouvre le [parcours guidé](./walkthrough.md).

Les modes s’excluent mutuellement : n’en passez qu’un. Des options comme `--days` et `--yes` se combinent avec eux.

## Lecture seule — ne supprime jamais rien {#read-only--never-deletes-anything}

Ces modes ne suppriment aucune cible de nettoyage. Ils peuvent tout de même écrire un journal local, et la vérification des versions peut lire un registre public si la machine est en ligne.

| Mode | Option | Affiche |
|---|---|---|
| [Analyse](./scan.md) | `-s` `--scan` | Chaque catégorie de cache avec sa taille actuelle |
| [Audit du dossier personnel](./home-audit.md) | `--audit` | Les 20 plus grosses entrées de `$HOME` |
| [Audit des paquets globaux](./globals-audit.md) | `--globals` | Les paquets globaux npm/pnpm/yarn/bun/deno |
| Lister les cibles | `--list-targets` | Chaque chemin que l’outil peut toucher, plus la liste protégée |
| Autotest | `--self-test` | Vérification des dépendances, de la syntaxe et des garde-fous |
| Version | `-V` `--version` | Version et auteur |

## Nettoyage — données régénérables {#cleanup--regenerable-data}

Ces modes peuvent supprimer des cibles de nettoyage. `--yes` ne saute la confirmation du lot que pour `--all-safe` ; les autres modes gardent leurs questions.

| Mode | Option | Comportement |
|---|---|---|
| [Parcours guidé](./walkthrough.md) | _(par défaut)_ `-w` | Dix étapes guidées, avec une question avant chacune |
| [Menu](./menu.md) | `-m` `--menu` | Menu numéroté — choisissez une catégorie |
| [TUI](./tui.md) | `-t` `--tui` | La même chose, dans une boîte whiptail/dialog |
| [Entièrement sûr](./all-safe.md) | `-a` `--all-safe` | Tous les caches régénérables en une passe |
| [Extensions d’éditeurs](./editor-extensions.md) | `--editor-ext` | Versions remplacées de VS Code / Cursor |
| [Nettoyage du système](./system-cleanup.md) | `--system` | apt, journal, snap, `/tmp`, cache de pages — nécessite `sudo` |

## Nettoyage — uniquement interactif {#cleanup--interactive-only}

Données personnelles ou de projets. Ces modes **ignorent `--yes`** et demandent une confirmation par entrée. Voir la [barrière 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

| Mode | Option | Trouve |
|---|---|---|
| [Fichiers personnels inutilisés](./personal-stale-files.md) | `-p` `--stale` | Gros fichiers inutilisés dans `~/Downloads` et les racines non protégées configurées |
| [Téléchargements partiels](./partial-downloads.md) | `--partials` | `.fdmdownload`, `.crdownload`, `.part` |
| [Recherche de node_modules](./node-modules-finder.md) | `--node-modules` | Dossiers de dépendances de projets inutilisés depuis N jours ou plus |

## Sortie, réparation et configuration {#output-repair-and-setup}

| Mode | Option | Rôle |
|---|---|---|
| [Rapports](./reports.md) | `--reports` | Lister, convertir et consulter les rapports de sessions passées |
| [Export](./reports.md#exporting) | `--export FMT ID` | Conversion non interactive |
| [Doctor](./doctor.md) | `--doctor` | Réparer l’initialisation du shell pour nvm, pnpm, bun, deno, cargo |
| [Diagnostic de vitesse](./speed.md) | `--speed` | Mesurer la pression et les tâches de démarrage ; les corrections facultatives demandent séparément |
| Retour | `--feedback` | Instructions pour signaler un bogue, brouillon mailto facultatif |
| Paquet de débogage | `--debug-bundle` | Rassembler le dernier journal et le dernier rapport dans un tar.gz |
| Installer l’alias | `--install-alias` | Ajouter un alias shell `cleanup` |
| Installer cron | `--install-cron` | `--all-safe -y` chaque semaine, le dimanche à 03:00 |
| Désinstaller l’alias / cron | `--uninstall-alias` `--uninstall-cron` | Retirer l’un ou l’autre |

## Choisir un mode {#choosing-a-mode}

| Objectif | Mode |
|---|---|
| Première utilisation de l’outil | `--self-test`, `--scan`, `--all-safe --dry-run` |
| Libérer de l’espace maintenant, en gardant le contrôle | _(parcours guidé par défaut)_ |
| Libérer de l’espace maintenant, sans questions | `--all-safe -y` |
| Une catégorie précise | `--menu` / `--tui` |
| Maintenance hebdomadaire sans surveillance | `--all-safe -y` + `--install-cron` |
| Libérer le maximum avant une réinstallation | `--all-safe -y --purge-all` |
| Trouver ce qui dévore le disque | `--audit`, `--scan` |
| D’anciens projets personnels qui s’accumulent | `--node-modules` |
| `command not found` après une installation | `--doctor` |

## Options combinables avec les modes {#options-that-combine-with-modes}

| Option | Par défaut | Effet |
|---|---|---|
| `-d N` `--days N` | 100 | Seuil d’inactivité. Plus il est bas, plus c’est agressif |
| `--purge-all` | désactivé | Désactive le seuil d’inactivité — vidage complet |
| `-y` `--yes` | désactivé | Confirme automatiquement les caches régénérables. Seulement avec `--all-safe` |
| `--no-report` | désactivé | Saute le rapport JSON. Les journaux sont quand même écrits |
| `--cleanup-logs` | désactivé | Supprime le journal de cette exécution à la fin. Les rapports sont toujours conservés |
| `--no-color` | désactivé | Désactive la couleur ANSI. `NO_COLOR` est aussi respecté |
| `-n` `--dry-run` | désactivé | Parcourt le nettoyage choisi sans rien supprimer ; le journal local et l’état de la vérification des mises à jour peuvent quand même être écrits |
| `--json-events` | désactivé | NDJSON pour `--scan` ou `--all-safe --yes` non interactif |

Détail complet : [Options de la CLI](../reference/cli-flags.md) et la [matrice des modes](../reference/modes-matrix.md).
