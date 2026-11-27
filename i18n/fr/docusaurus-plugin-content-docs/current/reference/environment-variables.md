---
title: Variables d’environnement
description: "Toutes les variables d’environnement que lit linux-cleanup, avec leur valeur par défaut et leur effet : dossiers de sortie, couleur et recherche de la configuration XDG."
sidebar_position: 4
---

# Variables d’environnement

**Toutes les variables d’environnement que lit linux-cleanup.** Toutes sont facultatives.

| Variable | Par défaut | Effet |
|---|---|---|
| `NO_COLOR` | non définie | Toute valeur non vide désactive la couleur ANSI. La norme commune à de nombreux outils, de [no-color.org](https://no-color.org). Comme `--no-color` |
| `CLEANUP_NO_COLOR` | `0` | Interrupteur de couleur propre à linux-cleanup. Mettez `1` pour couper la couleur ici seulement |
| `LINUX_CLEANUP_LOG_DIR` | `~/.linux-cleanup/logs/` (npx / npm) ou `<repo>/logs/` (clone) | Où vont les journaux de session. Créé s’il manque |
| `LINUX_CLEANUP_REPORTS_DIR` | `~/.linux-cleanup/reports/` ou `<repo>/reports/` | Où vont les enregistrements de session JSON. Créé s’il manque |
| `LINUX_CLEANUP_DATA_HOME` | non définie — se rabat sur le parent du dossier des journaux | Parent commun de `logs/`, `reports/` et `feedback/` |
| `LINUX_CLEANUP_NPX` | non définie | **Interne.** Le lanceur Node la met à `1`. Ne la définissez pas vous-même |
| `LINUX_CLEANUP_LAUNCHER` | non définie | **Interne.** Le lanceur Node met `node` ; l’application de bureau met `desktop`, ce qui saute la vérification de mise à jour de la CLI, car l’application fait la sienne (depuis 2.1.0). Ne la définissez pas vous-même |
| `XDG_CONFIG_HOME` | `~/.config` | Où sont cherchés `personal-roots.txt` et `project-roots.txt` |

## Rediriger toute la sortie {#redirecting-all-output}

`LINUX_CLEANUP_DATA_HOME` est le seul levier qui déplace tout — journaux, enregistrements et paquets de retour :

```bash
export LINUX_CLEANUP_DATA_HOME="/mnt/secure/linux-cleanup"
linux-cleanup --scan
```

:::caution Le dossier est créé, pas le point de montage
L’outil crée `logs/`, `reports/` et `feedback/` sous le chemin indiqué. Il **ne** crée **pas** et ne vérifie pas le point de montage sous-jacent. Pointez-le vers un chemin non monté et la sortie atterrit sur le système de fichiers sous-jacent, sans bruit.

Vérifiez que la cible est montée et accessible en écriture avant de vous y fier.
:::

Pour un contrôle plus fin, `LINUX_CLEANUP_LOG_DIR` et `LINUX_CLEANUP_REPORTS_DIR` se remplacent séparément et l’emportent sur la racine de données.

## Contrôle de la couleur {#colour-control}

```bash
export NO_COLOR=1          # tout sur cette machine, tous les outils
export CLEANUP_NO_COLOR=1  # linux-cleanup seulement
linux-cleanup --no-color   # cet appel seulement
```

`CLEANUP_NO_COLOR` sert quand vous voulez de la couleur dans tous les autres outils et une sortie brute dans celui-ci — en général quand vous redirigez sa sortie vers quelque chose qui abîme les séquences d’échappement.

## Configurer les racines analysées {#configuring-the-scanned-roots}

Deux fichiers sous `$XDG_CONFIG_HOME` (par défaut `~/.config`) décident des dossiers que parcourent les analyses des fichiers personnels et des projets :

| Fichier | Utilisé par | Racines par défaut |
|---|---|---|
| `personal-roots.txt` | [`--stale`](../modes/personal-stale-files.md) | `~/Downloads` ; les racines protégées comme `~/Desktop` sont ignorées |
| `project-roots.txt` | [`--node-modules`](../modes/node-modules-finder.md) | Vos dossiers de projets |

Un chemin par ligne. Cela suit la [spécification XDG Base Directory](https://specifications.freedesktop.org/basedir-spec/), donc définir `XDG_CONFIG_HOME` déplace les deux.

:::danger Ajouter une racine à `personal-roots.txt` élargit ce qui peut être supprimé
L’analyse des fichiers personnels est [interactive uniquement](../safety/guards.md#guard-3--personal-data-is-interactive-only), donc rien n’est supprimé sans votre confirmation fichier par fichier — mais une racine ajoutée est un dossier dont le contenu va apparaître dans les listes de candidats.

La [liste des chemins autorisés](./protected-paths.md) s’applique toujours et l’emporte toujours : ajouter `~/Documents` ici ne le rend pas supprimable.
:::

## Pour la CI et les scripts {#for-ci-and-scripts}

```bash
NO_COLOR=1 linux-cleanup --scan > /tmp/scan.log
```

L’analyse seule ne crée pas le rapport de session JSON du parcours guidé. Vérifiez le [code de sortie](./exit-codes.md) dans vos scripts, ou utilisez [`--json-events`](./json-events.md) pour une sortie structurée.

## Ce qu’il ne lit pas {#what-it-does-not-read}

- `PATH`, sauf pour savoir quels outils facultatifs sont installés
- `USER` et `LOGNAME`, sauf pour annoter l’en-tête du journal
- L’historique, les alias ou la configuration de votre shell — [`--doctor`](../modes/doctor.md) est le seul mode qui lit les fichiers d’initialisation du shell, et seulement pour vérifier qu’un environnement d’exécution y est branché
- Aucune configuration distante ou fournie par le réseau. Il n’y en a pas

Si `$HOME` n’est pas défini, le script s’arrête aussitôt au lieu de deviner. Voir [Dépannage](../troubleshooting.md#home-is-not-set).

## Ensuite {#next}

- [Chemins de sortie](./output-paths.md) — où les fichiers atterrissent vraiment
- [Options de la CLI](./cli-flags.md)
