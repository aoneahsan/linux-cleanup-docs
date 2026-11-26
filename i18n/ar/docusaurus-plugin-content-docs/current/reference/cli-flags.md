---
title: خيارات سطر الأوامر
description: كل خيار في سطر أوامر linux-cleanup — الأوضاع والخيارات والأسماء البديلة والقيم الافتراضية — مع عمل كل منها وموضع توثيقه الكامل.
tags: [cli, flags, reference, options, commands]
sidebar_position: 1
---

# خيارات سطر الأوامر

**كل خيار يقبله linux-cleanup.** الأوضاع متنافية — يُمرَّر وضع واحد. وتجتمع الخيارات مع أي وضع.

```bash
linux-cleanup --help    # القائمة نفسها، مع مسارات جهازك الفعلية
```

يطبع الخيار غير المعروف نص المساعدة ويخرج بالرمز `2`.

## الأوضاع {#modes}

يُمرَّر وضع واحد على الأكثر. ودون أي وضع تبدأ [الجولة الموجّهة](../modes/walkthrough.md).

| الخيار | الأسماء البديلة | العمل | الصفحة الكاملة |
|---|---|---|---|
| _(بلا)_ | `-w` `--walkthrough` | عشر خطوات موجّهة، مع سؤال قبل كل خطوة | [الجولة الموجّهة](../modes/walkthrough.md) |
| `-m` | `--menu` `-i` `--interactive` | قائمة مرقّمة للانتقال المباشر | [القائمة](../modes/menu.md) |
| `-t` | `--tui` `-g` `--gui` | قائمة مرئية بـ whiptail / dialog | [TUI](../modes/tui.md) |
| `-a` | `--all-safe` | تنظيف دفعي لكل ذاكرة مؤقتة قابلة للتوليد | [الآمن بالكامل](../modes/all-safe.md) |
| `-s` | `--scan` | فحص للقراءة فقط لكل فئة | [الفحص](../modes/scan.md) |
| `-p` | `--stale` | ملفات شخصية كبيرة مهملة (تفاعلي) | [الملفات الشخصية المهملة](../modes/personal-stale-files.md) |
| | `--system` | apt والسجل وsnap و`/tmp` وذاكرة الصفحات (sudo) | [تنظيف النظام](../modes/system-cleanup.md) |
| | `--partials` | تنزيلات غير مكتملة متروكة (تفاعلي) | [التنزيلات غير المكتملة أو المتروكة](../modes/partial-downloads.md) |
| | `--audit` | أكبر 20 عنصرًا في `$HOME` | [فحص المجلد الرئيسي](../modes/home-audit.md) |
| | `--node-modules` | `node_modules` مهملة (تفاعلي) | [باحث node_modules المهملة](../modes/node-modules-finder.md) |
| | `--globals` | فحص للقراءة فقط للحزم العامة | [فحص الحزم العامة](../modes/globals-audit.md) |
| | `--doctor` | إصلاح تهيئة الصدفة المفقودة لبيئات التشغيل | [الطبيب](../modes/doctor.md) |
| | `--speed` | فحص الضغط وأعمال الإقلاع؛ مع سؤال قبل أي تغيير | [تشخيص السرعة](../modes/speed.md) |
| | `--editor-ext` | إصدارات VS Code / Cursor المستبدلة | [إضافات المحررات](../modes/editor-extensions.md) |
| | `--reports` | مدير تفاعلي لسجلات الجلسات | [التقارير](../modes/reports.md) |
| | `--export FMT ID` | تحويل غير تفاعلي للسجلات | [التقارير](../modes/reports.md#exporting) |
| | `--feedback` | تعليمات الإبلاغ عن الخلل، ومسودة mailto اختيارية | [إرسال تقرير خلل](../guides/send-a-bug-report.md) |
| | `--debug-bundle` | حزم أحدث سجل وتقرير في ملف tar.gz | [إرسال تقرير خلل](../guides/send-a-bug-report.md) |
| | `--list-targets` | طباعة كل مسار قابل للاستهداف وكل مسار محمي | [المعاينة قبل الحذف](../safety/preview-first.md) |
| | `--self-test` | فحص الاعتماديات والصياغة وحواجز السلامة | [المعاينة قبل الحذف](../safety/preview-first.md) |
| `-V` | `--version` | الإصدار والمؤلف | — |
| | `--install-alias` | إضافة الاسم المستعار `cleanup` للصدفة | [الاسم المستعار للصدفة وcron الأسبوعي](../guides/alias-and-cron.md) |
| | `--install-cron` | `--all-safe -y` أسبوعيًا، الأحد 03:00 | [الاسم المستعار للصدفة وcron الأسبوعي](../guides/alias-and-cron.md) |
| | `--uninstall-alias` | إزالة الاسم المستعار | [إلغاء التثبيت](../guides/uninstall.md) |
| | `--uninstall-cron` | إزالة مدخل cron | [إلغاء التثبيت](../guides/uninstall.md) |
| | `--refresh-app` | تحديث النسخة الدائمة التي يستخدمها الاسم المستعار وcron | [التثبيت](../getting-started/installation.md) |

## الخيارات {#options}

| الخيار | الافتراضي | الأثر |
|---|---|---|
| `-d N` `--days N` | `100` | حد الخمول. لا يكون الملف مؤهلًا إلا إذا تجاوزه `atime` و`mtime` **كلاهما**. والقيمة الأقل أشد |
| `--purge-all` | معطّل | **يعطّل حاجز الخمول.** تُمسح أهداف الذاكرة المؤقتة كاملة — سلوك ما قبل 1.2.0 |
| `-y` `--yes` | معطّل | تأكيد تلقائي للذاكرة المؤقتة القابلة للتوليد. صالح مع `--all-safe` فقط. **وتتجاهله الأوضاع الشخصية** |
| `--no-report` | معطّل | يتخطى إنشاء JSON. وتُكتب السجلات مع ذلك |
| `--cleanup-logs` | معطّل | يحذف سجل هذا التشغيل في النهاية. **وتُحفظ التقارير دائمًا** |
| `-n` `--dry-run` | معطّل | يمر بالوضع المختار دون حذف ملفات أو تغيير إعدادات. يبقى سجل محلي؛ ولا يُكتب تقرير جلسة JSON |
| `--json-events` | معطّل | [أحداث تقرؤها الآلة](./json-events.md) على stdout مع `--scan` أو `--all-safe --yes`؛ ويذهب النص المقروء إلى stderr |
| `--no-color` | معطّل | يعطّل ألوان ANSI. ويُحترم `NO_COLOR` أيضًا |
| `-h` `--help` | — | يطبع المساعدة ويخرج |

:::danger يزيل `--purge-all` حاجز سلامة
يعطّل [حاجز الخمول](../safety/guards.md#guard-2--the-staleness-gate)، فتُمسح الذاكرة المؤقتة كاملة أيًّا كان آخر استخدام لها. وتذهب معها الأصول المكلفة — توزيعات Gradle wrapper ومتصفحات Playwright وملفات Cypress التنفيذية. ويذكر شعار ما قبل التشغيل الاستراتيجية النشطة.
:::

:::note الفحص والتشغيل التجريبي يجيبان عن سؤالين مختلفين
يقرأ [`--scan`](../modes/scan.md) المسارات والأحجام الحالية. ويمر `--dry-run` بالتنظيف المختار ويعرض الإجراءات المقترحة دون حذف. انظر [المعاينة قبل الحذف](../safety/preview-first.md).
:::

## وصفات {#recipes}

| الهدف | الأمر |
|---|---|
| التحقق من التثبيت | `linux-cleanup --self-test` |
| معرفة ما يمكن استعادته | `linux-cleanup --scan` |
| معاينة تنظيف مختار للذاكرة المؤقتة | `linux-cleanup --all-safe --dry-run` |
| بث فحص للقراءة فقط كأحداث JSON | `linux-cleanup --scan --json-events` |
| عرض كل مسار يمكنه لمسه | `linux-cleanup --list-targets` |
| تنظيف موجّه | `linux-cleanup` |
| دفعة واحدة دون أسئلة | `linux-cleanup --all-safe -y` |
| تنظيف شديد | `linux-cleanup --all-safe -y -d 30` |
| أقصى استعادة قبل إعادة تثبيت النظام | `linux-cleanup --all-safe -y --purge-all` |
| قائمة مرئية | `linux-cleanup --tui` |
| مجلدات اعتماديات المشاريع القديمة | `linux-cleanup --node-modules -d 90` |
| صيانة النظام | `linux-cleanup --system` |
| أتمتة أسبوعية | `linux-cleanup --install-cron` |
| تحويل أحدث تقرير إلى HTML | `linux-cleanup --export html latest` |
| الإبلاغ عن خلل | `linux-cleanup --debug-bundle && linux-cleanup --feedback` |

## متغيرات البيئة {#environment-variables}

الأكثر استخدامًا، و[القائمة الكاملة](./environment-variables.md) منفصلة:

| المتغير | الأثر |
|---|---|
| `NO_COLOR` | أي قيمة غير فارغة تعطّل الألوان |
| `LINUX_CLEANUP_LOG_DIR` | تغيير مجلد السجلات |
| `LINUX_CLEANUP_REPORTS_DIR` | تغيير مجلد سجلات الجلسات |
| `LINUX_CLEANUP_DATA_HOME` | المجلد الأب للسجلات والتقارير وحزم الملاحظات |

## رموز الخروج {#exit-codes}

| الرمز | المعنى |
|---|---|
| `0` | تشغيل سليم |
| `2` | خطأ في تحليل الوسائط أو وضع لا يدعمه بث الأحداث |
| `3` | إصدار أقدم يمنعه سجل الإصدارات |
| `130` | أُوقف بـ `Ctrl-C` |
| `143` | أُنهي بـ `SIGTERM` |
| غير ذلك | غير متوقع — تُكتب حزمة انهيار |

الجدول الكامل ومنطق فخ الانهيار: [رموز الخروج](./exit-codes.md).
