---
sidebar_position: 9
title: linux-cleanup وDisk Cleaner
description: "كيف يختلف linux-cleanup عن Disk Cleaner، استنادًا إلى صفحاتهما، بتاريخ تحقق 2026-11-22."
---

# linux-cleanup وDisk Cleaner

*آخر تحقق في 2026-11-22 مقابل <a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">الصفحة الرسمية لـ Disk Cleaner</a>.*

**ما هو:** أداة تنظيف GTK لنظام Linux مع تصوّرات للقرص ومهام تنظيف مقترحة.

**السعر هناك:** غير مذكور في الصفحات التي راجعناها. **السعر هنا:** سطر الأوامر مجاني بترخيص MIT. وخطط تطبيق سطح المكتب في [صفحة الأسعار](https://linux-cleanup.aoneahsan.com/ar/pricing).

| | linux-cleanup | Disk Cleaner |
|---|---|---|
| واجهة سطر الأوامر | نعم | نعم (<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| المعاينة قبل الحذف | نعم | غير مذكور في الصفحات التي راجعناها |
| التشغيل التجريبي | نعم | نعم (<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| تنظيف ذاكرة التخزين المؤقت | نعم | نعم (<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| العثور على الملفات المكرّرة | جزئيًا | غير مذكور في الصفحات التي راجعناها |

## من يخدمه Disk Cleaner أكثر {#who-is-better-served-by-disk-cleaner}

اختر Disk Cleaner إن كنت تحتاج إلى عرض تفاعلي بخريطة شجرية أو مخطّط شمسي.

## أين يتقدّم linux-cleanup {#where-linux-cleanup-is-ahead}

اختر linux-cleanup إن أردت أن تقرّر الأداة بالقواعد أيّ ذاكرات التخزين المؤقت تجاوزت حدّ الخمول، بدل قراءة مخطّط والاختيار يدويًا.

## من أين تبدأ هنا {#where-to-start-here}

لا يوجد استيراد من أداة إلى أخرى؛ فلكل منهما قواعدها. ولمعرفة ما سيفعله linux-cleanup على الحاسوب، يُبدأ بـ[المعاينة قبل الحذف](../safety/preview-first.md) ويُشغَّل `npx -y linux-cleanup --all-safe --yes --dry-run`، الذي لا يحذف شيئًا.
