---
sidebar_position: 7
title: linux-cleanup и TuxCleaner
description: "Чем отличаются linux-cleanup и TuxCleaner, по их собственным страницам, проверено 2026-11-22."
---

# linux-cleanup и TuxCleaner

*Проверено 2026-11-22 по <a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">странице TuxCleaner</a>.*

**Что это:** CLI для Linux: очистка, удаление приложений, анализ диска и состояние системы.

**Цена у них:** На проверенных страницах не указано. **Цена здесь:** Командная строка бесплатна по лицензии MIT. Тарифы настольного приложения — на [странице цен](https://linux-cleanup.aoneahsan.com/ru/pricing).

| | linux-cleanup | TuxCleaner |
|---|---|---|
| Интерфейс командной строки | Да | Да (<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">источник</a>) |
| Предпросмотр перед удалением | Да | Да (<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">источник</a>) |
| Пробный запуск | Да | Да (<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">источник</a>) |
| Очистка кэша | Да | Да (<a href="https://github.com/debba/tuxcleaner" target="_blank" rel="noopener noreferrer nofollow">источник</a>) |
| Поиск дубликатов | Частично | На проверенных страницах не указано |

## Кому лучше подходит TuxCleaner {#who-is-better-served-by-tuxcleaner}

Выбирайте TuxCleaner ради адаптеров пакетов под конкретные дистрибутивы и удаления приложений.

## В чём впереди linux-cleanup {#where-linux-cleanup-is-ahead}

Выбирайте linux-cleanup, если предпочитаете запускать Bash-скрипт через npx без сборки и сохранить правила «только после простоя» для целых каталогов Gradle и Android Studio.

## С чего начать здесь {#where-to-start-here}

Импорта из одного инструмента в другой нет: у каждого свои правила. Чтобы увидеть, что linux-cleanup сделает на вашем компьютере, начните с раздела [Предпросмотр перед удалением](../safety/preview-first.md) и выполните `npx -y linux-cleanup --all-safe --yes --dry-run` — эта команда ничего не удаляет.
