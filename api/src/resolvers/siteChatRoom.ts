import { ContextWithDataSources } from '../datasources';
import {
  QueryListSiteChatRoomsArgs,
  SiteChatRoomPageInfo,
  QueryListUserSiteChatRoomsArgs,
  MutationCreateSiteChatRoomArgs,
  SiteChatRoom,
  MutationDeleteSiteChatRoomArgs,
} from '../generated/graphql';
import { isUserAuthorized } from '../utils/club';
import { logger } from '../logger';

export async function listSiteChatRooms(
  _parent: unknown,
  { siteId, first, after }: QueryListSiteChatRoomsArgs,
  {
    user,
    dataSources: { siteAPI, clubAPI, siteChatRoomAPI },
  }: ContextWithDataSources,
): Promise<SiteChatRoomPageInfo> {
  try {
    const site = await siteAPI.findSiteById(siteId);
    const club = await clubAPI.findClubById(site.club.id);
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    return await siteChatRoomAPI.listSiteChatRooms(siteId, first, after);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function listUserSiteChatRooms(
  _parent: unknown,
  { first, after }: QueryListUserSiteChatRoomsArgs,
  { user, dataSources: { siteChatRoomAPI } }: ContextWithDataSources,
): Promise<SiteChatRoomPageInfo> {
  try {
    return await siteChatRoomAPI.listUserSiteChatRooms(user.id, first, after);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function createSiteChatRoom(
  _parent: unknown,
  { siteId }: MutationCreateSiteChatRoomArgs,
  {
    user,
    dataSources: { siteAPI, clubAPI, siteChatRoomAPI },
  }: ContextWithDataSources,
): Promise<SiteChatRoom> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const site = await siteAPI.findSiteById(siteId);
    const club = await clubAPI.findClubById(site.club.id);
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    return await siteChatRoomAPI.createSiteChatRoom(siteId, user.id);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function deleteSiteChatRoom(
  _parent: unknown,
  { id }: MutationDeleteSiteChatRoomArgs,
  { user, dataSources: { siteAPI, siteChatRoomAPI } }: ContextWithDataSources,
): Promise<boolean> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const chatRoom = await siteChatRoomAPI.findSiteChatRoomById(id);
    const site = await siteAPI.findSiteById(chatRoom.site.id);
    if (!isUserAuthorized(site.club, user)) {
      return Promise.reject('Unauthorized');
    }
    return await siteChatRoomAPI.deleteSiteChatRoom(id);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
