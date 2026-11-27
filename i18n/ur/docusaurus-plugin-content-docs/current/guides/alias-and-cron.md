---
title: شیل ایلیاس اور ہفتہ وار cron
description: cleanup شیل ایلیاس اور ہر ہفتے خود بخود چلنے والی مکمل محفوظ صفائی انسٹال کریں، ہر ایک کیا لکھتا ہے، اور انہیں دوبارہ کیسے ہٹائیں۔
sidebar_position: 2
---

# شیل ایلیاس اور ہفتہ وار cron

**ایک بار کی سیٹ اپ والے دو معاون: `cleanup` شیل ایلیاس، اور ہر ہفتے خود بخود چلنے والا رن۔** دونوں کو متعلقہ ان انسٹال فلیگ سے پلٹا جا سکتا ہے۔

```bash
linux-cleanup --install-alias
linux-cleanup --install-cron
```

## شیل ایلیاس {#the-shell-alias}

```bash
linux-cleanup --install-alias
```

آپ کے شیل کے مطابق `~/.bash_aliases` یا `~/.zshrc` میں ایک `cleanup` ایلیاس شامل کرتا ہے۔ اس کے بعد کہیں بھی `cleanup` ٹائپ کرنے سے ٹول چلتا ہے۔

اپنا شیل دوبارہ لوڈ کریں، ورنہ ایلیاس موجود نہیں لگے گا:

```bash
source ~/.bashrc     # یا ~/.zshrc
```

اسے `linux-cleanup --uninstall-alias` سے ہٹائیں۔

:::note شیل کی ابتدائی فائلیں حذف کی سطح پر محفوظ ہیں
`.bashrc`، `.zshrc`، `.bash_aliases` اور ایسی فائلیں [محفوظ فائل ناموں کی فہرست](../reference/protected-paths.md#protected-basenames) میں ہیں، اس لیے کوئی صفائی موڈ انہیں کبھی حذف نہیں کر سکتا — وہ کسی بھی پاتھ پر ہوں۔ ایلیاس انسٹالر صرف آخر میں شامل کرتا ہے؛ ان انسٹالر صرف اپنی لائن ہٹاتا ہے۔
:::

## ہفتہ وار cron جاب {#the-weekly-cron-job}

```bash
linux-cleanup --install-cron
```

`--all-safe -y` کو **ہر اتوار 03:00 بجے** کے لیے مقرر کرتا ہے، اور آؤٹ پٹ `~/.linux-cleanup/logs/cron.log` میں شامل کرتا ہے۔ `crontab` درکار ہے۔

اسے `linux-cleanup --uninstall-cron` سے ہٹائیں۔

### اس کے لیے `--all-safe` درست موڈ کیوں ہے {#why---all-safe-is-the-right-mode-for-this}

یہ واحد موڈ ہے جس پر `--yes` لاگو ہوتا ہے، اور یہ **ذاتی ڈیٹا نہیں چھو سکتا** — صرف انٹرایکٹو موڈز اس کا حصہ نہیں اور ڈیزائن کے تحت `--yes` کو نظرانداز کرتے ہیں۔ اس لیے بغیر نگرانی کا رن کیش صاف کر سکتا ہے اور `~/Downloads` کی کوئی فائل کبھی حذف نہیں کر سکتا۔ دیکھیں [رکاوٹ 3](../safety/guards.md#guard-3--personal-data-is-interactive-only)۔

[غیر فعالیت کی رکاوٹ](../safety/guards.md#guard-2--the-staleness-gate) پھر بھی لاگو رہتی ہے، اس لیے حال میں استعمال ہونے والی فائلیں ہر ہفتہ وار صفائی میں بچی رہتی ہیں۔

## crontab اندراج خود لکھنا {#writing-the-crontab-entry-yourself}

کسی اور وقت یا فلیگز کے لیے:

```bash
crontab -e
```

```bash
0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1
```

:::danger مکمل پاتھ استعمال کریں
cron بہت مختصر `PATH` کے ساتھ چلتا ہے — عموماً صرف `/usr/bin:/bin`۔ اگر `linux-cleanup`، `~/.local/bin` یا کسی Node ورژن مینیجر کے فولڈر میں ہے تو بغیر پاتھ کا `linux-cleanup` نہیں ملے گا، اور جاب ہر ہفتے خاموشی سے ناکام ہوگی۔

شیڈول رنز کا یہی سب سے عام مسئلہ ہے۔ اپنا پاتھ یوں معلوم کریں:

```bash
command -v linux-cleanup
```

یا crontab کے سب سے اوپر `PATH=` واضح طور پر سیٹ کریں۔
:::

| فلیگ | cron میں کیوں |
|---|---|
| `--all-safe -y` | بغیر نگرانی، صرف کیش |
| `--no-report` | JSON ریکارڈز کا جمع ہونا روکتا ہے — یہ **کبھی** خود بخود حذف نہیں ہوتے |
| `--cleanup-logs` | آخر میں اس رن کا لاگ حذف کرتا ہے |
| `-d 30` | اختیاری: ہر ہفتے زیادہ سخت چھانٹی |

صرف `--cleanup-logs` فولڈر چھوٹا رکھنے کے لیے کافی نہیں: یہ ریکارڈز کو کبھی نہیں چھوتا۔ یہ کام `--no-report` کرتا ہے۔

:::caution شیڈول جاب میں `--purge-all` شامل نہ کریں
بغیر نگرانی اور بغیر غیر فعالیت کی رکاوٹ کا مطلب ہے کہ کوئی مہنگی چیز ضرورت سے ایک ہفتہ پہلے غائب ہو سکتی ہے، اور کوئی دیکھ بھی نہیں رہا ہوگا۔ `--purge-all` کو سوچے سمجھے، نگرانی والے رنز کے لیے رکھیں۔ دیکھیں [سب سے زیادہ جگہ واپس پائیں](./reclaim-the-most-space.md)۔
:::

## جانچنا کہ یہ چلا {#checking-that-it-ran}

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

اگر لاگ `command not found` دکھائے تو یہ اوپر والا `PATH` کا مسئلہ ہے۔ اگر لاگ خالی ہے تو جاب کبھی چلی ہی نہیں — جانچیں کہ cron ڈیمن چل رہا ہے (`systemctl status cron` یا `crond`)۔

cron لاگ **کبھی روٹیٹ نہیں ہوتا**۔ بڑھ جائے تو خود روٹیٹ کریں:

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## اس کے بجائے systemd ٹائمر {#a-systemd-timer-instead}

اگر آپ cron کے بجائے ٹائمر پسند کرتے ہیں تو اس میں ٹول سے متعلق کچھ خاص نہیں — وہی کمانڈ شیڈول کریں۔ ٹول نہ جانتا ہے نہ پروا کرتا ہے کہ کس شیڈولر نے اسے چلایا، اور `--install-cron` سہولت ہے، ضرورت نہیں۔

## دونوں ہٹانا {#removing-both}

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

پیکیج سمیت مکمل ہٹانا: [ان انسٹال](./uninstall.md)۔
