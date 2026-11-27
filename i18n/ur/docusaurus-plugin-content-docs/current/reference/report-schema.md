---
title: رپورٹ اسکیما
description: linux-cleanup کا رہنمائی والا واک تھرو جو JSON ساخت لکھتا ہے — credits، meta، disk، memory، steps اور totals کے ساتھ۔
sidebar_position: 7
---

# رپورٹ اسکیما

**رہنمائی والا واک تھرو `"schema_version": 1` والا ایک JSON ریکارڈ لکھتا ہے**، جب تک `--no-report` یا `--dry-run` سیٹ نہ ہو۔ الگ سے چلنے والا `--scan` یہ رپورٹ نہیں لکھتا۔ مشین کے پڑھنے لائق اسکین کے لیے `--scan --json-events` استعمال کریں؛ اس سلسلے کی ساخت الگ ہے۔

:::warning پرانی دستاویزات ایک الگ ساخت بتاتی ہیں
کچھ مواد — سورس ریپوزٹری کے اندر کا ایک حوالہ صفحہ بھی — `schema` (`linux-cleanup/report/v1` جیسی اسٹرنگ) کے گرد بنی شکل بتاتا ہے، جس میں `tool`، `session` اور `categories` آبجیکٹس ہیں۔

**ٹول ایسا کچھ نہیں لکھتا۔** اس کے مطابق لکھا پارسر ہر اصل فائل پر ناکام ہوگا۔ نیچے والی ساخت وہی ہے جو `modules/walkthrough.sh` لکھتا ہے۔ اپنی مشین پر تصدیق کریں:

```bash
jq 'keys' "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```
:::

## سب سے اوپر کی سطح {#top-level}

```json
{
  "schema_version": 1,
  "credits": { },
  "meta":    { },
  "disk":    { "before": {}, "after": {} },
  "memory":  { "before": {}, "after": {} },
  "steps":   [ ],
  "totals":  { }
}
```

| کلید | قسم | کیا رکھتی ہے |
|---|---|---|
| `schema_version` | عدد | فی الحال `1`۔ جو قدر نہ پہچانیں اسے رد کریں |
| `credits` | آبجیکٹ | ٹول کی شناخت، لائسنس اور مصنف |
| `meta` | آبجیکٹ | سیشن کا سیاق — کب، کہاں، کیسے، کن سیٹنگز کے ساتھ |
| `disk` | آبجیکٹ | پہلے اور بعد میں فائل سسٹم کا استعمال |
| `memory` | آبجیکٹ | پہلے اور بعد میں میموری کا استعمال |
| `steps` | ارے | ہر آزمائے گئے مرحلے کا ایک اندراج |
| `totals` | آبجیکٹ | سیشن کا خلاصہ |

## `credits` {#credits}

```json
{
  "tool": "linux-cleanup",
  "tool_version": "2.1.1",
  "tool_homepage": "https://linux-cleanup.aoneahsan.com",
  "tool_license": "MIT",
  "author": {
    "name": "Ahsan Mahmood",
    "email": "aoneahsan@gmail.com",
    "website": "https://aoneahsan.com",
    "linkedin": "https://linkedin.com/in/aoneahsan"
  }
}
```

یہ اس لیے ہے کہ ریکارڈ جہاں بھی پہنچے، اپنا ماخذ خود بتائے۔ اس میں کچھ بھی آپ کی مشین کے بارے میں نہیں۔

## `meta` {#meta}

| کلید | قسم | کیا رکھتی ہے |
|---|---|---|
| `tool` | اسٹرنگ | ہمیشہ `linux-cleanup` |
| `tool_version` | اسٹرنگ | وہ ورژن جس نے ریکارڈ لکھا۔ استعمال کرنے والے کی منطق اسی پر رکھیں |
| `started_at` | اسٹرنگ | سیشن شروع ہونے کا وقت |
| `finished_at` | اسٹرنگ | سیشن ختم ہونے کا وقت |
| `duration_seconds` | عدد | اصل میں لگا وقت |
| `host` | اسٹرنگ | `hostname` کا آؤٹ پٹ |
| `user` | اسٹرنگ | `$USER` |
| `mode` | اسٹرنگ | جو موڈ چلا — `walkthrough`، `scan`، `allsafe`، `system` وغیرہ |
| `stale_days` | عدد | لاگو `--days` حد |
| `log_file` | اسٹرنگ | اس سیشن کے لاگ کا مکمل پاتھ |
| `launcher` | اسٹرنگ | کیسے چلایا گیا — سیدھا چلانے پر `bash` |
| `via_npx` | عدد | npm لانچر سے چلنے پر `1`، ورنہ `0` |

`stale_days` درج کرنا فائدہ مند ہے: یہی 100 دن پر چھانٹی والے رن اور `-d 30` والے رن کا فرق ہے، اور بتاتا ہے کہ ایک ہی مشین پر دو سیشنز نے مختلف جگہ کیوں واپس پائی۔

## `disk` اور `memory` {#disk-and-memory}

دونوں میں `before` اور `after` تصویریں ہوتی ہیں، جو سیشن کے شروع اور آخر میں لی جاتی ہیں۔

`disk` میں `df` سے لیے فائل سسٹم فیلڈز ہوتے ہیں — فائل سسٹم، سائز، استعمال شدہ، دستیاب اور استعمال کا فیصد۔ `memory` میں سسٹم کی میموری رپورٹ سے وہی معلومات ہوتی ہیں۔

:::note `after` منفی `before` صرف آپ کی صفائی نہیں
یہ پوری مشین کی پیمائشیں ہیں۔ سیشن کے دوران چلنے والا بلڈ، پیکیج اپ ڈیٹ یا براؤزر بھی انہیں بدلتا ہے، اس لیے بتائی گئی واپسی مراحل کے مجموعے سے کم — یا منفی — ہو سکتی ہے۔ دیکھیں [مسائل کا حل](../troubleshooting.md#disk-usage-grew-during-the-session)۔
:::

## `steps` {#steps}

ایک ارے، ہر آزمائے گئے مرحلے کا ایک اندراج، ترتیب سے:

```json
{ "n": 1, "title": "Package-manager caches", "status": "ran", "freed_bytes": 13315108864 }
```

| کلید | قسم | کیا رکھتی ہے |
|---|---|---|
| `n` | عدد | 1 سے شروع ہونے والا مرحلہ نمبر |
| `title` | اسٹرنگ | پڑھنے لائق مرحلے کا نام |
| `status` | اسٹرنگ | `ran`، `skipped`، `skipped (quit)` یا `skipped (jq missing)` |
| `freed_bytes` | عدد | اس مرحلے سے واپس ملے بائٹس۔ چھوڑنے پر `0` |

`skipped (quit)` ان مراحل کو نشان زد کرتا ہے جو آپ کے `q` دبانے کے بعد آئے — جان بوجھ کر روکنے اور کسی مرحلے کو الگ سے رد کرنے کا فرق سمجھنے میں کام آتا ہے۔

## `totals` {#totals}

| کلید | قسم | کیا رکھتی ہے |
|---|---|---|
| `total_reclaimed_bytes` | عدد | تمام مراحل کا مجموعہ |
| `total_reclaimed_human` | اسٹرنگ | وہی، پڑھنے لائق شکل میں |
| `steps_run` | عدد | `ran` حالت والے مراحل |
| `steps_skipped` | عدد | `skipped` حالت والے مراحل |

## پارسنگ {#parsing}

```bash
LATEST="$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

jq '.totals.total_reclaimed_human' "$LATEST"
jq '.meta | {mode, stale_days, duration_seconds}' "$LATEST"
jq '.steps[] | select(.status == "ran") | "\(.title): \(.freed_bytes)"' "$LATEST"

# درج ہر سیشن میں کل واپسی
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## جانچ {#validating}

ٹول کے ساتھ کوئی JSON Schema فائل نہیں آتی۔ ایک ساختی جانچ:

```bash
jq -e 'has("schema_version") and .schema_version == 1
       and has("meta") and has("steps") and has("totals")' \
  ~/.linux-cleanup/reports/report-*.json
```

ہر درست فائل کے لیے `true` دکھاتا ہے۔

## مطابقت کی رہنمائی {#compatibility-guidance}

استعمال کرنے والا پروگرام لکھتے وقت:

- **`schema_version` پر شاخ بنائیں۔** انجان قدر کو اندازہ لگانے کے بجائے ناقابلِ پارس سمجھیں
- **انجان کلیدوں کو اضافہ سمجھیں۔** ورژن 1 میں فیلڈز شامل ہو چکے ہیں اور پھر ہو سکتے ہیں
- **`meta.tool_version` استعمال کریں** اس رویے کے لیے جو ریلیزز کے درمیان بدلتا ہے
- **یہ نہ سمجھیں کہ ہر موڈ ہر حصہ بھرتا ہے۔** صرف پڑھنے والے موڈز کم مراحل بناتے ہیں
- **`total_reclaimed_bytes` کبھی کبھار منفی ہو سکتا ہے۔** یہ `df` کا فرق ہے، حذف شدہ چیزوں کا مجموعہ نہیں

## آگے {#next}

- [رپورٹس](../modes/reports.md) — دیکھنا اور ایکسپورٹ کرنا
- [آؤٹ پٹ پاتھس](./output-paths.md) — فائلیں کہاں رہتی ہیں
