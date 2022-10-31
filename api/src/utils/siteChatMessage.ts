import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { SiteChatMessage } from '../generated/graphql';

export function parseSiteChatMessage(
  item: Record<string, AttributeValue>,
): SiteChatMessage {
  return {
    id: item.MessageId.S,
    room: item.RoomId.S,
    dateRFC3339: item.MessageDate.S,
    from: item.MessageFrom.S,
    text: item.MessageText.S,
  };
}

export function siteChatMessageToRecord(
  message: SiteChatMessage,
): Record<string, AttributeValue> {
  return {
    MessageId: { S: message.id },
    RoomId: { S: message.room },
    MessageDate: { S: message.dateRFC3339 },
    MessageFrom: { S: message.from },
    MessageText: { S: message.text },
  };
}
