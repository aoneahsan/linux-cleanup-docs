---
sidebar_position: 3
title: Simulation, exécution réelle, reçu
description: "Le premier lancement, puis le seul chemin que suit chaque nettoyage dans l’application de bureau : simulation, confirmation, exécution réelle, reçu."
---

# Simulation, exécution réelle, reçu

Chaque nettoyage dans l’application de bureau suit les quatre mêmes étapes, dans le même ordre. Aucune ne peut être sautée.

## Premier lancement {#first-launch}

À sa première ouverture, l’application affiche trois courtes étapes : ce qu’est l’application, quels dossiers la CLI refuse toujours, et un **Se connecter avec Google** facultatif. Chacune peut être passée et rouverte depuis **Aide**. Se connecter n’est jamais nécessaire pour nettoyer ; cela ajoute des exécutions réelles au mois et conserve le décompte des exécutions sur vos ordinateurs ([Comptes et formules](./accounts-and-plans.md)).

La connexion ouvre Google dans votre navigateur. Quand vous avez terminé, le navigateur renvoie le résultat à l’application via `127.0.0.1`, et la fenêtre de l’application reprend la main.

## 1. Simulation {#1-dry-run}

**Lancer une simulation** lance le nettoyage entièrement sûr avec `--dry-run`. Il ne supprime rien, nulle part. L’écran liste ensuite chaque chemin que le nettoyage supprimerait, sa taille mesurée et la raison, ainsi que chaque chemin que la CLI a refusé et conservé, avec le motif. **Enregistrer la liste en JSON** écrit cette liste dans un fichier sur cet ordinateur.

Dans l’application, un bouton à bordure pointillée est toujours une simulation. Un bouton plein supprime des fichiers.

## 2. Confirmation {#2-confirm}

**Vérifier et lancer** ouvre le seul écran qui lance une exécution réelle. Il reprend ce que la simulation a trouvé, indique combien d’exécutions réelles il reste à votre formule ce mois-ci et rappelle que la suppression est définitive. **Lancer le nettoyage maintenant** reste indisponible tant que :

- la simulation date de plus d’un jour (relancez-la d’abord) ;
- une autre exécution est encore en cours ;
- il ne reste plus d’exécution réelle ce mois-ci.

## 3. Exécution réelle {#3-real-run}

La CLI signale chaque chemin au moment de le supprimer, et l’écran suit. Elle revérifie chaque chemin avant de le supprimer, si bien que ce qui a changé depuis la simulation est jugé tel qu’il est maintenant. **Annuler après cet élément** s’arrête une fois l’étape en cours terminée ; ce qui a déjà été supprimé le reste.

## 4. Reçu {#4-receipt}

Chaque exécution se termine par un reçu, simulations comprises : espace libre avant et après, chaque étape marquée terminée, passée ou en échec, et la façon dont l’exécution s’est terminée. Une exécution annulée ou interrompue marque son étape inachevée comme en échec. Les reçus restent sur cet ordinateur dans **Reçus et historique**, à côté des rapports et journaux de la CLI dans `~/.linux-cleanup/`. Connecté à une formule avec synchronisation de l’historique, l’application envoie aussi les nombres du reçu, jamais un chemin ni un nom de fichier ([Ce qui quitte votre ordinateur](./overview.md#what-leaves-your-computer)).
