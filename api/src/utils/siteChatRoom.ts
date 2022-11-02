import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { Site, SiteChatRoom } from '../generated/graphql';

export function parseSiteChatRoom(
  item: Record<string, AttributeValue>,
  site: Site,
): SiteChatRoom {
  return {
    id: item.RoomId.S,
    site,
    userId: item.RoomUserId.S,
    createdAtRFC3339: item.RoomDate.S,
  };
}

export function siteChatRoomToRecord(
  room: SiteChatRoom,
): Record<string, AttributeValue> {
  return {
    RoomId: { S: room.id },
    SiteId: { S: room.site.id },
    RoomUserId: { S: room.userId },
    RoomDate: { S: room.createdAtRFC3339 },
  };
}
