---
title: CLI فلیگز
description: linux-cleanup کا ہر کمانڈ لائن فلیگ — موڈز، اختیارات، متبادل نام اور ڈیفالٹ — ہر ایک کیا کرتا ہے اور اس کی پوری تفصیل کہاں ہے۔
tags: [cli, flags, reference, options, commands]
sidebar_position: 1
---

# CLI فلیگز

**linux-cleanup جو بھی فلیگ قبول کرتا ہے۔** موڈز ایک دوسرے کو خارج کرتے ہیں — ایک ہی دیں۔ اختیارات کسی بھی موڈ کے ساتھ جڑتے ہیں۔

```bash
linux-cleanup --help    # یہی فہرست، آپ کی مشین کے اصل پاتھس کے ساتھ
```

انجان فلیگ مدد کا متن دکھاتا ہے اور کوڈ `2` کے ساتھ ختم ہوتا ہے۔

## موڈز {#modes}

زیادہ سے زیادہ ایک دیں۔ کوئی نہ دیں تو [واک تھرو](../modes/walkthrough.md) ملتا ہے۔

| فلیگ | متبادل نام | کیا کرتا ہے | پورا صفحہ |
|---|---|---|---|
| _(کوئی نہیں)_ | `-w` `--walkthrough` | دس رہنمائی والے مراحل، ہر ایک سے پہلے پوچھتا ہے | [واک تھرو](../modes/walkthrough.md) |
| `-m` | `--menu` `-i` `--interactive` | نمبر والا، سیدھا جانے والا مینو | [مینو](../modes/menu.md) |
| `-t` | `--tui` `-g` `--gui` | بصری whiptail / dialog مینو | [TUI](../modes/tui.md) |
| `-a` | `--all-safe` | دوبارہ بن سکنے والے ہر کیش کی ایک ساتھ صفائی | [مکمل محفوظ](../modes/all-safe.md) |
| `-s` | `--scan` | ہر زمرے کی صرف پڑھنے والی جانچ | [اسکین](../modes/scan.md) |
| `-p` | `--stale` | بڑی، پرانی ذاتی فائلیں (انٹرایکٹو) | [پرانی ذاتی فائلیں](../modes/personal-stale-files.md) |
| | `--system` | apt، جرنل، snap، `/tmp`، پیج کیش (sudo) | [سسٹم کی صفائی](../modes/system-cleanup.md) |
| | `--partials` | چھوڑے ہوئے ادھورے ڈاؤن لوڈز (انٹرایکٹو) | [ادھورے / لاوارث ڈاؤن لوڈز](../modes/partial-downloads.md) |
| | `--audit` | `$HOME` کی 20 سب سے بڑی چیزیں | [ہوم کی جانچ](../modes/home-audit.md) |
| | `--node-modules` | پرانے `node_modules` (انٹرایکٹو) | [پرانے node_modules ڈھونڈیں](../modes/node-modules-finder.md) |
| | `--globals` | گلوبل پیکیجز کی صرف پڑھنے والی جانچ | [گلوبل پیکیجز کی جانچ](../modes/globals-audit.md) |
| | `--doctor` | رن ٹائمز کے لیے غائب شیل-انٹ ٹھیک کرنا | [ڈاکٹر](../modes/doctor.md) |
| | `--speed` | دباؤ اور اسٹارٹ اپ کام دیکھنا؛ تبدیلی سے پہلے پوچھتا ہے | [رفتار کی تشخیص](../modes/speed.md) |
| | `--editor-ext` | پرانے پڑ چکے VS Code / Cursor ورژنز | [ایڈیٹر ایکسٹینشنز](../modes/editor-extensions.md) |
| | `--reports` | سیشن ریکارڈز کا انٹرایکٹو مینیجر | [رپورٹس](../modes/reports.md) |
| | `--export FMT ID` | ریکارڈز کی غیر انٹرایکٹو تبدیلی | [رپورٹس](../modes/reports.md#exporting) |
| | `--feedback` | خرابی رپورٹ کی ہدایات، اختیاری mailto مسودہ | [خرابی کی رپورٹ بھیجیں](../guides/send-a-bug-report.md) |
| | `--debug-bundle` | تازہ لاگ + ریکارڈ ایک tar.gz میں | [خرابی کی رپورٹ بھیجیں](../guides/send-a-bug-report.md) |
| | `--list-targets` | ہر ہدف بن سکنے والا اور محفوظ پاتھ دکھاتا ہے | [حذف سے پہلے پری ویو](../safety/preview-first.md) |
| | `--self-test` | انحصار، سنٹیکس اور حفاظتی رکاوٹوں کی جانچ | [حذف سے پہلے پری ویو](../safety/preview-first.md) |
| `-V` | `--version` | ورژن اور مصنف | — |
| | `--install-alias` | `cleanup` شیل ایلیاس شامل کرتا ہے | [شیل ایلیاس اور ہفتہ وار cron](../guides/alias-and-cron.md) |
| | `--install-cron` | ہفتہ وار `--all-safe -y`، اتوار 03:00 | [شیل ایلیاس اور ہفتہ وار cron](../guides/alias-and-cron.md) |
| | `--uninstall-alias` | ایلیاس ہٹاتا ہے | [ان انسٹال](../guides/uninstall.md) |
| | `--uninstall-cron` | cron اندراج ہٹاتا ہے | [ان انسٹال](../guides/uninstall.md) |
| | `--refresh-app` | ایلیاس اور cron کی مستقل کاپی تازہ کرتا ہے | [انسٹالیشن](../getting-started/installation.md) |

## اختیارات {#options}

| فلیگ | ڈیفالٹ | اثر |
|---|---|---|
| `-d N` `--days N` | `100` | غیر فعالیت کی حد۔ فائل تبھی اہل ہے جب `atime` اور `mtime` **دونوں** اس سے آگے ہوں۔ کم قدر زیادہ سخت ہے |
| `--purge-all` | بند | **غیر فعالیت کی رکاوٹ بند کرتا ہے۔** کیش اہداف پورے صاف ہوتے ہیں — 1.2.0 سے پہلے کا رویہ |
| `-y` `--yes` | بند | دوبارہ بن سکنے والے کیش کی خودکار تصدیق۔ صرف `--all-safe` کے ساتھ درست۔ **ذاتی موڈز اسے نظرانداز کرتے ہیں** |
| `--no-report` | بند | JSON نہیں بناتا۔ لاگز پھر بھی لکھے جاتے ہیں |
| `--cleanup-logs` | بند | آخر میں اس رن کا لاگ حذف کرتا ہے۔ **ریکارڈز ہمیشہ رہتے ہیں** |
| `-n` `--dry-run` | بند | فائلیں حذف کیے یا سیٹنگز بدلے بغیر چنے ہوئے موڈ سے گزرتا ہے۔ مقامی لاگ رہتا ہے؛ JSON سیشن رپورٹ نہیں لکھی جاتی |
| `--json-events` | بند | `--scan` یا `--all-safe --yes` کے لیے stdout پر [مشین کے پڑھنے لائق ایونٹس](./json-events.md)؛ پڑھنے والا متن stderr پر |
| `--no-color` | بند | ANSI رنگ بند کرتا ہے۔ `NO_COLOR` بھی مانا جاتا ہے |
| `-h` `--help` | — | مدد دکھا کر ختم ہوتا ہے |

:::danger `--purge-all` ایک حفاظتی رکاوٹ ہٹاتا ہے
یہ [غیر فعالیت کی رکاوٹ](../safety/guards.md#guard-2--the-staleness-gate) بند کرتا ہے، اس لیے کیش پورے صاف ہوتے ہیں، چاہے آخری بار کبھی بھی استعمال ہوئے ہوں۔ مہنگی چیزیں — Gradle wrapper کی تقسیمیں، Playwright براؤزرز، Cypress بائنریز — بھی ساتھ جاتی ہیں۔ رن سے پہلے کا بینر بتاتا ہے کہ کون سی حکمت عملی فعال ہے۔
:::

:::note اسکین اور آزمائشی رن الگ سوالوں کے جواب دیتے ہیں
[`--scan`](../modes/scan.md) موجودہ پاتھس اور سائز پڑھتا ہے۔ `--dry-run` چنی ہوئی صفائی سے گزرتا ہے اور حذف کیے بغیر مجوزہ کارروائیاں دکھاتا ہے۔ دیکھیں [حذف سے پہلے پری ویو](../safety/preview-first.md)۔
:::

## نسخے {#recipes}

| مقصد | کمانڈ |
|---|---|
| انسٹال کی تصدیق | `linux-cleanup --self-test` |
| دیکھیں کتنی جگہ واپس مل سکتی ہے | `linux-cleanup --scan` |
| چنی ہوئی کیش صفائی کا پری ویو | `linux-cleanup --all-safe --dry-run` |
| صرف پڑھنے والا اسکین JSON ایونٹس کی صورت میں | `linux-cleanup --scan --json-events` |
| ہر پاتھ دیکھیں جسے یہ چھو سکتا ہے | `linux-cleanup --list-targets` |
| رہنمائی والی صفائی | `linux-cleanup` |
| ایک بار میں سب، بغیر سوال | `linux-cleanup --all-safe -y` |
| سخت صفائی | `linux-cleanup --all-safe -y -d 30` |
| دوبارہ انسٹال سے پہلے زیادہ سے زیادہ جگہ | `linux-cleanup --all-safe -y --purge-all` |
| بصری مینو | `linux-cleanup --tui` |
| پرانے پروجیکٹس کے انحصار فولڈرز | `linux-cleanup --node-modules -d 90` |
| سسٹم کی دیکھ بھال | `linux-cleanup --system` |
| ہفتہ وار خودکاری | `linux-cleanup --install-cron` |
| تازہ ریکارڈ HTML میں بدلیں | `linux-cleanup --export html latest` |
| خرابی درج کریں | `linux-cleanup --debug-bundle && linux-cleanup --feedback` |

## انوائرنمنٹ ویری ایبلز {#environment-variables}

سب سے زیادہ استعمال ہونے والے، [پوری فہرست](./environment-variables.md) الگ سے:

| ویری ایبل | اثر |
|---|---|
| `NO_COLOR` | کوئی بھی غیر خالی قدر رنگ بند کرتی ہے |
| `LINUX_CLEANUP_LOG_DIR` | لاگ فولڈر بدلتا ہے |
| `LINUX_CLEANUP_REPORTS_DIR` | سیشن ریکارڈ فولڈر بدلتا ہے |
| `LINUX_CLEANUP_DATA_HOME` | لاگز، ریکارڈز اور فیڈبیک بنڈلز کا اوپر والا فولڈر |

## ایگزٹ کوڈز {#exit-codes}

| کوڈ | مطلب |
|---|---|
| `0` | صاف رن |
| `2` | آرگیومنٹ پڑھنے کی خرابی یا ایونٹ سلسلے میں غیر معاون موڈ |
| `3` | ریلیز ریکارڈ سے روکا گیا پرانا ورژن |
| `130` | `Ctrl-C` سے روکا گیا |
| `143` | `SIGTERM` سے بند کیا گیا |
| دیگر | غیر متوقع — کریش بنڈل لکھتا ہے |

پورا جدول اور کریش ٹریپ کی منطق: [ایگزٹ کوڈز](./exit-codes.md)۔
