import { DataMapper } from '@aws/dynamodb-data-mapper';
import DynamoDB from 'aws-sdk/clients/dynamodb';

import Account from './account';

export default class Commands {
  private mapper: DataMapper;

  private static help = `
  \`\`\`
  ### Add a new OTP account. 
  add <name> <secret>
  
  ### List all OTP accounts.
  list
  ls
  
  ### Generate OTP.
  generate <name>
  gen      <name>
  
  ### Remove the OTP account.
  remove <name>
  rm     <name>
  \`\`\`
  
  For further information, visit https://github.com/hellodhlyn/otpbot.
  `;

  constructor() {
    this.mapper = new DataMapper({
      client: new DynamoDB({ region: 'ap-northeast-2' }),
      tableNamePrefix: `otpbot_${process.env.NODE_ENV || 'development'}_`,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  public async hello(): Promise<string> {
    return `
    Hi! If this is your first visit, I recommend you to turn on the message auto-delete in the chat setting.
    ${Commands.help} 
    `.replace(/^ +/gm, '');
  }

  public async add(userId: string, name: string, secret: string): Promise<string> {
    const account = Object.assign(new Account(), { userId, name, secret });
    await this.mapper.put<Account>(account);

    return `
    Account '*${name}*' has added!
    To generate your one-time password, send me: \`generate ${name}\`
    `.replace(/^ +/gm, '');
  }

  public async list(userId: string): Promise<string> {
    const names = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const item of this.mapper.query<Account>(Account, { userId })) {
      names.push(item.name);
    }

    return `
    Your accounts:
    
    ${names.map((name) => `* ${name}`).join('\n')}
    
    To generate your one-time password, send me \`generate <name>\`
    `.replace(/^ +/gm, '');
  }

  public async remove(userId: string, name: string): Promise<string> {
    const account = Object.assign(new Account(), { userId, name });
    await this.mapper.delete<Account>(account);

    return `Account '*${name}*' has deleted.`;
  }
}
