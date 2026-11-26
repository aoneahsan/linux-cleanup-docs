---
title: linux-cleanup
description: Un utilitaire en ligne de commande écrit en Bash qui libère de l’espace disque sous Linux en supprimant définitivement des caches régénérables, derrière une liste de chemins autorisés, un seuil d’inactivité et une confirmation interactive.
tags: [linux, cleanup, disk-space, cli, bash, overview]
slug: /
sidebar_label: Introduction
sidebar_position: 1
---

# linux-cleanup

**linux-cleanup montre les chemins avant de supprimer les caches régénérables sous Linux.** Il couvre les caches des gestionnaires de paquets, des navigateurs et des outils de compilation, avec des modes séparés pour le système et pour les fichiers personnels candidats. Commencez par une analyse en lecture seule ou une simulation avant de choisir un nettoyage réel.

Obtenir linux-cleanup : [sur npm](https://www.npmjs.com/package/linux-cleanup) · [le site](https://linux-cleanup.aoneahsan.com) · [tous les endroits](/apps)

C’est un **outil destructif**. Chaque suppression est définitive, sans annulation possible. Sa sécurité vient de son refus de toucher les mauvaises choses dès le départ, pas de sa capacité à les remettre en place.

:::danger Cet outil supprime des fichiers définitivement
Il n’y a ni annulation, ni corbeille, ni sauvegarde. Un nettoyage réel supprime définitivement les fichiers sélectionnés. Utilisez `--dry-run` pour prévisualiser le mode choisi avant de le confirmer.

Lisez **[Ce qu’il supprime](./safety/what-it-deletes.md)** et lancez **[la prévisualisation en lecture seule](./safety/preview-first.md)** avant de le laisser supprimer quoi que ce soit.
:::

| | |
|---|---|
| **Version du paquet** | 2.1.1 sur npm (2026-11-22) ; `linux-cleanup --version` donne la version installée |
| **Plateforme** | Linux uniquement — `bash` ≥ 4 et GNU coreutils |
| **Licence** | [MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE) — depuis la 1.4.0 |
| **Accès réseau** | Une requête au registre public des versions au démarrage, si connecté ; l’installation et la mise à jour passent aussi par npm ou GitHub |
| **Auteur** | [Ahsan Mahmood](https://aoneahsan.com) · [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |

## À lire dans l’ordre

Cette documentation suit volontairement un ordre pensé pour un outil qui efface des données. Les trois premières pages sont celles qui vous évitent les ennuis.

| Étape | Page | Pourquoi |
|---|---|---|
| 1 | [Ce qu’il supprime](./safety/what-it-deletes.md) | La liste complète des cibles, par catégorie |
| 2 | [Prévisualiser avant de supprimer](./safety/preview-first.md) | Analyse en lecture seule, puis simulation du mode choisi |
| 3 | [Garde-fous](./safety/guards.md) | Les quatre barrières qu’un chemin doit franchir avant suppression |
| 4 | [La suppression est définitive](./safety/irreversibility.md) | Ce que « sans annulation » veut dire en pratique |
| 5 | [Installation](./getting-started/installation.md) | `npx`, `npm` global ou `git clone` |
| 6 | [Démarrage rapide](./getting-started/quick-start.md) | Votre premier nettoyage réel |

## Ce qu’il fait bien

- **Montrer les candidats.** Une analyse nomme les racines de cache et leur taille actuelle. Une simulation parcourt le nettoyage choisi et nomme les actions proposées.
- **Ne pas supprimer ce qu’il ne faut pas.** Une [liste de chemins autorisés](./reference/protected-paths.md) refuse catégoriquement `~/Documents`, `~/.ssh`, `~/.config`, `/etc` et apparentés, après résolution des liens symboliques.
- **Laisser tranquilles les fichiers récents.** Depuis la 1.2.0, le comportement par défaut est d’*élaguer*, pas de vider : dans un cache, seuls les fichiers inutilisés depuis plus de 100 jours sont supprimés. Voir [le seuil d’inactivité](./safety/guards.md#guard-2--the-staleness-gate).
- **Garder une trace.** La CLI tient un journal local. Les parcours guidés écrivent un [rapport de session JSON](./reference/report-schema.md) sauf désactivation ; les simulations non.
- **Vérifier les mises à jour.** Au démarrage, la CLI lit un registre public des versions en HTTPS quand il est disponible.

## Ce qu’il n’est pas

Être clair sur les limites sert davantage qu’une liste de fonctions.

- **Pas un outil de sauvegarde.** Il supprime ; il n’archive jamais. Rien de ce qu’il supprime ne se récupère depuis l’outil.
- **Pas un outil d’annulation.** [`--scan`](./modes/scan.md) ne fait que lire ; `--dry-run` prévisualise le nettoyage choisi ; aucun des deux ne récupère des fichiers après une exécution réelle.
- **Pas un scanner de sécurité.** Il ne trouvera ni secrets, ni logiciels malveillants, ni vulnérabilités.
- **Pas multiplateforme.** Linux uniquement. Le paquet npm déclare `"os": ["linux"]`.
- **Pas complet sur toutes les distributions.** Le nettoyage des caches dans `$HOME` fonctionne partout, mais [le mode `--system` est réservé à Debian/Ubuntu](./distro-support.md) : il appelle directement `apt` et `dpkg`.
- **Pas un substitut à votre jugement.** Lisez ce qu’il propose avant de confirmer.

## La version en 30 secondes

```bash
# 1. Voir ce qui pourrait être libéré. Ne supprime rien.
npx linux-cleanup --scan

# 2. Prévisualiser le nettoyage choisi sans rien supprimer.
npx linux-cleanup --all-safe --dry-run

# 3. Lancer le parcours guidé. Vérifier chaque choix avant suppression.
npx linux-cleanup
```

L’étape 3 est le mode par défaut. Elle parcourt dix catégories, demande avant chacune, affiche le total des octets libérés au fil de l’eau et écrit un rapport à la fin. Voir [Parcours guidé](./modes/walkthrough.md).

## Et ensuite

- Récupérer l’espace au plus vite ? → [Libérer le plus d’espace](./guides/reclaim-the-most-space.md)
- Un problème ? → [Récupération](./recovery.md) puis [Dépannage](./troubleshooting.md)
- Toutes les options ? → [Options de la CLI](./reference/cli-flags.md)
- Ce qui a changé ? → [Journal des modifications](./changelog.md)
