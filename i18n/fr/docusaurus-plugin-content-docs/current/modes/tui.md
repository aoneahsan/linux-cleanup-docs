---
title: TUI (menu visuel)
description: Le menu visuel piloté par whiptail ou dialog, ajouté dans linux-cleanup 1.3.0, avec repli sur le menu de la CLI si aucun des deux n’est installé.
sidebar_position: 5
---

# TUI (menu visuel)

**`--tui` affiche le menu des catégories dans une boîte whiptail ou dialog en plein écran.** Ajouté en [1.3.0](../changelog.md#130--2026-05-10). Même comportement que [`--menu`](./menu.md), présentation différente.

```bash
linux-cleanup --tui      # ou : -t, -g, --gui
```

## Comment il fonctionne {#how-it-behaves}

Choisir une entrée fait sortir de la boîte, lance la catégorie avec la sortie et les questions habituelles de la CLI, puis revient au menu. La boîte n’est donc qu’un lanceur : les vraies confirmations restent les questions texte habituelles, et tous les garde-fous sont inchangés.

La TUI comporte aussi une boîte **À propos** qui affiche la version, les coordonnées, la licence et l’engagement de confidentialité.

## Prérequis et solution de repli {#requirements-and-fallback}

Il faut `whiptail` ou `dialog`. Si aucun n’est présent, l’outil affiche une indication d’installation propre à la distribution et revient au menu habituel de la CLI : il n’échoue pas.

```bash
sudo apt install whiptail     # Debian / Ubuntu
sudo dnf install newt         # Fedora / RHEL
sudo pacman -S libnewt        # Arch
```

`whiptail` est fourni dans les paquets `newt` / `libnewt` sur les systèmes RPM et Arch, d’où un nom de paquet différent du nom de la commande.

:::note C’est le seul endroit où l’outil détecte votre distribution
L’indication d’installation ci-dessus tient compte de la distribution. Rien d’autre dans linux-cleanup ne le fait : en particulier, [`--system` suppose Debian/Ubuntu](../distro-support.md).
:::

## Quand utiliser le menu texte {#when-to-use-the-plain-menu}

`--tui` demande un terminal capable d’afficher une boîte plein écran. Sur une connexion limitée, dans un journal de CI ou dans une session `ssh -T` sans TTY, utilisez [`--menu`](./menu.md) : il n’a besoin que de bash.

## Ensuite {#next}

- [Menu](./menu.md) — l’équivalent texte
- [Aperçu des modes](./overview.md)
