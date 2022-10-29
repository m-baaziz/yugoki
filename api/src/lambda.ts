import 'dotenv/config';
import path from 'path';
import { logger } from './logger';
import { createApolloServer } from './server';

async function main() {
  const SERVER_PORT = parseInt(process.env.SERVER_PORT, 10) || 4000;
  const SCHEMA_PATH = path.join(__dirname, './schema.graphql');
  const server = createApolloServer(SCHEMA_PATH);

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
