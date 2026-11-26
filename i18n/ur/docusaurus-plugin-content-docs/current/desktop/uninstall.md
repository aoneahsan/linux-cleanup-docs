---
sidebar_position: 7
title: ان انسٹال
description: ڈیسک ٹاپ ایپ، اس کے شیڈول اور جو کچھ یہ آپ کے کمپیوٹر پر رکھتی ہے، ہٹائیں۔
---

# ان انسٹال

## پہلے شیڈول ہٹائیں {#remove-the-schedules-first}

شیڈول systemd یوزر ٹائمرز ہیں، اور یہ ایپ سے باہر CLI کی ایک کاپی چلاتے ہیں۔ ایپ ہٹانے سے یہ **نہیں** ہٹتے۔ ان انسٹال کرنے سے پہلے **شیڈول** اسکرین پر ہر ایک حذف کریں، یا ٹرمینل سے:

```bash
systemctl --user disable --now 'linux-cleanup-schedule-*.timer'
rm -f ~/.config/systemd/user/linux-cleanup-schedule-*.{timer,service}
systemctl --user daemon-reload
```

## ایپ ہٹائیں {#remove-the-app}

| کیسے انسٹال کی | کیسے ہٹائیں |
|---|---|
| AppImage | `.AppImage` فائل حذف کریں، پھر اس کا مینو اندراج: `rm ~/.local/share/applications/linux-cleanup-desktop.desktop ~/.local/share/icons/hicolor/*/apps/linux-cleanup-desktop.png` |
| `.deb` | `sudo apt remove linux-cleanup` |

## کیا پیچھے رہ جاتا ہے {#what-stays-behind}

| فولڈر | کیا رکھتا ہے | کب حذف کریں |
|---|---|---|
| `~/.linux-cleanup/` | رپورٹس، لاگز، شیڈول رن کے سلسلے اور شیڈول کی CLI کاپی۔ ٹرمینل والا CLI بھی یہی فولڈر استعمال کرتا ہے | جب آپ CLI بھی استعمال نہ کرتے ہوں |
| `~/.local/share/com.aoneahsan.linuxcleanup/` | ایپ کی سیٹنگز، رسیدیں اور اس کمپیوٹر کی بے ترتیب ڈیوائس id | ان انسٹال کے بعد حذف کرنا ہمیشہ محفوظ |

سائن اِن کیا ہوا اکاؤنٹ ایپ جانے کے بعد بھی رہتا ہے۔ ان انسٹال سے پہلے اسے **اکاؤنٹ** سے حذف کریں؛ حذف کرنے سے اکاؤنٹ اور اس کے سنک شدہ اعداد سرور سے ہٹ جاتے ہیں۔
