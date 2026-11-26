---
title: Journal des modifications
description: Historique des versions de linux-cleanup, avec les simulations, les avis de version et les événements JSON locaux.
tags: [changelog, releases, versions, history]
sidebar_position: 94
---

# Journal des modifications

Historique des versions de `linux-cleanup`. Le format suit [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), et le projet utilise le [versionnage sémantique](https://semver.org/spec/v2.0.0.html).

Consultez le [paquet npm](https://www.npmjs.com/package/linux-cleanup) pour la version publiée actuelle. Le [journal des modifications des sources](https://github.com/aoneahsan/linux-cleanup/blob/main/CHANGELOG.md) contient l’historique complet. Les entrées ci-dessous expliquent les changements qui influent sur la décision de nettoyage.

## 2.1.1 — 2026-11-22 {#211--2026-11-22}

`--help`, `--version`, la boîte « À propos » du menu et l’écran de retour indiquent le site, ce manuel et la page de téléchargement de l’application de bureau. Le `credits.tool_homepage` du rapport d’exécution est désormais le site du produit. La boîte « À propos » ne dit plus que le script ne fait aucun appel réseau : il lit une fois le registre public des versions au démarrage. Aucun changement dans ce que supprime chaque mode.

## 2.1.0 — 2026-11-21 {#210--2026-11-21}

`--json-events` diffuse des événements JSON locaux et versionnés pour `--scan` et pour `--all-safe --yes` non interactif. Ajouter `--dry-run` au mode entièrement sûr signale les chemins prévus sans les supprimer. Le flux peut contenir des chemins locaux complets : gardez-le sur la machine.

## 2.0.1 — 2026-11-21 {#201--2026-11-21}

Le README liste chaque endroit où linux-cleanup est publié. Aucun changement dans ce que fait le script.

## 2.0.0 — 2026-11-10 {#200--2026-11-10}

Ajout de `--dry-run`, d’une vérification du registre public des versions au démarrage et de `--refresh-app` pour la copie persistante de la CLI. Les avis de version normaux autorisent la première exécution et bloquent à partir du démarrage suivant ; les avis urgents bloquent aussitôt une copie plus ancienne. Hors ligne, l’exécution continue. Une simulation ne supprime aucune cible de nettoyage et ne change aucun réglage, mais elle peut écrire un journal local et l’état de la vérification des mises à jour.

## 1.6.0 — 2026-09-18 {#160--2026-09-18}

Ajout du diagnostic en lecture seule `--speed` et de racines de recherche configurables pour les projets et les fichiers personnels. Correction de la détection d’inactivité sur les systèmes de fichiers `noatime` : les anciennes versions pouvaient supprimer un cache encore utilisé, faute d’heures d’accès enregistrées. Les installations d’alias et de cron pointent désormais vers une copie persistante, et le nettoyage des journaux ne supprime que celui de l’exécution en cours.

## 1.5.2 — 2026-09-18 {#152--2026-09-18}

Conservation des révisions Snap désactivées récentes comme copies de retour arrière, et `--node-modules` ne liste plus les éléments internes de Yarn PnP.

## 1.5.1 — 2026-09-18 {#151--2026-09-18}

L’élagage des caches de paquets extraits et des navigateurs se fait désormais par entrée complète, pour qu’un fichier rarement utilisé ne puisse pas être retiré d’une installation par ailleurs active.

## 1.5.0 — 2026-09-18 {#150--2026-09-18}

L’élagage des caches de Gradle et d’Android Studio opère désormais sur des unités de version complètes, et la détection des `node_modules` inutilisés ainsi que sa barrière de suppression dédiée ont été réparées. Un nettoyage antérieur en 1.4.0/1.5.0 peut laisser un cache extrait incomplet ; voir les étapes de récupération dans le journal des sources.

## 1.4.0 — 2026-07-11 {#140--2026-07-11}

### Modifié {#changed}

- **Passage à la [licence MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE).** Le logiciel était auparavant distribué sous une licence maison « Source-Available · No-Derivatives · Non-Commercial v1.0 ». Il est désormais libre, permissif et approuvé par l’OSI : utilisation, modification, fork, redistribution et usage commercial libres, avec attribution.

  L’avertissement « AS IS / sans responsabilité » de la MIT remplace les anciennes clauses de garantie, de responsabilité et d’indemnisation. `package.json` déclare désormais `"license": "MIT"`.

  Cela vaut pour la suite — **les versions publiées auparavant gardent la licence sous laquelle elles sont sorties.**

Aucun changement de code, de barrière de sécurité ni de CLI.

## 1.3.1 — 2026-05-10 {#131--2026-05-10}

Version consacrée à la documentation. Aucun changement de comportement.

### Ajouté {#added}

- Une arborescence `docs/` complète organisée selon le [cadre Diátaxis](https://diataxis.fr/) — tutoriels, guides pratiques, référence et explications. Chaque mode, option, chemin de sortie et code de sortie est documenté.
- Des pages pour chacun des seize modes, des pages de référence pour les options, les modes, les variables d’environnement, les chemins de sortie, les codes de sortie et le schéma JSON, ainsi que des recettes pratiques et une FAQ.
- Une section « Documentation complète » dans le README qui renvoie vers les pages les plus utilisées.

Le code, les barrières de sécurité et l’interface de la CLI sont identiques à la 1.3.0.

## 1.3.0 — 2026-05-10 {#130--2026-05-10}

Version de finition : un menu visuel et la capture automatique des plantages. Aucune nouvelle logique de nettoyage ; les barrières de sécurité et d’inactivité existantes sont inchangées.

### Ajouté {#added-1}

- **[Mode TUI](./modes/tui.md)** (`-t` / `--tui` / `-g` / `--gui`) — un menu piloté par whiptail ou dialog. Chaque choix repasse à la sortie normale de la CLI pendant l’exécution, puis revient au menu. Sans aucun des deux outils, il revient proprement au menu de la CLI avec une indication d’installation propre à la distribution.
- **Capture automatique de paquets de plantage** — un piège EXIT qui, lors d’une sortie inattendue non nulle, écrit dans `~/.linux-cleanup/feedback/` un `crash-<stamp>.tar.gz` autonome contenant le journal de session, l’enregistrement le plus récent et un manifeste du système, puis affiche une ligne que vous pouvez envoyer par e-mail.

  Rien n’est créé lors d’une sortie propre, avec `Ctrl-C` (130), `SIGTERM` (143) ni lors des sorties d’erreur d’arguments (2). **Aucun appel réseau** : le paquet reste sur votre machine jusqu’à ce que vous choisissiez de le partager.
- Une boîte de dialogue **À propos** dans la TUI, avec la version, les coordonnées, la licence et l’engagement de confidentialité.

### Modifié {#changed-1}

- La suppression du bandeau et du résumé de session inclut maintenant le mode `tui`, pour que la boîte de dialogue ne se batte pas avec la sortie du journal.

## 1.2.2 — 2026-05-10 {#122--2026-05-10}

### Corrigé {#fixed}

- Petites corrections de bogues et améliorations internes de la stabilité.

## 1.2.1 — 2026-05-10 {#121--2026-05-10}

Étend la barrière d’inactivité de la 1.2.0 à tout ce qui est un *outil* plutôt qu’un cache régénérable. Supprimer un tel élément exige désormais **à la fois** qu’aucun logiciel actif n’en dépende **et** que vous n’y ayez pas touché depuis `--days` jours.

### Modifié {#changed-2}

- **AVD Android** — auparavant `~/.android/avd` était effacé en entier à la confirmation. Désormais chaque dossier `*.avd` est examiné comme une unité, avec son `*.ini` voisin, et élagué seulement quand chaque fichier du profil dépasse le seuil d’inactivité. Les profils d’émulateur utilisés récemment restent intacts.
- **[Extensions remplacées de VS Code / Cursor](./modes/editor-extensions.md)** — la vérification « une version plus récente existe » couvrait la première condition ; le dossier remplacé doit *aussi* dépasser le seuil d’inactivité. Les anciennes versions chargées récemment sont listées mais conservées, avec leurs jours d’inactivité.
- **Données utilisateur Flatpak** — `~/.local/share/flatpak` contient des applications installées au niveau utilisateur, pas seulement des caches. Le module refuse désormais de toucher l’arborescence si une application utilisateur est installée, et exige en plus que l’arborescence dépasse le seuil d’inactivité. Il indique `flatpak uninstall --user --unused` comme voie plus sûre.

### Ajouté {#added-2}

- `newest_access_age_days <path>` — renvoie le nombre de jours depuis le `atime`/`mtime` le plus récent sous un chemin.
- `prune_stale_units <root> <days> [glob]` — traite chaque enfant de premier niveau comme indivisible, pour qu’un élagage partiel ne puisse pas corrompre l’état.

### Pourquoi {#why}

Un utilisateur a fait remarquer que la 1.2.0 effaçait encore entièrement les AVD Android, et que le même raisonnement devait s’appliquer à tout ce qui est un outil plutôt qu’un cache : ne pas supprimer un logiciel dont dépend un autre outil, ni un logiciel que l’utilisateur a lui-même utilisé récemment.

## 1.2.0 — 2026-05-10 {#120--2026-05-10}

**La stratégie de suppression par défaut devient « uniquement l’inutilisé ».** Rien n’est supprimé dans un cache ciblé tant que ses fichiers n’ont pas été laissés intacts — `atime` comme `mtime` — pendant `--days` jours, 100 par défaut.

### Modifié {#changed-3}

- **`clean_target`, le nettoyeur commun à tous les modules de cache, élague désormais au lieu de tout effacer.** Il ne supprime que les fichiers au-delà du seuil, puis balaie les dossiers vides. Les fichiers récemment utilisés restent, et la coquille du dossier aussi, pour que les outils retrouvent leur organisation.
- **[`--all-safe`](./modes/all-safe.md) élague chaque cible** de la même façon, et son résumé indique les octets libérés **et** les octets conservés par cible.
- **Le nettoyage du cache npm respecte la barrière d’inactivité** au lieu de lancer toujours `npm cache clean --force`, qui ignorait totalement l’âge.
- Le bandeau avant exécution indique la stratégie active — « prune ≥Nd » ou « FULL PURGE ».

### Ajouté {#added-3}

- **`--purge-all`** rétablit le comportement d’avant la 1.2.0, qui efface tout, documenté avec ses compromis.
- **`prune_stale <root> <days>`** — une fonction publique pour les modules, qui refuse les chemins protégés, ne supprime que là où les deux horodatages dépassent le seuil, balaie les dossiers vides et indique les octets libérés.

### Pourquoi {#why-1}

Le comportement par défaut de la 1.1.0 supprimait des arborescences de cache entières à la confirmation. C’était juste pour `~/.cache/yarn`, qui se régénère vite, et faux pour `~/.gradle/wrapper/dists/` — un téléchargement de 230 Mo dont vous pourriez vraiment avoir besoin le mois prochain.

Un seuil de 100 jours sépare nettement « j’y ai touché récemment et il me manquerait » de « je ne l’ai pas ouvert depuis trois mois ». Les utilisateurs avancés peuvent toujours forcer l’ancien comportement ou durcir la barrière avec `-d 30`.

## 1.1.0 — 2026-05-10 {#110--2026-05-10}

Version de renforcement de la sécurité. Ferme la porte à toute modification des paquets installés globalement et des fichiers d’initialisation du shell.

### Corrigé {#fixed-1}

- **Les paquets globaux de pnpm étaient effacés.** Le nettoyage du magasin de contenu de pnpm visait `~/.local/share/pnpm` (`PNPM_HOME`) — qui contient les paquets installés globalement, les raccourcis bin et le binaire `pnpm` lui-même issu de `pnpm setup`. Il ne vise plus que `~/.local/share/pnpm/store`, le cache régénérable adressé par contenu.

  Étaient concernés `--all-safe`, l’option 3 du menu, l’analyse, le parcours guidé et `--list-targets`.

### Ajouté — barrières de sécurité {#added--safety-guards}

- **[`PROTECTED_EXACT`](./reference/protected-paths.md#exact-match-protected-paths)** — un blocage par correspondance exacte des dossiers d’installation des gestionnaires de paquets et des dossiers des environnements d’exécution : pnpm, npm, yarn, bun, deno, volta, nvm, fnm, cargo, rustup et Go.
- **[`PROTECTED_BASENAMES`](./reference/protected-paths.md#protected-basenames)** — refuse tout chemin dont le nom est celui d’un fichier d’initialisation ou d’historique du shell, où qu’il se trouve.
- **Une assertion au démarrage de `--all-safe`** qui s’arrête avec un message `BUG:` si un dossier d’exécution protégé se glisse dans la liste des cibles, pour empêcher une régression silencieuse.

### Ajouté — prise en charge de bun et deno {#added--bun-and-deno-coverage}

- bun : nettoyage du cache dans `~/.bun/install/cache` ; `~/.bun/install/global` protégé.
- deno : nettoyage du cache dans `~/.cache/deno` ; `~/.deno/bin` protégé.
- Les deux sont branchés sur `--all-safe`, `--scan` et le nouvel audit des paquets globaux.

### Ajouté — modes {#added--modes}

- **[`--globals`](./modes/globals-audit.md)** — un audit en lecture seule qui liste les paquets globaux installés directement avec npm, pnpm, yarn, bun et deno, marque chacun `recently used`, `needed by: <pkg>` ou `STALE — safe to uninstall`, et affiche des commandes de désinstallation prêtes à copier. **Ne supprime jamais rien.** Fonctionne même quand la CLI du gestionnaire de paquets n’est pas dans le `PATH`.
- **[`--doctor`](./modes/doctor.md)** — détecte un environnement d’exécution présent sur le disque mais non branché dans l’initialisation du shell (nvm, pnpm, bun, deno, cargo) et propose d’ajouter le bloc standard. **Ajout uniquement, avec confirmation. Ne supprime ni ne modifie jamais de lignes existantes.**

### Modifié {#changed-4}

- `--all-safe` affiche explicitement les avis « globals are PRESERVED » et « shell-init files are NEVER touched ».

## 1.0.0 — 2026-05-09 {#100--2026-05-09}

Première version publique.

### Distribution {#distribution}

- Publié sur npm — exécutable avec `npx linux-cleanup` ou `npm install -g linux-cleanup`. Le paquet fournit un petit lanceur Node qui trouve le point d’entrée bash et range journaux et enregistrements dans `~/.linux-cleanup/` pour qu’ils survivent au nettoyage du dossier temporaire de npx.
- Le `git clone` direct est aussi pris en charge, la sortie restant dans le clone.

### Fonctions {#features}

- **Parcours guidé en dix étapes** comme mode par défaut, avec des en-têtes de progression, des questions `a` / `s` / `q`, les octets libérés à chaque étape et un total cumulé.
- **Sécurité fondée sur une liste de chemins autorisés** — refuse tout chemin d’une liste protégée choisie avec soin, ainsi que `$HOME` et `/` nus.
- **Données personnelles en mode interactif uniquement** — jamais en lot, jamais avec `--yes`.
- **Catégories de nettoyage** — caches des gestionnaires de paquets (yarn, npm, pnpm, pip, composer) ; caches d’applications (Chrome, Firefox, Brave, Chromium, Edge, Vivaldi, Gradle, Cypress, Playwright, TypeScript, Zoom) ; outils de développement (AVD Android, pub-cache, Dart, flatpak) ; extensions d’éditeurs ; `node_modules` inutilisés ; téléchargements partiels et fichiers personnels inutilisés ; nettoyage du système avec sudo.
- **Enregistrements de session** — JSON standard écrit à chaque exécution, avec export Markdown et HTML à la demande. Le HTML utilise un CSS intégré qui tient compte du mode sombre.
- **[Gestionnaire de rapports](./modes/reports.md)** (`--reports`) et `--export FMT ID` non interactif.
- **Autotest** (`--self-test`) qui vérifie les dépendances, la syntaxe de chaque fichier shell et le bon état des barrières de sécurité — en s’assurant que la protection renvoie true pour `/`, `$HOME`, `~/Documents` et `/etc`.
- **`--feedback`** et **`--debug-bundle`** pour des rapports de bogue structurés.
- **Confidentialité** — aucun appel réseau. Ni télémétrie, ni analyse, ni rapport de plantage. Les seules données qui quittent votre machine sont celles que vous choisissez d’envoyer par e-mail.
- **Crédits dans chaque fichier produit** — les journaux commencent par un en-tête qui indique leur origine, les enregistrements portent un bloc `credits` de premier niveau, et la sortie HTML est créditée en pied de page.
- **Aides à l’installation** — `--install-alias`, `--install-cron` et leurs pendants de désinstallation.
- Prise en charge de `NO_COLOR` et de `--no-color`.

### Sécurité et renforcement {#security-and-safety-hardening}

- La sortie HTML échappe toutes les valeurs issues du JSON avec le filtre `@html` de `jq`, pour empêcher une injection depuis un enregistrement mal formé.
- Gardes `command -v` sur chaque dépendance facultative (`snap`, `crontab`, `xdg-open`, `jq`).
- `realpath -m` résout les liens symboliques avant toute vérification des chemins protégés, si bien qu’un lien symbolique ne peut pas contourner la liste des chemins autorisés.

## En amont {#upstream}

Le journal des modifications de référence se trouve dans le [dépôt des sources](https://github.com/aoneahsan/linux-cleanup/blob/main/CHANGELOG.md).
