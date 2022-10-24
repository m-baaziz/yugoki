import { Context } from 'apollo-server-core';
import { Db, MongoClient } from 'mongodb';
import { logger } from '../logger';
import { AuthenticationContext } from '../middlewares/context';
import SportAPI from './sport';
import ClubAPI from './club';
import UserAPI from './user';
import SiteAPI from './site';
import TrainerAPI from './trainer';
import EventAPI from './event';
import SubscriptionAPI from './subscription';
import SubscriptionOptionAPI from './subscriptionOption';
import FileUploadAPI from './fileUpload';

export enum _Database {
  Dev = 'dev',
  Prod = 'prod',
  Test = 'test',
}

export enum _Collection {
  User = 'user',
  Sport = 'sport',
  Club = 'club',
  Site = 'site',
  Trainer = 'trainer',
  Event = 'event',
  SubscriptionOption = 'subscription-option',
  Subscription = 'subscription',
  FileUpload = 'file-upload',
}

export type DataSources = {
  userAPI: UserAPI;
  sportAPI: SportAPI;
  clubAPI: ClubAPI;
  siteAPI: SiteAPI;
  trainerAPI: TrainerAPI;
  eventAPI: EventAPI;
  subscriptionOptionAPI: SubscriptionOptionAPI;
  subscriptionAPI: SubscriptionAPI;
  fileUploadAPI: FileUploadAPI;
};

export type ContextWithDataSources = Context<AuthenticationContext> & {
  dataSources: DataSources;
};

export async function mongoClient(
  host: string,
  port: number,
): Promise<MongoClient> {
  const url = `mongodb://${host}:${port}`;
  logger.info(`Opening MongoDB database connection on ${url}`);
  const mongoClient = new MongoClient(url);
  return mongoClient.connect();
}

export function mongoDb(client: MongoClient, dbName: _Database): Db {
  return client.db(dbName);
}
