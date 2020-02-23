import Bot from 'keybase-bot';
import { ChatChannel, MsgSummary } from 'keybase-bot/lib/types/chat1';

type TextMessageCallback = (msgBody: string, msg?: MsgSummary) => void;

export default class OtpBot {
  private bot: Bot;

  private textMessageCallback: TextMessageCallback;

  public async init(): Promise<void> {
    const bot = new Bot();
    const username = process.env.BOT_USERNAME;
    const paperKey = process.env.BOT_PAPER_KEY;

    await bot.init(username, paperKey, { verbose: process.env.NODE_ENV !== 'production' });

    this.bot = bot;
  }

  public async start(): Promise<void> {
    await this.bot.chat.watchAllChannelsForNewMessages(
      (msg) => this.handleMessage(msg),
      (err) => this.handleError(err),
    );
  }

  public async shutdown(): Promise<void> {
    await this.bot.deinit();
  }

  public async sendMessage(channel: ChatChannel, body: string, explosionTimeout?: number): Promise<void> {
    const sentMessage = await this.bot.chat.send(channel, { body });
    if (explosionTimeout && explosionTimeout > 0) {
      setTimeout(async () => {
        await this.bot.chat.delete(channel, sentMessage.id);
      }, explosionTimeout * 1000);
    }
  }

  public onTextMessage(callback: TextMessageCallback): void {
    this.textMessageCallback = callback;
  }

  private async handleMessage(message: MsgSummary): Promise<void> {
    const body = message.content?.text?.body;
    if (!body || !this.textMessageCallback) {
      return;
    }

    this.textMessageCallback(body, message);
  }

  // eslint-disable-next-line class-methods-use-this
  private async handleError(err: Error): Promise<void> {
    console.error(err);
    process.exit(1);
  }
}
