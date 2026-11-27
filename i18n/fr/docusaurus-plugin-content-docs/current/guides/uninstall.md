---
title: Désinstaller
description: "Retirer complètement linux-cleanup : le paquet, l’alias shell, l’entrée cron, ses journaux et ses enregistrements de session."
sidebar_position: 4
---

# Désinstaller

**Retirez d’abord l’automatisation, puis le paquet, puis les données.** Désinstaller le paquet ne retire pas un alias shell ou une entrée cron que vous avez installés : ce sont des éléments séparés.

## 1. Retirer l’automatisation {#1-remove-the-automation}

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

Faites-le **avant** de retirer le paquet, tant que la commande existe encore. Si vous l’avez déjà retiré, voir la [suppression manuelle](#if-you-removed-the-package-first) plus bas.

Vérifiez :

```bash
crontab -l | grep -i cleanup     # aucune sortie attendue
grep -rn 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

## 2. Retirer le paquet {#2-remove-the-package}

```bash
npm uninstall -g linux-cleanup
```

Avec `npx`, rien n’est installé : le cache npm s’en débarrasse tout seul. Pour le vider maintenant :

```bash
npm cache clean --force
```

Pour un git clone, supprimez le dossier :

```bash
rm -rf ~/linux-cleanup
```

:::caution Un clone garde ses propres journaux et enregistrements
Contrairement aux installations npm, un clone garde sa sortie dans `<clone>/logs/` et `<clone>/reports/`. Supprimer le clone les supprime aussi. Copiez d’abord ce que vous voulez garder. Voir [Chemins de sortie](../reference/output-paths.md).
:::

## 3. Retirer les données {#3-remove-the-data}

Les journaux, enregistrements de session et paquets de retour se trouvent dans `~/.linux-cleanup/` et ne sont **jamais** supprimés par la désinstallation.

```bash
ls -la ~/.linux-cleanup/           # regardez avant de supprimer
rm -rf ~/.linux-cleanup/
```

Ils sont petits (en général quelques mégaoctets) et constituent le seul récit de ce que les exécutions passées ont supprimé. Les garder ne coûte rien ; les supprimer est irréversible, comme le reste.

Si vous avez défini `LINUX_CLEANUP_DATA_HOME`, supprimez plutôt ce dossier, et retirez l’export de votre configuration shell.

## 4. Retirer la configuration, si vous en avez créé {#4-remove-configuration-if-you-created-any}

```bash
rm -f ~/.config/personal-roots.txt ~/.config/project-roots.txt
```

Ces fichiers n’existent que si vous les avez créés. Voir [Variables d’environnement](../reference/environment-variables.md#configuring-the-scanned-roots).

## Si vous avez retiré le paquet en premier {#if-you-removed-the-package-first}

Défaites les deux aides à la main.

**Cron :**

```bash
crontab -e
# supprimez la ligne contenant linux-cleanup ou cleanup.sh
```

**Alias :**

```bash
grep -n 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

Supprimez la ligne d’alias correspondante dans votre éditeur, puis faites un `source` du fichier ou ouvrez un nouveau terminal.

## Ce qui reste {#what-is-left-behind}

Rien, une fois ce qui précède fait. L’outil n’installe aucun service système, démon, unité systemd, entrée dans `/etc` ni fichier appartenant à root. Tout ce qu’il crée se trouve dans votre dossier personnel.

Effets sur votre système qu’il ne défait pas, parce que ce ne sont pas des fichiers à lui :

- **Les caches supprimés le restent.** Ils se régénèrent quand chaque outil en a besoin
- **Les blocs d’initialisation du shell ajoutés par [`--doctor`](../modes/doctor.md)** restent. C’est la bonne configuration pour les environnements que vous avez installés ; retirez-les à la main si vous n’en voulez plus

## Vérifier {#verify}

```bash
command -v linux-cleanup      # aucune sortie attendue
crontab -l | grep -i cleanup  # aucune sortie attendue
ls ~/.linux-cleanup 2>&1      # attendu : No such file or directory
```

## Ensuite {#next}

- [Installation](../getting-started/installation.md) — si vous réinstallez
