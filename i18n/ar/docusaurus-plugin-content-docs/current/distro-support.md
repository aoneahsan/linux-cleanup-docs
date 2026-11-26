---
title: دعم التوزيعات
description: "ما يفعله linux-cleanup على كل توزيعة Linux: تنظيف ذاكرة التخزين المؤقت يعمل في كل مكان، لكن وضع --system الذي يحتاج إلى sudo مخصص لـ Debian وUbuntu فقط."
tags: [distro, ubuntu, debian, fedora, arch, opensuse, wsl, compatibility]
sidebar_position: 90
---

# دعم التوزيعات

**صُمّم تنظيف ذاكرة التخزين المؤقت في المجلد الرئيسي لتوزيعات Linux التي تتوفر فيها أدوات GNU اللازمة.**
يستخدم [`--system`](./modes/system-cleanup.md) أوامر حزم Debian وUbuntu. تُفحص الأدوات المثبّتة بـ `--self-test` قبل التنظيف.

## الخلاصة {#the-summary}

| عائلة التوزيعة | تنظيف ذاكرة `$HOME` المؤقتة | `--system` |
|---|---|---|
| Debian, Ubuntu, Mint, Pop!\_OS | كامل | **كامل** |
| Fedora, RHEL, Rocky, Alma | مع الأدوات اللازمة | لا يُستخدم: تخفق خطوات apt |
| Arch, Manjaro, EndeavourOS | مع الأدوات اللازمة | لا يُستخدم: تخفق خطوات apt |
| openSUSE | مع الأدوات اللازمة | لا يُستخدم: تخفق خطوات apt |
| Alpine والحاويات المصغّرة | يحتاج إلى Bash وأدوات GNU | لا يُستخدم: تخفق خطوات apt |
| WSL | مع الأدوات اللازمة | Debian/Ubuntu فقط؛ تُفحص المسارات المركّبة أولًا |

:::warning لا يكتشف `--system` التوزيعة
تستدعي خطوات apt الأمرين `apt` و`dpkg` مباشرة، دون فحص `command -v` ودون رجوع إلى `dnf` أو `pacman` أو `zypper`. وعلى نظام غير Debian تخفق كل خطوة بـ "command not found".

لا يتوقف الوضع بعد إخفاق apt: فقد تعمل الخطوات اللاحقة. ويُتجنب على التوزيعات الأخرى.

تزعم بعض الأوصاف لهذه الأداة أن `--system` يدعم توزيعات متعددة بدرجات، مع `dnf` بدل `apt` و`paccache` على Arch. **لا توجد شيفرة كهذه.** يُتحقق بتشغيل `grep -rn 'dnf\|pacman\|zypper' modules/system_sudo.sh` على نسخة مستنسخة — فلا يعيد شيئًا.
:::

## خطوة بخطوة {#step-by-step}

| خطوة `--system` | Debian/Ubuntu | Fedora/RHEL | Arch | openSUSE |
|---|---|---|---|---|
| `apt autoremove` + `apt clean` | يعمل | **يخفق** | **يخفق** | **يخفق** |
| `journalctl --vacuum-size=100M` | يعمل | يعمل | يعمل | يعمل |
| مراجعات snap المعطّلة | يعمل | إن كان snap مثبّتًا | إن كان snap مثبّتًا | إن كان snap مثبّتًا |
| سرد النوى (`dpkg --list`) | يعمل | صامت — لا يطبع شيئًا | صامت | صامت |
| ملفات `/tmp` الأقدم من 7 أيام | يعمل | يعمل | يعمل | يعمل |
| تفريغ ذاكرة الصفحات | يعمل | يعمل | يعمل | يعمل |

تعتمد خطوات السجل و`/tmp` وذاكرة الصفحات على `journalctl` و`find` و`sysctl`، وسلوكها واحد حيثما وُجد systemd. وخطوة النواة سرد فقط في كل الأحوال، فإخفاقها على الأنظمة التي لا تستخدم dpkg لا يكلّف شيئًا.

## تنفيذ جزء الحزم يدويًا {#doing-the-package-part-yourself}

على نظام غير Debian، تُتبع إرشادات الصيانة الخاصة بمدير حزمه. والأوامر أدناه أمثلة تُراجع قبل التشغيل:

```bash
# Fedora / RHEL / Rocky
sudo dnf autoremove
sudo dnf clean all

# Arch / Manjaro  (paccache ضمن pacman-contrib)
sudo pacman -Rns "$(pacman -Qtdq)"    # الحزم اليتيمة إن وُجدت
sudo paccache -r                       # يُبقي آخر 3 إصدارات
sudo pacman -Scc                       # يفرّغ ذاكرة الحزم المؤقتة كلها

# openSUSE
sudo zypper clean --all
sudo zypper packages --orphaned
```

ولذاكرة المجلد الرئيسي المؤقتة، تُعاين نتائج linux-cleanup:

```bash
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

## أهداف ذاكرة المجلد الرئيسي المؤقتة {#home-cache-targets}

تأتي مسارات المجلد الرئيسي من الأدوات المثبّتة لا من التوزيعة. ويختلف المتاح من جهاز إلى آخر:

- ذاكرة مديري الحزم المؤقتة — yarn, npm, pnpm, pip, composer, bun, deno
- ذاكرة المتصفحات المؤقتة — Chrome, Firefox, Brave, Chromium, Edge, Vivaldi
- ذاكرة أدوات البناء المؤقتة — Gradle, Cypress, Playwright, TypeScript
- بيانات أدوات المطورين — Android AVD, Flutter pub-cache, Dart, flatpak
- إضافات المحررات — VS Code, Cursor
- `node_modules` والتنزيلات غير المكتملة والملفات الشخصية المهملة
- الفحص والمراجعة وفحوص السلامة والسجلات المحلية

## الحاويات المصغّرة {#minimal-containers}

تأتي Alpine والصور المصغّرة الأخرى عادةً بـ BusyBox بدل GNU coreutils. وتحتاج الأداة إلى `find` و`du` و`stat` من GNU، وخاصة `realpath` — فهو الذي يحل الروابط الرمزية قبل [فحص المسارات المحمية](./reference/protected-paths.md).

```bash
apk add coreutils findutils bash
linux-cleanup --self-test
```

يذكر `--self-test` أول اعتمادية مفقودة. ولا تُشغّل الأوضاع الحاذفة قبل نجاحه.

## WSL {#wsl}

تعمل الأداة في بيئة Linux. ويحل حارس المسارات الروابط الرمزية، لكنه لا يعدّ مجلدات Windows الشخصية مجلدات Linux محمية. تُراجع نتائج الفحص والتشغيل التجريبي بعناية إذا كانت المجلدات الرئيسية أو الذاكرة المؤقتة تشير إلى `/mnt/`.

## macOS {#macos}

غير مدعوم. تعلن حزمة npm `"os": ["linux"]` وترفض التثبيت. فالمسارات وخيارات `find` ومديرو الحزم كلها مختلفة.

## التالي {#next}

- [تنظيف النظام](./modes/system-cleanup.md) — الوضع الذي تقيّده هذه الصفحة
- [المتطلبات](./getting-started/requirements.md)
