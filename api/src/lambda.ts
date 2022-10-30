import 'dotenv/config';
import path from 'path';
import { ApolloServer } from 'apollo-server-lambda';

import { getDatasources, getSchema } from './server';
import authenticationMiddleware from './middlewares/context';
import { logger } from './logger';

const SCHEMA_PATH = path.join(__dirname, './schema.graphql');
const schema = getSchema(SCHEMA_PATH);
const dataSources = getDatasources();

const server = new ApolloServer({
  schema,
  dataSources: () => dataSources,
  context: ({ express }) =>
    authenticationMiddleware(dataSources.userAPI)(express),
  logger,
  cache: 'bounded',
  csrfPrevention: true,
});

module.exports.graphqlHandler = server.createHandler({
  expressGetMiddlewareOptions: {
    cors: {
      origin: '*',
      credentials: true,
    },
  },
});
