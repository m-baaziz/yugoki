/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

import {
  SubscriberDetailsInput,
  Subscription,
  SubscriptionPageInfo,
} from '../generated/graphql';
import SubscriptionOptionAPI from './subscriptionOption';
import { parseSubscription, subscriptionToRecord } from '../utils/subscription';
import { parseCursor, serializeKey } from './helpers';

const TABLE_NAME = 'Subscription';
const DATE_INDEX_NAME = 'DateIndex';

const sk1 = (subscriptionOptionId: string, subscriptionId: string) =>
  `${subscriptionOptionId}#${subscriptionId}`;

const sk2 = (
  date: string,
  subscriptionOptionId: string,
  subscriptionId: string,
) => `${date}#${subscriptionOptionId}#${subscriptionId}`;

export default class SubscriptionAPI extends DataSource {
  dynamodbClient: DynamoDBClient;
  context: any;
  subscriptionOptionAPI: SubscriptionOptionAPI;

  constructor(
    dynamodbClient: DynamoDBClient,
    subscriptionOptionAPI: SubscriptionOptionAPI,
  ) {
    super();
    this.dynamodbClient = dynamodbClient;
    this.subscriptionOptionAPI = subscriptionOptionAPI;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async findSubscriptionById(
    siteId: string,
    subscriptionOptionId: string,
    id: string,
  ): Promise<Subscription> {
    try {
      const result = await this.dynamodbClient.send(
        new GetItemCommand({
          TableName: TABLE_NAME,
          Key: {
            SiteId: { S: siteId },
            Sk1: { S: sk1(subscriptionOptionId, id) },
          },
        }),
      );
      const item = result.Item;
      if (!item) {
        return Promise.reject(`Subscription with id ${id} not found`);
      }
      return Promise.resolve(parseSubscription(item));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listSubscriptionsBySubscriptionOption(
    siteId: string,
    subscriptionOptionId: string,
    first: number,
    after?: string,
  ): Promise<SubscriptionPageInfo> {
    try {
      const cursor = parseCursor(after);
      const result = await this.dynamodbClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression:
            '#siteId = :siteId AND begins_with(#sk1, :sk1)',
          ExpressionAttributeNames: {
            '#siteId': 'SiteId',
            '#sk1': 'Sk1',
          },
          ExpressionAttributeValues: {
            ':siteId': { S: siteId },
            ':sk1': { S: sk1(subscriptionOptionId, '') },
          },
          Limit: first,
          ExclusiveStartKey:
            cursor.length > 1
              ? {
                  SiteId: { S: cursor[0] },
                  Sk1: { S: cursor[1] },
                }
              : undefined,
        }),
      );
      const endCursor = result.LastEvaluatedKey
        ? serializeKey([
            result.LastEvaluatedKey.SiteId.S,
            result.LastEvaluatedKey.Sk1.S,
          ])
        : undefined;
      const pageInfo: SubscriptionPageInfo = {
        subscriptions: result.Items.map(parseSubscription),
        endCursor,
        hasNextPage: result.LastEvaluatedKey !== undefined,
      };
      return Promise.resolve(pageInfo);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listSubscriptionsBySite(
    siteId: string,
    first: number,
    after?: string,
  ): Promise<SubscriptionPageInfo> {
    try {
      const cursor = parseCursor(after);
      const result = await this.dynamodbClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: DATE_INDEX_NAME,
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
            cursor.length > 2
              ? {
                  SiteId: { S: cursor[0] },
                  Sk1: { S: cursor[1] },
                  Sk2: { S: cursor[1] },
                }
              : undefined,
        }),
      );
      const endCursor = result.LastEvaluatedKey
        ? serializeKey([
            result.LastEvaluatedKey.SiteId.S,
            result.LastEvaluatedKey.Sk1.S,
            result.LastEvaluatedKey.Sk2.S,
          ])
        : undefined;
      const pageInfo: SubscriptionPageInfo = {
        subscriptions: result.Items.map(parseSubscription),
        endCursor,
        hasNextPage: result.LastEvaluatedKey !== undefined,
      };
      return Promise.resolve(pageInfo);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async createSubscription(
    siteId: string,
    subscriptionOptionId: string,
    subscriberDetails: SubscriberDetailsInput,
  ): Promise<Subscription> {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();
      const subscriptionOption =
        await this.subscriptionOptionAPI.findSubscriptionOptionById(
          siteId,
          subscriptionOptionId,
        );
      if (
        subscriptionOption.formEntries.length !==
        subscriberDetails.formEntriesValues.length
      ) {
        return Promise.reject('Invalid number of form entries');
      }
      const subscription: Subscription = {
        id,
        site: siteId,
        subscriptionOption,
        subscriberDetails,
        createdAtRFC3339: now,
      };
      const newItem = {
        ...subscriptionToRecord(subscription),
        SiteId: { S: siteId },
        Sk1: { S: sk1(subscriptionOptionId, id) },
        Sk2: { S: sk2(now, subscriptionOptionId, id) },
      };
      await this.dynamodbClient.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          ConditionExpression: 'attribute_not_exists(#siteId)',
          ExpressionAttributeNames: {
            '#siteId': 'SiteId',
          },
          Item: newItem,
        }),
      );
      return Promise.resolve(subscription);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
