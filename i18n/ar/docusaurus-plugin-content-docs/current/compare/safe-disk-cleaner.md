---
sidebar_position: 11
title: linux-cleanup وSafe Disk Cleaner
description: "كيف يختلف linux-cleanup عن Safe Disk Cleaner، استنادًا إلى صفحاتهما، بتاريخ تحقق 2026-11-22."
---

# linux-cleanup وSafe Disk Cleaner

*آخر تحقق في 2026-11-22 مقابل <a href="https://github.com/cyb3rl00m/safe-disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">الصفحة الرسمية لـ Safe Disk Cleaner</a>.*

**ما هو:** تطبيق GTK 4 يشرح فئات القرص ويسأل قبل الحذف.

**السعر هناك:** غير مذكور في الصفحات التي راجعناها. **السعر هنا:** سطر الأوامر مجاني بترخيص MIT. وخطط تطبيق سطح المكتب في [صفحة الأسعار](https://linux-cleanup.aoneahsan.com/ar/pricing).

| | linux-cleanup | Safe Disk Cleaner |
|---|---|---|
| واجهة سطر الأوامر | نعم | غير مذكور في الصفحات التي راجعناها |
| المعاينة قبل الحذف | نعم | نعم (<a href="https://github.com/cyb3rl00m/safe-disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| التشغيل التجريبي | نعم | غير مذكور في الصفحات التي راجعناها |
| تنظيف ذاكرة التخزين المؤقت | نعم | نعم (<a href="https://github.com/cyb3rl00m/safe-disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| العثور على الملفات المكرّرة | جزئيًا | غير مذكور في الصفحات التي راجعناها |

## من يخدمه Safe Disk Cleaner أكثر {#who-is-better-served-by-safe-disk-cleaner}

اختر Safe Disk Cleaner لشروحه الواضحة للفئات وعرضه لسطح مكتب GTK.

## أين يتقدّم linux-cleanup {#where-linux-cleanup-is-ahead}

اختر linux-cleanup إن أردت النوع نفسه من القرارات من الطرفية، مع تشغيل تجريبي يمكن حفظه، و--self-test يمكنك تشغيله قبل الوثوق به.

## من أين تبدأ هنا {#where-to-start-here}

لا يوجد استيراد من أداة إلى أخرى؛ فلكل منهما قواعدها. ولمعرفة ما سيفعله linux-cleanup على الحاسوب، يُبدأ بـ[المعاينة قبل الحذف](../safety/preview-first.md) ويُشغَّل `npx -y linux-cleanup --all-safe --yes --dry-run`، الذي لا يحذف شيئًا.
