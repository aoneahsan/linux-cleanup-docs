---
title: Événements lisibles par une machine
description: Événements NDJSON en version 1 pour les analyses locales et les nettoyages entièrement sûrs non interactifs.
tags: [json, events, scan, dry-run, reference]
sidebar_position: 8
---

# Événements lisibles par une machine

`--json-events` écrit du JSON délimité par des retours à la ligne sur stdout. Le texte lisible et les questions vont sur stderr, avec une copie locale dans le journal de session. Le flux reste sur cette machine ; il peut contenir des chemins locaux complets. Les programmes qui le consomment ne devraient pas envoyer ces chemins dans des données de compte ou d’analyse.

L’option prend en charge `--scan` et `--all-safe --yes`. Une exécution entièrement sûre a besoin de `--yes` pour qu’un client automatique ne reste pas bloqué sur une question. Ajoutez `--dry-run` pour prévisualiser l’action entièrement sûre sans supprimer de fichiers. Un journal local et l’état de la vérification des mises à jour peuvent tout de même être écrits. Les autres modes renvoient le code de sortie 2.

```bash
linux-cleanup --scan --json-events > scan.ndjson
linux-cleanup --all-safe --yes --dry-run --json-events > preview.ndjson
```

Chaque événement complet comporte `v: 1`, un `type` et `ts` (millisecondes Unix). Les consommateurs doivent refuser un `v` plus élevé et ignorer les champs inconnus en version 1. L’identifiant du mode est une chaîne : `scan` ou `allsafe`.

| Événement | Champs | Signification |
|---|---|---|
| `plan` | `version`, `dry_run`, `profile`, `sections[]` | Premier événement ; une section pour le mode choisi. Une section a `id`, `title`, `stamp`, `sudo`, `deep`. |
| `disk` | `phase`, `total_kb`, `free_kb`, `purgeable_kb`, `snapshots`, `snapshot_note` | Mesure du disque avant et après le mode. Les estimations non prises en charge valent `null`. |
| `section_start` | `id`, `title`, `stamp` | Le mode choisi a démarré. |
| `item` | `id`, `path`, `kb`, `action`, `unique`, `age_days`, `reason` | Un résultat d’analyse en lecture seule ou un chemin choisi par un auxiliaire de nettoyage. `report` lit seulement, `delete` est une action proposée en simulation et une action terminée de l’auxiliaire en exécution réelle, `skip` est un refus. `kb` est tronqué au KiB entier. |
| `progress` | `id`, `done`, `total` | Le seul mode choisi en est à 0/1 ou 1/1. C’est une borne du mode, pas un pourcentage par fichier. |
| `error` | `id`, `message` | Un échec ou un refus signalé par la CLI. |
| `section_result` | `id`, `status`, `freed_kb`, `items`, `reason` | L’état est `completed` ou `failed`. Les totaux d’octets et d’éléments restent à `null` tant que la CLI ne sait pas distinguer ses propres écritures des autres activités du disque. |
| `summary` | `attempted`, `completed`, `skipped`, `failed`, `freed_kb`, `disk_free_before_kb`, `disk_free_after_kb`, `elapsed_s`, `reports`, `log`, `dry_run` | Dernier événement après un mode terminé. Les deux mesures d’espace libre sont des observations, pas une affirmation des octets libérés par ce processus. |

Le flux commence par `plan` et se termine par `summary` lors d’une exécution complète. Un processus interrompu ou une mise à jour exigée non satisfaite peut ne laisser aucun summary : considérez alors l’exécution comme incomplète et servez-vous du code de sortie et de stderr. Un argument refusé peut émettre un événement `error` et quitter avec 2 avant le plan. Sans l’option, la sortie texte et les codes de sortie sont inchangés.

Le flux d’événements complète le rapport de session JSON local. Une simulation n’écrit pas de rapport de session. Un consommateur peut utiliser `item.path` pour expliquer une décision locale, puis l’écarter au lieu de la synchroniser avec un serveur. Quand `--cleanup-logs` supprime le journal de session, `summary.log` vaut `null`.
