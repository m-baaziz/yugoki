import { WithId } from 'mongodb';
import { ContextWithDataSources } from '../datasources';
import {
  ClubSportLocation,
  ClubSportLocationPageInfo,
  QueryListClubSportLocationsArgs,
  QueryGetClubSportLocationArgs,
  QuerySearchClubSportLocationsArgs,
  ClubSportLocationDbObject,
  MutationCreateClubSportLocationArgs,
  MutationDeleteClubSportLocationArgs,
  QueryListClubSportLocationsByClubArgs,
  QueryGetClubSportLocationImagesArgs,
  FileUploadResponse,
} from '../generated/graphql';
import { isUserAuthorized } from '../utils/club';
import { dbClubSportLocationToClubSportLocation } from '../utils/clubSportLocation';
import { logger } from '../logger';
import { dbFileUploadToFileUpload } from '../utils/fileUpload';

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
        try {
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
        } catch (e) {
          return Promise.reject(e);
        }
      }),
    );
    return {
      clubSportLocations: fullClubSportLocations,
      hasNextPage,
      endCursor,
    };
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function listClubSportLocationsByClub(
  _parent: unknown,
  { clubId, first, after }: QueryListClubSportLocationsByClubArgs,
  {
    dataSources: { clubSportLocationAPI, sportAPI, clubAPI, trainerAPI },
  }: ContextWithDataSources,
): Promise<ClubSportLocationPageInfo> {
  try {
    const [clubSportLocations, hasNextPage] =
      await clubSportLocationAPI.listClubSportLocationsByClub(
        clubId,
        first,
        after,
      );
    const endCursor =
      clubSportLocations.length > 0
        ? clubSportLocations[clubSportLocations.length - 1]._id.toString()
        : undefined;
    const fullClubSportLocations = await Promise.all(
      clubSportLocations.map(async (csl) => {
        try {
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
        } catch (e) {
          return Promise.reject(e);
        }
      }),
    );
    return {
      clubSportLocations: fullClubSportLocations,
      hasNextPage,
      endCursor,
    };
  } catch (e) {
    logger.error(e.toString());
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
        try {
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
        } catch (e) {
          return Promise.reject(e);
        }
      }),
    );
    return {
      clubSportLocations: fullClubSportLocations,
      hasNextPage,
      endCursor,
    };
  } catch (e) {
    logger.error(e.toString());
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
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function getClubSportLocationImages(
  _parent: unknown,
  { id }: QueryGetClubSportLocationImagesArgs,
  {
    dataSources: { clubSportLocationAPI, fileUploadAPI },
  }: ContextWithDataSources,
): Promise<FileUploadResponse[]> {
  try {
    const csl = await clubSportLocationAPI.findClubSportLocationById(id);
    const fileUploadResponses = await Promise.all(
      csl.images.map(async (imageId) => {
        try {
          const fileUpload = await fileUploadAPI.findFileUploadById(imageId);
          const url = await fileUploadAPI.generateFileUrlGet(imageId);
          return Promise.resolve({
            file: dbFileUploadToFileUpload(fileUpload),
            url,
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }),
    );
    return Promise.resolve(fileUploadResponses);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function createClubSportLocation(
  _parent: unknown,
  { clubId, input }: MutationCreateClubSportLocationArgs,
  {
    user,
    dataSources: { clubSportLocationAPI, sportAPI, clubAPI, trainerAPI },
  }: ContextWithDataSources,
): Promise<ClubSportLocation> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const club = await clubAPI.findClubById(clubId);
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const sport = await sportAPI.findSportById(input.sportId);
    const csl = await clubSportLocationAPI.createClubSportLocation(
      clubId,
      input.sportId,
      input,
    );
    const trainers = await trainerAPI.findTrainersByIds(
      csl.trainers.map((tid) => tid.toString()),
    );
    return dbClubSportLocationToClubSportLocation(csl, sport, club, trainers);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function deleteClubSportLocation(
  _parent: unknown,
  { id }: MutationDeleteClubSportLocationArgs,
  {
    user,
    dataSources: { clubSportLocationAPI, clubAPI },
  }: ContextWithDataSources,
): Promise<boolean> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const csl = await clubSportLocationAPI.findClubSportLocationById(id);
    const club = await clubAPI.findClubById(csl.club.toString());
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const result = await clubSportLocationAPI.deleteClubSportLocation(id);
    return Promise.resolve(result);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
