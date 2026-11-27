---
title: Démarrage rapide
description: "Votre première session linux-cleanup en une dizaine de minutes : vérifier les garde-fous, analyser en lecture seule, puis lancer le parcours guidé et lire le rapport."
sidebar_position: 3
---

# Démarrage rapide

**Vérifiez les garde-fous, examinez l’analyse et prévisualisez le mode choisi avant de supprimer.** L’espace libéré dépend des chemins et des fichiers de cette machine.

:::caution Ne sautez pas les étapes 1 et 2
Elles prennent deux minutes et font la différence entre un nettoyage que vous avez maîtrisé et un nettoyage que vous découvrez après coup. Cet outil [supprime définitivement](../safety/irreversibility.md).
:::

## Étape 1 — Vérifier l’installation {#step-1--verify-the-install}

```bash
npx linux-cleanup --version
npx linux-cleanup --self-test
```

`--version` confirme la version que vous avez. `--self-test` vérifie les dépendances et la syntaxe du shell, et s’assure que les garde-fous se déclenchent vraiment. Une exécution réussie se termine par un message de succès ; toute vérification en échec quitte avec un code non nul, et vous devez alors vous arrêter.

## Étape 2 — Analyser sans rien supprimer {#step-2--audit-deleting-nothing}

```bash
npx linux-cleanup --scan
```

`--scan` est en lecture seule. Il liste les racines de cache et leur taille actuelle, ainsi que d’autres candidats et des observations sur le système. Il ne supprime rien et n’écrit pas de rapport de session JSON.

Lisez les chemins avant de continuer. La taille d’une racine de cache ne signifie pas que tout le dossier peut être supprimé. Examinez à part tout chemin inattendu et chaque fichier personnel candidat.

## Étape 3 — Prévisualiser le nettoyage {#step-3--preview-the-cleanup}

```bash
npx linux-cleanup --all-safe --dry-run
```

Cela parcourt le mode de cache entièrement sûr sans supprimer de fichiers ni modifier de réglages. Lisez les actions proposées, puis décidez de le lancer ou non. Une suppression réelle ne s’annule pas.

## Étape 4 — Lancer le parcours guidé {#step-4--run-the-guided-walkthrough}

```bash
npx linux-cleanup
```

Sans option, c’est le [parcours guidé](../modes/walkthrough.md) : dix étapes, chacune demande avant d’agir, avec un total cumulé des octets libérés.

À chaque étape, vous avez trois choix :

| Touche | Effet |
|---|---|
| `a` | Exécuter cette étape (par défaut : Entrée la choisit) |
| `s` | Passer cette étape |
| `q` | Quitter le parcours maintenant |

À l’intérieur d’une étape, chaque cible a sa propre confirmation `[Y/n]`. Il y a donc deux niveaux : passer toute une catégorie, ou l’accepter en refusant certains éléments.

Les dix étapes, dans l’ordre :

1. Caches des gestionnaires de paquets
2. Caches des applications
3. Données des outils de développement
4. Anciennes extensions d’éditeurs
5. `node_modules` délaissés
6. Téléchargements partiels ou orphelins
7. Fichiers personnels inutilisés
8. Nettoyage du système (sudo)
9. Bilan final des tailles
10. Génération d’un rapport lisible

:::tip Ralentissez aux étapes 6 et 7
Tout ce qui précède est régénérable. Les téléchargements partiels et les fichiers personnels inutilisés ne le sont pas : lisez chaque candidat plutôt que d’accepter le lot. Lors d’une première exécution, passez les deux avec `s` si vous préférez les examiner à part plus tard.
:::

`Ctrl-C` arrête le parcours avec le code `130`. Toute suppression antérieure reste définitive. Lisez le journal pour voir quelles étapes ont été exécutées avant l’interruption.

## Étape 5 — Lire le rapport {#step-5--read-the-report}

La session se termine par un résumé qui indique son journal et, s’il a été généré, son rapport. Lisez les chemins affichés par votre propre exécution plutôt que de supposer un emplacement fixe pour chaque mode d’installation.

Le parcours guidé écrit un rapport JSON sauf si vous passez `--no-report` ou `--dry-run`. Pour convertir un rapport existant afin de le lire ou de l’archiver, installez `jq` et lancez :

```bash
linux-cleanup --export both latest   # Markdown + HTML à côté du JSON
linux-cleanup --reports              # gestionnaire interactif des rapports
```

Voir [Rapports](../modes/reports.md).

## Étape 6 — Automatiser, une fois en confiance {#step-6--automate-it-once-you-trust-it}

Seulement après une exécution manuelle qui vous a satisfait :

```bash
linux-cleanup --install-alias   # tapez `cleanup` depuis n’importe où
linux-cleanup --install-cron    # --all-safe -y chaque semaine, le dimanche à 03:00
```

La tâche cron lance `--all-safe -y`, qui confirme automatiquement **les seuls caches régénérables**. Elle ne peut pas toucher aux fichiers personnels : [ces modes ignorent `--yes`](../safety/guards.md#guard-3--personal-data-is-interactive-only).

Voir [Alias et cron](../guides/alias-and-cron.md) pour savoir exactement ce que chacun écrit et comment le retirer.

## Ce que vous savez maintenant {#what-you-now-know}

| Notion | Pour aller plus loin |
|---|---|
| Les modes en lecture seule ne suppriment jamais | [Prévisualiser avant de supprimer](../safety/preview-first.md) |
| Le parcours demande avant chaque étape | [Parcours guidé](../modes/walkthrough.md) |
| La liste de chemins autorisés refuse Documents, `.ssh`, `.config` | [Garde-fous](../safety/guards.md) |
| Par défaut, seuls les fichiers inutilisés depuis plus de 100 jours sont élagués | [Le seuil d’inactivité](../safety/guards.md#guard-2--the-staleness-gate) |
| Les modes pour données personnelles sont uniquement interactifs | [Fichiers personnels inutilisés](../modes/personal-stale-files.md) |
| Rien n’est récupérable depuis l’outil | [La suppression est définitive](../safety/irreversibility.md) |

## Questions fréquentes ensuite {#common-follow-ups}

- **« Je veux plus d’espace. »** → [Libérer le plus d’espace](../guides/reclaim-the-most-space.md)
- **« Quelque chose ne marche plus. »** → [Dépannage](../troubleshooting.md)
- **« Il a supprimé quelque chose que je voulais garder. »** → [Récupération](../recovery.md)
- **« Quelles sont toutes les options ? »** → [Options de la CLI](../reference/cli-flags.md)
