---
title: مسارات المخرجات
description: "أين يكتب linux-cleanup سجلاته وسجلات جلسات JSON وحزم التصحيح وحزم الانهيار: البنية، والقيم الافتراضية لكل طريقة تثبيت، ومدة الاحتفاظ، والأذونات."
sidebar_position: 5
---

# مسارات المخرجات

**تقع كل المخرجات تحت جذر بيانات واحد.** ويتوقف تحديده على طريقة تثبيت الأداة، ويمكن تغيير كليهما.

## البنية {#layout}

```text
$DATA_HOME/
├── logs/
│   ├── cleanup-<YYYY-MM-DD_HHMMSS>.log     # واحد لكل جلسة
│   └── cron.log                             # يضيف إليه cron الأسبوعي
├── reports/
│   ├── report-<YYYY-MM-DD_HHMMSS>.json     # سجل الجولة الموجّهة ما لم يُعطَّل
│   ├── report-<YYYY-MM-DD_HHMMSS>.md       # يُنشئه --export md
│   └── report-<YYYY-MM-DD_HHMMSS>.html     # يُنشئه --export html
└── feedback/
    ├── debug-bundle-<YYYY-MM-DD_HHMMSS>.tar.gz   # يُنشئه --debug-bundle
    └── crash-<YYYY-MM-DD_HHMMSS>.tar.gz          # يُنشأ تلقائيًا عند الانهيار
```

## القيم الافتراضية لكل طريقة تثبيت {#per-install-defaults}

| طريقة التثبيت | `$DATA_HOME` |
|---|---|
| `npx linux-cleanup` | `~/.linux-cleanup/` |
| `npm install -g linux-cleanup` | `~/.linux-cleanup/` |
| `git clone` | مجلد النسخة المستنسخة نفسه |

هذا الفرق مقصود. فـ `npx` يشغّل الحزمة من مجلد مؤقت في ذاكرة npm المؤقتة يُفرَّغ، فتضيع المخرجات المكتوبة فيه؛ أما `~/.linux-cleanup/` فيبقى بين مرات التشغيل. والنسخة المستنسخة موقع دائم أصلًا، فتبقى المخرجات بجوار الشيفرة.

يُغيَّر أيٌّ منهما بـ [`LINUX_CLEANUP_DATA_HOME`](./environment-variables.md)، أو مجلدا السجلات والتقارير كلٌّ على حدة.

## مدة الاحتفاظ {#retention}

| المسار | تنظيف تلقائي | ملاحظات |
|---|---|---|
| `logs/cleanup-*.log` | فقط مع `--cleanup-logs` | يحذف هذا الخيار سجل **هذا التشغيل** عند الانتهاء. وتبقى السجلات السابقة |
| `logs/cron.log` | أبدًا | لا يُدوَّر أبدًا. يُدوَّر يدويًا إذا كبر |
| `reports/*.json` | **أبدًا** | سجل التدقيق الدائم |
| `reports/*.md`, `*.html` | **أبدًا** | تُنشأ عند الطلب وتُحذف عند الطلب |
| `feedback/*.tar.gz` | **أبدًا** | القرار لك متى لم تعد لازمة |

`--cleanup-logs` هو الحذف التلقائي الوحيد الذي تجريه الأداة على مخرجاتها، ولا يمس إلا ملفات `.log`.

## الحجم والاحتفاظ {#size-and-retention}

يتوقف حجم السجلات والحزم على المسارات والأحداث في التشغيل. ويُراجَع ما تراكم قبل حذف السجلات القديمة. ولتقليل الملفات الأقدم عن قصد:

```bash
find ~/.linux-cleanup/logs/    -name 'cleanup-*.log' -mtime +90 -delete
find ~/.linux-cleanup/reports/ -name 'report-*'      -mtime +90 -delete
```

تدوير سجل cron:

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## الأذونات {#permissions}

تعود ملكية الملفات إلى المستخدم الذي شغّل الأداة. وتُفحص أذوناتها الفعلية بـ `stat` على الجهاز؛ إذ تؤثر أذونات المجلدات التي تضبطها الأداة وقيمة umask للعملية. ولا يُشارَك سجل أو حزمة قبل قراءته.

## ما تحتويه هذه الملفات {#what-these-files-contain}

:::caution تحتوي السجلات والحزم على مساراتك
يذكر سجل الجلسة كل مسار تعامل معه، أي أنه يحتوي على أسماء مجلدات من جهازك — أسماء المشاريع، وأحيانًا أسماء ملفات من `~/Downloads`.

هذا محلي فقط ولا يُرسل أبدًا، لكن تُراجَع الحزمة قبل إرسالها بالبريد:

```bash
tar -tzf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz
```

انظر [إرسال تقرير خلل](../guides/send-a-bug-report.md).
:::

لا شيء هنا يحتوي على **محتوى** الملفات — فقط المسارات والأحجام والطوابع الزمنية. إنها سجلات لما حدث، لا نسخ مما حُذف. انظر [الاسترداد](../recovery.md).

## التالي {#next}

- [متغيرات البيئة](./environment-variables.md) — تغيير هذه المواقع
- [مخطط التقرير](./report-schema.md) — بنية JSON
