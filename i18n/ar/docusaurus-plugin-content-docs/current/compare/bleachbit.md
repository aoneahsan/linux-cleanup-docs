---
sidebar_position: 2
title: linux-cleanup وBleachBit
description: "كيف يختلف linux-cleanup عن BleachBit، استنادًا إلى صفحاتهما، بتاريخ تحقق 2026-11-22."
---

# linux-cleanup وBleachBit

*آخر تحقق في 2026-11-22 مقابل <a href="https://www.bleachbit.org/features" target="_blank" rel="noopener noreferrer nofollow">الصفحة الرسمية لـ BleachBit</a>.*

**ما هو:** أداة تنظيف مفتوحة المصدر لمساحة القرص والخصوصية، مع معاينة رسومية وسطر أوامر.

**السعر هناك:** مجاني (<a href="https://www.bleachbit.org/features" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>، تحقّق 2026-11-22). **السعر هنا:** سطر الأوامر مجاني بترخيص MIT. وخطط تطبيق سطح المكتب في [صفحة الأسعار](https://linux-cleanup.aoneahsan.com/ar/pricing).

| | linux-cleanup | BleachBit |
|---|---|---|
| واجهة سطر الأوامر | نعم | نعم (<a href="https://www.bleachbit.org/features" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| المعاينة قبل الحذف | نعم | نعم (<a href="https://www.bleachbit.org/features" target="_blank" rel="noopener noreferrer nofollow">المصدر</a>) |
| التشغيل التجريبي | نعم | غير مذكور في الصفحات التي راجعناها |
| تنظيف ذاكرة التخزين المؤقت | نعم | غير مذكور في الصفحات التي راجعناها |
| العثور على الملفات المكرّرة | جزئيًا | غير مذكور في الصفحات التي راجعناها |

## من يخدمه BleachBit أكثر {#who-is-better-served-by-bleachbit}

اختر BleachBit لأداة التنظيف الرسومية، ومحو بيانات الخصوصية، ودعم Linux وWindows.

## أين يتقدّم linux-cleanup {#where-linux-cleanup-is-ahead}

اختر linux-cleanup لذاكرات المطوّرين المؤقتة التي يحذفها فقط حين تكون خاملة، مثل مخازن Gradle وPlaywright وpnpm، مع إدراج كل مسار مرفوض في التشغيل التجريبي.

## من أين تبدأ هنا {#where-to-start-here}

لا يوجد استيراد من أداة إلى أخرى؛ فلكل منهما قواعدها. ولمعرفة ما سيفعله linux-cleanup على الحاسوب، يُبدأ بـ[المعاينة قبل الحذف](../safety/preview-first.md) ويُشغَّل `npx -y linux-cleanup --all-safe --yes --dry-run`، الذي لا يحذف شيئًا.
