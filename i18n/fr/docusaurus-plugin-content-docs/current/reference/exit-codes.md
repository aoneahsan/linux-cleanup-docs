---
title: Codes de sortie
description: Ce que signifie chaque code de sortie de linux-cleanup, lesquels créent automatiquement un paquet de plantage et comment s’en servir dans un script ou une tâche cron.
tags: [exit-codes, scripting, cron, crash-bundle, reference]
sidebar_position: 6
---

# Codes de sortie

**linux-cleanup suit la convention Unix : `0` signifie succès, tout le reste signale un problème.** Certains codes non nuls sont attendus et ne sont volontairement pas traités comme des plantages.

## Codes {#codes}

| Code | Signification | Paquet de plantage |
|---|---|---|
| `0` | Exécution propre. Chaque action demandée a été menée à bien ou refusée | Non |
| `1` | Échec générique : un invariant n’a pas été respecté. Rare | Oui |
| `2` | Erreur d’analyse des arguments. L’aide s’affiche | Non |
| `3` | Mise à jour exigée par le registre public des versions | Non |
| `127` | Commande introuvable : une dépendance nécessaire manque | Oui |
| `130` | Interrompu avec `Ctrl-C` (SIGINT) | Non |
| `137` | Tué par SIGKILL, en général par l’OOM killer ou `kill -9` | Oui |
| `139` | Erreur de segmentation. Ne devrait pas arriver en bash pur | Oui |
| `143` | Arrêté par SIGTERM | Non |
| tout autre code non nul | Échec interne inattendu | Oui |

Une option inconnue quitte avec `2` avant tout nettoyage. `--dry-run` est pris en charge : il parcourt le mode choisi sans supprimer de fichiers. Voir [Prévisualiser avant de supprimer](../safety/preview-first.md).

## Comment le piège de plantage décide {#how-the-crash-trap-decides}

Le piège EXIT ajouté en [1.3.0](../changelog.md#130--2026-05-10) évalue dans cet ordre :

1. Le code de sortie est `0`, **ou** le script a posé son indicateur interne de fin → pas de paquet
2. Le code de sortie est `130` (`Ctrl-C`) ou `143` (SIGTERM) → pas de paquet. Un arrêt voulu par l’utilisateur n’est pas un plantage
3. Le code de sortie est `2` (analyse des arguments) → pas de paquet. Le script a affiché l’aide et s’est arrêté volontairement
4. Tout le reste → écriture de `crash-<timestamp>.tar.gz` dans `~/.linux-cleanup/feedback/`

Le paquet contient le journal de session actif, l’enregistrement JSON le plus récent et un court manifeste du système. Il reste sur votre machine : **rien n’est transmis**. L’outil affiche le chemin pour que vous puissiez l’examiner et décider de l’envoyer par e-mail.

Voir [Envoyer un rapport de bogue](../guides/send-a-bug-report.md).

## Agir selon le code {#branching-on-the-code}

```bash
if linux-cleanup --scan; then
  echo "analyse réussie"
else
  case $? in
    2)   echo "option incorrecte" ;;
    127) echo "dépendance manquante : lancez --self-test" ;;
    130) echo "interrompu par l’utilisateur" ;;
    *)   echo "échec inattendu : voir ~/.linux-cleanup/feedback/" ;;
  esac
fi
```

## Dans cron {#in-cron}

```bash
linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1 || \
  echo "linux-cleanup exited $?" | mail -s "cleanup failed on $(hostname)" you@example.com
```

Un code `127` dans une tâche cron signifie presque toujours que la crontab utilise un nom de commande sans chemin et que le `PATH` minimal de cron ne l’a pas trouvé. Utilisez un chemin absolu ; voir [Dépannage](../troubleshooting.md#cron-entry-runs-but-does-nothing).

## Diagnostiquer un code inattendu à partir d’un paquet de plantage {#diagnosing-an-unexpected-code-from-a-crash-bundle}

Le manifeste du paquet consigne le code de sortie. Les plus courants :

| Code | Cause habituelle |
|---|---|
| `137` | L’OOM killer (mémoire épuisée). En général un `find` sur une arborescence énorme |
| `141` | SIGPIPE : un tube s’est fermé tôt, souvent à la sortie d’un `tee` ou d’un pager |
| `139` | Erreur de segmentation : ne devrait jamais arriver ici ; signalez-la |
| `127` | Dépendance manquante. Lancez `--self-test` pour l’identifier |

## Ensuite {#next}

- [Envoyer un rapport de bogue](../guides/send-a-bug-report.md)
- [Dépannage](../troubleshooting.md)
