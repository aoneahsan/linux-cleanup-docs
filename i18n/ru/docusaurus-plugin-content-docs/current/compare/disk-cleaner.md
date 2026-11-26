---
sidebar_position: 9
title: linux-cleanup и Disk Cleaner
description: "Чем отличаются linux-cleanup и Disk Cleaner, по их собственным страницам, проверено 2026-11-22."
---

# linux-cleanup и Disk Cleaner

*Проверено 2026-11-22 по <a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">странице Disk Cleaner</a>.*

**Что это:** GTK-очиститель для Linux с визуализацией диска и предлагаемыми задачами очистки.

**Цена у них:** На проверенных страницах не указано. **Цена здесь:** Командная строка бесплатна по лицензии MIT. Тарифы настольного приложения — на [странице цен](https://linux-cleanup.aoneahsan.com/ru/pricing).

| | linux-cleanup | Disk Cleaner |
|---|---|---|
| Интерфейс командной строки | Да | Да (<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">источник</a>) |
| Предпросмотр перед удалением | Да | На проверенных страницах не указано |
| Пробный запуск | Да | Да (<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">источник</a>) |
| Очистка кэша | Да | Да (<a href="https://github.com/codechu/disk-cleaner" target="_blank" rel="noopener noreferrer nofollow">источник</a>) |
| Поиск дубликатов | Частично | На проверенных страницах не указано |

## Кому лучше подходит Disk Cleaner {#who-is-better-served-by-disk-cleaner}

Выбирайте Disk Cleaner, если нужно интерактивное представление в виде карты-дерева или sunburst-диаграммы.

## В чём впереди linux-cleanup {#where-linux-cleanup-is-ahead}

Выбирайте linux-cleanup, если хотите, чтобы инструмент по правилам решал, какой кэш превысил порог простоя, а не выбирать вручную по графику.

## С чего начать здесь {#where-to-start-here}

Импорта из одного инструмента в другой нет: у каждого свои правила. Чтобы увидеть, что linux-cleanup сделает на вашем компьютере, начните с раздела [Предпросмотр перед удалением](../safety/preview-first.md) и выполните `npx -y linux-cleanup --all-safe --yes --dry-run` — эта команда ничего не удаляет.
