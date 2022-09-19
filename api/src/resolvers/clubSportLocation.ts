import { WithId } from 'mongodb';
import { ContextWithDataSources } from '../datasources';
import {
  ClubSportLocation,
  ClubSportLocationPageInfo,
  QueryListClubSportLocationsArgs,
  QueryGetClubSportLocationArgs,
  QuerySearchClubSportLocationsArgs,
  ClubSportLocationDbObject,
} from '../generated/graphql';
import { dbClubSportLocationToClubSportLocation } from '../utils/clubSportLocation';
// import { logger } from '../logger';

export async function listClubSportLocations(
  _parent: unknown,
  { first, after }: QueryListClubSportLocationsArgs,
  {
    dataSources: { clubSportLocationAPI, sportAPI, clubAPI, trainerAPI },
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
        const trainers = await trainerAPI.findTrainersByIds(
          csl.trainers.map((tid) => tid.toString()),
        );
        return dbClubSportLocationToClubSportLocation(
          csl,
          sport,
          club,
          trainers,
        );
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

export async function searchClubSportLocations(
  _parent: unknown,
  {
    query: { sport, address, area },
    first,
    after,
  }: QuerySearchClubSportLocationsArgs,
  {
    dataSources: { clubSportLocationAPI, sportAPI, clubAPI, trainerAPI },
  }: ContextWithDataSources,
): Promise<ClubSportLocationPageInfo> {
  try {
    let [clubSportLocations, hasNextPage]: [
      WithId<ClubSportLocationDbObject>[],
      boolean,
    ] = [[], false];
    if (area) {
      const { topLeftLat, topLeftLon, bottomRightLat, bottomRightLon } = area;
      [clubSportLocations, hasNextPage] =
        await clubSportLocationAPI.listClubSportLocationsBySportAndArea(
          sport,
          topLeftLat,
          topLeftLon,
          bottomRightLat,
          bottomRightLon,
          first,
          after,
        );
    } else if (address) {
      [clubSportLocations, hasNextPage] =
        await clubSportLocationAPI.listClubSportLocationsBySportAndAddress(
          sport,
          address,
          first,
          after,
        );
    }
    const endCursor =
      clubSportLocations.length > 0
        ? clubSportLocations[clubSportLocations.length - 1]._id.toString()
        : undefined;
    const fullClubSportLocations = await Promise.all(
      clubSportLocations.map(async (csl) => {
        const sport = await sportAPI.findSportById(csl.sport.toString());
        const club = await clubAPI.findClubById(csl.club.toString());
        const trainers = await trainerAPI.findTrainersByIds(
          csl.trainers.map((tid) => tid.toString()),
        );
        return dbClubSportLocationToClubSportLocation(
          csl,
          sport,
          club,
          trainers,
        );
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
    dataSources: { clubSportLocationAPI, sportAPI, clubAPI, trainerAPI },
  }: ContextWithDataSources,
): Promise<ClubSportLocation> {
  try {
    const csl = await clubSportLocationAPI.findClubSportLocationById(id);
    const sport = await sportAPI.findSportById(csl.sport.toString());
    const club = await clubAPI.findClubById(csl.club.toString());
    const trainers = await trainerAPI.findTrainersByIds(
      csl.trainers.map((tid) => tid.toString()),
    );
    return dbClubSportLocationToClubSportLocation(csl, sport, club, trainers);
  } catch (e) {
    return Promise.reject(e);
  }
}
