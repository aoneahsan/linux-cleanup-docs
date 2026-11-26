---
title: FAQ
description: Réponses sur les chemins de linux-cleanup, sa vérification des versions, les simulations, la suppression définitive et les distributions prises en charge.
tags: [faq, questions, safety, privacy, licence]
sidebar_position: 93
---

# FAQ

Les problèmes liés à un symptôme précis sont dans [Dépannage](./troubleshooting.md) ; les raisons de conception, dans [Garde-fous](./safety/guards.md).

## Va-t-il supprimer mon code ? {#will-it-delete-my-code}

**Vos fichiers source, non.** `~/Documents` et les autres dossiers personnels sont [protégés sans exception](./reference/protected-paths.md), et aucune cible de nettoyage ne vise le code source d’un projet.

Le plus près qu’il s’en approche, c’est en cherchant des `node_modules` délaissés dans vos racines de projets. Ils sont [uniquement interactifs](./modes/node-modules-finder.md), avec une confirmation par projet, et `yarn install` les reconstruit.

Une réserve à connaître : si vous avez modifié un fichier directement *dans* `node_modules`, plutôt qu’avec un outil de correctifs, cette modification n’existe nulle part ailleurs.

## Envoie-t-il des données quelque part ? {#does-it-phone-home}

**Au démarrage, si elle est en ligne, la CLI consulte un registre public des versions en HTTPS.** Elle n’envoie ni résultats d’analyse, ni chemins de nettoyage, ni paquet de plantage. Hors ligne, la vérification est ignorée et l’exécution continue.

Vérifiez-le vous-même sur un clone :

```bash
grep -rE 'curl|wget|http://|https://' cleanup.sh lib/ modules/ bin/
```

La vérification des versions se trouve dans `modules/update_check.sh` ; examinez aussi ce fichier. L’installation ou l’acceptation d’une mise à jour passe par npm ou GitHub. L’assistant de retour ouvre un brouillon que vous choisissez d’envoyer ou non.

## Pourquoi n’y a-t-il pas d’annulation ? {#why-is-there-no-undo}

Un journal d’annulation multiplierait les écritures sur le disque même que vous voulez libérer : conserver 20 GB pour en récupérer 20 ne sert à rien. Il donnerait aussi une fausse confiance, et serait au mieux partiel.

Le modèle de sécurité mise plutôt sur la prévention : une liste de chemins autorisés, un seuil d’inactivité et une confirmation interactive. Le raisonnement complet : [La suppression est définitive](./safety/irreversibility.md).

## Existe-t-il un `--dry-run` ? {#is-there-a---dry-run}

**Oui.** `--scan` ne fait que lire ; `--dry-run` parcourt le nettoyage choisi sans supprimer de fichiers ni modifier de réglages. Une simulation conserve quand même un journal local et n’écrit pas de rapport de session JSON. Voir [Prévisualiser avant de supprimer](./safety/preview-first.md).

## Quelle est la façon la plus sûre de l’essayer ? {#what-is-the-safest-way-to-try-it}

```bash
linux-cleanup --self-test      # vérifie que les garde-fous se déclenchent
linux-cleanup --scan           # lecture seule ; montre ce qui serait libéré
linux-cleanup --list-targets   # chaque chemin qu’il peut toucher
linux-cleanup --all-safe --dry-run  # prévisualise un nettoyage de caches
```

Après cela, vous avez vu le modèle de sécurité fonctionner sans perdre un octet. Lancez ensuite `linux-cleanup` et répondez `n` à tout ce qui vous surprend.

## Va-t-il accélérer mon ordinateur ? {#will-it-speed-up-my-computer}

Un peu, parfois, et autant être honnête sur le peu :

- VS Code démarre un peu plus vite avec une douzaine de dossiers d’extensions plutôt que cinquante
- Un cache léger se parcourt à peine plus vite qu’un cache gonflé
- Le démarrage à froid du navigateur n’est pas affecté : les caches sont de type clé-valeur, les recherches sont en O(1)
- Vider le cache de pages libère de la RAM, pas du disque, et le noyau le remplit aussitôt

Le vrai bénéfice, c’est que « disque plein » cesse de bloquer votre travail, pas un chiffre de benchmark.

## Que se passe-t-il si j’appuie sur `Ctrl-C` en plein nettoyage ? {#what-if-i-press-ctrl-c-mid-cleanup}

La suppression en cours se termine, généralement en bien moins d’une seconde, puis le script quitte avec le code `130`. Le journal garde tout jusqu’à ce moment. Le [piège de plantage ignore volontairement `130`](./reference/exit-codes.md), donc aucun paquet de plantage n’est écrit.

## Puis-je le lancer en root ? {#can-i-run-it-as-root}

Vous le pouvez, mais vous ne devriez pas. Il est conçu pour un utilisateur normal, et le lancer en root ne fait qu’élargir les dégâts si un bogue échappait un jour aux garde-fous. [`--system`](./modes/system-cleanup.md) gère en interne les besoins légitimes de sudo, une commande vérifiée à la fois.

## Fonctionne-t-il sur ma distribution ? {#does-it-work-on-my-distro}

Le nettoyage des caches dans `$HOME` fonctionne sur **toutes** les distributions Linux.

[`--system`](./modes/system-cleanup.md) est **réservé à Debian et Ubuntu** : il appelle `apt` et `dpkg` sans détecter la distribution. Sous Fedora, Arch ou openSUSE, ses étapes de paquets échouent, tandis que celles du journal, de `/tmp` et du cache de pages fonctionnent toujours. Voir [Distributions prises en charge](./distro-support.md).

## Et WSL ? {#what-about-wsl}

La CLI s’exécute côté Linux. Avant un nettoyage, vérifiez tout lien symbolique de votre dossier personnel Linux vers `/mnt/c/`. La liste de chemins autorisés résout les liens symboliques, mais un chemin `Documents` de Windows n’est pas couvert automatiquement par une règle du dossier personnel Linux.

## Pourquoi bash plutôt que Python, Go ou Rust ? {#why-bash-rather-than-python-go-or-rust}

Bash est déjà présent sur tous les systèmes visés. Un binaire compilé reviendrait à livrer quelque chose que les utilisateurs ne peuvent pas facilement auditer ; une version en Python ou Node ajouterait une dépendance d’exécution à un outil dont tout le travail consiste à retirer des choses du disque.

Le script compte quelques milliers de lignes de bash commenté, qu’un ingénieur expérimenté lit en un après-midi. Pour un outil qui lance `rm -rf` avec `sudo` à portée de main, la possibilité de l’auditer vaut plus que le confort.

## À quelle fréquence le lancer ? {#how-often-should-i-run-it}

| Mode | Fréquence |
|---|---|
| [`--scan`](./modes/scan.md) | Tous les mois, comme référence |
| [`--all-safe -y`](./modes/all-safe.md) | Chaque semaine — [automatisez-le](./guides/alias-and-cron.md) |
| [`--system`](./modes/system-cleanup.md) | Tous les trimestres, à la main |
| [`--node-modules`](./modes/node-modules-finder.md) | Une fois par an, quand les projets personnels s’accumulent |
| [`--editor-ext`](./modes/editor-extensions.md) | Quand l’éditeur ralentit — aussi couvert par `--all-safe` |
| [`--stale`](./modes/personal-stale-files.md) | Tous les trimestres, délibérément |
| [`--doctor`](./modes/doctor.md) | Quand `command not found` apparaît |
| [`--globals`](./modes/globals-audit.md) | Avant de réinstaller Node ou de changer de machine |

## À quoi sert `--purge-all` ? {#what-is---purge-all-for}

Il désactive le [seuil d’inactivité](./safety/guards.md#guard-2--the-staleness-gate) et vide entièrement les caches au lieu d’élaguer les fichiers inutilisés. Cela inclut les distributions du wrapper Gradle, les navigateurs Playwright et les binaires Cypress dont vous pourriez encore avoir besoin.

C’est le bon choix avant de réinstaller une machine, et un mauvais réglage par défaut le reste du temps. Ne l’associez jamais à une tâche cron.

## Quelle version installer ? {#which-version-should-i-install}

Consultez le [paquet npm](https://www.npmjs.com/package/linux-cleanup) pour la version publiée actuelle et lancez `linux-cleanup --version` pour identifier votre copie installée. Lisez le [journal des modifications](./changelog.md) avant de mettre à jour.

## Sous quelle licence est-il ? {#what-licence-is-it-under}

**[MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)** depuis la 1.4.0 : permissive et approuvée par l’OSI. Utilisez-le à titre personnel ou commercial, modifiez-le, forkez-le, intégrez-le, redistribuez-le. La seule condition est de conserver la mention de copyright et d’autorisation.

Fourni « AS IS » (en l’état), sans garantie. Les versions publiées avant la 1.4.0 gardent la licence sous laquelle elles sont sorties.

## Comment demander une fonctionnalité ou signaler un bogue ? {#how-do-i-request-a-feature-or-report-a-bug}

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

Ouvrez ensuite une [issue GitHub](https://github.com/aoneahsan/linux-cleanup/issues) ou écrivez à [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com). Les pull requests sont les bienvenues sous MIT ; les demandes de fonctionnalités décrites en quelques mots aussi. Voir [Envoyer un rapport de bogue](./guides/send-a-bug-report.md).

## Que ne fera-t-il jamais ? {#what-will-it-never-do}

- Supprimer quoi que ce soit de la [liste des chemins protégés](./reference/protected-paths.md)
- Toucher aux données personnelles sans confirmation fichier par fichier
- Envoyer automatiquement résultats d’analyse, chemins de nettoyage ou paquets de plantage
- Installer un service, un démon ou un agent en arrière-plan
- Modifier ou supprimer une ligne existante de votre configuration shell
- Récupérer quoi que ce soit qu’il a supprimé
