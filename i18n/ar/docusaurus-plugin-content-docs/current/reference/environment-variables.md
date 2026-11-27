---
title: متغيرات البيئة
description: "كل متغير بيئة يقرؤه linux-cleanup مع قيمته الافتراضية وأثره: تغيير مجلدات المخرجات، والتحكم في الألوان، والعثور على إعدادات XDG."
sidebar_position: 4
---

# متغيرات البيئة

**كل متغير بيئة يقرؤه linux-cleanup.** وكلها اختيارية.

| المتغير | الافتراضي | الأثر |
|---|---|---|
| `NO_COLOR` | غير مضبوط | أي قيمة غير فارغة تعطّل ألوان ANSI. وهو المعيار المشترك بين الأدوات من [no-color.org](https://no-color.org). مثل `--no-color` |
| `CLEANUP_NO_COLOR` | `0` | مفتاح ألوان خاص بـ linux-cleanup. يُضبط على `1` لتعطيل الألوان هنا فقط |
| `LINUX_CLEANUP_LOG_DIR` | `~/.linux-cleanup/logs/` (npx / npm) أو `<repo>/logs/` (نسخة مستنسخة) | موضع سجلات الجلسات. يُنشأ إن لم يوجد |
| `LINUX_CLEANUP_REPORTS_DIR` | `~/.linux-cleanup/reports/` أو `<repo>/reports/` | موضع سجلات جلسات JSON. يُنشأ إن لم يوجد |
| `LINUX_CLEANUP_DATA_HOME` | غير مضبوط — يُستخدم المجلد الأب لمجلد السجلات | المجلد الأب لـ `logs/` و`reports/` و`feedback/` معًا |
| `LINUX_CLEANUP_NPX` | غير مضبوط | **داخلي.** يضبطه مشغّل Node على `1`. لا يُضبط يدويًا |
| `LINUX_CLEANUP_LAUNCHER` | غير مضبوط | **داخلي.** يضبطه مشغّل Node على `node`، ويضبطه تطبيق سطح المكتب على `desktop`، فيتخطى فحص التحديثات الخاص بسطر الأوامر لأن التطبيق يجري فحصه الخاص (منذ 2.1.0). لا يُضبط يدويًا |
| `XDG_CONFIG_HOME` | `~/.config` | موضع البحث عن `personal-roots.txt` و`project-roots.txt` |

## تحويل كل المخرجات {#redirecting-all-output}

`LINUX_CLEANUP_DATA_HOME` هو الرافعة الوحيدة التي تنقل كل شيء — السجلات والتقارير وحزم الملاحظات:

```bash
export LINUX_CLEANUP_DATA_HOME="/mnt/secure/linux-cleanup"
linux-cleanup --scan
```

:::caution يُنشأ المجلد، لا نقطة التركيب
تنشئ الأداة `logs/` و`reports/` و`feedback/` تحت المسار المعطى. و**لا** تنشئ نقطة التركيب الأساسية ولا تتحقق منها. فإذا أشير إلى مسار غير مركّب، انتهت المخرجات على نظام الملفات الأساسي دون تنبيه.

يُتحقق من أن الهدف مركّب وقابل للكتابة قبل الاعتماد عليه.
:::

ولتحكم أدق، يغيّر `LINUX_CLEANUP_LOG_DIR` و`LINUX_CLEANUP_REPORTS_DIR` كلٌّ على حدة، ويتقدمان على جذر البيانات.

## التحكم في الألوان {#colour-control}

```bash
export NO_COLOR=1          # كل شيء على هذا الجهاز، كل الأدوات
export CLEANUP_NO_COLOR=1  # linux-cleanup فقط
linux-cleanup --no-color   # هذا الاستدعاء فقط
```

يوجد `CLEANUP_NO_COLOR` لحالة الرغبة في الألوان من كل الأدوات الأخرى ونص بلا ألوان من هذه — عادةً عند تمرير مخرجاتها إلى مكان يفسد تسلسلات الهروب.

## ضبط الجذور التي تُفحص {#configuring-the-scanned-roots}

يحدد ملفان تحت `$XDG_CONFIG_HOME` (الافتراضي `~/.config`) المجلدات التي يمر بها فاحصا الملفات الشخصية والمشاريع:

| الملف | يستخدمه | الجذور الافتراضية |
|---|---|---|
| `personal-roots.txt` | [`--stale`](../modes/personal-stale-files.md) | `~/Downloads`؛ وتُتجاهل الجذور المحمية مثل `~/Desktop` |
| `project-roots.txt` | [`--node-modules`](../modes/node-modules-finder.md) | مجلدات مشاريعك |

مسار في كل سطر. ويتبع ذلك [مواصفة XDG Base Directory](https://specifications.freedesktop.org/basedir-spec/)، فضبط `XDG_CONFIG_HOME` ينقل الملفين معًا.

:::danger إضافة جذر إلى `personal-roots.txt` توسّع نطاق ما يمكن حذفه
فاحص الملفات الشخصية [تفاعلي فقط](../safety/guards.md#guard-3--personal-data-is-interactive-only)، فلا يُحذف شيء دون تأكيد لكل ملف — لكن الجذر المضاف مجلد ستبدأ محتوياته بالظهور في قوائم المرشحين.

تبقى [قائمة المسارات المسموح بها](./protected-paths.md) سارية وهي الغالبة: إضافة `~/Documents` هنا لا تجعله قابلًا للحذف.
:::

## للتكامل المستمر والبرامج النصية {#for-ci-and-scripts}

```bash
NO_COLOR=1 linux-cleanup --scan > /tmp/scan.log
```

لا يُنشئ الفحص المستقل تقرير جلسة JSON الخاص بالجولة الموجّهة. يُفحص [رمز الخروج](./exit-codes.md) في البرامج النصية، أو يُستخدم [`--json-events`](./json-events.md) لمخرجات منظّمة.

## ما لا يقرؤه {#what-it-does-not-read}

- `PATH`، إلا لاكتشاف الأدوات الاختيارية المثبّتة
- `USER` و`LOGNAME`، إلا لتعليم رأس السجل
- سجل الصدفة أو الأسماء المستعارة أو الإعدادات — [`--doctor`](../modes/doctor.md) هو الوضع الوحيد الذي يقرأ ملفات بدء الصدفة، وفقط للتحقق من ربط بيئة تشغيل
- أي إعدادات بعيدة أو مقدَّمة عبر الشبكة. لا يوجد شيء من ذلك

إذا لم يُضبط `$HOME` يتوقف البرنامج النصي فورًا بدلًا من التخمين. انظر [استكشاف الأخطاء](../troubleshooting.md#home-is-not-set).

## التالي {#next}

- [مسارات المخرجات](./output-paths.md) — أين تنتهي الملفات فعلًا
- [خيارات سطر الأوامر](./cli-flags.md)
