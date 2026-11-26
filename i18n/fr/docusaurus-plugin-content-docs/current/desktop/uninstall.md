---
sidebar_position: 7
title: Désinstaller
description: Retirer l’application de bureau, ses planifications et ce qu’elle conserve sur votre ordinateur.
---

# Désinstaller

## Retirez d’abord les planifications {#remove-the-schedules-first}

Les planifications sont des minuteurs utilisateur systemd, et elles exécutent une copie de la CLI en dehors de l’application. Retirer l’application ne les retire **pas**. Supprimez chacune d’elles depuis l’écran **Planifications** avant de désinstaller, ou depuis un terminal :

```bash
systemctl --user disable --now 'linux-cleanup-schedule-*.timer'
rm -f ~/.config/systemd/user/linux-cleanup-schedule-*.{timer,service}
systemctl --user daemon-reload
```

## Retirer l’application {#remove-the-app}

| Installée en | Se retire avec |
|---|---|
| AppImage | Supprimez le fichier `.AppImage`, puis son entrée de menu: `rm ~/.local/share/applications/linux-cleanup-desktop.desktop ~/.local/share/icons/hicolor/*/apps/linux-cleanup-desktop.png` |
| `.deb` | `sudo apt remove linux-cleanup` |

## Ce qui reste {#what-stays-behind}

| Dossier | Contenu | À supprimer si |
|---|---|---|
| `~/.linux-cleanup/` | Rapports, journaux, flux des exécutions planifiées et copie de la CLI pour les planifications. La CLI du terminal utilise le même dossier | Vous n’utilisez plus la CLI non plus |
| `~/.local/share/com.aoneahsan.linuxcleanup/` | Les réglages de l’application, les reçus et l’identifiant aléatoire de cet ordinateur | Toujours sans risque après la désinstallation |

Un compte connecté continue d’exister après le départ de l’application. Supprimez-le depuis **Compte** avant de désinstaller ; la suppression retire le compte et ses nombres synchronisés du serveur.
