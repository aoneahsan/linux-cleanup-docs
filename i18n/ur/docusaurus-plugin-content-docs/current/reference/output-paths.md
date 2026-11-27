---
title: آؤٹ پٹ پاتھس
description: linux-cleanup اپنے لاگز، JSON سیشن ریکارڈز، ڈی بگ بنڈلز اور کریش بنڈلز کہاں لکھتا ہے — ترتیب، ہر انسٹال کے ڈیفالٹ، رکھنے کی مدت اور اجازتیں۔
sidebar_position: 5
---

# آؤٹ پٹ پاتھس

**سارا آؤٹ پٹ ایک ہی ڈیٹا روٹ کے نیچے رہتا ہے۔** کون سا روٹ، یہ اس پر منحصر ہے کہ آپ نے ٹول کیسے انسٹال کیا، اور دونوں بدلے جا سکتے ہیں۔

## ترتیب {#layout}

```text
$DATA_HOME/
├── logs/
│   ├── cleanup-<YYYY-MM-DD_HHMMSS>.log     # ہر سیشن کا ایک
│   └── cron.log                             # ہفتہ وار cron شامل کرتا ہے
├── reports/
│   ├── report-<YYYY-MM-DD_HHMMSS>.json     # واک تھرو کا ریکارڈ، جب تک بند نہ ہو
│   ├── report-<YYYY-MM-DD_HHMMSS>.md       # --export md سے بنتا ہے
│   └── report-<YYYY-MM-DD_HHMMSS>.html     # --export html سے بنتا ہے
└── feedback/
    ├── debug-bundle-<YYYY-MM-DD_HHMMSS>.tar.gz   # --debug-bundle سے بنتا ہے
    └── crash-<YYYY-MM-DD_HHMMSS>.tar.gz          # کریش پر خود بخود بنتا ہے
```

## ہر انسٹال کے ڈیفالٹ {#per-install-defaults}

| انسٹال کا طریقہ | `$DATA_HOME` |
|---|---|
| `npx linux-cleanup` | `~/.linux-cleanup/` |
| `npm install -g linux-cleanup` | `~/.linux-cleanup/` |
| `git clone` | خود کلون کا فولڈر |

یہ فرق جان بوجھ کر ہے۔ `npx` پیکیج کو npm کیش کے ایک عارضی فولڈر سے چلاتا ہے جو صاف ہو جاتا ہے، اس لیے وہاں لکھا آؤٹ پٹ ضائع ہو جاتا؛ `~/.linux-cleanup/` رنز کے درمیان باقی رہتا ہے۔ کلون پہلے سے مستقل جگہ ہے، اس لیے آؤٹ پٹ سورس کے ساتھ رہتا ہے۔

دونوں کو [`LINUX_CLEANUP_DATA_HOME`](./environment-variables.md) سے بدلیں، یا لاگ اور ریکارڈ فولڈرز الگ الگ۔

## رکھنے کی مدت {#retention}

| پاتھ | خود بخود صفائی | نوٹس |
|---|---|---|
| `logs/cleanup-*.log` | صرف `--cleanup-logs` کے ساتھ | یہ فلیگ آخر میں **اس رن** کا لاگ حذف کرتا ہے۔ پرانے لاگز رہتے ہیں |
| `logs/cron.log` | کبھی نہیں | کبھی روٹیٹ نہیں ہوتا۔ بڑھ جائے تو خود روٹیٹ کریں |
| `reports/*.json` | **کبھی نہیں** | پائیدار آڈٹ ریکارڈ |
| `reports/*.md`, `*.html` | **کبھی نہیں** | مانگنے پر بنتے ہیں، مانگنے پر ہٹتے ہیں |
| `feedback/*.tar.gz` | **کبھی نہیں** | آپ طے کرتے ہیں کہ کب ان کی ضرورت نہیں رہی |

`--cleanup-logs` واحد خودکار حذف ہے جو ٹول اپنے آؤٹ پٹ پر کرتا ہے، اور یہ صرف `.log` فائلوں کو چھوتا ہے۔

## سائز اور رکھنے کی مدت {#size-and-retention}

لاگز اور بنڈلز کا سائز کسی رن کے پاتھس اور ایونٹس پر منحصر ہے۔ پرانے ریکارڈز حذف کرنے سے پہلے دیکھیں کہ کیا جمع ہوا ہے۔ پرانی فائلیں سوچ سمجھ کر کم کرنے کے لیے:

```bash
find ~/.linux-cleanup/logs/    -name 'cleanup-*.log' -mtime +90 -delete
find ~/.linux-cleanup/reports/ -name 'report-*'      -mtime +90 -delete
```

cron لاگ روٹیٹ کرنا:

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## اجازتیں {#permissions}

فائلیں چلانے والے صارف کی ملکیت ہوتی ہیں۔ اپنی مشین پر `stat` سے ان کی اصل اجازتیں دیکھیں؛ ٹول کی مقرر فولڈر اجازتیں اور عمل کا umask دونوں اہم ہیں۔ کوئی لاگ یا بنڈل پڑھے بغیر شیئر نہ کریں۔

## ان فائلوں میں کیا ہوتا ہے {#what-these-files-contain}

:::caution لاگز اور بنڈلز میں آپ کے پاتھس ہوتے ہیں
سیشن لاگ ہر چھوئے گئے پاتھ کا نام لیتا ہے، یعنی اس میں آپ کی مشین کے فولڈر نام ہوتے ہیں — پروجیکٹس کے نام، اور کبھی `~/Downloads` کی فائلوں کے نام۔

یہ صرف مقامی ہے اور کبھی بھیجا نہیں جاتا، مگر بنڈل ای میل کرنے سے پہلے دیکھ لیں:

```bash
tar -tzf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz
```

دیکھیں [خرابی کی رپورٹ بھیجیں](../guides/send-a-bug-report.md)۔
:::

یہاں کسی چیز میں فائلوں کا **مواد** نہیں ہوتا — صرف پاتھس، سائز اور وقت۔ یہ اس کا ریکارڈ ہیں جو ہوا، حذف شدہ چیزوں کی کاپیاں نہیں۔ دیکھیں [ریکوری](../recovery.md)۔

## آگے {#next}

- [انوائرنمنٹ ویری ایبلز](./environment-variables.md) — ان جگہوں کو بدلنا
- [رپورٹ اسکیما](./report-schema.md) — JSON کی ساخت
