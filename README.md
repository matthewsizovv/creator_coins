# 🎯 Zora Sniper Bot

Бот отслеживает создание новых creator coins на [Zora](https://zora.co) и отправляет информацию в Telegram, если выполнены условия (например, число подписчиков в Twitter > 250).

---

## 📦 Возможности

- Подключение к Zora API (через @zoralabs/coins-sdk)
- Проверка числа подписчиков в Twitter
- Уведомление в Telegram (с кликабельными ссылками)
- Сохранение обработанных авторов (creator address)
- Поддержка DRY_RUN (не отправлять сообщения)
- Автоотчёты каждый час
- Логирование: zora_sniper.log, errors.log, tokens.csv

---

## ⚙️ Установка

```bash
git clone https://github.com/yourname/zora-sniper-bot.git
cd zora-sniper-bot/zora_sniper_bot
npm install
```

---

## 🔧 Настройка

Создай файл `.env` на основе `.env.example`

```env
TELEGRAM_TOKEN=ваш_токен
TELEGRAM_CHAT_ID=ваш_chat_id
ZORA_API_KEY=ваш_api_ключ
DEBUG=true
DRY_RUN=false
TWITTER_MIN_FOLLOWERS=250
```

---

## ▶️ Запуск

```bash
npm run prod     # режим продакшн
npm run debug    # включена отладка
npm start        # по умолчанию читает DEBUG из .env
```

---

## 📁 Структура проекта

- `index.js` — логика бота
- `.env.example` — переменные окружения
- `logs/zora_sniper.log` — лог действий
- `logs/errors.log` — лог ошибок
- `logs/tokens.csv` — CSV успешных монет
- `logs/seen_creators.json` — просмотренные авторы

---

## ❓ Полезное

- Получить Telegram chat ID — через @userinfobot
- ZORA_API_KEY не обязателен, но улучшает лимиты
- DRY_RUN=true — для тестов без отправки сообщений
