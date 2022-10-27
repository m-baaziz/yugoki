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

import { Event, EventInput, EventPageInfo } from '../generated/graphql';
import { logger } from '../logger';
import FileUploadAPI from './fileUpload';
import { eventToRecord, parseEvent } from '../utils/event';

const TABLE_NAME = 'Site';

const sk1 = (siteId: string, eventId: string) =>
  `SITE#${siteId}#EVENT#${eventId}`;

export default class EventAPI extends DataSource {
  dynamodbClient: DynamoDBClient;
  context: any;
  fileUploadAPI: FileUploadAPI;

  constructor(dynamodbClient: DynamoDBClient, fileUploadAPI: FileUploadAPI) {
    super();
    this.dynamodbClient = dynamodbClient;
    this.fileUploadAPI = fileUploadAPI;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async findEventById(siteId: string, id: string): Promise<Event> {
    try {
      const result = await this.dynamodbClient.send(
        new GetItemCommand({
          TableName: TABLE_NAME,
          Key: { SiteId: { S: siteId }, Sk1: { S: sk1(siteId, id) } },
        }),
      );
      const item = result.Item;
      if (!item) {
        return Promise.reject(`Event with id ${id} not found`);
      }
      return Promise.resolve(parseEvent(item));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listEventsBySiteId(
    siteId: string,
    first: number,
    after?: string,
  ): Promise<EventPageInfo> {
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
            ? { SiteId: { S: siteId }, Sk1: { S: after } }
            : undefined,
        }),
      );
      const pageInfo: EventPageInfo = {
        events: result.Items.map(parseEvent),
        endCursor: result.LastEvaluatedKey?.Sk1.S,
        hasNextPage: result.LastEvaluatedKey !== undefined,
      };
      return Promise.resolve(pageInfo);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async createEvent(siteId: string, input: EventInput): Promise<Event> {
    try {
      const id = uuidv4();
      const item: Event = {
        id,
        site: siteId,
        dateRFC3339: input.dateRFC3339,
        title: input.title,
        description: input.description,
        image: input.image,
      };
      await this.dynamodbClient.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          ConditionExpression: 'attribute_not_exists(#sk1)',
          ExpressionAttributeNames: {
            '#sk1': 'Sk1',
          },
          Item: {
            ...eventToRecord(item),
            Sk1: { S: sk1(siteId, id) },
          },
        }),
      );
      return Promise.resolve(item);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteEvent(siteId: string, id: string): Promise<boolean> {
    // make transaction
    try {
      const event = await this.findEventById(siteId, id);
      await this.dynamodbClient.send(
        new DeleteItemCommand({
          TableName: TABLE_NAME,
          Key: { SiteId: { S: siteId }, Sk1: { S: sk1(siteId, id) } },
        }),
      );
      if (event.image) {
        this.fileUploadAPI
          .deleteFileUpload(event.image)
          .then((success) => {
            if (success)
              logger.info(`Successfully deleted event image ${event.image}`);
            else logger.error(`Could not delete event image ${event.image}`);
          })
          .catch((e) => {
            logger.error(e.toString());
          });
      }
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
