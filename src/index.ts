import OtpBot from './bot';

async function main(): Promise<void> {
  const bot = new OtpBot();
  try {
    await bot.init();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  bot.onTextMessage(async (body, msg) => {
    await bot.sendExplodingMessage(msg.channel, `Hi! You sent me:\n\n${body}`);
  });

  process.on('SIGINT', async () => { await bot.shutdown(); });
  process.on('SIGTERM', async () => { await bot.shutdown(); });

  await bot.start();
}

(async () => { await main(); })();
