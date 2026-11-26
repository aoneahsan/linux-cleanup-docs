---
sidebar_position: 7
title: إلغاء التثبيت
description: إزالة تطبيق سطح المكتب وجداوله وما يحتفظ به على الحاسوب.
---

# إلغاء التثبيت

## إزالة الجداول أولًا {#remove-the-schedules-first}

الجداول مؤقتات مستخدم في systemd، وتشغّل نسخة من سطر الأوامر خارج التطبيق. وإزالة التطبيق **لا** تزيلها. يُحذف كل جدول من شاشة **الجداول** قبل إلغاء التثبيت، أو من الطرفية:

```bash
systemctl --user disable --now 'linux-cleanup-schedule-*.timer'
rm -f ~/.config/systemd/user/linux-cleanup-schedule-*.{timer,service}
systemctl --user daemon-reload
```

## إزالة التطبيق {#remove-the-app}

| طريقة التثبيت | طريقة الإزالة |
|---|---|
| AppImage | حذف ملف `.AppImage` ثم مدخل القائمة الخاص به: `rm ~/.local/share/applications/linux-cleanup-desktop.desktop ~/.local/share/icons/hicolor/*/apps/linux-cleanup-desktop.png` |
| `.deb` | `sudo apt remove linux-cleanup` |

## ما يبقى {#what-stays-behind}

| المجلد | يحتوي | يُحذف إن |
|---|---|---|
| `~/.linux-cleanup/` | التقارير والسجلات وبث التشغيلات المجدولة ونسخة سطر الأوامر الخاصة بالجداول. ويستخدم سطر الأوامر في الطرفية المجلد نفسه | لم يعد سطر الأوامر مستخدمًا أيضًا |
| `~/.local/share/com.aoneahsan.linuxcleanup/` | إعدادات التطبيق والإيصالات ومعرّف الجهاز العشوائي لهذا الحاسوب | حذفه آمن دائمًا بعد إلغاء التثبيت |

يبقى الحساب المسجّل بعد زوال التطبيق. يُحذف من **الحساب** قبل إلغاء التثبيت؛ والحذف يزيل الحساب وأرقامه المتزامنة من الخادم.
