---
sidebar_position: 5
title: linux-cleanup وCross Cleaner
description: "كيف يختلف linux-cleanup عن Cross Cleaner، استنادًا إلى صفحاتهما، بتاريخ تحقق 2026-11-22."
---

# linux-cleanup وCross Cleaner

*آخر تحقق في 2026-11-22 مقابل <a href="https://cross-cleaner.github.io/" target="_blank" rel="noopener noreferrer nofollow">الصفحة الرسمية لـ Cross Cleaner</a>.*

**ما هو:** أداة تنظيف متعددة المنصات بإصدارات نافذة وطرفية وسطر أوامر.

**السعر هناك:** مجاني (<a href="https://cross-cleaner.github.io/" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>، تحقّق 2026-11-22). **السعر هنا:** سطر الأوامر مجاني بترخيص MIT. وخطط تطبيق سطح المكتب في [صفحة الأسعار](https://linux-cleanup.aoneahsan.com/ar/pricing).

| | linux-cleanup | Cross Cleaner |
|---|---|---|
| واجهة سطر الأوامر | نعم | نعم (<a href="https://cross-cleaner.github.io/" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| المعاينة قبل الحذف | نعم | غير مذكور في الصفحات التي راجعناها |
| التشغيل التجريبي | نعم | نعم (<a href="https://cross-cleaner.github.io/" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| تنظيف ذاكرة التخزين المؤقت | نعم | نعم (<a href="https://cross-cleaner.github.io/" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| العثور على الملفات المكرّرة | جزئيًا | غير مذكور في الصفحات التي راجعناها |

## من يخدمه Cross Cleaner أكثر {#who-is-better-served-by-cross-cleaner}

اختر Cross Cleaner إن كنت تحتاج إلى أداة تنظيف واحدة لأنظمة Linux وWindows وmacOS وAndroid.

## أين يتقدّم linux-cleanup {#where-linux-cleanup-is-ahead}

اختر linux-cleanup لأداة مخصّصة لنظام Linux وحده، ترفض قائمتها المحمية بالاسم ~/Documents و~/.ssh و~/.config أيًّا كانت قاعدة ذاكرة التخزين المؤقت.

## من أين تبدأ هنا {#where-to-start-here}

لا يوجد استيراد من أداة إلى أخرى؛ فلكل منهما قواعدها. ولمعرفة ما سيفعله linux-cleanup على الحاسوب، يُبدأ بـ[المعاينة قبل الحذف](../safety/preview-first.md) ويُشغَّل `npx -y linux-cleanup --all-safe --yes --dry-run`، الذي لا يحذف شيئًا.
