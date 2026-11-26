---
sidebar_position: 6
title: linux-cleanup وCleanMate
description: "كيف يختلف linux-cleanup عن CleanMate، استنادًا إلى صفحاتهما، بتاريخ تحقق 2026-11-22."
---

# linux-cleanup وCleanMate

*آخر تحقق في 2026-11-22 مقابل <a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">الصفحة الرسمية لـ CleanMate</a>.*

**ما هو:** أداة تنظيف لنظامي macOS وUbuntu مع تطبيق سطح مكتب وتطبيق طرفية ومسار مراجعة قبل الحذف.

**السعر هناك:** مجاني (<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>، تحقّق 2026-11-22). **السعر هنا:** سطر الأوامر مجاني بترخيص MIT. وخطط تطبيق سطح المكتب في [صفحة الأسعار](https://linux-cleanup.aoneahsan.com/ar/pricing).

| | linux-cleanup | CleanMate |
|---|---|---|
| واجهة سطر الأوامر | نعم | نعم (<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| المعاينة قبل الحذف | نعم | نعم (<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| التشغيل التجريبي | نعم | غير مذكور في الصفحات التي راجعناها |
| تنظيف ذاكرة التخزين المؤقت | نعم | نعم (<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| العثور على الملفات المكرّرة | جزئيًا | نعم (<a href="https://cleanmate.homielab.com/" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |

## من يخدمه CleanMate أكثر {#who-is-better-served-by-cleanmate}

اختر CleanMate إن أردت تطبيقه لسطح مكتب Ubuntu، أو Space Lens، أو مسار سلة المهملات والتراجع للملفات الشخصية.

## أين يتقدّم linux-cleanup {#where-linux-cleanup-is-ahead}

اختر linux-cleanup إن أردت سطر أوامر قابلًا للبرمجة مع تدفّق أحداث JSON، وتسجيل كل تشغيل فعلي في تقرير JSON محلي.

## من أين تبدأ هنا {#where-to-start-here}

لا يوجد استيراد من أداة إلى أخرى؛ فلكل منهما قواعدها. ولمعرفة ما سيفعله linux-cleanup على الحاسوب، يُبدأ بـ[المعاينة قبل الحذف](../safety/preview-first.md) ويُشغَّل `npx -y linux-cleanup --all-safe --yes --dry-run`، الذي لا يحذف شيئًا.
