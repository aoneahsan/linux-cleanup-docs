---
title: Chemins de sortie
description: "Où linux-cleanup écrit ses journaux, ses enregistrements de session JSON, ses paquets de débogage et de plantage : arborescence, valeurs par défaut selon l’installation, conservation et droits."
tags: [output, paths, logs, reports, feedback, retention, reference]
sidebar_position: 5
---

# Chemins de sortie

**Toute la sortie se trouve sous une seule racine de données.** Laquelle dépend de la façon dont vous avez installé l’outil, et les deux peuvent être remplacées.

## Arborescence {#layout}

```text
$DATA_HOME/
├── logs/
│   ├── cleanup-<YYYY-MM-DD_HHMMSS>.log     # un par session
│   └── cron.log                             # complété par le cron hebdomadaire
├── reports/
│   ├── report-<YYYY-MM-DD_HHMMSS>.json     # enregistrement du parcours guidé, sauf s’il est désactivé
│   ├── report-<YYYY-MM-DD_HHMMSS>.md       # créé par --export md
│   └── report-<YYYY-MM-DD_HHMMSS>.html     # créé par --export html
└── feedback/
    ├── debug-bundle-<YYYY-MM-DD_HHMMSS>.tar.gz   # créé par --debug-bundle
    └── crash-<YYYY-MM-DD_HHMMSS>.tar.gz          # créé automatiquement en cas de plantage
```

## Valeurs par défaut selon l’installation {#per-install-defaults}

| Installé via | `$DATA_HOME` |
|---|---|
| `npx linux-cleanup` | `~/.linux-cleanup/` |
| `npm install -g linux-cleanup` | `~/.linux-cleanup/` |
| `git clone` | Le dossier du clone lui-même |

La différence est voulue. `npx` exécute le paquet depuis un dossier temporaire du cache npm qui finit par être vidé : une sortie écrite là serait perdue, alors que `~/.linux-cleanup/` persiste d’une exécution à l’autre. Un clone est déjà un emplacement permanent, la sortie reste donc à côté des sources.

Remplacez l’un ou l’autre avec [`LINUX_CLEANUP_DATA_HOME`](./environment-variables.md), ou les dossiers de journaux et d’enregistrements séparément.

## Conservation {#retention}

| Chemin | Nettoyé automatiquement | Remarques |
|---|---|---|
| `logs/cleanup-*.log` | Seulement avec `--cleanup-logs` | Cette option supprime le journal de **cette exécution** à la fin. Les journaux précédents restent |
| `logs/cron.log` | Jamais | Jamais renouvelé. Faites-le vous-même s’il grossit |
| `reports/*.json` | **Jamais** | La piste d’audit durable |
| `reports/*.md`, `*.html` | **Jamais** | Créés à la demande, supprimés à la demande |
| `feedback/*.tar.gz` | **Jamais** | Vous décidez quand ils ne servent plus |

`--cleanup-logs` est la seule suppression automatique que l’outil fait sur sa propre sortie, et elle ne touche que des fichiers `.log`.

## Taille et conservation {#size-and-retention}

La taille des journaux et des paquets dépend des chemins et des événements d’une exécution. Regardez ce qui s’est accumulé avant de supprimer d’anciens enregistrements. Pour élaguer volontairement les fichiers anciens :

```bash
find ~/.linux-cleanup/logs/    -name 'cleanup-*.log' -mtime +90 -delete
find ~/.linux-cleanup/reports/ -name 'report-*'      -mtime +90 -delete
```

Renouveler le journal cron :

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## Droits {#permissions}

Les fichiers appartiennent à l’utilisateur qui lance l’outil. Vérifiez leurs droits effectifs avec `stat` sur votre machine ; les droits de dossier configurés par l’outil comme l’umask du processus comptent. Ne partagez pas un journal ou un paquet sans l’avoir lu.

## Ce que contiennent ces fichiers {#what-these-files-contain}

:::caution Les journaux et les paquets contiennent vos chemins
Un journal de session nomme chaque chemin touché, il contient donc des noms de dossiers de votre machine — noms de projets, et parfois noms de fichiers de `~/Downloads`.

Tout cela reste local et n’est jamais transmis, mais examinez un paquet avant de l’envoyer par e-mail :

```bash
tar -tzf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz
```

Voir [Envoyer un rapport de bogue](../guides/send-a-bug-report.md).
:::

Rien ici ne contient le **contenu** des fichiers — seulement des chemins, des tailles et des horodatages. Ce sont des traces de ce qui s’est passé, pas des copies de ce qui a été supprimé. Voir [Récupération](../recovery.md).

## Ensuite {#next}

- [Variables d’environnement](./environment-variables.md) — remplacer ces emplacements
- [Schéma du rapport](./report-schema.md) — la structure JSON
