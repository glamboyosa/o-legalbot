import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import client from "./utils";

async function initializeTelegramClient() {
 
  await client.start({
    phoneNumber: async () =>  Bun.env.PHONE_NUMBER as string,
    password: async () =>  prompt('Please enter your password: ') as string,
    phoneCode: async () =>  prompt('Please enter the code you received: ') as string,
    onError: (err) => console.log(err),
  });

  console.log("Successfully logged in!");
  console.log(`Your session string: ${client.session.save()}`);

  
  return client;
}

export const telegramClient = await initializeTelegramClient();

console.log("Hola from Bun w/ Trigger.dev");