import { ContextWithDataSources } from '../datasources';
import {
  Site,
  SitePageInfo,
  QueryListSitesArgs,
  QueryGetSiteArgs,
  QuerySearchSitesArgs,
  MutationCreateSiteArgs,
  MutationDeleteSiteArgs,
  QueryListSitesByClubArgs,
  QueryGetSiteImagesArgs,
  FileUploadResponse,
} from '../generated/graphql';
import { isUserAuthorized } from '../utils/club';
import { dbSiteToSite } from '../utils/site';
import { logger } from '../logger';
import { dbFileUploadToFileUpload } from '../utils/fileUpload';

export async function listSites(
  _parent: unknown,
  { first, after }: QueryListSitesArgs,
  {
    dataSources: { siteAPI, sportAPI, clubAPI, trainerAPI },
  }: ContextWithDataSources,
): Promise<SitePageInfo> {
  try {
    const [sites, hasNextPage] = await siteAPI.listSites(first, after);
    const endCursor =
      sites.length > 0 ? sites[sites.length - 1]._id.toString() : undefined;
    const fullSites = await Promise.all(
      sites.map(async (csl) => {
        try {
          const sport = await sportAPI.findSportById(csl.sport.toString());
          const club = await clubAPI.findClubById(csl.club.toString());
          const trainers = await trainerAPI.findTrainersByIds(
            csl.trainers.map((tid) => tid.toString()),
          );
          return dbSiteToSite(csl, sport, club, trainers);
        } catch (e) {
          return Promise.reject(e);
        }
      }),
    );
    return {
      sites: fullSites,
      hasNextPage,
      endCursor,
    };
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function listSitesByClub(
  _parent: unknown,
  { clubId, first, after }: QueryListSitesByClubArgs,
  {
    dataSources: { siteAPI, sportAPI, clubAPI, trainerAPI },
  }: ContextWithDataSources,
): Promise<SitePageInfo> {
  try {
    const [sites, hasNextPage] = await siteAPI.listSitesByClub(
      clubId,
      first,
      after,
    );
    const endCursor =
      sites.length > 0 ? sites[sites.length - 1]._id.toString() : undefined;
    const fullSites = await Promise.all(
      sites.map(async (csl) => {
        try {
          const sport = await sportAPI.findSportById(csl.sport.toString());
          const club = await clubAPI.findClubById(csl.club.toString());
          const trainers = await trainerAPI.findTrainersByIds(
            csl.trainers.map((tid) => tid.toString()),
          );
          return dbSiteToSite(csl, sport, club, trainers);
        } catch (e) {
          return Promise.reject(e);
        }
      }),
    );
    return {
      sites: fullSites,
      hasNextPage,
      endCursor,
    };
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function searchSites(
  _parent: unknown,
  { query: { sport, address, area }, first, after }: QuerySearchSitesArgs,
  {
    dataSources: { siteAPI, sportAPI, clubAPI, trainerAPI },
  }: ContextWithDataSources,
): Promise<SitePageInfo> {
  try {
    let [sites, hasNextPage] = [[], false];
    if (area) {
      const { topLeftLat, topLeftLon, bottomRightLat, bottomRightLon } = area;
      [sites, hasNextPage] = await siteAPI.listSitesBySportAndArea(
        sport,
        topLeftLat,
        topLeftLon,
        bottomRightLat,
        bottomRightLon,
        first,
        after,
      );
    } else if (address) {
      [sites, hasNextPage] = await siteAPI.listSitesBySportAndAddress(
        sport,
        address,
        first,
        after,
      );
    }
    const endCursor =
      sites.length > 0 ? sites[sites.length - 1]._id.toString() : undefined;
    const fullSites = await Promise.all(
      sites.map(async (csl) => {
        try {
          const sport = await sportAPI.findSportById(csl.sport.toString());
          const club = await clubAPI.findClubById(csl.club.toString());
          const trainers = await trainerAPI.findTrainersByIds(
            csl.trainers.map((tid) => tid.toString()),
          );
          return dbSiteToSite(csl, sport, club, trainers);
        } catch (e) {
          return Promise.reject(e);
        }
      }),
    );
    return {
      sites: fullSites,
      hasNextPage,
      endCursor,
    };
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function getSite(
  _parent: unknown,
  { id }: QueryGetSiteArgs,
  {
    dataSources: { siteAPI, sportAPI, clubAPI, trainerAPI },
  }: ContextWithDataSources,
): Promise<Site> {
  try {
    const csl = await siteAPI.findSiteById(id);
    const sport = await sportAPI.findSportById(csl.sport.toString());
    const club = await clubAPI.findClubById(csl.club.toString());
    const trainers = await trainerAPI.findTrainersByIds(
      csl.trainers.map((tid) => tid.toString()),
    );
    return dbSiteToSite(csl, sport, club, trainers);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function getSiteImages(
  _parent: unknown,
  { id }: QueryGetSiteImagesArgs,
  { dataSources: { siteAPI, fileUploadAPI } }: ContextWithDataSources,
): Promise<FileUploadResponse[]> {
  try {
    const csl = await siteAPI.findSiteById(id);
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

export async function createSite(
  _parent: unknown,
  { clubId, input }: MutationCreateSiteArgs,
  {
    user,
    dataSources: { siteAPI, sportAPI, clubAPI, trainerAPI },
  }: ContextWithDataSources,
): Promise<Site> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const club = await clubAPI.findClubById(clubId);
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const sport = await sportAPI.findSportById(input.sportId);
    const csl = await siteAPI.createSite(clubId, input.sportId, input);
    const trainers = await trainerAPI.findTrainersByIds(
      csl.trainers.map((tid) => tid.toString()),
    );
    return dbSiteToSite(csl, sport, club, trainers);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}

export async function deleteSite(
  _parent: unknown,
  { id }: MutationDeleteSiteArgs,
  { user, dataSources: { siteAPI, clubAPI } }: ContextWithDataSources,
): Promise<boolean> {
  try {
    if (!user) {
      return Promise.reject('Unauthorized');
    }
    const csl = await siteAPI.findSiteById(id);
    const club = await clubAPI.findClubById(csl.club.toString());
    if (!isUserAuthorized(club, user)) {
      return Promise.reject('Unauthorized');
    }
    const result = await siteAPI.deleteSite(id);
    return Promise.resolve(result);
  } catch (e) {
    logger.error(e.toString());
    return Promise.reject(e);
  }
}
