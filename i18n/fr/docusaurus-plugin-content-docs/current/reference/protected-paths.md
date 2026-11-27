---
title: Chemins protégés
description: "La liste complète et vérifiée des chemins que linux-cleanup refuse de supprimer : racines du système, dossiers personnels, racines d’installation des gestionnaires de paquets et noms des fichiers d’initialisation du shell."
sidebar_position: 3
---

# Chemins protégés

**Voici les chemins que linux-cleanup refuse de supprimer.** Le refus est inconditionnel : aucune option ne le lève, pas même `--purge-all`.

Chaque candidat est résolu avec `realpath` avant la vérification, donc un lien symbolique qui pointe dans un dossier protégé est refusé d’après le chemin résolu, pas d’après le lien.

:::tip Vérifiez sur votre propre installation plutôt que de vous fier à cette page
Les listes changent d’une version à l’autre, et des descriptions de seconde main de cet outil circulent avec des dossiers qui **ne** sont **pas** réellement protégés.

```bash
linux-cleanup --list-targets   # les listes telles que votre version les voit
linux-cleanup --self-test      # vérifie que la barrière se déclenche sur des chemins connus
```
:::

## Trois listes distinctes {#three-separate-lists}

La barrière repose sur trois listes aux règles de correspondance différentes. La distinction compte : c’est elle qui permet de nettoyer `~/.npm/_cacache` tandis que `~/.npm` lui-même reste intouchable.

| Liste | Correspond à | Rôle |
|---|---|---|
| Chemins protégés | Le chemin **et tout ce qu’il contient** | Données personnelles, identifiants, configuration |
| Protégés exacts | **Ce chemin exact uniquement** | Racines d’installation des gestionnaires de paquets |
| Noms protégés | **Tout fichier portant ce nom, n’importe où** | Fichiers d’initialisation et d’historique du shell |

## Racines du système {#system-roots}

Refusées comme chemin ou pour tout élément en dessous, sauf indication contraire.

| Chemin | Contenu également refusé |
|---|---|
| `/` | — (la racine elle-même) |
| `/home` | Non — seulement le chemin exact |
| `/root` | Non — seulement le chemin exact |
| `/etc` | **Oui** |
| `/boot` | **Oui** |
| `/usr` | **Oui** |
| `/var` | Non — seulement le chemin exact |
| `/lib` | Non — seulement le chemin exact |
| `/sbin` | Non — seulement le chemin exact |
| `/bin` | Non — seulement le chemin exact |
| `$HOME` | Non — la racine du dossier personnel elle-même, pour qu’un `$HOME` nu ne puisse jamais être vidé |

:::note `/proc` et `/sys` ne figurent pas dans cette liste
Aucune cible de nettoyage n’en approche, mais la liste des chemins autorisés ne les nomme pas explicitement. Certaines descriptions de cet outil affirment le contraire. C’est faux.
:::

## Dossiers personnels {#personal-directories}

Refusés avec tout ce qu’ils contiennent.

| Chemin | Contient |
|---|---|
| `~/Documents` | Documents |
| `~/Pictures` | Images |
| `~/Music` | Audio |
| `~/Videos` | Vidéo |
| `~/Desktop` | Contenu du bureau |
| `~/Public` | Fichiers partagés |
| `~/Templates` | Modèles de documents |

:::caution `~/Downloads` n’est volontairement PAS protégé
Il ne peut pas l’être : y nettoyer les gros fichiers inutilisés depuis longtemps est une fonction ([Fichiers personnels inutilisés](../modes/personal-stale-files.md)). Ce qui le protège, c’est [la barrière 3](../safety/guards.md#guard-3--personal-data-is-interactive-only) : interactif uniquement, confirmation fichier par fichier, et `--yes` ignoré.

Si vous gardez quelque chose d’irremplaçable dans `~/Downloads`, déplacez-le dans un dossier protégé. C’est la solution durable.
:::

## Identifiants, configuration et état des agents {#credentials-configuration-and-agent-state}

| Chemin | Contient |
|---|---|
| `~/.ssh` | Clés SSH et hôtes connus |
| `~/.gnupg` | Trousseau GPG |
| `~/.config` | Configuration des applications (très large) |
| `~/.gnome` | Réglages GNOME |
| `~/.mozilla` | Profils Firefox |
| `~/.thunderbird` | Profils Thunderbird |
| `~/.claude` | État de Claude Code |
| `~/.local/share/claude` | Données de Claude Code |

:::danger Deux chemins souvent présentés comme protégés ne le sont PAS
**`~/.password-store`** (pass) et **`~/.aws`** (identifiants AWS) ne figurent **pas** dans la liste protégée du code source. Certains textes sur cet outil affirment le contraire.

En pratique, aucune cible de nettoyage ne les vise, donc ni l’un ni l’autre n’est en danger en usage normal — mais ne comptez pas sur la liste des chemins autorisés pour les défendre. Si vous voulez cette garantie, vérifiez d’abord avec `--list-targets` sur votre installation.
:::

Notez que la protection de `~/.mozilla` n’empêche pas le nettoyage du cache de Firefox : le cache se trouve dans `~/.cache/mozilla`, une autre arborescence.

## Chemins protégés par correspondance exacte {#exact-match-protected-paths}

Correspondance **exacte**, le contenu reste nettoyable. C’est ce qui préserve vos paquets installés globalement tout en permettant d’élaguer le cache régénérable de chaque racine d’installation.

| Écosystème | Chemins |
|---|---|
| pnpm | `~/.local/share/pnpm` et ses dossiers `global`, `bin`, `nodejs` |
| npm | `~/.npm`, `~/.npm-global`, `~/.npm-global/lib`, `~/.npm-global/lib/node_modules` |
| yarn | `~/.yarn`, `~/.config/yarn/global` |
| bun | `~/.bun`, `~/.bun/install`, `~/.bun/install/global` et son dossier `node_modules`, `~/.bun/bin` |
| deno | `~/.deno`, `~/.deno/bin` |
| Gestionnaires de versions de Node | `~/.volta`, `~/.volta/bin`, `~/.nvm`, `~/.nvm/versions`, `~/.fnm` |
| Rust | `~/.cargo`, `~/.cargo/bin`, `~/.rustup` |
| Go | `~/go`, `~/go/bin` |

Cette liste existe à cause d’un vrai défaut : avant la [1.1.0](../changelog.md#110--2026-05-10), le nettoyage de pnpm visait `~/.local/share/pnpm` — la racine d’installation — et supprimait les paquets installés globalement ainsi que le binaire `pnpm` lui-même. Le correctif a limité la cible à `~/.local/share/pnpm/store` et ajouté cette liste pour que l’erreur ne se reproduise pas.

[`--all-safe`](../modes/all-safe.md) vérifie aussi au démarrage qu’aucun d’eux n’apparaît jamais dans sa liste de cibles, et s’arrête avec un message `BUG:` si c’est le cas.

## Noms de fichiers protégés {#protected-basenames}

Refusés **par nom de fichier, à n’importe quel emplacement**, quel que soit le chemin qui y mène :

`.bashrc` · `.bash_profile` · `.bash_login` · `.profile` · `.bash_logout` · `.zshrc` · `.zshenv` ·
`.zprofile` · `.zlogin` · `.zlogout` · `.bash_aliases` · `.bash_history` · `.zsh_history` · `.inputrc` ·
`.dircolors` · `.config` · `.local`

C’est une barrière de dernier recours. Elle existe pour qu’un futur bogue qui ferait entrer un fichier d’initialisation du shell dans une liste de cibles ne puisse toujours pas le supprimer.

## À quoi ressemble un refus {#what-a-refusal-looks-like}

```text
✗ REFUSE: protected path: /home/you/Documents/notes
✗ REFUSE: unsafe path: '/home/you'
✗ REFUSE: shell-init / history file: /home/you/.bashrc
```

Un refus est le comportement attendu, pas une erreur à contourner. Si un cache que vous voulez nettoyer est refusé, la cause est presque toujours un lien symbolique qui aboutit dans un endroit protégé : corrigez le lien, pas l’outil. Voir [Dépannage](../troubleshooting.md#refuse-protected-path).

## Ensuite {#next}

- [Barrières de sécurité](../safety/guards.md) — comment cette liste s’applique
- [Ce qu’il supprime](../safety/what-it-deletes.md) — l’autre côté de la frontière
