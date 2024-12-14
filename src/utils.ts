import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

const stringSession = new StringSession(Bun.env.TELEGRAM_SESSION_STRING || "");
const apiId = Number(Bun.env.TELEGRAM_API_ID);
const apiHash = Bun.env.TELEGRAM_API_HASH as string;

const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  export default client;