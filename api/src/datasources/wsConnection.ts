/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import {
  parseWsConnection,
  WsConnection,
  wsConnectionToRecord,
} from '../utils/wsConnection';
import { batchDelete } from './helpers';
import { logger } from '../logger';

const TABLE_NAME = 'WsConnection';
const CONNECTION_INDEX_NAME = 'ConnectionIdIndex';

const WS_CONNECTION_VALIDITY_SEC = 24 * 60 * 60;

export default class WsConnectionAPI extends DataSource {
  dynamodbClient: DynamoDBClient;
  apiGatewayManagementClient: ApiGatewayManagementApiClient;
  textEncoder: TextEncoder;
  context: any;

  constructor(
    dynamodbClient: DynamoDBClient,
    apiGatewayManagementClient: ApiGatewayManagementApiClient,
  ) {
    super();
    this.dynamodbClient = dynamodbClient;
    this.apiGatewayManagementClient = apiGatewayManagementClient;
    this.textEncoder = new TextEncoder();
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async findWsConnectionByUserId(userId: string): Promise<WsConnection> {
    try {
      const result = await this.dynamodbClient.send(
        new GetItemCommand({
          TableName: TABLE_NAME,
          Key: { UserId: { S: userId } },
        }),
      );
      const item = result.Item;
      if (!item) {
        return Promise.reject(`Ws connection with user id ${userId} not found`);
      }
      return Promise.resolve(parseWsConnection(item));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async createWsConnection(
    userId: string,
    connectionId: string,
  ): Promise<WsConnection> {
    try {
      const now = new Date();
      const ttl = Math.round(now.getTime() / 1000) + WS_CONNECTION_VALIDITY_SEC;
      const item: WsConnection = {
        userId,
        connectionId,
      };
      await this.dynamodbClient.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          Item: {
            ...wsConnectionToRecord(item),
            Ttl: { N: ttl.toString(10) },
          },
        }),
      );
      return Promise.resolve(item);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteWsConnection(userId: string): Promise<boolean> {
    try {
      await this.dynamodbClient.send(
        new DeleteItemCommand({
          TableName: TABLE_NAME,
          Key: { UserId: { S: userId } },
        }),
      );
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteWsConnectionsByConnectionId(
    connectionId: string,
  ): Promise<number> {
    try {
      const deletedItemsCount = await batchDelete(
        this.dynamodbClient,
        TABLE_NAME,
        {
          TableName: CONNECTION_INDEX_NAME,
          KeyConditionExpression: '#connectionId = :connectionId',
          ExpressionAttributeNames: {
            '#connectionId': 'ConnectionId',
          },
          ExpressionAttributeValues: {
            ':connectionId': { S: connectionId },
          },
        },
        (item) => ({
          UserId: { S: item.UserId.S },
          ConnectionId: { S: item.ConnectionId.S },
        }),
      );
      logger.info(`Delete ${deletedItemsCount} ws connections`);
      return Promise.resolve(deletedItemsCount);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async sendPayload(connectionId: string, body: any): Promise<void> {
    try {
      await this.apiGatewayManagementClient.send(
        new PostToConnectionCommand({
          ConnectionId: connectionId,
          Data: this.textEncoder.encode(JSON.stringify(body)),
        }),
      );
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
