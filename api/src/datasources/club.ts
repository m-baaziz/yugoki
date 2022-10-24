/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { Collection, Db, ObjectId, WithId } from 'mongodb';
import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  QueryCommand,
  PutItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

import { _Collection } from '.';
import { ClubDbObject } from '../generated/graphql';
import { logger } from '../logger';
import SiteAPI from './site';
import FileUploadAPI from './fileUpload';
import { listByFilter } from './helpers';
import TrainerAPI from './trainer';

const CLUB_TABLE_NAME = 'Club';
const CLUB_OWNER_INDEX_NAME = 'ClubOwnerIndex';
export default class ClubAPI extends DataSource {
  collection: Collection<ClubDbObject>;
  dynamodbClient: DynamoDBClient;
  context: any;
  trainerAPI: TrainerAPI;
  siteAPI: SiteAPI;
  fileUploadAPI: FileUploadAPI;

  constructor(
    db: Db,
    dynamodbClient: DynamoDBClient,
    trainerAPI: TrainerAPI,
    siteAPI: SiteAPI,
    fileUploadAPI: FileUploadAPI,
  ) {
    super();
    this.collection = db.collection<ClubDbObject>(_Collection.Club);
    this.dynamodbClient = dynamodbClient;
    this.trainerAPI = trainerAPI;
    this.siteAPI = siteAPI;
    this.fileUploadAPI = fileUploadAPI;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async findClubById(id: string): Promise<WithId<ClubDbObject>> {
    try {
      const result = await this.dynamodbClient.send(
        new GetItemCommand({
          TableName: CLUB_TABLE_NAME,
          Key: { Id: { S: id } },
        }),
      );
      console.log('Result item = ', result);

      const club = await this.collection.findOne({
        _id: new ObjectId(id),
      });
      if (!club) {
        return Promise.reject(`Club with id ${id} not found`);
      }
      return Promise.resolve(club);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listClubs(
    first: number,
    after?: string,
  ): Promise<[WithId<ClubDbObject>[], boolean]> {
    const result = await this.dynamodbClient.send(
      new ScanCommand({
        TableName: CLUB_TABLE_NAME,
        Limit: first,
        ExclusiveStartKey: { Id: { S: after } },
      }),
    );
    console.log('Results  ', result);
    return listByFilter(this.collection, {}, first, after);
  }

  async listUserClubs(
    userId: string,
    first: number,
    after?: string,
  ): Promise<[WithId<ClubDbObject>[], boolean]> {
    const result = await this.dynamodbClient.send(
      new QueryCommand({
        TableName: CLUB_TABLE_NAME,
        IndexName: CLUB_OWNER_INDEX_NAME,
        KeyConditionExpression: 'Owner = :userId',
        ExpressionAttributeValues: {
          ':userId': { S: userId },
        },
        Limit: first,
        ExclusiveStartKey: { Id: { S: after } },
      }),
    );
    console.log('Results  ', result);
    return listByFilter(this.collection, { owner: userId }, first, after);
  }

  async createClub(ownerId: string, name: string): Promise<ClubDbObject> {
    try {
      const id = uuidv4();
      const dynamodbResult = await this.dynamodbClient.send(
        new PutItemCommand({
          TableName: CLUB_TABLE_NAME,
          ConditionExpression: 'attribute_not_exists(#id)',
          ExpressionAttributeNames: {
            '#id': 'Id',
          },
          Item: {
            Id: { S: id },
            Owner: { S: ownerId },
            name: { S: name },
          },
        }),
      );
      console.log('Result = ', dynamodbResult);

      const club: ClubDbObject = {
        owner: ownerId,
        name,
      };

      const result = await this.collection.insertOne(club);

      return {
        ...club,
        _id: result.insertedId,
      };
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
      const cslDeleteCount = await this.siteAPI.deleteSitesByClub(id);
      logger.info(`Deleted ${cslDeleteCount} sites`);

      const dynamodbResult = await this.dynamodbClient.send(
        new DeleteItemCommand({
          TableName: CLUB_TABLE_NAME,
          Key: { Id: { S: id } },
        }),
      );
      console.log('Result = ', dynamodbResult);

      const result = await this.collection.deleteOne({ _id: club._id });
      logger.info(`Deleted ${result.deletedCount} club`);
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
      return Promise.resolve(result.deletedCount === 1);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
