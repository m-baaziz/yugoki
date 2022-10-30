/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
  PutItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { Sport, SportInput, SportPageInfo } from '../generated/graphql';
import { parseSport, sportToRecord } from '../utils/sport';
import { parseCursor, serializeKey } from './helpers';

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
      const cursor = parseCursor(after);
      const result = await this.dynamodbClient.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          Limit: first,
          ExclusiveStartKey:
            cursor.length > 0 ? { SportId: { S: cursor[0] } } : undefined,
        }),
      );
      const endCursor = result.LastEvaluatedKey
        ? serializeKey([result.LastEvaluatedKey.SportId.S])
        : undefined;
      const pageInfo: SportPageInfo = {
        sports: result.Items.map(parseSport),
        endCursor,
        hasNextPage: result.LastEvaluatedKey !== undefined,
      };
      return Promise.resolve(pageInfo);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async createSport(input: SportInput): Promise<Sport> {
    try {
      const id = uuidv4();
      const item: Sport = {
        id,
        title: input.title,
        description: input.description,
        tags: input.tags,
      };
      await this.dynamodbClient.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          ConditionExpression: 'attribute_not_exists(#id)',
          ExpressionAttributeNames: {
            '#id': 'SportId',
          },
          Item: {
            ...sportToRecord(item),
          },
        }),
      );
      return Promise.resolve(item);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteSport(id: string): Promise<boolean> {
    try {
      await this.dynamodbClient.send(
        new DeleteItemCommand({
          TableName: TABLE_NAME,
          Key: { SportId: { S: id } },
        }),
      );
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
