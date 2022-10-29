import { ContextWithDataSources } from '../datasources';
import {
  Club,
  ClubPageInfo,
  QueryGetClubArgs,
  MutationCreateClubArgs,
  MutationDeleteClubArgs,
  QueryListUserClubsArgs,
} from '../generated/graphql';
import { isUserAuthorized } from '../utils/club';
import { logger } from '../logger';

export async function listUserClubs(
  _parent: unknown,
  { first, after }: QueryListUserClubsArgs,
  { user, dataSources: { clubAPI } }: ContextWithDataSources,
): Promise<ClubPageInfo> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    if (!user.id) {
      logger.error('Unexpected empty user id');
      return Promise.reject('Internal Server Error');
    }
    return await clubAPI.listUserClubs(user.id, first, after);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function getClub(
  _parent: unknown,
  { id }: QueryGetClubArgs,
  { dataSources: { clubAPI } }: ContextWithDataSources,
): Promise<Club> {
  try {
    return await clubAPI.findClubById(id);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function createClub(
  _parent: unknown,
  { name }: MutationCreateClubArgs,
  { user, dataSources: { clubAPI } }: ContextWithDataSources,
): Promise<Club> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    if (!user.id) {
      logger.error('Unexpected empty user id');
      return Promise.reject('Internal Server Error');
    }
    return await clubAPI.createClub(user.id, name);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function deleteClub(
  _parent: unknown,
  { id }: MutationDeleteClubArgs,
  { user, dataSources: { clubAPI } }: ContextWithDataSources,
): Promise<boolean> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const club = await clubAPI.findClubById(id);
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const result = await clubAPI.deleteClub(id);
    return Promise.resolve(result);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
