---
sidebar_position: 7
title: linux-cleanup وTuxCleaner
description: "كيف يختلف linux-cleanup عن TuxCleaner، استنادًا إلى صفحاتهما، بتاريخ تحقق 2026-11-22."
---

# linux-cleanup وTuxCleaner

*آخر تحقق في 2026-11-22 مقابل <a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">الصفحة الرسمية لـ TuxCleaner</a>.*

**ما هو:** سطر أوامر لنظام Linux للتنظيف وإلغاء تثبيت التطبيقات وتحليل القرص وعرض الحالة.

**السعر هناك:** غير مذكور في الصفحات التي راجعناها. **السعر هنا:** سطر الأوامر مجاني بترخيص MIT. وخطط تطبيق سطح المكتب في [صفحة الأسعار](https://linux-cleanup.aoneahsan.com/ar/pricing).

| | linux-cleanup | TuxCleaner |
|---|---|---|
| واجهة سطر الأوامر | نعم | نعم (<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| المعاينة قبل الحذف | نعم | نعم (<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| التشغيل التجريبي | نعم | نعم (<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| تنظيف ذاكرة التخزين المؤقت | نعم | نعم (<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| العثور على الملفات المكرّرة | جزئيًا | غير مذكور في الصفحات التي راجعناها |

## من يخدمه TuxCleaner أكثر {#who-is-better-served-by-tuxcleaner}

اختر TuxCleaner لمحوّلات الحزم الخاصة بكل توزيعة وإلغاء تثبيت التطبيقات.

## أين يتقدّم linux-cleanup {#where-linux-cleanup-is-ahead}

اختر linux-cleanup إن كنت تفضّل تشغيل سكربت Bash عبر npx دون خطوة بناء، والإبقاء على قواعده التي لا تحذف إلا الخامل لوحدات Gradle وAndroid Studio الكاملة.

## من أين تبدأ هنا {#where-to-start-here}

لا يوجد استيراد من أداة إلى أخرى؛ فلكل منهما قواعدها. ولمعرفة ما سيفعله linux-cleanup على الحاسوب، يُبدأ بـ[المعاينة قبل الحذف](../safety/preview-first.md) ويُشغَّل `npx -y linux-cleanup --all-safe --yes --dry-run`، الذي لا يحذف شيئًا.
