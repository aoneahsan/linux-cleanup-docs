---
title: अनइंस्टॉल
description: linux-cleanup को पूरी तरह हटाएँ — पैकेज, शेल एलियास, cron प्रविष्टि, और उसके लॉग व सत्र रिकॉर्ड।
tags: [guide, uninstall, remove, cleanup, cron, alias]
sidebar_position: 4
---

# अनइंस्टॉल

**पहले स्वचालन हटाएँ, फिर पैकेज, फिर डेटा।** पैकेज अनइंस्टॉल करने से आपका लगाया शेल एलियास या cron प्रविष्टि नहीं हटती — वे अलग हैं।

## 1. स्वचालन हटाएँ {#1-remove-the-automation}

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

यह पैकेज हटाने से **पहले** करें, जब तक कमांड मौजूद है। अगर आप उसे पहले ही हटा चुके हैं, तो नीचे [हाथ से हटाना](#if-you-removed-the-package-first) देखें।

जाँचें:

```bash
crontab -l | grep -i cleanup     # कोई आउटपुट नहीं आना चाहिए
grep -rn 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

## 2. पैकेज हटाएँ {#2-remove-the-package}

```bash
npm uninstall -g linux-cleanup
```

`npx` के लिए कुछ इंस्टॉल नहीं होता — npm कैश उसे अपने आप हटा देता है। अभी साफ़ करने के लिए:

```bash
npm cache clean --force
```

git clone के लिए फ़ोल्डर हटाएँ:

```bash
rm -rf ~/linux-cleanup
```

:::caution क्लोन अपने लॉग और रिकॉर्ड ख़ुद रखता है
npm इंस्टॉल के तरीकों के उलट, क्लोन आउटपुट `<clone>/logs/` और `<clone>/reports/` में रखता है। क्लोन हटाने से वे भी हटते हैं। जो रखना हो, पहले उसकी प्रति बना लें। देखें [आउटपुट पथ](../reference/output-paths.md)।
:::

## 3. डेटा हटाएँ {#3-remove-the-data}

लॉग, सत्र रिकॉर्ड और फ़ीडबैक बंडल `~/.linux-cleanup/` में रहते हैं और अनइंस्टॉल करने से **कभी** नहीं हटते।

```bash
ls -la ~/.linux-cleanup/           # हटाने से पहले देखें
rm -rf ~/.linux-cleanup/
```

ये छोटे होते हैं — आम तौर पर कुछ मेगाबाइट — और पिछले रनों ने क्या हटाया, इसका यही अकेला ब्योरा हैं। इन्हें रखने में कुछ नहीं लगता; इन्हें हटाना किसी भी और हटाने की तरह वापस नहीं हो सकता।

अगर आपने `LINUX_CLEANUP_DATA_HOME` सेट किया था, तो उसके बजाय वह फ़ोल्डर हटाएँ, और अपनी शेल कॉन्फ़िगरेशन से वह एक्सपोर्ट निकाल दें।

## 4. कॉन्फ़िगरेशन हटाएँ, अगर आपने बनाई हो {#4-remove-configuration-if-you-created-any}

```bash
rm -f ~/.config/personal-roots.txt ~/.config/project-roots.txt
```

ये तभी होती हैं जब आपने ख़ुद बनाई हों। देखें [एनवायरनमेंट वेरिएबल](../reference/environment-variables.md#configuring-the-scanned-roots)।

## अगर आपने पहले पैकेज हटा दिया {#if-you-removed-the-package-first}

दोनों सहायक हाथ से हटाएँ।

**Cron:**

```bash
crontab -e
# linux-cleanup या cleanup.sh वाली पंक्ति हटाएँ
```

**एलियास:**

```bash
grep -n 'cleanup' ~/.bash_aliases ~/.zshrc 2>/dev/null
```

अपने एडिटर से मिलती एलियास पंक्ति हटाएँ, फिर फ़ाइल को `source` करें या नया टर्मिनल खोलें।

## पीछे क्या बचता है {#what-is-left-behind}

ऊपर का सब कर लेने पर कुछ नहीं। टूल कोई सिस्टम सर्विस, डेमन, systemd यूनिट, `/etc` प्रविष्टि या root की फ़ाइल इंस्टॉल नहीं करता। इसका बनाया सब कुछ आपके होम फ़ोल्डर के भीतर है।

सिस्टम पर असर जिन्हें यह नहीं पलटता — क्योंकि वे इसकी फ़ाइलें नहीं:

- **हटाए गए कैश हटे ही रहते हैं।** हर टूल को ज़रूरत पड़ने पर वे फिर बनते हैं
- **[`--doctor`](../modes/doctor.md) के जोड़े शेल-इनिट ब्लॉक** बने रहते हैं। ये आपके इंस्टॉल रनटाइम के लिए सही कॉन्फ़िगरेशन हैं; न चाहिए तो हाथ से हटाएँ

## जाँचें {#verify}

```bash
command -v linux-cleanup      # कोई आउटपुट नहीं आना चाहिए
crontab -l | grep -i cleanup  # कोई आउटपुट नहीं आना चाहिए
ls ~/.linux-cleanup 2>&1      # आना चाहिए: No such file or directory
```

## आगे {#next}

- [इंस्टॉलेशन](../getting-started/installation.md) — अगर आप फिर से इंस्टॉल कर रहे हैं
