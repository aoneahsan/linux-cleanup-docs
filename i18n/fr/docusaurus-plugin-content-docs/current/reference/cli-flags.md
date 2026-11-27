---
title: Options de la CLI
description: Toutes les options de ligne de commande de linux-cleanup — modes, options, alias et valeurs par défaut — avec ce que fait chacune et où elle est décrite en détail.
sidebar_position: 1
---

# Options de la CLI

**Toutes les options qu’accepte linux-cleanup.** Les modes s’excluent mutuellement : n’en passez qu’un. Les options se combinent avec n’importe quel mode.

```bash
linux-cleanup --help    # la même liste, avec les vrais chemins de votre machine
```

Une option non reconnue affiche l’aide et quitte avec le code `2`.

## Modes {#modes}

Passez-en un au plus. Sans aucun, vous obtenez le [parcours guidé](../modes/walkthrough.md).

| Option | Alias | Rôle | Page complète |
|---|---|---|---|
| _(aucune)_ | `-w` `--walkthrough` | Dix étapes guidées, avec une question avant chacune | [Parcours guidé](../modes/walkthrough.md) |
| `-m` | `--menu` `-i` `--interactive` | Menu numéroté pour aller directement à une étape | [Menu](../modes/menu.md) |
| `-t` | `--tui` `-g` `--gui` | Menu visuel whiptail / dialog | [TUI](../modes/tui.md) |
| `-a` | `--all-safe` | Nettoyage groupé de tous les caches régénérables | [Entièrement sûr](../modes/all-safe.md) |
| `-s` | `--scan` | Audit en lecture seule de chaque catégorie | [Analyse](../modes/scan.md) |
| `-p` | `--stale` | Gros fichiers personnels inutilisés (interactif) | [Fichiers personnels inutilisés](../modes/personal-stale-files.md) |
| | `--system` | apt, journal, snap, `/tmp`, cache de pages (sudo) | [Nettoyage du système](../modes/system-cleanup.md) |
| | `--partials` | Téléchargements partiels abandonnés (interactif) | [Téléchargements partiels ou orphelins](../modes/partial-downloads.md) |
| | `--audit` | Les 20 plus grosses entrées de `$HOME` | [Audit du dossier personnel](../modes/home-audit.md) |
| | `--node-modules` | `node_modules` inutilisés (interactif) | [Recherche des node_modules délaissés](../modes/node-modules-finder.md) |
| | `--globals` | Audit en lecture seule des paquets globaux | [Audit des paquets globaux](../modes/globals-audit.md) |
| | `--doctor` | Répare l’initialisation du shell manquante pour les environnements d’exécution | [Doctor](../modes/doctor.md) |
| | `--speed` | Examine la pression et le démarrage ; demande avant tout changement | [Diagnostic de vitesse](../modes/speed.md) |
| | `--editor-ext` | Versions remplacées de VS Code / Cursor | [Extensions d’éditeurs](../modes/editor-extensions.md) |
| | `--reports` | Gestionnaire interactif des enregistrements de session | [Rapports](../modes/reports.md) |
| | `--export FMT ID` | Conversion non interactive des enregistrements | [Rapports](../modes/reports.md#exporting) |
| | `--feedback` | Instructions pour signaler un bogue, brouillon mailto facultatif | [Envoyer un rapport de bogue](../guides/send-a-bug-report.md) |
| | `--debug-bundle` | Emballe le dernier journal et le dernier enregistrement dans un tar.gz | [Envoyer un rapport de bogue](../guides/send-a-bug-report.md) |
| | `--list-targets` | Affiche tous les chemins ciblables et protégés | [Prévisualiser avant de supprimer](../safety/preview-first.md) |
| | `--self-test` | Vérifie les dépendances, la syntaxe et les barrières de sécurité | [Prévisualiser avant de supprimer](../safety/preview-first.md) |
| `-V` | `--version` | Version et auteur | — |
| | `--install-alias` | Ajoute l’alias shell `cleanup` | [Alias shell et cron hebdomadaire](../guides/alias-and-cron.md) |
| | `--install-cron` | `--all-safe -y` chaque semaine, le dimanche à 03:00 | [Alias shell et cron hebdomadaire](../guides/alias-and-cron.md) |
| | `--uninstall-alias` | Retire l’alias | [Désinstaller](../guides/uninstall.md) |
| | `--uninstall-cron` | Retire l’entrée cron | [Désinstaller](../guides/uninstall.md) |
| | `--refresh-app` | Rafraîchit la copie persistante utilisée par l’alias et cron | [Installation](../getting-started/installation.md) |

## Options {#options}

| Option | Par défaut | Effet |
|---|---|---|
| `-d N` `--days N` | `100` | Seuil d’inactivité. Un fichier n’est retenu que si `atime` **et** `mtime` le dépassent tous les deux. Plus bas, c’est plus agressif |
| `--purge-all` | désactivée | **Désactive la barrière d’inactivité.** Les caches ciblés sont vidés entièrement, comme avant la 1.2.0 |
| `-y` `--yes` | désactivée | Confirme automatiquement les caches régénérables. Valable seulement avec `--all-safe`. **Les modes personnels l’ignorent** |
| `--no-report` | désactivée | Pas de JSON. Les journaux sont quand même écrits |
| `--cleanup-logs` | désactivée | Supprime le journal de cette exécution à la fin. **Les enregistrements sont toujours conservés** |
| `-n` `--dry-run` | désactivée | Parcourt le mode choisi sans supprimer de fichiers ni changer de réglages. Un journal local reste ; aucun rapport de session JSON n’est écrit |
| `--json-events` | désactivée | [Événements lisibles par une machine](./json-events.md) sur stdout pour `--scan` ou `--all-safe --yes` ; le texte lisible va sur stderr |
| `--no-color` | désactivée | Désactive la couleur ANSI. `NO_COLOR` est aussi respecté |
| `-h` `--help` | — | Affiche l’aide et quitte |

:::danger `--purge-all` retire une barrière de sécurité
Elle désactive la [barrière d’inactivité](../safety/guards.md#guard-2--the-staleness-gate), donc les caches sont vidés en entier, quelle que soit leur dernière utilisation. Les ressources coûteuses — distributions du Gradle wrapper, navigateurs Playwright, binaires Cypress — partent avec eux. Le bandeau affiché avant l’exécution indique la stratégie active.
:::

:::note Analyse et simulation répondent à des questions différentes
[`--scan`](../modes/scan.md) lit les chemins et tailles actuels. `--dry-run` parcourt le nettoyage choisi et montre les actions prévues sans rien supprimer. Voir [Prévisualiser avant de supprimer](../safety/preview-first.md).
:::

## Recettes {#recipes}

| Objectif | Commande |
|---|---|
| Vérifier l’installation | `linux-cleanup --self-test` |
| Voir ce qui peut être récupéré | `linux-cleanup --scan` |
| Prévisualiser un nettoyage de caches | `linux-cleanup --all-safe --dry-run` |
| Diffuser une analyse en lecture seule sous forme d’événements JSON | `linux-cleanup --scan --json-events` |
| Voir tous les chemins qu’il peut toucher | `linux-cleanup --list-targets` |
| Nettoyage guidé | `linux-cleanup` |
| Un passage groupé, sans questions | `linux-cleanup --all-safe -y` |
| Balayage agressif | `linux-cleanup --all-safe -y -d 30` |
| Récupérer un maximum avant une réinstallation | `linux-cleanup --all-safe -y --purge-all` |
| Menu visuel | `linux-cleanup --tui` |
| Dossiers de dépendances de vieux projets | `linux-cleanup --node-modules -d 90` |
| Entretien du système | `linux-cleanup --system` |
| Automatisation hebdomadaire | `linux-cleanup --install-cron` |
| Convertir le dernier enregistrement en HTML | `linux-cleanup --export html latest` |
| Signaler un bogue | `linux-cleanup --debug-bundle && linux-cleanup --feedback` |

## Variables d’environnement {#environment-variables}

Les plus utilisées, la [liste complète](./environment-variables.md) étant à part :

| Variable | Effet |
|---|---|
| `NO_COLOR` | Toute valeur non vide désactive la couleur |
| `LINUX_CLEANUP_LOG_DIR` | Remplace le dossier des journaux |
| `LINUX_CLEANUP_REPORTS_DIR` | Remplace le dossier des enregistrements de session |
| `LINUX_CLEANUP_DATA_HOME` | Parent des journaux, enregistrements et paquets de retour |

## Codes de sortie {#exit-codes}

| Code | Signification |
|---|---|
| `0` | Exécution propre |
| `2` | Erreur d’analyse des arguments ou mode non pris en charge par le flux d’événements |
| `3` | Ancienne version bloquée par le registre des versions |
| `130` | Interrompu avec `Ctrl-C` |
| `143` | Arrêté par `SIGTERM` |
| autre | Inattendu : écrit un paquet de plantage |

Le tableau complet et la logique du piège de plantage : [Codes de sortie](./exit-codes.md).
