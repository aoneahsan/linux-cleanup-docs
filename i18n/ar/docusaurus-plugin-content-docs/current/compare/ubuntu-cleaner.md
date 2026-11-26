---
sidebar_position: 8
title: linux-cleanup وUbuntu Cleaner
description: "كيف يختلف linux-cleanup عن Ubuntu Cleaner، استنادًا إلى صفحاتهما، بتاريخ تحقق 2026-11-22."
---

# linux-cleanup وUbuntu Cleaner

*آخر تحقق في 2026-11-22 مقابل <a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">الصفحة الرسمية لـ Ubuntu Cleaner</a>.*

**ما هو:** أداة تنظيف بلغة Bash لتوزيعات Ubuntu وDebian وLinux Mint، مع صيانة الحزم وذاكرات المطوّرين المؤقتة.

**السعر هناك:** غير مذكور في الصفحات التي راجعناها. **السعر هنا:** سطر الأوامر مجاني بترخيص MIT. وخطط تطبيق سطح المكتب في [صفحة الأسعار](https://linux-cleanup.aoneahsan.com/ar/pricing).

| | linux-cleanup | Ubuntu Cleaner |
|---|---|---|
| واجهة سطر الأوامر | نعم | نعم (<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| المعاينة قبل الحذف | نعم | نعم (<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| التشغيل التجريبي | نعم | نعم (<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| تنظيف ذاكرة التخزين المؤقت | نعم | نعم (<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| العثور على الملفات المكرّرة | جزئيًا | غير مذكور في الصفحات التي راجعناها |

## من يخدمه Ubuntu Cleaner أكثر {#who-is-better-served-by-ubuntu-cleaner}

اختر Ubuntu Cleaner لتركيزه على عائلة Debian وصيانة Docker.

## أين يتقدّم linux-cleanup {#where-linux-cleanup-is-ahead}

اختر linux-cleanup إن أردت أن يعمل التنظيف بصلاحيات مستخدمك العادي، وأن تُترك حزم النظام لوضع --system منفصل وصريح.

## من أين تبدأ هنا {#where-to-start-here}

لا يوجد استيراد من أداة إلى أخرى؛ فلكل منهما قواعدها. ولمعرفة ما سيفعله linux-cleanup على الحاسوب، يُبدأ بـ[المعاينة قبل الحذف](../safety/preview-first.md) ويُشغَّل `npx -y linux-cleanup --all-safe --yes --dry-run`، الذي لا يحذف شيئًا.
