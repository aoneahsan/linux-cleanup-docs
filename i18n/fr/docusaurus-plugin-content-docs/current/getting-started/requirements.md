---
title: Prérequis
description: Ce dont linux-cleanup a besoin pour fonctionner (bash 4+, GNU coreutils, Linux uniquement) et les dépendances facultatives qui activent l’export des rapports et le menu visuel.
tags: [requirements, dependencies, installation, jq, whiptail]
sidebar_position: 1
---

# Prérequis

**linux-cleanup fonctionne sous Linux avec `bash` 4 ou plus récent et GNU coreutils.** Tout le reste est facultatif, et l’outil s’en passe sans encombre s’il manque.

## Plateforme {#platform}

| | |
|---|---|
| **Système d’exploitation** | Linux uniquement. Le paquet npm déclare `"os": ["linux"]` et refusera de s’installer ailleurs |
| **Shell** | `bash` ≥ 4.0 |
| **Node.js** | ≥ 14 — **uniquement** pour `npx` et `npm install -g`. Inutile pour un git clone |
| **Droits** | S’exécute en utilisateur normal. Seul [`--system`](../modes/system-cleanup.md) demande `sudo` |

macOS et WSL méritent d’être distingués :

- **macOS n’est pas pris en charge.** Les chemins, les options de `find` et les gestionnaires de paquets diffèrent. Un outil cousin existe pour macOS ; n’utilisez pas celui-ci sur un Mac.
- **WSL fonctionne côté Linux.** Vérifiez avant un nettoyage tout lien symbolique de `$HOME` vers `/mnt/c/`. La [liste de chemins autorisés](../reference/protected-paths.md) résout les liens symboliques, mais ses chemins protégés du dossier personnel Linux n’impliquent pas que tous les dossiers Windows le soient.

## Commandes nécessaires {#required-commands}

Elles sont présentes sur pratiquement toutes les distributions courantes : `bash`, `find`, `du`, `df`, `rm`, `awk`, `sort`, `grep`, `sed`, `stat`, `realpath`.

`realpath` compte plus que les autres : c’est lui qui résout les liens symboliques avant la vérification des chemins protégés. Sur une image de conteneur minimale sans GNU coreutils, installez-les avant de lancer l’outil.

```bash
npx linux-cleanup --self-test
```

`--self-test` teste chaque commande nécessaire et nomme la première qui manque, avec une piste pour corriger. Lancez-le avant toute opération destructive.

## Dépendances facultatives {#optional-dependencies}

Chacune active une fonction. Sans elle, cette fonction est indisponible et le reste de l’outil n’est pas affecté.

| Dépendance | Active | Sans elle |
|---|---|---|
| `jq` | L’[export des rapports](../modes/reports.md) en Markdown / HTML | Les rapports JSON sont toujours écrits ; la conversion est indisponible |
| `whiptail` | Le [menu TUI](../modes/tui.md) visuel | `--tui` revient au menu de la CLI avec une indication d’installation |
| `dialog` | Solution de repli pour la TUI sans `whiptail` | Comme ci-dessus |
| `snap` | Nettoyage des révisions snap désactivées dans `--system` | Cette étape est simplement ignorée |
| `crontab` | L’[installateur cron hebdomadaire](../guides/alias-and-cron.md) | `--install-cron` ne peut pas s’exécuter |
| `numfmt` | Tailles en octets lisibles | Affichage des octets bruts |
| `xdg-open` | Ouverture des rapports HTML dans un navigateur | Ouvrez le fichier vous-même |
| `less` | Vue JSON paginée dans le gestionnaire de rapports | Lisez le fichier directement |
| `lsb_release` | Meilleure détection de la distribution dans les paquets de retour | Le paquet est tout de même généré |

### Installer les deux qui comptent {#installing-the-two-that-matter}

`jq` (export des rapports) et `whiptail` (menu visuel) sont les deux que la plupart des gens veulent.

```bash
# Debian / Ubuntu / Mint
sudo apt install jq whiptail

# Fedora / RHEL / Rocky
sudo dnf install jq newt

# Arch / Manjaro
sudo pacman -S jq libnewt

# openSUSE
sudo zypper install jq newt
```

Le binaire `whiptail` se trouve dans le paquet `newt` sur les distributions basées sur RPM et dans `libnewt` sur Arch.

## Distributions couvertes {#distro-coverage}

Le nettoyage des caches dans `$HOME`, qui représente l’essentiel de ce que libère cet outil, fonctionne de la même façon sur toutes les distributions Linux.

:::warning `--system` est réservé à Debian/Ubuntu
Le mode sudo appelle directement `apt` et `dpkg`, sans détection de la distribution ni garde-fou. Sous Fedora, Arch ou openSUSE, ses étapes de paquets échouent avec « command not found ».

Le détail complet de ce qui fonctionne où : [Distributions prises en charge](../distro-support.md).
:::

## Sortie sur le disque {#output-on-disk}

Chaque exécution peut écrire un journal local. Un parcours guidé peut aussi écrire un rapport JSON, et un paquet de débogage est créé sur demande ou après un échec inattendu. Leur taille dépend de l’exécution. Voir [Chemins de sortie](../reference/output-paths.md) pour l’organisation.

## Ensuite {#next}

- [Installation](./installation.md) — les trois façons d’installer
- [Démarrage rapide](./quick-start.md) — votre premier nettoyage
