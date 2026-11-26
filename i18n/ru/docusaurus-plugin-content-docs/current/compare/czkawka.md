---
sidebar_position: 10
title: linux-cleanup и Czkawka
description: "Чем отличаются linux-cleanup и Czkawka, по их собственным страницам, проверено 2026-11-22."
---

# linux-cleanup и Czkawka

*Проверено 2026-11-22 по <a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">странице Czkawka</a>.*

**Что это:** Утилита для поиска дубликатов, пустых папок, похожих медиафайлов и прочего мусора.

**Цена у них:** На проверенных страницах не указано. **Цена здесь:** Командная строка бесплатна по лицензии MIT. Тарифы настольного приложения — на [странице цен](https://linux-cleanup.aoneahsan.com/ru/pricing).

| | linux-cleanup | Czkawka |
|---|---|---|
| Интерфейс командной строки | Да | Да (<a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">источник</a>) |
| Предпросмотр перед удалением | Да | На проверенных страницах не указано |
| Пробный запуск | Да | На проверенных страницах не указано |
| Очистка кэша | Да | На проверенных страницах не указано |
| Поиск дубликатов | Частично | Да (<a href="https://github.com/qarmin/czkawka" target="_blank" rel="noopener noreferrer nofollow">источник</a>) |

## Кому лучше подходит Czkawka {#who-is-better-served-by-czkawka}

Выбирайте Czkawka для поиска дублирующихся или похожих личных файлов; linux-cleanup на эту задачу не претендует.

## В чём впереди linux-cleanup {#where-linux-cleanup-is-ahead}

Выбирайте linux-cleanup для кэша, журналов и временных файлов, превысивших порог простоя; страницы самого Czkawka описывают поиск дубликатов и похожих файлов.

## С чего начать здесь {#where-to-start-here}

Импорта из одного инструмента в другой нет: у каждого свои правила. Чтобы увидеть, что linux-cleanup сделает на вашем компьютере, начните с раздела [Предпросмотр перед удалением](../safety/preview-first.md) и выполните `npx -y linux-cleanup --all-safe --yes --dry-run` — эта команда ничего не удаляет.
