---
title: Tableau des modes
description: "Tous les modes de linux-cleanup côte à côte : s’ils suppriment, s’ils sont interactifs, s’ils utilisent sudo et s’ils écrivent un enregistrement de session."
sidebar_position: 2
---

# Tableau des modes

Tous les modes d’un coup d’œil. Servez-vous-en pour répondre à « cela va-t-il supprimer quelque chose ? » sans lire une page entière.

## Le tableau {#the-matrix}

| Mode | Option | Supprime | Interactif | sudo | Écrit un enregistrement |
|---|---|---|---|---|---|
| [Parcours guidé](../modes/walkthrough.md) | _(aucune)_ `-w` | Oui | Oui | Étape 8 seulement | Oui |
| [Menu](../modes/menu.md) | `-m` | Oui | Oui | Si choisi | Non |
| [TUI](../modes/tui.md) | `-t` | Oui | Oui | Si choisi | Non |
| [Entièrement sûr](../modes/all-safe.md) | `-a` | Oui | Sauf avec `-y` | Non | Non |
| [Analyse](../modes/scan.md) | `-s` | **Non** | Non | Non | Non |
| [Fichiers personnels inutilisés](../modes/personal-stale-files.md) | `-p` | Oui | **Toujours** | Non | Non |
| [Système](../modes/system-cleanup.md) | `--system` | Oui | Oui | **Oui** | Non |
| [Téléchargements partiels](../modes/partial-downloads.md) | `--partials` | Oui | **Toujours** | Non | Non |
| [Audit du dossier personnel](../modes/home-audit.md) | `--audit` | **Non** | Non | Non | Non |
| [node_modules](../modes/node-modules-finder.md) | `--node-modules` | Oui | **Toujours** | Non | Non |
| [Audit des paquets globaux](../modes/globals-audit.md) | `--globals` | **Non** | Non | Non | Non |
| [Doctor](../modes/doctor.md) | `--doctor` | **Non** — ajout seulement | Oui | Non | Non |
| [Extensions d’éditeurs](../modes/editor-extensions.md) | `--editor-ext` | Oui | Oui | Non | Non |
| [Vitesse](../modes/speed.md) | `--speed` | Aucune suppression de fichier ; réglages facultatifs | Oui | Non | Non |
| [Rapports](../modes/reports.md) | `--reports` | Enregistrements seulement | Oui | Non | Non |
| Export | `--export` | **Non** | Non | Non | Non |
| Retour | `--feedback` | **Non** | Oui | Non | Non |
| Paquet de débogage | `--debug-bundle` | **Non** | Non | Non | Non |
| Lister les cibles | `--list-targets` | **Non** | Non | Non | Non |
| Autotest | `--self-test` | **Non** | Non | Non | Non |
| Version | `-V` | **Non** | Non | Non | Non |
| Installer l’alias | `--install-alias` | **Non** | Oui | Non | Non |
| Installer cron | `--install-cron` | **Non** | Oui | Non | Non |
| Rafraîchir l’application de bureau | `--refresh-app` | Met à jour l’application depuis une version | Oui | Non | Non |
| Désinstaller l’alias | `--uninstall-alias` | La ligne d’alias | Oui | Non | Non |
| Désinstaller cron | `--uninstall-cron` | La ligne cron | Oui | Non | Non |

## Modes qui ne suppriment jamais rien {#modes-that-never-delete-anything}

Ces commandes ne suppriment aucune cible de nettoyage. Certaines écrivent des journaux locaux, des rapports, des exports ou des paquets de diagnostic :

`--scan` · `--audit` · `--globals` · `--list-targets` · `--self-test` · `--version` · `--export` ·
`--feedback` · `--debug-bundle`

`--doctor` a aussi sa place ici, avec une nuance : il modifie la configuration de votre shell, mais uniquement par **ajout** après confirmation. Il ne supprime ni ne réécrit jamais une ligne existante.

## Modes sur lesquels `--yes` agit {#modes---yes-affects}

Un seul : [`--all-safe`](../modes/all-safe.md).

Les modes interactifs sur les données personnelles — `--stale`, `--partials`, `--node-modules` — demandent leurs propres confirmations. Voir [la barrière 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

## Modes auxquels s’applique la barrière d’inactivité {#modes-the-staleness-gate-applies-to}

| S’applique | Ne s’applique pas |
|---|---|
| Élagage des caches dans le parcours guidé, le menu, la TUI et le mode entièrement sûr | `--system` (utilise sa propre règle fixe de 7 jours pour `/tmp`) |
| Remplacement des versions dans `--editor-ext` | `--partials` (l’âge n’est pas le critère) |
| `--node-modules` | Modes en lecture seule (rien n’est supprimé) |
| `--stale` |  |
| Données des outils de développement (AVD, flatpak, pub-cache) |  |

`--purge-all` désactive la barrière partout où elle s’appliquerait.

## Quels modes ont besoin de dépendances facultatives {#which-modes-need-optional-dependencies}

| Mode | A besoin de | Sans elle |
|---|---|---|
| `--tui` | `whiptail` ou `dialog` | Revient à `--menu` avec une indication d’installation |
| Conversion de `--export`, `--reports` | `jq` | Le JSON est tout de même écrit ; la conversion est indisponible |
| `--install-cron` | `crontab` | Ne peut pas s’exécuter |
| Étape snap de `--system` | `snap` | L’étape est sautée proprement |
| Étapes apt de `--system` | `apt`, `dpkg` | **Échoue** — [Debian/Ubuntu uniquement](../distro-support.md) |

## Ensuite {#next}

- [Options de la CLI](./cli-flags.md) — chaque option en détail
- [Vue d’ensemble des modes](../modes/overview.md) — regroupés par usage
