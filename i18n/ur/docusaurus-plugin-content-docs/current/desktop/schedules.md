---
sidebar_position: 3
title: شیڈول
description: systemd یوزر ٹائمرز کے طور پر شیڈول کیے گئے آزمائشی رن اور مکمل محفوظ صفائیاں۔
---

# شیڈول

شیڈول Pro اور Team پلانز کا حصہ ہیں۔ ایک شیڈول `~/.config/systemd/user/` میں **systemd یوزر یونٹس** کا ایک جوڑا ہے، جن کے نام `linux-cleanup-schedule-<id>.timer` اور `.service` ہیں۔ یہ روزانہ، ہفتہ وار یا مہینے کے کسی دن (1 سے 28) ایک آزمائشی رن یا مکمل محفوظ صفائی چلاتا ہے۔

ٹائمر `Persistent=true` استعمال کرتا ہے: اگر مقررہ وقت پر کمپیوٹر بند تھا تو رن اگلے لاگ اِن پر ہوتا ہے۔ ہر شیڈول رن اپنا ایونٹ سلسلہ `~/.linux-cleanup/schedule-runs/` میں لکھتا ہے، اور اگلی بار کھولنے پر ایپ اسے رسید میں بدل دیتی ہے۔

چونکہ ایپ بند ہونے پر AppImage کی فائلیں غائب ہو جاتی ہیں، شیڈول `~/.linux-cleanup/desktop-engine/` میں شامل CLI کی ایک کاپی چلاتا ہے۔ ایپ ہر آغاز پر وہ کاپی تازہ کرتی ہے، اس لیے ٹائمر ہمیشہ وہی ورژن چلاتا ہے جو ایپ کے ساتھ آتا ہے۔

ٹرمینل سے کسی ٹائمر کو دیکھنے یا روکنے کے لیے:

```bash
systemctl --user list-timers 'linux-cleanup-schedule-*'
systemctl --user disable --now linux-cleanup-schedule-<id>.timer
```
