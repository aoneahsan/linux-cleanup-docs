---
sidebar_position: 2
title: linux-cleanup и BleachBit
description: "Чем отличаются linux-cleanup и BleachBit, по их собственным страницам, проверено 2026-11-22."
---

# linux-cleanup и BleachBit

*Проверено 2026-11-22 по <a href="https://www.bleachbit.org/features" target="_blank" rel="noopener noreferrer nofollow">странице BleachBit</a>.*

**Что это:** Открытый очиститель для места на диске и приватности, с графическим предпросмотром и CLI.

**Цена у них:** Бесплатно (<a href="https://www.bleachbit.org/features" target="_blank" rel="noopener noreferrer nofollow">источник</a>, проверено 2026-11-22). **Цена здесь:** Командная строка бесплатна по лицензии MIT. Тарифы настольного приложения — на [странице цен](https://linux-cleanup.aoneahsan.com/ru/pricing).

| | linux-cleanup | BleachBit |
|---|---|---|
| Интерфейс командной строки | Да | Да (<a href="https://www.bleachbit.org/features" target="_blank" rel="noopener noreferrer nofollow">источник</a>) |
| Предпросмотр перед удалением | Да | Да (<a href="https://www.bleachbit.org/features" target="_blank" rel="noopener noreferrer nofollow">источник</a>) |
| Пробный запуск | Да | На проверенных страницах не указано |
| Очистка кэша | Да | На проверенных страницах не указано |
| Поиск дубликатов | Частично | На проверенных страницах не указано |

## Кому лучше подходит BleachBit {#who-is-better-served-by-bleachbit}

Выбирайте BleachBit ради графического очистителя, стирания личных следов и поддержки Linux и Windows.

## В чём впереди linux-cleanup {#where-linux-cleanup-is-ahead}

Выбирайте linux-cleanup для кэша разработки, который он удаляет только после простоя, — например хранилищ Gradle, Playwright и pnpm, — с каждым отклонённым путём в списке пробного запуска.

## С чего начать здесь {#where-to-start-here}

Импорта из одного инструмента в другой нет: у каждого свои правила. Чтобы увидеть, что linux-cleanup сделает на вашем компьютере, начните с раздела [Предпросмотр перед удалением](../safety/preview-first.md) и выполните `npx -y linux-cleanup --all-safe --yes --dry-run` — эта команда ничего не удаляет.
