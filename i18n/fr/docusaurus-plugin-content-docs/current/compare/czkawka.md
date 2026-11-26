---
sidebar_position: 10
title: linux-cleanup et Czkawka
description: "Ce qui distingue linux-cleanup et Czkawka, d’après leurs propres pages, vérifié le 2026-11-22."
---

# linux-cleanup et Czkawka

*Vérifié le 2026-11-22 sur la <a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">page officielle de Czkawka</a>.*

**Ce que c’est :** Un utilitaire de recherche de doublons, dossiers vides, médias similaires et autres encombrements.

**Prix chez lui :** Non indiqué sur les pages consultées. **Prix ici :** La ligne de commande est gratuite sous licence MIT. Les offres de l’application de bureau figurent sur la [page des tarifs](https://linux-cleanup.aoneahsan.com/fr/pricing).

| | linux-cleanup | Czkawka |
|---|---|---|
| Interface en ligne de commande | Oui | Oui (<a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">source</a>) |
| Aperçu avant suppression | Oui | Non indiqué sur les pages consultées |
| Simulation | Oui | Non indiqué sur les pages consultées |
| Nettoyage du cache | Oui | Non indiqué sur les pages consultées |
| Recherche de doublons | En partie | Oui (<a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">source</a>) |

## À qui Czkawka convient le mieux {#who-is-better-served-by-czkawka}

Choisissez Czkawka pour trouver des fichiers personnels en double ou similaires ; linux-cleanup ne prétend pas faire ce travail.

## Là où linux-cleanup est en avance {#where-linux-cleanup-is-ahead}

Choisissez linux-cleanup pour les caches, journaux et fichiers temporaires au-delà d’un seuil d’inactivité ; les pages de Czkawka décrivent la recherche de fichiers en double et similaires.

## Par où commencer ici {#where-to-start-here}

Il n’y a pas d’import d’un outil à l’autre : chacun garde ses propres règles. Pour voir ce que ferait linux-cleanup sur votre ordinateur, commencez par [Prévisualiser avant de supprimer](../safety/preview-first.md) et lancez `npx -y linux-cleanup --all-safe --yes --dry-run`, qui ne supprime rien.
