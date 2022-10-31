/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  PutItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { SiteChatMessage, SiteChatMessagePageInfo } from '../generated/graphql';
import { parseCursor, serializeKey } from './helpers';
import {
  parseSiteChatMessage,
  siteChatMessageToRecord,
} from '../utils/siteChatMessage';

const TABLE_NAME = 'SiteChat';
const MESSAGE_INDEX_NAME = 'MessageIndex';

const sk1 = (roomId: string, messageId: string) =>
  `ROOM#${roomId}#MESSAGE#${messageId}`;
const sk3 = (messageDate: string, messageId: string) =>
  `MESSAGEDATE#${messageDate}#MESSAGEID#${messageId}`;

export default class SiteChatMessageAPI extends DataSource {
  dynamodbClient: DynamoDBClient;
  context: any;

  constructor(dynamodbClient: DynamoDBClient) {
    super();
    this.dynamodbClient = dynamodbClient;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async findSiteChatMessageById(
    roomId: string,
    id: string,
  ): Promise<SiteChatMessage> {
    try {
      const result = await this.dynamodbClient.send(
        new GetItemCommand({
          TableName: TABLE_NAME,
          Key: { RoomId: { S: id }, Sk1: { S: sk1(roomId, id) } },
        }),
      );
      const item = result.Item;
      if (!item) {
        return Promise.reject(`Site chat message with id ${id} not found`);
      }
      return Promise.resolve(parseSiteChatMessage(item));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listSiteChatMessages(
    roomId: string,
    first: number,
    after?: string,
  ): Promise<SiteChatMessagePageInfo> {
    try {
      const cursor = parseCursor(after);
      const result = await this.dynamodbClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: MESSAGE_INDEX_NAME,
          KeyConditionExpression: '#roomId = :roomId',
          ExpressionAttributeNames: {
            '#roomId': 'RoomId',
          },
          ExpressionAttributeValues: {
            ':roomId': { S: roomId },
          },
          ScanIndexForward: false,
          Limit: first,
          ExclusiveStartKey:
            cursor.length > 2
              ? {
                  RoomId: { S: cursor[0] },
                  Sk1: { S: cursor[1] },
                  Sk3: { S: cursor[2] },
                }
              : undefined,
        }),
      );
      const endCursor = result.LastEvaluatedKey
        ? serializeKey([
            result.LastEvaluatedKey.RoomId.S,
            result.LastEvaluatedKey.Sk1.S,
            result.LastEvaluatedKey.Sk3.S,
          ])
        : undefined;
      const pageInfo: SiteChatMessagePageInfo = {
        siteChatMessages: result.Items.map(parseSiteChatMessage),
        endCursor,
        hasNextPage: result.LastEvaluatedKey !== undefined,
      };
      return Promise.resolve(pageInfo);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async createSiteChatMessage(
    roomId: string,
    userId: string,
    text: string,
  ): Promise<SiteChatMessage> {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();
      const item: SiteChatMessage = {
        id,
        room: roomId,
        from: userId,
        text,
        dateRFC3339: now,
      };
      await this.dynamodbClient.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          ConditionExpression: 'attribute_not_exists(#id)',
          ExpressionAttributeNames: {
            '#id': 'RoomId',
          },
          Item: {
            ...siteChatMessageToRecord(item),
            Sk1: { S: sk1(roomId, id) },
            Sk3: { S: sk3(now, id) },
          },
        }),
      );
      return Promise.resolve(item);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteSiteChatMessage(roomId: string, id: string): Promise<boolean> {
    try {
      await this.dynamodbClient.send(
        new DeleteItemCommand({
          TableName: TABLE_NAME,
          Key: { RoomId: { S: id }, Sk1: { S: sk1(roomId, id) } },
        }),
      );
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
