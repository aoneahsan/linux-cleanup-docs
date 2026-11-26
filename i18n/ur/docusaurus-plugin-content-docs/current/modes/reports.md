---
title: رپورٹس
description: گائیڈڈ واک تھرو ایک JSON سیشن ریکارڈ لکھ سکتا ہے۔ ان ریکارڈز کی فہرست دیکھیں، کھولیں، Markdown یا HTML میں بدلیں اور ایکسپورٹ کریں۔
tags: [reports, json, export, markdown, html, jq, modes]
sidebar_position: 15
---

# رپورٹس

**گائیڈڈ واک تھرو ایک JSON سیشن ریکارڈ** `~/.linux-cleanup/reports/report-<timestamp>.json` میں لکھتا ہے، جب تک `--no-report` یا `--dry-run` نہ لگا ہو۔ دوسرے موڈز یہ ریکارڈ نہیں بناتے۔ موجودہ ریکارڈز خود بخود حذف نہیں ہوتے۔

Markdown اور HTML اختیاری تبدیلیاں ہیں جو مانگنے پر بنتی ہیں۔

```bash
linux-cleanup --reports              # انٹرایکٹو مینیجر
linux-cleanup --export both latest   # بغیر سوال کے تبدیلی
```

## سیشن ریکارڈ میں کیا ہوتا ہے {#what-a-session-record-contains}

| حصہ | کیا رکھتا ہے |
|---|---|
| `schema_version` | ابھی `1` |
| `credits` | ٹول کا نام، ورژن، ہوم پیج، لائسنس، مصنف کی تفصیل |
| `meta` | ٹائم اسٹیمپس، دورانیہ، ہوسٹ، صارف، موڈ، غیر فعالیت کی حد، لاگ پاتھ، لانچر |
| `disk` | پہلے اور بعد میں فائل سسٹم کا استعمال |
| `memory` | پہلے اور بعد میں میموری کا استعمال |
| `steps` | ہر مرحلے کا ایک اندراج: نمبر، عنوان، حالت، خالی ہوئے بائٹس |
| `totals` | کل واپس ملے بائٹس، پڑھنے لائق کل، چلے اور چھوڑے گئے مراحل |

ہر فیلڈ کا مکمل حوالہ: [رپورٹ اسکیما](../reference/report-schema.md)۔

## انٹرایکٹو مینیجر {#the-interactive-manager}

```bash
linux-cleanup --reports
```

پچھلے سیشنز کی فہرست دیتا ہے اور آپ کو کسی ایک کو دیکھنے، Markdown یا HTML میں بدلنے، HTML براؤزر میں کھولنے یا حذف کرنے دیتا ہے۔

`jq` انسٹال نہ ہو تو تبدیلی کے آپشنز چھپے رہتے ہیں — دیکھیں [نیچے](#jq-is-required-for-conversion)۔

## ایکسپورٹ کرنا {#exporting}

بغیر سوال کے، اسکرپٹس اور عادتوں کے لیے:

```bash
linux-cleanup --export both latest   # سب سے نئے ریکارڈ سے Markdown + HTML
linux-cleanup --export html all      # ہر ریکارڈ HTML میں
linux-cleanup --export md 3          # ریکارڈ نمبر 3 Markdown میں
```

| آرگیومنٹ | کیا قبول کرتا ہے |
|---|---|
| فارمیٹ | `md`, `html`, `both` |
| شناخت | ریکارڈ نمبر، `latest` یا `all` |

آؤٹ پٹ JSON کے ساتھ، فائل کے نام میں اسی ٹائم اسٹیمپ کے ساتھ بنتا ہے۔ HTML اپنے آپ میں مکمل ہے — اندر CSS، ڈارک موڈ کا خیال، کوئی بیرونی وسائل نہیں — اس لیے اسے ایک فائل کی صورت ای میل یا محفوظ کیا جا سکتا ہے۔

## تبدیلی کے لیے `jq` ضروری ہے {#jq-is-required-for-conversion}

:::note JSON ہمیشہ لکھا جاتا ہے؛ تبدیلی اختیاری حصہ ہے
`jq` کے بغیر بھی واک تھرو اپنا JSON ریکارڈ بنا سکتا ہے۔ صرف Markdown اور HTML ایکسپورٹ دستیاب نہیں ہوتے، اور واک تھرو کا مرحلہ 10 خود کو `skipped (jq missing)` درج کرتا ہے۔

```bash
sudo apt install jq      # Debian / Ubuntu
sudo dnf install jq      # Fedora / RHEL
sudo pacman -S jq        # Arch
```
:::

بنایا گیا HTML، JSON سے آئی ہر قدر کو `jq` کے `@html` فلٹر سے ایسکیپ کرتا ہے، اس لیے خراب ان پٹ دکھائے گئے صفحے میں مارک اپ نہیں گھسا سکتا۔

## JSON سے براہ راست سوال کرنا {#querying-the-json-directly}

JSON ٹولز کے پڑھنے کے لیے ہی ہے:

```bash
# سب سے حالیہ سیشن میں کل کتنا واپس ملا
jq '.totals.total_reclaimed_human' ~/.linux-cleanup/reports/report-*.json | tail -1

# سب سے حالیہ سیشن میں واقعی چلنے والا ہر مرحلہ
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

# تمام درج سیشنز میں کل واپسی
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## محفوظ رکھنا {#retention}

یہ ریکارڈز **کبھی** خود بخود حذف نہیں ہوتے — `--cleanup-logs` سے بھی نہیں، جو صرف موجودہ رن کی لاگ فائل حذف کرتا ہے۔

انہیں خود کم کرنے کے لیے:

```bash
find ~/.linux-cleanup/reports/ -name 'report-*' -mtime +90 -delete
```

کسی ایک رن میں رپورٹ بنانا مکمل چھوڑنے کے لیے `--no-report` لگائیں؛ لاگ پھر بھی لکھا جاتا ہے۔

## یہ ریکارڈز ہیں، بیک اپ نہیں {#these-are-records-not-backups}

:::danger سیشن ریکارڈ مراحل کا خلاصہ ہے، بیک اپ نہیں
یہ مراحل اور ڈسک کے مشاہدات درج کرتا ہے، ہر حذف شدہ فائل کی مکمل فہرست نہیں۔ اس میں حذف شدہ مواد بالکل نہیں ہوتا، اور اس میں کچھ بھی کچھ بحال نہیں کر سکتا۔ ناپسندیدہ حذف کے بعد اس کا فائدہ یہ پہچاننے میں مدد ہے کہ اپنے بیک اپ سے کیا بحال کرنا ہے یا کیا دوبارہ ڈاؤن لوڈ کرنا ہے۔ دیکھیں [ریکوری](../recovery.md)۔
:::

## آگے {#next}

- [رپورٹ اسکیما](../reference/report-schema.md) — ہر فیلڈ
- [آؤٹ پٹ پاتھس](../reference/output-paths.md) — فائلیں کہاں بنتی ہیں
- [ریکوری](../recovery.md) — اچانک کچھ ہونے کے بعد سیشن ریکارڈ کا استعمال
