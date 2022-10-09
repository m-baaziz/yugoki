import { Context } from 'apollo-server-core';
import { Db, MongoClient } from 'mongodb';
import { logger } from '../logger';
import { AuthenticationContext } from '../middlewares/context';
import SportAPI from './sport';
import ClubAPI from './club';
import UserAPI from './user';
import ClubSportLocationAPI from './clubSportLocation';
import TrainerAPI from './trainer';
import EventAPI from './event';
import SubscriptionAPI from './subscription';
import SubscriptionOptionAPI from './subscriptionOption';

export enum _Database {
  Dev = 'dev',
  Prod = 'prod',
  Test = 'test',
}

export enum _Collection {
  User = 'user',
  Sport = 'sport',
  Club = 'club',
  ClubSportLocation = 'club-sport-location',
  Trainer = 'trainer',
  Event = 'event',
  SubscriptionOption = 'subscription-option',
  Subscription = 'subscription',
}

export type DataSources = {
  userAPI: UserAPI;
  sportAPI: SportAPI;
  clubAPI: ClubAPI;
  clubSportLocationAPI: ClubSportLocationAPI;
  trainerAPI: TrainerAPI;
  eventAPI: EventAPI;
  subscriptionOptionAPI: SubscriptionOptionAPI;
  subscriptionAPI: SubscriptionAPI;
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
