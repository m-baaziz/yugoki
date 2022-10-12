import { ContextWithDataSources } from '../datasources';
import { SportPageInfo, QueryListSportsArgs } from '../generated/graphql';
import { dbSportToSport } from '../utils/sport';
import { logger } from '../logger';

export async function listSports(
  _parent: unknown,
  { first, after }: QueryListSportsArgs,
  { dataSources: { sportAPI } }: ContextWithDataSources,
): Promise<SportPageInfo> {
  try {
    const [sports, hasNextPage] = await sportAPI.listSports(first, after);
    const endCursor =
      sports.length > 0 ? sports[sports.length - 1]._id.toString() : undefined;
    return {
      sports: sports.map(dbSportToSport),
      hasNextPage,
      endCursor,
    };
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
