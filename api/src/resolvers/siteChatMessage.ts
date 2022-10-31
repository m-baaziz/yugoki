import { ContextWithDataSources } from '../datasources';
import {
  QueryListSiteChatMessagesArgs,
  SiteChatMessagePageInfo,
  MutationCreateSiteChatMessageArgs,
  SiteChatMessage,
  MutationDeleteSiteChatMessageArgs,
} from '../generated/graphql';
import { isUserAuthorized } from '../utils/club';
import { logger } from '../logger';

export async function listSiteChatMessages(
  _parent: unknown,
  { roomId, first, after }: QueryListSiteChatMessagesArgs,
  {
    user,
    dataSources: { siteAPI, clubAPI, siteChatRoomAPI, siteChatMessageAPI },
  }: ContextWithDataSources,
): Promise<SiteChatMessagePageInfo> {
  try {
    const room = await siteChatRoomAPI.findSiteChatRoomById(roomId);
    if (room.userId !== user.id) {
      const site = await siteAPI.findSiteById(room.site);
      const club = await clubAPI.findClubById(site.club.id);
      if (!isUserAuthorized(club, user)) {
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
  { roomId, input }: MutationCreateSiteChatMessageArgs,
  {
    user,
    dataSources: { siteAPI, clubAPI, siteChatRoomAPI, siteChatMessageAPI },
  }: ContextWithDataSources,
): Promise<SiteChatMessage> {
  try {
    const room = await siteChatRoomAPI.findSiteChatRoomById(roomId);
    if (room.userId !== user.id) {
      const site = await siteAPI.findSiteById(room.site);
      const club = await clubAPI.findClubById(site.club.id);
      if (!isUserAuthorized(club, user)) {
        return Promise.reject('Unauthorized');
      }
    }
    return await siteChatMessageAPI.createSiteChatMessage(roomId, input);
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
