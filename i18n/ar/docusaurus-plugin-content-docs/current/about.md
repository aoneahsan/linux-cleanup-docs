---
title: حول
description: من بنى linux-cleanup، ومبادئ التصميم وراءه، وترخيصه، وكيفية التواصل أو المساهمة.
sidebar_position: 95
---

# حول

**بنى linux-cleanup ويتولى صيانته [Ahsan Mahmood](https://aoneahsan.com)**، مهندس برمجيات مستقل يعمل على أدوات المطورين وتطوير التطبيقات.

| | |
|---|---|
| **المؤلف** | Ahsan Mahmood |
| **البريد** | [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |
| **الموقع** | [aoneahsan.com](https://aoneahsan.com) |
| **LinkedIn** | [linkedin.com/in/aoneahsan](https://linkedin.com/in/aoneahsan) |
| **GitHub** | [github.com/aoneahsan](https://github.com/aoneahsan) |
| **npm** | [npmjs.com/~aoneahsan](https://www.npmjs.com/~aoneahsan) |

## لماذا وُجد {#why-it-exists}

تتراكم على أجهزة المطورين كمية هائلة من البقايا القابلة للتوليد — ذاكرة مؤقتة لمديري الحزم تُقاس بعشرات الجيجابايت، وذاكرة المتصفحات وأدوات البناء، وصور المحاكيات، و`node_modules` لمشاريع هُجرت قبل عامين.

كانت أدوات التنظيف الموجودة على أحد شكلين: إما أنها لا تعرف ذاكرة المطورين الحديثة أصلًا، أو أدوات مسح بزر واحد تحذف كل ما يبدو بقايا وتأمل في الأفضل.

يتخذ linux-cleanup الموقف المعاكس: **قابل للبرمجة، شفاف، محمي بقائمة مسموح بها، وتفاعلي افتراضيًا.** ويمكن قراءة ما سيلمسه بالضبط قبل أن يلمس أي شيء.

## مبادئ التصميم {#design-principles}

**الرفض عند الشك.** [قائمة مسموح بها، لا قائمة محظورة](./safety/guards.md#guard-1--the-path-allowlist). فالمسار الذي لا تعرفه الأداة يُرفض. وفي القائمة المحظورة لا يفصل بين مسح ذاكرة مؤقتة ومسح مجلد رئيسي إلا خطأ إملائي واحد.

**التمييز بين الذاكرة المؤقتة والأدوات.** يُعاد توليد `~/.cache/yarn` في ثوانٍ؛ أما توزيعة Gradle wrapper فتنزيل بحجم 230 MB قد يلزم الشهر المقبل. ووُجد [حاجز الخمول](./safety/guards.md#guard-2--the-staleness-gate) لأن معاملتهما بالطريقة نفسها كانت خطأ، وقد غيّر 1.2.0 ذلك.

**المستخدم هو الحَكَم في البيانات الشخصية.** لا شيء على القرص يميّز مثبّتًا لن يُفتح مجددًا من النسخة الوحيدة من مستند. والأداة ترفض التخمين، ولهذا [تتجاهل تلك الأوضاع `--yes`](./safety/guards.md#guard-3--personal-data-is-interactive-only).

**الوقاية قبل الاسترداد.** [لا تراجع](./safety/irreversibility.md)، عن قصد — فسجل التراجع يضاعف الكتابة على القرص الذي يجري تحريره، ويولّد الإهمال.

**قابلية التدقيق قبل الراحة.** Bash، لأنه مثبّت أصلًا ويمكن قراءته. والملف التنفيذي المترجَم أكثر راحة وأصعب كثيرًا في الثقة به.

**فحص الإصدارات محدود.** عند البدء، ومع الاتصال، يقرأ سطر الأوامر سجل إصدارات عامًا واحدًا. ولا يرفع مسارات التنظيف ولا التقارير ولا حزم الانهيار؛ ويبقى إرسال التقرير قرارك.

## التصحيحات تشكّل الأداة {#corrections-shape-the-tool}

توجد ميزتان من ميزات السلامة لأن أحدهم أشار إلى مشكلة حقيقية.

جاءت [قائمة جذور التثبيت المحمية](./reference/protected-paths.md#exact-match-protected-paths) من خلل حقيقي: استهدف تنظيف pnpm المسار `~/.local/share/pnpm` — جذر التثبيت — فحذف الحزم المثبّتة عامًا. وأُصلح في [1.1.0](./changelog.md#110--2026-05-10)، مع فحص يمنع تكراره.

وجاء [حاجز الخمول](./safety/guards.md#guard-2--the-staleness-gate) من ملاحظة مستخدم أن 1.2.0 ما زال يمسح أجهزة Android الافتراضية كاملة، وأن المنطق نفسه ينبغي أن يسري على كل ما هو أداة لا ذاكرة مؤقتة. فصار ذلك [1.2.1](./changelog.md#121--2026-05-10).

إذا وُجد خطأ، [يُرجى إبلاغنا](./guides/send-a-bug-report.md).

## الترخيص {#licence}

**[MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)** منذ [1.4.0](./changelog.md#140--2026-07-11).

يمكن استخدامه شخصيًا أو تجاريًا وتعديله وتفريعه وتضمينه وإعادة توزيعه. والشرط الوحيد إبقاء إشعار حقوق النشر وإشعار إذن MIT في النسخ أو الأجزاء الجوهرية.

:::danger يُقدَّم «كما هو» دون أي ضمان
هذه أداة تحذف الملفات. ولا يتحمل المؤلف أي مسؤولية عن أي مطالبة أو ضرر، بما في ذلك فقدان البيانات، ينشأ عن استخدامها. تُنسخ البيانات احتياطيًا ويُراجع كل إجراء قبل تأكيده.

و[نص الترخيص الكامل](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE) هو المرجع.
:::

تحتفظ الإصدارات المنشورة قبل 1.4.0 بالترخيص الذي صدرت به.

## المساهمة {#contributing}

المساهمات مرحّب بها بموجب MIT.

- **التفريع وفتح طلب سحب** — دون حاجة إلى صلاحية خاصة
- **الإبلاغ عن الأخطاء أو طلب الميزات** عبر [GitHub issues](https://github.com/aoneahsan/linux-cleanup/issues) أو البريد
- **الفرع `main` محمي** — تدخل التغييرات عبر طلبات سحب مراجَعة

معايير الشيفرة: السلامة أولًا، والعمل دون اتصال فقط، وخلوّ ShellCheck من التحذيرات. انظر [CONTRIBUTING.md](https://github.com/aoneahsan/linux-cleanup/blob/main/CONTRIBUTING.md).

طلب الميزة الوصفي مرحّب به بقدر الشيفرة. يُذكر ما يُراد تنظيفه ولماذا لا تغطيه الأوضاع الحالية.

## هذه الوثائق {#this-documentation}

مبنية بـ [Docusaurus](https://docusaurus.io/) ومنشورة على GitHub Pages. المصدر: [github.com/aoneahsan/linux-cleanup-docs](https://github.com/aoneahsan/linux-cleanup-docs) — والتصحيحات مرحّب بها هناك أيضًا.

ملخص تقرؤه الآلة لمساعدي الذكاء الاصطناعي: [`/llms.txt`](https://linux-cleanup-docs.aoneahsan.com/llms.txt).

## روابط ذات صلة {#related-links}

| | |
|---|---|
| **المصدر** | [github.com/aoneahsan/linux-cleanup](https://github.com/aoneahsan/linux-cleanup) |
| **npm** | [npmjs.com/package/linux-cleanup](https://www.npmjs.com/package/linux-cleanup) |
| **البلاغات** | [github.com/aoneahsan/linux-cleanup/issues](https://github.com/aoneahsan/linux-cleanup/issues) |
| **دعم العمل** | [aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=linux-cleanup&project-identifier=linux-cleanup) |
