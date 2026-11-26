---
title: Audit du dossier personnel
description: "Une liste en lecture seule des 20 plus grosses entrées de votre dossier personnel, que linux-cleanup puisse les nettoyer ou non : le moyen le plus rapide de savoir ce qui occupe vraiment le disque."
tags: [audit, disk-usage, read-only, home, modes]
sidebar_position: 13
---

# Audit du dossier personnel

**`--audit` liste les 20 plus grosses entrées de `$HOME`, triées par taille.** Il ne supprime rien et ne se soucie pas de savoir si l’outil peut nettoyer ce qu’il trouve.

```bash
linux-cleanup --audit
```

## En quoi il diffère de `--scan` {#why-this-is-different-from---scan}

[`--scan`](./scan.md) mesure les catégories que linux-cleanup sait nettoyer. `--audit` mesure votre dossier personnel, point.

Cette différence est tout l’intérêt. Si c’est une image de machine virtuelle de 60 GB, un jeu de données téléchargé ou une bibliothèque Steam qui a rempli votre disque, `--scan` n’en parlera jamais et `--audit` la placera en tête de liste.

| | `--audit` | `--scan` |
|---|---|---|
| Portée | Tout `$HOME` | Seulement les catégories nettoyables |
| Répond à | Qu’est-ce qui occupe mon disque ? | Que peut libérer cet outil ? |
| Écrit un rapport de session JSON | Non | Non |
| Supprime | Jamais | Jamais |

## La démarche habituelle {#the-usual-workflow}

```bash
linux-cleanup --audit    # qu’est-ce qui est gros ?
linux-cleanup --scan     # que peut libérer cet outil ?
```

Si les premières entrées de l’audit apparaissent dans l’analyse, l’outil peut aider. Sinon, vous avez appris quelque chose de plus utile : l’espace se trouve là où cet outil ne va pas, et vous pouvez vous en occuper directement.

Gros éléments courants que linux-cleanup ne nettoiera **pas** :

- Images de machines virtuelles et stockage des conteneurs (`~/.local/share/libvirt`, `~/.local/share/docker`)
- Bibliothèques de jeux (Steam, Lutris)
- Jeux de données, poids de modèles, médiathèques
- Tout ce qui se trouve dans `~/Documents`, `~/Pictures`, `~/Music`, `~/Videos` : tous [protégés](../reference/protected-paths.md)

## Creuser un constat {#following-up-on-a-finding}

```bash
du -sh ~/.local/share/*      | sort -rh | head -20
du -sh ~/*                   | sort -rh | head -20
```

`--audit` est le premier passage rapide ; `du` affine une fois que vous savez où regarder.

## Ensuite {#next}

- [Analyse](./scan.md) — ce que l’outil peut libérer
- [Libérer le plus d’espace](../guides/reclaim-the-most-space.md)
