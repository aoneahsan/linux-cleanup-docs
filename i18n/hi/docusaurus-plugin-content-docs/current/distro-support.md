---
title: डिस्ट्रो समर्थन
description: linux-cleanup हर Linux वितरण पर क्या करता है — कैश सफ़ाई हर जगह काम करती है, पर sudo वाला --system मोड केवल Debian और Ubuntu के लिए है।
sidebar_position: 90
---

# डिस्ट्रो समर्थन

**होम कैश सफ़ाई उन Linux वितरणों के लिए बनी है जिनमें ज़रूरी GNU टूल हैं।**
[`--system`](./modes/system-cleanup.md) Debian और Ubuntu के पैकेज कमांड इस्तेमाल करता है। सफ़ाई से पहले `--self-test` से इंस्टॉल टूल जाँचें।

## सारांश {#the-summary}

| डिस्ट्रो परिवार | `$HOME` कैश सफ़ाई | `--system` |
|---|---|---|
| Debian, Ubuntu, Mint, Pop!\_OS | पूरा | **पूरा** |
| Fedora, RHEL, Rocky, Alma | ज़रूरी टूल के साथ | इस्तेमाल न करें: apt चरण विफल होते हैं |
| Arch, Manjaro, EndeavourOS | ज़रूरी टूल के साथ | इस्तेमाल न करें: apt चरण विफल होते हैं |
| openSUSE | ज़रूरी टूल के साथ | इस्तेमाल न करें: apt चरण विफल होते हैं |
| Alpine, न्यूनतम कंटेनर | Bash और GNU टूल चाहिए | इस्तेमाल न करें: apt चरण विफल होते हैं |
| WSL | ज़रूरी टूल के साथ | केवल Debian/Ubuntu; पहले माउंट किए पथ जाँचें |

:::warning `--system` डिस्ट्रो नहीं पहचानता
apt चरण सीधे `apt` और `dpkg` चलाते हैं, न `command -v` जाँच है, न `dnf`, `pacman` या `zypper` पर लौटना। गैर-Debian सिस्टम पर हर चरण "command not found" से विफल होता है।

apt विफल होने के बाद मोड रुकता नहीं: बाद के चरण फिर भी चल सकते हैं। दूसरे वितरणों पर इससे बचें।

इस टूल के कुछ विवरण `--system` के लिए कई डिस्ट्रो का क्रमिक समर्थन बताते हैं, जिसमें `apt` की जगह `dnf` और Arch पर `paccache` हो। **ऐसा कोई कोड मौजूद नहीं है।** किसी क्लोन पर `grep -rn 'dnf\|pacman\|zypper' modules/system_sudo.sh` से जाँचें — यह कुछ नहीं लौटाता।
:::

## चरण दर चरण {#step-by-step}

| `--system` चरण | Debian/Ubuntu | Fedora/RHEL | Arch | openSUSE |
|---|---|---|---|---|
| `apt autoremove` + `apt clean` | काम करता है | **विफल** | **विफल** | **विफल** |
| `journalctl --vacuum-size=100M` | काम करता है | काम करता है | काम करता है | काम करता है |
| बंद किए snap संशोधन | काम करता है | अगर snap इंस्टॉल है | अगर snap इंस्टॉल है | अगर snap इंस्टॉल है |
| कर्नेल सूची (`dpkg --list`) | काम करता है | चुप — कुछ नहीं छापता | चुप | चुप |
| 7 दिन से पुरानी `/tmp` फ़ाइलें | काम करता है | काम करता है | काम करता है | काम करता है |
| पेज कैश ख़ाली करना | काम करता है | काम करता है | काम करता है | काम करता है |

जर्नल, `/tmp` और पेज कैश वाले चरण `journalctl`, `find` और `sysctl` पर चलते हैं, जो systemd वाली हर जगह एक जैसे व्यवहार करते हैं। कर्नेल चरण वैसे भी केवल सूची बनाता है, इसलिए गैर-dpkg सिस्टम पर उसके विफल होने से कुछ नहीं बिगड़ता।

## पैकेज वाला हिस्सा खुद करना {#doing-the-package-part-yourself}

गैर-Debian सिस्टम पर उसके पैकेज मैनेजर की अपनी रखरखाव सलाह मानें। नीचे के कमांड उदाहरण हैं, चलाने से पहले पढ़ें:

```bash
# Fedora / RHEL / Rocky
sudo dnf autoremove
sudo dnf clean all

# Arch / Manjaro  (paccache, pacman-contrib में है)
sudo pacman -Rns "$(pacman -Qtdq)"    # अनाथ पैकेज, अगर हों
sudo paccache -r                       # आख़िरी 3 संस्करण रखता है
sudo pacman -Scc                       # पूरा पैकेज कैश ख़ाली करता है

# openSUSE
sudo zypper clean --all
sudo zypper packages --orphaned
```

होम कैश के लिए, देखें कि linux-cleanup क्या पाता है:

```bash
linux-cleanup --scan
linux-cleanup --all-safe --dry-run
```

## होम कैश के लक्ष्य {#home-cache-targets}

होम के पथ वितरण से नहीं, इंस्टॉल टूल से आते हैं। हर मशीन पर उपलब्धता अलग है:

- पैकेज मैनेजर कैश — yarn, npm, pnpm, pip, composer, bun, deno
- ब्राउज़र कैश — Chrome, Firefox, Brave, Chromium, Edge, Vivaldi
- बिल्ड टूल कैश — Gradle, Cypress, Playwright, TypeScript
- डेवलपर टूल डेटा — Android AVD, Flutter pub-cache, Dart, flatpak
- एडिटर एक्सटेंशन — VS Code, Cursor
- `node_modules`, अधूरे डाउनलोड, पुरानी निजी फ़ाइलें
- स्कैन, जाँच, सुरक्षा जाँच और स्थानीय लॉग

## न्यूनतम कंटेनर {#minimal-containers}

Alpine और दूसरी न्यूनतम इमेज में आम तौर पर GNU coreutils के बजाय BusyBox होता है। टूल को GNU `find`, `du`, `stat` और ख़ास तौर पर `realpath` चाहिए — यही [संरक्षित पथ जाँच](./reference/protected-paths.md) से पहले सिमलिंक सुलझाता है।

```bash
apk add coreutils findutils bash
linux-cleanup --self-test
```

`--self-test` पहली ग़ायब निर्भरता का नाम बताता है। जब तक यह पास न हो, हटाने वाले मोड न चलाएँ।

## WSL {#wsl}

टूल Linux वातावरण में चलता है। इसकी पथ रक्षा सिमलिंक सुलझाती है, पर Windows के निजी फ़ोल्डरों को संरक्षित Linux फ़ोल्डर नहीं मानती। अगर आपके होम फ़ोल्डर या कैश `/mnt/` में जाते हैं, तो स्कैन और ड्राई रन ध्यान से देखें।

## macOS {#macos}

समर्थित नहीं। npm पैकेज `"os": ["linux"]` घोषित करता है और इंस्टॉल से मना कर देगा। पथ, `find` फ़्लैग और पैकेज मैनेजर सब अलग हैं।

## आगे {#next}

- [सिस्टम सफ़ाई](./modes/system-cleanup.md) — वह मोड जिसकी शर्तें यह पेज बताता है
- [ज़रूरतें](./getting-started/requirements.md)
