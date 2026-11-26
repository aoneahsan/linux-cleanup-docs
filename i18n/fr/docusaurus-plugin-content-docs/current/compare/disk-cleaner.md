---
sidebar_position: 9
title: linux-cleanup et Disk Cleaner
description: "Ce qui distingue linux-cleanup et Disk Cleaner, d’après leurs propres pages, vérifié le 2026-11-22."
---

# linux-cleanup et Disk Cleaner

*Vérifié le 2026-11-22 sur la <a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">page officielle de Disk Cleaner</a>.*

**Ce que c’est :** Un nettoyeur GTK pour Linux avec des visualisations du disque et des tâches de nettoyage suggérées.

**Prix chez lui :** Non indiqué sur les pages consultées. **Prix ici :** La ligne de commande est gratuite sous licence MIT. Les offres de l’application de bureau figurent sur la [page des tarifs](https://linux-cleanup.aoneahsan.com/fr/pricing).

| | linux-cleanup | Disk Cleaner |
|---|---|---|
| Interface en ligne de commande | Oui | Oui (<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">source</a>) |
| Aperçu avant suppression | Oui | Non indiqué sur les pages consultées |
| Simulation | Oui | Oui (<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">source</a>) |
| Nettoyage du cache | Oui | Oui (<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">source</a>) |
| Recherche de doublons | En partie | Non indiqué sur les pages consultées |

## À qui Disk Cleaner convient le mieux {#who-is-better-served-by-disk-cleaner}

Choisissez Disk Cleaner s’il vous faut une vue interactive en treemap ou en sunburst.

## Là où linux-cleanup est en avance {#where-linux-cleanup-is-ahead}

Choisissez linux-cleanup si vous voulez que l’outil décide par des règles quels caches ont dépassé leur seuil d’inactivité, plutôt que lire un graphique et choisir à la main.

## Par où commencer ici {#where-to-start-here}

Il n’y a pas d’import d’un outil à l’autre : chacun garde ses propres règles. Pour voir ce que ferait linux-cleanup sur votre ordinateur, commencez par [Prévisualiser avant de supprimer](../safety/preview-first.md) et lancez `npx -y linux-cleanup --all-safe --yes --dry-run`, qui ne supprime rien.
