import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { Site, User, SiteChatRoom } from '../generated/graphql';

export function parseSiteChatRoom(
  item: Record<string, AttributeValue>,
  site: Site,
  user: User,
): SiteChatRoom {
  return {
    id: item.RoomId.S,
    site,
    user,
    createdAtRFC3339: item.RoomDate.S,
  };
}

export function siteChatRoomToRecord(
  room: SiteChatRoom,
): Record<string, AttributeValue> {
  return {
    RoomId: { S: room.id },
    SiteId: { S: room.site.id },
    RoomUserId: { S: room.user.id },
    RoomDate: { S: room.createdAtRFC3339 },
  };
}
