---
title: Alias shell et cron hebdomadaire
description: Installer un alias shell cleanup et une exécution automatique hebdomadaire entièrement sûre, ce que chacun écrit et comment les retirer.
sidebar_position: 2
---

# Alias shell et cron hebdomadaire

**Deux aides de configuration à usage unique : un alias shell `cleanup` et une exécution automatique chaque semaine.** Les deux se défont avec l’option de désinstallation correspondante.

```bash
linux-cleanup --install-alias
linux-cleanup --install-cron
```

## L’alias shell {#the-shell-alias}

```bash
linux-cleanup --install-alias
```

Ajoute un alias `cleanup` à `~/.bash_aliases` ou à `~/.zshrc`, selon votre shell. Ensuite, taper `cleanup` n’importe où lance l’outil.

Rechargez votre shell, sinon l’alias semblera ne pas exister :

```bash
source ~/.bashrc     # ou ~/.zshrc
```

Retirez-le avec `linux-cleanup --uninstall-alias`.

:::note Les fichiers d’initialisation du shell sont protégés au niveau de la suppression
`.bashrc`, `.zshrc`, `.bash_aliases` et apparentés figurent sur la [liste des noms de fichiers protégés](../reference/protected-paths.md#protected-basenames) : aucun mode de nettoyage ne peut jamais en supprimer un, quel que soit son chemin. L’installateur de l’alias ajoute une ligne ; le désinstallateur ne retire que la sienne.
:::

## La tâche cron hebdomadaire {#the-weekly-cron-job}

```bash
linux-cleanup --install-cron
```

Programme `--all-safe -y` **le dimanche à 03:00**, en ajoutant la sortie à `~/.linux-cleanup/logs/cron.log`. Nécessite `crontab`.

Retirez-la avec `linux-cleanup --uninstall-cron`.

### Pourquoi `--all-safe` est le bon mode pour cela {#why---all-safe-is-the-right-mode-for-this}

C’est le seul mode auquel `--yes` s’applique, et il **ne peut pas toucher aux données personnelles** : les modes uniquement interactifs n’en font pas partie et ignorent `--yes` par conception. Une exécution sans surveillance peut donc vider des caches, sans jamais pouvoir supprimer un fichier de `~/Downloads`. Voir la [barrière 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

Le [seuil d’inactivité](../safety/guards.md#guard-2--the-staleness-gate) s’applique toujours, si bien que les fichiers utilisés récemment survivent à chaque passage hebdomadaire.

## Écrire soi-même l’entrée de la crontab {#writing-the-crontab-entry-yourself}

Pour un autre horaire ou d’autres options :

```bash
crontab -e
```

```bash
0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1
```

:::danger Utilisez un chemin absolu
cron s’exécute avec un `PATH` minimal, en général juste `/usr/bin:/bin`. Un `linux-cleanup` sans chemin ne sera pas trouvé s’il se trouve dans `~/.local/bin` ou dans un dossier de gestionnaire de versions Node, et la tâche échouera sans bruit chaque semaine.

C’est le problème le plus fréquent des exécutions planifiées. Trouvez votre chemin avec :

```bash
command -v linux-cleanup
```

Ou définissez `PATH=` explicitement en tête de la crontab.
:::

| Option | Pourquoi dans cron |
|---|---|
| `--all-safe -y` | Sans surveillance, caches uniquement |
| `--no-report` | Empêche les enregistrements JSON de s’accumuler : ils ne sont **jamais** supprimés automatiquement |
| `--cleanup-logs` | Supprime le journal de cette exécution à la fin |
| `-d 30` | Facultatif : élagage hebdomadaire plus agressif |

`--cleanup-logs` seul ne suffit pas à garder le dossier léger : il ne touche jamais aux enregistrements. C’est `--no-report` qui le fait.

:::caution N’ajoutez pas `--purge-all` à une tâche planifiée
Sans surveillance et sans seuil d’inactivité, un élément coûteux peut disparaître la semaine précédant le moment où vous en avez besoin, sans que personne ne s’en aperçoive. Réservez `--purge-all` aux exécutions délibérées et surveillées. Voir [Libérer le plus d’espace](./reclaim-the-most-space.md).
:::

## Vérifier qu’elle a tourné {#checking-that-it-ran}

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

Si le journal affiche `command not found`, c’est le problème de `PATH` décrit plus haut. Si le journal est vide, la tâche ne s’est jamais déclenchée : vérifiez que le démon cron tourne (`systemctl status cron` ou `crond`).

Le journal cron n’est **jamais** renouvelé automatiquement. Faites-le vous-même quand il grossit :

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## Un minuteur systemd à la place {#a-systemd-timer-instead}

Si vous préférez les minuteurs à cron, rien n’est propre à l’outil : programmez la même commande. L’outil ne sait pas et ne se soucie pas de savoir quel planificateur l’a lancé, et `--install-cron` est une commodité, pas une obligation.

## Retirer les deux {#removing-both}

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

Suppression complète, paquet compris : [Désinstaller](./uninstall.md).
