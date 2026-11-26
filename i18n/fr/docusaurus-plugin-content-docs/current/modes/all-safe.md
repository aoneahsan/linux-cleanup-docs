---
title: Entièrement sûr (par lot)
description: Nettoyer en une seule passe tous les caches régénérables. Le mode conçu pour cron et la maintenance sans surveillance, et le seul auquel --yes s’applique.
tags: [all-safe, batch, cron, unattended, yes, modes]
sidebar_position: 6
---

# Entièrement sûr (par lot)

**`--all-safe` nettoie en une seule passe tous les caches régénérables.** C’est le mode de la maintenance sans surveillance, et le seul auquel `--yes` s’applique.

```bash
linux-cleanup --all-safe        # une seule confirmation pour le lot
linux-cleanup --all-safe -y     # aucune question : la forme pour cron
```

## Ce que « sûr » veut dire ici {#what-safe-means-here}

Sûr veut dire **régénérable** : caches des gestionnaires de paquets, caches des navigateurs et des applications, et données inutilisées des outils de développement. Cela ne veut **pas** dire sans risque, ni réversible : les suppressions restent [définitives](../safety/irreversibility.md).

Ce que `--all-safe` ne touchera jamais, avec ou sans `--yes` :

- Les fichiers personnels dans `~/Downloads`, `~/Desktop` ou ailleurs
- Les téléchargements partiels
- Les dossiers `node_modules`
- Tout ce qui figure sur la [liste des chemins protégés](../reference/protected-paths.md)
- Les paquets installés globalement et les fichiers d’initialisation du shell

Ces catégories sont [uniquement interactives par conception](../safety/guards.md#guard-3--personal-data-is-interactive-only) et ne font tout simplement pas partie de ce mode. C’est ce qui rend `--all-safe -y` acceptable dans une tâche cron.

Depuis la 1.1.0, le mode exécute aussi une **vérification au démarrage** qui s’arrête avec un message `BUG:` si un dossier d’environnement protégé se glissait un jour dans sa liste de cibles : une régression future échoue alors bruyamment au lieu de supprimer ce qu’il ne faut pas.

## `--yes` et ses limites {#--yes-and-its-limits}

`-y` / `--yes` confirme automatiquement les suppressions de caches. Il n’est valable qu’avec `--all-safe` ; les modes interactifs l’ignorent par principe.

```bash
linux-cleanup --all-safe -y
```

:::caution Avec `-y`, vous ne verrez les décisions qu’après coup
La liste de chemins autorisés et le seuil d’inactivité s’appliquent toujours, mais vous lisez le journal après l’exécution. Une exécution entièrement sûre seule n’écrit pas le rapport de session JSON du parcours guidé. Pour une première exécution, examinez d’abord un [`--scan`](./scan.md) et un `--all-safe --dry-run`.
:::

## L’élagage, et ce qui reste {#pruning-and-what-survives}

Par défaut, `--all-safe` élague les fichiers de cache éligibles dont l’`atime` et le `mtime` sont tous deux plus anciens que `--days` (100 par défaut). Les paquets extraits et les outils versionnés sont traités comme des unités entières selon leurs propres règles d’inactivité. La sortie lisible indique une partie des résultats ; utilisez la simulation pour examiner les chemins proposés avant toute suppression.

```bash
linux-cleanup --all-safe -y            # seuil de 100 jours
linux-cleanup --all-safe -y -d 30      # plus agressif
linux-cleanup --all-safe -y --purge-all # barrière désactivée : vidage complet
```

:::danger `--purge-all` dans une tâche cron est une mauvaise combinaison
Sans surveillance et sans seuil d’inactivité, une distribution du wrapper Gradle ou un paquet de navigateurs Playwright peut disparaître la semaine précédant le moment où vous en avez besoin, sans que personne ne s’en aperçoive. Réservez `--purge-all` aux exécutions délibérées, avant une réinstallation.
:::

## Le lancer chaque semaine {#running-it-weekly}

```bash
linux-cleanup --install-cron
```

Cela programme `--all-safe -y` le dimanche à 03:00 et ajoute la sortie à `~/.linux-cleanup/logs/cron.log`. Voir [Alias et cron](../guides/alias-and-cron.md) pour l’entrée exacte et la façon de la retirer.

Si vous écrivez vous-même l’entrée de la crontab, utilisez un **chemin absolu** : le `PATH` minimal de cron ne trouvera pas une installation dans `~/.local/bin` :

```bash
0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1
```

`--cleanup-logs` supprime le journal de cette exécution. Les exécutions entièrement sûres seules n’écrivent pas l’enregistrement de session JSON du parcours guidé, donc `--no-report` n’a pas d’autre effet ici.

## Vérifier ce qu’a fait une exécution cron {#checking-what-a-cron-run-did}

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
```

Si le journal cron affiche `command not found`, la crontab utilise un nom de commande sans chemin : voir [Dépannage](../troubleshooting.md#cron-entry-runs-but-does-nothing).

## Quand utiliser autre chose {#when-to-use-something-else}

| Situation | Mode plus adapté |
|---|---|
| Première fois sur cette machine | [`--scan`](./scan.md), puis `--all-safe --dry-run` |
| Vous voulez voir chaque décision | [Parcours guidé](./walkthrough.md) |
| Une seule catégorie à nettoyer | [Menu](./menu.md) ou [TUI](./tui.md) |
| Vous voulez aussi libérer des fichiers personnels | [Fichiers personnels inutilisés](./personal-stale-files.md), en interactif |

## Ensuite {#next}

- [Alias et cron](../guides/alias-and-cron.md) — le programmer
- [Libérer le plus d’espace](../guides/reclaim-the-most-space.md) — la voie agressive
- [Garde-fous](../safety/guards.md) — ce qui s’applique toujours avec `-y`
