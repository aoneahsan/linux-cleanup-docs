---
title: रिपोर्ट
description: गाइडेड वॉकथ्रू एक JSON सत्र रिकॉर्ड लिख सकता है। उन्हें सूचीबद्ध करें, देखें, Markdown या HTML में बदलें और एक्सपोर्ट करें।
tags: [reports, json, export, markdown, html, jq, modes]
sidebar_position: 15
---

# रिपोर्ट

**गाइडेड वॉकथ्रू एक JSON सत्र रिकॉर्ड** `~/.linux-cleanup/reports/report-<timestamp>.json` में लिखता है, जब तक `--no-report` या `--dry-run` न लगा हो। दूसरे मोड यह रिकॉर्ड नहीं बनाते। मौजूदा रिकॉर्ड अपने आप नहीं हटते।

Markdown और HTML वैकल्पिक बदलाव हैं जो माँगने पर बनते हैं।

```bash
linux-cleanup --reports              # इंटरैक्टिव मैनेजर
linux-cleanup --export both latest   # बिना पूछे बदलाव
```

## सत्र रिकॉर्ड में क्या होता है {#what-a-session-record-contains}

| भाग | क्या रखता है |
|---|---|
| `schema_version` | अभी `1` |
| `credits` | टूल का नाम, संस्करण, होमपेज, लाइसेंस, लेखक की जानकारी |
| `meta` | टाइमस्टैम्प, अवधि, होस्ट, उपयोगकर्ता, मोड, निष्क्रियता सीमा, लॉग पथ, लॉन्चर |
| `disk` | पहले और बाद में फ़ाइल सिस्टम का उपयोग |
| `memory` | पहले और बाद में मेमोरी का उपयोग |
| `steps` | हर चरण की एक प्रविष्टि: नंबर, शीर्षक, स्थिति, ख़ाली हुए बाइट |
| `totals` | कुल वापस मिले बाइट, पढ़ने लायक कुल, चले और छोड़े चरण |

हर फ़ील्ड का पूरा संदर्भ: [रिपोर्ट स्कीमा](../reference/report-schema.md)।

## इंटरैक्टिव मैनेजर {#the-interactive-manager}

```bash
linux-cleanup --reports
```

पिछले सत्र दिखाता है और आपको किसी एक को देखने, Markdown या HTML में बदलने, HTML ब्राउज़र में खोलने या उसे हटाने देता है।

`jq` इंस्टॉल न हो तो बदलने के विकल्प छिपे रहते हैं — देखें [नीचे](#jq-is-required-for-conversion)।

## एक्सपोर्ट करना {#exporting}

बिना पूछे, स्क्रिप्ट और आदतों के लिए:

```bash
linux-cleanup --export both latest   # सबसे नए रिकॉर्ड से Markdown + HTML
linux-cleanup --export html all      # हर रिकॉर्ड HTML में
linux-cleanup --export md 3          # रिकॉर्ड #3 Markdown में
```

| आर्ग्युमेंट | क्या स्वीकार करता है |
|---|---|
| फ़ॉर्मेट | `md`, `html`, `both` |
| पहचान | रिकॉर्ड नंबर, `latest` या `all` |

आउटपुट JSON के पास, फ़ाइल नाम में उसी टाइमस्टैम्प के साथ बनता है। HTML अपने में पूरा है — भीतर CSS, डार्क मोड की समझ, कोई बाहरी संसाधन नहीं — इसलिए इसे एक फ़ाइल के रूप में ईमेल या संग्रह किया जा सकता है।

## बदलने के लिए `jq` ज़रूरी है {#jq-is-required-for-conversion}

:::note JSON हमेशा लिखा जाता है; बदलना वैकल्पिक हिस्सा है
`jq` के बिना भी वॉकथ्रू अपना JSON रिकॉर्ड बना सकता है। केवल Markdown और HTML एक्सपोर्ट उपलब्ध नहीं होते, और वॉकथ्रू का चरण 10 ख़ुद को `skipped (jq missing)` दर्ज करता है।

```bash
sudo apt install jq      # Debian / Ubuntu
sudo dnf install jq      # Fedora / RHEL
sudo pacman -S jq        # Arch
```
:::

बनाया गया HTML JSON से आए हर मान को `jq` के `@html` फ़िल्टर से एस्केप करता है, इसलिए ख़राब इनपुट दिखाए गए पेज में मार्कअप नहीं घुसा सकता।

## JSON से सीधे पूछना {#querying-the-json-directly}

JSON औज़ारों के पढ़ने के लिए ही है:

```bash
# सबसे हाल के सत्र में कुल कितना वापस मिला
jq '.totals.total_reclaimed_human' ~/.linux-cleanup/reports/report-*.json | tail -1

# सबसे हाल के सत्र में सच में चला हर चरण
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

# सभी दर्ज सत्रों में कुल वापसी
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## रखाव {#retention}

ये रिकॉर्ड **कभी** अपने आप नहीं हटते — `--cleanup-logs` से भी नहीं, जो केवल मौजूदा रन की लॉग फ़ाइल हटाता है।

इन्हें ख़ुद कम करने के लिए:

```bash
find ~/.linux-cleanup/reports/ -name 'report-*' -mtime +90 -delete
```

किसी एक रन में रिपोर्ट बनना पूरी तरह रोकने के लिए `--no-report` लगाएँ; लॉग फिर भी लिखा जाता है।

## ये रिकॉर्ड हैं, बैकअप नहीं {#these-are-records-not-backups}

:::danger सत्र रिकॉर्ड चरणों का सार है, बैकअप नहीं
यह चरण और डिस्क की बातें दर्ज करता है, हर हटाई फ़ाइल की पूरी सूची नहीं। इसमें हटाई गई सामग्री बिल्कुल नहीं होती, और इसमें कुछ भी कुछ वापस नहीं ला सकता। अनचाहे हटाने के बाद इसका काम यह पहचानने में मदद है कि अपने बैकअप से क्या वापस लाना है, या क्या फिर डाउनलोड करना है। देखें [रिकवरी](../recovery.md)।
:::

## आगे {#next}

- [रिपोर्ट स्कीमा](../reference/report-schema.md) — हर फ़ील्ड
- [आउटपुट पथ](../reference/output-paths.md) — फ़ाइलें कहाँ बनती हैं
- [रिकवरी](../recovery.md) — अचानक कुछ होने के बाद सत्र रिकॉर्ड का उपयोग
