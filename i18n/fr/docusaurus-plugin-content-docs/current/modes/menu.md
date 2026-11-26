---
title: Menu
description: Le menu numéroté qui permet de lancer une seule catégorie de linux-cleanup à la fois plutôt que tout le parcours guidé.
tags: [menu, interactive, modes]
sidebar_position: 4
---

# Menu

**`--menu` affiche une liste numérotée de toutes les catégories et lance celle que vous choisissez.** À utiliser quand vous savez ce que vous voulez et n’avez pas besoin du parcours en dix étapes.

```bash
linux-cleanup --menu     # ou : -m, -i, --interactive
```

## En quoi il diffère du parcours guidé {#how-it-differs-from-the-walkthrough}

| | Menu | [Parcours guidé](./walkthrough.md) |
|---|---|---|
| Ordre | Vous choisissez | Fixe, dix étapes |
| Portée | Une catégorie par choix | Tout, dans l’ordre |
| Boucle | Revient au menu ensuite | Va jusqu’au bout |
| Rapport | Par action | Un rapport de session |
| Idéal pour | Un nettoyage ciblé | Premières exécutions, nettoyages complets |

Le modèle de sécurité est identique. Chaque catégorie se comporte exactement comme dans le parcours guidé : la [liste de chemins autorisés](../safety/guards.md#guard-1--the-path-allowlist), le [seuil d’inactivité](../safety/guards.md#guard-2--the-staleness-gate) et la confirmation par cible s’appliquent tous. Choisir une catégorie de données personnelles dans le menu donne toujours une question par entrée, et `--yes` n’a toujours aucun effet dessus.

## Les options s’appliquent toujours {#options-still-apply}

```bash
linux-cleanup --menu -d 30        # seuil de 30 jours pour ce que vous choisissez
linux-cleanup --menu --purge-all  # seuil d’inactivité désactivé
linux-cleanup --menu --no-color   # sortie sans couleur
```

## Quand préférer la TUI {#when-to-use-the-tui-instead}

[`--tui`](./tui.md) est le même menu présenté dans une boîte whiptail ou dialog. Il faut que l’un des deux soit installé ; `--menu` n’a besoin de rien d’autre que bash et fonctionne sur n’importe quelle connexion, y compris un terminal rudimentaire ou une session `ssh -T` où une boîte plein écran se comporterait mal.

## Ensuite {#next}

- [TUI](./tui.md) — la version visuelle
- [Aperçu des modes](./overview.md) — toutes les catégories du menu
