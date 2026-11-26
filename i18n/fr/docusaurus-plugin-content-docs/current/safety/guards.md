---
title: Garde-fous
description: "Les quatre barrières indépendantes qu’un chemin doit franchir avant que linux-cleanup le supprime : la liste de chemins autorisés, le seuil d’inactivité, les modes personnels uniquement interactifs et le confinement de sudo."
tags: [safety, allowlist, staleness, guards, design]
sidebar_position: 3
---

# Garde-fous

**linux-cleanup applique jusqu’à quatre barrières indépendantes avant toute suppression. Un chemin doit franchir chacune de celles qui le concernent.** Cette page explique ce qu’est chaque barrière, pourquoi elle existe et ce qu’elle ne couvre pas.

Ces garde-fous constituent tout le modèle de sécurité. Derrière eux, ni sauvegarde ni [annulation](./irreversibility.md).

## Barrière 1 — La liste de chemins autorisés {#guard-1--the-path-allowlist}

Toujours active. Impossible à désactiver, et aucune option ne la contourne.

Avant toute suppression, la cible est résolue avec `realpath` et refusée si elle tombe sur un chemin protégé ou à l’intérieur. Comme la résolution a lieu d’abord, un lien symbolique ne peut pas faire passer un chemin en douce : si `~/.cache/yarn` est un lien symbolique vers `~/Documents`, le chemin résolu se trouve dans `~/Documents`, la barrière se déclenche et la suppression est refusée.

Trois listes distinctes la soutiennent :

| Liste | Type de correspondance | Rôle |
|---|---|---|
| Racines système et dossiers personnels | Le chemin ou tout descendant | `/etc`, `~/Documents`, `~/.ssh`, `~/.config`, … |
| Racines d’installation des gestionnaires de paquets | **Chemin exact uniquement** | `~/.local/share/pnpm`, `~/.npm`, `~/.cargo`, … |
| Fichiers d’initialisation et d’historique du shell | **Nom de fichier, à n’importe quel endroit** | `.bashrc`, `.zshrc`, `.bash_history`, … |

Quand la barrière se déclenche, un refus s’affiche sur stderr :

```text
✗ REFUSE: protected path: /home/you/Documents/notes
```

La liste à correspondance exacte mérite une précision. `~/.npm` est protégé *exactement*, ce qui permet de nettoyer `~/.npm/_cacache`, qui se trouve dedans. C’est voulu : la racine d’installation est préservée, tandis que le cache régénérable qu’elle contient peut être nettoyé. Les listes complètes sont dans [Chemins protégés](../reference/protected-paths.md).

:::note Ce que cette barrière ne fait pas
Elle protège des *emplacements*, pas de la *valeur*. Une vidéo irremplaçable de 40 GB dans `~/Downloads` n’est pas couverte par la liste de chemins autorisés : `~/Downloads` n’est pas un chemin protégé. C’est la [barrière 3](#guard-3--personal-data-is-interactive-only) qui la couvre.
:::

Les modes de nettoyage sélectionnent des chemins cibles nommés, puis la vérification des chemins protégés refuse les destinations dangereuses. Un chemin absent de la liste protégée n’est pas pour autant sûr à supprimer : examinez les cibles de chaque mode et sa simulation.

## Barrière 2 — Le seuil d’inactivité {#guard-2--the-staleness-gate}

Par défaut : 100 jours. Introduit en [1.2.0](../changelog.md#120--2026-05-10), étendu en [1.2.1](../changelog.md#121--2026-05-10).

Depuis la 1.2.0, la stratégie par défaut est d’**élaguer, pas de vider**. Dans un dossier cible, un fichier n’est supprimé que si son `atime` **et** son `mtime` sont plus anciens que `--days`. Les dossiers vides qui restent sont balayés ; l’enveloppe du dossier reste en place pour que l’outil propriétaire retrouve son organisation.

Exiger les deux horodatages compte. Le seul `mtime` supprimerait un fichier téléchargé il y a un an et lu hier ; le seul `atime` n’est pas fiable sur les systèmes de fichiers montés en `noatime` ou `relatime`. Exiger les deux est la lecture prudente.

Pour ce qui est un *outil* plutôt qu’un cache (AVD Android, versions d’extensions d’éditeurs, données utilisateur flatpak), la 1.2.1 a ajouté une seconde condition. Un tel élément n’est supprimé que si **aucun logiciel actif n’en dépend ET qu’il est inutilisé au-delà du seuil**. Chaque élément est évalué comme une unité indivisible, pour qu’un élagage partiel ne laisse pas un profil d’émulateur à moitié effacé.

```bash
linux-cleanup --all-safe -y -d 30    # plus agressif : seuil de 30 jours
linux-cleanup --all-safe -y          # par défaut : 100 jours
linux-cleanup --all-safe --purge-all # barrière DÉSACTIVÉE — vidage complet, comportement d’avant la 1.2.0
```

:::danger `--purge-all` désactive entièrement cette barrière
Avec `--purge-all`, chaque cache ciblé est vidé en totalité, quel que soit l’âge. C’est ce comportement qui a motivé la barrière : il supprime les distributions du wrapper Gradle, les navigateurs Playwright d’anciennes branches de version et les archives yarn en cache de dépendances épinglées — autant de retéléchargements coûteux.

C’est un choix légitime avant de réinstaller une machine. C’est un mauvais réglage par défaut au quotidien.
:::

La bannière affichée avant l’exécution indique la stratégie active, si bien qu’il n’y a jamais d’ambiguïté sur ce qui va se passer.

## Barrière 3 — Les données personnelles sont uniquement interactives {#guard-3--personal-data-is-interactive-only}

Les modes qui peuvent toucher des fichiers personnels sont interactifs par principe :

- [`--stale`](../modes/personal-stale-files.md) — gros fichiers inutilisés dans `~/Downloads` et les racines non protégées configurées
- [`--partials`](../modes/partial-downloads.md) — téléchargements partiels abandonnés
- [`--node-modules`](../modes/node-modules-finder.md) — dossiers de dépendances de projets délaissés

**`--yes` ne s’applique pas à ces modes et ne s’y appliquera jamais.** `--yes` confirme automatiquement les seuls caches régénérables. L’outil affiche sa liste de candidats, attend une confirmation pour chaque entrée et ne supprime rien avant votre réponse.

La raison : les fichiers personnels ne portent aucun signal qu’un programme puisse lire. Rien sur le disque ne distingue un installateur que vous ne rouvrirez jamais de l’unique copie d’un document dont vous n’avez pas encore eu besoin. Vous seul le savez, donc l’outil refuse de deviner.

## Barrière 4 — Le confinement de sudo {#guard-4--sudo-confinement}

[`--system`](../modes/system-cleanup.md) est le seul mode qui appelle `sudo`, et seulement pour un ensemble fixe et énuméré d’opérations, chacune étant un appel séparé et vérifiable, demandé individuellement :

| Opération | Réponse par défaut |
|---|---|
| `apt autoremove --purge -y` + `apt clean` | Oui |
| `journalctl --vacuum-size=100M` | Oui |
| Supprimer les révisions snap désactivées | Oui |
| Lister les noyaux installés — **aucune suppression** | — |
| Supprimer les fichiers de `/tmp` dont l’`atime` dépasse 7 jours | Oui |
| `sync` + `sysctl vm.drop_caches=3` | **Non** |

Le script ne modifie pas `/etc/sudoers`, et `--system` demande pour chaque opération. Si `sudo` n’est pas disponible, le mode s’arrête au lieu de continuer en mode dégradé.

Deux valeurs sont ici **fixes et ignorent `--days`** : la cible du nettoyage du journal (100 MB) et le seuil d’âge de `/tmp` (7 jours).

## Ce qu’aucune barrière ne couvre {#what-no-guard-covers}

Être clair sur les lacunes sert davantage que rassurer.

| Lacune | Ce que cela signifie |
|---|---|
| **Pas d’annulation** | Rien ici ne rend une suppression réversible. Voir [La suppression est définitive](./irreversibility.md). |
| **`~/Downloads` n’est pas protégé** | Le mode interactif pour fichiers personnels peut l’atteindre — lisez les candidats. `~/Desktop` est protégé. |
| **`--purge-all` retire la barrière 2** | Les barrières 1, 3 et 4 s’appliquent toujours ; le seuil d’inactivité, non. |
| **Lancer en root élargit les dégâts possibles** | L’outil est conçu pour un utilisateur normal. `--system` gère en interne les besoins légitimes de sudo. |
| **Les garde-fous protègent des chemins, pas un contenu** | Un dossier protégé est à l’abri où qu’il soit ; un fichier précieux en dehors, non. |
| **`/proc` et `/sys` ne figurent pas dans la liste protégée** | Rien ne les cible, mais la liste ne les nomme pas non plus. |

## Vérifier les garde-fous vous-même {#verifying-the-guards-yourself}

```bash
npx linux-cleanup --self-test      # vérifie que les barrières se déclenchent sur des chemins connus
npx linux-cleanup --list-targets   # affiche la liste des cibles et celle des chemins protégés
```

`--self-test` est la vérification honnête. Il vérifie que `/`, `$HOME`, `~/Documents`, `~/.ssh` et `/etc` sont protégés et que `~/.cache/yarn` ne l’est pas, puis quitte avec un code non nul si une vérification échoue. La documentation peut prendre du retard ; la vérification s’exécute sur le code que vous avez réellement.

## Ensuite {#next}

- [Chemins protégés](../reference/protected-paths.md) — les listes complètes vérifiées
- [La suppression est définitive](./irreversibility.md) — le raisonnement derrière « sans annulation »
- [Ce qu’il supprime](./what-it-deletes.md) — l’inventaire des cibles
