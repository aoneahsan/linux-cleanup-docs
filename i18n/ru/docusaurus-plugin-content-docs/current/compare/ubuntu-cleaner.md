---
sidebar_position: 8
title: linux-cleanup и Ubuntu Cleaner
description: "Чем отличаются linux-cleanup и Ubuntu Cleaner, по их собственным страницам, проверено 2026-11-22."
---

# linux-cleanup и Ubuntu Cleaner

*Проверено 2026-11-22 по <a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">странице Ubuntu Cleaner</a>.*

**Что это:** Bash-очиститель для Ubuntu, Debian и Linux Mint с обслуживанием пакетов и кэша разработки.

**Цена у них:** На проверенных страницах не указано. **Цена здесь:** Командная строка бесплатна по лицензии MIT. Тарифы настольного приложения — на [странице цен](https://linux-cleanup.aoneahsan.com/ru/pricing).

| | linux-cleanup | Ubuntu Cleaner |
|---|---|---|
| Интерфейс командной строки | Да | Да (<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">источник</a>) |
| Предпросмотр перед удалением | Да | Да (<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">источник</a>) |
| Пробный запуск | Да | Да (<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">источник</a>) |
| Очистка кэша | Да | Да (<a href="https://github.com/basantmandal/ubuntu-cleaner" target="_blank" rel="noopener noreferrer nofollow">источник</a>) |
| Поиск дубликатов | Частично | На проверенных страницах не указано |

## Кому лучше подходит Ubuntu Cleaner {#who-is-better-served-by-ubuntu-cleaner}

Выбирайте Ubuntu Cleaner ради ориентации на семейство Debian и обслуживания Docker.

## В чём впереди linux-cleanup {#where-linux-cleanup-is-ahead}

Выбирайте linux-cleanup, если хотите, чтобы очистка шла от вашего обычного пользователя, а системные пакеты оставались отдельному явному режиму --system.

## С чего начать здесь {#where-to-start-here}

Импорта из одного инструмента в другой нет: у каждого свои правила. Чтобы увидеть, что linux-cleanup сделает на вашем компьютере, начните с раздела [Предпросмотр перед удалением](../safety/preview-first.md) и выполните `npx -y linux-cleanup --all-safe --yes --dry-run` — эта команда ничего не удаляет.
