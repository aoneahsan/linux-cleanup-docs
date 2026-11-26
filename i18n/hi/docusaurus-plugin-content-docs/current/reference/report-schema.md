---
title: रिपोर्ट स्कीमा
description: linux-cleanup का निर्देशित वॉकथ्रू जो JSON ढाँचा लिखता है — credits, meta, disk, memory, steps और totals के साथ।
tags: [json, schema, reports, parsing, jq, reference]
sidebar_position: 7
---

# रिपोर्ट स्कीमा

**निर्देशित वॉकथ्रू `"schema_version": 1` वाला एक JSON रिकॉर्ड लिखता है**, जब तक `--no-report` या `--dry-run` सेट न हो। अलग से चलने वाला `--scan` यह रिपोर्ट नहीं लिखता। मशीन से पढ़ा जाने वाला स्कैन चाहिए तो `--scan --json-events` इस्तेमाल करें; उस स्ट्रीम का ढाँचा अलग है।

:::warning पुराने दस्तावेज़ एक अलग ढाँचा बताते हैं
कुछ सामग्री — स्रोत रिपॉज़िटरी के भीतर का एक संदर्भ पेज भी — `schema` (`linux-cleanup/report/v1` जैसी स्ट्रिंग) के इर्द-गिर्द बना ढाँचा बताती है, जिसमें `tool`, `session` और `categories` ऑब्जेक्ट हैं।

**टूल ऐसा कुछ नहीं लिखता।** उसके हिसाब से लिखा पार्सर हर असली फ़ाइल पर विफल होगा। नीचे का ढाँचा वही है जो `modules/walkthrough.sh` लिखता है। अपनी मशीन पर पुष्टि करें:

```bash
jq 'keys' "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```
:::

## सबसे ऊपरी स्तर {#top-level}

```json
{
  "schema_version": 1,
  "credits": { },
  "meta":    { },
  "disk":    { "before": {}, "after": {} },
  "memory":  { "before": {}, "after": {} },
  "steps":   [ ],
  "totals":  { }
}
```

| कुंजी | प्रकार | क्या रखती है |
|---|---|---|
| `schema_version` | संख्या | अभी `1`। जो मान न पहचानें उसे अस्वीकार करें |
| `credits` | ऑब्जेक्ट | टूल की पहचान, लाइसेंस और लेखक |
| `meta` | ऑब्जेक्ट | सत्र का संदर्भ — कब, कहाँ, कैसे, किन सेटिंग्स के साथ |
| `disk` | ऑब्जेक्ट | पहले और बाद में फ़ाइल सिस्टम का उपयोग |
| `memory` | ऑब्जेक्ट | पहले और बाद में मेमोरी का उपयोग |
| `steps` | ऐरे | हर आज़माए गए चरण की एक प्रविष्टि |
| `totals` | ऑब्जेक्ट | सत्र का सारांश |

## `credits` {#credits}

```json
{
  "tool": "linux-cleanup",
  "tool_version": "2.1.1",
  "tool_homepage": "https://linux-cleanup.aoneahsan.com",
  "tool_license": "MIT",
  "author": {
    "name": "Ahsan Mahmood",
    "email": "aoneahsan@gmail.com",
    "website": "https://aoneahsan.com",
    "linkedin": "https://linkedin.com/in/aoneahsan"
  }
}
```

यह इसलिए है कि रिकॉर्ड जहाँ भी पहुँचे, अपना स्रोत खुद बताए। इसमें कुछ भी आपकी मशीन के बारे में नहीं है।

## `meta` {#meta}

| कुंजी | प्रकार | क्या रखती है |
|---|---|---|
| `tool` | स्ट्रिंग | हमेशा `linux-cleanup` |
| `tool_version` | स्ट्रिंग | वह संस्करण जिसने रिकॉर्ड लिखा। इस्तेमाल करने वाले का तर्क इसी पर टिकाएँ |
| `started_at` | स्ट्रिंग | सत्र शुरू होने का समय |
| `finished_at` | स्ट्रिंग | सत्र ख़त्म होने का समय |
| `duration_seconds` | संख्या | असल में लगा समय |
| `host` | स्ट्रिंग | `hostname` का आउटपुट |
| `user` | स्ट्रिंग | `$USER` |
| `mode` | स्ट्रिंग | जो मोड चला — `walkthrough`, `scan`, `allsafe`, `system` आदि |
| `stale_days` | संख्या | लागू `--days` सीमा |
| `log_file` | स्ट्रिंग | इस सत्र के लॉग का पूरा पथ |
| `launcher` | स्ट्रिंग | कैसे चलाया गया — सीधे चलाने पर `bash` |
| `via_npx` | संख्या | npm लॉन्चर से चलाने पर `1`, वरना `0` |

`stale_days` दर्ज करना काम का है: यही 100 दिन पर छँटाई वाले रन और `-d 30` वाले रन का फ़र्क है, और बताता है कि एक ही मशीन पर दो सत्रों ने अलग-अलग जगह क्यों वापस पाई।

## `disk` और `memory` {#disk-and-memory}

दोनों में `before` और `after` नमूने होते हैं, सत्र की शुरुआत और अंत में लिए गए।

`disk` में `df` से लिए फ़ाइल सिस्टम फ़ील्ड होते हैं — फ़ाइल सिस्टम, आकार, इस्तेमाल, उपलब्ध और उपयोग प्रतिशत। `memory` में सिस्टम की मेमोरी रिपोर्ट से वही जानकारी होती है।

:::note `after` घटा `before` केवल आपकी सफ़ाई नहीं है
ये पूरी मशीन के माप हैं। सत्र के दौरान चल रहा बिल्ड, पैकेज अपडेट या ब्राउज़र भी इन्हें बदलता है, इसलिए बताई गई वापसी चरणों के जोड़ से कम — या ऋणात्मक — हो सकती है। देखें [समस्या निवारण](../troubleshooting.md#disk-usage-grew-during-the-session)।
:::

## `steps` {#steps}

एक ऐरे, हर आज़माए गए चरण की एक प्रविष्टि, क्रम से:

```json
{ "n": 1, "title": "Package-manager caches", "status": "ran", "freed_bytes": 13315108864 }
```

| कुंजी | प्रकार | क्या रखती है |
|---|---|---|
| `n` | संख्या | 1 से शुरू होने वाला चरण क्रमांक |
| `title` | स्ट्रिंग | पढ़ने लायक चरण का नाम |
| `status` | स्ट्रिंग | `ran`, `skipped`, `skipped (quit)` या `skipped (jq missing)` |
| `freed_bytes` | संख्या | इस चरण से वापस मिले बाइट। छोड़ने पर `0` |

`skipped (quit)` उन चरणों को बताता है जो आपके `q` दबाने के बाद आए — जानबूझकर रोकने और किसी चरण को अलग से मना करने का फ़र्क समझने में काम आता है।

## `totals` {#totals}

| कुंजी | प्रकार | क्या रखती है |
|---|---|---|
| `total_reclaimed_bytes` | संख्या | सभी चरणों का जोड़ |
| `total_reclaimed_human` | स्ट्रिंग | वही, पढ़ने लायक रूप में |
| `steps_run` | संख्या | `ran` स्थिति वाले चरण |
| `steps_skipped` | संख्या | `skipped` स्थिति वाले चरण |

## पार्सिंग {#parsing}

```bash
LATEST="$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"

jq '.totals.total_reclaimed_human' "$LATEST"
jq '.meta | {mode, stale_days, duration_seconds}' "$LATEST"
jq '.steps[] | select(.status == "ran") | "\(.title): \(.freed_bytes)"' "$LATEST"

# दर्ज हर सत्र में कुल वापसी
jq -s 'map(.totals.total_reclaimed_bytes) | add' ~/.linux-cleanup/reports/report-*.json
```

## जाँच {#validating}

टूल के साथ कोई JSON Schema फ़ाइल नहीं आती। एक ढाँचा जाँच:

```bash
jq -e 'has("schema_version") and .schema_version == 1
       and has("meta") and has("steps") and has("totals")' \
  ~/.linux-cleanup/reports/report-*.json
```

हर मान्य फ़ाइल के लिए `true` छापता है।

## संगतता के सुझाव {#compatibility-guidance}

इस्तेमाल करने वाला प्रोग्राम लिखते समय:

- **`schema_version` पर शाखा बनाएँ।** अनजान मान को अनुमान लगाने के बजाय न पढ़ा जा सकने वाला मानें
- **अनजान कुंजियों को जुड़ाव मानें।** संस्करण 1 में फ़ील्ड जुड़ चुके हैं और फिर जुड़ सकते हैं
- **`meta.tool_version` इस्तेमाल करें** उस व्यवहार के लिए जो रिलीज़ के बीच बदलता है
- **यह न मानें कि हर मोड हर हिस्सा भरता है।** केवल-पढ़ने वाले मोड कम चरण बनाते हैं
- **`total_reclaimed_bytes` कभी-कभी ऋणात्मक हो सकता है।** यह `df` का अंतर है, हटाई गई चीज़ों का जोड़ नहीं

## आगे {#next}

- [रिपोर्ट](../modes/reports.md) — देखना और एक्सपोर्ट करना
- [आउटपुट पथ](./output-paths.md) — फ़ाइलें कहाँ रहती हैं
