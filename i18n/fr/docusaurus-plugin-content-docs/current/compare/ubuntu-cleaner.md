---
sidebar_position: 8
title: linux-cleanup et Ubuntu Cleaner
description: "Ce qui distingue linux-cleanup et Ubuntu Cleaner, d’après leurs propres pages, vérifié le 2026-11-22."
---

# linux-cleanup et Ubuntu Cleaner

*Vérifié le 2026-11-22 sur la <a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">page officielle de Ubuntu Cleaner</a>.*

**Ce que c’est :** Un nettoyeur Bash pour Ubuntu, Debian et Linux Mint, avec maintenance des paquets et des caches de développement.

**Prix chez lui :** Non indiqué sur les pages consultées. **Prix ici :** La ligne de commande est gratuite sous licence MIT. Les offres de l’application de bureau figurent sur la [page des tarifs](https://linux-cleanup.aoneahsan.com/fr/pricing).

| | linux-cleanup | Ubuntu Cleaner |
|---|---|---|
| Interface en ligne de commande | Oui | Oui (<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">source</a>) |
| Aperçu avant suppression | Oui | Oui (<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">source</a>) |
| Simulation | Oui | Oui (<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">source</a>) |
| Nettoyage du cache | Oui | Oui (<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">source</a>) |
| Recherche de doublons | En partie | Non indiqué sur les pages consultées |

## À qui Ubuntu Cleaner convient le mieux {#who-is-better-served-by-ubuntu-cleaner}

Choisissez Ubuntu Cleaner pour son orientation famille Debian et la maintenance de Docker.

## Là où linux-cleanup est en avance {#where-linux-cleanup-is-ahead}

Choisissez linux-cleanup si vous voulez que le nettoyage tourne avec votre utilisateur habituel et laisse les paquets système à un mode --system distinct et explicite.

## Par où commencer ici {#where-to-start-here}

Il n’y a pas d’import d’un outil à l’autre : chacun garde ses propres règles. Pour voir ce que ferait linux-cleanup sur votre ordinateur, commencez par [Prévisualiser avant de supprimer](../safety/preview-first.md) et lancez `npx -y linux-cleanup --all-safe --yes --dry-run`, qui ne supprime rien.
