import { ContextWithDataSources } from '../datasources';
import {
  SportPageInfo,
  QueryListSportsArgs,
  MutationDeleteSportArgs,
  MutationCreateSportArgs,
  Sport,
} from '../generated/graphql';
import { logger } from '../logger';

export async function listSports(
  _parent: unknown,
  { first, after }: QueryListSportsArgs,
  { dataSources: { sportAPI } }: ContextWithDataSources,
): Promise<SportPageInfo> {
  try {
    return await sportAPI.listSports(first, after);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function createSport(
  _parent: unknown,
  { input }: MutationCreateSportArgs,
  { user, dataSources: { sportAPI } }: ContextWithDataSources,
): Promise<Sport> {
  try {
    if (!user || user.email !== 'admin@db.com') {
      return Promise.reject('Unauthorized');
    }
    return await sportAPI.createSport(input);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function deleteSport(
  _parent: unknown,
  { id }: MutationDeleteSportArgs,
  { user, dataSources: { sportAPI } }: ContextWithDataSources,
): Promise<boolean> {
  try {
    if (!user || user.email !== 'admin@db.com') {
      return Promise.reject('Unauthorized');
    }
    return await sportAPI.deleteSport(id);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
