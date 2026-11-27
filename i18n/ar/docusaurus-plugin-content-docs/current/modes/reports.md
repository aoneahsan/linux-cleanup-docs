---
title: التقارير
description: يمكن أن تكتب الجولة الموجّهة سجل جلسة بصيغة JSON. سرد تلك السجلات وعرضها وتحويلها إلى Markdown أو HTML وتصديرها.
sidebar_position: 15
---

# التقارير

**تكتب الجولة الموجّهة سجل جلسة بصيغة JSON** في `~/.linux-cleanup/reports/report-<timestamp>.json`، ما لم يُضبط `--no-report` أو `--dry-run`. ولا تنشئ الأوضاع الأخرى هذا السجل. ولا تُحذف السجلات الموجودة تلقائيًا.

أما Markdown وHTML فتحويلات اختيارية تُنتج عند الطلب.

```bash
linux-cleanup --reports              # المدير التفاعلي
linux-cleanup --export both latest   # تحويل غير تفاعلي
```

## ما يحتويه سجل الجلسة {#what-a-session-record-contains}

| القسم | يحتوي |
|---|---|
| `schema_version` | حاليًا `1` |
| `credits` | اسم الأداة وإصدارها وصفحتها الرئيسية وترخيصها وبيانات المؤلف |
| `meta` | الطوابع الزمنية والمدة والجهاز والمستخدم والوضع وحد الخمول ومسار السجل والمشغّل |
| `disk` | استخدام نظام الملفات قبل وبعد |
| `memory` | استخدام الذاكرة قبل وبعد |
| `steps` | مدخل لكل خطوة: الرقم والعنوان والحالة والبايتات المحررة |
| `totals` | مجموع البايتات المستعادة والمجموع المقروء والخطوات المنفذة والمتخطاة |

المرجع الكامل حقلًا حقلًا: [بنية التقرير](../reference/report-schema.md).

## المدير التفاعلي {#the-interactive-manager}

```bash
linux-cleanup --reports
```

يسرد الجلسات السابقة، ويتيح عرض إحداها أو تحويلها إلى Markdown أو HTML أو فتح HTML في المتصفح أو حذفها.

تُخفى خيارات التحويل حين لا يكون `jq` مثبتًا — انظر [أدناه](#jq-is-required-for-conversion).

## التصدير {#exporting}

دون أسئلة، للبرامج النصية والعادات:

```bash
linux-cleanup --export both latest   # Markdown وHTML من أحدث سجل
linux-cleanup --export html all      # كل السجلات إلى HTML
linux-cleanup --export md 3          # السجل رقم 3 إلى Markdown
```

| الوسيط | يقبل |
|---|---|
| الصيغة | `md`, `html`, `both` |
| المعرّف | رقم سجل أو `latest` أو `all` |

تُكتب المخرجات بجانب ملف JSON بالطابع الزمني نفسه في اسم الملف. وملف HTML مكتفٍ بذاته — CSS مضمّن، ويراعي الوضع الداكن، بلا موارد خارجية — فيمكن إرساله بالبريد أو أرشفته ملفًا واحدًا.

## التحويل يتطلب `jq` {#jq-is-required-for-conversion}

:::note يُكتب JSON دائمًا؛ والتحويل هو الجزء الاختياري
دون `jq` تستطيع الجولة الموجّهة إنتاج سجل JSON كالمعتاد. ولا يتعذر إلا تصدير Markdown وHTML، وتسجّل الخطوة 10 من الجولة نفسها بالحالة `skipped (jq missing)`.

```bash
sudo apt install jq      # Debian / Ubuntu
sudo dnf install jq      # Fedora / RHEL
sudo pacman -S jq        # Arch
```
:::

يهرّب ملف HTML المُنشأ كل قيمة مأخوذة من JSON عبر مرشح `@html` في `jq`، فلا يستطيع إدخال مشوّه حقن ترميز في الصفحة المعروضة.

## الاستعلام من JSON مباشرة {#querying-the-json-directly}

صُمم JSON لتقرأه الأدوات:

```bash
# مجموع ما استُعيد في أحدث جلسة
jq '.totals.total_reclaimed_human' ~/.linux-cleanup/reports/report-*.json | tail -1

# كل خطوة نُفذت فعلًا في أحدث جلسة
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

# مجموع الاستعادة في كل الجلسات المسجلة
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## الاحتفاظ {#retention}

لا تُحذف هذه السجلات تلقائيًا **أبدًا**، ولا حتى بـ `--cleanup-logs` الذي لا يحذف إلا ملف سجل التشغيل الحالي.

لتقليلها يدويًا:

```bash
find ~/.linux-cleanup/reports/ -name 'report-*' -mtime +90 -delete
```

ولتخطي إنشائها تمامًا في تشغيل واحد يُستخدم `--no-report`؛ ويُكتب السجل مع ذلك.

## هذه سجلات لا نسخ احتياطية {#these-are-records-not-backups}

:::danger سجل الجلسة ملخص خطوات، لا نسخة احتياطية
يسجّل الخطوات وملاحظات القرص، لا قائمة كاملة بكل ملف محذوف. ولا يحتوي شيئًا من المحتوى المحذوف، ولا شيء فيه يستعيد أي شيء. وقيمته بعد حذف غير مرغوب أنه يساعد على معرفة ما يُستعاد من النسخة الاحتياطية الخاصة أو ما يُعاد تنزيله. انظر [الاستعادة](../recovery.md).
:::

## التالي {#next}

- [بنية التقرير](../reference/report-schema.md) — كل الحقول
- [مسارات المخرجات](../reference/output-paths.md) — أين تُكتب الملفات
- [الاستعادة](../recovery.md) — استخدام سجل الجلسة بعد مفاجأة
