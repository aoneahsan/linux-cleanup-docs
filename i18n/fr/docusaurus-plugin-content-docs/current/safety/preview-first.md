---
title: Prévisualiser avant de supprimer
description: Une analyse en lecture seule et une simulation pour examiner les chemins de linux-cleanup avant une suppression définitive.
tags: [safety, dry-run, scan, preview, read-only]
sidebar_position: 2
---

# Prévisualiser avant de supprimer

**Commencez par `--scan`, puis lancez le mode de nettoyage avec `--dry-run`.** L’analyse montre les chemins et les tailles sans rien supprimer. Une simulation parcourt le nettoyage choisi et affiche les actions qu’elle effectuerait, sans supprimer de fichiers ni modifier de réglages. Les deux créent tout de même un journal de session local.

```bash
linux-cleanup --self-test
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

`--self-test` vérifie les dépendances, la syntaxe Bash et la protection des chemins. Arrêtez-vous s’il échoue.

## Que montre l’analyse ? {#what-does-the-scan-show}

`--scan` liste les racines de cache, les téléchargements partiels, les téléchargements probablement en double, les gros fichiers personnels inutilisés candidats et des observations sur le système. La taille indiquée pour une racine de cache correspond à **tout ce qui s’y trouve actuellement**, pas à ce qu’un nettoyage ultérieur supprimera. Le seuil d’inactivité par défaut de 100 jours, l’utilisation en cours et les règles propres à chaque mode peuvent en conserver la plus grande partie.

L’analyse ne crée pas de rapport de session JSON. Pour une analyse lisible par une machine, utilisez `linux-cleanup --scan --json-events`. Le flux d’événements peut contenir des chemins locaux complets ; gardez-le sur votre machine.

## Que montre une simulation ? {#what-does-a-dry-run-show}

`--dry-run` parcourt le nettoyage choisi et affiche les actions proposées. Par exemple :

```bash
linux-cleanup --all-safe --dry-run
linux-cleanup --all-safe --yes --dry-run --json-events > preview.ndjson
```

La première commande demande toujours une confirmation, comme une exécution réelle. La seconde est non interactive et écrit des événements JSON versionnés sur stdout ; le texte lisible va sur stderr. Aucune ne supprime de fichiers. Une simulation n’écrit pas de rapport de session JSON.

Une prévisualisation est un instantané de la machine, pas une promesse sur une exécution ultérieure. Entre la prévisualisation et la confirmation, des fichiers peuvent être utilisés, modifiés ou supprimés. L’outil n’a ni annulation ni sauvegarde.

## Vérifier le périmètre avant une exécution réelle {#check-the-boundary-before-a-real-run}

`--list-targets` affiche les racines cibles configurées et les chemins protégés sans mesurer le disque. Il aide à savoir si un dossier est concerné. La [référence des chemins protégés](../reference/protected-paths.md) décrit les règles de refus.

Les modes pour les fichiers personnels et ceux liés aux projets sont séparés du nettoyage courant des caches. Examinez leurs candidats un par un. `--yes` ne s’applique qu’à `--all-safe` ; il n’autorise pas la suppression de fichiers personnels.

Quand la prévisualisation correspond à votre intention, choisissez le mode voulu et lisez sa confirmation. Une suppression réelle est définitive.

## À lire ensuite {#read-next}

- [Ce qu’il supprime](./what-it-deletes.md)
- [Garde-fous](./guards.md)
- [Options de la CLI](../reference/cli-flags.md)
