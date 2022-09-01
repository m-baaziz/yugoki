import { ContextWithDataSources } from '../datasources';
import {
  ClubSportLocation,
  ClubSportLocationPageInfo,
  QueryListClubSportLocationsArgs,
  QueryGetClubSportLocationArgs,
  QueryListClubSportLocationsBySportAndAreaArgs,
  QueryListClubSportLocationsBySportAndAddressArgs,
} from '../generated/graphql';
import { dbClubSportLocationToClubSportLocation } from '../utils/clubSportLocation';
// import { logger } from '../logger';

export async function listClubSportLocations(
  _parent: unknown,
  { first, after }: QueryListClubSportLocationsArgs,
  {
    dataSources: { clubSportLocationAPI, sportAPI, clubAPI },
  }: ContextWithDataSources,
): Promise<ClubSportLocationPageInfo> {
  try {
    const [clubSportLocations, hasNextPage] =
      await clubSportLocationAPI.listClubSportLocations(first, after);
    const endCursor =
      clubSportLocations.length > 0
        ? clubSportLocations[clubSportLocations.length - 1]._id.toString()
        : undefined;
    const fullClubSportLocations = await Promise.all(
      clubSportLocations.map(async (csl) => {
        const sport = await sportAPI.findSportById(csl.sport.toString());
        const club = await clubAPI.findClubById(csl.club.toString());
        return dbClubSportLocationToClubSportLocation(csl, sport, club);
      }),
    );
    return {
      clubSportLocations: fullClubSportLocations,
      hasNextPage,
      endCursor,
    };
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function listClubSportLocationsBySportAndArea(
  _parent: unknown,
  {
    sport,
    topLeftLat,
    topLeftLon,
    bottomRightLat,
    bottomRightLon,
    first,
    after,
  }: QueryListClubSportLocationsBySportAndAreaArgs,
  {
    dataSources: { clubSportLocationAPI, sportAPI, clubAPI },
  }: ContextWithDataSources,
): Promise<ClubSportLocationPageInfo> {
  try {
    const [clubSportLocations, hasNextPage] =
      await clubSportLocationAPI.listClubSportLocationsBySportAndArea(
        sport,
        topLeftLat,
        topLeftLon,
        bottomRightLat,
        bottomRightLon,
        first,
        after,
      );
    const endCursor =
      clubSportLocations.length > 0
        ? clubSportLocations[clubSportLocations.length - 1]._id.toString()
        : undefined;
    const fullClubSportLocations = await Promise.all(
      clubSportLocations.map(async (csl) => {
        const sport = await sportAPI.findSportById(csl.sport.toString());
        const club = await clubAPI.findClubById(csl.club.toString());
        return dbClubSportLocationToClubSportLocation(csl, sport, club);
      }),
    );
    return {
      clubSportLocations: fullClubSportLocations,
      hasNextPage,
      endCursor,
    };
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function listClubSportLocationsBySportAndAddress(
  _parent: unknown,
  {
    sport,
    address,
    first,
    after,
  }: QueryListClubSportLocationsBySportAndAddressArgs,
  {
    dataSources: { clubSportLocationAPI, sportAPI, clubAPI },
  }: ContextWithDataSources,
): Promise<ClubSportLocationPageInfo> {
  try {
    const [clubSportLocations, hasNextPage] =
      await clubSportLocationAPI.listClubSportLocationsBySportAndAddress(
        sport,
        address,
        first,
        after,
      );
    const endCursor =
      clubSportLocations.length > 0
        ? clubSportLocations[clubSportLocations.length - 1]._id.toString()
        : undefined;
    const fullClubSportLocations = await Promise.all(
      clubSportLocations.map(async (csl) => {
        const sport = await sportAPI.findSportById(csl.sport.toString());
        const club = await clubAPI.findClubById(csl.club.toString());
        return dbClubSportLocationToClubSportLocation(csl, sport, club);
      }),
    );
    return {
      clubSportLocations: fullClubSportLocations,
      hasNextPage,
      endCursor,
    };
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function getClubSportLocation(
  _parent: unknown,
  { id }: QueryGetClubSportLocationArgs,
  {
    dataSources: { clubSportLocationAPI, sportAPI, clubAPI },
  }: ContextWithDataSources,
): Promise<ClubSportLocation> {
  try {
    const csl = await clubSportLocationAPI.findClubSportLocationById(id);
    const sport = await sportAPI.findSportById(csl.sport.toString());
    const club = await clubAPI.findClubById(csl.club.toString());
    return dbClubSportLocationToClubSportLocation(csl, sport, club);
  } catch (e) {
    return Promise.reject(e);
  }
}
