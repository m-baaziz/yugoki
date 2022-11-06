import { AttributeValue } from '@aws-sdk/client-dynamodb';

export type WsConnection = {
  userId: string;
  connectionId: string;
};

export function wsConnectionToRecord(
  wsConnection: WsConnection,
): Record<string, AttributeValue> {
  return {
    UserId: { S: wsConnection.userId },
    ConnectionId: { S: wsConnection.connectionId },
  };
}

export function parseWsConnection(
  item: Record<string, AttributeValue>,
): WsConnection {
  return {
    userId: item.UserId.S,
    connectionId: item.ConnectionId.S,
  };
}
