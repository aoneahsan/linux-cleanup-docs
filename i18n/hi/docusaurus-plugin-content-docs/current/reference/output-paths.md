---
title: आउटपुट पथ
description: linux-cleanup अपने लॉग, JSON सत्र रिकॉर्ड, डीबग बंडल और क्रैश बंडल कहाँ लिखता है — ढाँचा, हर इंस्टॉल के डिफ़ॉल्ट, रखने की अवधि और अनुमतियाँ।
tags: [output, paths, logs, reports, feedback, retention, reference]
sidebar_position: 5
---

# आउटपुट पथ

**सारा आउटपुट एक ही डेटा रूट के नीचे रहता है।** कौन-सा रूट, यह इस पर निर्भर है कि आपने टूल कैसे इंस्टॉल किया, और दोनों बदले जा सकते हैं।

## ढाँचा {#layout}

```text
$DATA_HOME/
├── logs/
│   ├── cleanup-<YYYY-MM-DD_HHMMSS>.log     # हर सत्र का एक
│   └── cron.log                             # साप्ताहिक cron जोड़ता है
├── reports/
│   ├── report-<YYYY-MM-DD_HHMMSS>.json     # वॉकथ्रू का रिकॉर्ड, जब तक बंद न हो
│   ├── report-<YYYY-MM-DD_HHMMSS>.md       # --export md से बनता है
│   └── report-<YYYY-MM-DD_HHMMSS>.html     # --export html से बनता है
└── feedback/
    ├── debug-bundle-<YYYY-MM-DD_HHMMSS>.tar.gz   # --debug-bundle से बनता है
    └── crash-<YYYY-MM-DD_HHMMSS>.tar.gz          # क्रैश पर अपने आप बनता है
```

## हर इंस्टॉल के डिफ़ॉल्ट {#per-install-defaults}

| इंस्टॉल का तरीका | `$DATA_HOME` |
|---|---|
| `npx linux-cleanup` | `~/.linux-cleanup/` |
| `npm install -g linux-cleanup` | `~/.linux-cleanup/` |
| `git clone` | क्लोन फ़ोल्डर ही |

यह फ़र्क जानबूझकर है। `npx` पैकेज को एक अस्थायी npm कैश फ़ोल्डर से चलाता है जो साफ़ हो जाता है, इसलिए वहाँ लिखा आउटपुट खो जाएगा; `~/.linux-cleanup/` रनों के बीच बना रहता है। क्लोन पहले से स्थायी जगह है, इसलिए आउटपुट स्रोत के पास रहता है।

दोनों को [`LINUX_CLEANUP_DATA_HOME`](./environment-variables.md) से बदलें, या लॉग और रिकॉर्ड फ़ोल्डर अलग-अलग।

## रखने की अवधि {#retention}

| पथ | अपने आप साफ़ | टिप्पणी |
|---|---|---|
| `logs/cleanup-*.log` | केवल `--cleanup-logs` के साथ | वह फ़्लैग अंत में **इस रन** का लॉग हटाता है। पुराने लॉग रहते हैं |
| `logs/cron.log` | कभी नहीं | कभी रोटेट नहीं होता। बड़ा हो तो खुद रोटेट करें |
| `reports/*.json` | **कभी नहीं** | टिकाऊ ऑडिट रिकॉर्ड |
| `reports/*.md`, `*.html` | **कभी नहीं** | माँगने पर बनते हैं, माँगने पर हटते हैं |
| `feedback/*.tar.gz` | **कभी नहीं** | आप तय करते हैं कि कब उनकी ज़रूरत नहीं रही |

`--cleanup-logs` ही एकमात्र अपने आप होने वाला हटाना है जो टूल अपने आउटपुट पर करता है, और यह केवल `.log` फ़ाइलों को छूता है।

## आकार और रखने की अवधि {#size-and-retention}

लॉग और बंडल का आकार किसी रन के पथों और इवेंट पर निर्भर है। पुराने रिकॉर्ड हटाने से पहले देखें कि क्या जमा हुआ है। पुरानी फ़ाइलें सोच-समझकर छाँटने के लिए:

```bash
find ~/.linux-cleanup/logs/    -name 'cleanup-*.log' -mtime +90 -delete
find ~/.linux-cleanup/reports/ -name 'report-*'      -mtime +90 -delete
```

cron लॉग रोटेट करना:

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## अनुमतियाँ {#permissions}

फ़ाइलें चलाने वाले उपयोगकर्ता की होती हैं। अपनी मशीन पर `stat` से उनकी असल अनुमतियाँ देखें; टूल की तय फ़ोल्डर अनुमतियाँ और प्रक्रिया का umask दोनों मायने रखते हैं। कोई लॉग या बंडल बिना पढ़े साझा न करें।

## इन फ़ाइलों में क्या होता है {#what-these-files-contain}

:::caution लॉग और बंडल में आपके पथ होते हैं
सत्र लॉग हर छुए गए पथ का नाम लेता है, यानी इसमें आपकी मशीन के फ़ोल्डर नाम होते हैं — प्रोजेक्ट के नाम, और कभी-कभी `~/Downloads` की फ़ाइलों के नाम।

यह केवल स्थानीय है और कभी भेजा नहीं जाता, फिर भी बंडल ईमेल करने से पहले देख लें:

```bash
tar -tzf ~/.linux-cleanup/feedback/debug-bundle-*.tar.gz
```

देखें [बग रिपोर्ट भेजें](../guides/send-a-bug-report.md)।
:::

यहाँ किसी चीज़ में फ़ाइलों की **सामग्री** नहीं होती — केवल पथ, आकार और समय। ये जो हुआ उसके रिकॉर्ड हैं, हटाई गई चीज़ों की प्रतियाँ नहीं। देखें [रिकवरी](../recovery.md)।

## आगे {#next}

- [एनवायरनमेंट वेरिएबल](./environment-variables.md) — इन जगहों को बदलना
- [रिपोर्ट स्कीमा](./report-schema.md) — JSON ढाँचा
