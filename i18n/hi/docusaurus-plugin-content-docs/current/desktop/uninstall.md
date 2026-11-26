---
sidebar_position: 7
title: अनइंस्टॉल
description: डेस्कटॉप ऐप, उसके शेड्यूल और आपके कंप्यूटर पर रखी चीज़ें हटाएँ।
---

# अनइंस्टॉल

## पहले शेड्यूल हटाएँ {#remove-the-schedules-first}

शेड्यूल systemd यूज़र टाइमर हैं, और वे ऐप से बाहर CLI की एक प्रति चलाते हैं। ऐप हटाने से वे **नहीं** हटते। अनइंस्टॉल करने से पहले **शेड्यूल** स्क्रीन पर हर एक हटाएँ, या टर्मिनल से:

```bash
systemctl --user disable --now 'linux-cleanup-schedule-*.timer'
rm -f ~/.config/systemd/user/linux-cleanup-schedule-*.{timer,service}
systemctl --user daemon-reload
```

## ऐप हटाएँ {#remove-the-app}

| कैसे इंस्टॉल किया | कैसे हटाएँ |
|---|---|
| AppImage | `.AppImage` फ़ाइल हटाएँ, फिर उसकी मेन्यू प्रविष्टि: `rm ~/.local/share/applications/linux-cleanup-desktop.desktop ~/.local/share/icons/hicolor/*/apps/linux-cleanup-desktop.png` |
| `.deb` | `sudo apt remove linux-cleanup` |

## क्या पीछे रहता है {#what-stays-behind}

| फ़ोल्डर | क्या रखता है | कब हटाएँ |
|---|---|---|
| `~/.linux-cleanup/` | रिपोर्ट, लॉग, शेड्यूल रन के स्ट्रीम और शेड्यूल की CLI प्रति। टर्मिनल वाला CLI भी यही फ़ोल्डर इस्तेमाल करता है | जब आप CLI भी इस्तेमाल नहीं करते |
| `~/.local/share/com.aoneahsan.linuxcleanup/` | ऐप की सेटिंग्स, रसीदें और इस कंप्यूटर की यादृच्छिक डिवाइस id | अनइंस्टॉल के बाद हटाना हमेशा सुरक्षित |

साइन इन किया खाता ऐप जाने के बाद भी रहता है। अनइंस्टॉल करने से पहले उसे **खाता** से हटाएँ; हटाने से खाता और उसकी सिंक की गई संख्याएँ सर्वर से हट जाती हैं।
