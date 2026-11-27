---
title: إلغاء التثبيت
description: "إزالة linux-cleanup بالكامل: الحزمة والاسم المستعار للصدفة ومدخل cron وسجلاته وسجلات الجلسات."
sidebar_position: 4
---

# إلغاء التثبيت

**إزالة الأتمتة أولًا، ثم الحزمة، ثم البيانات.** فإلغاء تثبيت الحزمة لا يزيل اسمًا مستعارًا للصدفة أو مدخل cron مثبتًا؛ فهذه أشياء منفصلة.

## 1. إزالة الأتمتة {#1-remove-the-automation}

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

يُفعل هذا **قبل** إزالة الحزمة، ما دام الأمر موجودًا. وإن أُزيلت مسبقًا، انظر [الإزالة اليدوية](#if-you-removed-the-package-first) أدناه.

للتحقق:

```bash
crontab -l | grep -i cleanup     # يُتوقع ألا يظهر شيء
grep -rn 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

## 2. إزالة الحزمة {#2-remove-the-package}

```bash
npm uninstall -g linux-cleanup
```

مع `npx` لا يكون شيء مثبتًا؛ فذاكرة npm تتخلص منه وحدها. ولتفريغها الآن:

```bash
npm cache clean --force
```

ومع git clone يُحذف المجلد:

```bash
rm -rf ~/linux-cleanup
```

:::caution تحتفظ النسخة المستنسخة بسجلاتها
بخلاف طرق التثبيت عبر npm، تحفظ النسخة المستنسخة مخرجاتها في `<clone>/logs/` و`<clone>/reports/`. وحذف النسخة يحذفها أيضًا. يُنسخ أولًا ما يُراد الاحتفاظ به. انظر [مسارات المخرجات](../reference/output-paths.md).
:::

## 3. إزالة البيانات {#3-remove-the-data}

السجلات وسجلات الجلسات وحزم الملاحظات في `~/.linux-cleanup/`، ولا تُزال **أبدًا** بإلغاء التثبيت.

```bash
ls -la ~/.linux-cleanup/           # يُنظر قبل الحذف
rm -rf ~/.linux-cleanup/
```

إنها صغيرة — بضعة ميغابايتات عادة — وهي الرواية الوحيدة لما حذفته التشغيلات السابقة. والاحتفاظ بها لا يكلف شيئًا، وحذفها لا رجعة فيه كأي حذف آخر.

وإن ضُبط `LINUX_CLEANUP_DATA_HOME`، يُحذف ذلك المجلد بدلًا من ذلك، ويُزال التصدير من إعدادات الصدفة.

## 4. إزالة الإعدادات، إن أُنشئت {#4-remove-configuration-if-you-created-any}

```bash
rm -f ~/.config/personal-roots.txt ~/.config/project-roots.txt
```

لا توجد إلا إن أُنشئت يدويًا. انظر [متغيرات البيئة](../reference/environment-variables.md#configuring-the-scanned-roots).

## إن أُزيلت الحزمة أولًا {#if-you-removed-the-package-first}

يُتراجع عن المساعدَين يدويًا.

**Cron:**

```bash
crontab -e
# احذف السطر الذي يحتوي linux-cleanup أو cleanup.sh
```

**الاسم المستعار:**

```bash
grep -n 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

يُحذف سطر الاسم المستعار المطابق بالمحرر، ثم يُنفَّذ `source` على الملف أو تُفتح طرفية جديدة.

## ما يبقى بعد ذلك {#what-is-left-behind}

لا شيء بعد إتمام ما سبق. فالأداة لا تثبّت خدمة نظام ولا عملية خلفية ولا وحدة systemd ولا مدخلًا في `/etc` ولا ملفًا يملكه root. وكل ما تنشئه داخل المجلد الرئيسي.

آثار على النظام لا تتراجع عنها، لأنها ليست ملفات تملكها:

- **ذاكرة التخزين المؤقت المحذوفة تبقى محذوفة.** وتُعاد حين تحتاجها كل أداة
- **كتل تهيئة الصدفة التي أضافها [`--doctor`](../modes/doctor.md)** تبقى. فهي الإعداد الصحيح لبيئات التشغيل المثبتة؛ وتُزال يدويًا إن لم تعد مطلوبة

## التحقق {#verify}

```bash
command -v linux-cleanup      # يُتوقع ألا يظهر شيء
crontab -l | grep -i cleanup  # يُتوقع ألا يظهر شيء
ls ~/.linux-cleanup 2>&1      # يُتوقع: No such file or directory
```

## التالي {#next}

- [التثبيت](../getting-started/installation.md) — عند إعادة التثبيت
