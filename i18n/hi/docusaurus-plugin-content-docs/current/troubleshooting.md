---
title: समस्या निवारण
description: linux-cleanup उपयोगकर्ताओं को सच में आने वाली समस्याओं के लक्षण, कारण और हल — इनकार, ग़ायब निर्भरताएँ, cron विफलताएँ, धीमे स्कैन और संस्करण की उलझन।
sidebar_position: 92
---

# समस्या निवारण

लक्षण → कारण → हल। पहले जाँच वाला कमांड चलाएँ; मेल खाए तो हल लागू करें।

अगर आपको कोई त्रुटि नहीं, बल्कि डेटा का नुकसान हुआ है, तो [रिकवरी](./recovery.md) पर जाएँ।

## REFUSE: protected path {#refuse-protected-path}

```text
✗ REFUSE: protected path: /home/you/Documents/something
```

**कारण।** सिमलिंक खोलने के बाद पथ [संरक्षित सूची](./reference/protected-paths.md) की किसी जगह पर पहुँचा। अनुमति-सूची ने उसे रोक दिया।

**यह सही व्यवहार है, विफलता नहीं।** कुछ नहीं हटा।

**हल।** पता करें कि क्या कहाँ पहुँचा:

```bash
linux-cleanup --list-targets
realpath <the path that was rejected>
```

लगभग हमेशा कोई कैश किसी संरक्षित फ़ोल्डर में सिमलिंक होता है। **सिमलिंक ठीक करें, टूल नहीं** — टूल ठीक अपना काम कर रहा है। डिज़ाइन से कोई ओवरराइड फ़्लैग नहीं है।

दो संबंधित संदेश:

```text
✗ REFUSE: unsafe path: '/home/you'            # अकेला $HOME या /
✗ REFUSE: shell-init / history file: …        # .bashrc, .zshrc और ऐसी फ़ाइलें
```

## TUI mode needs whiptail or dialog {#tui-mode-needs-whiptail-or-dialog}

**कारण।** `--tui` तब चलाया गया जब दोनों में से कोई इंस्टॉल नहीं था।

**हल।** एक इंस्टॉल करें, या CLI मेन्यू पर लौटने का सुझाव मान लें।

```bash
sudo apt install whiptail     # Debian / Ubuntu
sudo dnf install newt         # Fedora / RHEL
sudo pacman -S libnewt        # Arch
```

**जाँच।** `command -v whiptail`, फिर दोबारा चलाएँ। देखें [TUI](./modes/tui.md)।

## export requires jq {#export-requires-jq}

**कारण।** `jq` इंस्टॉल किए बिना `--export md`, `--export html` या रिपोर्ट मैनेजर में बदलाव।

**हल।**

```bash
sudo apt install jq
```

`jq` केवल बदलने के लिए चाहिए। इसके बिना भी हर रन पर JSON रिकॉर्ड लिखे जाते हैं। देखें [रिपोर्ट](./modes/reports.md)।

## command not found {#command-not-found}

**कारण।** कोई ज़रूरी निर्भरता ग़ायब है या किसी असंगत एलियास ने उसे ढक दिया है। GNU coreutils की जगह BusyBox वाले छोटे कंटेनर में आम है।

**जाँच।**

```bash
linux-cleanup --self-test
```

यह हर ज़रूरी कमांड परखता है और पहले ग़ायब कमांड का नाम बताता है।

**हल।** अपने डिस्ट्रो के coreutils, findutils और gawk पैकेज इंस्टॉल करें। Alpine पर:

```bash
apk add coreutils findutils bash
```

`realpath` सबसे अहम है — यही [संरक्षित-पथ जाँच](./reference/protected-paths.md) को सिमलिंक से सुरक्षित बनाता है। देखें [डिस्ट्रो समर्थन](./distro-support.md#minimal-containers)।

## cron प्रविष्टि चलती है पर कुछ नहीं करती {#cron-entry-runs-but-does-nothing}

**जाँच।**

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

**कारण।** cron लॉग में `command not found` का मतलब है कि cron का छोटा `PATH` (`/usr/bin:/bin`) आपका इंस्टॉल नहीं देख पाता। यह cron की सबसे आम समस्या है।

**हल।** crontab में पूरा पथ लिखें:

```bash
crontab -e
# बदलें:  0 3 * * 0 linux-cleanup --all-safe -y …
# ऐसे:  0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y …
```

सही पथ `command -v linux-cleanup` से पता करें। या crontab के सबसे ऊपर एक `PATH=` पंक्ति लिखें। देखें [एलियास और cron](./guides/alias-and-cron.md)।

## $HOME is not set {#home-is-not-set}

```text
✗ $HOME is not set
```

**कारण।** ऐसे माहौल में चलाना जो `$HOME` सेट नहीं करता — कुछ Docker इमेज, कुछ CI रनर।

**हल।**

```bash
HOME=/root linux-cleanup --scan
```

या सत्र के लिए एक बार एक्सपोर्ट कर दें। स्क्रिप्ट अनुमान लगाने के बजाय जानबूझकर रुक जाती है: गलत `$HOME` का मतलब है कि हर पथ जाँच गलत ढाँचे पर होगी।

## स्कैन या --node-modules अटका हुआ लगता है {#scan-or---node-modules-seems-to-hang}

**कारण।** `find` `$HOME` के नीचे हज़ारों फ़ोल्डरों से गुज़र रहा है। घूमने वाली डिस्क पर पहला रन एक से तीन मिनट लेता है।

**जाँच।** टर्मिनल के बजाय लॉग देखें:

```bash
tail -f ~/.linux-cleanup/logs/cleanup-*.log
```

हर पाँच से दस सेकंड में नई पंक्ति आए, तो यह काम कर रहा है।

**हल।** पहले रन पर धैर्य रखें; बाद के रन फ़ोल्डर मेटाडेटा कैश होने से तेज़ होते हैं। अगर वही पथ लगातार पाँच मिनट से ज़्यादा अटकता है, तो सिमलिंक लूप या किसी जवाब न देने वाले नेटवर्क या FUSE माउंट पर शक करें — और [रिपोर्ट करें](./guides/send-a-bug-report.md)।

## सत्र के दौरान डिस्क का उपयोग बढ़ गया {#disk-usage-grew-during-the-session}

**कारण।** बताई गई बचत पूरी मशीन का `df` अंतर है। किसी दूसरी प्रक्रिया — बिल्ड, पैकेज अपडेट, जर्नल रोटेशन, IDE की री-इंडेक्सिंग — ने आपके सत्र के दौरान सफ़ाई से बची जगह से ज़्यादा लिख दिया।

**यह बग नहीं है**, और इसका मतलब यह नहीं कि सफ़ाई विफल हुई। देखें कि चरणों ने ख़ुद क्या बताया:

```bash
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

**हल।** असली तस्वीर देखने के लिए मशीन शांत होने पर `--scan` फिर चलाएँ।

## --system के बाद apt update विफल होता है {#apt-update-fails-after---system}

**कारण।** कम होता है। `apt clean` से `apt update` नहीं टूटता, पर सफ़ाई किसी दूसरे apt काम से टकरा सकती है जिसने लॉक पकड़ रखा हो।

**जाँच।**

```bash
sudo apt update 2>&1 | tail -20
```

**हल।**

```bash
sudo rm -f /var/lib/apt/lists/lock /var/cache/apt/archives/lock /var/lib/dpkg/lock-frontend
sudo apt update
```

यह तभी करें जब सच में कोई apt प्रक्रिया न चल रही हो — पहले `ps aux | grep -i apt` चलाएँ।

## VS Code एक्सटेंशन ग़ायब बताता है {#vs-code-reports-a-missing-extension}

**कारण।** आम तौर पर सही व्यवहार: एक पुराना संस्करण हटाया गया जबकि एडिटर में उसका संदर्भ अब भी था।

**हल।** विंडो फिर लोड करें — `Ctrl+Shift+P` → **Developer: Reload Window**।

**जाँचें** कि मौजूदा संस्करण अब भी है:

```bash
ls ~/.vscode/extensions/ | grep <extension-name>
```

अगर *मौजूदा* संस्करण सच में चला गया, तो यह सबसे नए संस्करण की पहचान में बग है। फिर इंस्टॉल करें और [रिपोर्ट करें](./guides/send-a-bug-report.md):

```bash
code --install-extension <publisher>.<name>
```

## क्रैश बंडल बना पर मुझे क्रैश नहीं दिखा {#a-crash-bundle-appeared-but-i-saw-no-crash}

**कारण।** स्क्रिप्ट किसी अनपेक्षित जगह से गैर-शून्य कोड के साथ निकली — बैकग्राउंड में चल रहे `find` को OOM killer ने रोका, या पाइप टूटा।

**हल।** बंडल के मैनिफ़ेस्ट में एग्ज़िट कोड पढ़ें:

```bash
tar -xzOf ~/.linux-cleanup/feedback/crash-*.tar.gz --wildcards '*MANIFEST*'
```

`137` OOM killer है, `141` SIGPIPE, `139` सेगफ़ॉल्ट। देखें [एग्ज़िट कोड](./reference/exit-codes.md)। इनमें से कोई भी रिपोर्ट करने लायक है।

## --install-alias के बाद एलियास cleanup नहीं मिलता {#alias-cleanup-not-found-after---install-alias}

**कारण।** शेल की rc फ़ाइल दोबारा नहीं पढ़ी गई।

**हल।**

```bash
source ~/.bashrc      # या ~/.zshrc
```

या नया टर्मिनल खोलें।

## गलत संस्करण चल रहा है {#wrong-version-running}

**जाँच।**

```bash
command -v linux-cleanup
linux-cleanup --version
```

**कारण।** पुराना ग्लोबल इंस्टॉल नए `npx` कैश को ढक रहा है, या शेल का कमांड हैश पुराना है।

**हल।**

```bash
npm uninstall -g linux-cleanup
npm install -g linux-cleanup@latest
hash -r
linux-cleanup --version
```

मौजूदा प्रकाशित संस्करण के लिए [npm पैकेज](https://www.npmjs.com/package/linux-cleanup) देखें। आपकी इंस्टॉल की गई प्रति के बाद के बदलावों के लिए [बदलाव सूची](./changelog.md) देखें।

## अब भी अटके हैं {#still-stuck}

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

बंडल देखें, फिर अपेक्षित और असल नतीजे के छोटे विवरण के साथ ईमेल करें। देखें [बग रिपोर्ट भेजें](./guides/send-a-bug-report.md)।
