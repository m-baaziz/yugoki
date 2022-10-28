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
import { Trainer, TrainerInput, TrainerPageInfo } from '../generated/graphql';
import { logger } from '../logger';
import FileUploadAPI from './fileUpload';
import { batchGet } from './helpers';
import { parseTrainer, trainerToRecord } from '../utils/trainer';

export const TRAINERS_LIST_LIMIT = 1000;

const TABLE_NAME = 'Club';

const sk1 = (clubId: string, trainerId: string) =>
  `CLUB#${clubId}#TRAINER#${trainerId}`;

export default class TrainerAPI extends DataSource {
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

  async findTrainerById(clubId: string, id: string): Promise<Trainer> {
    try {
      const result = await this.dynamodbClient.send(
        new GetItemCommand({
          TableName: TABLE_NAME,
          Key: { ClubId: { S: clubId }, Sk1: { S: sk1(clubId, id) } },
        }),
      );
      const trainer = result.Item;
      if (!trainer) {
        return Promise.reject(`Trainer with id ${id} not found`);
      }
      return Promise.resolve(parseTrainer(trainer));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async findTrainersByIds(clubId: string, ids: string[]): Promise<Trainer[]> {
    try {
      if (ids.length > TRAINERS_LIST_LIMIT) {
        logger.warn(
          `Requesting too many trainers (${ids.length}, will limit to ${TRAINERS_LIST_LIMIT}`,
        );
      }
      const trainers = await batchGet(
        this.dynamodbClient,
        TABLE_NAME,
        ids.map((id) => ({
          ClubId: { S: clubId },
          Sk1: { S: sk1(clubId, id) },
        })),
        parseTrainer,
        [
          'TrainerId',
          'ClubId',
          'TrainerDescription',
          'TrainerDisplayname',
          'TrainerFirstname',
          'TrainerLastname',
          'TrainerPhoto',
        ],
      );

      return Promise.resolve(trainers);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listTrainersByClub(
    clubId: string,
    first: number,
    after?: string,
  ): Promise<TrainerPageInfo> {
    try {
      const result = await this.dynamodbClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression:
            '#hashKey = :hashKey AND begins_with(#sortKey, :sortKeySubstr)',
          ExpressionAttributeNames: {
            '#hashKey': 'ClubId',
            '#sortKey': 'Sk1',
          },
          ExpressionAttributeValues: {
            ':hashKey': { S: clubId },
            ':sortKeySubstr': { S: sk1(clubId, '') },
          },
          Limit: first,
          ExclusiveStartKey: after
            ? { ClubId: { S: clubId }, Sk1: { S: after } }
            : undefined,
        }),
      );
      const pageInfo: TrainerPageInfo = {
        trainers: result.Items.map(parseTrainer),
        endCursor: result.LastEvaluatedKey?.Sk1.S,
        hasNextPage: result.LastEvaluatedKey !== undefined,
      };
      return Promise.resolve(pageInfo);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async createTrainer(clubId: string, input: TrainerInput): Promise<Trainer> {
    try {
      const id = uuidv4();
      const trainer: Trainer = {
        id,
        club: clubId,
        ...input,
      };
      await this.dynamodbClient.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          ConditionExpression: 'attribute_not_exists(#id)',
          ExpressionAttributeNames: {
            '#id': 'ClubId',
          },
          Item: {
            ...trainerToRecord(trainer),
            Sk1: { S: sk1(clubId, id) },
          },
        }),
      );
      return Promise.resolve(trainer);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteTrainer(clubId: string, id: string): Promise<boolean> {
    // make transaction
    try {
      const trainer = await this.findTrainerById(clubId, id);
      await this.dynamodbClient.send(
        new DeleteItemCommand({
          TableName: TABLE_NAME,
          Key: { ClubId: { S: clubId }, Sk1: { S: sk1(clubId, id) } },
        }),
      );
      if (trainer.photo) {
        this.fileUploadAPI
          .deleteFileUpload(trainer.photo)
          .then((success) => {
            if (success)
              logger.info(
                `Successfully deleted trainer photo ${trainer.photo}`,
              );
            else
              logger.error(`Could not delete trainer photo ${trainer.photo}`);
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

  async deleteTrainersByClub(clubId: string): Promise<number> {
    try {
      let deletedCount = 0;
      let lastCursor = undefined;
      let hasNext = true;
      while (hasNext) {
        const page = await this.listTrainersByClub(clubId, 100, lastCursor);
        lastCursor = page.endCursor;
        hasNext = page.hasNextPage;
        const items = page.trainers;
        for (let i = 0; i < items.length; i++) {
          await this.deleteTrainer(clubId, items[i].id);
          deletedCount++;
        }
      }
      return Promise.resolve(deletedCount);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
