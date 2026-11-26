---
title: تعارف
description: linux-cleanup کس نے بنایا، اس کے پیچھے ڈیزائن کے اصول، اس کا لائسنس، اور رابطہ یا تعاون کیسے کریں۔
tags: [about, author, licence, contributing, credits]
sidebar_position: 95
---

# تعارف

**linux-cleanup کو [Ahsan Mahmood](https://aoneahsan.com) نے بنایا ہے اور وہی اس کی دیکھ بھال کرتے ہیں**، جو ڈیولپر ٹولز اور ایپلی کیشن ڈیولپمنٹ پر کام کرنے والے ایک آزاد سافٹ ویئر انجینئر ہیں۔

| | |
|---|---|
| **مصنف** | Ahsan Mahmood |
| **ای میل** | [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |
| **ویب** | [aoneahsan.com](https://aoneahsan.com) |
| **LinkedIn** | [linkedin.com/in/aoneahsan](https://linkedin.com/in/aoneahsan) |
| **GitHub** | [github.com/aoneahsan](https://github.com/aoneahsan) |
| **npm** | [npmjs.com/~aoneahsan](https://www.npmjs.com/~aoneahsan) |

## یہ کیوں ہے {#why-it-exists}

ڈیولپر مشینوں پر دوبارہ بن سکنے والا ڈھیروں کچرا جمع ہوتا ہے — دسیوں GB کے پیکیج مینیجر کیش، براؤزر کیش، بلڈ ٹول کیش، ایمولیٹر امیجز، اور دو سال پہلے چھوڑے گئے پروجیکٹس کے `node_modules`۔

موجودہ صفائی کے ٹولز عموماً دو میں سے ایک طرح کے تھے۔ یا تو وہ جدید ڈیولپر کیش کو جانتے ہی نہیں تھے، یا ایک بٹن والے صاف کرنے والے ٹولز تھے جو کچرا لگنے والی ہر چیز حذف کر کے اچھے کی امید رکھتے تھے۔

linux-cleanup الٹا مؤقف اپناتا ہے: **اسکرپٹ سے چلنے والا، شفاف، اجازت فہرست سے محفوظ، اور ڈیفالٹ میں انٹرایکٹو۔** کسی چیز کو چھونے سے پہلے آپ بالکل پڑھ سکتے ہیں کہ یہ کیا چھوئے گا۔

## ڈیزائن کے اصول {#design-principles}

**شک ہو تو انکار۔** [اجازت فہرست، پابندی فہرست نہیں](./safety/guards.md#guard-1--the-path-allowlist)۔ جو پاتھ ٹول نہیں پہچانتا، وہ رد ہوتا ہے۔ پابندی فہرست میں کیش صاف کرنے اور ہوم فولڈر صاف کرنے کے درمیان بس ایک ٹائپنگ کی غلطی ہوتی ہے۔

**کیش اور ٹولز میں فرق کرو۔** `~/.cache/yarn` سیکنڈوں میں دوبارہ بن جاتا ہے؛ Gradle wrapper کی تقسیم 230 MB کا ڈاؤن لوڈ ہے جو اگلے مہینے چاہیے ہو سکتی ہے۔ [غیر فعالیت کی رکاوٹ](./safety/guards.md#guard-2--the-staleness-gate) اس لیے ہے کہ دونوں کو ایک جیسا سمجھنا غلط تھا، اور 1.2.0 نے یہ بدلا۔

**ذاتی ڈیٹا کا فیصلہ صارف کرتا ہے۔** ڈسک پر کچھ بھی یہ فرق نہیں بتاتا کہ کوئی انسٹالر آپ پھر کبھی نہیں کھولیں گے یا وہ کسی دستاویز کی واحد کاپی ہے۔ ٹول اندازہ لگانے سے انکار کرتا ہے، اسی لیے وہ موڈز [`--yes` کو نظرانداز کرتے ہیں](./safety/guards.md#guard-3--personal-data-is-interactive-only)۔

**بحالی سے بہتر بچاؤ۔** [کوئی واپسی نہیں](./safety/irreversibility.md)، جان بوجھ کر — واپسی کا لاگ اسی ڈسک پر لکھائی بڑھاتا ہے جسے آپ خالی کر رہے ہیں، اور لاپروائی پیدا کرتا ہے۔

**سہولت سے زیادہ جانچ کے قابل۔** Bash، کیونکہ یہ پہلے سے انسٹال ہے اور پڑھا جا سکتا ہے۔ کمپائل کی ہوئی بائنری زیادہ آرام دہ ہوتی، مگر اس پر بھروسا کرنا کہیں مشکل۔

**ریلیز جانچ محدود ہے۔** شروع ہونے پر، آن لائن ہو تو CLI ایک عوامی ریلیز ریکارڈ پڑھتا ہے۔ یہ صفائی کے پاتھس، رپورٹس یا کریش بنڈلز اپ لوڈ نہیں کرتا؛ رپورٹ بھیجنا آپ کی مرضی ہے۔

## اصلاحات ٹول کو شکل دیتی ہیں {#corrections-shape-the-tool}

دو حفاظتی خصوصیات اس لیے ہیں کہ کسی نے اصل مسئلہ بتایا۔

[محفوظ انسٹال روٹس کی فہرست](./reference/protected-paths.md#exact-match-protected-paths) ایک اصل خرابی سے آئی: pnpm صفائی کا ہدف `~/.local/share/pnpm` تھا — انسٹال روٹ — اور اس نے گلوبل انسٹال پیکیجز حذف کر دیے۔ [1.1.0](./changelog.md#110--2026-05-10) میں ٹھیک ہوا، ساتھ ایک جانچ شامل کی گئی تاکہ دوبارہ نہ ہو۔

[غیر فعالیت کی رکاوٹ](./safety/guards.md#guard-2--the-staleness-gate) ایک صارف کی اس بات سے آئی کہ 1.2.0 اب بھی Android AVD پورے صاف کر دیتا تھا، اور یہی دلیل ہر اس چیز پر لاگو ہونی چاہیے جو کیش نہیں بلکہ ٹول ہے۔ یہی [1.2.1](./changelog.md#121--2026-05-10) بنا۔

اگر کچھ غلط ملے تو [بتائیں](./guides/send-a-bug-report.md)۔

## لائسنس {#licence}

[1.4.0](./changelog.md#140--2026-07-11) سے **[MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)**۔

ذاتی یا تجارتی استعمال کریں، بدلیں، فورک کریں، شامل کریں، دوبارہ تقسیم کریں۔ واحد شرط یہ ہے کہ کاپیوں یا بڑے حصوں میں کاپی رائٹ نوٹس اور MIT اجازت نوٹس باقی رہے۔

:::danger "جیسا ہے" فراہم کیا گیا، بغیر کسی ضمانت کے
یہ فائلیں حذف کرنے والا ٹول ہے۔ اس کے استعمال سے ہونے والے کسی دعوے یا نقصان، بشمول ڈیٹا ضائع ہونے، کی ذمہ داری مصنف نہیں لیتا۔ اپنے ڈیٹا کا بیک اپ لیں اور تصدیق سے پہلے ہر کارروائی دیکھیں۔

[لائسنس کا پورا متن](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE) ہی معتبر ہے۔
:::

1.4.0 سے پہلے شائع ریلیزز اسی لائسنس میں رہتی ہیں جس میں وہ آئیں۔

## تعاون {#contributing}

MIT کے تحت تعاون کا خیرمقدم ہے۔

- **فورک کریں اور پل ریکوئسٹ کھولیں** — کسی خاص رسائی کی ضرورت نہیں
- **خرابیاں بتائیں یا فیچر مانگیں** [GitHub issues](https://github.com/aoneahsan/linux-cleanup/issues) یا ای میل سے
- **`main` محفوظ ہے** — تبدیلیاں جائزہ شدہ PRs سے آتی ہیں

کوڈنگ کے معیار: حفاظت پہلے، صرف آف لائن، ShellCheck سے صاف۔ دیکھیں [CONTRIBUTING.md](https://github.com/aoneahsan/linux-cleanup/blob/main/CONTRIBUTING.md)۔

صرف تفصیل والی فیچر درخواست کا بھی کوڈ جتنا ہی خیرمقدم ہے۔ بتائیں کہ آپ کیا صاف کروانا چاہیں گے اور موجودہ موڈز اسے کیوں نہیں سنبھالتے۔

## یہ دستاویزات {#this-documentation}

[Docusaurus](https://docusaurus.io/) سے بنی اور GitHub Pages پر شائع۔ سورس: [github.com/aoneahsan/linux-cleanup-docs](https://github.com/aoneahsan/linux-cleanup-docs) — وہاں بھی اصلاحات کا خیرمقدم ہے۔

AI معاونین کے لیے مشین کے پڑھنے لائق خلاصہ: [`/llms.txt`](https://linux-cleanup-docs.aoneahsan.com/llms.txt)۔

## متعلقہ لنکس {#related-links}

| | |
|---|---|
| **سورس** | [github.com/aoneahsan/linux-cleanup](https://github.com/aoneahsan/linux-cleanup) |
| **npm** | [npmjs.com/package/linux-cleanup](https://www.npmjs.com/package/linux-cleanup) |
| **مسائل** | [github.com/aoneahsan/linux-cleanup/issues](https://github.com/aoneahsan/linux-cleanup/issues) |
| **کام کی حمایت کریں** | [aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=linux-cleanup&project-identifier=linux-cleanup) |
