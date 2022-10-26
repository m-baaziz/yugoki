/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  PutItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

import {
  SubscriptionOption,
  SubscriptionOptionDbObject,
  SubscriptionOptionInput,
  SubscriptionOptionPageInfo,
} from '../generated/graphql';
import {
  parseSubscriptionOption,
  subscriptionOptionToRecord,
} from '../utils/subscriptionOption';

const TABLE_NAME = 'Site';

const sk1 = (siteId: string, subscriptionOptionId: string) =>
  `SITE#${siteId}#SUBSCRIPTIONOPTION#${subscriptionOptionId}`;

export default class SubscriptionOptionAPI extends DataSource {
  dynamodbClient: DynamoDBClient;
  context: any;

  constructor(dynamodbClient: DynamoDBClient) {
    super();
    this.dynamodbClient = dynamodbClient;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async findSubscriptionOptionById(
    siteId: string,
    id: string,
  ): Promise<SubscriptionOption> {
    try {
      const result = await this.dynamodbClient.send(
        new GetItemCommand({
          TableName: TABLE_NAME,
          Key: { Id: { S: siteId }, Sk1: { S: sk1(siteId, id) } },
        }),
      );
      const item = result.Item;
      if (!item) {
        return Promise.reject(`Subscription Option with id ${id} not found`);
      }
      return Promise.resolve(parseSubscriptionOption(item));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listSubscriptionOptionsBySite(
    siteId: string,
    first: number,
    after?: string,
  ): Promise<SubscriptionOptionPageInfo> {
    try {
      const result = await this.dynamodbClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression:
            '#hashKey = :hashKey AND begins_with(#sortKey, :sortKeySubstr)',
          ExpressionAttributeNames: {
            '#hashKey': 'SiteId',
            '#sortKey': 'Sk1',
          },
          ExpressionAttributeValues: {
            ':hashKey': { S: siteId },
            ':sortKeySubstr': { S: sk1(siteId, '') },
          },
          Limit: first,
          ExclusiveStartKey: after
            ? { Id: { S: after }, Sk1: { S: after } }
            : undefined,
        }),
      );
      const pageInfo: SubscriptionOptionPageInfo = {
        subscriptionOptions: result.Items.map(parseSubscriptionOption),
        endCursor: result.LastEvaluatedKey?.Sk1.S,
        hasNextPage: result.LastEvaluatedKey !== undefined,
      };
      return Promise.resolve(pageInfo);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listEnabledSubscriptionOptionsBySite(
    siteId: string,
    first: number,
    after?: string,
  ): Promise<SubscriptionOptionPageInfo> {
    try {
      const result = await this.dynamodbClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression:
            '#hashKey = :hashKey AND begins_with(#sortKey, :sortKeySubstr)',
          FilterExpression: '#enabled = :enabled',
          ExpressionAttributeNames: {
            '#hashKey': 'SiteId',
            '#sortKey': 'Sk1',
            '#enabled': 'SubscriptionOptionEnabled',
          },
          ExpressionAttributeValues: {
            ':hashKey': { S: siteId },
            ':sortKeySubstr': { S: sk1(siteId, '') },
            ':enabled': { BOOL: true },
          },
          Limit: first,
          ExclusiveStartKey: after
            ? { Id: { S: after }, Sk1: { S: after } }
            : undefined,
        }),
      );
      const pageInfo: SubscriptionOptionPageInfo = {
        subscriptionOptions: result.Items.map(parseSubscriptionOption),
        endCursor: result.LastEvaluatedKey?.Sk1.S,
        hasNextPage: result.LastEvaluatedKey !== undefined,
      };
      return Promise.resolve(pageInfo);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async createSubscriptionOption(
    siteId: string,
    input: SubscriptionOptionInput,
  ): Promise<SubscriptionOptionDbObject> {
    try {
      const id = uuidv4();
      const subscriptionOption: SubscriptionOption = {
        id,
        site: siteId,
        ...input,
        enabled: true,
      };
      await this.dynamodbClient.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          ConditionExpression: 'attribute_not_exists(#sk1)',
          ExpressionAttributeNames: {
            '#sk1': 'Sk1',
          },
          Item: {
            ...subscriptionOptionToRecord(subscriptionOption),
            SiteId: { S: siteId },
            Sk1: { S: sk1(siteId, id) },
          },
        }),
      );
      return Promise.resolve(subscriptionOption);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async enableSubscriptionOption(siteId: string, id: string): Promise<boolean> {
    try {
      await this.dynamodbClient.send(
        new UpdateItemCommand({
          TableName: TABLE_NAME,
          Key: { Id: { S: siteId }, Sk1: { S: sk1(siteId, id) } },
          UpdateExpression: 'SET #enabled = :enabled',
          ExpressionAttributeNames: {
            '#enabled': 'SubscriptionOptionEnabled',
          },
          ExpressionAttributeValues: {
            ':enabled': { BOOL: true },
          },
        }),
      );
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async disableSubscriptionOption(
    siteId: string,
    id: string,
  ): Promise<boolean> {
    try {
      await this.dynamodbClient.send(
        new UpdateItemCommand({
          TableName: TABLE_NAME,
          Key: { Id: { S: siteId }, Sk1: { S: sk1(siteId, id) } },
          UpdateExpression: 'SET #enabled = :enabled',
          ExpressionAttributeNames: {
            '#enabled': 'SubscriptionOptionEnabled',
          },
          ExpressionAttributeValues: {
            ':enabled': { BOOL: false },
          },
        }),
      );
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
