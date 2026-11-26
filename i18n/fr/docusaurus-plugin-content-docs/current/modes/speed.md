---
title: Diagnostic de vitesse
description: Examiner la température, la pression et les tâches de démarrage de Linux, puis décider d’appliquer ou non chaque changement proposé.
tags: [speed, diagnosis, performance, startup, modes]
sidebar_position: 16
---

# Diagnostic de vitesse

**`--speed` indique où la machine passe son temps.** Il lit les compteurs thermiques, la pression processeur, mémoire et E/S, les processus gourmands et les informations de démarrage. Il peut aussi repérer les conteneurs, services et applications de session qui démarrent d’eux-mêmes.

```bash
linux-cleanup --speed --dry-run
linux-cleanup --speed
```

La simulation indique les changements sur lesquels il poserait la question, sans les appliquer. Une exécution normale demande séparément avant chaque changement proposé ; la réponse par défaut est Non. `--yes` n’autorise pas ces corrections.

Certaines corrections acceptées arrêtent un conteneur, désactivent un service ou modifient un réglage de session utilisateur. Elles ne suppriment aucun fichier de cache, mais changent ce qui démarre la fois suivante. La CLI affiche une commande d’annulation après un changement appliqué. Une demande sudo peut apparaître pour modifier un service système.

Un constat est une mesure ou un état, pas la preuve qu’une application précise est en faute. Lisez le processus ou le service nommé et décidez si vous en avez besoin avant d’accepter un changement.

Pour les commandes d’exécution manquantes au démarrage du shell, utilisez le mode [Doctor](./doctor.md), distinct. Pour l’espace disque, commencez par une [analyse](./scan.md).
