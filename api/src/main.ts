import 'dotenv/config';
import path from 'path';
import { readFileSync } from 'fs';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server';

import resolvers from './resolvers';
import { logger } from './logger';
import UserAPI from './datasources/user';
import { _Database, mongoDb, mongoClient, DataSources } from './datasources';
import authenticationMiddleware from './middlewares/context';
import ClubAPI from './datasources/club';
import SportAPI from './datasources/sport';
import ClubSportLocationAPI from './datasources/clubSportLocation';
import TrainerAPI from './datasources/trainer';
import EventAPI from './datasources/event';
import SubscriptionAPI from './datasources/subscription';
import SubscriptionOptionAPI from './datasources/subscriptionOption';

const isDev = process.env.NODE_ENV !== 'production';
const SCHEMA_PATH = path.join(__dirname, '../schema.graphql');

async function main() {
  const SERVER_PORT = parseInt(process.env.SERVER_PORT, 10) || 4000;
  const MONGO_HOST = process.env.MONGO_HOST;
  const MONGO_PORT = parseInt(process.env.MONGO_PORT, 10);
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_VALIDITY_SEC = parseInt(process.env.JWT_VALIDITY_SEC, 10);

  const typeDefs = readFileSync(SCHEMA_PATH).toString('utf-8');

  const dbClient = await mongoClient(MONGO_HOST, MONGO_PORT);
  const db = mongoDb(dbClient, isDev ? _Database.Dev : _Database.Prod);

  const schema = makeExecutableSchema({
    typeDefs: [DIRECTIVES, typeDefs],
    resolvers,
  });

  const userAPI = new UserAPI(db, {
    jwtSecret: JWT_SECRET,
    jwtValiditySec: JWT_VALIDITY_SEC,
  });
  const subscriptionOptionAPI = new SubscriptionOptionAPI(db);
  const subscriptionAPI = new SubscriptionAPI(db);
  const trainerAPI = new TrainerAPI(db);
  const clubSportLocationAPI = new ClubSportLocationAPI(
    db,
    subscriptionOptionAPI,
  );
  const clubAPI = new ClubAPI(db, trainerAPI, clubSportLocationAPI);
  const sportAPI = new SportAPI(db);
  const eventAPI = new EventAPI(db);

  await userAPI.createIndexes();
  await sportAPI.createIndexes();
  await subscriptionOptionAPI.createIndexes();
  await subscriptionAPI.createIndexes();
  await trainerAPI.createIndexes();
  await clubAPI.createIndexes();
  await clubSportLocationAPI.createIndexes();

  const server = new ApolloServer({
    schema,
    dataSources: (): DataSources => ({
      userAPI,
      clubAPI,
      sportAPI,
      clubSportLocationAPI,
      trainerAPI,
      eventAPI,
      subscriptionOptionAPI,
      subscriptionAPI,
    }),
    context: authenticationMiddleware(userAPI),
    logger,
  });

  const serverInfo = await server.listen({
    port: SERVER_PORT,
    logger,
  });

  console.log(`Apollo Server is running! Listening on ${serverInfo.url}`);
}

try {
  main();
} catch (e) {
  console.error(e);
}
