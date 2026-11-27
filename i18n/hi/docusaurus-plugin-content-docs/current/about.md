---
title: परिचय
description: linux-cleanup किसने बनाया, इसके पीछे के डिज़ाइन सिद्धांत, इसका लाइसेंस, और संपर्क या योगदान कैसे करें।
sidebar_position: 95
---

# परिचय

**linux-cleanup को [Ahsan Mahmood](https://aoneahsan.com) ने बनाया है और वही इसका रखरखाव करते हैं**, जो डेवलपर टूल और ऐप्लिकेशन विकास पर काम करने वाले एक स्वतंत्र सॉफ़्टवेयर इंजीनियर हैं।

| | |
|---|---|
| **लेखक** | Ahsan Mahmood |
| **ईमेल** | [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) |
| **वेब** | [aoneahsan.com](https://aoneahsan.com) |
| **LinkedIn** | [linkedin.com/in/aoneahsan](https://linkedin.com/in/aoneahsan) |
| **GitHub** | [github.com/aoneahsan](https://github.com/aoneahsan) |
| **npm** | [npmjs.com/~aoneahsan](https://www.npmjs.com/~aoneahsan) |

## यह क्यों है {#why-it-exists}

डेवलपर मशीनों में दोबारा बन सकने वाला ढेर सारा कचरा जमा होता है — दसियों GB के पैकेज मैनेजर कैश, ब्राउज़र कैश, बिल्ड टूल कैश, एम्युलेटर इमेज, और दो साल पहले छोड़े गए प्रोजेक्ट के `node_modules`।

मौजूदा क्लीनर आम तौर पर दो में से एक तरह के थे। या तो वे आधुनिक डेवलपर कैश के बारे में जानते ही नहीं थे, या एक बटन वाले साफ़ करने वाले टूल थे जो कचरा दिखने वाली हर चीज़ हटाकर अच्छे की उम्मीद करते थे।

linux-cleanup उल्टा रुख़ अपनाता है: **स्क्रिप्ट से चलने योग्य, पारदर्शी, अनुमति सूची से सुरक्षित, और डिफ़ॉल्ट रूप से इंटरैक्टिव।** किसी चीज़ को छूने से पहले आप ठीक-ठीक पढ़ सकते हैं कि यह क्या छुएगा।

## डिज़ाइन के सिद्धांत {#design-principles}

**गड़बड़ी में मना करो।** [अनुमति सूची, रोक सूची नहीं](./safety/guards.md#guard-1--the-path-allowlist)। जो पथ टूल नहीं पहचानता, वह अस्वीकार होता है। रोक सूची में कैश साफ़ करने और होम फ़ोल्डर साफ़ करने के बीच बस एक टाइपो होता है।

**कैश और टूल में फ़र्क करो।** `~/.cache/yarn` सेकंडों में दोबारा बन जाता है; Gradle wrapper वितरण 230 MB का डाउनलोड है जो अगले महीने चाहिए हो सकता है। [निष्क्रियता की रोक](./safety/guards.md#guard-2--the-staleness-gate) इसलिए है कि दोनों को एक जैसा मानना ग़लत था, और 1.2.0 ने यह बदला।

**निजी डेटा के बारे में फ़ैसला उपयोगकर्ता करता है।** डिस्क पर कुछ भी यह नहीं बताता कि कोई इंस्टॉलर आप फिर कभी नहीं खोलेंगे या वह किसी दस्तावेज़ की अकेली प्रति है। टूल अंदाज़ा लगाने से मना करता है, इसीलिए वे मोड [`--yes` को अनदेखा करते हैं](./safety/guards.md#guard-3--personal-data-is-interactive-only)।

**बचाव, बहाली से बेहतर।** [कोई undo नहीं](./safety/irreversibility.md), सोच-समझकर — undo लॉग उसी डिस्क पर लिखाई बढ़ाता है जिसे आप ख़ाली कर रहे हैं, और लापरवाही को बढ़ावा देता है।

**सुविधा से ज़्यादा जाँचने लायक।** Bash, क्योंकि यह पहले से इंस्टॉल है और पढ़ा जा सकता है। कंपाइल की हुई बाइनरी ज़्यादा आरामदेह होती, पर उस पर भरोसा करना कहीं मुश्किल।

**रिलीज़ जाँच सीमित है।** शुरू होने पर, ऑनलाइन हो तो CLI एक सार्वजनिक रिलीज़ रिकॉर्ड पढ़ता है। यह सफ़ाई के पथ, रिपोर्ट या क्रैश बंडल अपलोड नहीं करता; रिपोर्ट भेजना आपकी मर्ज़ी है।

## सुधार टूल को आकार देते हैं {#corrections-shape-the-tool}

दो सुरक्षा सुविधाएँ इसलिए हैं क्योंकि किसी ने असली समस्या बताई।

[संरक्षित इंस्टॉल रूट सूची](./reference/protected-paths.md#exact-match-protected-paths) एक असली ख़राबी से आई: pnpm सफ़ाई का लक्ष्य `~/.local/share/pnpm` था — इंस्टॉल रूट — और उसने ग्लोबल इंस्टॉल किए पैकेज हटा दिए। [1.1.0](./changelog.md#110--2026-05-10) में ठीक हुआ, साथ में एक जाँच जोड़ी गई ताकि यह दोबारा न हो।

[निष्क्रियता की रोक](./safety/guards.md#guard-2--the-staleness-gate) एक उपयोगकर्ता के ध्यान दिलाने से आई कि 1.2.0 अब भी Android AVD पूरे साफ़ कर देता था, और यही तर्क हर उस चीज़ पर लागू होना चाहिए जो कैश नहीं बल्कि टूल है। यही [1.2.1](./changelog.md#121--2026-05-10) बना।

अगर आपको कुछ ग़लत दिखे, [बताइए](./guides/send-a-bug-report.md)।

## लाइसेंस {#licence}

[1.4.0](./changelog.md#140--2026-07-11) से **[MIT](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE)**।

निजी या व्यावसायिक इस्तेमाल करें, बदलें, फ़ोर्क करें, जोड़ें, दोबारा बाँटें। एकमात्र शर्त है कि प्रतियों या बड़े हिस्सों में कॉपीराइट सूचना और MIT अनुमति सूचना बनी रहे।

:::danger "जैसा है" दिया गया, बिना किसी वारंटी के
यह फ़ाइलें हटाने वाला टूल है। इसके इस्तेमाल से होने वाले किसी दावे या नुकसान, डेटा खोने सहित, की ज़िम्मेदारी लेखक नहीं लेता। अपने डेटा का बैकअप लें और पुष्टि से पहले हर कार्रवाई देखें।

[पूरा लाइसेंस पाठ](https://github.com/aoneahsan/linux-cleanup/blob/main/LICENSE) ही मान्य है।
:::

1.4.0 से पहले प्रकाशित रिलीज़ उसी लाइसेंस में रहती हैं जिसमें वे आई थीं।

## योगदान {#contributing}

MIT के तहत योगदान का स्वागत है।

- **फ़ोर्क करें और पुल रिक्वेस्ट खोलें** — किसी ख़ास पहुँच की ज़रूरत नहीं
- **बग बताएँ या सुविधा माँगें** [GitHub issues](https://github.com/aoneahsan/linux-cleanup/issues) या ईमेल से
- **`main` संरक्षित है** — बदलाव समीक्षा हुए PR से आते हैं

कोडिंग मानक हैं: सुरक्षा पहले, केवल ऑफ़लाइन, ShellCheck से साफ़। देखें [CONTRIBUTING.md](https://github.com/aoneahsan/linux-cleanup/blob/main/CONTRIBUTING.md)।

केवल विवरण वाली सुविधा की माँग का भी कोड जितना ही स्वागत है। बताएँ कि आप क्या साफ़ करवाना चाहेंगे और मौजूदा मोड उसे क्यों नहीं सँभालते।

## यह दस्तावेज़ {#this-documentation}

[Docusaurus](https://docusaurus.io/) से बना और GitHub Pages पर तैनात। स्रोत: [github.com/aoneahsan/linux-cleanup-docs](https://github.com/aoneahsan/linux-cleanup-docs) — वहाँ भी सुधारों का स्वागत है।

AI सहायकों के लिए मशीन से पढ़ा जाने वाला सारांश: [`/llms.txt`](https://linux-cleanup-docs.aoneahsan.com/llms.txt)।

## जुड़े लिंक {#related-links}

| | |
|---|---|
| **स्रोत** | [github.com/aoneahsan/linux-cleanup](https://github.com/aoneahsan/linux-cleanup) |
| **npm** | [npmjs.com/package/linux-cleanup](https://www.npmjs.com/package/linux-cleanup) |
| **इश्यू** | [github.com/aoneahsan/linux-cleanup/issues](https://github.com/aoneahsan/linux-cleanup/issues) |
| **काम का समर्थन करें** | [aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=linux-cleanup&project-identifier=linux-cleanup) |
