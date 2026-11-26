---
sidebar_position: 3
title: linux-cleanup وStacer
description: "كيف يختلف linux-cleanup عن Stacer، استنادًا إلى صفحاتهما، بتاريخ تحقق 2026-11-22."
---

# linux-cleanup وStacer

*آخر تحقق في 2026-11-22 مقابل <a href="https://stacer.quentium.fr/" target="_blank" rel="noopener noreferrer nofollow">الصفحة الرسمية لـ Stacer</a>.*

**ما هو:** أداة لمراقبة نظام Linux وتحسينه مع منظّف للنظام.

**السعر هناك:** غير مذكور في الصفحات التي راجعناها. **السعر هنا:** سطر الأوامر مجاني بترخيص MIT. وخطط تطبيق سطح المكتب في [صفحة الأسعار](https://linux-cleanup.aoneahsan.com/ar/pricing).

| | linux-cleanup | Stacer |
|---|---|---|
| واجهة سطر الأوامر | نعم | غير مذكور في الصفحات التي راجعناها |
| المعاينة قبل الحذف | نعم | غير مذكور في الصفحات التي راجعناها |
| التشغيل التجريبي | نعم | غير مذكور في الصفحات التي راجعناها |
| تنظيف ذاكرة التخزين المؤقت | نعم | نعم (<a href="https://stacer.quentium.fr/" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| العثور على الملفات المكرّرة | جزئيًا | غير مذكور في الصفحات التي راجعناها |

## من يخدمه Stacer أكثر {#who-is-better-served-by-stacer}

اختر Stacer إن كنت تريد أيضًا أدوات التحكّم في الخدمات والعمليات وتطبيقات بدء التشغيل.

## أين يتقدّم linux-cleanup {#where-linux-cleanup-is-ahead}

اختر linux-cleanup لتنظيف يعتمد على الطرفية أولًا، يمكن تشغيله عبر npx أو مهمة cron، مع تشغيل تجريبي يسرد كل مسار قبل حذف أي شيء.

## من أين تبدأ هنا {#where-to-start-here}

لا يوجد استيراد من أداة إلى أخرى؛ فلكل منهما قواعدها. ولمعرفة ما سيفعله linux-cleanup على الحاسوب، يُبدأ بـ[المعاينة قبل الحذف](../safety/preview-first.md) ويُشغَّل `npx -y linux-cleanup --all-safe --yes --dry-run`، الذي لا يحذف شيئًا.
