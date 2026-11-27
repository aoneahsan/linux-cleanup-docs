---
title: Analyse (lecture seule)
description: Examiner les racines de cache, les téléchargements partiels et les autres candidats au nettoyage sous Linux sans supprimer de fichiers.
sidebar_position: 3
---

# Analyse (lecture seule)

**`--scan` liste des chemins et leur taille actuelle sans supprimer de fichiers.** C’est un premier coup d’œil sur la machine. Pour voir les actions proposées, utilisez une simulation du mode de nettoyage choisi.

```bash
linux-cleanup --scan
```

## Qu’examine-t-il ? {#what-does-it-inspect}

L’analyse affiche un tableau des racines de cache et d’outils de compilation : gestionnaires de paquets, navigateurs, Gradle, lanceurs de tests, outils Android et autres emplacements configurés. Elle liste aussi les téléchargements partiels, les téléchargements probablement en double, les gros fichiers personnels inutilisés candidats et quelques observations sur le système. Elle n’exécute pas le nettoyage des gestionnaires de paquets et ne demande pas `sudo`.

La taille d’une racine de cache listée couvre tout ce qui s’y trouve actuellement. Ce **n’est pas** la quantité que l’outil supprimera. Le mode choisi, le seuil d’inactivité, l’utilisation en cours et les règles de refus déterminent ce qui reste.

L’analyse écrit un journal de session local. Elle n’écrit pas le [rapport de session JSON](../reference/report-schema.md) du parcours guidé.

## Lire les chemins avant de choisir un mode {#read-the-paths-before-choosing-a-mode}

Vérifiez tout chemin que vous ne reconnaissez pas. Un lien symbolique peut pointer ailleurs que ce que suggère son nom ; examinez-le avec `realpath` avant un nettoyage. La protection des chemins résout elle aussi les liens symboliques avant de supprimer.

Les fichiers personnels candidats n’apparaissent que pour examen. Le nettoyage courant `--all-safe` ne les sélectionne pas. Pour prévisualiser un nettoyage des caches :

```bash
linux-cleanup --all-safe --dry-run
```

Une simulation parcourt ce mode sans rien supprimer. Elle peut tout de même écrire un journal local et l’état de la vérification des mises à jour. Une suppression réelle ne s’annule pas.

## Analyse lisible par une machine {#machine-readable-scan}

```bash
linux-cleanup --scan --json-events > scan.ndjson
```

Le [flux d’événements en version 1](../reference/json-events.md) va sur stdout ; le texte lisible va sur stderr. Il peut contenir des chemins locaux complets. Gardez-le sur cette machine et servez-vous du code de sortie pour distinguer une exécution complète d’un flux interrompu.

## Autres vues en lecture seule {#other-read-only-views}

| Commande | Question à laquelle elle répond |
|---|---|
| `--list-targets` | Quels chemins configurés un mode peut-il viser ou refuser ? |
| `--audit` | Quelles entrées de `$HOME` sont les plus grosses, qu’un mode de nettoyage les couvre ou non ? |
| `--globals` | Quels paquets globaux d’environnements d’exécution sont installés ? |
| `--self-test` | Les commandes nécessaires, la syntaxe et les vérifications des garde-fous passent-elles ? |

Lisez [Prévisualiser avant de supprimer](../safety/preview-first.md) pour l’ordre, puis [Options de la CLI](../reference/cli-flags.md) pour les options des modes.
