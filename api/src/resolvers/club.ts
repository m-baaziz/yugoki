import { ContextWithDataSources } from '../datasources';
import {
  Club,
  ClubPageInfo,
  QueryListClubsArgs,
  QueryGetClubArgs,
} from '../generated/graphql';
import { dbClubToClub } from '../utils/club';
// import { logger } from '../logger';

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
    return Promise.reject(e);
  }
}
