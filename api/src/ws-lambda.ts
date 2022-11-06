import 'dotenv/config';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { logger } from './logger';
import { getDatasources } from './graphql-server';

const datasources = getDatasources();

async function connectHandler(
  event: APIGatewayProxyEvent,
): Promise<
  AWSLambda.APIGatewayProxyResult | AWSLambda.APIGatewayProxyStructuredResultV2
> {
  try {
    logger.info('in connect handler');
    const body = JSON.parse(event.body);
    logger.info(`connect body = ${body}`);
    const token = body.token;
    logger.info(`connect token = ${token}`);
    if (!token) {
      return {
        statusCode: 403,
        body: 'Unauthorized',
      };
    }
    const user = await datasources.userAPI.verifyToken(token);
    logger.info(`verified user = ${user.email}`);
    await datasources.wsConnectionAPI.createWsConnection(
      user.id,
      event.requestContext.connectionId,
    );
    logger.info('created ws connection');
    return { statusCode: 200, body: 'Success' };
  } catch (e) {
    return Promise.reject(e);
  }
}

async function disconnectHandler(
  event: APIGatewayProxyEvent,
): Promise<
  AWSLambda.APIGatewayProxyResult | AWSLambda.APIGatewayProxyStructuredResultV2
> {
  try {
    logger.info('disconnect handler');
    await datasources.wsConnectionAPI.deleteWsConnectionsByConnectionId(
      event.requestContext.connectionId,
    );
    logger.info('deleted ws connection');
    return { statusCode: 200, body: 'Success' };
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports.wsHandler = async (
  event: APIGatewayProxyEvent,
): Promise<
  AWSLambda.APIGatewayProxyResult | AWSLambda.APIGatewayProxyStructuredResultV2
> => {
  try {
    logger.info(
      `Websocket handler called with event body = ${JSON.stringify(
        event.body,
      )} and headers = ${JSON.stringify(event.headers)}`,
    );
    if (!event.body) {
      // don't block inital connections
      return { statusCode: 200 };
    }
    const body = JSON.parse(event.body);
    const action = body.action as string;

    if (action === 'connect') return await connectHandler(event);
    if (action === 'disconnect') return await disconnectHandler(event);
    return { statusCode: 404, body: 'Not found' };
  } catch (e) {
    logger.error(`Error: ${e}`);
    return { statusCode: 400, body: e.toString() };
  }
};
