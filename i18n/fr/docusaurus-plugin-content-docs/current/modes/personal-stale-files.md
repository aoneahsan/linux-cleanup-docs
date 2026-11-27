---
title: Fichiers personnels inutilisés
description: Le mode uniquement interactif qui trouve les gros fichiers inutilisés depuis longtemps dans ~/Downloads et les racines non protégées configurées.
sidebar_position: 9
---

# Fichiers personnels inutilisés

**`--stale` trouve, dans `~/Downloads` et les racines non protégées configurées, les fichiers de plus de 10 MB environ inutilisés depuis `--days` jours ou plus, et propose de les supprimer un par un.**

```bash
linux-cleanup --stale         # ou : -p
linux-cleanup --stale -d 180  # seulement les fichiers inutilisés depuis 180 jours ou plus
```

:::danger Les fichiers personnels peuvent être irremplaçables
`~/Downloads` et vos racines non protégées configurées contiennent ce que vous y avez mis, y compris parfois l’unique copie de quelque chose d’important.

L’outil ne sait pas distinguer un installateur que vous ne rouvrirez jamais d’un document dont vous n’avez pas encore eu besoin. Il n’essaie pas. **Lisez chaque candidat.**
:::

## Interactif par principe {#interactive-by-policy}

Une confirmation par fichier ou par plage est obligatoire. `--yes` est ignoré ici, et le restera, et ce mode ne fait pas partie de [`--all-safe`](./all-safe.md). Voir la [barrière 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

La liste complète des candidats s’affiche avant toute question : lancer le mode et tout refuser est donc une façon légitime d’examiner ces dossiers.

## Ce qui fait d’un fichier un candidat {#what-makes-a-file-a-candidate}

Trois conditions réunies :

1. Il se trouve dans une racine personnelle configurée, par défaut `~/Downloads` ; les racines protégées comme `~/Desktop` sont ignorées
2. Il dépasse environ 10 MB
3. Son `atime` et son `mtime` sont tous deux plus anciens que `--days` (100 par défaut)

Les racines personnelles se configurent avec `personal-roots.txt` dans `$XDG_CONFIG_HOME` (par défaut `~/.config`). Voir [Variables d’environnement](../reference/environment-variables.md).

:::note Pourquoi `~/Downloads` n’est pas sur la liste protégée
Il ne peut pas l’être : le nettoyer est toute la raison d’être de ce mode. La [liste de chemins autorisés](../safety/guards.md#guard-1--the-path-allowlist) protège `~/Documents`, `~/Pictures`, `~/Music` et `~/Videos` justement pour que le seul dossier qu’il atteint soit celui auquel vous vous attendez.

Si vous gardez des choses importantes dans `~/Downloads`, déplacez-les dans un endroit protégé : c’est la solution durable, et elle les protège de bien plus que de cet outil.
:::

## Lire la liste des candidats {#reading-the-candidate-list}

Chaque entrée indique le chemin, la taille et les jours d’inactivité. À regarder de plus près :

| Type | À considérer |
|---|---|
| Installateurs, ISO, `.deb`/`.AppImage` | En général sans risque : retéléchargeables |
| Tout ce que vous avez produit plutôt que téléchargé | À garder, ou à déplacer dans un endroit protégé |
| Livrables de clients ou de travail | À garder. Les téléchargements ne sont pas leur place |
| Médias sans source évidente | À examiner avant d’accepter |
| Archives jamais extraites | Vérifiez d’abord leur contenu |

## Un ordre plus sûr {#a-safer-sequence}

```bash
linux-cleanup --audit            # ce qui est vraiment gros dans $HOME
linux-cleanup --stale -d 365     # seulement les fichiers vraiment anciens
```

Commencer à 365 jours et descendre progressivement vous donne d’abord une liste courte et évidente. Une fois celle-ci réglée, baissez le seuil.

## Dans le parcours guidé {#in-the-walkthrough}

Étape 7 du [parcours guidé](./walkthrough.md). La passer avec `s` et la lancer à part plus tard, quand vous avez le temps de lire attentivement, est une bonne habitude.

## Ensuite {#next}

- [La suppression est définitive](../safety/irreversibility.md)
- [Téléchargements partiels](./partial-downloads.md) — le mode interactif voisin
- [Audit du dossier personnel](./home-audit.md) — trouvez d’abord ce qui est gros
