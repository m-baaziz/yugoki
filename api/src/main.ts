import 'dotenv/config';
import path from 'path';
import { readFileSync } from 'fs';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server';
import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import resolvers from './resolvers';
import { logger } from './logger';
import UserAPI from './datasources/user';
import { _Database, mongoDb, mongoClient, DataSources } from './datasources';
import authenticationMiddleware from './middlewares/context';
import ClubAPI from './datasources/club';
import SportAPI from './datasources/sport';
import SiteAPI from './datasources/site';
import TrainerAPI from './datasources/trainer';
import EventAPI from './datasources/event';
import SubscriptionAPI from './datasources/subscription';
import SubscriptionOptionAPI from './datasources/subscriptionOption';
import FileUploadAPI, { S3Config } from './datasources/fileUpload';

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
  const s3Config: S3Config = {
    bucket: process.env.FILES_BUCKET,
    presignedUrlsValidityPeriod: {
      get: parseInt(process.env.FILES_PRESIGNED_URLS_VALIDITY_PERIOD_GET, 10),
      put: parseInt(process.env.FILES_PRESIGNED_URLS_VALIDITY_PERIOD_PUT, 10),
    },
  };
  const awsConfig = {
    region: process.env.S3_REGION,
  };
  const s3Client = new S3Client({
    ...awsConfig,
  });
  const dynamodbClient = new DynamoDBClient({ ...awsConfig });

  const schema = makeExecutableSchema({
    typeDefs: [DIRECTIVES, typeDefs],
    resolvers,
  });

  const fileUploadAPI = new FileUploadAPI(dynamodbClient, s3Client, s3Config);
  const userAPI = new UserAPI(db, {
    jwtSecret: JWT_SECRET,
    jwtValiditySec: JWT_VALIDITY_SEC,
  });
  const subscriptionOptionAPI = new SubscriptionOptionAPI(dynamodbClient);
  const subscriptionAPI = new SubscriptionAPI(
    dynamodbClient,
    subscriptionOptionAPI,
  );
  const eventAPI = new EventAPI(dynamodbClient, fileUploadAPI);
  const trainerAPI = new TrainerAPI(dynamodbClient, fileUploadAPI);
  const siteAPI = new SiteAPI(
    db,
    subscriptionOptionAPI,
    eventAPI,
    fileUploadAPI,
  );
  const clubAPI = new ClubAPI(
    dynamodbClient,
    trainerAPI,
    siteAPI,
    fileUploadAPI,
  );
  const sportAPI = new SportAPI(dynamodbClient);

  await userAPI.createIndexes();
  await siteAPI.createIndexes();

  const server = new ApolloServer({
    schema,
    dataSources: (): DataSources => ({
      userAPI,
      clubAPI,
      sportAPI,
      siteAPI,
      trainerAPI,
      eventAPI,
      subscriptionOptionAPI,
      subscriptionAPI,
      fileUploadAPI,
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
