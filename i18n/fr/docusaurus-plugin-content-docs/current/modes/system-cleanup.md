---
title: Nettoyage du système (sudo)
description: "Le mode système avec sudo : apt, journal, Snap, liste des noyaux, fichiers anciens de /tmp et vidage facultatif du cache de pages."
sidebar_position: 7
---

# Nettoyage du système (sudo)

**`--system` demande sudo avant de commencer, puis pose une question pour chaque étape système.** Il utilise directement `apt` et `dpkg` pour les paquets, donc le mode complet est destiné à Debian et Ubuntu. D’autres distributions peuvent exécuter les parties journal ou `/tmp`, mais les commandes de paquets échoueront ; voir [Distributions prises en charge](../distro-support.md).

```bash
linux-cleanup --system --dry-run
linux-cleanup --system
```

Une simulation affiche les commandes proposées sans supprimer de cibles de nettoyage ni modifier de réglages. Elle peut tout de même écrire un journal local et l’état de la vérification des mises à jour. Examinez-la avant une exécution réelle, qui ne s’annule pas.

## Les six étapes {#the-six-steps}

| Étape | Ce que le code exécute après confirmation | Par défaut |
|---|---|---|
| apt | `sudo apt autoremove --purge -y`, `sudo apt clean` | Oui |
| Journal | `sudo journalctl --vacuum-size=100M` | Oui |
| Snap | Révisions désactivées éligibles, via `sudo snap remove` | Oui |
| Noyaux | Liste les paquets `linux-image-*` installés via `dpkg` | Aucune suppression |
| `/tmp` | `sudo find /tmp -mindepth 1 -atime +7 -delete` | Oui |
| Cache de pages | `sudo sync`, `sudo sysctl -q -w vm.drop_caches=3` | Non |

La cible du journal est de 100 MB et l’ancienneté de `/tmp` de 7 jours ; aucune ne suit `--days`. L’étape Snap conserve une révision de retour désactivée jusqu’à ce que sa remplaçante ait atteint le seuil d’âge configuré, sauf avec `--purge-all`. La liste des noyaux est indicative ; apt peut supprimer des paquets de noyau remplacés lors de son étape précédente.

L’étape `/tmp` repose sur les temps d’accès. Si le système de fichiers ne les enregistre pas de façon fiable, l’outil saute la suppression par ancienneté. Vider le cache de pages libère de la RAM, pas du disque, et peut ralentir les lectures suivantes le temps que le cache se remplisse.

## Limites {#boundaries}

Le mode met en cache les identifiants sudo pendant son exécution pour pouvoir lancer ses différentes commandes. Ne démarrez pas un nettoyage du système si vous n’êtes pas prêt à examiner ces commandes. `--speed` propose ses propres corrections facultatives, qui peuvent aussi demander sudo : le mode système n’est pas le seul chemin de la CLI capable d’utiliser sudo.

L’espace libéré dépend de la machine. Une variation de l’espace disque mesurée après l’exécution peut aussi inclure les écritures d’autres processus. Lisez le journal pour voir les commandes que l’outil a tenté d’exécuter.

## À lire ensuite {#read-next}

- [Prévisualiser avant de supprimer](../safety/preview-first.md)
- [Garde-fous](../safety/guards.md)
- [Distributions prises en charge](../distro-support.md)
