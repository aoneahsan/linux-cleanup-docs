---
title: انوائرنمنٹ ویری ایبلز
description: linux-cleanup جو بھی انوائرنمنٹ ویری ایبل پڑھتا ہے، ان کا ڈیفالٹ اور اثر — آؤٹ پٹ فولڈر بدلنا، رنگوں کا کنٹرول اور XDG کنفیگ کی تلاش۔
sidebar_position: 4
---

# انوائرنمنٹ ویری ایبلز

**linux-cleanup جو بھی انوائرنمنٹ ویری ایبل پڑھتا ہے۔** سب اختیاری ہیں۔

| ویری ایبل | ڈیفالٹ | اثر |
|---|---|---|
| `NO_COLOR` | سیٹ نہیں | کوئی بھی غیر خالی قدر ANSI رنگ بند کرتی ہے۔ [no-color.org](https://no-color.org) کا تمام ٹولز والا معیار۔ `--no-color` جیسا ہی |
| `CLEANUP_NO_COLOR` | `0` | linux-cleanup کا اپنا رنگ سوئچ۔ صرف یہاں رنگ بند کرنے کے لیے `1` کریں |
| `LINUX_CLEANUP_LOG_DIR` | `~/.linux-cleanup/logs/` (npx / npm) یا `<repo>/logs/` (کلون) | سیشن لاگز کہاں جاتے ہیں۔ نہ ہو تو بنتا ہے |
| `LINUX_CLEANUP_REPORTS_DIR` | `~/.linux-cleanup/reports/` یا `<repo>/reports/` | JSON سیشن ریکارڈز کہاں جاتے ہیں۔ نہ ہو تو بنتا ہے |
| `LINUX_CLEANUP_DATA_HOME` | سیٹ نہیں — لاگ فولڈر کے اوپر والے فولڈر پر لوٹتا ہے | `logs/`، `reports/` اور `feedback/` تینوں کا اوپر والا فولڈر |
| `LINUX_CLEANUP_NPX` | سیٹ نہیں | **اندرونی۔** Node لانچر اسے `1` کرتا ہے۔ خود سیٹ نہ کریں |
| `LINUX_CLEANUP_LAUNCHER` | سیٹ نہیں | **اندرونی۔** Node لانچر `node` سیٹ کرتا ہے؛ ڈیسک ٹاپ ایپ `desktop` سیٹ کرتی ہے، جس سے CLI کی اپنی اپ ڈیٹ جانچ چھوٹ جاتی ہے کیونکہ ایپ اپنی جانچ کرتی ہے (2.1.0 سے)۔ خود سیٹ نہ کریں |
| `XDG_CONFIG_HOME` | `~/.config` | `personal-roots.txt` اور `project-roots.txt` کہاں ڈھونڈے جاتے ہیں |

## سارا آؤٹ پٹ کہیں اور بھیجنا {#redirecting-all-output}

`LINUX_CLEANUP_DATA_HOME` وہ واحد لیور ہے جو سب کچھ منتقل کرتا ہے — لاگز، ریکارڈز اور فیڈبیک بنڈلز:

```bash
export LINUX_CLEANUP_DATA_HOME="/mnt/secure/linux-cleanup"
linux-cleanup --scan
```

:::caution فولڈر بنتا ہے، ماؤنٹ نہیں
ٹول آپ کے دیے پاتھ کے نیچے `logs/`، `reports/` اور `feedback/` بناتا ہے۔ یہ نیچے کا ماؤنٹ پوائنٹ **نہیں** بناتا اور نہ اس کی جانچ کرتا ہے۔ کسی غیر ماؤنٹ پاتھ کی طرف اشارہ کریں تو آؤٹ پٹ خاموشی سے نیچے والے فائل سسٹم پر پہنچ جاتا ہے۔

اس پر بھروسا کرنے سے پہلے تصدیق کریں کہ ہدف ماؤنٹ ہے اور لکھنے کے قابل ہے۔
:::

باریک کنٹرول کے لیے `LINUX_CLEANUP_LOG_DIR` اور `LINUX_CLEANUP_REPORTS_DIR` الگ الگ بدلتے ہیں اور ڈیٹا ہوم پر ترجیح رکھتے ہیں۔

## رنگوں کا کنٹرول {#colour-control}

```bash
export NO_COLOR=1          # اس مشین پر سب کچھ، تمام ٹولز
export CLEANUP_NO_COLOR=1  # صرف linux-cleanup
linux-cleanup --no-color   # صرف یہ ایک بار
```

`CLEANUP_NO_COLOR` اس صورت کے لیے ہے جب آپ ہر دوسرے ٹول سے رنگ چاہتے ہیں اور اس سے سادہ آؤٹ پٹ — عموماً تب، جب اس کا آؤٹ پٹ کسی ایسی جگہ پائپ ہو جو ایسکیپ ترتیبیں بگاڑ دیتی ہے۔

## اسکین ہونے والے روٹس طے کرنا {#configuring-the-scanned-roots}

`$XDG_CONFIG_HOME` (ڈیفالٹ `~/.config`) کے نیچے دو فائلیں طے کرتی ہیں کہ ذاتی اور پروجیکٹ اسکینر کن فولڈرز سے گزرتے ہیں:

| فائل | کس کے لیے | ڈیفالٹ روٹس |
|---|---|---|
| `personal-roots.txt` | [`--stale`](../modes/personal-stale-files.md) | `~/Downloads`؛ `~/Desktop` جیسے محفوظ روٹس نظرانداز ہوتے ہیں |
| `project-roots.txt` | [`--node-modules`](../modes/node-modules-finder.md) | آپ کے پروجیکٹ فولڈرز |

ہر لائن میں ایک پاتھ۔ یہ [XDG Base Directory تفصیل](https://specifications.freedesktop.org/basedir-spec/) پر چلتا ہے، اس لیے `XDG_CONFIG_HOME` سیٹ کرنے سے دونوں کی جگہ بدلتی ہے۔

:::danger `personal-roots.txt` میں روٹ شامل کرنے سے حذف ہو سکنے والا دائرہ بڑھتا ہے
ذاتی اسکینر [صرف انٹرایکٹو](../safety/guards.md#guard-3--personal-data-is-interactive-only) ہے، اس لیے ہر فائل کی آپ کی تصدیق کے بغیر کچھ نہیں ہٹتا — مگر آپ کا شامل کیا روٹ ایسا فولڈر ہے جس کا مواد امیدواروں کی فہرستوں میں نظر آنے لگے گا۔

[پاتھس کی اجازت فہرست](./protected-paths.md) پھر بھی لاگو ہے اور غالب رہتی ہے: یہاں `~/Documents` شامل کرنے سے وہ حذف کے قابل نہیں بنتا۔
:::

## CI اور اسکرپٹس کے لیے {#for-ci-and-scripts}

```bash
NO_COLOR=1 linux-cleanup --scan > /tmp/scan.log
```

الگ سے چلنے والا اسکین واک تھرو کی JSON سیشن رپورٹ نہیں بناتا۔ اسکرپٹ میں [ایگزٹ کوڈ](./exit-codes.md) دیکھیں، یا منظم آؤٹ پٹ کے لیے [`--json-events`](./json-events.md) استعمال کریں۔

## یہ کیا نہیں پڑھتا {#what-it-does-not-read}

- `PATH`، سوائے یہ جاننے کے کہ کون سے اختیاری ٹولز انسٹال ہیں
- `USER` اور `LOGNAME`، سوائے لاگ کے شروع میں لکھنے کے
- آپ کا شیل ہسٹری، ایلیاس یا کنفیگریشن — [`--doctor`](../modes/doctor.md) واحد موڈ ہے جو شیل کی ابتدائی فائلیں پڑھتا ہے، اور صرف یہ دیکھنے کے لیے کہ کوئی رن ٹائم جڑا ہے یا نہیں
- کوئی ریموٹ یا نیٹ ورک سے آنے والی کنفیگریشن۔ ایسی کوئی نہیں

اگر `$HOME` سیٹ نہیں تو اسکرپٹ اندازہ لگانے کے بجائے فوراً رک جاتا ہے۔ دیکھیں [مسائل کا حل](../troubleshooting.md#home-is-not-set)۔

## آگے {#next}

- [آؤٹ پٹ پاتھس](./output-paths.md) — فائلیں اصل میں کہاں پہنچتی ہیں
- [CLI فلیگز](./cli-flags.md)
