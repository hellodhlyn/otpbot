import {
  attribute, hashKey, rangeKey, table,
} from '@aws/dynamodb-data-mapper-annotations';

@table('accounts')
export default class Account {
  @hashKey()
  public userId: string;

  @rangeKey()
  public name: string;

  @attribute()
  public secret: string;
}
