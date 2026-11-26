---
title: Schéma du rapport
description: La structure JSON qu’écrit le parcours guidé de linux-cleanup, avec credits, meta, disk, memory, steps et totals.
tags: [json, schema, reports, parsing, jq, reference]
sidebar_position: 7
---

# Schéma du rapport

**Le parcours guidé écrit un enregistrement JSON avec `"schema_version": 1`**, sauf avec `--no-report` ou `--dry-run`. Le `--scan` seul n’écrit pas ce rapport. Pour une analyse lisible par une machine, utilisez `--scan --json-events` ; ce flux a une autre structure.

:::warning Une documentation plus ancienne décrit une autre structure
Certains documents — dont une page de référence dans le dépôt des sources — décrivent une forme bâtie autour de `schema` (une chaîne comme `linux-cleanup/report/v1`) avec des objets `tool`, `session` et `categories`.

**L’outil n’émet pas cela.** Un analyseur écrit pour cette forme échouera sur chaque vrai fichier. La structure ci-dessous est celle qu’écrit `modules/walkthrough.sh`. Vérifiez sur votre machine :

```bash
jq 'keys' "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```
:::

## Niveau supérieur {#top-level}

```json
{
  "schema_version": 1,
  "credits": { },
  "meta":    { },
  "disk":    { "before": {}, "after": {} },
  "memory":  { "before": {}, "after": {} },
  "steps":   [ ],
  "totals":  { }
}
```

| Clé | Type | Contenu |
|---|---|---|
| `schema_version` | nombre | Actuellement `1`. Refusez toute valeur que vous ne reconnaissez pas |
| `credits` | objet | Identité de l’outil, licence et auteur |
| `meta` | objet | Contexte de la session : quand, où, comment, avec quels réglages |
| `disk` | objet | Occupation du système de fichiers avant et après |
| `memory` | objet | Occupation de la mémoire avant et après |
| `steps` | tableau | Une entrée par étape tentée |
| `totals` | objet | Résumé de la session |

## `credits` {#credits}

```json
{
  "tool": "linux-cleanup",
  "tool_version": "2.1.1",
  "tool_homepage": "https://linux-cleanup.aoneahsan.com",
  "tool_license": "MIT",
  "author": {
    "name": "Ahsan Mahmood",
    "email": "aoneahsan@gmail.com",
    "website": "https://aoneahsan.com",
    "linkedin": "https://linkedin.com/in/aoneahsan"
  }
}
```

Présent pour que l’enregistrement indique sa provenance où qu’il aille. Rien ici ne reflète votre machine.

## `meta` {#meta}

| Clé | Type | Contenu |
|---|---|---|
| `tool` | chaîne | Toujours `linux-cleanup` |
| `tool_version` | chaîne | La version qui a écrit l’enregistrement. Fondez la logique du consommateur dessus |
| `started_at` | chaîne | Horodatage du début de la session |
| `finished_at` | chaîne | Horodatage de la fin de la session |
| `duration_seconds` | nombre | Durée réelle |
| `host` | chaîne | Sortie de `hostname` |
| `user` | chaîne | `$USER` |
| `mode` | chaîne | Le mode exécuté : `walkthrough`, `scan`, `allsafe`, `system`, etc. |
| `stale_days` | nombre | Le seuil `--days` en vigueur |
| `log_file` | chaîne | Chemin absolu du journal de cette session |
| `launcher` | chaîne | Mode d’appel : `bash` pour une exécution directe |
| `via_npx` | nombre | `1` quand le lanceur npm est utilisé, `0` sinon |

`stale_days` mérite d’être conservé : c’est la différence entre une exécution qui a élagué à 100 jours et une autre lancée avec `-d 30`, et cela explique pourquoi deux sessions sur la même machine ont récupéré des quantités différentes.

## `disk` et `memory` {#disk-and-memory}

Les deux contiennent un instantané `before` et un instantané `after`, pris au début et à la fin de la session.

`disk` porte les champs du système de fichiers — système de fichiers, taille, utilisé, disponible et pourcentage d’utilisation — tirés de `df`. `memory` porte l’équivalent tiré du rapport mémoire du système.

:::note `after` moins `before` n’est pas seulement votre nettoyage
Ce sont des mesures de toute la machine. Une compilation, une mise à jour de paquets ou un navigateur ouvert pendant la session les font aussi bouger, c’est pourquoi l’espace récupéré peut être inférieur à la somme des étapes — voire négatif. Voir [Dépannage](../troubleshooting.md#disk-usage-grew-during-the-session).
:::

## `steps` {#steps}

Un tableau, une entrée par étape tentée, dans l’ordre :

```json
{ "n": 1, "title": "Package-manager caches", "status": "ran", "freed_bytes": 13315108864 }
```

| Clé | Type | Contenu |
|---|---|---|
| `n` | nombre | Numéro d’étape, à partir de 1 |
| `title` | chaîne | Nom lisible de l’étape |
| `status` | chaîne | `ran`, `skipped`, `skipped (quit)` ou `skipped (jq missing)` |
| `freed_bytes` | nombre | Octets récupérés par cette étape. `0` si elle est sautée |

`skipped (quit)` marque les étapes qui suivent l’appui sur `q` — utile pour distinguer un arrêt volontaire d’une étape refusée individuellement.

## `totals` {#totals}

| Clé | Type | Contenu |
|---|---|---|
| `total_reclaimed_bytes` | nombre | Somme de toutes les étapes |
| `total_reclaimed_human` | chaîne | La même valeur, mise en forme |
| `steps_run` | nombre | Étapes à l’état `ran` |
| `steps_skipped` | nombre | Étapes à un état `skipped` |

## Analyse avec jq {#parsing}

```bash
LATEST="$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

jq '.totals.total_reclaimed_human' "$LATEST"
jq '.meta | {mode, stale_days, duration_seconds}' "$LATEST"
jq '.steps[] | select(.status == "ran") | "\(.title): \(.freed_bytes)"' "$LATEST"

# Espace récupéré sur toutes les sessions enregistrées
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## Validation {#validating}

Aucun fichier JSON Schema n’est fourni avec l’outil. Une vérification de structure :

```bash
jq -e 'has("schema_version") and .schema_version == 1
       and has("meta") and has("steps") and has("totals")' \
  ~/.linux-cleanup/reports/report-*.json
```

Affiche `true` pour chaque fichier valide.

## Conseils de compatibilité {#compatibility-guidance}

Pour écrire un consommateur :

- **Aiguillez selon `schema_version`.** Traitez une valeur inconnue comme illisible plutôt que de deviner
- **Traitez les clés inconnues comme des ajouts.** Des champs ont été ajoutés dans la version 1 et pourraient l’être encore
- **Utilisez `meta.tool_version`** pour ce qui change d’une version à l’autre
- **Ne supposez pas que chaque mode remplit chaque section.** Les modes en lecture seule produisent moins d’étapes
- **Attendez-vous à un `total_reclaimed_bytes` parfois négatif.** C’est un écart de `df`, pas une somme de suppressions

## Ensuite {#next}

- [Rapports](../modes/reports.md) — consulter et exporter
- [Chemins de sortie](./output-paths.md) — où se trouvent les fichiers
