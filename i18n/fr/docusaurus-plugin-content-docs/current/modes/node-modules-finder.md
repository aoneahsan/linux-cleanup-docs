---
title: Recherche des node_modules délaissés
description: Trouver les dossiers node_modules de projets inutilisés depuis N jours ou plus et les supprimer en mode interactif. Souvent le plus gros gain d’espace sur une machine de développeur.
tags: [node-modules, projects, interactive, disk-space, modes]
sidebar_position: 8
---

# Recherche des node_modules délaissés

**`--node-modules` trouve les dossiers `node_modules` des projets que vous n’avez pas touchés depuis `--days` jours ou plus, et propose de supprimer chacun.** L’espace disponible dépend des projets présents sur cette machine.

```bash
linux-cleanup --node-modules          # 100 jours par défaut
linux-cleanup --node-modules -d 90
```

## Uniquement interactif {#interactive-only}

Ce mode demande une confirmation par projet et **ignore `--yes`**. Il ne fait pas partie de [`--all-safe`](./all-safe.md) et ne peut pas tourner sans surveillance. Voir la [barrière 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

## Ce qu’il recherche {#what-it-looks-for}

Il parcourt vos racines de projets à la recherche de dossiers `node_modules` dont le projet est inutilisé au-delà du seuil, et indique pour chacun sa taille et ses jours d’inactivité. Les `node_modules` imbriqués dans un dossier déjà listé ne sont pas comptés à part.

Les racines de projets se configurent avec `project-roots.txt` dans `$XDG_CONFIG_HOME` (par défaut `~/.config`). Voir [Variables d’environnement](../reference/environment-variables.md).

## Pourquoi c’est généralement sans risque {#why-this-is-usually-safe}

`node_modules` est ce qu’il y a de plus fiablement régénérable sur une machine de développeur : `yarn install` ou `npm install` le reconstruit à partir du fichier de verrouillage.

Deux réserves à connaître avant de tout accepter :

:::caution Deux cas où cela peut quand même vous coûter
**Une dépendance corrigée à la main.** Si vous avez modifié un fichier directement dans `node_modules` plutôt qu’avec `patch-package` ou un patch yarn, cette modification n’existe nulle part ailleurs. Elle n’est dans aucun registre ni dans votre fichier de verrouillage.

**Pas de fichier de verrouillage, pas de réseau.** La réinstallation demande que le registre soit joignable et que le fichier de verrouillage existe. Un projet sans fichier de verrouillage validé peut ne pas retrouver le même arbre de dépendances, et une machine isolée du réseau peut ne rien retrouver du tout.
:::

Aucun des deux cas n’est fréquent, et l’outil ne peut détecter ni l’un ni l’autre. Si l’un d’eux concerne un projet de la liste, refusez celui-là.

## Ce qu’il ne touche pas {#what-it-does-not-touch}

- Le code source du projet : seulement le dossier `node_modules` qu’il contient
- Les fichiers de verrouillage, `package.json` ou quoi que ce soit d’autre dans le projet
- Les projets touchés dans le délai du seuil
- Tout ce qui figure sur la [liste des chemins protégés](../reference/protected-paths.md)

## Libérer plus agressivement {#reclaiming-aggressively}

```bash
linux-cleanup --node-modules -d 30
```

Abaisser le seuil élargit la liste des candidats. À 30 jours, vous verrez apparaître des projets sur lesquels vous travaillez encore de temps en temps : lisez la liste plutôt que de tout accepter d’un coup. Une erreur coûte une réinstallation, ce qui est peu, mais pas rien.

## Dans le parcours guidé {#in-the-walkthrough}

S’exécute à l’étape 5 du [parcours guidé](./walkthrough.md), avec les mêmes questions par projet.

## Ensuite {#next}

- [Libérer le plus d’espace](../guides/reclaim-the-most-space.md)
- [Garde-fous](../safety/guards.md)
