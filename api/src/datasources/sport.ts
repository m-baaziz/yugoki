/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { Sport, SportPageInfo } from '../generated/graphql';
import { parseSport } from '../utils/sport';

const TABLE_NAME = 'Sport';

export default class SportAPI extends DataSource {
  dynamodbClient: DynamoDBClient;
  context: any;

  constructor(dynamodbClient: DynamoDBClient) {
    super();
    this.dynamodbClient = dynamodbClient;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async findSportById(id: string): Promise<Sport> {
    try {
      const result = await this.dynamodbClient.send(
        new GetItemCommand({
          TableName: TABLE_NAME,
          Key: { SportId: { S: id } },
        }),
      );
      const item = result.Item;
      if (!item) {
        return Promise.reject(`Sport with id ${id} not found`);
      }
      return Promise.resolve(parseSport(item));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listSports(first: number, after?: string): Promise<SportPageInfo> {
    try {
      const result = await this.dynamodbClient.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          Limit: first,
          ExclusiveStartKey: after ? { SportId: { S: after } } : undefined,
        }),
      );
      const pageInfo: SportPageInfo = {
        sports: result.Items.map(parseSport),
        endCursor: result.LastEvaluatedKey?.SportId.S,
        hasNextPage: result.LastEvaluatedKey !== undefined,
      };
      return Promise.resolve(pageInfo);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
