import { ContextWithDataSources } from '../datasources';
import {
  Club,
  ClubPageInfo,
  QueryListClubsArgs,
  QueryGetClubArgs,
  MutationCreateClubArgs,
  MutationDeleteClubArgs,
} from '../generated/graphql';
import { dbClubToClub, isUserAuthorized } from '../utils/club';
import { logger } from '../logger';

export async function listClubs(
  _parent: unknown,
  { first, after }: QueryListClubsArgs,
  { dataSources: { clubAPI } }: ContextWithDataSources,
): Promise<ClubPageInfo> {
  try {
    const [clubs, hasNextPage] = await clubAPI.listClubs(first, after);
    const endCursor =
      clubs.length > 0 ? clubs[clubs.length - 1]._id.toString() : undefined;
    return {
      clubs: clubs.map(dbClubToClub),
      hasNextPage,
      endCursor,
    };
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function listUserClubs(
  _parent: unknown,
  { first, after }: QueryListClubsArgs,
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
    const [clubs, hasNextPage] = await clubAPI.listUserClubs(
      user.id,
      first,
      after,
    );
    const endCursor =
      clubs.length > 0 ? clubs[clubs.length - 1]._id.toString() : undefined;
    return {
      clubs: clubs.map(dbClubToClub),
      hasNextPage,
      endCursor,
    };
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
    const club = await clubAPI.findClubById(id);
    return Promise.resolve(dbClubToClub(club));
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
    const club = await clubAPI.createClub(user.id, name);
    return Promise.resolve(dbClubToClub(club));
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
