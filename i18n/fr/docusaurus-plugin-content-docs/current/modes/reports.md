---
title: Rapports
description: Le parcours guidé peut écrire un enregistrement de session JSON. Listez, consultez, convertissez en Markdown ou HTML et exportez ces enregistrements.
sidebar_position: 15
---

# Rapports

**Le parcours guidé écrit un enregistrement de session JSON** dans `~/.linux-cleanup/reports/report-<timestamp>.json`, sauf si `--no-report` ou `--dry-run` est indiqué. Les autres modes ne créent pas cet enregistrement. Les enregistrements existants ne sont jamais supprimés automatiquement.

Le Markdown et le HTML sont des conversions facultatives produites à la demande.

```bash
linux-cleanup --reports              # gestionnaire interactif
linux-cleanup --export both latest   # conversion non interactive
```

## Ce que contient un enregistrement de session {#what-a-session-record-contains}

| Section | Contenu |
|---|---|
| `schema_version` | Actuellement `1` |
| `credits` | Nom, version, page d’accueil, licence et coordonnées de l’auteur de l’outil |
| `meta` | Horodatages, durée, machine, utilisateur, mode, seuil d’inactivité, chemin du journal, lanceur |
| `disk` | Occupation du système de fichiers avant et après |
| `memory` | Occupation de la mémoire avant et après |
| `steps` | Une entrée par étape : numéro, titre, état, octets libérés |
| `totals` | Total des octets libérés, total lisible, étapes exécutées et passées |

Référence complète champ par champ : [Schéma du rapport](../reference/report-schema.md).

## Le gestionnaire interactif {#the-interactive-manager}

```bash
linux-cleanup --reports
```

Il liste les sessions passées et permet d’en consulter une, de la convertir en Markdown ou en HTML, d’ouvrir le HTML dans un navigateur ou de la supprimer.

Les options de conversion sont masquées si `jq` n’est pas installé : voir [ci-dessous](#jq-is-required-for-conversion).

## Exporter {#exporting}

Sans question, pour les scripts et les habitudes :

```bash
linux-cleanup --export both latest   # Markdown + HTML à partir de l’enregistrement le plus récent
linux-cleanup --export html all      # tous les enregistrements en HTML
linux-cleanup --export md 3          # l’enregistrement n° 3 en Markdown
```

| Argument | Accepte |
|---|---|
| Format | `md`, `html`, `both` |
| Identifiant | un numéro d’enregistrement, `latest` ou `all` |

La sortie se place à côté du JSON, avec le même horodatage dans le nom du fichier. Le HTML est autonome (CSS intégré, compatible mode sombre, aucune ressource externe) : il peut être envoyé par e-mail ou archivé comme un seul fichier.

## La conversion nécessite `jq` {#jq-is-required-for-conversion}

:::note Le JSON est toujours écrit ; la conversion est la partie facultative
Sans `jq`, un parcours guidé peut toujours produire son enregistrement JSON. Seuls les exports Markdown et HTML sont indisponibles, et l’étape 10 du parcours s’enregistre comme `skipped (jq missing)`.

```bash
sudo apt install jq      # Debian / Ubuntu
sudo dnf install jq      # Fedora / RHEL
sudo pacman -S jq        # Arch
```
:::

Le HTML généré échappe chaque valeur issue du JSON avec le filtre `@html` de `jq`, de sorte qu’une entrée malformée ne peut pas injecter de balisage dans la page affichée.

## Interroger le JSON directement {#querying-the-json-directly}

Le JSON est fait pour être lu par des outils :

```bash
# Total libéré par la session la plus récente
jq '.totals.total_reclaimed_human' ~/.linux-cleanup/reports/report-*.json | tail -1

# Chaque étape réellement exécutée, session la plus récente
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

# Total libéré sur toutes les sessions enregistrées
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## Conservation {#retention}

Ces enregistrements ne sont **jamais** supprimés automatiquement, pas même par `--cleanup-logs`, qui ne supprime que le fichier journal de l’exécution en cours.

Pour les élaguer vous-même :

```bash
find ~/.linux-cleanup/reports/ -name 'report-*' -mtime +90 -delete
```

Pour ne pas en générer lors d’une exécution, utilisez `--no-report` ; le journal est tout de même écrit.

## Ce sont des enregistrements, pas des sauvegardes {#these-are-records-not-backups}

:::danger Un enregistrement de session est un résumé des étapes, pas une sauvegarde
Il consigne des étapes et des observations sur le disque, pas la liste complète de chaque fichier supprimé. Il ne contient rien du contenu supprimé, et rien en lui ne permet de restaurer quoi que ce soit. Son intérêt après une suppression non voulue est de vous aider à déterminer quoi restaurer depuis votre propre sauvegarde, ou quoi retélécharger. Voir [Récupération](../recovery.md).
:::

## Ensuite {#next}

- [Schéma du rapport](../reference/report-schema.md) — tous les champs
- [Chemins de sortie](../reference/output-paths.md) — où arrivent les fichiers
- [Récupération](../recovery.md) — utiliser un enregistrement de session après une mauvaise surprise
