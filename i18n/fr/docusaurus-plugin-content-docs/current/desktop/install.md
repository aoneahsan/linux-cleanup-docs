---
sidebar_position: 2
title: Installer et mettre à jour
description: Installer l’application de bureau linux-cleanup en AppImage ou en .deb, et comment elle se met à jour toute seule.
---

# Installer et mettre à jour

Téléchargez la version actuelle depuis la [page de téléchargement](https://linux-cleanup.aoneahsan.com/download) ; chaque version est aussi sur [GitHub Releases](https://github.com/aoneahsan/linux-cleanup/releases) sous une étiquette `desktop-v<version>`. Chaque version fournit deux installateurs :

| Fichier | Pour |
|---|---|
| `linux-cleanup_<version>_amd64.AppImage` | Toute distribution avec une session de bureau. Rendez-le exécutable, puis lancez-le |
| `linux-cleanup_<version>_amd64.deb` | Debian, Ubuntu et leurs dérivées (`sudo apt install ./linux-cleanup_<version>_amd64.deb`) |

```bash
chmod +x linux-cleanup_*_amd64.AppImage
./linux-cleanup_*_amd64.AppImage
```

Depuis la version 1.0.4, l’AppImage s’ajoute au menu des applications lors de sa première exécution : il écrit `~/.local/share/applications/linux-cleanup-desktop.desktop` et son icône sous `~/.local/share/icons/hicolor/`, et fait pointer l’entrée vers l’endroit où se trouve le fichier. Si vous déplacez l’AppImage, lancez-le une fois depuis son nouvel emplacement et l’entrée suit. Le `.deb` installe sa propre entrée de menu.

L’application de bureau a besoin de WebKitGTK 4.1 et de GTK 3, fournis par les distributions de bureau actuelles. Le `.deb` les déclare comme dépendances.

## Comment elle se met à jour {#how-it-updates}

L’application se met à jour toute seule. Elle cherche une mise à jour signée au démarrage, quand sa fenêtre redevient visible et dès qu’une nouvelle version est publiée. Avec **Installer les mises à jour automatiquement** activé (par défaut), elle télécharge la mise à jour, vérifie sa signature et redémarre à un moment calme : jamais pendant une exécution.

Un **AppImage** est remplacé sur place. Une installation **`.deb`** se met à jour via `dpkg`, donc votre bureau demande d’abord un mot de passe administrateur (la fenêtre graphique habituelle) ; l’annuler laisse tourner la version actuelle.

Une version peut aussi être marquée **obligatoire** :

- une version **urgente** arrête l’application immédiatement, en donne la raison et propose un seul bouton **Mettre à jour** ;
- une version **normale** signale qu’une nouvelle version est sortie, et devient obligatoire au démarrage suivant.

Si l’application est hors ligne au moment de vérifier, elle continue ; une vérification qui échoue ne bloque jamais une exécution.
