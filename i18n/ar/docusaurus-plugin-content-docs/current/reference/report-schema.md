---
title: مخطط التقرير
description: بنية JSON التي تكتبها الجولة الموجّهة في linux-cleanup، مع credits وmeta وdisk وmemory وsteps وtotals.
sidebar_position: 7
---

# مخطط التقرير

**تكتب الجولة الموجّهة سجل JSON يحمل `"schema_version": 1`**، ما لم يُضبط `--no-report` أو `--dry-run`. ولا يكتب `--scan` المستقل هذا التقرير. وللحصول على فحص تقرؤه الآلة يُستخدم `--scan --json-events`؛ ولذلك البث بنية مختلفة.

:::warning تصف وثائق أقدم بنية مختلفة
تصف بعض المواد — ومنها صفحة مرجعية داخل مستودع الشيفرة — شكلًا مبنيًا حول `schema` (نص مثل `linux-cleanup/report/v1`) مع الكائنات `tool` و`session` و`categories`.

**الأداة لا تُخرج ذلك.** ومحلل مكتوب عليه سيخفق مع كل ملف حقيقي. والبنية أدناه هي ما يكتبه `modules/walkthrough.sh`. يُتحقق منها على جهازك:

```bash
jq 'keys' "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```
:::

## المستوى الأعلى {#top-level}

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

| المفتاح | النوع | المحتوى |
|---|---|---|
| `schema_version` | رقم | حاليًا `1`. تُرفض أي قيمة غير معروفة |
| `credits` | كائن | هوية الأداة والترخيص والمؤلف |
| `meta` | كائن | سياق الجلسة — متى وأين وكيف وبأي إعدادات |
| `disk` | كائن | استخدام نظام الملفات قبل وبعد |
| `memory` | كائن | استخدام الذاكرة قبل وبعد |
| `steps` | مصفوفة | مدخل لكل خطوة جُرّبت |
| `totals` | كائن | ملخص الجلسة |

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

يوجد هذا القسم كي يحمل السجل مصدره أينما انتهى. ولا شيء فيه يعكس جهازك.

## `meta` {#meta}

| المفتاح | النوع | المحتوى |
|---|---|---|
| `tool` | نص | دائمًا `linux-cleanup` |
| `tool_version` | نص | الإصدار الذي كتب السجل. ويُبنى عليه منطق المستهلك |
| `started_at` | نص | وقت بدء الجلسة |
| `finished_at` | نص | وقت انتهاء الجلسة |
| `duration_seconds` | رقم | المدة الفعلية |
| `host` | نص | مخرجات `hostname` |
| `user` | نص | `$USER` |
| `mode` | نص | الوضع الذي عمل — `walkthrough` و`scan` و`allsafe` و`system` وغيرها |
| `stale_days` | رقم | حد `--days` الساري |
| `log_file` | نص | المسار المطلق لسجل هذه الجلسة |
| `launcher` | نص | طريقة الاستدعاء — `bash` للتشغيل المباشر |
| `via_npx` | رقم | `1` عند التشغيل عبر مشغّل npm، و`0` في غير ذلك |

تسجيل `stale_days` مفيد: فهو الفرق بين تشغيل قلّم عند 100 يوم وآخر عمل بـ `-d 30`، ويفسّر لماذا استعادت جلستان على الجهاز نفسه مقادير مختلفة.

## `disk` و`memory` {#disk-and-memory}

يحمل كلاهما لقطة `before` وأخرى `after`، تؤخذان عند بدء الجلسة وانتهائها.

يحمل `disk` حقول نظام الملفات — النظام والحجم والمستخدم والمتاح ونسبة الاستخدام — المأخوذة من `df`. ويحمل `memory` ما يقابلها من تقرير الذاكرة في النظام.

:::note الفرق بين `after` و`before` ليس كله من التنظيف
هذه قياسات للجهاز كله. فالبناء أو تحديث الحزم أو متصفح يعمل أثناء الجلسة يحرّكها أيضًا، ولذلك قد تقل الاستعادة المبلغ عنها عن مجموع الخطوات — أو تكون سالبة. انظر [استكشاف الأخطاء](../troubleshooting.md#disk-usage-grew-during-the-session).
:::

## `steps` {#steps}

مصفوفة فيها مدخل لكل خطوة جُرّبت، بالترتيب:

```json
{ "n": 1, "title": "Package-manager caches", "status": "ran", "freed_bytes": 13315108864 }
```

| المفتاح | النوع | المحتوى |
|---|---|---|
| `n` | رقم | رقم الخطوة بدءًا من 1 |
| `title` | نص | اسم الخطوة المقروء |
| `status` | نص | `ran` أو `skipped` أو `skipped (quit)` أو `skipped (jq missing)` |
| `freed_bytes` | رقم | البايتات التي استعادتها الخطوة. `0` عند التخطي |

يعلّم `skipped (quit)` الخطوات التي تلت الضغط على `q` — وهو مفيد للتمييز بين إيقاف مقصود وخطوة رُفضت وحدها.

## `totals` {#totals}

| المفتاح | النوع | المحتوى |
|---|---|---|
| `total_reclaimed_bytes` | رقم | المجموع عبر الخطوات |
| `total_reclaimed_human` | نص | القيمة نفسها منسّقة |
| `steps_run` | رقم | الخطوات بالحالة `ran` |
| `steps_skipped` | رقم | الخطوات بحالة `skipped` |

## التحليل {#parsing}

```bash
LATEST="$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

jq '.totals.total_reclaimed_human' "$LATEST"
jq '.meta | {mode, stale_days, duration_seconds}' "$LATEST"
jq '.steps[] | select(.status == "ran") | "\(.title): \(.freed_bytes)"' "$LATEST"

# الاستعادة عبر كل الجلسات المسجلة
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## التحقق {#validating}

لا يأتي مع الأداة ملف JSON Schema. وهذا فحص للبنية:

```bash
jq -e 'has("schema_version") and .schema_version == 1
       and has("meta") and has("steps") and has("totals")' \
  ~/.linux-cleanup/reports/report-*.json
```

يطبع `true` لكل ملف صالح.

## إرشادات التوافق {#compatibility-guidance}

عند كتابة مستهلك:

- **يُتفرّع حسب `schema_version`.** وتُعامل القيمة غير المعروفة على أنها غير قابلة للتحليل بدلًا من التخمين
- **تُعامل المفاتيح غير المعروفة على أنها إضافات.** فقد أُضيفت حقول داخل الإصدار 1 وقد يتكرر ذلك
- **يُستخدم `meta.tool_version`** للسلوك الذي يختلف بين الإصدارات
- **لا يُفترض أن كل وضع يملأ كل قسم.** فأوضاع القراءة فقط تنتج خطوات أقل
- **يُتوقع أن يكون `total_reclaimed_bytes` سالبًا أحيانًا.** فهو فرق في `df`، لا مجموع للمحذوفات

## التالي {#next}

- [التقارير](../modes/reports.md) — العرض والتصدير
- [مسارات المخرجات](./output-paths.md) — أين توجد الملفات
