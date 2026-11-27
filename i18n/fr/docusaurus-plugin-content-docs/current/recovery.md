---
title: Récupération
description: "Que faire après une suppression non voulue par linux-cleanup : examiner les journaux disponibles, restaurer depuis une sauvegarde ou la source, et éviter d’écrire sur le disque quand la récupération compte."
sidebar_position: 91
---

# Récupération

**linux-cleanup n’a pas d’annulation.** Cette page aide à déterminer ce qui a été supprimé et quelles sont vos vraies options.

:::danger D’abord, arrêtez d’écrire sur le disque
Si quelque chose d’irremplaçable a été supprimé et que vous comptez tenter une récupération par carving, **cessez d’utiliser le système de fichiers maintenant**. Chaque écriture réduit les chances de récupérer les données dissociées.

Cela ne vaut que pour les [catégories vraiment irremplaçables](#3-decide-what-is-actually-recoverable). Pour un cache, inutile : laissez simplement l’outil concerné le retélécharger.
:::

## 1. Examiner l’enregistrement disponible {#1-inspect-the-available-record}

Une exécution peut laisser un journal local. Un parcours guidé peut aussi laisser un enregistrement de session JSON, sauf si les rapports ont été désactivés. Aucun n’est un relevé complet fichier par fichier ni une sauvegarde.

```bash
# Le journal de session le plus récent
less "$(ls -t ~/.linux-cleanup/logs/cleanup-*.log | head -1)"

# Le dernier enregistrement de parcours guidé, s’il existe
jq '.' "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

Pour chercher un chemin précis dans les journaux conservés :

```bash
grep -rn 'the-filename-you-are-missing' ~/.linux-cleanup/logs/
```

L’absence de résultat ne prouve pas que l’outil a épargné ce fichier. Un programme auxiliaire peut signaler un dossier de cache entier ou une commande plutôt que chaque fichier, et `--cleanup-logs` peut supprimer le journal d’une exécution. Vérifiez aussi le mode choisi et les racines cibles.

Pour s’en tenir aux étapes d’une seule session :

```bash
jq '.steps[] | select(.status == "ran")' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

## 2. Vérifier qu’il ne s’agissait pas d’un simple refus {#2-confirm-it-was-not-simply-refused}

Les refus sont eux aussi journalisés. Si vous trouvez une ligne comme celle-ci, rien n’a été supprimé :

```text
✗ REFUSE: protected path: /home/you/Documents/notes
```

Voir [Chemins protégés](./reference/protected-paths.md).

## 3. Déterminer ce qui est réellement récupérable {#3-decide-what-is-actually-recoverable}

| Ce qui a été supprimé | Récupération |
|---|---|
| Cache d’un gestionnaire de paquets | **Automatique.** La prochaine installation le retélécharge |
| Cache du navigateur | **Automatique.** Il se reconstruit au fil de la navigation |
| Cache Gradle ou distribution du wrapper | **Automatique.** La prochaine compilation le récupère — attendez-vous à une première compilation lente |
| Binaires Cypress / Playwright | Relancez l’étape d’installation de l’outil |
| `node_modules` | `yarn install` ou `npm install` dans le projet |
| AVD Android | Recréez-le dans Android Studio. **La configuration du profil est perdue** ; l’image système se retélécharge |
| Version d’une extension d’éditeur | Rechargez la fenêtre de l’éditeur ; réinstallez si elle manque vraiment |
| Cache apt, journal, révisions snap | Ils se régénèrent seuls. Rien à faire |
| **Fichier personnel de `~/Downloads`** | **Uniquement depuis votre propre sauvegarde**, ou en le retéléchargeant à la source |
| **Téléchargement partiel** | Irrécupérable. Relancez le téléchargement |

### Régénérer les plus courants {#regenerating-the-common-ones}

```bash
# Dans le projet concerné
yarn install            # ou : npm install / pnpm install

# Binaires des lanceurs de tests
npx cypress install
npx playwright install

# Flutter
flutter pub get
```

Rien de tout cela n’a besoin de linux-cleanup : vous laissez simplement chaque outil faire ce qu’il fait avec un cache vide.

## 4. Si c’était vraiment irremplaçable {#4-if-it-was-genuinely-irreplaceable}

De façon réaliste, dans l’ordre :

1. **Votre propre sauvegarde.** Timeshift, Borg, restic, un instantané rsync, une synchronisation cloud : ce que vous utilisez. C’est la seule réponse fiable.
2. **La source d’origine.** Un fichier téléchargé peut l’être de nouveau. Cherchez l’URL dans l’historique du navigateur.
3. **La corbeille d’un service de synchronisation.** Dropbox, Nextcloud, Google Drive et consorts conservent les fichiers supprimés côté serveur pendant un certain temps. Si le dossier était synchronisé, regardez là.
4. **Les outils de carving** — `extundelete`, `testdisk`, `photorec`. Ils travaillent sur les inodes dissociés et ont peu de chances sur un système de fichiers très sollicité, en particulier un SSD avec TRIM activé. Démontez d’abord le système de fichiers ou travaillez depuis une clé USB live, et n’écrivez jamais les données récupérées sur le même périphérique.

:::caution Soyez lucide sur l’étape 4
Sur un SSD monté, utilisé activement et avec TRIM, le carving ne récupère généralement rien. Il ne vaut la peine d’être tenté que pour quelque chose de vraiment important, et seulement après avoir cessé d’écrire sur le disque.
:::

## 5. Éviter que cela se reproduise {#5-stop-it-happening-again}

| Changement | Effet |
|---|---|
| Lancer [`--scan`](./modes/scan.md) avant chaque nettoyage | Vous voyez le résultat tant qu’il est encore hypothétique |
| Sortir les fichiers précieux de `~/Downloads` | `~/Documents` et `~/Desktop` sont [protégés](./reference/protected-paths.md) |
| Passer l’étape 7 du parcours | Les fichiers personnels demandent alors une exécution séparée et délibérée |
| Relever le seuil : `-d 365` | Seuls les fichiers vraiment anciens deviennent candidats |
| Ne jamais utiliser `-y` hors de `--all-safe` sur une machine de confiance | `-y` ne peut pas toucher aux données personnelles, mais vous ne voyez les décisions qu’après coup |
| Mettre en place une vraie sauvegarde | La seule chose qui rend une suppression récupérable |

## 6. Si l’outil a fait ce qu’il n’aurait pas dû {#6-if-the-tool-did-something-it-should-not-have}

Si une suppression a eu lieu dans un [chemin protégé](./reference/protected-paths.md), si la version *actuelle* d’une extension d’éditeur a été supprimée, ou si quoi que ce soit contredit les garde-fous documentés, c’est un bogue à signaler.

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

Joignez le journal et, s’il existe, l’enregistrement du parcours guidé. Voir [Envoyer un rapport de bogue](./guides/send-a-bug-report.md).

## Ensuite {#next}

- [La suppression est définitive](./safety/irreversibility.md) — la conception derrière l’absence d’annulation
- [Prévisualiser avant de supprimer](./safety/preview-first.md) — éviter d’en arriver là
- [Dépannage](./troubleshooting.md) — pour les problèmes sans perte de données
