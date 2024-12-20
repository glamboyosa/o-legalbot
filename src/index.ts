import client from "./utils";

async function initializeTelegramClient() {
  // comment all this out since we have session string
  //   await client.start({
  //     phoneNumber: async () =>  Bun.env.PHONE_NUMBER as string,
  //     phoneCode: async () =>  prompt('Please enter the code you received: ') as string,
  //     onError: (err) => console.log(err),
  //   });

  //   console.log("Successfully logged in!");
  //   console.log(`Your session string: ${client.session.save()}`);
  
  return client;
}

export const telegramClient = await initializeTelegramClient();

const server = Bun.serve({
  port: 3000,
  fetch(request) {
    return new Response("Welcome to Bun!");
  },
});

console.log(`Listening on localhost:${server.port}`);