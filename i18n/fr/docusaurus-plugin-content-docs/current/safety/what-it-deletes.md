---
title: Ce qu’il supprime
description: Les modes de nettoyage Linux et leurs chemins cibles, avec la différence entre caches courants, travaux système et fichiers personnels.
tags: [safety, deletion, targets, caches, disk-space]
sidebar_position: 1
---

# Ce qu’il supprime

**linux-cleanup supprime définitivement les caches et résidus sélectionnés.** La cible dépend du mode. Une analyse liste les chemins et leur taille actuelle ; une simulation parcourt le nettoyage choisi et montre les actions proposées. Aucune des deux n’est une sauvegarde.

```bash
linux-cleanup --list-targets
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

La [protection des chemins](../reference/protected-paths.md) refuse les emplacements personnels et système configurés, après résolution des liens symboliques. Lisez chaque chemin proposé avant une exécution réelle.

## Caches des gestionnaires de paquets

Le nettoyage courant entièrement sûr peut élaguer ces racines de cache. Réinstaller un paquet ensuite peut demander un téléchargement.

| Cache | Racine cible |
|---|---|
| Yarn Berry | `~/.yarn/berry/cache` |
| npm | `~/.npm/_cacache` |
| npx | `~/.npm/_npx` |
| pnpm store | `~/.local/share/pnpm/store` |
| pnpm cache | `~/.cache/pnpm` |
| bun | `~/.bun/install/cache` |
| deno | `~/.cache/deno` |
| Composer | `~/.cache/composer` |
| pip | `~/.cache/pip` |

Les paquets extraits de Yarn v1 sont élagués par entrées entières dans `~/.cache/yarn`. Les paquets installés globalement et les racines d’installation des gestionnaires de paquets sont distincts de ces caches.

## Caches des navigateurs et des applications

Les cibles courantes comprennent les caches de navigateur configurés, les unités de version de Gradle, les binaires de Cypress et Playwright, et le cache de l’observateur TypeScript. Un navigateur ou un outil de compilation peut devoir reconstruire ou retélécharger ce qui a été supprimé à sa prochaine utilisation. La distribution Gradle actuelle et la version actuelle d’Android Studio sont conservées par leurs propres règles ; une ancienne unité éligible est supprimée en entier pour ne pas laisser d’installation à moitié effacée.

Le mode vérifie le dernier accès et la dernière modification avant d’élaguer fichier par fichier. Un système de fichiers aux temps d’accès peu fiables empêche l’élagage par âge. `--purge-all` retire ce filtre d’âge et demande une décision à part.

## Données des outils de développement

L’analyse peut afficher des AVD Android, le cache pub de Flutter, les données utilisateur de Flatpak et d’autres racines volumineuses. **Qu’un chemin apparaisse dans l’analyse ne garantit pas que `--all-safe` le supprimera.** Lisez la page du mode et la sortie de la simulation pour voir ce que le mode choisi vise réellement. Les émulateurs Android et les applications Flatpak installées ne relèvent pas du cache courant.

## Extensions d’éditeurs

`--editor-ext` examine les versions d’extensions VS Code et Cursor remplacées. Il exige une version plus récente et une ancienne version inutilisée ; la version actuelle est conservée. Voir [Extensions d’éditeurs](../modes/editor-extensions.md).

## Fichiers de projets et personnels — en interactif uniquement

Les `node_modules` de projets délaissés, les téléchargements partiels et les gros fichiers personnels inutilisés candidats passent par des modes interactifs séparés. `--yes` n’autorise pas ces modes. Un téléchargement partiel ou un fichier dans `~/Downloads` peut être votre seule copie. Lisez chaque chemin et sa conséquence avant de confirmer.

## Nettoyage du système (sudo requis)

`--system` demande avant chacune de ses étapes apt, journal, Snap, `/tmp` et cache de pages. Ses commandes de paquets utilisent `apt` et `dpkg` ; elles ne s’adaptent ni à Fedora, ni à Arch, ni à openSUSE. L’étape du noyau liste les versions installées ; elle n’en supprime aucune directement. Le nettoyage du journal vise 100 MB, et l’ancienneté de `/tmp` est de 7 jours quel que soit `--days`. Vider le cache de pages agit sur la RAM, pas sur l’espace disque. Voir [Nettoyage du système](../modes/system-cleanup.md) et [Distributions prises en charge](../distro-support.md).

## Ce qu’il refuse de supprimer

La protection refuse la racine et les chemins protégés du dossier personnel tels que `~/Documents`, `~/Pictures`, `~/.ssh`, `~/.config` et `~/.claude`. La liste exacte et ses exceptions figurent dans [Chemins protégés](../reference/protected-paths.md). `--self-test` vérifie certains cas de refus dans la copie installée.

Une suppression réelle ne s’annule pas. [Prévisualiser avant de supprimer](./preview-first.md) explique l’ordre à suivre avant un nettoyage.
