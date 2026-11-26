---
sidebar_position: 3
title: शेड्यूल
description: systemd यूज़र टाइमर के रूप में शेड्यूल किए गए ड्राई रन और पूरी तरह सुरक्षित सफ़ाई।
---

# शेड्यूल

शेड्यूल Pro और Team प्लान का हिस्सा हैं। एक शेड्यूल `~/.config/systemd/user/` में **systemd यूज़र यूनिट** की एक जोड़ी है, जिनके नाम `linux-cleanup-schedule-<id>.timer` और `.service` हैं। यह रोज़, हर हफ़्ते या महीने के किसी दिन (1 से 28) एक ड्राई रन या पूरी तरह सुरक्षित सफ़ाई चलाता है।

टाइमर `Persistent=true` इस्तेमाल करता है: अगर तय समय पर कंप्यूटर बंद था, तो रन अगले लॉगिन पर होता है। हर शेड्यूल रन अपना इवेंट स्ट्रीम `~/.linux-cleanup/schedule-runs/` में लिखता है, और अगली बार खोलने पर ऐप उसे रसीद में बदल देता है।

क्योंकि ऐप बंद होने पर AppImage की फ़ाइलें ग़ायब हो जाती हैं, शेड्यूल `~/.linux-cleanup/desktop-engine/` में साथ आए CLI की एक प्रति चलाता है। ऐप हर शुरुआत पर वह प्रति ताज़ा करता है, इसलिए टाइमर हमेशा वही संस्करण चलाता है जो ऐप के साथ आता है।

टर्मिनल से किसी टाइमर को देखने या रोकने के लिए:

```bash
systemctl --user list-timers 'linux-cleanup-schedule-*'
systemctl --user disable --now linux-cleanup-schedule-<id>.timer
```
