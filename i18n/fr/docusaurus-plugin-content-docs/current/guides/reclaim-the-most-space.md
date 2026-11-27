---
title: Libérer de l’espace en connaissance de cause
description: Examiner l’occupation du disque sous Linux, prévisualiser chaque mode de nettoyage, puis choisir les chemins de cache, de projets ou du système un par un.
sidebar_position: 1
---

# Libérer de l’espace en connaissance de cause

**Mesurez d’abord. Choisissez la portée de nettoyage la plus étroite qui traite les chemins trouvés.** La taille indiquée pour une racine de cache ne promet pas qu’un nettoyage puisse ou doive tout supprimer.

## 1. Trouver les gros chemins {#1-find-the-large-paths}

```bash
linux-cleanup --audit
linux-cleanup --scan
```

`--audit` liste les grosses entrées de `$HOME`, y compris ce que cet outil ne sait pas nettoyer. `--scan` liste les racines de cache configurées et d’autres candidats sans rien supprimer. Si c’est surtout une image de machine virtuelle, un jeu de données ou une bibliothèque de jeux qui occupe le disque, examinez-la directement plutôt que de lancer des modes de nettoyage sans rapport.

## 2. Prévisualiser les caches courants {#2-preview-routine-caches}

```bash
linux-cleanup --all-safe --dry-run
```

Le mode entièrement sûr par défaut élague les caches régénérables éligibles au-delà du seuil d’inactivité de 100 jours. La prévisualisation suit ces règles sans rien supprimer. Un journal local et l’état de la vérification des mises à jour peuvent tout de même être écrits.

Si chaque chemin proposé est quelque chose que vous pouvez reconstruire ou retélécharger, lancez `linux-cleanup --all-safe` et lisez sa confirmation. `--yes` sert à une exécution sans surveillance, une fois cette machine déjà examinée.

## 3. Examiner à part les dépendances de projets {#3-review-project-dependencies-separately}

```bash
linux-cleanup --node-modules --dry-run
```

Le mode des dépendances de projets est interactif. Vérifiez le chemin du projet et son fichier de verrouillage avant une suppression réelle. Une modification locale faite dans `node_modules` ne revient pas en réinstallant les dépendances.

## 4. Examiner à part le stockage système {#4-review-system-storage-separately}

```bash
linux-cleanup --system --dry-run
```

Le mode système complet utilise apt et dpkg : il est donc destiné à Debian et Ubuntu. Il demande sudo et comprend le nettoyage du journal, les anciens fichiers de `/tmp` et une étape facultative de cache de pages. Cette étape agit sur la RAM, pas sur le disque. Voir [Nettoyage du système](../modes/system-cleanup.md).

## 5. Ne changer le seuil d’âge qu’après une nouvelle prévisualisation {#5-change-the-age-threshold-only-after-another-preview}

`--days N` change les fichiers inutilisés ou les unités de cache entières qui deviennent éligibles. Le faire passer de 100 à 30 peut supprimer ce que vous avez utilisé récemment : regardez d’abord une simulation avec la valeur choisie. `--purge-all` désactive la protection par l’âge ; il peut supprimer une distribution Gradle ou un navigateur de test qu’il faudra retélécharger.

## 6. Garder les fichiers personnels comme une décision à part {#6-keep-personal-files-as-a-separate-decision}

`--stale` montre les gros fichiers personnels inutilisés candidats et demande pour chaque suppression. Un vieux téléchargement peut être votre seule copie. `--yes` n’autorise pas ce mode. Voir [Fichiers personnels inutilisés](../modes/personal-stale-files.md) et [La suppression est définitive](../safety/irreversibility.md).

L’espace libéré varie selon la machine et selon les autres processus qui écrivent pendant l’exécution. Lisez le journal final et les chemins conservés avant de décider si un autre mode est nécessaire.
