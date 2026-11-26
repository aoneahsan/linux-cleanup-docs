---
title: استكشاف الأخطاء
description: "العَرَض والسبب والإصلاح للمشكلات التي يواجهها مستخدمو linux-cleanup فعلًا: حالات الرفض، والاعتماديات المفقودة، وإخفاقات cron، وبطء الفحص، والتباس الإصدارات."
tags: [troubleshooting, errors, fixes, cron, jq, whiptail]
sidebar_position: 92
---

# استكشاف الأخطاء

العَرَض ← السبب ← الإصلاح. يُشغَّل أمر التحقق أولًا، فإن طابق يُطبَّق الإصلاح.

إن كانت المشكلة فقدان بيانات لا رسالة خطأ، فالمكان المناسب هو [الاستعادة](./recovery.md).

## REFUSE: protected path {#refuse-protected-path}

```text
✗ REFUSE: protected path: /home/you/Documents/something
```

**السبب.** بعد توسيع الروابط الرمزية، انتهى المسار إلى موقع في [القائمة المحمية](./reference/protected-paths.md)، فمنعته قائمة المسارات المسموحة.

**هذا سلوك صحيح لا عطل.** لم يُحذف شيء.

**الإصلاح.** معرفة ما انتهى إلى أين:

```bash
linux-cleanup --list-targets
realpath <the path that was rejected>
```

غالبًا ما تكون ذاكرة تخزين مؤقت مرتبطة رمزيًا داخل مجلد محمي. **يُصلَح الرابط الرمزي لا الأداة**؛ فالأداة تؤدي عملها بالضبط. ولا يوجد خيار تجاوز، عن قصد.

رسالتان مرتبطتان:

```text
✗ REFUSE: unsafe path: '/home/you'            # $HOME أو / وحده
✗ REFUSE: shell-init / history file: …        # .bashrc و.zshrc وما يشبهها
```

## TUI mode needs whiptail or dialog {#tui-mode-needs-whiptail-or-dialog}

**السبب.** شُغّل `--tui` دون تثبيت أي منهما.

**الإصلاح.** تثبيت أحدهما، أو قبول العودة المقترحة إلى قائمة سطر الأوامر.

```bash
sudo apt install whiptail     # Debian / Ubuntu
sudo dnf install newt         # Fedora / RHEL
sudo pacman -S libnewt        # Arch
```

**التحقق.** `command -v whiptail` ثم إعادة التشغيل. انظر [TUI](./modes/tui.md).

## export requires jq {#export-requires-jq}

**السبب.** استخدام `--export md` أو `--export html` أو التحويل في مدير التقارير دون تثبيت `jq`.

**الإصلاح.**

```bash
sudo apt install jq
```

لا يلزم `jq` إلا للتحويل، وتُكتب سجلات JSON في كل تشغيل دونه. انظر [التقارير](./modes/reports.md).

## command not found {#command-not-found}

**السبب.** اعتمادية مطلوبة مفقودة أو يحجبها اسم مستعار غير متوافق. وهذا شائع في الحاويات المصغرة التي تأتي بـ BusyBox بدلًا من GNU coreutils.

**التحقق.**

```bash
linux-cleanup --self-test
```

يفحص كل أمر مطلوب ويسمّي أول أمر مفقود.

**الإصلاح.** تثبيت حزم coreutils وfindutils وgawk الخاصة بالتوزيعة. على Alpine:

```bash
apk add coreutils findutils bash
```

`realpath` هو الأهم، فهو ما يجعل [فحص المسارات المحمية](./reference/protected-paths.md) آمنًا مع الروابط الرمزية. انظر [دعم التوزيعات](./distro-support.md#minimal-containers).

## مدخل cron يعمل لكنه لا يفعل شيئًا {#cron-entry-runs-but-does-nothing}

**التحقق.**

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

**السبب.** ظهور `command not found` في سجل cron يعني أن `PATH` المختصر في cron (`/usr/bin:/bin`) لا يرى التثبيت. وهذه أكثر مشكلات cron شيوعًا.

**الإصلاح.** استخدام مسار مطلق في crontab:

```bash
crontab -e
# بدلًا من:  0 3 * * 0 linux-cleanup --all-safe -y …
# يصبح:  0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y …
```

يُعرف المسار الصحيح بالأمر `command -v linux-cleanup`. أو يُضاف سطر `PATH=` في أعلى crontab. انظر [الاسم المستعار وcron](./guides/alias-and-cron.md).

## $HOME is not set {#home-is-not-set}

```text
✗ $HOME is not set
```

**السبب.** التشغيل في بيئة لا تضبط `$HOME`، كبعض صور Docker وبعض مشغلات CI.

**الإصلاح.**

```bash
HOME=/root linux-cleanup --scan
```

أو تصديره مرة واحدة للجلسة. يتوقف البرنامج النصي بدلًا من التخمين عن قصد: فقيمة `$HOME` الخاطئة تعني أن كل فحص للمسارات سيجري على الشجرة الخطأ.

## يبدو أن الفحص أو --node-modules قد توقف {#scan-or---node-modules-seems-to-hang}

**السبب.** يمر `find` بآلاف المجلدات تحت `$HOME`. وعلى قرص دوّار يستغرق التشغيل الأول من دقيقة إلى ثلاث دقائق.

**التحقق.** مراقبة السجل بدلًا من الطرفية:

```bash
tail -f ~/.linux-cleanup/logs/cleanup-*.log
```

ظهور أسطر جديدة كل خمس إلى عشر ثوانٍ يعني أنه يعمل.

**الإصلاح.** الصبر في التشغيل الأول؛ فالتشغيلات اللاحقة أسرع بفضل البيانات الوصفية المخزنة للمجلدات. وإن تعثر المسار نفسه أكثر من خمس دقائق في كل مرة، فقد يكون السبب حلقة روابط رمزية أو تركيب شبكة أو FUSE لا يستجيب، ويستحق [الإبلاغ عنه](./guides/send-a-bug-report.md).

## ازداد استخدام القرص أثناء الجلسة {#disk-usage-grew-during-the-session}

**السبب.** المقدار المستعاد المعروض هو فرق `df` على الجهاز كله. وقد كتبت عملية أخرى — بناء أو تحديث حزم أو تدوير سجلات أو محرر يعيد الفهرسة — أكثر مما حرّره التنظيف أثناء الجلسة.

**هذا ليس خللًا**، ولا يعني فشل التنظيف. تُفحص الأرقام التي أبلغت عنها الخطوات نفسها:

```bash
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

**الإصلاح.** إعادة `--scan` حين يهدأ الجهاز لرؤية الصورة الحقيقية.

## يفشل apt update بعد --system {#apt-update-fails-after---system}

**السبب.** نادر. لا يُعطّل `apt clean` الأمر `apt update`، لكن التنظيف ربما تزامن مع عملية apt أخرى تحتجز قفلًا.

**التحقق.**

```bash
sudo apt update 2>&1 | tail -20
```

**الإصلاح.**

```bash
sudo rm -f /var/lib/apt/lists/lock /var/cache/apt/archives/lock /var/lib/dpkg/lock-frontend
sudo apt update
```

لا يُفعل هذا إلا إذا لم تكن هناك فعلًا أي عملية apt جارية — يُشغَّل `ps aux | grep -i apt` أولًا.

## يُبلغ VS Code عن إضافة مفقودة {#vs-code-reports-a-missing-extension}

**السبب.** غالبًا سلوك صحيح: حُذف إصدار قديم حلّ محله غيره بينما ما يزال المحرر يشير إليه.

**الإصلاح.** إعادة تحميل النافذة — `Ctrl+Shift+P` ← **Developer: Reload Window**.

**التحقق** من أن الإصدار الحالي ما يزال موجودًا:

```bash
ls ~/.vscode/extensions/ | grep <extension-name>
```

إن كان الإصدار *الحالي* قد ذهب فعلًا، فذلك يدل على خلل في اكتشاف أعلى إصدار. يُعاد تثبيته و[يُبلَّغ عنه](./guides/send-a-bug-report.md):

```bash
code --install-extension <publisher>.<name>
```

## ظهرت حزمة انهيار دون أن يظهر انهيار {#a-crash-bundle-appeared-but-i-saw-no-crash}

**السبب.** خرج البرنامج النصي برمز غير صفري من موضع غير متوقع — أمر `find` في الخلفية أنهاه OOM killer، أو أنبوب مقطوع.

**الإصلاح.** قراءة رمز الخروج في بيان الحزمة:

```bash
tar -xzOf ~/.linux-cleanup/feedback/crash-*.tar.gz --wildcards '*MANIFEST*'
```

`137` هو OOM killer، و`141` هو SIGPIPE، و`139` خطأ تجزئة. انظر [رموز الخروج](./reference/exit-codes.md). وكلها تستحق الإبلاغ.

## الاسم المستعار cleanup غير موجود بعد --install-alias {#alias-cleanup-not-found-after---install-alias}

**السبب.** لم يُعد قراءة ملف rc الخاص بالصدفة.

**الإصلاح.**

```bash
source ~/.bashrc      # أو ~/.zshrc
```

أو فتح طرفية جديدة.

## يعمل إصدار خاطئ {#wrong-version-running}

**التحقق.**

```bash
command -v linux-cleanup
linux-cleanup --version
```

**السبب.** تثبيت عام قديم يحجب ذاكرة `npx` أحدث، أو تجزئة أوامر قديمة في الصدفة.

**الإصلاح.**

```bash
npm uninstall -g linux-cleanup
npm install -g linux-cleanup@latest
hash -r
linux-cleanup --version
```

الإصدار المنشور الحالي في [حزمة npm](https://www.npmjs.com/package/linux-cleanup). وتُراجَع التغييرات منذ النسخة المثبتة في [سجل التغييرات](./changelog.md).

## إن بقيت المشكلة {#still-stuck}

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

تُراجَع الحزمة، ثم تُرسل بالبريد مع وصف قصير لما كان متوقعًا وما حدث فعلًا. انظر [إرسال تقرير خلل](./guides/send-a-bug-report.md).
