---
title: Envoyer un rapport de bogue
description: "Comment signaler un bogue de linux-cleanup : créer un paquet de débogage, ce que contient un paquet de plantage, quoi vérifier avant l’envoi et où l’envoyer."
tags: [guide, bug-report, feedback, debug-bundle, crash, privacy]
sidebar_position: 3
---

# Envoyer un rapport de bogue

**Deux commandes produisent tout ce dont la personne qui maintient l’outil a besoin.** Rien n’est transmis automatiquement : vous examinez le paquet et vous l’envoyez vous-même.

```bash
linux-cleanup --debug-bundle    # rassemble le dernier journal et le dernier enregistrement
linux-cleanup --feedback        # instructions et brouillon mailto facultatif
```

## Le chemin rapide {#the-quick-path}

```bash
linux-cleanup --debug-bundle
```

Écrit `~/.linux-cleanup/feedback/debug-bundle-<timestamp>.tar.gz`, qui contient :

- Le dernier journal de session
- Le dernier enregistrement de session JSON, s’il existe
- Un `MANIFEST.txt` avec la distribution, le noyau, la version de bash et la sortie de l’autotest

Puis :

```bash
linux-cleanup --feedback
```

Indique quoi joindre et propose d’ouvrir un brouillon `mailto:` avec les informations système déjà remplies.

## Examiner le paquet avant de l’envoyer {#review-the-bundle-before-sending-it}

:::caution Un paquet contient des chemins de votre machine
Pas le contenu des fichiers, mais le journal nomme chaque chemin touché : des noms de dossiers, de projets, et parfois de fichiers de `~/Downloads`.

Examinez-le d’abord :

```bash
tar -tzf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz     # liste le contenu
tar -xzOf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz    # le lit en entier
```

Si quelque chose est sensible, extrayez le paquet, supprimez ou caviardez le fichier, puis réarchivez, ou envoyez simplement le manifeste et les lignes qui comptent.
:::

## Paquets de plantage {#crash-bundles}

Depuis la [1.3.0](../changelog.md#130--2026-05-10), une sortie inattendue avec un code non nul écrit automatiquement `crash-<timestamp>.tar.gz` dans le même dossier et en affiche le chemin.

Il contient le journal actif, l’enregistrement le plus récent et un manifeste système avec le code de sortie.

**Le paquet n’est pas envoyé.** La vérification des versions lit un fichier texte public, mais n’envoie ni paquet ni chemin local. Le paquet reste sur votre disque jusqu’à ce que vous décidiez de le partager ou non.

Aucun paquet de plantage n’est écrit pour les sorties attendues : `0`, `130` (`Ctrl-C`), `143` (SIGTERM) et `2` (erreur d’arguments) sont exclus. Voir [Codes de sortie](../reference/exit-codes.md#how-the-crash-trap-decides).

## Quoi joindre {#what-to-include}

Un bon rapport est court et précis :

| À joindre | Exemple |
|---|---|
| Distribution et version | `lsb_release -d` |
| Version de Bash | `bash --version \| head -1` |
| Version de l’outil | `linux-cleanup --version` |
| La commande exacte | `linux-cleanup --all-safe -y -d 30` |
| Attendu ou constaté | « je m’attendais à ce que le wrapper Gradle soit gardé, il a été supprimé » |
| Le paquet | Joignez le tar.gz |

La ligne la plus utile est **attendu ou constaté**. Un journal seul montre ce qui s’est passé, mais pas pourquoi vous pensez que c’était faux.

## Où l’envoyer {#where-to-send-it}

| Canal | Pour |
|---|---|
| [GitHub issues](https://github.com/aoneahsan/linux-cleanup/issues) | Bogues, demandes de fonctionnalités : le canal préféré, public |
| [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) | Tout ce que vous préférez ne pas publier |
| Une pull request | Vous avez un correctif. Sous licence MIT, forks bienvenus |

Les demandes de fonctionnalités décrites en quelques mots sont aussi bienvenues que du code. Dites ce que vous voudriez voir nettoyé et pourquoi les modes existants ne le couvrent pas.

## Bogues à signaler tout de suite {#bugs-worth-reporting-immediately}

Tout ce qui contredit le modèle de sécurité documenté :

- Une suppression dans un [chemin protégé](../reference/protected-paths.md)
- La version *actuelle* d’une extension d’éditeur supprimée, pas seulement une version remplacée
- Un fichier supprimé alors qu’il est plus récent que `--days`, sans `--purge-all`
- Un mode de données personnelles qui agit sans confirmation
- Une requête réseau qui envoie des chemins de nettoyage locaux ou des rapports

Chacun de ces cas est une violation du modèle de sécurité, pas un simple désagrément.

## Confidentialité : ce qui quitte votre machine {#privacy-what-leaves-your-machine}

:::note Vérification des versions et rapports locaux
Au démarrage, si elle est en ligne, linux-cleanup lit un registre public des versions en HTTPS. Elle n’envoie ni analyses, ni journaux, ni paquets de plantage. Installer ou mettre à jour une copie passe par npm ou GitHub.

Vérifiez-le sur un clone :

```bash
grep -rE 'curl|wget|http://|https://' cleanup.sh lib/ modules/ bin/
```

Lisez `modules/update_check.sh` pour voir la requête de versions et la commande proposée pour une copie plus récente.
:::

Journaux, enregistrements et paquets sont des fichiers locaux. La personne qui maintient l’outil ne peut pas les voir, ni envoyer un correctif sur votre machine : une nouvelle version vous parvient quand vous relancez `npx` ou mettez à jour.

## Ensuite {#next}

- [Dépannage](../troubleshooting.md) — à consulter d’abord
- [Récupération](../recovery.md) — si des données ont été perdues
- [Codes de sortie](../reference/exit-codes.md)
