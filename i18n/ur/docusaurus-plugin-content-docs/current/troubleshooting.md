---
title: مسائل کا حل
description: linux-cleanup کے صارفین کو واقعی پیش آنے والے مسائل کی علامت، وجہ اور حل — انکار، غائب انحصارات، cron کی ناکامیاں، سست اسکین اور ورژن کی الجھن۔
tags: [troubleshooting, errors, fixes, cron, jq, whiptail]
sidebar_position: 92
---

# مسائل کا حل

علامت ← وجہ ← حل۔ پہلے جانچ والا کمانڈ چلائیں؛ اگر میل کھائے تو حل لاگو کریں۔

اگر آپ کا ڈیٹا ضائع ہوا ہے اور کوئی خرابی کا پیغام نہیں، تو [ریکوری](./recovery.md) پر جائیں۔

## REFUSE: protected path {#refuse-protected-path}

```text
✗ REFUSE: protected path: /home/you/Documents/something
```

**وجہ۔** سم لنکس کھولنے کے بعد پاتھ [محفوظ فہرست](./reference/protected-paths.md) کی کسی جگہ تک پہنچا۔ اجازت فہرست نے اسے روک دیا۔

**یہ درست رویہ ہے، ناکامی نہیں۔** کچھ حذف نہیں ہوا۔

**حل۔** پتا کریں کہ کیا کہاں پہنچا:

```bash
linux-cleanup --list-targets
realpath <the path that was rejected>
```

تقریباً ہمیشہ کوئی کیش کسی محفوظ فولڈر کے اندر سم لنک ہوتا ہے۔ **سم لنک ٹھیک کریں، ٹول نہیں** — ٹول بالکل اپنا کام کر رہا ہے۔ ڈیزائن کے تحت کوئی اوور رائیڈ فلیگ نہیں ہے۔

دو متعلقہ پیغامات:

```text
✗ REFUSE: unsafe path: '/home/you'            # اکیلا $HOME یا /
✗ REFUSE: shell-init / history file: …        # .bashrc، .zshrc اور ایسی فائلیں
```

## TUI mode needs whiptail or dialog {#tui-mode-needs-whiptail-or-dialog}

**وجہ۔** `--tui` تب چلایا گیا جب دونوں میں سے کوئی انسٹال نہیں تھا۔

**حل۔** ایک انسٹال کریں، یا CLI مینو پر لوٹنے کی تجویز مان لیں۔

```bash
sudo apt install whiptail     # Debian / Ubuntu
sudo dnf install newt         # Fedora / RHEL
sudo pacman -S libnewt        # Arch
```

**جانچ۔** `command -v whiptail`، پھر دوبارہ چلائیں۔ دیکھیں [TUI](./modes/tui.md)۔

## export requires jq {#export-requires-jq}

**وجہ۔** `jq` انسٹال کیے بغیر `--export md`، `--export html` یا رپورٹس مینیجر میں تبدیلی۔

**حل۔**

```bash
sudo apt install jq
```

`jq` صرف تبدیلی کے لیے چاہیے۔ اس کے بغیر بھی ہر رن پر JSON ریکارڈ لکھے جاتے ہیں۔ دیکھیں [رپورٹس](./modes/reports.md)۔

## command not found {#command-not-found}

**وجہ۔** کوئی ضروری انحصار غائب ہے یا کسی غیر موافق ایلیاس نے اسے چھپا دیا ہے۔ GNU coreutils کی جگہ BusyBox والے مختصر کنٹینرز میں عام ہے۔

**جانچ۔**

```bash
linux-cleanup --self-test
```

یہ ہر ضروری کمانڈ جانچتا ہے اور پہلی غائب کمانڈ کا نام بتاتا ہے۔

**حل۔** اپنے ڈسٹرو کے coreutils، findutils اور gawk پیکیجز انسٹال کریں۔ Alpine پر:

```bash
apk add coreutils findutils bash
```

`realpath` سب سے اہم ہے — یہی [محفوظ پاتھس کی جانچ](./reference/protected-paths.md) کو سم لنکس سے محفوظ بناتا ہے۔ دیکھیں [ڈسٹرو سپورٹ](./distro-support.md#minimal-containers)۔

## cron اندراج چلتا ہے مگر کچھ نہیں کرتا {#cron-entry-runs-but-does-nothing}

**جانچ۔**

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

**وجہ۔** cron لاگ میں `command not found` کا مطلب ہے کہ cron کا مختصر `PATH` (`/usr/bin:/bin`) آپ کا انسٹال نہیں دیکھ پاتا۔ یہ cron کا سب سے عام مسئلہ ہے۔

**حل۔** crontab میں مکمل پاتھ لکھیں:

```bash
crontab -e
# یہ بدلیں:  0 3 * * 0 linux-cleanup --all-safe -y …
# یوں کریں:  0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y …
```

درست پاتھ `command -v linux-cleanup` سے معلوم کریں۔ یا crontab کے سب سے اوپر ایک `PATH=` لائن لکھیں۔ دیکھیں [ایلیاس اور cron](./guides/alias-and-cron.md)۔

## $HOME is not set {#home-is-not-set}

```text
✗ $HOME is not set
```

**وجہ۔** ایسے ماحول میں چلانا جو `$HOME` سیٹ نہیں کرتا — کچھ Docker امیجز، کچھ CI رنرز۔

**حل۔**

```bash
HOME=/root linux-cleanup --scan
```

یا سیشن کے لیے ایک بار ایکسپورٹ کر دیں۔ اسکرپٹ اندازہ لگانے کے بجائے جان بوجھ کر رک جاتی ہے: غلط `$HOME` کا مطلب ہے کہ ہر پاتھ کی جانچ غلط درخت پر ہوگی۔

## اسکین یا --node-modules رکا ہوا لگتا ہے {#scan-or---node-modules-seems-to-hang}

**وجہ۔** `find`، `$HOME` کے نیچے ہزاروں فولڈرز سے گزر رہا ہے۔ گھومنے والی ڈسک پر پہلا رن ایک سے تین منٹ لیتا ہے۔

**جانچ۔** ٹرمینل کے بجائے لاگ دیکھیں:

```bash
tail -f ~/.linux-cleanup/logs/cleanup-*.log
```

ہر پانچ سے دس سیکنڈ میں نئی لائن آئے تو یہ کام کر رہا ہے۔

**حل۔** پہلے رن پر صبر کریں؛ بعد کے رن فولڈرز کا میٹا ڈیٹا کیش ہونے سے تیز ہوتے ہیں۔ اگر وہی پاتھ ہر بار پانچ منٹ سے زیادہ رکے تو سم لنک لوپ یا جواب نہ دینے والے نیٹ ورک یا FUSE ماؤنٹ کا شک کریں — اور [رپورٹ کریں](./guides/send-a-bug-report.md)۔

## سیشن کے دوران ڈسک کا استعمال بڑھ گیا {#disk-usage-grew-during-the-session}

**وجہ۔** دکھائی گئی بچت پوری مشین کا `df` فرق ہے۔ کسی دوسرے عمل — بلڈ، پیکیج اپ ڈیٹ، جرنل روٹیشن، IDE کی دوبارہ انڈیکسنگ — نے سیشن کے دوران صفائی سے خالی ہونے والی جگہ سے زیادہ لکھ دیا۔

**یہ خرابی نہیں**، اور اس کا مطلب یہ نہیں کہ صفائی ناکام ہوئی۔ دیکھیں کہ مراحل نے خود کیا بتایا:

```bash
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

**حل۔** اصل تصویر دیکھنے کے لیے مشین پرسکون ہو تو `--scan` دوبارہ چلائیں۔

## --system کے بعد apt update ناکام ہوتا ہے {#apt-update-fails-after---system}

**وجہ۔** کم ہوتا ہے۔ `apt clean` سے `apt update` نہیں ٹوٹتا، مگر صفائی کسی اور apt کام سے ٹکرا سکتی ہے جس نے لاک پکڑ رکھا ہو۔

**جانچ۔**

```bash
sudo apt update 2>&1 | tail -20
```

**حل۔**

```bash
sudo rm -f /var/lib/apt/lists/lock /var/cache/apt/archives/lock /var/lib/dpkg/lock-frontend
sudo apt update
```

یہ تبھی کریں جب واقعی کوئی apt عمل نہ چل رہا ہو — پہلے `ps aux | grep -i apt`۔

## VS Code غائب ایکسٹینشن بتاتا ہے {#vs-code-reports-a-missing-extension}

**وجہ۔** عموماً درست رویہ: ایک پرانا ورژن حذف ہوا جبکہ ایڈیٹر میں اب بھی اس کا حوالہ تھا۔

**حل۔** ونڈو دوبارہ لوڈ کریں — `Ctrl+Shift+P` ← **Developer: Reload Window**۔

**جانچیں** کہ موجودہ ورژن اب بھی موجود ہے:

```bash
ls ~/.vscode/extensions/ | grep <extension-name>
```

اگر *موجودہ* ورژن واقعی جا چکا ہے تو یہ سب سے نئے ورژن کی پہچان میں خرابی ہے۔ دوبارہ انسٹال کریں اور [رپورٹ کریں](./guides/send-a-bug-report.md):

```bash
code --install-extension <publisher>.<name>
```

## کریش بنڈل بنا مگر مجھے کوئی کریش نظر نہیں آیا {#a-crash-bundle-appeared-but-i-saw-no-crash}

**وجہ۔** اسکرپٹ کسی غیر متوقع جگہ سے غیر صفر کوڈ کے ساتھ ختم ہوئی — پس منظر میں چلتے `find` کو OOM killer نے روکا، یا پائپ ٹوٹا۔

**حل۔** بنڈل کے مینی فیسٹ میں ایگزٹ کوڈ پڑھیں:

```bash
tar -xzOf ~/.linux-cleanup/feedback/crash-*.tar.gz --wildcards '*MANIFEST*'
```

`137` OOM killer ہے، `141` SIGPIPE، `139` سیگ فالٹ۔ دیکھیں [ایگزٹ کوڈز](./reference/exit-codes.md)۔ ان میں سے کوئی بھی رپورٹ کرنے لائق ہے۔

## --install-alias کے بعد ایلیاس cleanup نہیں ملتا {#alias-cleanup-not-found-after---install-alias}

**وجہ۔** شیل کی rc فائل دوبارہ نہیں پڑھی گئی۔

**حل۔**

```bash
source ~/.bashrc      # یا ~/.zshrc
```

یا نیا ٹرمینل کھولیں۔

## غلط ورژن چل رہا ہے {#wrong-version-running}

**جانچ۔**

```bash
command -v linux-cleanup
linux-cleanup --version
```

**وجہ۔** پرانا گلوبل انسٹال نئے `npx` کیش کو چھپا رہا ہے، یا شیل کا کمانڈ ہیش پرانا ہے۔

**حل۔**

```bash
npm uninstall -g linux-cleanup
npm install -g linux-cleanup@latest
hash -r
linux-cleanup --version
```

موجودہ شائع شدہ ورژن کے لیے [npm پیکیج](https://www.npmjs.com/package/linux-cleanup) دیکھیں۔ آپ کی انسٹال کاپی کے بعد کی تبدیلیوں کے لیے [تبدیلیوں کی فہرست](./changelog.md) دیکھیں۔

## اب بھی حل نہیں ہوا {#still-stuck}

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

بنڈل دیکھ لیں، پھر متوقع اور اصل نتیجے کی مختصر تفصیل کے ساتھ ای میل کریں۔ دیکھیں [خرابی کی رپورٹ بھیجیں](./guides/send-a-bug-report.md)۔
