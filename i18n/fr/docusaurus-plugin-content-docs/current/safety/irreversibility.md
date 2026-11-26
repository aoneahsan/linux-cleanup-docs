---
title: La suppression est définitive
description: linux-cleanup n’a ni annulation, ni corbeille, ni sauvegarde. Ce que cela veut dire en pratique, pourquoi il est conçu ainsi et quelles options il vous reste vraiment ensuite.
tags: [safety, irreversible, undo, data-loss, recovery]
sidebar_position: 4
---

# La suppression est définitive

**linux-cleanup appelle `rm -rf`. Il n’y a ni annulation, ni dossier corbeille, ni instantané, ni sauvegarde.**
Une fois un chemin supprimé, cet outil ne peut pas le récupérer, et aucune option ne le peut non plus.

:::danger À lire avant votre premier nettoyage réel
- Les fichiers supprimés ne vont **pas** dans une corbeille.
- Il n’y a pas de `--undo`, pas de commande de restauration, et aucune copie cachée conservée nulle part.
- Un journal local peut vous aider à retracer une exécution ; l’enregistrement d’un parcours guidé en résume les étapes. Aucun des deux n’est une sauvegarde fichier par fichier.
- Si un fichier était irremplaçable et que vous n’aviez pas de sauvegarde, il est perdu.

La sécurité de l’outil repose entièrement sur son [refus de supprimer ce qu’il ne faut pas](./guards.md) dès le départ.
:::

## Ce que « régénérable » promet vraiment

La plupart de ce que supprime cet outil est décrit comme régénérable. Ce mot a un sens précis, et il vaut la peine d’être exact sur ce qu’il implique et ce qu’il n’implique pas.

| Cela veut dire | Cela ne veut pas dire |
|---|---|
| Qu’un *autre* programme peut recréer les données | Que linux-cleanup peut les recréer |
| Que le prochain `yarn install` retélécharge le paquet | Que les octets sont encore quelque part sur le disque |
| Que le navigateur reconstruit son cache au fil de la navigation | Que la suppression est réversible |
| Que la recréation peut demander du réseau, du temps, ou les deux | Que la recréation est gratuite ou immédiate |

Le paquet de navigateurs de Playwright est régénérable, et le retélécharger prend plusieurs minutes et quelques centaines de mégaoctets. Une machine hors ligne ne peut pas le régénérer du tout. « Régénérable » dit d’où peuvent venir les données, pas à quel point il est commode de les récupérer.

## Les catégories vraiment irremplaçables

Trois cibles peuvent contenir des données non régénérables. Les trois sont [interactives uniquement](./guards.md#guard-3--personal-data-is-interactive-only), et les trois méritent une vraie attention au moment de répondre aux questions.

| Cible | Pourquoi rien ne peut la récupérer |
|---|---|
| **Fichiers personnels** dans `~/Downloads` ou des racines non protégées configurées | Aucune source d’où les récupérer. Si c’était la seule copie, c’était la copie. |
| **Téléchargements partiels** (`.crdownload`, `.part`, …) | Seule la session de navigateur d’origine peut les reprendre, et elle est généralement terminée depuis longtemps. |
| **Travail non validé dans un `node_modules` délaissé** | Rare, mais une dépendance modifiée sur place n’existe dans aucun registre. |

C’est la première qui fait perdre des données. `~/Downloads` n’est pas un chemin protégé (il ne *peut* pas l’être, puisque le nettoyer est une fonction centrale) : la seule chose entre un fichier qui s’y trouve et sa suppression, c’est votre lecture de la liste des candidats.

## Pourquoi il n’y a pas d’annulation

Les raisons de conception, sans détour :

1. **Un journal d’annulation multiplie les écritures sur le disque même que vous voulez libérer.** Conserver 20 GB pour en récupérer 20 ne sert à rien.
2. **Il donnerait une fausse confiance.** Un outil qui semble réversible invite à un usage négligent, et la réversibilité serait au mieux partielle : une annulation qui restaure 90 % des cas est la plus dangereuse dans les 10 % restants.
3. **La prévention vaut mieux que la récupération.** La [liste de chemins autorisés](./guards.md#guard-1--the-path-allowlist), le [seuil d’inactivité](./guards.md#guard-2--the-staleness-gate) et la confirmation interactive empêchent la mauvaise suppression d’avoir lieu, ce qui est strictement mieux que de l’annuler après coup.

C’est un compromis raisonnable pour des caches. C’est un compromis à comprendre avant de diriger l’outil vers `~/Downloads`.

## Ce qu’il vous reste réellement après

Si une suppression vous surprend, examinez les enregistrements locaux disponibles. Aucun n’est une sauvegarde.

| Élément | Emplacement | Contenu |
|---|---|---|
| Journal de session | `~/.linux-cleanup/logs/cleanup-<timestamp>.log` | La sortie lisible de l’exécution, sauf si le journal a été supprimé |
| Rapport JSON | `~/.linux-cleanup/reports/report-<timestamp>.json` | Le résumé des étapes du parcours guidé, sauf si les rapports ont été désactivés |

Ils aident à identifier le mode et les cibles choisies, mais ne listent pas chaque fichier supprimé. Ils ne contiennent rien du contenu supprimé.

Procédure complète : [Récupération](../recovery.md).

## Réduire le risque avant de lancer

```bash
# 1. Confirmer que les garde-fous fonctionnent sur cette installation
npx linux-cleanup --self-test

# 2. Voir ce qui serait libéré — ne supprime rien
npx linux-cleanup --scan

# 3. Lancer le parcours guidé, en répondant 'n' à tout ce dont vous n’êtes pas sûr
npx linux-cleanup
```

Au-delà :

- **Ayez une sauvegarde de tout ce qui est irremplaçable.** C’est vrai indépendamment de cet outil ; c’est la seule chose qui rend une suppression récupérable.
- **N’utilisez jamais les modes pour fichiers personnels sur une machine que vous n’avez pas examinée.** Lancez d’abord `--scan`.
- **Réservez `--all-safe -y` aux caches des machines auxquelles vous faites déjà confiance.** Il ne peut pas toucher aux fichiers personnels, mais il ne vous montre rien non plus avant d’avoir terminé.
- **Considérez `--purge-all` comme un outil d’avant réinstallation**, pas d’usage quotidien.

:::tip La seule habitude à prendre
Lancez `--scan` avant `--all-safe`, à chaque fois. Cela prend une minute, et c’est la seule étape qui vous montre le résultat tant qu’il est encore hypothétique.
:::

## Ensuite

- [Récupération](../recovery.md) — la marche à suivre après une suppression non voulue
- [Garde-fous](./guards.md) — ce qui empêche la suppression dès le départ
- [Prévisualiser avant de supprimer](./preview-first.md) — les modes en lecture seule
