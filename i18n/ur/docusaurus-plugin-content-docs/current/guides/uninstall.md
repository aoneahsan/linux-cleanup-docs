---
title: ان انسٹال
description: linux-cleanup کو مکمل طور پر ہٹائیں — پیکیج، شیل ایلیاس، cron اندراج، اور اس کے لاگز اور سیشن ریکارڈز۔
sidebar_position: 4
---

# ان انسٹال

**پہلے خودکاری ہٹائیں، پھر پیکیج، پھر ڈیٹا۔** پیکیج ان انسٹال کرنے سے آپ کا لگایا ہوا شیل ایلیاس یا cron اندراج نہیں ہٹتا — یہ الگ چیزیں ہیں۔

## 1. خودکاری ہٹائیں {#1-remove-the-automation}

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

یہ پیکیج ہٹانے سے **پہلے** کریں، جب تک کمانڈ موجود ہے۔ اگر آپ اسے پہلے ہی ہٹا چکے ہیں تو نیچے [ہاتھ سے ہٹانا](#if-you-removed-the-package-first) دیکھیں۔

جانچیں:

```bash
crontab -l | grep -i cleanup     # کوئی آؤٹ پٹ نہیں آنا چاہیے
grep -rn 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

## 2. پیکیج ہٹائیں {#2-remove-the-package}

```bash
npm uninstall -g linux-cleanup
```

`npx` کے لیے کچھ انسٹال نہیں ہوتا — npm کیش اسے خود ہٹا دیتا ہے۔ ابھی صاف کرنے کے لیے:

```bash
npm cache clean --force
```

git clone کے لیے فولڈر حذف کریں:

```bash
rm -rf ~/linux-cleanup
```

:::caution کلون اپنے لاگز اور ریکارڈز خود رکھتا ہے
npm انسٹال کے طریقوں کے برعکس، کلون آؤٹ پٹ `<clone>/logs/` اور `<clone>/reports/` میں رکھتا ہے۔ کلون حذف کرنے سے یہ بھی حذف ہوتے ہیں۔ جو رکھنا ہو، پہلے اس کی کاپی بنا لیں۔ دیکھیں [آؤٹ پٹ پاتھس](../reference/output-paths.md)۔
:::

## 3. ڈیٹا ہٹائیں {#3-remove-the-data}

لاگز، سیشن ریکارڈز اور فیڈبیک بنڈلز `~/.linux-cleanup/` میں رہتے ہیں اور ان انسٹال کرنے سے **کبھی** حذف نہیں ہوتے۔

```bash
ls -la ~/.linux-cleanup/           # حذف کرنے سے پہلے دیکھیں
rm -rf ~/.linux-cleanup/
```

یہ چھوٹے ہوتے ہیں — عموماً چند میگا بائٹ — اور پچھلے رنز نے کیا حذف کیا، اس کا یہی واحد ریکارڈ ہیں۔ انہیں رکھنے میں کچھ خرچ نہیں؛ انہیں حذف کرنا کسی بھی اور حذف کی طرح ناقابل واپسی ہے۔

اگر آپ نے `LINUX_CLEANUP_DATA_HOME` سیٹ کیا تھا تو اس کے بجائے وہ فولڈر حذف کریں، اور اپنی شیل ترتیب سے وہ ایکسپورٹ نکال دیں۔

## 4. ترتیب ہٹائیں، اگر آپ نے بنائی ہو {#4-remove-configuration-if-you-created-any}

```bash
rm -f ~/.config/personal-roots.txt ~/.config/project-roots.txt
```

یہ صرف تب ہوتی ہیں جب آپ نے خود بنائی ہوں۔ دیکھیں [ماحولیاتی متغیرات](../reference/environment-variables.md#configuring-the-scanned-roots)۔

## اگر آپ نے پہلے پیکیج ہٹا دیا {#if-you-removed-the-package-first}

دونوں معاون ترتیبات ہاتھ سے ہٹائیں۔

**Cron:**

```bash
crontab -e
# linux-cleanup یا cleanup.sh والی لائن حذف کریں
```

**ایلیاس:**

```bash
grep -n 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

اپنے ایڈیٹر سے ملتی ایلیاس لائن ہٹائیں، پھر فائل کو `source` کریں یا نیا ٹرمینل کھولیں۔

## پیچھے کیا رہ جاتا ہے {#what-is-left-behind}

اوپر کا سب کر لینے کے بعد کچھ نہیں۔ ٹول کوئی سسٹم سروس، پس منظر کا عمل، systemd یونٹ، `/etc` اندراج یا root کی فائل انسٹال نہیں کرتا۔ اس کا بنایا سب کچھ آپ کے ہوم فولڈر کے اندر ہے۔

سسٹم پر اثرات جنہیں یہ نہیں پلٹتا — کیونکہ یہ اس کی فائلیں نہیں:

- **حذف شدہ کیش حذف ہی رہتے ہیں۔** ہر ٹول کو ضرورت پڑنے پر یہ دوبارہ بنتے ہیں
- **[`--doctor`](../modes/doctor.md) کے شامل کیے شیل ابتدائی بلاکس** باقی رہتے ہیں۔ یہ آپ کے انسٹال رن ٹائمز کی درست ترتیب ہیں؛ نہ چاہیں تو ہاتھ سے ہٹا دیں

## جانچیں {#verify}

```bash
command -v linux-cleanup      # کوئی آؤٹ پٹ نہیں آنا چاہیے
crontab -l | grep -i cleanup  # کوئی آؤٹ پٹ نہیں آنا چاہیے
ls ~/.linux-cleanup 2>&1      # آنا چاہیے: No such file or directory
```

## آگے {#next}

- [انسٹالیشن](../getting-started/installation.md) — اگر آپ دوبارہ انسٹال کر رہے ہیں
