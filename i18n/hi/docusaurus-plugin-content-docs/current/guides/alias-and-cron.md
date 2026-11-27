---
title: शेल एलियास और साप्ताहिक cron
description: cleanup शेल एलियास और हर हफ़्ते अपने आप चलने वाली पूरी तरह सुरक्षित सफ़ाई इंस्टॉल करें, हर एक क्या लिखता है, और उन्हें फिर कैसे हटाएँ।
sidebar_position: 2
---

# शेल एलियास और साप्ताहिक cron

**एक बार की सेटअप वाले दो सहायक: `cleanup` शेल एलियास, और हर हफ़्ते अपने आप चलने वाला रन।** दोनों को मिलते अनइंस्टॉल फ़्लैग से पलटा जा सकता है।

```bash
linux-cleanup --install-alias
linux-cleanup --install-cron
```

## शेल एलियास {#the-shell-alias}

```bash
linux-cleanup --install-alias
```

आपके शेल के हिसाब से `~/.bash_aliases` या `~/.zshrc` में एक `cleanup` एलियास जोड़ता है। इसके बाद कहीं भी `cleanup` टाइप करने से टूल चलता है।

अपना शेल फिर लोड करें, वरना एलियास मौजूद नहीं लगेगा:

```bash
source ~/.bashrc     # या ~/.zshrc
```

इसे `linux-cleanup --uninstall-alias` से हटाएँ।

:::note शेल-इनिट फ़ाइलें हटाने के स्तर पर संरक्षित हैं
`.bashrc`, `.zshrc`, `.bash_aliases` और ऐसी फ़ाइलें [संरक्षित फ़ाइल-नाम सूची](../reference/protected-paths.md#protected-basenames) में हैं, इसलिए कोई सफ़ाई मोड इन्हें कभी नहीं हटा सकता — वे किसी भी पथ पर हों। एलियास इंस्टॉलर बस जोड़ता है; अनइंस्टॉलर केवल अपनी पंक्ति हटाता है।
:::

## साप्ताहिक cron जॉब {#the-weekly-cron-job}

```bash
linux-cleanup --install-cron
```

`--all-safe -y` को **हर रविवार 03:00** के लिए तय करता है, और आउटपुट `~/.linux-cleanup/logs/cron.log` में जोड़ता है। `crontab` चाहिए।

इसे `linux-cleanup --uninstall-cron` से हटाएँ।

### इसके लिए `--all-safe` सही मोड क्यों है {#why---all-safe-is-the-right-mode-for-this}

यह अकेला मोड है जिस पर `--yes` लागू होता है, और यह **निजी डेटा नहीं छू सकता** — केवल-इंटरैक्टिव मोड इसका हिस्सा नहीं हैं और डिज़ाइन से `--yes` को अनदेखा करते हैं। इसलिए बिना देखरेख का रन कैश साफ़ कर सकता है और `~/Downloads` की कोई फ़ाइल कभी नहीं हटा सकता। देखें [जाँच 3](../safety/guards.md#guard-3--personal-data-is-interactive-only)।

[निष्क्रियता जाँच](../safety/guards.md#guard-2--the-staleness-gate) फिर भी लागू रहती है, इसलिए हाल में इस्तेमाल हुई फ़ाइलें हर साप्ताहिक सफ़ाई में बची रहती हैं।

## crontab प्रविष्टि ख़ुद लिखना {#writing-the-crontab-entry-yourself}

किसी दूसरे समय या फ़्लैग के लिए:

```bash
crontab -e
```

```bash
0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y --no-report --cleanup-logs >>~/.linux-cleanup/logs/cron.log 2>&1
```

:::danger पूरा पथ इस्तेमाल करें
cron बहुत छोटे `PATH` के साथ चलता है — आम तौर पर बस `/usr/bin:/bin`। अगर `linux-cleanup` `~/.local/bin` या किसी Node वर्शन-मैनेजर फ़ोल्डर में है, तो बिना पथ का `linux-cleanup` नहीं मिलेगा, और जॉब हर हफ़्ते चुपचाप विफल होगा।

शेड्यूल किए रन की यही सबसे आम समस्या है। अपना पथ ऐसे पता करें:

```bash
command -v linux-cleanup
```

या crontab के सबसे ऊपर `PATH=` साफ़ तौर पर सेट करें।
:::

| फ़्लैग | cron में क्यों |
|---|---|
| `--all-safe -y` | बिना देखरेख, केवल कैश |
| `--no-report` | JSON रिकॉर्ड जमा होना रोकता है — वे **कभी** अपने आप नहीं हटते |
| `--cleanup-logs` | अंत में उस रन का लॉग हटाता है |
| `-d 30` | वैकल्पिक: हर हफ़्ते ज़्यादा आक्रामक छँटाई |

केवल `--cleanup-logs` फ़ोल्डर छोटा रखने के लिए काफ़ी नहीं: यह रिकॉर्ड कभी नहीं छूता। यह काम `--no-report` करता है।

:::caution शेड्यूल किए जॉब में `--purge-all` न जोड़ें
बिना देखरेख और बिना निष्क्रियता जाँच का मतलब है कि कोई महँगी चीज़ ज़रूरत से एक हफ़्ता पहले ग़ायब हो सकती है, और कोई देख भी नहीं रहा होगा। `--purge-all` को सोचे-समझे, निगरानी वाले रन के लिए रखें। देखें [सबसे ज़्यादा जगह वापस पाएँ](./reclaim-the-most-space.md)।
:::

## जाँचना कि यह चला {#checking-that-it-ran}

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

अगर लॉग `command not found` दिखाए, तो यह ऊपर वाली `PATH` समस्या है। अगर लॉग ख़ाली है, तो जॉब कभी चला ही नहीं — जाँचें कि cron डेमन चल रहा है (`systemctl status cron` या `crond`)।

cron लॉग **कभी घुमाया (रोटेट) नहीं जाता**। बढ़ जाए तो ख़ुद रोटेट करें:

```bash
mv ~/.linux-cleanup/logs/cron.log ~/.linux-cleanup/logs/cron.log.old
touch ~/.linux-cleanup/logs/cron.log
```

## इसके बजाय systemd टाइमर {#a-systemd-timer-instead}

अगर आपको cron के बजाय टाइमर पसंद हैं, तो इसमें टूल से जुड़ा कुछ ख़ास नहीं — वही कमांड शेड्यूल करें। टूल न जानता है, न परवाह करता है कि किस शेड्यूलर ने उसे चलाया, और `--install-cron` सुविधा है, ज़रूरत नहीं।

## दोनों हटाना {#removing-both}

```bash
linux-cleanup --uninstall-alias
linux-cleanup --uninstall-cron
```

पैकेज समेत पूरी तरह हटाना: [अनइंस्टॉल](./uninstall.md)।
