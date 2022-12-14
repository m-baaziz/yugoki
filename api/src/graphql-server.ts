import 'dotenv/config';
import { readFileSync } from 'fs';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';
import { SESv2Client } from '@aws-sdk/client-sesv2';

import resolvers from './resolvers';
import UserAPI from './datasources/user';
import { DataSources } from './datasources';
import ClubAPI from './datasources/club';
import SportAPI from './datasources/sport';
import SiteAPI from './datasources/site';
import TrainerAPI from './datasources/trainer';
import EventAPI from './datasources/event';
import SubscriptionAPI from './datasources/subscription';
import SubscriptionOptionAPI from './datasources/subscriptionOption';
import FileUploadAPI, { S3Config } from './datasources/fileUpload';
import { GraphQLSchema } from 'graphql';
import SiteChatRoomAPI from './datasources/siteChatRoom';
import SiteChatMessageAPI from './datasources/siteChatMessage';
import WsConnectionAPI from './datasources/wsConnection';
import EmailAPI from './datasources/email';

export function getSchema(schemaPath: string): GraphQLSchema {
  const typeDefs = readFileSync(schemaPath).toString('utf-8');
  return makeExecutableSchema({
    typeDefs: [typeDefs],
    resolvers,
  });
}

export function getDatasources(): DataSources {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_VALIDITY_SEC = parseInt(process.env.JWT_VALIDITY_SEC, 10);

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
  const apiGatewayManagementClient = new ApiGatewayManagementApiClient({
    ...awsConfig,
    endpoint: `https://${process.env.WS_API_ID}.execute-api.${process.env.S3_REGION}.amazonaws.com/${process.env.WS_API_STAGE}`,
  });
  const sesClient = new SESv2Client({ ...awsConfig });

  const wsConnectionAPI = new WsConnectionAPI(
    dynamodbClient,
    apiGatewayManagementClient,
  );
  const fileUploadAPI = new FileUploadAPI(dynamodbClient, s3Client, s3Config);
  const userAPI = new UserAPI(
    {
      jwtSecret: JWT_SECRET,
      jwtValiditySec: JWT_VALIDITY_SEC,
    },
    dynamodbClient,
  );
  const subscriptionOptionAPI = new SubscriptionOptionAPI(dynamodbClient);
  const subscriptionAPI = new SubscriptionAPI(
    dynamodbClient,
    subscriptionOptionAPI,
  );
  const eventAPI = new EventAPI(dynamodbClient, fileUploadAPI);
  const trainerAPI = new TrainerAPI(dynamodbClient, fileUploadAPI);
  const siteAPI = new SiteAPI(
    dynamodbClient,
    trainerAPI,
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
  const siteChatRoomAPI = new SiteChatRoomAPI(dynamodbClient, siteAPI, userAPI);
  const siteChatMessageAPI = new SiteChatMessageAPI(dynamodbClient);
  const emailAPI = new EmailAPI(sesClient);

  return {
    userAPI,
    clubAPI,
    sportAPI,
    siteAPI,
    trainerAPI,
    eventAPI,
    subscriptionOptionAPI,
    subscriptionAPI,
    fileUploadAPI,
    siteChatRoomAPI,
    siteChatMessageAPI,
    wsConnectionAPI,
    emailAPI,
  };
}
