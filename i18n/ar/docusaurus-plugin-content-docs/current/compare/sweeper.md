---
sidebar_position: 4
title: linux-cleanup وSweeper
description: "كيف يختلف linux-cleanup عن Sweeper، استنادًا إلى صفحاتهما، بتاريخ تحقق 2026-11-22."
---

# linux-cleanup وSweeper

*آخر تحقق في 2026-11-22 مقابل <a href="https://apps.kde.org/en-gb/sweeper/" target="_blank" rel="noopener noreferrer nofollow">الصفحة الرسمية لـ Sweeper</a>.*

**ما هو:** أداة من KDE لمسح ملفات تعريف الارتباط وذاكرات التخزين المؤقت وآثار الاستخدام الأخرى.

**السعر هناك:** غير مذكور في الصفحات التي راجعناها. **السعر هنا:** سطر الأوامر مجاني بترخيص MIT. وخطط تطبيق سطح المكتب في [صفحة الأسعار](https://linux-cleanup.aoneahsan.com/ar/pricing).

| | linux-cleanup | Sweeper |
|---|---|---|
| واجهة سطر الأوامر | نعم | غير مذكور في الصفحات التي راجعناها |
| المعاينة قبل الحذف | نعم | غير مذكور في الصفحات التي راجعناها |
| التشغيل التجريبي | نعم | غير مذكور في الصفحات التي راجعناها |
| تنظيف ذاكرة التخزين المؤقت | نعم | نعم (<a href="https://apps.kde.org/en-gb/sweeper/" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| العثور على الملفات المكرّرة | جزئيًا | غير مذكور في الصفحات التي راجعناها |

## من يخدمه Sweeper أكثر {#who-is-better-served-by-sweeper}

اختر Sweeper لأداة سطح مكتب من KDE تركّز على آثار الاستخدام.

## أين يتقدّم linux-cleanup {#where-linux-cleanup-is-ahead}

اختر linux-cleanup لذاكرات مديري الحزم والمطوّرين المؤقتة التي تجاوزت حدّ الخمول، وهو ما لا تستهدفه أداة مسح الآثار.

## من أين تبدأ هنا {#where-to-start-here}

لا يوجد استيراد من أداة إلى أخرى؛ فلكل منهما قواعدها. ولمعرفة ما سيفعله linux-cleanup على الحاسوب، يُبدأ بـ[المعاينة قبل الحذف](../safety/preview-first.md) ويُشغَّل `npx -y linux-cleanup --all-safe --yes --dry-run`، الذي لا يحذف شيئًا.
