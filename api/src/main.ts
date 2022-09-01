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
  const clubAPI = new ClubAPI(db);
  const sportAPI = new SportAPI(db);
  const clubSportLocationAPI = new ClubSportLocationAPI(db);

  await userAPI.createIndexes();
  await sportAPI.createIndexes();
  await clubAPI.createIndexes();
  await clubSportLocationAPI.createIndexes();

  const server = new ApolloServer({
    schema,
    dataSources: (): DataSources => ({
      userAPI,
      clubAPI,
      sportAPI,
      clubSportLocationAPI,
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
