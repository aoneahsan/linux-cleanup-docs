---
title: Audit des paquets globaux
description: Un audit en lecture seule des paquets installés globalement avec npm, pnpm, yarn, bun et deno, qui marque chacun comme utilisé récemment, requis par un autre ou inutilisé, et affiche des commandes de désinstallation à lancer vous-même.
tags: [globals, npm, pnpm, yarn, bun, deno, read-only, modes]
sidebar_position: 12
---

# Audit des paquets globaux

**`--globals` liste vos paquets installés globalement avec npm, pnpm, yarn, bun et deno, et marque chacun d’eux.** Ajouté en [1.1.0](../changelog.md#110--2026-05-10).

```bash
linux-cleanup --globals
linux-cleanup --globals -d 180
```

:::note Ce mode ne supprime jamais rien
Il affiche des commandes de désinstallation prêtes à copier, puis s’arrête. C’est vous qui décidez quoi lancer. Les paquets globaux sont précisément le genre de chose qui casse un flux de travail quand on les retire par surprise, donc l’outil refuse de les supprimer à votre place.
:::

## Les verdicts {#the-verdicts}

| Verdict | Signification |
|---|---|
| **recently used** | Modifié ou utilisé dans les `--days` derniers jours. À garder |
| **needed by: `<pkg>`** | Un autre paquet global le déclare comme dépendance. Le retirer casse ce dernier |
| **STALE — safe to uninstall** | Inutilisé au-delà du seuil et rien n’en dépend |

« Sûr à désinstaller » signifie sûr du point de vue des autres paquets globaux de votre machine. L’outil ne peut pas connaître un script shell, une tâche de CI ou une habitude à vous qui appelle ce binaire. Lisez la liste avant d’agir.

## Pourquoi les paquets globaux comptent ici {#why-global-packages-matter-here}

Les paquets installés globalement ne sont **jamais** supprimés par un mode de nettoyage. `~/.local/share/pnpm`, `~/.npm`, `~/.yarn`, `~/.bun/install/global` et `~/.deno/bin` figurent sur la [liste protégée à correspondance exacte](../reference/protected-paths.md#exact-match-protected-paths) justement pour les protéger, une leçon tirée d’un vrai bogue où le nettoyage de pnpm visait la racine d’installation et effaçait les paquets globaux. Voir [1.1.0](../changelog.md#110--2026-05-10).

Cet audit en est la contrepartie délibérée : de la visibilité, sans automatisation.

## Fonctionne sans les gestionnaires de paquets dans le PATH {#works-without-the-package-managers-on-path}

Chaque gestionnaire est interrogé par sa CLI quand elle est disponible, et par l’inspection du système de fichiers sinon. L’audit fonctionne donc même sur une machine où `pnpm` a été installé mais n’est plus dans le `PATH`, ce qui est souvent exactement la situation que vous cherchez à diagnostiquer.

Si un environnement d’exécution est sur le disque mais non relié à votre shell, c’est [`--doctor`](./doctor.md) qui corrige cela.

## Bons moments pour le lancer {#good-moments-to-run-it}

- Avant de réinstaller Node ou de changer de gestionnaire de versions
- Avant de migrer vers une nouvelle machine : c’est un inventaire portable de vos outils
- Quand la sortie de `npm ls -g` est devenue méconnaissable
- Une ou deux fois par an, par hygiène

## Ensuite {#next}

- [Doctor](./doctor.md) — réparer un environnement installé mais absent du `PATH`
- [Chemins protégés](../reference/protected-paths.md) — pourquoi les paquets globaux ne sont jamais touchés
