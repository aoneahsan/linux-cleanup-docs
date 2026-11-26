---
title: Extensions d’éditeurs
description: Supprimer les versions remplacées d’extensions VS Code et Cursor (les anciennes copies laissées après une mise à jour), sous réserve d’une vérification de remplacement et du seuil d’inactivité.
tags: [vscode, cursor, extensions, editor, modes]
sidebar_position: 11
---

# Extensions d’éditeurs

**`--editor-ext` supprime les versions remplacées d’extensions VS Code et Cursor.** Quand une extension se met à jour, le dossier de l’ancienne version reste souvent sur le disque. Sur une machine avec beaucoup d’extensions et quelques années de mises à jour, cela finit par peser des centaines de mégaoctets.

```bash
linux-cleanup --editor-ext
```

## Les deux conditions {#the-two-conditions}

Un dossier de version n’est candidat que si les **deux** conditions sont remplies :

1. **Une version plus récente de la même extension existe** : la version actuelle n’est jamais candidate
2. **Cette ancienne version est inutilisée depuis `--days` jours ou plus** (100 par défaut)

La seconde condition a été ajoutée en [1.2.1](../changelog.md#121--2026-05-10). Avant, le simple remplacement suffisait, ce qui supprimait d’anciennes versions chargées récemment. La sortie indique les jours d’inactivité de chaque version, pour que vous voyiez pourquoi quelque chose a été conservé.

## Ce qu’il ne touche pas {#what-it-does-not-touch}

- La version actuelle de toute extension
- Les réglages, raccourcis clavier ou l’état de l’espace de travail des extensions
- Tout ce qui se trouve dans `~/.config` : toute cette arborescence est [protégée](../reference/protected-paths.md)
- Les extensions d’éditeurs autres que VS Code et Cursor

## Après l’exécution {#after-running-it}

Si VS Code affiche un bandeau d’extension manquante, rechargez la fenêtre : `Ctrl+Shift+P` → **Developer: Reload Window**. L’éditeur garde une référence à un dossier qui n’existe plus.

Si une extension a vraiment disparu (ce qui voudrait dire que la détection de la « version la plus récente » s’est trompée sur la version actuelle), réinstallez-la et merci de [signaler le bogue](../guides/send-a-bug-report.md) :

```bash
code --install-extension <publisher>.<name>
```

## Gain attendu {#expected-reclaim}

La taille dépend des versions remplacées installées sur cette machine. Utilisez une analyse pour examiner le dossier actuel avant de décider de le nettoyer.

## Dans le parcours guidé et le mode entièrement sûr {#in-the-walkthrough-and-all-safe}

S’exécute à l’étape 4 du [parcours guidé](./walkthrough.md) et fait partie de [`--all-safe`](./all-safe.md), puisqu’il ne supprime que des copies remplacées et régénérables.

## Ensuite {#next}

- [Le seuil d’inactivité](../safety/guards.md#guard-2--the-staleness-gate)
- [Aperçu des modes](./overview.md)
