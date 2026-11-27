---
title: ڈسٹرو سپورٹ
description: linux-cleanup ہر Linux ڈسٹری بیوشن پر کیا کرتا ہے — کیش صفائی ہر جگہ کام کرتی ہے، مگر sudo والا --system موڈ صرف Debian اور Ubuntu کے لیے ہے۔
sidebar_position: 90
---

# ڈسٹرو سپورٹ

**ہوم کیش کی صفائی ان Linux ڈسٹری بیوشنز کے لیے بنی ہے جن میں ضروری GNU ٹولز ہوں۔**
[`--system`](./modes/system-cleanup.md)، Debian اور Ubuntu کی پیکیج کمانڈز استعمال کرتا ہے۔ صفائی سے پہلے `--self-test` سے انسٹال ٹولز جانچیں۔

## خلاصہ {#the-summary}

| ڈسٹرو خاندان | `$HOME` کیش صفائی | `--system` |
|---|---|---|
| Debian, Ubuntu, Mint, Pop!\_OS | مکمل | **مکمل** |
| Fedora, RHEL, Rocky, Alma | ضروری ٹولز کے ساتھ | استعمال نہ کریں: apt مراحل ناکام ہوتے ہیں |
| Arch, Manjaro, EndeavourOS | ضروری ٹولز کے ساتھ | استعمال نہ کریں: apt مراحل ناکام ہوتے ہیں |
| openSUSE | ضروری ٹولز کے ساتھ | استعمال نہ کریں: apt مراحل ناکام ہوتے ہیں |
| Alpine، مختصر کنٹینرز | Bash اور GNU ٹولز چاہئیں | استعمال نہ کریں: apt مراحل ناکام ہوتے ہیں |
| WSL | ضروری ٹولز کے ساتھ | صرف Debian/Ubuntu؛ پہلے ماؤنٹ پاتھس جانچیں |

:::warning `--system` ڈسٹرو نہیں پہچانتا
apt مراحل سیدھے `apt` اور `dpkg` چلاتے ہیں، نہ `command -v` جانچ ہے، نہ `dnf`، `pacman` یا `zypper` پر لوٹنا۔ غیر Debian سسٹم پر ہر مرحلہ "command not found" سے ناکام ہوتا ہے۔

apt ناکام ہونے کے بعد موڈ رکتا نہیں: بعد کے مراحل پھر بھی چل سکتے ہیں۔ دوسری ڈسٹری بیوشنز پر اس سے بچیں۔

اس ٹول کی کچھ تفصیلات `--system` کے لیے کئی ڈسٹروز کی درجہ وار سپورٹ کا دعویٰ کرتی ہیں، جس میں `apt` کی جگہ `dnf` اور Arch پر `paccache` ہو۔ **ایسا کوئی کوڈ موجود نہیں۔** کسی کلون پر `grep -rn 'dnf\|pacman\|zypper' modules/system_sudo.sh` سے تصدیق کریں — یہ کچھ نہیں لوٹاتا۔
:::

## مرحلہ وار {#step-by-step}

| `--system` مرحلہ | Debian/Ubuntu | Fedora/RHEL | Arch | openSUSE |
|---|---|---|---|---|
| `apt autoremove` + `apt clean` | کام کرتا ہے | **ناکام** | **ناکام** | **ناکام** |
| `journalctl --vacuum-size=100M` | کام کرتا ہے | کام کرتا ہے | کام کرتا ہے | کام کرتا ہے |
| بند کیے گئے snap ورژنز | کام کرتا ہے | اگر snap انسٹال ہو | اگر snap انسٹال ہو | اگر snap انسٹال ہو |
| کرنل فہرست (`dpkg --list`) | کام کرتا ہے | خاموش — کچھ نہیں دکھاتا | خاموش | خاموش |
| 7 دن سے پرانی `/tmp` فائلیں | کام کرتا ہے | کام کرتا ہے | کام کرتا ہے | کام کرتا ہے |
| پیج کیش خالی کرنا | کام کرتا ہے | کام کرتا ہے | کام کرتا ہے | کام کرتا ہے |

جرنل، `/tmp` اور پیج کیش والے مراحل `journalctl`، `find` اور `sysctl` پر چلتے ہیں، جو systemd والی ہر جگہ ایک جیسے چلتے ہیں۔ کرنل والا مرحلہ ویسے بھی صرف فہرست بناتا ہے، اس لیے غیر dpkg سسٹمز پر اس کی ناکامی سے کوئی نقصان نہیں۔

## پیکیج والا حصہ خود کرنا {#doing-the-package-part-yourself}

غیر Debian سسٹم پر اس کے پیکیج مینیجر کی اپنی دیکھ بھال کی ہدایات مانیں۔ نیچے کی کمانڈز مثالیں ہیں، چلانے سے پہلے پڑھیں:

```bash
# Fedora / RHEL / Rocky
sudo dnf autoremove
sudo dnf clean all

# Arch / Manjaro  (paccache، pacman-contrib میں ہے)
sudo pacman -Rns "$(pacman -Qtdq)"    # یتیم پیکیجز، اگر ہوں
sudo paccache -r                       # آخری 3 ورژن رکھتا ہے
sudo pacman -Scc                       # پورا پیکیج کیش خالی کرتا ہے

# openSUSE
sudo zypper clean --all
sudo zypper packages --orphaned
```

ہوم کیش کے لیے، دیکھیں کہ linux-cleanup کیا پاتا ہے:

```bash
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

## ہوم کیش کے اہداف {#home-cache-targets}

ہوم کے پاتھس ڈسٹری بیوشن سے نہیں، انسٹال ٹولز سے آتے ہیں۔ ہر مشین پر موجودگی الگ ہے:

- پیکیج مینیجر کیش — yarn, npm, pnpm, pip, composer, bun, deno
- براؤزر کیش — Chrome, Firefox, Brave, Chromium, Edge, Vivaldi
- بلڈ ٹول کیش — Gradle, Cypress, Playwright, TypeScript
- ڈیولپر ٹول ڈیٹا — Android AVD, Flutter pub-cache, Dart, flatpak
- ایڈیٹر ایکسٹینشنز — VS Code, Cursor
- `node_modules`، ادھورے ڈاؤن لوڈز، پرانی ذاتی فائلیں
- اسکین، جانچ، حفاظتی جانچیں اور مقامی لاگز

## مختصر کنٹینرز {#minimal-containers}

Alpine اور دوسری مختصر امیجز میں عموماً GNU coreutils کے بجائے BusyBox ہوتا ہے۔ ٹول کو GNU کے `find`، `du`، `stat` اور خاص طور پر `realpath` چاہیے — یہی [محفوظ پاتھ کی جانچ](./reference/protected-paths.md) سے پہلے سملنکس حل کرتا ہے۔

```bash
apk add coreutils findutils bash
linux-cleanup --self-test
```

`--self-test` پہلے غائب انحصار کا نام بتاتا ہے۔ جب تک یہ پاس نہ ہو، حذف کرنے والے موڈز نہ چلائیں۔

## WSL {#wsl}

ٹول Linux ماحول میں چلتا ہے۔ اس کی پاتھ حفاظت سملنکس حل کرتی ہے، مگر Windows کے ذاتی فولڈرز کو محفوظ Linux فولڈرز نہیں سمجھتی۔ اگر آپ کے ہوم فولڈر یا کیش `/mnt/` کی طرف اشارہ کرتے ہیں تو اسکین اور آزمائشی رن غور سے دیکھیں۔

## macOS {#macos}

سپورٹ نہیں۔ npm پیکیج `"os": ["linux"]` بتاتا ہے اور انسٹال سے انکار کرے گا۔ پاتھس، `find` فلیگز اور پیکیج مینیجرز سب مختلف ہیں۔

## آگے {#next}

- [سسٹم صفائی](./modes/system-cleanup.md) — وہ موڈ جس کی حدود یہ صفحہ بتاتا ہے
- [ضروریات](./getting-started/requirements.md)
