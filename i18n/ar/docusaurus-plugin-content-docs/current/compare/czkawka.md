---
sidebar_position: 10
title: linux-cleanup وCzkawka
description: "كيف يختلف linux-cleanup عن Czkawka، استنادًا إلى صفحاتهما، بتاريخ تحقق 2026-11-22."
---

# linux-cleanup وCzkawka

*آخر تحقق في 2026-11-22 مقابل <a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">الصفحة الرسمية لـ Czkawka</a>.*

**ما هو:** أداة للعثور على الملفات المكرّرة والمجلدات الفارغة والوسائط المتشابهة وغيرها من الفوضى.

**السعر هناك:** غير مذكور في الصفحات التي راجعناها. **السعر هنا:** سطر الأوامر مجاني بترخيص MIT. وخطط تطبيق سطح المكتب في [صفحة الأسعار](https://linux-cleanup.aoneahsan.com/ar/pricing).

| | linux-cleanup | Czkawka |
|---|---|---|
| واجهة سطر الأوامر | نعم | نعم (<a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| المعاينة قبل الحذف | نعم | غير مذكور في الصفحات التي راجعناها |
| التشغيل التجريبي | نعم | غير مذكور في الصفحات التي راجعناها |
| تنظيف ذاكرة التخزين المؤقت | نعم | غير مذكور في الصفحات التي راجعناها |
| العثور على الملفات المكرّرة | جزئيًا | نعم (<a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |

## من يخدمه Czkawka أكثر {#who-is-better-served-by-czkawka}

اختر Czkawka للعثور على الملفات الشخصية المكرّرة أو المتشابهة؛ فـ linux-cleanup لا يدّعي هذه المهمة.

## أين يتقدّم linux-cleanup {#where-linux-cleanup-is-ahead}

اختر linux-cleanup لذاكرات التخزين المؤقت والسجلات والملفات المؤقتة التي تجاوزت حدّ الخمول؛ أما صفحات Czkawka نفسها فتصف العثور على الملفات المكرّرة والمتشابهة.

## من أين تبدأ هنا {#where-to-start-here}

لا يوجد استيراد من أداة إلى أخرى؛ فلكل منهما قواعدها. ولمعرفة ما سيفعله linux-cleanup على الحاسوب، يُبدأ بـ[المعاينة قبل الحذف](../safety/preview-first.md) ويُشغَّل `npx -y linux-cleanup --all-safe --yes --dry-run`، الذي لا يحذف شيئًا.
