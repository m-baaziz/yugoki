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
import { SiteChatRoom, SiteChatRoomPageInfo } from '../generated/graphql';
import { parseCursor, serializeKey } from './helpers';
import { parseSiteChatRoom, siteChatRoomToRecord } from '../utils/siteChatRoom';
import SiteAPI from './site';

const TABLE_NAME = 'SiteChat';
const SITE_INDEX_NAME = 'SiteIndex';
const USER_INDEX_NAME = 'UserIndex';

const sk1 = (roomId: string) => `ROOM#${roomId}`;
const sk2 = (roomDate: string, roomId: string) =>
  `ROOMDATE#${roomDate}#ROOMID#${roomId}`;

export default class SiteChatRoomAPI extends DataSource {
  dynamodbClient: DynamoDBClient;
  context: any;
  siteAPI: SiteAPI;

  constructor(dynamodbClient: DynamoDBClient, siteAPI: SiteAPI) {
    super();
    this.dynamodbClient = dynamodbClient;
    this.siteAPI = siteAPI;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async findSiteChatRoomById(id: string): Promise<SiteChatRoom> {
    try {
      const result = await this.dynamodbClient.send(
        new GetItemCommand({
          TableName: TABLE_NAME,
          Key: { RoomId: { S: id }, Sk1: { S: sk1(id) } },
        }),
      );
      const item = result.Item;
      if (!item) {
        return Promise.reject(`Site chat room with id ${id} not found`);
      }
      const site = await this.siteAPI.findSiteById(item.SiteId.S);
      return Promise.resolve(parseSiteChatRoom(item, site));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listSiteChatRooms(
    siteId: string,
    first: number,
    after?: string,
  ): Promise<SiteChatRoomPageInfo> {
    try {
      const cursor = parseCursor(after);
      const result = await this.dynamodbClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: SITE_INDEX_NAME,
          KeyConditionExpression: '#siteId = :siteId',
          ExpressionAttributeNames: {
            '#siteId': 'SiteId',
          },
          ExpressionAttributeValues: {
            ':siteId': { S: siteId },
          },
          ScanIndexForward: false,
          Limit: first,
          ExclusiveStartKey:
            cursor.length > 3
              ? {
                  RoomId: { S: cursor[0] },
                  Sk1: { S: cursor[1] },
                  SiteId: { S: cursor[2] },
                  Sk2: { S: cursor[3] },
                }
              : undefined,
        }),
      );
      const endCursor = result.LastEvaluatedKey
        ? serializeKey([
            result.LastEvaluatedKey.RoomId.S,
            result.LastEvaluatedKey.Sk1.S,
            result.LastEvaluatedKey.SiteId.S,
            result.LastEvaluatedKey.Sk2.S,
          ])
        : undefined;
      const siteChatRooms = await Promise.all(
        result.Items.map((item) =>
          this.siteAPI
            .findSiteById(item.SiteId.S)
            .then((site) => parseSiteChatRoom(item, site)),
        ),
      );
      const pageInfo: SiteChatRoomPageInfo = {
        siteChatRooms,
        endCursor,
        hasNextPage: result.LastEvaluatedKey !== undefined,
      };
      return Promise.resolve(pageInfo);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listUserSiteChatRooms(
    userId: string,
    first: number,
    after?: string,
  ): Promise<SiteChatRoomPageInfo> {
    try {
      const cursor = parseCursor(after);
      const result = await this.dynamodbClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: USER_INDEX_NAME,
          KeyConditionExpression: '#userId = :userId',
          ExpressionAttributeNames: {
            '#userId': 'RoomUserId',
          },
          ExpressionAttributeValues: {
            ':userId': { S: userId },
          },
          ScanIndexForward: false,
          Limit: first,
          ExclusiveStartKey:
            cursor.length > 3
              ? {
                  RoomId: { S: cursor[0] },
                  Sk1: { S: cursor[1] },
                  RoomUserId: { S: cursor[2] },
                  Sk2: { S: cursor[3] },
                }
              : undefined,
        }),
      );
      const endCursor = result.LastEvaluatedKey
        ? serializeKey([
            result.LastEvaluatedKey.RoomId.S,
            result.LastEvaluatedKey.Sk1.S,
            result.LastEvaluatedKey.RoomUserId.S,
            result.LastEvaluatedKey.Sk2.S,
          ])
        : undefined;
      const siteChatRooms = await Promise.all(
        result.Items.map((item) =>
          this.siteAPI
            .findSiteById(item.SiteId.S)
            .then((site) => parseSiteChatRoom(item, site)),
        ),
      );
      const pageInfo: SiteChatRoomPageInfo = {
        siteChatRooms,
        endCursor,
        hasNextPage: result.LastEvaluatedKey !== undefined,
      };
      return Promise.resolve(pageInfo);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async createSiteChatRoom(
    siteId: string,
    userId: string,
  ): Promise<SiteChatRoom> {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();
      const site = await this.siteAPI.findSiteById(siteId);
      const item: SiteChatRoom = {
        id,
        site,
        userId,
        createdAtRFC3339: now,
      };
      await this.dynamodbClient.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          ConditionExpression: 'attribute_not_exists(#id)',
          ExpressionAttributeNames: {
            '#id': 'RoomId',
          },
          Item: {
            ...siteChatRoomToRecord(item),
            Sk1: { S: sk1(id) },
            Sk2: { S: sk2(now, id) },
          },
        }),
      );
      return Promise.resolve(item);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteSiteChatRoom(id: string): Promise<boolean> {
    try {
      await this.dynamodbClient.send(
        new DeleteItemCommand({
          TableName: TABLE_NAME,
          Key: { RoomId: { S: id }, Sk1: { S: sk1(id) } },
        }),
      );
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
