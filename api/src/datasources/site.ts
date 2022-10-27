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
  Club,
  SearchArea,
  Site,
  SiteInput,
  SitePageInfo,
  Sport,
} from '../generated/graphql';
import { logger } from '../logger';
import EventAPI from './event';
import FileUploadAPI from './fileUpload';
import { batchDelete } from './helpers';
import SubscriptionOptionAPI from './subscriptionOption';
import { computeAreaGeohash, parseSite, siteToRecord } from '../utils/site';
import TrainerAPI from './trainer';

const TABLE_NAME = 'Site';
const CLUB_INDEX_NAME = 'SiteClubIndex';
const GEOHASH_INDEX_NAME = 'SiteSportGeohashIndex';

const sk1 = (siteId: string) => `SITE#${siteId}`;
const sk2 = (geohash: string, siteId: string) =>
  `GEOHASH#${geohash}#SITE#${siteId}`;

export default class SiteAPI extends DataSource {
  dynamodbClient: DynamoDBClient;
  context: any;
  trainerAPI: TrainerAPI;
  subscriptionOptionAPI: SubscriptionOptionAPI;
  eventAPI: EventAPI;
  fileUploadAPI: FileUploadAPI;

  constructor(
    dynamodbClient: DynamoDBClient,
    trainerAPI: TrainerAPI,
    subscriptionOptionAPI: SubscriptionOptionAPI,
    eventAPI: EventAPI,
    fileUploadAPI: FileUploadAPI,
  ) {
    super();
    this.dynamodbClient = dynamodbClient;
    this.trainerAPI = trainerAPI;
    this.subscriptionOptionAPI = subscriptionOptionAPI;
    this.eventAPI = eventAPI;
    this.fileUploadAPI = fileUploadAPI;
  }

  initialize(config: DataSourceConfig<any>): void | Promise<void> {
    this.context = config.context;
  }

  async findSiteById(id: string): Promise<Site> {
    try {
      const result = await this.dynamodbClient.send(
        new GetItemCommand({
          TableName: TABLE_NAME,
          Key: { SiteId: { S: id }, Sk1: { S: sk1(id) } },
        }),
      );
      const site = result.Item;
      if (!site) {
        return Promise.reject(`Site with id ${id} not found`);
      }
      return Promise.resolve(parseSite(site));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listSitesByClub(
    clubId: string,
    first: number,
    after?: string,
  ): Promise<SitePageInfo> {
    try {
      const result = await this.dynamodbClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: CLUB_INDEX_NAME,
          KeyConditionExpression: '#clubId = :clubId',
          ExpressionAttributeNames: {
            '#clubId': 'ClubId',
          },
          ExpressionAttributeValues: {
            ':clubId': { S: clubId },
          },
          Limit: first,
          ExclusiveStartKey: after
            ? { ClubId: { S: clubId }, Sk1: { S: after } }
            : undefined,
        }),
      );
      const pageInfo: SitePageInfo = {
        sites: result.Items.map(parseSite),
        endCursor: result.LastEvaluatedKey?.Sk1.S,
        hasNextPage: result.LastEvaluatedKey !== undefined,
      };
      return Promise.resolve(pageInfo);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async listSitesBySportAndArea(
    sportId: string,
    searchArea: SearchArea,
    first: number,
    after?: string,
  ): Promise<SitePageInfo> {
    try {
      const geohash = computeAreaGeohash(searchArea);
      const result = await this.dynamodbClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: GEOHASH_INDEX_NAME,
          KeyConditionExpression:
            '#sportId = :sportId AND begins_with(#sortKey, :sortKeySubstr)',
          FilterExpression:
            '#siteLat <= :topLeftLat AND #siteLat >= :bottomRightLat AND #siteLon >= :topLeftLon AND #siteLon <= :bottomRightLon',
          ExpressionAttributeNames: {
            '#sportId': 'SportId',
            '#sortKey': 'Sk2',
            '#siteLat': 'SiteLat',
            '#siteLon': 'SiteLon',
          },
          ExpressionAttributeValues: {
            ':sportId': { S: sportId },
            ':sortKeySubstr': { S: sk2(geohash, '') },
            ':topLeftLat': { N: searchArea.topLeftLat.toString() },
            ':bottomRightLat': { N: searchArea.bottomRightLat.toString() },
            ':topLeftLon': { N: searchArea.topLeftLon.toString() },
            ':bottomRightLon': { N: searchArea.bottomRightLon.toString() },
          },
          Limit: first,
          ExclusiveStartKey: after
            ? { SportId: { S: sportId }, Sk2: { S: after } }
            : undefined,
        }),
      );
      const pageInfo: SitePageInfo = {
        sites: result.Items.map(parseSite),
        endCursor: result.LastEvaluatedKey?.Sk2.S,
        hasNextPage: result.LastEvaluatedKey !== undefined,
      };
      return Promise.resolve(pageInfo);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async createSite(club: Club, sport: Sport, input: SiteInput): Promise<Site> {
    try {
      const id = uuidv4();
      const item: Site = {
        id,
        club,
        sport,
        ...input,
        trainers: await this.trainerAPI.findTrainersByIds(
          club.id,
          input.trainerIds,
        ),
      };
      await this.dynamodbClient.send(
        new PutItemCommand({
          TableName: TABLE_NAME,
          ConditionExpression: 'attribute_not_exists(#sk1)',
          ExpressionAttributeNames: {
            '#sk1': 'Sk1',
          },
          Item: {
            ...siteToRecord(item),
            Sk1: { S: sk1(id) },
          },
        }),
      );
      return Promise.resolve(item);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteSite(id: string): Promise<boolean> {
    try {
      // make transaction
      // maybe not expose deleteSite, but allow to just disable
      const site = await this.findSiteById(id);

      const deletedItemsCount = await batchDelete(
        this.dynamodbClient,
        TABLE_NAME,
        {
          TableName: TABLE_NAME,
          KeyConditionExpression: '#siteId = :siteId',
          ExpressionAttributeNames: {
            '#siteId': 'SiteId',
          },
          ExpressionAttributeValues: {
            ':siteId': { S: id },
          },
        },
        (item) => ({ SiteId: { S: item.SiteId.S }, Sk1: { S: item.Sk1.S } }),
      );
      logger.info(`Deleted ${deletedItemsCount} related site items`);

      Promise.all(
        site.images.map((imageId) =>
          this.fileUploadAPI.deleteFileUpload(imageId),
        ),
      )
        .then((successes) => {
          const count = successes.filter((s) => s).length;
          logger.info(`Successfully deleted ${count} images`);
        })
        .catch((errors) => {
          logger.error(errors.map((e) => e.toString()));
        });
      return Promise.resolve(true);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async deleteSitesByClub(clubId: string): Promise<number> {
    try {
      const deletedItemsCount = await batchDelete(
        this.dynamodbClient,
        TABLE_NAME,
        {
          TableName: CLUB_INDEX_NAME,
          KeyConditionExpression: '#clubId = :clubId',
          ExpressionAttributeNames: {
            '#clubId': 'ClubId',
          },
          ExpressionAttributeValues: {
            ':clubId': { S: clubId },
          },
        },
        (item) => ({ ClubId: { S: item.ClubId.S }, Sk1: { S: item.Sk1.S } }),
      );
      logger.info(`Deleted ${deletedItemsCount} related site items`);
      return Promise.resolve(deletedItemsCount);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
