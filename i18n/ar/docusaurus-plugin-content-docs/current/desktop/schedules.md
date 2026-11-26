---
sidebar_position: 3
title: الجداول
description: تشغيلات تجريبية وعمليات تنظيف آمنة بالكامل مجدولة بوصفها مؤقتات مستخدم في systemd.
---

# الجداول

الجداول جزء من خطتي Pro وTeam. والجدول زوج من **وحدات مستخدم systemd** في `~/.config/systemd/user/`، اسمهما `linux-cleanup-schedule-<id>.timer` و`.service`. ويشغّل إما تشغيلًا تجريبيًا وإما التنظيف الآمن بالكامل، يوميًا أو أسبوعيًا أو في يوم من الشهر (من 1 إلى 28).

يستخدم المؤقت `Persistent=true`: فإن كان الحاسوب مطفأً في الموعد المحدد، يجري التشغيل عند تسجيل الدخول التالي. ويكتب كل تشغيل مجدول بث أحداثه في `~/.linux-cleanup/schedule-runs/`، ويحوّله التطبيق إلى إيصال عند فتحه في المرة التالية.

ولأن ملفات AppImage تختفي حين يُغلق التطبيق، يشغّل الجدول نسخة من سطر الأوامر المرفق في `~/.linux-cleanup/desktop-engine/`. ويجدد التطبيق تلك النسخة في كل مرة يبدأ فيها، فيشغّل المؤقت دائمًا الإصدار الذي يأتي مع التطبيق.

لعرض مؤقت أو إيقافه من الطرفية:

```bash
systemctl --user list-timers 'linux-cleanup-schedule-*'
systemctl --user disable --now linux-cleanup-schedule-<id>.timer
```
