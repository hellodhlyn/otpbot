import OtpBot from './bot';
import Commands from './commands';

async function main(): Promise<void> {
  const bot = new OtpBot();
  try {
    await bot.init();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  const executor = new Commands();

  bot.onTextMessage(async (body, msg) => {
    let reply: string;
    const explode = false;
    const commands = body.split(' ');
    switch (commands[0]) {
      // add <name> <secret>
      case 'add':
        if (commands.length !== 3) {
          reply = await executor.hello();
          break;
        }
        reply = await executor.add(msg.sender.uid, commands[1], commands[2]);
        break;

      // list
      case 'list':
      case 'ls':
        reply = await executor.list(msg.sender.uid);
        break;

      // remove <name>
      case 'remove':
      case 'rm':
        if (commands.length !== 2) {
          reply = await executor.hello();
          break;
        }
        reply = await executor.remove(msg.sender.uid, commands[1]);
        break;

      case 'hello':
      default:
        reply = await executor.hello();
    }

    await bot.sendMessage(msg.channel, reply, explode ? 30 : 0);
  });

  process.on('SIGINT', async () => { await bot.shutdown(); });
  process.on('SIGTERM', async () => { await bot.shutdown(); });

  await bot.start();
}

(async () => { await main(); })();
