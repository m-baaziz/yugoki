/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  QueryCommand,
  PutItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

import { Club, ClubPageInfo } from '../generated/graphql';
import { logger } from '../logger';
import SiteAPI from './site';
import FileUploadAPI from './fileUpload';
import TrainerAPI from './trainer';
import { parseClub } from '../utils/club';

const TABLE_NAME = 'Club';
const OWNER_INDEX_NAME = 'ClubOwnerIndex';

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
          Key: { Id: { S: id } },
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

  async listClubs(first: number, after?: string): Promise<ClubPageInfo> {
    try {
      const result = await this.dynamodbClient.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          Limit: first,
          ExclusiveStartKey: after ? { Id: { S: after } } : undefined,
        }),
      );
      const pageInfo: ClubPageInfo = {
        clubs: result.Items.map(parseClub),
        endCursor: result.LastEvaluatedKey?.Id.S,
        hasNextPage: result.LastEvaluatedKey !== undefined,
      };
      return Promise.resolve(pageInfo);
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
            '#owner': 'Owner',
          },
          ExpressionAttributeValues: {
            ':userId': { S: userId },
          },
          Limit: first,
          ExclusiveStartKey: after
            ? { Id: { S: after }, Owner: { S: userId } }
            : undefined,
        }),
      );
      const pageInfo: ClubPageInfo = {
        clubs: result.Items.map(parseClub),
        endCursor: result.LastEvaluatedKey?.Id.S,
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
      await this.dynamodbClient.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          ConditionExpression: 'attribute_not_exists(#id)',
          ExpressionAttributeNames: {
            '#id': 'Id',
          },
          Item: {
            Id: { S: id },
            Owner: { S: ownerId },
            Name: { S: name },
          },
        }),
      );
      const club: Club = {
        id,
        owner: ownerId,
        name,
      };
      return Promise.resolve(club);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteClub(id: string): Promise<boolean> {
    try {
      // make transaction
      const club = await this.findClubById(id);
      const trainersDeleteCount = await this.trainerAPI.deleteTrainersByClub(
        id,
      );
      logger.info(`Deleted ${trainersDeleteCount} trainers`);
      const siteDeleteCount = await this.siteAPI.deleteSitesByClub(id);
      logger.info(`Deleted ${siteDeleteCount} sites`);

      await this.dynamodbClient.send(
        new DeleteItemCommand({
          TableName: TABLE_NAME,
          Key: { Id: { S: id } },
        }),
      );
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
