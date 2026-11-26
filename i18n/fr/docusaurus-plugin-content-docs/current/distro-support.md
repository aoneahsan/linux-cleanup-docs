---
title: Distributions prises en charge
description: "Ce que fait linux-cleanup sur chaque distribution Linux : le nettoyage des caches fonctionne partout, mais le mode --system avec sudo ne vise que Debian et Ubuntu."
tags: [distro, ubuntu, debian, fedora, arch, opensuse, wsl, compatibility]
sidebar_position: 90
---

# Distributions prises en charge

**Le nettoyage des caches du dossier personnel est conçu pour les distributions Linux dotées des utilitaires GNU nécessaires.**
[`--system`](./modes/system-cleanup.md) utilise les commandes de paquets de Debian et d’Ubuntu. Vérifiez les outils installés avec `--self-test` avant de nettoyer.

## En résumé {#the-summary}

| Famille de distributions | Nettoyage des caches de `$HOME` | `--system` |
|---|---|---|
| Debian, Ubuntu, Mint, Pop!\_OS | Complet | **Complet** |
| Fedora, RHEL, Rocky, Alma | Avec les utilitaires nécessaires | À éviter : les étapes apt échouent |
| Arch, Manjaro, EndeavourOS | Avec les utilitaires nécessaires | À éviter : les étapes apt échouent |
| openSUSE | Avec les utilitaires nécessaires | À éviter : les étapes apt échouent |
| Alpine, conteneurs minimaux | Nécessite Bash et les utilitaires GNU | À éviter : les étapes apt échouent |
| WSL | Avec les utilitaires nécessaires | Debian/Ubuntu uniquement ; examinez d’abord les chemins montés |

:::warning `--system` ne détecte pas la distribution
Les étapes apt appellent directement `apt` et `dpkg`, sans garde `command -v` ni repli sur `dnf`, `pacman` ou `zypper`. Sur un système non Debian, chaque étape échoue avec "command not found".

Le mode ne s’arrête pas après un échec d’apt : les étapes suivantes peuvent encore s’exécuter. Évitez-le sur les autres distributions.

Certaines descriptions de cet outil affirment que `--system` gère plusieurs distributions à des degrés divers, avec `dnf` à la place d’`apt` et `paccache` sous Arch. **Ce code n’existe pas.** Vérifiez avec `grep -rn 'dnf\|pacman\|zypper' modules/system_sudo.sh` sur un clone : la commande ne renvoie rien.
:::

## Étape par étape {#step-by-step}

| Étape de `--system` | Debian/Ubuntu | Fedora/RHEL | Arch | openSUSE |
|---|---|---|---|---|
| `apt autoremove` + `apt clean` | Fonctionne | **Échoue** | **Échoue** | **Échoue** |
| `journalctl --vacuum-size=100M` | Fonctionne | Fonctionne | Fonctionne | Fonctionne |
| Révisions snap désactivées | Fonctionne | Si snap est installé | Si snap est installé | Si snap est installé |
| Liste des noyaux (`dpkg --list`) | Fonctionne | Silencieux — n’affiche rien | Silencieux | Silencieux |
| Fichiers de `/tmp` de plus de 7 jours | Fonctionne | Fonctionne | Fonctionne | Fonctionne |
| Vidage du cache de pages | Fonctionne | Fonctionne | Fonctionne | Fonctionne |

Les étapes du journal, de `/tmp` et du cache de pages reposent sur `journalctl`, `find` et `sysctl`, qui se comportent de la même façon partout où systemd est présent. L’étape des noyaux ne fait que lister de toute façon, donc son échec sur les systèmes sans dpkg ne coûte rien.

## Faire soi-même la partie paquets {#doing-the-package-part-yourself}

Sur un système non Debian, suivez les recommandations d’entretien de son propre gestionnaire de paquets. Les commandes ci-dessous sont des exemples à relire avant de les lancer :

```bash
# Fedora / RHEL / Rocky
sudo dnf autoremove
sudo dnf clean all

# Arch / Manjaro  (paccache se trouve dans pacman-contrib)
sudo pacman -Rns "$(pacman -Qtdq)"    # paquets orphelins, s’il y en a
sudo paccache -r                       # garde les 3 dernières versions
sudo pacman -Scc                       # vide tout le cache de paquets

# openSUSE
sudo zypper clean --all
sudo zypper packages --orphaned
```

Pour les caches du dossier personnel, prévisualisez ce que trouve linux-cleanup :

```bash
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

## Caches du dossier personnel {#home-cache-targets}

Les chemins du dossier personnel dépendent des outils installés, pas de la distribution. Ce qui est présent varie d’une machine à l’autre :

- Caches des gestionnaires de paquets — yarn, npm, pnpm, pip, composer, bun, deno
- Caches des navigateurs — Chrome, Firefox, Brave, Chromium, Edge, Vivaldi
- Caches des outils de compilation — Gradle, Cypress, Playwright, TypeScript
- Données des outils de développement — Android AVD, Flutter pub-cache, Dart, flatpak
- Extensions d’éditeurs — VS Code, Cursor
- `node_modules`, téléchargements partiels, fichiers personnels inutilisés
- Analyse, audit, contrôles de sécurité et journaux locaux

## Conteneurs minimaux {#minimal-containers}

Alpine et les autres images minimales fournissent en général BusyBox plutôt que GNU coreutils. L’outil a besoin de `find`, `du`, `stat` et surtout `realpath` de GNU — c’est lui qui résout les liens symboliques avant la [vérification des chemins protégés](./reference/protected-paths.md).

```bash
apk add coreutils findutils bash
linux-cleanup --self-test
```

`--self-test` nomme la première dépendance manquante. Ne lancez aucun mode qui supprime avant qu’il réussisse.

## WSL {#wsl}

L’outil s’exécute dans l’environnement Linux. Sa garde des chemins résout les liens symboliques, mais ne reconnaît pas les dossiers personnels Windows comme des dossiers Linux protégés. Examinez attentivement l’analyse et la simulation si vos dossiers personnels ou vos caches pointent vers `/mnt/`.

## macOS {#macos}

Non pris en charge. Le paquet npm déclare `"os": ["linux"]` et refusera de s’installer. Les chemins, les options de `find` et les gestionnaires de paquets sont tous différents.

## Ensuite {#next}

- [Nettoyage du système](./modes/system-cleanup.md) — le mode que cette page précise
- [Prérequis](./getting-started/requirements.md)
