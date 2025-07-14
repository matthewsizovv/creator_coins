# Zora Sniper Bot (Node.js)

## 📌 Что делает бот

- Отслеживает новые Creator Coins на Zora
- Проверяет соцсети создателя (Twitter, Farcaster)
- Отправляет уведомление в Telegram
- Логирует каждый найденный токен в консоль

## ⚙️ Установка

```bash
git clone <repo>
cd zora_sniper_bot
npm install
```

## 🔐 Настройка

Создай `.env` файл и заполни:

```env
TELEGRAM_TOKEN=токен_бота
TELEGRAM_CHAT_ID=ID чата
ZORA_API_KEY=токен Zora API
```

## 🚀 Запуск

```bash
npm start
```

## 🔁 Поведение

- Проверка каждые 15 секунд
- Новые токены отправляются в Telegram
- Повторные не обрабатываются (кешируются)

## 📓 Пример вывода

```
[2025-07-14T12:00:00.000Z] Найден новый токен: Banana Coin
🤖 Zora Sniper запущен...
```

## 📦 Зависимости

- @zoralabs/coins-sdk
- node-telegram-bot-api
- dotenv
