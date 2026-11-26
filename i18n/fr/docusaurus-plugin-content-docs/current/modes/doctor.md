---
title: Doctor
description: Détecter les environnements d’exécution installés sur le disque mais absents de l’initialisation du shell (nvm, pnpm, bun, deno, cargo) et ajouter le bloc d’initialisation standard après confirmation. Ajout uniquement.
tags: [doctor, repair, shell, bashrc, nvm, pnpm, bun, deno, cargo, modes]
sidebar_position: 14
---

# Doctor

**`--doctor` trouve les environnements d’exécution présents sur le disque mais non reliés à la configuration de votre shell, et propose d’ajouter le bloc d’initialisation manquant.** Ajouté en [1.1.0](../changelog.md#110--2026-05-10).

```bash
linux-cleanup --doctor
```

C’est le mode à utiliser face à `pnpm: command not found` quand vous savez très bien avoir installé pnpm.

## Ajout uniquement {#additive-only}

:::note Doctor ne supprime ni ne modifie jamais une ligne existante
Il **ajoute** un bloc d’initialisation standard, et seulement après votre confirmation. Il ne modifie, ne réordonne ni ne supprime rien de ce qui figure déjà dans la configuration de votre shell.

Les fichiers d’initialisation du shell sont en plus protégés au niveau de la suppression : `safe_rm` refuse tout chemin dont le nom de fichier est `.bashrc`, `.zshrc`, `.profile`, `.bash_aliases` ou apparenté, où qu’il se trouve. Voir [Chemins protégés](../reference/protected-paths.md#protected-basenames).
:::

## Ce qu’il vérifie {#what-it-checks}

| Environnement | Détecte | Ajoute |
|---|---|---|
| `nvm` | `~/.nvm` présent, sans initialisation de `NVM_DIR` | Le bloc de chargement standard de nvm |
| `pnpm` | `~/.local/share/pnpm` présent, absent du `PATH` | L’export de `PNPM_HOME` et l’ajout au `PATH` |
| `bun` | `~/.bun` présent, absent du `PATH` | Le bloc d’initialisation de Bun |
| `deno` | `~/.deno` présent, absent du `PATH` | L’ajout de Deno au `PATH` |
| `cargo` | `~/.cargo` présent, absent du `PATH` | `. "$HOME/.cargo/env"` |

## Comment cela arrive d’habitude {#how-this-usually-happens}

Un installateur écrit son bloc d’initialisation dans un fichier que votre shell ne lit pas. `~/.profile` n’est lu que par les shells de connexion ; `~/.bash_profile`, s’il existe, le masque ; une modification de `~/.bashrc` n’atteint jamais une session `zsh`. L’environnement s’installe correctement, puis semble disparaître.

Cela arrive aussi après avoir déplacé un dépôt de dotfiles d’une machine à l’autre, ou changé de shell de connexion.

## Ensuite {#afterwards}

Rechargez votre shell, sinon la modification semblera ne pas avoir marché :

```bash
source ~/.bashrc     # ou ~/.zshrc
```

Puis vérifiez :

```bash
command -v pnpm && pnpm --version
```

## Son lien avec l’audit des paquets globaux {#its-relationship-to-the-globals-audit}

[`--globals`](./globals-audit.md) fonctionne même quand un gestionnaire de paquets manque dans le `PATH`, en se rabattant sur l’inspection du système de fichiers. Si l’audit liste des paquets globaux pnpm mais que `pnpm` lui-même est introuvable, `--doctor` est la solution.

## Ensuite {#next}

- [Audit des paquets globaux](./globals-audit.md)
- [Dépannage](../troubleshooting.md)
