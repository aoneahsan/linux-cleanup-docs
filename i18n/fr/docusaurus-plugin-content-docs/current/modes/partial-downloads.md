---
title: Téléchargements partiels ou orphelins
description: Trouver et supprimer les fichiers de téléchargements partiels abandonnés (.crdownload, .part et .fdmdownload) laissés par des transferts interrompus de navigateurs et de gestionnaires de téléchargement.
tags: [partials, downloads, orphan, interactive, modes]
sidebar_position: 10
---

# Téléchargements partiels ou orphelins

**`--partials` trouve les fichiers de téléchargements partiels abandonnés et propose de les supprimer.** Ce sont les fichiers provisoires qu’un navigateur ou un gestionnaire de téléchargement écrit pendant le transfert et oublie de nettoyer quand celui-ci est interrompu.

```bash
linux-cleanup --partials
```

## Ce qu’il recherche {#what-it-looks-for}

| Extension | Écrite par |
|---|---|
| `.crdownload` | Chrome, Chromium, Brave, Edge, Vivaldi |
| `.part` | Firefox, wget, aria2 |
| `.fdmdownload` | Free Download Manager |

Un fichier partiel contient les octets arrivés avant l’interruption du transfert : parfois quelques kilooctets, parfois la majeure partie d’une ISO de plusieurs gigaoctets.

## Uniquement interactif {#interactive-only}

Confirmation fichier par fichier, `--yes` ignoré, pas inclus dans [`--all-safe`](./all-safe.md). Voir la [barrière 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

## Ce que coûte la suppression d’un fichier {#what-deleting-one-costs-you}

:::caution Un fichier partiel peut encore être repris, mais le plus souvent non
La reprise demande la session de téléchargement d’origine : l’entrée du gestionnaire de téléchargements du navigateur, l’URL source et un serveur qui accepte les requêtes par plages. Si le navigateur a été redémarré ou l’entrée effacée, le fichier partiel ne peut plus être repris et ne sert à rien.

Le fichier en lui-même n’est jamais utilisable seul : une archive à moitié téléchargée ne s’ouvre pas. La seule vraie question est donc de savoir si vous comptez encore le reprendre.
:::

Vérifiez avant d’accepter la suppression d’un gros fichier :

- Ouvrez la page des téléchargements du navigateur et cherchez une entrée en pause ou en échec portant le même nom
- S’il y en a une, reprenez-la là plutôt que de supprimer le fichier partiel
- Sinon, le fichier partiel est orphelin et peut être supprimé sans risque

## Un téléchargement en cours apparaîtra ici aussi {#an-active-download-will-show-up-here}

Un téléchargement en cours *en ce moment* a lui aussi un fichier `.crdownload` ou `.part`. L’outil n’a aucun moyen de distinguer un transfert en cours d’un transfert abandonné. Supprimer un fichier partiel actif casse le transfert en cours : vérifiez la page des téléchargements en cas de doute, ou lancez ce mode quand rien ne se télécharge.

## Dans le parcours guidé {#in-the-walkthrough}

Étape 6 du [parcours guidé](./walkthrough.md).

## Ensuite {#next}

- [Fichiers personnels inutilisés](./personal-stale-files.md) — le mode interactif voisin
- [La suppression est définitive](../safety/irreversibility.md)
