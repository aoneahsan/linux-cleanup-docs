---
sidebar_position: 3
title: Planifications
description: Simulations et nettoyages entièrement sûrs planifiés sous forme de minuteurs utilisateur systemd.
---

# Planifications

Les planifications font partie des formules Pro et Team. Une planification est une paire d’**unités utilisateur systemd** dans `~/.config/systemd/user/`, nommées `linux-cleanup-schedule-<id>.timer` et `.service`. Elle exécute soit une simulation, soit le nettoyage entièrement sûr, chaque jour, chaque semaine ou un jour du mois (de 1 à 28).

Le minuteur utilise `Persistent=true` : si l’ordinateur était éteint à l’heure prévue, l’exécution a lieu à la connexion suivante. Chaque exécution planifiée écrit son flux d’événements dans `~/.linux-cleanup/schedule-runs/`, et l’application le transforme en reçu la prochaine fois que vous l’ouvrez.

Comme les fichiers d’un AppImage disparaissent à la fermeture de l’application, une planification exécute une copie de la CLI embarquée dans `~/.linux-cleanup/desktop-engine/`. L’application rafraîchit cette copie à chaque démarrage, si bien qu’un minuteur exécute toujours la version livrée avec l’application.

Pour voir ou arrêter un minuteur depuis un terminal :

```bash
systemctl --user list-timers 'linux-cleanup-schedule-*'
systemctl --user disable --now linux-cleanup-schedule-<id>.timer
```
