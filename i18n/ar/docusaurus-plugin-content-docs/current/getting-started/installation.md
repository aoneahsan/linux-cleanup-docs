---
title: التثبيت
description: ثلاث طرق لتثبيت linux-cleanup — دون تثبيت عبر npx، أو تثبيت عام عبر npm، أو استنساخ المستودع — مع التحقق من التثبيت قبل تشغيل أي شيء يحذف.
tags: [installation, npx, npm, git, setup, upgrade]
sidebar_position: 2
---

# التثبيت

**يتوفر linux-cleanup بثلاث طرق: `npx` دون تثبيت، أو تثبيت `npm` عام، أو `git clone`.** وكلها تشغّل البرنامج النصي نفسه بلغة Bash؛ فحزمة npm مجرد مشغّل Node صغير يحدد موقع `cleanup.sh` ويوجّه السجلات والتقارير إلى مجلد دائم.

:::info التحقق من الإصدار المثبت
يُشغَّل `linux-cleanup --version` بعد التثبيت أو الترقية. ويسجّل [سجل التغييرات](../changelog.md) التغييرات في التشغيل التجريبي وإشعارات الإصدارات.
:::

## الخيار 1 — `npx` دون تثبيت {#option-1--npx-no-install}

أسرع طريقة لتجربته. لا يُضاف شيء إلى `PATH`، ولا يبقى شيء إن تقرر عدم استخدامه.

```bash
npx linux-cleanup --version
npx linux-cleanup --scan      # فحص للقراءة فقط
npx linux-cleanup             # الجولة الموجّهة
```

يجلب `npx` الحزمة إلى مجلد مؤقت في ذاكرة npm. وتُكتب السجلات والتقارير في `~/.linux-cleanup/` و**ليس** في المجلد المؤقت، فتبقى بعد تفريغ ذاكرة npm وتكون موجودة في المرة التالية.

## الخيار 2 — تثبيت `npm` عام {#option-2--global-npm-install}

```bash
npm install -g linux-cleanup
linux-cleanup --version
```

بعدها يصبح `linux-cleanup` متاحًا في `PATH` في كل مكان. وتبقى السجلات والتقارير في `~/.linux-cleanup/`.

```bash
npm install -g linux-cleanup@latest   # ترقية
npm uninstall -g linux-cleanup        # إزالة
```

إلغاء تثبيت الحزمة لا يزيل اسمًا مستعارًا للصدفة أو مدخل cron مثبتًا؛ للإزالة الكاملة انظر [إلغاء التثبيت](../guides/uninstall.md).

## الخيار 3 — `git clone` {#option-3--git-clone}

لقراءة الشيفرة المصدرية أو تدقيقها أو تعديلها. محتوى المستودع هو ما يُنشر على npm.

```bash
git clone https://github.com/aoneahsan/linux-cleanup ~/linux-cleanup
cd ~/linux-cleanup
chmod +x cleanup.sh
./cleanup.sh --self-test
./cleanup.sh
```

الفرق الوحيد في السلوك: **تحتفظ النسخة المستنسخة بمخرجاتها بجانب الشيفرة**، في `<clone>/logs/` و`<clone>/reports/` و`<clone>/feedback/`، بدلًا من `~/.linux-cleanup/`. ويمكن تغيير الموقعين عبر `LINUX_CLEANUP_DATA_HOME`. انظر [مسارات المخرجات](../reference/output-paths.md).

المشروع مرخّص بترخيص MIT، فالاشتقاق والتعديل مسموحان.

## التحقق قبل تشغيل أي شيء يحذف {#verify-before-you-run-anything-destructive}

```bash
linux-cleanup --version      # يؤكد البنية الموجودة فعلًا
linux-cleanup --self-test    # فحص الاعتماديات والصياغة والضمانات
```

ينتهي الاختبار الذاتي الناجح برسالة نجاح. وهو يتحقق من أن [حماية المسارات المحمية](../safety/guards.md#guard-1--the-path-allowlist) ترفض فعلًا `/` و`$HOME` و`~/Documents` و`~/.ssh` و`/etc`، وأنها لا ترفض `~/.cache/yarn`. وأي تحقق فاشل ينتهي برمز غير صفري.

:::tip تشغيل `--self-test` بعد كل ترقية
إنه الفحص الوحيد الذي يعمل على الشيفرة الموجودة فعلًا لا على التوثيق، ويستغرق ثانية.
:::

## أي طريقة تثبيت تُختار {#which-install-path-to-choose}

| إذا كان المطلوب… | الطريقة |
|---|---|
| تجربته مرة واحدة | `npx` |
| تشغيله بانتظام أو من cron | تثبيت `npm` عام |
| قراءة الشيفرة أو تعديلها | `git clone` |
| جهاز بلا Node.js | `git clone` |
| إبقاء المخرجات بجانب الشيفرة | `git clone` |

لـ cron تحديدًا يُفضَّل التثبيت العام واستخدام **مسار مطلق** في crontab؛ إذ يعمل cron بـ `PATH` مختصر جدًا ولن يجد تثبيتًا في `~/.local/bin`. وهذه أكثر مشكلات cron شيوعًا؛ انظر [الاسم المستعار وcron](../guides/alias-and-cron.md).

## ما لا يفعله التثبيت {#what-installing-does-not-do}

- لا خدمة نظام، ولا عملية خلفية، ولا مهمة مجدولة (ما لم تُطلب)
- لا وكيل قياس عن بُعد. عند البدء يجلب سطر الأوامر سجل إصدارات عامًا واحدًا إن توفر الاتصال، ويستمر دونه
- لا تغيير في إعدادات الصدفة ما لم يُشغَّل `--install-alias` أو `--doctor`
- لا ملفات خارج الحزمة و`~/.linux-cleanup/`، ولا يُنشأ الأخير إلا عند التشغيل الفعلي

## التالي {#next}

- [بداية سريعة](./quick-start.md) — أول تنظيف
- [ما الذي يحذفه](../safety/what-it-deletes.md) — قبل أول تشغيل يحذف فعليًا
- [إلغاء التثبيت](../guides/uninstall.md) — إزالة كاملة تشمل الاسم المستعار وcron
