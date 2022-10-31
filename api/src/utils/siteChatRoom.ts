import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { SiteChatRoom } from '../generated/graphql';

export function parseSiteChatRoom(
  item: Record<string, AttributeValue>,
): SiteChatRoom {
  return {
    id: item.RoomId.S,
    site: item.SiteId.S,
    userId: item.RoomUserId.S,
    createdAtRFC3339: item.RoomDate.S,
  };
}

export function siteChatRoomToRecord(
  room: SiteChatRoom,
): Record<string, AttributeValue> {
  return {
    RoomId: { S: room.id },
    SiteId: { S: room.site },
    RoomUserId: { S: room.userId },
    RoomDate: { S: room.createdAtRFC3339 },
  };
}
