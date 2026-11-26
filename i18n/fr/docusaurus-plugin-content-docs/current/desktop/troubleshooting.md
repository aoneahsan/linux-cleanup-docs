---
sidebar_position: 6
title: Dépannage de l’application
description: L’AppImage ne démarre pas, la connexion n’aboutit pas, le serveur de comptes est injoignable ou une planification ne s’est pas exécutée.
---

# Dépannage de l’application

L’écran **Aide › Erreurs et hors ligne** de l’application couvre les mêmes cas, avec un bouton pour chacun. Cette page en est la version détaillée.

## L’AppImage ne s’ouvre pas {#the-appimage-does-not-open}

- **Rien ne se passe au double-clic.** Le fichier doit être exécutable : `chmod +x linux-cleanup_*_amd64.AppImage`.
- **Une erreur mentionne FUSE.** Les AppImage se montent avec FUSE 2. Ubuntu 22.04 et suivants ne l’installent pas par défaut : `sudo apt install libfuse2` (sous Ubuntu 24.04, `libfuse2t64`). Sans lui, l’AppImage peut aussi se lancer avec `./linux-cleanup_*_amd64.AppImage --appimage-extract-and-run`.
- **Une erreur mentionne WebKitGTK ou `libwebkit2gtk-4.1`.** La fenêtre a besoin de WebKitGTK 4.1 fourni par votre distribution. Sous Debian et Ubuntu, le `.deb` l’installe ; avec l’AppImage, installez `libwebkit2gtk-4.1-0`.

## L’application signale que la CLI embarquée manque {#the-app-says-the-bundled-cli-is-missing}

L’application vérifie sa propre copie de `cleanup.sh` au démarrage. Si cette vérification échoue, l’installation est endommagée : retéléchargez la version depuis la [page de téléchargement](https://linux-cleanup.aoneahsan.com/download). Une réinstallation ne touche ni à vos reçus, ni à vos rapports, ni à vos journaux.

## La connexion n’aboutit pas {#sign-in-does-not-finish}

La connexion se fait dans votre navigateur et revient à l’application via `127.0.0.1`. Si le navigateur affiche le résultat mais que l’application ne passe pas à la suite, un pare-feu ou une extension du navigateur bloque peut-être les adresses locales. Une connexion qui échoue ne change rien ; vous pouvez appuyer de nouveau sur **Se connecter avec Google**.

## Le serveur de comptes ne répond pas {#the-account-server-does-not-answer}

Les simulations, exécutions réelles, reçus et planifications n’ont jamais besoin d’internet. Hors ligne, l’application continue de décompter les exécutions réelles sur le quota mensuel de cet ordinateur et synchronise quand le serveur répond à nouveau. Seuls les changements de formule et l’historique synchronisé attendent.

## Une planification ne s’est pas exécutée {#a-schedule-did-not-run}

```bash
systemctl --user list-timers 'linux-cleanup-schedule-*'
journalctl --user -u 'linux-cleanup-schedule-*' --since today
```

Un minuteur ne se déclenche que pendant que vous êtes connecté ; une exécution manquée pendant que l’ordinateur était éteint a lieu à la connexion suivante. Chaque exécution qui a bien démarré laisse son flux dans `~/.linux-cleanup/schedule-runs/`, et l’application le transforme en reçu à votre prochaine ouverture.
