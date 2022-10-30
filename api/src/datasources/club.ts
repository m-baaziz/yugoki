/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

import { Club, ClubPageInfo } from '../generated/graphql';
import { logger } from '../logger';
import SiteAPI from './site';
import FileUploadAPI from './fileUpload';
import TrainerAPI from './trainer';
import { clubToRecord, parseClub } from '../utils/club';
import { batchDelete } from './helpers';

const TABLE_NAME = 'Club';
const OWNER_INDEX_NAME = 'ClubOwnerIndex';

const sk1 = (clubId: string) => `CLUB#${clubId}`;

export default class ClubAPI extends DataSource {
  dynamodbClient: DynamoDBClient;
  context: any;
  trainerAPI: TrainerAPI;
  siteAPI: SiteAPI;
  fileUploadAPI: FileUploadAPI;

  constructor(
    dynamodbClient: DynamoDBClient,
    trainerAPI: TrainerAPI,
    siteAPI: SiteAPI,
    fileUploadAPI: FileUploadAPI,
  ) {
    super();
    this.dynamodbClient = dynamodbClient;
    this.trainerAPI = trainerAPI;
    this.siteAPI = siteAPI;
    this.fileUploadAPI = fileUploadAPI;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async findClubById(id: string): Promise<Club> {
    try {
      const result = await this.dynamodbClient.send(
        new GetItemCommand({
          TableName: TABLE_NAME,
          Key: { ClubId: { S: id }, Sk1: { S: sk1(id) } },
        }),
      );
      const club = result.Item;
      if (!club) {
        return Promise.reject(`Club with id ${id} not found`);
      }
      return Promise.resolve(parseClub(club));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listUserClubs(
    userId: string,
    first: number,
    after?: string,
  ): Promise<ClubPageInfo> {
    try {
      const result = await this.dynamodbClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: OWNER_INDEX_NAME,
          KeyConditionExpression: '#owner = :userId',
          ExpressionAttributeNames: {
            '#owner': 'ClubOwner',
          },
          ExpressionAttributeValues: {
            ':userId': { S: userId },
          },
          Limit: first,
          ExclusiveStartKey: after
            ? { ClubId: { S: userId }, Sk1: { S: after } } // TODO: implement locally serializeKey and and parseKey to put exclusiveKey in after as one string, and make change in other datasources
            : undefined,
        }),
      );
      const pageInfo: ClubPageInfo = {
        clubs: result.Items.map(parseClub),
        endCursor: result.LastEvaluatedKey?.Sk1.S,
        hasNextPage: result.LastEvaluatedKey !== undefined,
      };
      return Promise.resolve(pageInfo);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async createClub(ownerId: string, name: string): Promise<Club> {
    try {
      const id = uuidv4();
      const item: Club = {
        id,
        owner: ownerId,
        name,
      };
      await this.dynamodbClient.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          ConditionExpression: 'attribute_not_exists(#id)',
          ExpressionAttributeNames: {
            '#id': 'ClubId',
          },
          Item: {
            ...clubToRecord(item),
            Sk1: { S: sk1(id) },
          },
        }),
      );
      return Promise.resolve(item);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteClub(id: string): Promise<boolean> {
    try {
      // make transaction
      const club = await this.findClubById(id);
      const trainerDeleteCount = await this.trainerAPI.deleteTrainersByClub(id);
      logger.info(`Deleted ${trainerDeleteCount} trainers`);
      const siteDeleteCount = await this.siteAPI.deleteSitesByClub(id);
      logger.info(`Deleted ${siteDeleteCount} sites`);
      const deletedItemsCount = await batchDelete(
        this.dynamodbClient,
        TABLE_NAME,
        {
          TableName: TABLE_NAME,
          KeyConditionExpression: '#clubId = :clubId',
          ExpressionAttributeNames: {
            '#clubId': 'ClubId',
          },
          ExpressionAttributeValues: {
            ':clubId': { S: id },
          },
        },
        (item) => ({ ClubId: { S: item.ClubId.S }, Sk1: { S: item.Sk1.S } }),
      );
      logger.info(`Deleted ${deletedItemsCount} related club items`);

      if (club.logo) {
        this.fileUploadAPI
          .deleteFileUpload(club.logo)
          .then((success) => {
            if (success)
              logger.info(`Successfully deleted club logo ${club.logo}`);
            else logger.error(`Could not delete club logo ${club.logo}`);
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
