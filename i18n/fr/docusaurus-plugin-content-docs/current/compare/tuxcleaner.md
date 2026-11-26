---
sidebar_position: 7
title: linux-cleanup et TuxCleaner
description: "Ce qui distingue linux-cleanup et TuxCleaner, d’après leurs propres pages, vérifié le 2026-11-22."
---

# linux-cleanup et TuxCleaner

*Vérifié le 2026-11-22 sur la <a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">page officielle de TuxCleaner</a>.*

**Ce que c’est :** Une CLI Linux pour le nettoyage, la désinstallation d’applications, l’analyse du disque et l’état du système.

**Prix chez lui :** Non indiqué sur les pages consultées. **Prix ici :** La ligne de commande est gratuite sous licence MIT. Les offres de l’application de bureau figurent sur la [page des tarifs](https://linux-cleanup.aoneahsan.com/fr/pricing).

| | linux-cleanup | TuxCleaner |
|---|---|---|
| Interface en ligne de commande | Oui | Oui (<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">source</a>) |
| Aperçu avant suppression | Oui | Oui (<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">source</a>) |
| Simulation | Oui | Oui (<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">source</a>) |
| Nettoyage du cache | Oui | Oui (<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">source</a>) |
| Recherche de doublons | En partie | Non indiqué sur les pages consultées |

## À qui TuxCleaner convient le mieux {#who-is-better-served-by-tuxcleaner}

Choisissez TuxCleaner pour ses adaptateurs de paquets propres à chaque distribution et la désinstallation d’applications.

## Là où linux-cleanup est en avance {#where-linux-cleanup-is-ahead}

Choisissez linux-cleanup si vous préférez lancer un script Bash via npx sans étape de compilation, et garder ses règles « inactif seulement » pour des unités Gradle et Android Studio entières.

## Par où commencer ici {#where-to-start-here}

Il n’y a pas d’import d’un outil à l’autre : chacun garde ses propres règles. Pour voir ce que ferait linux-cleanup sur votre ordinateur, commencez par [Prévisualiser avant de supprimer](../safety/preview-first.md) et lancez `npx -y linux-cleanup --all-safe --yes --dry-run`, qui ne supprime rien.
