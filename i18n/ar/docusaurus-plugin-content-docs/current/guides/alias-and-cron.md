---
title: الاسم المستعار للصدفة وcron الأسبوعي
description: تثبيت الاسم المستعار cleanup وتشغيل آلي أسبوعي للتنظيف الآمن بالكامل، وما يكتبه كل منهما، وكيفية إزالتهما مجددًا.
sidebar_position: 2
---

# الاسم المستعار للصدفة وcron الأسبوعي

**مساعدان للإعداد مرة واحدة: اسم مستعار للصدفة `cleanup`، وتشغيل آلي أسبوعي.** ويمكن التراجع عن كليهما بخيار إلغاء التثبيت المقابل.

```bash
linux-cleanup --install-alias
linux-cleanup --install-cron
```

## الاسم المستعار للصدفة {#the-shell-alias}

```bash
linux-cleanup --install-alias
```

يضيف اسمًا مستعارًا `cleanup` إلى `~/.bash_aliases` أو `~/.zshrc` بحسب الصدفة. وبعدها تشغّل كتابة `cleanup` في أي مكان الأداة.

تُعاد تحميل الصدفة، وإلا فسيبدو أن الاسم المستعار غير موجود:

```bash
source ~/.bashrc     # أو ~/.zshrc
```

يُزال بالأمر `linux-cleanup --uninstall-alias`.

:::note ملفات تهيئة الصدفة محمية في طبقة الحذف
`.bashrc` و`.zshrc` و`.bash_aliases` وما يشبهها في [قائمة أسماء الملفات المحمية](../reference/protected-paths.md#protected-basenames)، فلا يستطيع أي وضع تنظيف حذف أي منها أبدًا، أيًّا كان مساره. يضيف مثبّت الاسم المستعار سطرًا، ولا يحذف مزيله إلا سطره هو.
:::

## مهمة cron الأسبوعية {#the-weekly-cron-job}

```bash
linux-cleanup --install-cron
```

تجدول `--all-safe -y` **كل أحد الساعة 03:00**، وتُلحق المخرجات بالملف `~/.linux-cleanup/logs/cron.log`. وتتطلب `crontab`.

تُزال بالأمر `linux-cleanup --uninstall-cron`.

### لماذا `--all-safe` هو الوضع المناسب لهذا {#why---all-safe-is-the-right-mode-for-this}

إنه الوضع الوحيد الذي ينطبق عليه `--yes`، و**لا يستطيع لمس البيانات الشخصية**؛ فالأوضاع التفاعلية فقط ليست جزءًا منه وتتجاهل `--yes` بالتصميم. فيمكن لتشغيل دون إشراف أن ينظف ذاكرة التخزين المؤقت، ولا يمكنه أبدًا حذف ملف من `~/Downloads`. انظر [البوابة 3](../safety/guards.md#guard-3--personal-data-is-interactive-only).

وتبقى [بوابة الخمول](../safety/guards.md#guard-2--the-staleness-gate) سارية، فتنجو الملفات المستخدمة حديثًا من كل مرور أسبوعي.

## كتابة مدخل crontab يدويًا {#writing-the-crontab-entry-yourself}

لموعد أو خيارات مختلفة:

```bash
crontab -e
```

```bash
0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1
```

:::danger يُستخدم مسار مطلق
يعمل cron بـ `PATH` مختصر، غالبًا `/usr/bin:/bin` فقط. ولن يُعثر على `linux-cleanup` دون مسار إن كان في `~/.local/bin` أو في مجلد مدير إصدارات Node، فتفشل المهمة بصمت كل أسبوع.

وهذه أكثر مشكلات التشغيل المجدول شيوعًا. يُعرف المسار بالأمر:

```bash
command -v linux-cleanup
```

أو يُضبط `PATH=` صراحة في أعلى crontab.
:::

| الخيار | سببه في cron |
|---|---|
| `--all-safe -y` | دون إشراف، ذاكرة التخزين المؤقت فقط |
| `--no-report` | يمنع تراكم سجلات JSON، التي **لا** تُحذف تلقائيًا أبدًا |
| `--cleanup-logs` | يحذف سجل ذلك التشغيل في النهاية |
| `-d 30` | اختياري: تقليم أسبوعي أكثر حدة |

لا يكفي `--cleanup-logs` وحده لإبقاء المجلد صغيرًا؛ فهو لا يلمس سجلات الجلسات أبدًا. والخيار الذي يفعل ذلك هو `--no-report`.

:::caution لا يُضاف `--purge-all` إلى مهمة مجدولة
العمل دون إشراف ودون بوابة خمول يعني أن أصلًا مكلفًا قد يختفي قبل أسبوع من الحاجة إليه، دون أن يلاحظ أحد. يُترك `--purge-all` لتشغيلات مقصودة تحت الإشراف. انظر [استعادة أكبر مساحة](./reclaim-the-most-space.md).
:::

## التحقق من أنها عملت {#checking-that-it-ran}

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

إن ظهر في السجل `command not found` فهي مشكلة `PATH` المذكورة أعلاه. وإن كان السجل فارغًا فالمهمة لم تنطلق أصلًا؛ يُتحقق من أن عملية cron تعمل (`systemctl status cron` أو `crond`).

لا **يُدوَّر** سجل cron أبدًا. يُدوَّر يدويًا حين يكبر:

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## مؤقت systemd بدلًا من ذلك {#a-systemd-timer-instead}

لمن يفضّل المؤقتات على cron، لا شيء خاص بالأداة في ذلك؛ يُجدول الأمر نفسه. فالأداة لا تعرف ولا تهتم بأي مجدول استدعاها، و`--install-cron` وسيلة للتيسير لا شرط.

## إزالة الاثنين {#removing-both}

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

الإزالة الكاملة بما فيها الحزمة: [إلغاء التثبيت](./uninstall.md).
