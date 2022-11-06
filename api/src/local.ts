import 'dotenv/config';
import path from 'path';
import { ApolloServer } from 'apollo-server';
import { logger } from './logger';
import authenticationMiddleware from './middlewares/context';
import { getDatasources, getSchema } from './graphql-server';

async function main() {
  const SERVER_PORT = parseInt(process.env.SERVER_PORT, 10) || 4000;
  const SCHEMA_PATH = path.join(__dirname, '../schema.graphql');
  const schema = getSchema(SCHEMA_PATH);
  const dataSources = getDatasources();

  const server = new ApolloServer({
    schema,
    dataSources: () => dataSources,
    context: authenticationMiddleware(dataSources.userAPI),
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
