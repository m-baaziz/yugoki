import { ContextWithDataSources } from '../datasources';
import {
  QueryListSiteChatMessagesArgs,
  SiteChatMessagePageInfo,
  MutationCreateSiteChatMessageArgs,
  SiteChatMessage,
  MutationDeleteSiteChatMessageArgs,
  MutationCreateSiteChatRoomAndMessageArgs,
  SiteChatRoom,
} from '../generated/graphql';
import { isUserAuthorized } from '../utils/club';
import { logger } from '../logger';

export async function listSiteChatMessages(
  _parent: unknown,
  { roomId, first, after }: QueryListSiteChatMessagesArgs,
  {
    user,
    dataSources: { siteAPI, siteChatRoomAPI, siteChatMessageAPI },
  }: ContextWithDataSources,
): Promise<SiteChatMessagePageInfo> {
  try {
    const room = await siteChatRoomAPI.findSiteChatRoomById(roomId);
    if (room.user.id !== user.id) {
      const site = await siteAPI.findSiteById(room.site.id);
      if (!isUserAuthorized(site.club, user)) {
        return Promise.reject('Unauthorized');
      }
    }
    return await siteChatMessageAPI.listSiteChatMessages(roomId, first, after);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function createSiteChatMessage(
  _parent: unknown,
  { roomId, text }: MutationCreateSiteChatMessageArgs,
  {
    user,
    dataSources: { siteAPI, siteChatRoomAPI, siteChatMessageAPI },
  }: ContextWithDataSources,
): Promise<SiteChatMessage> {
  try {
    const room = await siteChatRoomAPI.findSiteChatRoomById(roomId);
    if (room.user.id !== user.id) {
      const site = await siteAPI.findSiteById(room.site.id);
      if (!isUserAuthorized(site.club, user)) {
        return Promise.reject('Unauthorized');
      }
    }
    return await siteChatMessageAPI.createSiteChatMessage(
      roomId,
      user.id,
      text,
    );
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function createSiteChatRoomAndMessage(
  _parent: unknown,
  { siteId, text }: MutationCreateSiteChatRoomAndMessageArgs,
  {
    user,
    dataSources: { siteAPI, siteChatRoomAPI, siteChatMessageAPI },
  }: ContextWithDataSources,
): Promise<SiteChatRoom> {
  try {
    const existingRooms = await siteChatRoomAPI.listUserSiteChatRooms(
      user.id,
      1,
    );
    const room =
      existingRooms.siteChatRooms.length > 0
        ? existingRooms.siteChatRooms[0]
        : await siteChatRoomAPI.createSiteChatRoom(siteId, user);
    if (room.user.id !== user.id) {
      const site = await siteAPI.findSiteById(room.site.id);
      if (!isUserAuthorized(site.club, user)) {
        return Promise.reject('Unauthorized');
      }
    }
    await siteChatMessageAPI.createSiteChatMessage(room.id, user.id, text);
    return Promise.resolve(room);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function deleteSiteChatMessage(
  _parent: unknown,
  { roomId, id }: MutationDeleteSiteChatMessageArgs,
  { user, dataSources: { siteChatMessageAPI } }: ContextWithDataSources,
): Promise<boolean> {
  try {
    const message = await siteChatMessageAPI.findSiteChatMessageById(
      roomId,
      id,
    );
    if (message.from !== user.id) {
      return Promise.reject('Unauthorized');
    }
    return await siteChatMessageAPI.deleteSiteChatMessage(roomId, id);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
