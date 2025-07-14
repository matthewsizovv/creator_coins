import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { setApiKey, getCoinsNew } from "@zoralabs/coins-sdk";
import TelegramBot from "node-telegram-bot-api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logFile = path.join(logDir, "zora_sniper.log");
const csvFile = path.join(logDir, "tokens.csv");
const seenFile = path.join(logDir, "seen_creators.json");

setApiKey(process.env.ZORA_API_KEY);

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

let seenAddresses = new Set();

// Load seen addresses from file
if (fs.existsSync(seenFile)) {
  try {
    const loaded = JSON.parse(fs.readFileSync(seenFile, "utf8"));
    seenAddresses = new Set(loaded);
  } catch (e) {
    console.error("Ошибка загрузки seen_creators.json:", e.message);
  }
}

let stats = { total: 0, sent: 0, skipped: 0 };

if (!fs.existsSync(csvFile)) {
  fs.writeFileSync(csvFile, "date,name,tokenAddress,creatorAddress,twitterFollowers\n", "utf8");
}

function formatDate(iso) {
  const date = new Date(iso);
  return date.toLocaleString("ru-RU", { timeZone: "UTC" }) + " UTC";
}

function log(text) {
  const line = `[${new Date().toISOString()}] ${text}`;
  fs.appendFileSync(logFile, line + "\n", "utf8");
  console.log(line);
}

async function checkNewCoins() {
  try {
    const result = await getCoinsNew({ count: 5 });

    for (const coin of result.data.exploreList.edges) {
      stats.total++;

      const token = coin.node;
      const creatorAddr = token.creator?.address;
      if (!creatorAddr || seenAddresses.has(creatorAddr)) continue;

      seenAddresses.add(creatorAddr);
      fs.writeFileSync(seenFile, JSON.stringify(Array.from(seenAddresses)), "utf8");

      const name = token.name;
      const tokenAddr = token.tokenAddress;
      const url = `https://zora.co/collect/${token.chain}/0x${tokenAddr}`;
      const createdAt = token.createdAt;
      const twitter = token.creator?.social?.twitter;
      const farcaster = token.creator?.social?.farcaster;

      const twitterFollowers = twitter?.followersCount ?? 0;
      if (!twitterFollowers || twitterFollowers < 250) {
        log(`Пропущен токен ${name}: менее 250 подписчиков`);
        stats.skipped++;
        continue;
      }

      stats.sent++;
      log(`Новая монета: ${name} (${tokenAddr}) от ${creatorAddr}, ${twitterFollowers} подписчиков`);
      fs.appendFileSync(csvFile, `${new Date().toISOString()},${name},${tokenAddr},${creatorAddr},${twitterFollowers}\n`);

      let message = `👤 <b>Новая монета пользователя</b>\n\n`;
      message += `<b>Название:</b> ${name}\n`;
      message += `<b>Дата создания:</b> ${formatDate(createdAt)}\n`;
      message += `<b>Ссылка:</b> <a href=\"${url}\">${url}</a>\n`;

      if (twitter?.handle) {
        const twLink = `https://twitter.com/${twitter.handle}`;
        message += `<b>Twitter:</b> <a href=\"${twLink}\">@${twitter.handle}</a>`;
        message += ` — <i>${twitterFollowers} подписчиков</i>\n`;
      } else {
        message += `<b>Twitter:</b> не указан\n`;
      }

      if (farcaster?.url) {
        message += `<b>Farcaster:</b> <a href=\"${farcaster.url}\">${farcaster.url}</a>`;
        if (farcaster.followersCount !== undefined) {
          message += ` — <i>${farcaster.followersCount} подписчиков</i>`;
        }
        message += `\n`;
      } else {
        message += `<b>Farcaster:</b> не указан\n`;
      }

      await bot.sendMessage(CHAT_ID, message, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
    }

    log(`СТАТИСТИКА: проверено=${stats.total}, отправлено=${stats.sent}, пропущено=${stats.skipped}`);
  } catch (err) {
    log("Ошибка: " + err.message);
  }
}

setInterval(checkNewCoins, 15000);
log("🤖 Zora Sniper запущен...");
