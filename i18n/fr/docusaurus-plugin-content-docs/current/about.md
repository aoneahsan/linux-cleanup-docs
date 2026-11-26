---
title: À propos
description: Qui a créé linux-cleanup, les principes qui le guident, sa licence, et comment prendre contact ou contribuer.
tags: [about, author, licence, contributing, credits]
sidebar_position: 95
---

# À propos

**linux-cleanup est conçu et maintenu par [Ahsan Mahmood](https://aoneahsan.com)**, ingénieur logiciel indépendant qui travaille sur les outils de développement et le développement d’applications.

| | |
|---|---|
| **Auteur** | Ahsan Mahmood |
| **E-mail** | [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |
| **Web** | [aoneahsan.com](https://aoneahsan.com) |
| **LinkedIn** | [linkedin.com/in/aoneahsan](https://linkedin.com/in/aoneahsan) |
| **GitHub** | [github.com/aoneahsan](https://github.com/aoneahsan) |
| **npm** | [npmjs.com/~aoneahsan](https://www.npmjs.com/~aoneahsan) |

## Pourquoi il existe {#why-it-exists}

Les machines de développement accumulent une quantité énorme de déchets régénérables — caches de gestionnaires de paquets qui se comptent en dizaines de gigaoctets, caches de navigateurs, caches d’outils de compilation, images d’émulateurs et `node_modules` de projets abandonnés depuis deux ans.

Les nettoyeurs existants prenaient en général l’une de deux formes. Soit ils ignoraient les caches de développement modernes, soit c’étaient des effaceurs à bouton unique qui supprimaient tout ce qui ressemblait à un déchet en espérant que tout irait bien.

linux-cleanup prend le contre-pied : **scriptable, transparent, protégé par une liste de chemins autorisés et interactif par défaut.** Vous pouvez lire exactement ce qu’il va toucher avant qu’il ne touche quoi que ce soit.

## Principes de conception {#design-principles}

**Refuser dans le doute.** Une [liste de chemins autorisés, pas une liste noire](./safety/guards.md#guard-1--the-path-allowlist). Un chemin que l’outil ne reconnaît pas est refusé. Avec une liste noire, une seule faute de frappe sépare le vidage d’un cache de celui d’un dossier personnel.

**Distinguer caches et outils.** `~/.cache/yarn` se régénère en quelques secondes ; une distribution du Gradle wrapper est un téléchargement de 230 Mo dont vous aurez peut-être besoin le mois prochain. La [barrière d’inactivité](./safety/guards.md#guard-2--the-staleness-gate) existe parce qu’il était faux de les traiter pareil, et la 1.2.0 a corrigé cela.

**Pour les données personnelles, c’est l’utilisateur qui tranche.** Rien sur le disque ne distingue un installeur que vous n’ouvrirez plus jamais de l’unique copie d’un document. L’outil refuse de deviner, c’est pourquoi ces modes [ignorent `--yes`](./safety/guards.md#guard-3--personal-data-is-interactive-only).

**Prévenir plutôt que récupérer.** [Pas d’annulation](./safety/irreversibility.md), par choix : un journal d’annulation multiplie les écritures sur le disque que vous cherchez à libérer, et il encourage la négligence.

**Vérifiable plutôt que pratique.** Bash, parce qu’il est déjà installé et qu’on peut le lire. Un binaire compilé serait plus confortable, et bien plus difficile à vérifier.

**Les vérifications de version sont limitées.** Au démarrage, s’il y a une connexion, la CLI lit un registre public des versions. Elle n’envoie ni chemins de nettoyage, ni rapports, ni paquets de plantage ; envoyer un rapport reste votre choix.

## Les corrections façonnent l’outil {#corrections-shape-the-tool}

Deux des fonctions de sécurité existent parce que quelqu’un a signalé un vrai problème.

La [liste protégée des racines d’installation](./reference/protected-paths.md#exact-match-protected-paths) vient d’un vrai défaut : le nettoyage de pnpm visait `~/.local/share/pnpm` — la racine d’installation — et supprimait les paquets installés globalement. Corrigé en [1.1.0](./changelog.md#110--2026-05-10), avec une assertion pour que cela ne puisse pas se reproduire.

La [barrière d’inactivité](./safety/guards.md#guard-2--the-staleness-gate) vient d’un utilisateur qui a remarqué que la 1.2.0 effaçait encore entièrement les AVD Android, et que le même raisonnement devait s’appliquer à tout ce qui est un outil plutôt qu’un cache. C’est devenu la [1.2.1](./changelog.md#121--2026-05-10).

Si vous trouvez une erreur, [dites-le-nous](./guides/send-a-bug-report.md).

## Licence {#licence}

**[MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)** depuis la [1.4.0](./changelog.md#140--2026-07-11).

Utilisez-le à titre personnel ou commercial, modifiez-le, forkez-le, intégrez-le, redistribuez-le. La seule condition est de conserver la mention de copyright et la mention de permission MIT dans les copies ou les parties substantielles.

:::danger Fourni « EN L’ÉTAT », sans garantie
C’est un outil qui supprime des fichiers. L’auteur décline toute responsabilité pour toute réclamation ou tout dommage, y compris la perte de données, découlant de son utilisation. Sauvegardez vos données et examinez chaque action avant de la confirmer.

Seul le [texte complet de la licence](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE) fait foi.
:::

Les versions publiées avant la 1.4.0 gardent la licence sous laquelle elles sont sorties.

## Contribuer {#contributing}

Les contributions sont les bienvenues sous MIT.

- **Forkez et ouvrez une pull request** — aucun accès particulier n’est nécessaire
- **Signalez des bogues ou demandez des fonctions** via les [issues GitHub](https://github.com/aoneahsan/linux-cleanup/issues) ou par e-mail
- **`main` est protégée** — les changements arrivent par des PR relues

Les règles de code : la sécurité d’abord, hors ligne uniquement, sans avertissement ShellCheck. Voir [CONTRIBUTING.md](https://github.com/aoneahsan/linux-cleanup/blob/main/CONTRIBUTING.md).

Une demande de fonction décrite seulement est aussi bienvenue que du code. Dites ce que vous voudriez nettoyer et pourquoi les modes existants ne le couvrent pas.

## Cette documentation {#this-documentation}

Construite avec [Docusaurus](https://docusaurus.io/) et publiée sur GitHub Pages. Sources : [github.com/aoneahsan/linux-cleanup-docs](https://github.com/aoneahsan/linux-cleanup-docs) — les corrections y sont aussi les bienvenues.

Résumé lisible par une machine pour les assistants d’IA : [`/llms.txt`](https://linux-cleanup-docs.aoneahsan.com/llms.txt).

## Liens utiles {#related-links}

| | |
|---|---|
| **Sources** | [github.com/aoneahsan/linux-cleanup](https://github.com/aoneahsan/linux-cleanup) |
| **npm** | [npmjs.com/package/linux-cleanup](https://www.npmjs.com/package/linux-cleanup) |
| **Issues** | [github.com/aoneahsan/linux-cleanup/issues](https://github.com/aoneahsan/linux-cleanup/issues) |
| **Soutenir le travail** | [aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=linux-cleanup&project-identifier=linux-cleanup) |
