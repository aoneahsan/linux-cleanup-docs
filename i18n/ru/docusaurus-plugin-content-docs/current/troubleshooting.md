---
title: Устранение неполадок
description: "Симптом, причина и решение для проблем, с которыми действительно сталкиваются пользователи linux-cleanup: отказы, отсутствующие зависимости, сбои cron, медленное сканирование и путаница с версиями."
tags: [troubleshooting, errors, fixes, cron, jq, whiptail]
sidebar_position: 92
---

# Устранение неполадок

Симптом → причина → решение. Сначала выполните команду проверки; если совпадает, примените решение.

Если вы потеряли данные, а не столкнулись с ошибкой, перейдите в раздел [Восстановление](./recovery.md).

## REFUSE: protected path {#refuse-protected-path}

```text
✗ REFUSE: protected path: /home/you/Documents/something
```

**Причина.** После раскрытия символических ссылок путь указал на место из [защищённого списка](./reference/protected-paths.md). Список разрешённых путей его заблокировал.

**Это правильное поведение, а не сбой.** Ничего не удалено.

**Решение.** Выясните, что куда указывает:

```bash
linux-cleanup --list-targets
realpath <the path that was rejected>
```

Почти всегда это кэш, связанный символической ссылкой с защищённым каталогом. **Исправьте ссылку, а не инструмент** — он делает ровно то, что должен. Флага для обхода нет, и так задумано.

Два похожих сообщения:

```text
✗ REFUSE: unsafe path: '/home/you'            # сам $HOME или /
✗ REFUSE: shell-init / history file: …        # .bashrc, .zshrc и подобные
```

## TUI mode needs whiptail or dialog {#tui-mode-needs-whiptail-or-dialog}

**Причина.** `--tui` запущен, когда не установлен ни один из них.

**Решение.** Установите один или согласитесь на предложенное меню CLI.

```bash
sudo apt install whiptail     # Debian / Ubuntu
sudo dnf install newt         # Fedora / RHEL
sudo pacman -S libnewt        # Arch
```

**Проверка.** `command -v whiptail`, затем запустите снова. См. [TUI](./modes/tui.md).

## export requires jq {#export-requires-jq}

**Причина.** `--export md`, `--export html` или преобразование в менеджере отчётов без установленного `jq`.

**Решение.**

```bash
sudo apt install jq
```

`jq` нужен только для преобразования. JSON-записи пишутся при каждом запуске и без него. См. [Отчёты](./modes/reports.md).

## command not found {#command-not-found}

**Причина.** Нет обязательной зависимости, или её перекрывает несовместимый псевдоним. Часто бывает в минимальных контейнерах, где вместо GNU coreutils стоит BusyBox.

**Проверка.**

```bash
linux-cleanup --self-test
```

Проверяет каждую обязательную команду и называет первую отсутствующую.

**Решение.** Установите пакеты coreutils, findutils и gawk вашего дистрибутива. В Alpine:

```bash
apk add coreutils findutils bash
```

Главное — `realpath`: именно он делает [проверку защищённых путей](./reference/protected-paths.md) устойчивой к символическим ссылкам. См. [Поддержка дистрибутивов](./distro-support.md#minimal-containers).

## Задание cron запускается, но ничего не делает {#cron-entry-runs-but-does-nothing}

**Проверка.**

```bash
tail -100 ~/.linux-cleanup/logs/cron.log
crontab -l | grep -i cleanup
```

**Причина.** `command not found` в журнале cron означает, что минимальный `PATH` cron (`/usr/bin:/bin`) не видит вашу установку. Это самая частая проблема с cron.

**Решение.** Укажите в crontab абсолютный путь:

```bash
crontab -e
# Было:  0 3 * * 0 linux-cleanup --all-safe -y …
# Стало:  0 3 * * 0 /usr/local/bin/linux-cleanup --all-safe -y …
```

Правильный путь покажет `command -v linux-cleanup`. Можно также добавить строку `PATH=` в начало crontab. См. [Псевдоним и cron](./guides/alias-and-cron.md).

## $HOME is not set {#home-is-not-set}

```text
✗ $HOME is not set
```

**Причина.** Запуск в окружении, где `$HOME` не задан: некоторые образы Docker, некоторые исполнители CI.

**Решение.**

```bash
HOME=/root linux-cleanup --scan
```

Или экспортируйте переменную один раз на сеанс. Скрипт намеренно прерывается, а не угадывает: неверный `$HOME` означал бы, что каждая проверка путей идёт по чужому дереву.

## Сканирование или --node-modules будто зависли {#scan-or---node-modules-seems-to-hang}

**Причина.** `find` обходит тысячи каталогов в `$HOME`. На жёстком диске первый запуск занимает от одной до трёх минут.

**Проверка.** Смотрите в журнал, а не в терминал:

```bash
tail -f ~/.linux-cleanup/logs/cleanup-*.log
```

Если новые строки появляются каждые пять–десять секунд, работа идёт.

**Решение.** Наберитесь терпения при первом запуске; следующие быстрее благодаря кэшированным метаданным каталогов. Если один и тот же путь каждый раз застревает дольше пяти минут, подозревайте петлю символических ссылок или неотвечающее сетевое или FUSE-монтирование — и [сообщите об этом](./guides/send-a-bug-report.md).

## Занятое место на диске выросло за сеанс {#disk-usage-grew-during-the-session}

**Причина.** Показанный объём — это разница `df` по всей машине. Другой процесс (сборка, обновление пакетов, ротация журнала, переиндексация в IDE) записал за сеанс больше, чем освободила очистка.

**Это не ошибка**, и это не значит, что очистка не удалась. Посмотрите, что сообщили сами шаги:

```bash
jq '.steps[] | select(.status == "ran") | {title, freed_bytes}' \
  "$(ls -t ~/.linux-cleanup/reports/report-*.json | head -1)"
```

**Решение.** Запустите `--scan` снова, когда машина будет без нагрузки, чтобы увидеть реальную картину.

## apt update не работает после --system {#apt-update-fails-after---system}

**Причина.** Редко. `apt clean` не ломает `apt update`, но очистка могла совпасть с другой операцией apt, которая держала блокировку.

**Проверка.**

```bash
sudo apt update 2>&1 | tail -20
```

**Решение.**

```bash
sudo rm -f /var/lib/apt/lists/lock /var/cache/apt/archives/lock /var/lib/dpkg/lock-frontend
sudo apt update
```

Делайте это, только если ни один процесс apt действительно не запущен, — сначала `ps aux | grep -i apt`.

## VS Code сообщает об отсутствующем расширении {#vs-code-reports-a-missing-extension}

**Причина.** Обычно это ожидаемо: устаревшую версию удалили, пока редактор ещё на неё ссылался.

**Решение.** Перезагрузите окно — `Ctrl+Shift+P` → **Developer: Reload Window**.

**Проверьте**, что текущая версия на месте:

```bash
ls ~/.vscode/extensions/ | grep <extension-name>
```

Если *текущая* версия действительно пропала, это ошибка в определении самой новой версии. Переустановите расширение и [сообщите об этом](./guides/send-a-bug-report.md):

```bash
code --install-extension <publisher>.<name>
```

## Появился пакет сбоя, но сбоя я не видел {#a-crash-bundle-appeared-but-i-saw-no-crash}

**Причина.** Скрипт завершился с ненулевым кодом в неожиданном месте: фоновый `find` убит OOM killer или оборвался канал.

**Решение.** Прочитайте код выхода в манифесте пакета:

```bash
tar -xzOf ~/.linux-cleanup/feedback/crash-*.tar.gz --wildcards '*MANIFEST*'
```

`137` — OOM killer, `141` — SIGPIPE, `139` — ошибка сегментации. См. [Коды выхода](./reference/exit-codes.md). О любом из них стоит сообщить.

## Псевдоним cleanup не найден после --install-alias {#alias-cleanup-not-found-after---install-alias}

**Причина.** Файл rc оболочки ещё не перечитан.

**Решение.**

```bash
source ~/.bashrc      # или ~/.zshrc
```

Или откройте новый терминал.

## Запускается не та версия {#wrong-version-running}

**Проверка.**

```bash
command -v linux-cleanup
linux-cleanup --version
```

**Причина.** Старая глобальная установка перекрывает более новый кэш `npx`, или устарел кэш команд оболочки.

**Решение.**

```bash
npm uninstall -g linux-cleanup
npm install -g linux-cleanup@latest
hash -r
linux-cleanup --version
```

Текущую опубликованную версию смотрите на странице [пакета npm](https://www.npmjs.com/package/linux-cleanup). Изменения с момента вашей установленной версии — в [списке изменений](./changelog.md).

## Если проблема не решилась {#still-stuck}

```bash
linux-cleanup --debug-bundle
linux-cleanup --feedback
```

Просмотрите пакет и отправьте его по почте с кратким описанием того, что ожидалось и что произошло. См. [Отправить отчёт об ошибке](./guides/send-a-bug-report.md).
