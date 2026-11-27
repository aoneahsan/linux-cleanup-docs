---
title: Dépannage
description: "Symptôme, cause et solution pour les problèmes que rencontrent vraiment les utilisateurs de linux-cleanup : refus, dépendances manquantes, échecs de cron, analyses lentes et confusion de versions."
sidebar_position: 92
---

# Dépannage

Symptôme → cause → solution. Lancez d’abord la commande de vérification ; si elle correspond, appliquez la solution.

Si vous avez perdu des données plutôt que rencontré une erreur, allez plutôt à [Récupération](./recovery.md).

## REFUSE: protected path {#refuse-protected-path}

```text
✗ REFUSE: protected path: /home/you/Documents/something
```

**Cause.** Une fois les liens symboliques résolus, le chemin aboutissait à un emplacement de la [liste protégée](./reference/protected-paths.md). La liste de chemins autorisés l’a bloqué.

**C’est le comportement attendu, pas une panne.** Rien n’a été supprimé.

**Solution.** Déterminez ce qui a abouti où :

```bash
linux-cleanup --list-targets
realpath <the path that was rejected>
```

C’est presque toujours un cache relié par lien symbolique à un dossier protégé. **Corrigez le lien, pas l’outil** : l’outil fait exactement son travail. Il n’existe aucune option de contournement, et c’est voulu.

Deux messages proches :

```text
✗ REFUSE: unsafe path: '/home/you'            # $HOME ou / tout seul
✗ REFUSE: shell-init / history file: …        # .bashrc, .zshrc et apparentés
```

## TUI mode needs whiptail or dialog {#tui-mode-needs-whiptail-or-dialog}

**Cause.** `--tui` a été lancé sans qu’aucun des deux ne soit installé.

**Solution.** Installez-en un, ou acceptez le repli proposé vers le menu de la CLI.

```bash
sudo apt install whiptail     # Debian / Ubuntu
sudo dnf install newt         # Fedora / RHEL
sudo pacman -S libnewt        # Arch
```

**Vérification.** `command -v whiptail`, puis relancez. Voir [TUI](./modes/tui.md).

## export requires jq {#export-requires-jq}

**Cause.** `--export md`, `--export html` ou une conversion dans le gestionnaire de rapports sans `jq` installé.

**Solution.**

```bash
sudo apt install jq
```

`jq` n’est nécessaire que pour la conversion. Les enregistrements JSON sont écrits à chaque exécution même sans lui. Voir [Rapports](./modes/reports.md).

## command not found {#command-not-found}

**Cause.** Une dépendance nécessaire manque ou est masquée par un alias incompatible. Fréquent sur les conteneurs minimaux livrés avec BusyBox au lieu de GNU coreutils.

**Vérification.**

```bash
linux-cleanup --self-test
```

Il teste chaque commande nécessaire et nomme la première qui manque.

**Solution.** Installez les paquets coreutils, findutils et gawk de votre distribution. Sous Alpine :

```bash
apk add coreutils findutils bash
```

`realpath` est le plus important : c’est lui qui rend la [vérification des chemins protégés](./reference/protected-paths.md) sûre face aux liens symboliques. Voir [Distributions prises en charge](./distro-support.md#minimal-containers).

## La tâche cron s’exécute mais ne fait rien {#cron-entry-runs-but-does-nothing}

**Vérification.**

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

**Cause.** Un `command not found` dans le journal cron signifie que le `PATH` minimal de cron (`/usr/bin:/bin`) ne voit pas votre installation. C’est le problème cron le plus fréquent.

**Solution.** Utilisez un chemin absolu dans la crontab :

```bash
crontab -e
# Remplacez :  0 3 * * 0 linux-cleanup --all-safe -y …
# Par :  0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y …
```

Trouvez le bon chemin avec `command -v linux-cleanup`. Vous pouvez aussi ajouter une ligne `PATH=` en tête de la crontab. Voir [Alias et cron](./guides/alias-and-cron.md).

## $HOME is not set {#home-is-not-set}

```text
✗ $HOME is not set
```

**Cause.** Exécution dans un contexte qui ne définit pas `$HOME` : certaines images Docker, certains exécuteurs de CI.

**Solution.**

```bash
HOME=/root linux-cleanup --scan
```

Ou exportez-la une fois pour la session. Le script s’arrête au lieu de deviner, délibérément : un `$HOME` erroné ferait évaluer chaque vérification de chemin sur la mauvaise arborescence.

## L’analyse ou --node-modules semble bloqué {#scan-or---node-modules-seems-to-hang}

**Cause.** `find` parcourt des milliers de dossiers sous `$HOME`. Sur un disque mécanique, la première exécution prend une à trois minutes.

**Vérification.** Surveillez le journal plutôt que le terminal :

```bash
tail -f ~/.linux-cleanup/logs/cleanup-*.log
```

De nouvelles lignes toutes les cinq à dix secondes signifient qu’il travaille.

**Solution.** Patientez lors de la première exécution ; les suivantes sont plus rapides grâce aux métadonnées de dossiers en cache. Si le même chemin bloque systématiquement plus de cinq minutes, soupçonnez une boucle de liens symboliques ou un montage réseau ou FUSE qui ne répond pas, et [signalez-le](./guides/send-a-bug-report.md).

## L’occupation du disque a augmenté pendant la session {#disk-usage-grew-during-the-session}

**Cause.** L’espace libéré affiché est un écart de `df` sur toute la machine. Un autre processus (une compilation, une mise à jour de paquets, la rotation du journal, un IDE qui réindexe) a écrit davantage pendant la session que ce que le nettoyage a libéré.

**Ce n’est pas un bogue**, et cela ne veut pas dire que le nettoyage a échoué. Regardez ce que les étapes elles-mêmes ont indiqué :

```bash
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

**Solution.** Relancez `--scan` quand la machine est au calme pour voir la situation réelle.

## apt update échoue après --system {#apt-update-fails-after---system}

**Cause.** Rare. `apt clean` ne casse pas `apt update`, mais le nettoyage a pu croiser une autre opération apt qui détenait un verrou.

**Vérification.**

```bash
sudo apt update 2>&1 | tail -20
```

**Solution.**

```bash
sudo rm -f /var/lib/apt/lists/lock /var/cache/apt/archives/lock /var/lib/dpkg/lock-frontend
sudo apt update
```

Ne le faites que si aucun processus apt ne tourne vraiment : d’abord `ps aux | grep -i apt`.

## VS Code signale une extension manquante {#vs-code-reports-a-missing-extension}

**Cause.** Généralement le comportement attendu : une version remplacée a été supprimée alors que l’éditeur y faisait encore référence.

**Solution.** Rechargez la fenêtre : `Ctrl+Shift+P` → **Developer: Reload Window**.

**Vérifiez** que la version actuelle est toujours là :

```bash
ls ~/.vscode/extensions/ | grep <extension-name>
```

Si la version *actuelle* a vraiment disparu, cela indique un bogue dans la détection de la version la plus récente. Réinstallez-la et [signalez-le](./guides/send-a-bug-report.md) :

```bash
code --install-extension <publisher>.<name>
```

## Un paquet de plantage est apparu sans plantage visible {#a-crash-bundle-appeared-but-i-saw-no-crash}

**Cause.** Le script s’est terminé avec un code non nul à un endroit inattendu : un `find` en arrière-plan tué par l’OOM killer, ou un tube rompu.

**Solution.** Lisez le code de sortie dans le manifeste du paquet :

```bash
tar -xzOf ~/.linux-cleanup/feedback/crash-*.tar.gz --wildcards '*MANIFEST*'
```

`137` correspond à l’OOM killer, `141` à SIGPIPE, `139` à une erreur de segmentation. Voir [Codes de sortie](./reference/exit-codes.md). Chacun mérite d’être signalé.

## L’alias cleanup est introuvable après --install-alias {#alias-cleanup-not-found-after---install-alias}

**Cause.** Le fichier rc du shell n’a pas été relu.

**Solution.**

```bash
source ~/.bashrc      # ou ~/.zshrc
```

Ou ouvrez un nouveau terminal.

## La mauvaise version s’exécute {#wrong-version-running}

**Vérification.**

```bash
command -v linux-cleanup
linux-cleanup --version
```

**Cause.** Une ancienne installation globale qui masque un cache `npx` plus récent, ou une table de hachage des commandes du shell périmée.

**Solution.**

```bash
npm uninstall -g linux-cleanup
npm install -g linux-cleanup@latest
hash -r
linux-cleanup --version
```

Consultez le [paquet npm](https://www.npmjs.com/package/linux-cleanup) pour la version publiée actuelle. Parcourez le [journal des modifications](./changelog.md) pour les changements depuis votre copie installée.

## Toujours bloqué {#still-stuck}

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

Examinez le paquet, puis envoyez-le par e-mail avec une courte description de ce que vous attendiez et de ce qui s’est passé. Voir [Envoyer un rapport de bogue](./guides/send-a-bug-report.md).
